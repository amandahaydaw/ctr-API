//import mongoose for saving to mongodb
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Load encryption key from keys file
const keys = require("../config/keys");

// userSchema
const userSchema = new Schema({
    givenname: { type: String },
    familyname: { type: String },
    Username: { type: String, unique: true },
    Email: { type: String },
    Phone: { type: Number },
    password: { type: String },
});

var user = mongoose.model("user", userSchema);
module.exports = user;