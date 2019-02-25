const mongoose = require("mongoose");
const Message = mongoose.model("messages");
const Conversation = mongoose.model("conversations");
const {changeUserStatus} = require("../helpers/help_functions");

module.exports = io => {
  io.on("connection", async socket => {
    if (socket.request.session.passport) {
      const userId = socket.request.session.passport.user;
      console.log(userId);
      const getIHaveDialogWith = await Conversation.find({
        members: {$all: [userId]}
      });
      const iHaveDialogWith = getIHaveDialogWith.map(i =>
        i.members.filter(r => r.toString() !== userId)[0].toString()
      );

      const sendEvents = (user, online) => {
        io.to(user).emit("userChangedStatus", {id: userId, online: online});
      };

      try {
        await socket.join(userId);
        await changeUserStatus(userId, true);
        sendEvents(userId, true);
        iHaveDialogWith.forEach(user => sendEvents(user, true));
      } catch (err) {
        throw new Error(err);
      }
      socket.on("reconnect", async () => {
        await changeUserStatus(userId, true);
        sendEvents(userId, true);
        iHaveDialogWith.forEach(user => sendEvents(user, true));
      });
      socket.on("disconnect", async () => {
        await changeUserStatus(userId, false);
        sendEvents(userId, false);
        iHaveDialogWith.forEach(user => sendEvents(user, false));
      });
      socket.on("error", async () => {
        await changeUserStatus(userId, false);
        sendEvents(userId, false);
        iHaveDialogWith.forEach(user => sendEvents(user, false));
      });
      socket.on("connect_timeout", async () => {
        await changeUserStatus(userId, false);
        sendEvents(userId, false);
        iHaveDialogWith.forEach(user => sendEvents(user, false));
      });
      socket.on("connect_error", async () => {
        await changeUserStatus(userId, false);
        sendEvents(userId, false);
        iHaveDialogWith.forEach(user => sendEvents(user, false));
      });

      socket.on("outboundMessage", async newMessage => {
        try {
          const message = await new Message({
            ...newMessage,
            sender: userId
          }).save();
          io.to(newMessage.recipient).emit("inboundMessage", message);
          io.to(userId).emit("inboundMessage", message);
        } catch (e) {
          console.log("Message sending error");
        }
      });
    }
  });
};
