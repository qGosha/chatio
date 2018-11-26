const loggedIn = require('../helpers/middleware');
const axios = require('axios');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Message = mongoose.model('messages');
const { ObjectId } = require('mongodb');

module.exports = (app) => {
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
    console.log(req.body.id);
    try {
      const messages = await Message.find({ sender: ObjectId(req.user._id), users: { "$in" : [ObjectId(req.body.id)] } })
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


}
