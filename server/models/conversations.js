const mongoose = require("mongoose");
const {Schema} = mongoose;

const deletionHistorySchema = new Schema({
  key: {
    user: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    dateFrom: {type: Date}
  }
}, { strict: false })

const conversationSchema = new Schema({
  members: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
  deletionHistory: {
    type: Map,
    of: String
  }
});

mongoose.model("conversations", conversationSchema);
