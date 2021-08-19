const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Practitioner = mongoose.model("practitioner");
const Admin = mongoose.model("admin");


// Getting KEY
const keys = require("./keys");
const options = {};

//token to be part of API header request
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//loading secret key
options.secretOrKey = keys.secretOrKey;
module.exports = (passport) => {
    passport.use(
        "admin",
        //The jwt strategy
        new JwtStrategy(options, (jwt_payload, done) => {
            Admin.findById(jwt_payload.userId)

            .then((admin) => {

                    if (admin) {
                        return done(null, { admin });
                    }
                    return done(null, false);
                })
                .catch((err) => console.log(err));
        })
    );

};