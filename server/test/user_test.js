require("../models/users")
const mongoose = require("mongoose")
const User = mongoose.model("users")
const assert = require("assert")

describe("Creating records", () => {
  it("saves a user", async () => {
    try {
      const joe = await new User({ name: "Joe" }).save()
      assert(joe.name === "Joe")
    } catch (e) {
      throw new Error(e)
    }
  })
})
