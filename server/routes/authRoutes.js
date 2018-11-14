const passport = require('passport');
const loggedIn = require('../helpers/middleware');
const changeUserStatus = require('../helpers/help_functions');
const _ = require('lodash');

module.exports = (app) => {

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

  app.get('/auth/facebook/callback',
  passport.authenticate('facebook'), async (req, res) => {
    if(req.user) {
      await changeUserStatus(req.user, res, true);
      res.redirect('/dashboard');
    }
  });


  app.post('/api/login', (req, res, next) => {
    if(req.user) return res.redirect('/dashboard');
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) { return res.json( { success : false, message: info.message }) }
      req.login(user, async loginErr => {
        if (loginErr) {
          return next(loginErr);
        }
        const updatedUser = await changeUserStatus(user, res, true);
        const editedUser = _.omit(updatedUser.data, ['password']);
        return res.send({ success : true, message : editedUser });
      });
    })(req, res, next);
  });

  app.get('/auth/google/callback', passport.authenticate('google'), async (req, res) => {
    if(req.user) {
      await changeUserStatus(req.user, res, true);
      res.redirect('/dashboard');
    }
  });

  app.get('/api/logout', async (req, res) => {
    await changeUserStatus(req.user, res, false);
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
