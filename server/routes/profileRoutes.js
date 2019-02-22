const { loggedIn, userInputCheck } = require('../helpers/middleware');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Token = mongoose.model('verifTokens');
const { ObjectId } = require('mongodb');
const cloudinary = require('../helpers/settings');
const { sendTokenEmail } = require('../helpers/help_functions');
const omit = require('lodash.omit');

module.exports = (app) => {

 app.post('/api/profile/changeAvatar', loggedIn, async (req, res) => {
   const id = ObjectId(req.user._id);
   const val = Object.values(req.files)[0];
   if (!val) {
     throw new Error('No file provided');
   }
   try {
     const result = await cloudinary.v2.uploader.upload(val.path, {
     "folder": id,
     "width": 480,
     "height": 640,
     "crop": 'fit'
   });
   await User.findOneAndUpdate({ _id: id }, { $push: { photos: { $each: [result.secure_url], $position: 0 } } } );
   res.send({
     success: true,
     message: result.secure_url
   });
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }

});

  app.post('/api/profile/changeSettings', loggedIn, userInputCheck, async (req, res) => {
    const id = ObjectId(req.user._id);
    const { userData } = res.locals;
    const { email } = userData;
    try {
      if (email) {
        const user = await User.findById(id);
        if (user.isOauth) {
          throw new Error('Email was used for Oauth authentication. Cannot change')
        }
      }
      const newUser = await User.findOneAndUpdate(
        { _id: id },
        { $set: { ...userData, isConfirmed: email ? false : true } },
        { new: true, fields: { password: 0 } }
      );
      if (email) {
        await sendTokenEmail(req, newUser);
      }
      res.send({
        success: true,
        message: newUser
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message
      })
    }
  });
  app.post('/api/profile/changeEmail', loggedIn, userInputCheck, async (req, res) => {
    const id = ObjectId(req.user._id);
    const { userData } = res.locals;
    try {
      const newUser = await User.findOneAndUpdate(
        { _id: id },
        { $set: { ...userData } },
        { new: true, fields: { password: 0, __v: 0 } }
      );
      await Token.findOneAndRemove({_userId: id})
      await sendTokenEmail(req, newUser);
      res.send({
        success: true,
        message: newUser
      })
    } catch (error) {
       res.send({
        success: false,
        message: error.message
      })
    }
  });

  // app.get('/api/profile/muteNotifications', loggedIn, async (req, res) => {
  //   try {
  //     const newUser =await User.findOneAndUpdate(
  //       { _id: req.user._id },
  //       { $set: { mute: true } },
  //       { new: true, fields: { password: 0, __v: 0 } }
  //   );
  //   }
  // });

  app.get('/api/profile/deleteProfile', loggedIn, async (req, res) => {
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
      message: error.message
    })
  }

});
}
