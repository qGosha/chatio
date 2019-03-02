require("../config/config.js");
const {mongoose} = require("../db/mongoose");

afterEach( async () => {
  const collections = ['users', 'messsages', 'conversations', 'sessions', 'verifTokens'];
  const maped = collections.map( collection => {
    const mongooseCollection = mongoose.connection.collections[collection];
    if (!mongooseCollection) {
     return null;
    }
    return mongooseCollection.drop();
  });
  if (maped.length) {
   return await Promise.all(maped);
  }

});
