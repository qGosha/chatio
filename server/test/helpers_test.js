require("../config/config.js")
const { mongoose } = require("../db/mongoose")

beforeEach(async () => {
  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase()
    }
  } catch (e) {
    throw new Error(e)
  }
})
