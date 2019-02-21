const mongoose = require('mongoose');
const User = mongoose.model('users');
const Token = mongoose.model('verifTokens');
const nodemailer = require('nodemailer');
const mail = require('../helpers/mail');
const crypto = require('crypto');

const changeUserStatus = async (id, online) => {
  console.log('changeUserStatus', id, online)
  return new Promise((res, rej) => {
    const updatedUser = User.findOneAndUpdate({_id: id}, {$set: {online: online}}, {new: true});
    if(!updatedUser) {
      return rej(false);
    } else {
      return res(updatedUser);
    }
  })
};

const sendTokenEmail = async (req, user) => {
  const token = await new Token({
    _userId: user._id,
    token: crypto.randomBytes(16).toString('hex'),
    pin: Math.floor((Math.random()*1000000000)+1).toString().slice(0,4)
  }).save();
  const transporter = nodemailer.createTransport({
    service: 'Mail.ru',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    }
  });
 const link = `https://${req.headers.host}/api/confirmation/${token.token}`;
 const letter = mail(link, token.pin);

 const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: user.email,
    subject: 'Account Verification Token',
    html: letter
  };
 await transporter.sendMail(mailOptions);

}



module.exports = {
  changeUserStatus,
  sendTokenEmail
};
