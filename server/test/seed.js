require("../config/config.js");
const {mongoose} = require("../db/mongoose");
require("../models/users");
const User = mongoose.model("users");
const faker = require('faker');

const addUsers = async (count = 120) => {
 const users = Array.from({length: count}, () => {
   return {
     name: faker.name.findName(),
     gender: Math.random() > 0.5 ? 'Male' : 'Female',
     dateOfBirth: faker.date.past(),
     city: faker.image.city(),
     email: faker.internet.email(),
     password: faker.internet.password(),
     isConfirmed: true,
   }
 })
 // for (i = 0; i <= count; i++) {
 //   const user = {
 //     name: faker.name.findName(),
 //     gender: Math.random() > 0.5 ? 'Male' : 'Female',
 //     dateOfBirth: faker.date.past(),
 //     city: faker.image.city(),
 //     email: faker.internet.email(),
 //     password: faker.internet.password(),
 //     isConfirmed: true,
 //   }
 //   users = { ...users, user }
 // };
 await User.insertMany(users);
};

addUsers();
