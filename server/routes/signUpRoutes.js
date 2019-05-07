const mongoose = require("mongoose")
const User = mongoose.model("users")
const Token = mongoose.model("verifTokens")
const pick = require("lodash.pick")
const { userInputCheck } = require("../helpers/middleware")
const { sendTokenEmail } = require("../helpers/help_functions")

module.exports = app => {
  app.post("/api/signup", userInputCheck, async (req, res) => {
    if (req.user) return res.redirect("/dashboard")
    const { userData } = res.locals
    try {
      const user = await new User({
        name: userData.name,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        city: userData.city,
        email: userData.email,
        password: userData.password
      }).save()
      sendTokenEmail(req, user, { type: "verifToken", email: user.email })
      req.login(user, loginErr => {
        if (loginErr) {
          throw loginErr
        }
      })
      return res.send({
        success: true,
        message: req.user
      })
    } catch (error) {
      return res.send({
        success: false,
        message: error.message
      })
    }
  })

  app.get("/api/resendToken", async (req, res) => {
    const { user } = req
    if (!user) {
      return res.status(404).send({
        success: false
      })
    }
    if (user.isConfirmed) {
      return res.status(404)
    }
    try {
      await Token.findOneAndRemove({ _userId: user._id })
      sendTokenEmail(req, user, { type: "verifToken", email: user.email })
      return res.status(200).send({
        success: true
      })
    } catch (error) {
      return res.status(404).send(error.message)
    }
  })

  app.get("/api/confirmation/:token", async (req, res) => {
    if (!req.user) {
      return res.status(404).send({
        success: false
      })
    }
    try {
      const token = await Token.findByToken(req.params.token)
      const user = await User.findById(token._userId)
      if (!user) {
        return res
          .status(400)
          .send("We were unable to find a user for this token.")
      }
      if (user.isConfirmed) {
        return res.status(400).send("This user has already been verified.")
      }
      user.isConfirmed = true
      await Promise.all([
        user.save(),
        Token.findOneAndRemove({ _id: token._id })
      ])
      return res.redirect("/dashboard")
    } catch (error) {
      return res.status(404).send(error)
    }
  })

  app.post("/api/confirmation", async (req, res) => {
    const userData = pick(req.body, ["pin"])
    const pin = userData.pin
    if (!pin) {
      return res.status(404).send({
        success: false,
        message: "Enter your pin"
      })
    }
    if (!req.user) {
      return res.status(404).send({
        success: false,
        message: "Not authorized"
      })
    }
    if (req.user.isConfirmed) {
      return res.status(200).send({
        success: true,
        message: "Already confirmed"
      })
    }

    try {
      const token = await Token.findByPin(pin)
      const user = await User.findById(token._userId)
      if (!user) {
        return res.status(400).send({
          success: false,
          message: "We were unable to find a user for this token."
        })
      }
      if (user.isConfirmed) {
        return res.status(400).send("This user has already been verified.")
      }
      user.isConfirmed = true
      const [newUser, ...rest] = Promise.all([
        user.save(),
        Token.findOneAndRemove({ _id: token._id })
      ])

      return res.status(200).send({
        success: true,
        message: newUser
      })
    } catch (error) {
      return res.send({
        success: false,
        message: error.message
      })
    }
  })
}
