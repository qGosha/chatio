const mongoose = require('mongoose');
const { Schema } = mongoose;


const tokenSchema = new Schema({
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    token: {
      type: String,
      required: true
    },
    pin: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 43200
    }
});

tokenSchema.statics.findByToken = function (token) {
 const Token = this;

 return Token.findOne({token}).then((token) => {
   if (!token) {
     throw new Error('Token is not valid');
   } else {
     return Promise.resolve(token);
   }
 });
};

tokenSchema.statics.findByPin = function (pin) {
 const Token = this;

 return Token.findOne({pin}).then((pin) => {
   if (!pin) {
     throw new Error('Pin is not valid');
   } else {
     return Promise.resolve(pin);
   }
 });
}

mongoose.model('verifTokens', tokenSchema);
