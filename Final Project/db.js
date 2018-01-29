/*
@author: Zachary Kimelheim
netID: zk377
*/
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  first: String,
  last: String,
  username: String,
  email: String,
  password: String,
  Restaurants: {type: Array, 'default': []},
  Plans: {type: Array, 'default': []},
  // google: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String,
  // }

  // facebook data if logged in with facebook
  fbid: String,
  fbtoken: String,
  fbemail: String,
  fbname: String
})

const Restaurant = new mongoose.Schema({
  userID: String,
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
  cuisinetype: String,
  price: String
})

const LunchPlan = new mongoose.Schema({
  userID: String,
  monday: String,
  tuesday: String,
  wednesday: String,
  thursday: String,
  friday: String
})

mongoose.model('User', UserSchema)
mongoose.model('Restaurant', Restaurant)
mongoose.model('LunchPlan', LunchPlan)

const User = module.exports = mongoose.model('User', UserSchema)

// Passport functions used for authentication
module.exports.createUser = function (newUser, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      newUser.password = hash
      newUser.save(callback)
    })
  })
}
module.exports.getUserByUsername = function (username, callback) {
  const query = {username: username}
  User.findOne(query, callback)
}
module.exports.getUserByID = function (id, callback) {
  User.findById(id, callback)
}
module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err
    callback(null, isMatch)
  })
}

// 3. uncomment this when you want to switch back to deployed heroku
mongoose.connect("mongodb://zk377:cryptic0@ds147265.mlab.com:47265/heroku_tzrlghms");
// mongoose.connect('mongodb://localhost/fp')
