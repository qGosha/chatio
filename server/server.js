require('./config/config.js');
require('./models/users');
require('./models/verifToken');
require('./models/messages');
require('./models/conversations');
require('./services/passport');
require('./services/passport');

const session = require('express-session');
const mongodbStore = require('connect-mongo')(session);
const passport = require('passport');
const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const socketIO = require('socket.io');
// const sharedsession = require('express-socket.io-session');

const app = express();
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log('started on port ' + port)
});
const io = socketIO.listen(server, {
  pingInterval: 60000,
  pingTimeout: 25000
});
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});
// io.use(sharedsession(session));

const sessionMiddleware = session({
  name: 'superSession',
  store: new mongodbStore({
    mongooseConnection: mongoose.connection,
    touchAfter: 24 * 3600
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  },
  secret: [process.env.cookieKey]
})
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./routes/authRoutes')(app, io);
require('./routes/signUpRoutes')(app);
require('./routes/basicRoutes')(app);
require('./routes/profileRoutes')(app);
require('./messaging/chat')(io);


if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


module.exports = {app};
