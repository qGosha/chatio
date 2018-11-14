const mongoose = require('mongoose');
const { Schema } = mongoose;


const messageSchema = new Schema({
    message:{
        text: {
          type: {},
          required:true
        },
    },
    users:[{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
    }],
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    delivered: { type: Boolean },
    deliveredAt: { type: Date },
    read: { type: Date },

});


mongoose.model('messages', messageSchema);
