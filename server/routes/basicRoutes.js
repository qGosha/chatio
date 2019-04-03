const {loggedIn} = require("../helpers/middleware");
const axios = require("axios");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Message = mongoose.model("messages");
const Conversation = mongoose.model("conversations");
const {ObjectId} = require("mongodb");
const cloudinary = require("../helpers/settings");

module.exports = (app, io) => {
  app.post("/api/search/city", async (req, res) => {
    try {
      const results = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${
          req.body.value
        }&types=(cities)&key=${process.env.GOOGLE_API_KEY}`
      );
      if (results && results.data.predictions) {
        res.send({
          success: true,
          results: results.data.predictions
        });
      }
    } catch (error) {
      res.send({
        success: false,
        error: "This place can't be found"
      });
    }
  });

  app.post("/api/getSpecificUser", loggedIn, async (req, res) => {
    try {
      const {id} = req.body;
      const specificUser = await User.findOne(
        {_id: id},
        {name: 1, gender: 1, online: 1, photos: {$slice: 1}}
      );
      if (specificUser) {
        res.send({
          success: true,
          message: specificUser
       })
     } else {
       throw new Error('No user found')
     }
   } catch (error) {
     res.send({
       success: false,
       error: error.message
     });
   }
  })

  app.get("/api/search/allUsers", loggedIn, async (req, res) => {
    try {
      const userId = req.user._id;
      const randomUsers = await User.find(
        {_id: {$ne: userId}},
        {name: 1, gender: 1, online: 1, photos: {$slice: 1}},
      )
        .limit(20);

      const getIHaveDialogWith = await Conversation.find({
        members: {$in: [userId]}
      }).populate({
        path: "members",
        model: User,
        select: {"_id": 1, "name": 1, "photos": 1, "online": 1},
        match: {_id: {$ne: userId}}
      });
      let iHaveDialogWith = {};
      getIHaveDialogWith.forEach( i => {
        if (i.members) {
        iHaveDialogWith[i.members[0]._id] = i.members[0];
        }
      });

      const iHaveDialogWithIds = Object.keys(iHaveDialogWith);
      const getMessages = await Promise.all(
        iHaveDialogWithIds.map(id => {
          return Message.find({
            sender: {$in: [id, userId]},
            recipient: {$in: [id, userId]}
          })
            .sort({timestamp: 1})
            .limit(20);
        })
      );

      const messages = getMessages.reduce((a, b) => a.concat(b), []);
      let messagesForEveryContact = {};
      iHaveDialogWithIds.forEach(id => {
        const stringId = id.toString();
        messagesForEveryContact[id] = messages.filter(
          message =>
            message.sender.toString() === stringId ||
            message.recipient.toString() === stringId
        );
      });

      const sortedPeerListForSidePanel = Object.keys(iHaveDialogWith).sort( (a, b) => {
          const lengthA = messagesForEveryContact[a].length;
          const lengthB = messagesForEveryContact[b].length;
          const firstMessageA = messagesForEveryContact[a][lengthA-1];
          const firstMessageB = messagesForEveryContact[b][lengthB-1];
          return new Date(firstMessageB && firstMessageB.timestamp) - new Date(firstMessageA && firstMessageA.timestamp);
        });

      const getNewMsgNotifictions = messages.filter(message => {
        return message.recipient.equals(userId) && message.read === false;
      });

      let newMsgNotifictions = {};
      getNewMsgNotifictions.forEach(item => {
        const s = item.sender;
        if (newMsgNotifictions[s]) {
          newMsgNotifictions[s]++;
        } else {
          newMsgNotifictions[s] = 1;
        }
      });
      res.send({
        success: true,
        message: {messagesForEveryContact, newMsgNotifictions, iHaveDialogWith, randomUsers, sortedPeerListForSidePanel}
      });
    } catch (error) {
      res.send({
        success: false,
        error: error.message
      });
    }
  });

  // app.post("/api/chat/openDialog", loggedIn, async (req, res) => {
  //   const id = ObjectId(req.user._id);
  //   const recipient = req.body.id;
  //   if (!recipient) {
  //     throw new Error("No recipients provsided");
  //   }
  //   try {
  //     // let newContactInList;
  //     //
  //     // const messages = await Message.find({
  //     //   sender: {$in: [id, ObjectId(recipient)]},
  //     //   recipient: {$in: [ObjectId(recipient), id]}
  //     // })
  //     //   .sort({timestamp: -1})
  //     //   .limit(20);
  //    const newContact = await User.findOne(
  //      {_id: recipient},
  //      {name: 1, gender: 1, online: 1, photos: {$slice: 1}}
  //    );
  //     res.send({
  //       success: true,
  //       message: newContact
  //     });
  //   } catch (error) {
  //     res.send({
  //       success: false,
  //       error
  //     });
  //   }
  // });

  app.post("/api/chat/dialogs", loggedIn, async (req, res) => {
    const id = ObjectId(req.user._id);
    const recipient = req.body.id;
    try {
      const messages = await Message.find({
        sender: {$in: [id, ObjectId(recipient)]},
        recipient: {$in: [ObjectId(recipient), id]}
      })
        .skip(req.body.skip || 0)
        .sort({timestamp: -1})
        .limit(20);

      res.send({
        success: true,
        message: messages
      });
    } catch (error) {
      res.send({
        success: false,
        error: error.message
      });
    }
  });

  app.post("/api/chat/uploadImages", loggedIn, async (req, res) => {
    const values = Object.values(req.files);
    const {activeDialogWith} = req.body;
    const id = ObjectId(req.user._id);
    const promises = values.map(image =>
      cloudinary.v2.uploader.upload(image.path, {
        folder: id + activeDialogWith,
        width: 480,
        height: 640,
        crop: "fit"
      })
    );
    const uploadingImagesPromises = values.map(() => {
      const newMessage = {
        message: {
          text: " ",
          image: {
            image: true
          }
        },
        recipient: activeDialogWith,
        sender: id
      };
      return new Message(newMessage).save();
    });
    try {
      const uploadingImages = await Promise.all(uploadingImagesPromises);
      uploadingImages.forEach(message => {
        io.to(activeDialogWith).emit("inboundMessage", message);
        io.to(id).emit("inboundMessage", message);
      });
      const results = await Promise.all(promises);
      const messagesUpdatePromises = results.map((result, i) => {
        const id = uploadingImages[i]._id;
        return Message.findOneAndUpdate(
          {
            _id: ObjectId(id)
          },
          {
            $set: {
              "message.text": result.secure_url,
              "message.image.uploaded": true
            }
          },
          {
            new: true
          }
        );
      });
      const updatedMessages = await Promise.all(messagesUpdatePromises);

      updatedMessages.forEach(message => {
        io.to(activeDialogWith).emit("imageHasBeenUploaded", message);
        io.to(id).emit("imageHasBeenUploaded", message);
      });
      res.send({success: true});
    } catch (error) {
      res.send({
        success: false,
        error: "Image uploading error"
      });
    }
  });

  app.post("/api/chat/markMsgRead", loggedIn, async (req, res) => {
    const {ids, activeDialogWith} = req.body;
    const objIds = ids.map(id => ObjectId(id));
    try {
      await Message.updateMany({_id: {$in: objIds}}, {$set: {read: true}});
      io.to(activeDialogWith).emit("msgHasBeenReadByPeer", {ids, whose: (req.user._id).toString()});
      res.send({
        success: true
      });
    } catch (error) {
      res.send({
        success: false,
        error: error.message
      });
    }
  });

  app.post("/api/chat/createNewConversation", loggedIn, async (req, res) => {
    const {id} = req.body;
    if (!id) return;
    const objId = ObjectId(id);
    const me = req.user._id;
    try {
      const getIHaveDialogWith = await Conversation.find({
        members: {$all: [objId, me]}
      });
      if (getIHaveDialogWith.length) {
        throw new Error('Conversation alredy exists')
      }
      const newConv = await new Conversation({members: [objId, me]}).save();
      // const newFriend = Conversation.populate(newConv, {
      //   path: 'members',
      //   select: {"_id": 1, "name": 1, "photos": 1, "online": 1},
      //   match: {_id: {$ne: me}}
      // })
      res.send({
        // message: newFriend[0],
        success: true
      });
    } catch (error) {
      res.send({
        success: false,
        error: error.message
      });
    }
  });
};
