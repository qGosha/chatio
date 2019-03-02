require("../config/config.js");
const {mongoose} = require("../db/mongoose");

beforeEach( async () => {
  // const collections = ['users', 'conversations'];
  try {
    if(mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }

    // const maped = collections.map( collection => {
    //   const mongooseCollection = mongoose.connection.collections[collection];
    //   if (!mongooseCollection) {
    //    return null;
    //   }
    //   return mongooseCollection.drop();
    // });
    // if (maped.length) {
    //  return await Promise.all(maped);
    // }
  } catch(e) {
    throw new Error(e);
  }

});
