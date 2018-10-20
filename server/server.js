require('./config/config.js')
require('./models/users');
require('./models/verifToken');
require('./services/passport');
const session = require('express-session');
const mongodbStore = require('connect-mongo')(session);
const passport = require('passport');
const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');

const app = express();
app.use(
  session({
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
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./routes/authRoutes')(app);
require('./routes/signUpRoutes')(app);
require('./routes/basicRoutes')(app);
const port = process.env.PORT || 5000;



app.listen(port, () => {
  console.log('started on port ' + port)
});

module.exports = {app};
