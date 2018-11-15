const mongoose = require('mongoose');
const User = mongoose.model('users');

const changeUserStatus = async (id, online) => {
  return new Promise((res, rej) => {
    const updatedUser = User.findOneAndUpdate({_id: id}, {$set: {online: online}}, {new: true});
    if(!updatedUser) {
      return rej(false);
    } else {
      return res(updatedUser);
    }
  })
}

module.exports = changeUserStatus;
