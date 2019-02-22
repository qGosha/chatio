const mongoose = require('mongoose');
const User = mongoose.model('users');
const pick = require('lodash.pick');
const omit = require('lodash.omit');
const moment = require('moment');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.send(null);
    }
}

const userInputCheck = async (req, res, next) => {
  let userData = pick(req.body, ['name', 'gender', 'dateOfBirth', 'city', 'email', 'password', 'oldPassword']);
  const isDataComplete = Object.keys(userData).every( i => userData[i]);
  if(!isDataComplete) {
    throw new Error('Please complete the form');
  }
  try {
    if (userData.hasOwnProperty('email')) {
      await User.uniqEmailCheck(userData.email);
    }
    if (userData.hasOwnProperty('oldPassword')) {
      const user = await User.findById(req.user._id);
      const match = await bcrypt.compare(userData.oldPassword, user.password);
      if (match) {
        user.password = userData.password;
        await user.save();
        userData = omit(userData, ['oldPassword'], ['password']);
      } else {
        throw new Error('Current password is wrong');
      }
    }
    if (userData.hasOwnProperty('dateOfBirth')) {
      const date = userData.dateOfBirth;
      let dateError;
      if (!moment(date, 'MM-DD-YYYY', true).isValid()) {
        dateError = 'Incorrect date';
      } else if (new Date(date).getFullYear() < 1900) {
        dateError = 'The date is too far in the past'
      } else if (moment(date).isAfter(new Date())) {
        dateError = 'The date is in the future'
      }
      if (dateError) {
       throw new Error(dateError);
      }
      userData.dateOfBirth = new Date(date).toISOString();
    }
    res.locals.userData = userData;
    next();
} catch (error) {
  return res.send({
    success: false,
    message: error.message
  });
}
}

module.exports = {
  loggedIn,
  userInputCheck
};
