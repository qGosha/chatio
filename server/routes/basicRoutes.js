const loggedIn = require('../helpers/middleware');
const axios = require('axios');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Message = mongoose.model('messages');
const { ObjectId } = require('mongodb');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
})

module.exports = (app, io) => {
  app.post('/api/search/city', async (req, res) => {
    try {
     const results = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.body.value}&types=(cities)&key=${process.env.GOOGLE_API_KEY}`);
     if(results && results.data.predictions) {
       res.send({
         success: true,
         results: results.data.predictions
       })
     }
   } catch (error) {
     res.send({
       success: false,
       error
     })
   }
  });

  app.get('/api/search/allUsers', loggedIn, async (req, res) => {
    try {
     const users = await User.find( { _id: { $ne: req.user._id } }, { name: 1, gender: 1, online: 1, photos: { $slice: 1 } } );
     res.send({
       success: true,
       message: users
     })
   } catch (error) {
     res.send({
       success: false,
       error
     })
   }
  });

  app.post('/api/chat/dialogs', loggedIn, async (req, res) => {
    const id = ObjectId(req.user._id);
    try {
      const messages = await Message.find({ sender: { $in: [id, ObjectId(req.body.id)] }, recipient: { $in: [ObjectId(req.body.id), id] } })
      .skip(req.body.skip || 0)
      .sort({ timestamp: -1 })
      .limit(20);

     res.send({
       success: true,
       message: messages
     })
   } catch (error) {
     res.send({
       success: false,
       error
     })
   }
  });

  // app.post('/api/chat/uploadImages', loggedIn, async (req, res) => {
  //   const values = Object.values(req.files);
  //   const { activeDialogWith } = req.body;
  //   const id = ObjectId(req.user._id);
  //   const uploadOptions = {
  //     folder: id + activeDialogWith,
  //     eager: [
  //        { width: 480, height: 640, crop: "crop" }
  //     ]
  //   }
  //   const promises = values.map(image => cloudinary.uploader.upload(image.path, uploadOptions));
  //
  //   try {
  //     const results = await Promise.all(promises);
  //     const messagesPromises = results.map( result => {
  //       const newMessage = {
  //         message: {
  //           text: result.secure_url,
  //           image: true
  //         },
  //         recipient: activeDialogWith,
  //         sender: id
  //       }
  //       return new Message(newMessage).save();
  //     })
  //     const savedMessages = await Promise.all(messagesPromises);
  //     savedMessages.map( message => {
  //       io.to(activeDialogWith).emit('inboundMessage', message);
  //       io.to(id).emit('inboundMessage', message);
  //     })
  //     res.send({success: true});
  //
  //   } catch (error) {
  //     res.send({
  //       success: false,
  //       error
  //     })
  // }
  //
  // });
  app.post('/api/chat/uploadImages', loggedIn, async (req, res) => {
    const values = Object.values(req.files);
    const { activeDialogWith } = req.body;
    const id = ObjectId(req.user._id);
    const promises = values.map(image => cloudinary.v2.uploader.upload(image.path, {
    "folder": id + activeDialogWith,
    "width": 480,
    "height": 640,
    "crop": 'fit'
  }));
    const uploadingImagesPromises = values.map( (i) => {
      const newMessage = {
        message: {
          text: ' ',
          image: {
            image: true
          }
        },
        recipient: activeDialogWith,
        sender: id
      }
      return new Message(newMessage).save();
    });
  try {
    const uploadingImages = await Promise.all(uploadingImagesPromises);
    uploadingImages.map( message => {
      io.to(activeDialogWith).emit('inboundMessage', message);
      io.to(id).emit('inboundMessage', message);
    });
    const results = await Promise.all(promises);
    const messagesUpdatePromises = results.map( (result, i) => {
      const id = uploadingImages[i]._id;
      return Message.findOneAndUpdate({
        _id: ObjectId(id)
      },
      {
        $set: {
          'message.text' : result.secure_url,
          'message.image.uploaded' : true
        }
      },
      {
        new: true
      })
    });
    const updatedMessages = await Promise.all(messagesUpdatePromises);

    updatedMessages.map( message => {
      io.to(activeDialogWith).emit('imageHasBeenUploaded', message);
      io.to(id).emit('imageHasBeenUploaded', message);
    })
  } catch (error) {
    res.send({
      success: false,
      error
    })
}
})
}
