require("../config/config.js");
const {mongoose} = require("../db/mongoose");
require("../models/users");
require("../models/messages");
require("../models/conversations");
const User = mongoose.model("users");
const Message = mongoose.model("messages");
const Conversation = mongoose.model("conversations");
const faker = require('faker');
const {ObjectId} = require("mongodb");

const pickRandom = (arr, notEqualTo) => {
  if (notEqualTo) {
    let item = arr[Math.floor(Math.random() * arr.length)]
    while (item._id === notEqualTo._id) {
      item = arr[Math.floor(Math.random() * arr.length)];
    }
    return item;
  } else {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}


const addUsers = async (userCount = 120, messageCount = 15000) => {
 const users = Array.from({length: userCount}, () => {
   const password = faker.internet.password();
   return {
     _id: new ObjectId(),
     name: faker.name.findName(),
     gender: Math.random() > 0.5 ? 'Male' : 'Female',
     dateOfBirth: faker.date.past(),
     photos:[faker.image.avatar()],
     city: faker.address.city(),
     email: faker.internet.email(),
     password,
     seedPasswordLookup: password,
     isConfirmed: true,
   }
 });

let conversations = [];
let conversationsUniq = [];
let i = 0;
 while( i < 1000) {
 const member1 = pickRandom(users);
 const member2 = pickRandom(users, member1);
  if (!conversationsUniq[`${member1._id}${member2._id}`] && !conversationsUniq[`${member2._id}${member1._id}`]) {
    conversations.push({
      _id: new ObjectId(),
      members: [member1._id, member2._id]
    });
    conversationsUniq[`${member1._id}${member2._id}`] = true;
  }
    i++;
};

 const messages = Array.from({length: messageCount}, () => {
   const text = faker.lorem.sentences();
   const image = faker.image.image();
   const conversation = pickRandom(conversations);
   const member1 = pickRandom(conversation.members);
   const member2 = pickRandom(conversation.members, member1);
   const textMessage = {
     text,
     image: {
       image: false
     }
   };
   const imageMessage = {
     text: image,
     image: {
       image: true,
       uploaded: true
     }
   };
   return {
     message: Math.random() > 0.7 ? imageMessage : textMessage,
     recipient: member1._id,
     sender: member2._id,
     delivered: true,
     timestamp: faker.date.past(),
     read: true
   }
 })
 await Promise.all([ User.create(users), Conversation.insertMany(conversations), Message.insertMany(messages) ]);
 console.log('Done!');
};

addUsers();
