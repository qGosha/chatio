const mongoose = require("mongoose");
const {Schema} = mongoose;

const deletionHistorySchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    dateFrom: {type: Date}
}, { strict: false })

const conversationSchema = new Schema({
  members: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
  deletionHistory: [{type: deletionHistorySchema}]
});

mongoose.model("conversations", conversationSchema);
