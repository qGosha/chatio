const mongoose = require("mongoose");
const User = mongoose.model("users");
const Token = mongoose.model("verifTokens");
const nodemailer = require("nodemailer");
const verifUserMail = require("../helpers/verifUserMail");
const resetPasswordMail = require("../helpers/resetPasswordMail");
const crypto = require("crypto");

const changeUserStatus = async (id, online) => {
  return new Promise((res, rej) => {
    const updatedUser = User.findOneAndUpdate(
      {_id: id},
      {$set: {online: online}},
      {new: true}
    );
    if (!updatedUser) {
      return rej(false);
    } else {
      return res(updatedUser);
    }
  });
};

const sendTokenEmail = async (req, user, options) => {
   const pin = options.type === 'verifUser' ? Math.floor(Math.random() * 1000000000 + 1)
    .toString()
    .slice(0, 4) : null;
  const token = await new Token({
    _userId: user._id,
    token: crypto.randomBytes(16).toString("hex"),
    pin
  }).save();
  const transporter = nodemailer.createTransport({
    service: "Mail.ru",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    }
  });
  let link, letter, subject;
  if (options.type === 'verifToken') {
     link = `https://${req.headers.host}/api/confirmation/${token.token}`;
     letter = verifUserMail(link, token.pin);
     subject = "Account Verification Token";
  } else if (options.type === 'resetPassword') {
    link = `https://${req.headers.host}/reset_password/${token.token}`;
    letter = resetPasswordMail(link, user.name);
    subject = "Password reset link";
  }

  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: options.email,
    subject: subject,
    html: letter
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  changeUserStatus,
  sendTokenEmail
};
