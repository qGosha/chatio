const passport = require('passport');
const loggedIn = require('../helpers/middleware');
const _ = require('lodash');

module.exports = (app) => {

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

  app.get('/auth/facebook/callback',
  passport.authenticate('facebook'), (req, res) => {
    if(req.user) {
      res.redirect('/dashboard');
    }
  });

  app.post('/api/login', (req, res, next) => {
    if(req.user) return res.redirect('/dashboard');
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) { return res.json( { success : false, message: info.message }) }
      req.login(user, loginErr => {
        if (loginErr) {
          return next(loginErr);
        }
        const editedUser = _.omit(user, ['password']);
        return res.send({ success : true, message : editedUser });
      });
    })(req, res, next);
  });

  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    if(req.user) {
      res.redirect('/dashboard');
    }
  });

  app.get('/api/logout', (req, res) => {

    req.logout();
    req.session.destroy();
    res.send({success: true});
  });


  app.get('/api/current_user',loggedIn,
   (req, res) => {
    const user = _.omit(req.user, ['password']);
    res.send(user);
  });

}
