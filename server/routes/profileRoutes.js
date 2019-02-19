const loggedIn = require('../helpers/middleware');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const { ObjectId } = require('mongodb');
const cloudinary = require('../helpers/settings');
const _ = require('lodash');
module.exports = (app) => {

 app.post('/api/profile/changeAvatar', loggedIn, async (req, res) => {
   const id = ObjectId(req.user._id);
   const val = Object.values(req.files)[0];
   if (!val) {
     throw('No file provided');
   }
   try {
     const result = await cloudinary.v2.uploader.upload(val.path, {
     "folder": id,
     "width": 480,
     "height": 640,
     "crop": 'fit'
   });
   await User.findOneAndUpdate({ _id: ObjectId(id) }, { $push: { photos: { $each: [result.secure_url], $position: 0 } } } );
   res.send({
     success: true,
     message: result.secure_url
   });
  } catch (error) {
    res.send({
      success: false,
      message: error
    });
  }

});

  app.post('/api/profile/changeSettings', loggedIn, async (req, res) => {
    const id = ObjectId(req.user._id);
    const { values } = req.body;
    const newSettings = _.pick(values, ['name', 'gender', 'dateOfBirth', 'city', 'email', 'password']);
    try {
      // await User.findOneAndUpdate({ _id: id }, {  })
      res.send(newSettings);
    } catch (error) {
      res.send({
        success: false,
        message: error
      })
    }
  });

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
      message: error
    })
  }

  })
}
