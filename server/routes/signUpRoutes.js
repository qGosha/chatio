const mongoose = require('mongoose');
const User = mongoose.model('users');

const _ = require('lodash');
module.exports = (app) => {

app.post('/signup', (req, res) => {
  const userData = _.pick(req.body, ['email', 'password']);
  if(!userData.email || !userData.password) {
    res.status(400).send('Provide email and password');
  }
  User.uniqEmailCheck(userData.email).then( () => {
    const user = new User(userData);
    user.save().then( user => {
       res.status(200).send(`You successfuly signed up ${user.email}`);
     })
  } ).catch( e => {
    res.status(400).send(e);
   });
});
}
