const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = mongoose.model("users");

//user came from done
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findOne({_id: id}, {password: 0, __v: 0});
    if (!user) {
      return done(new Error("user not found"));
    }
    done(null, user);
  } catch (e) {
    done(e.message);
  }
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: [
        "id",
        "email",
        "gender",
        "link",
        "name",
        "picture.width(500).height(500)",
        "birthday"
      ],
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({"facebook.facebookId": profile.id});
        if (user) return done(null, user);
        const newUser = await new User({
          email:
            profile.emails && profile.emails.length
              ? profile.emails[0].value
              : "",
          "facebook.facebookId": profile.id,
          "facebook.facebookEmail":
            profile.emails && profile.emails.length
              ? profile.emails[0].value
              : "",
          name: profile.name && profile.name.givenName,
          photos: profile.photos.length && profile.photos[0].value,
          gender: profile.gender,
          isConfirmed: true,
          isOauth: true
        }).save();
        done(null, newUser);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({"google.googleId": profile.id});
        if (user) return done(null, user);
        const newUser = await new User({
          email:
            profile.emails && profile.emails.length
              ? profile.emails[0].value
              : "",
          "google.googleId": profile.id,
          "google.googleEmail":
            profile.emails && profile.emails.length
              ? profile.emails[0].value
              : "",
          name: profile.name && profile.name.givenName,
          photos: profile.photos.length && profile.photos[0].value,
          isConfirmed: true,
          isOauth: true
        }).save();
        done(null, newUser);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await User.findByCredentials(email, password);
        done(null, user);
      } catch (err) {
        done(null, false, {message: err.message});
      }
    }
  )
);
