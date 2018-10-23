const loggedIn = require('../helpers/middleware');
const mongoose = require('mongoose');
const User = mongoose.model('users');


module.exports = (app) => {
  app.get('/api/deleteProfile', loggedIn, async (req, res) => {
  try {
    await User.findOneAndRemove({
      _id: req.user._id
    })
    req.logout();
    req.session.destroy();
    return res.send({success: true})
  } catch (error) {
    res.send({
      success: false,
      message: error
    })
  }

  })
}
