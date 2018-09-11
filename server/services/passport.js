const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = mongoose.model('users');

//user came from done
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if(err) {
      console.error('There was an error accessing the records of' +
      ' user with id: ' + id);
      return console.log(err.message);
    }
    done(err, user);
  })
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'email', 'gender', 'link', 'name', 'picture.width(500).height(500)', 'birthday']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({'facebook.facebookId': profile.id});
      if(user) return done(null, user);
      const newUser = await new User({
      'facebook.facebookId': profile.id,
      'facebook.facebookEmail': profile.emails && profile.emails.length ? profile.emails[0].value : '',
       firstName: profile.name && profile.name.givenName,
       lastName: profile.name && profile.name.familyName,
       photos: profile.photos,
       gender: profile.gender
    }).save();
    done(null, newUser);
    } catch(err) {
        done(err, false);
     }
  }));


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
   const user = await User.findOne({'google.googleId': profile.id});
   if(user) return done(null, user);
   const newUser = await new User({
    'google.googleId': profile.id,
    'google.googleEmail': profile.emails && profile.emails.length ? profile.emails[0].value : '',
    firstName: profile.name && profile.name.givenName,
    lastName: profile.name && profile.name.familyName,
    photos: profile.photos
   }).save();
   done(null, newUser);
 } catch(err) {
    done(err, false);
}
}));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  debugger;
  User.findByCredentials(email, password)
  .then( user => done(null, user) )
  .catch( err => done(null, false, { message: err }) );
  })


);
