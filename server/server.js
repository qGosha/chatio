require('./config/config.js')

const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.get('/', (res, req) => {
  res.render('./public');
})

app.listen(port, () => {
  console.log('started on port ' + port)
});

module.exports = {app};
