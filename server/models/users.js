const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  gender: String,
  dateOfBirth: Date,
  city: String,
  photos:[],
  email: {
    type: String,
    minLength: 1,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
    password: {
      type: String,
      minlength: 6,
    },
    google: {
     googleId: String,
     googleEmail: String
   },
   facebook: {
     facebookId: String,
     facebookEmail: String
   },
   isConfirmed: {
     type: Boolean,
     default: false
   },
   state: {
     online: true,
     available: false
   },

});

userSchema.pre('save', function(next) {
  const user = this;
  //to check if pass was modified to prevent already hashed pass from hashing
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    });
  } else {
    next();
  }
});

userSchema.statics.uniqEmailCheck = function (email, password) {
  const User = this;

  return User.findOne({email}).then((user) => {
    if (user) {
      return Promise.reject('User with this email already exists');
    } else {
      return Promise.resolve();
    }
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject('No user with this credentials');
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject('Password is wrong');
        }
      });
    });
  });
};
mongoose.model('users', userSchema);
