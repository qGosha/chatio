const mongoose = require('mongoose');
const { Schema } = mongoose;


const conversationSchema = new Schema({
 members: [{ type : mongoose.Schema.Types.ObjectId, ref: 'user' }]
});

mongoose.model('conversations', conversationSchema);
