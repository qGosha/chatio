const mongoose = require("mongoose");
const {Schema} = mongoose;

const messageSchema = new Schema({
  // conversationId: {type: mongoose.Schema.Types.ObjectId, ref: "conversations"},
  message: {
    text: {
      type: {},
      required: true
    },
    image: {
      image: {type: Boolean, default: false},
      uploaded: {type: Boolean, default: false}
    }
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  sender: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true},
  delivered: {type: Boolean, default: false},
  deliveredAt: {type: Date},
  read: {type: Boolean, default: false},
  timestamp: {type: Date, default: Date.now}
});

mongoose.model("messages", messageSchema);
