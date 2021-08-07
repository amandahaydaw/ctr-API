const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Admin = mongoose.model("admin");
const Practitioner = mongoose.model("practitioner");


// Get our keys so we can decrypt the token
const keys = require("./keys");
const options = {};

//The token we get will be as part of the header in the API request
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

//load secret key
options.secretOrKey = keys.secretOrKey;

//function passport
// passport will need to be called within the API request
// EXAMPLE:



// This provides the token as part of the API header, NOT part of the body.
// This allows you to send an authenticated request, such as GET, without any body

module.exports = (passport) => {
    passport.use(
        "admin",
        //The jwt strategy is set because we are using jwt
        new JwtStrategy(options, (jwt_payload, done) => {
            // Which type of passport do you want.  Check for the payload type (admin = true for admin token)

            Admin.findById(jwt_payload.userId)

            //So, find the client in our database, and return it.
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