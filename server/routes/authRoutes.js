const mongoose = require("mongoose")
const User = mongoose.model("users")
const Token = mongoose.model("verifTokens")
const passport = require("passport")
const { loggedIn } = require("../helpers/middleware")
const omit = require("lodash.omit")
const pick = require("lodash.pick")
const { sendTokenEmail } = require("../helpers/help_functions")

module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  )

  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  )

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
      if (req.user) {
        res.redirect("/dashboard")
      }
    }
  )

  app.post("/api/login", (req, res, next) => {
    if (req.user) return res.redirect("/dashboard")
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.json({ success: false, message: info.message })
      }
      req.login(user, loginErr => {
        if (loginErr) {
          return next(loginErr)
        }
        user.password = undefined
        user.__v = undefined
        const editedUser = omit(user, ["password"], ["__v"])
        return res.send({ success: true, message: editedUser })
      })
    })(req, res, next)
  })

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      if (req.user) {
        res.redirect("/dashboard")
      }
    }
  )

  app.post("/api/reset_password_email", async (req, res) => {
    const userData = pick(req.body, ["email"])
    const { email } = userData
    try {
      if (!email) {
        throw new Error("Please complete the form")
      }
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error("No user with this email")
      }
      const token = await Token.findOne({ _userId: user._id })
      await sendTokenEmail(req, user, { type: "resetPassword", email, token })
      return res.send({
        success: true
      })
    } catch (error) {
      return res.send({
        success: false,
        message: error.message
      })
    }
  })

  app.post("/api/reset_password/", async (req, res) => {
    try {
      const { token, password, repPassword } = req.body
      if (!token || !password || !repPassword) {
        throw new Error("Please complete the form")
      }
      if (password !== repPassword) {
        throw new Error("Passwords don't match")
      }
      const userToken = await Token.findByToken(token)
      if (!userToken) {
        throw new Error("Token is not valid")
      }
      const user = await User.findById(userToken._userId)
      if (!user) {
        throw new Error("We were unable to find a user for this token.")
      }
      user.password = password
      await user.save()

      req.login(user, loginErr => {
        if (loginErr) {
          throw loginErr
        }
      })
      res.send({
        success: true,
        message: req.user
      })
      await Token.findOneAndRemove({ _id: userToken._id })
      return
    } catch (error) {
      return res.send({
        success: false,
        message: error.message
      })
    }
  })

  app.get("/api/logout", (req, res) => {
    req.logout()
    req.session.destroy()
    res.send({ success: true })
  })

  app.get("/api/current_user", loggedIn, (req, res) => {
    res.send(req.user)
  })
}
