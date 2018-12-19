const mongoose = require('mongoose');
const Message = mongoose.model('messages');
const passport = require('passport');
const changeUserStatus = require('../helpers/help_functions');


module.exports = (io, sessionMiddleware) => {
  io.on('connection', async (socket) => {

    if(socket.request.session.passport) {
      const userId = socket.request.session.passport.user;
      try {
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

      const message = await new Message({
        ...newMessage,
        sender: userId
      }).save();
     io.sockets.in(newMessage.activeDialogWith).emit('inboundMessage', message)
      // const user = users.getUser(socket.id);
      // if (user && isRealString(newMessage.text)) {
      //   io.to(user.room).emit('newMessage', generateMessage(user.name, newMessage.text));
      // }
      // callback('This is from the sever');
    })
    socket.on('join', (params, callback) => {
      // if (!isRealString(params.name) || !isRealString(params.room)) {
      //   return callback('Name and room name are requireed');
      // }
      socket.join(socket.id);
      // users.removeUser(socket.id);
      // users.addUser(socket.id, params.name, params.room);
      //
      // io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      // socket.emit('fromAPI', io.sockets)
      // socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));
      // callback();
    })

    // socket.on('createLocationMessage', (coords) => {
    //   const user = users.getUser(socket.id);
    //   if (user) {
    //     io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
    //   }
    // })
    //;
      }
  });

}
