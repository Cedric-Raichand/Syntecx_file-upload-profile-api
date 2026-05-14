const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  profilePicture: {
    filename: String,
    path: String,
    url: String
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);