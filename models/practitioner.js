const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;
//Loading encryption key
const keys = require("../config/keys");

const PractitionerSchema = new Schema({
    givenname: { type: String },
    familyname: { type: String },
    Username: { type: String, unique: true },
    Email: { type: String },
    Phone: { type: Number },
    password: { type: String },
});

// below are encruption fields required more fixes

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