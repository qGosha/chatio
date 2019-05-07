require("../models/messages")
require("../models/conversations")
require("../models/users")
const mongoose = require("mongoose")
const Conversation = mongoose.model("conversations")
const User = mongoose.model("users")
const assert = require("assert")

describe("Associations", async () => {
  let user, conversation

  beforeEach(async () => {
    try {
      user = new User({ name: "Joe" })
      conversation = new Conversation({ members: [] })
      conversation.members.push(user)
      return await Promise.all([user.save(), conversation.save()])
    } catch (e) {
      throw new Error(e)
    }
  })

  it("should populate user", async () => {
    try {
      const conversation1 = await Conversation.findById(
        conversation.id
      ).populate({ path: "members", model: User })
      assert(conversation1.members[0].name === "Joe")
    } catch (e) {
      throw new Error(e)
    }
  })
})
