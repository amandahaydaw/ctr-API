/* models/admin.js
 * CHANGE LOG
 * 23/1/2021 4:00pm- Bevan Fairleigh - Created.  admin.js specifies the schema for the json database entries
 * 28/01/2021 1250pm - Bevan Fairleigh - Added _type into schema to allow identification of user type
 */

//import mongoose for saving to mongodb
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// AdminSchema
// This is the Mongo DB client schema for administrators of the app.  Upon creation of new admin, this json object is stored in the database
// All fields set to string
// 'Username' set to unique
// Password is already hashed

const AdminSchema = new Schema({
    Username: { type: String },
    Password: { type: String },
});

var Admin = mongoose.model("admin", AdminSchema);
module.exports = Admin;