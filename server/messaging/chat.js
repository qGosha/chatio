const mongoose = require('mongoose');
const Message = mongoose.model('messages');
const Conversation = mongoose.model('conversations');
const passport = require('passport');
const changeUserStatus = require('../helpers/help_functions');


module.exports = (io, sessionMiddleware) => {
  io.on('connection', async (socket) => {

    if(socket.request.session.passport) {
      const userId = socket.request.session.passport.user;
      try {
        await socket.join(userId);
        await changeUserStatus(userId, true);
        socket.broadcast.emit('userChangedStatus', {id: userId, online: true});
      } catch(err) {
        throw new Error(err)
      }
      socket.on('disconnect', async () => {
        await changeUserStatus(userId, false);
        socket.broadcast.emit('userChangedStatus', {id: userId, online: false});
      })
      socket.on('error', async () => {
        await changeUserStatus(userId, false);
        socket.broadcast.emit('userChangedStatus', {id: userId, online: false});
      })
      socket.on('connect_timeout', async () => {
        await changeUserStatus(userId, false);
        socket.broadcast.emit('userChangedStatus', {id: userId, online: false});
      })
      socket.on('connect_error', async () => {
        await changeUserStatus(userId, false);
        socket.broadcast.emit('userChangedStatus', {id: userId, online: false});
      })

    socket.on('outboundMessage', async (newMessage, callback) => {
      try {

        const message = await new Message({
          ...newMessage,
          sender: userId
        }).save();
       io.to(newMessage.recipient).emit('inboundMessage', message);
       io.to(userId).emit('inboundMessage', message);
     } catch (e) {
       console.log(E);
     }
    })

      }
  });

}
