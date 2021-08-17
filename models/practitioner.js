//practitioner was created to be a join of GP and MHP models

//import mongoose for saving to mongodb
const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption")
    .fieldEncryption;

const Schema = mongoose.Schema;

//Load encryption key from keys file
const keys = require("../config/keys");

// PractitionerSchema
const PractitionerSchema = new Schema({
    givenname: { type: String },
    familyname: { type: String },
    Username: { type: String, unique: true },
    Email: { type: String },
    Phone: { type: Number },
    password: { type: String },
});



// Encryption plugin
// mongooseFieldEncryption
// Encrypts each of the listed fields using the secret key
// Also - auto decrypts the fields when called from the database
// (all fields are encrypted, except for email and password (which is hashed))

/*PractitionerSchema.plugin(mongooseFieldEncryption, {
    fields: [
        "Email",
        "Phone",
        "familyname",
        "NameLast", "Username",
    ],
    secret: keys.practitionerKey,
});
*/
var Practitioner = mongoose.model("practitioner", PractitionerSchema);
module.exports = Practitioner;