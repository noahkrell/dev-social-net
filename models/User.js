const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema, basic model structure...
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// pass in name you want to use for table, and the actual schema for the second parameter
module.exports = User = mongoose.model("users", UserSchema);
