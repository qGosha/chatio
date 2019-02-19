const mongoose = require('mongoose');
const User = mongoose.model('users');
const Token = mongoose.model('verifTokens');
const crypto = require('crypto');
const mail = require('../helpers/mail');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const moment = require('moment');

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

module.exports = (app) => {

app.post('/api/signup', async (req, res) => {
  if(req.user) return res.redirect('/dashboard');

  const userData = _.pick(req.body, ['name', 'gender', 'dateOfBirth', 'city', 'email', 'password']);
  const isDataComplete = Object.keys(userData).every( i => userData[i]);
  if(!isDataComplete) {
    const mes = {
      success: false,
      message: 'Please complete the form'
    }
    res.status(400).send(mes);
  }
  try {
    await User.uniqEmailCheck(userData.email);
    const dateOfBirth = new Date(userData.dateOfBirth).toISOString();
    let dateError;
    if (!moment(dateOfBirth, 'MM-DD-YYYY', true).isValid()) {
      dateError = 'Incorrect date'
    } else if (new Date(dateOfBirth).getFullYear() < 1900) {
      dateError = 'Incorrect date'
    } else if (moment(dateOfBirth).isAfter(new Date())) {
      dateError = 'The date is in the future'
    }
    if (dateError) {
      const mes = {
        success: false,
        message: dateError
      }
      res.status(400).send(mes);
    }
    const user = await new User({
      name: userData.name,
      gender: userData.gender,
      dateOfBirth,
      city: userData.city,
      email: userData.email,
      password: userData.password
    }).save();
    sendTokenEmail(req, user);
    req.login(user, loginErr => {
      if (loginErr) {
        throw loginErr;
      }
    });
     return res.send({
       success: true,
       message : req.user
     })
  } catch (error) {
    return res.send({
      success: false,
      message: error
    });
  }
});

app.get('/api/resendToken', async (req, res) => {
  if(!req.user) {
    return res.status(404).send({
      success: false
    })
  }
  if(req.user.isConfirmed) {
    return res.status(404);
  }
  try {
   await Token.findOneAndRemove({_userId: req.user._id})
   sendTokenEmail(req, req.user);
   return res.status(200).send({
     success: true
   })
  } catch (error) {
    return res.status(404).send(error);
  }
})

app.get('/api/confirmation/:token', async (req, res) => {
  if(!req.user) {
    return res.status(404).send({
      success: false
    })
  }
  try {
    const token = await Token.findByToken(req.params.token);
    const user = await User.findById(token._userId);
    if (!user) {
      return res.status(400).send('We were unable to find a user for this token.');
    }
    if (user.isConfirmed) {
      return res.status(400).send('This user has already been verified.');
    }
    user.isConfirmed = true;
    await user.save();
    await Token.findOneAndRemove({_id: token._id});
    return res.redirect('/dashboard')
  } catch (error) {
    return res.status(404).send(error);
  }

})


app.post('/api/confirmation', async (req, res) => {
  const userData = _.pick(req.body, ['pin']);
  const pin = userData.pin;
  if(!pin) {
    return res.status(404).send({
      success: false,
      message: 'Enter your pin'
    })
  }
  if(!req.user) {
    return res.status(404).send({
      success: false,
      message: 'Not authorized'
    })
  }
  if(req.user.isConfirmed) {
    return res.status(200).send({
      success: true,
      message: 'Already confirmed'
    });
  }

  try {
    const token = await Token.findByPin(pin);
    const user = await User.findById(token._userId);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'We were unable to find a user for this token.'
      });
    }
    if (user.isConfirmed) {
      return res.status(400).send('This user has already been verified.');
    }
    user.isConfirmed = true;
    const newUser = await user.save();
    await Token.findOneAndRemove({_id: token._id});
    return res.status(200).send({
      success: true,
      message: newUser
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error
    });
  }
})
}
