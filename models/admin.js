const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AdminSchema = new Schema({
    Username: { type: String },
    Password: { type: String },
});

var Admin = mongoose.model("admin", AdminSchema);
module.exports = Admin;