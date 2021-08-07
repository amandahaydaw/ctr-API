//practitioner was created to be a join of GP and MHP models

//import mongoose for saving to mongodb
const mongoose = require("mongoose");
const mongooseFieldEncryption = require("mongoose-field-encryption")
    .fieldEncryption;

const Schema = mongoose.Schema;

//Load encryption key from keys file
const keys = require("../config/keys");

// PractitionerSchema
// Practitioners are a user class of Edge-perience
// A practitioner can be either a MHP or GP or Other

const PractitionerSchema = new Schema({

    Designation: { type: String }, //either GP or MHP or other
    Username: { type: String, unique: true },
    Password: { type: String },
    NameFirst: { type: String },
    NameLast: { type: String },
    Prefix: { type: String },
    Clinic: { type: String }, // change later to list of clinics the Prac belongs to
    Email: { type: String },
    Phone: { type: Number },
    PhoneSecondary: { type: Number },
    ProviderNumber: { type: String },

    //Practitioner settings
    Active: { type: Boolean },
    DefaultAppointmentLength: { type: Number },
    DefaultAppointmentType: { type: String }, //in person, telehealth
    DefaultDeliveryType: { type: String }

});



// Encryption plugin
// mongooseFieldEncryption
// Encrypts each of the listed fields using the secret key
// Also - auto decrypts the fields when called from the database
// (all fields are encrypted, except for email and password (which is hashed))

PractitionerSchema.plugin(mongooseFieldEncryption, {
    fields: [
        "Email",
        "Phone",
        "PhoneSecondary",
        "NameFirst",
        "NameLast",
    ],
    secret: keys.practitionerKey,
});

var Practitioner = mongoose.model("practitioner", PractitionerSchema);
module.exports = Practitioner;