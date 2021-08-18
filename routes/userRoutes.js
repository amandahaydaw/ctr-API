const express = require("express");
const User = require("../models/User");


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

const keys = require("../config/keys");


router.post("/admin/createUser", (req, res, next) => {
    // hash the password field, then assign all json attributes to temporary variables within a client object

    bcrypt.hash(req.body.password, 12).then((hash) => {
        const user = new User({
            Username: req.body.Username,
            password: hash,
            givenname: req.body.givenname,
            familyname: req.body.familyname,
            Email: req.body.Email,
            Phone: req.body.Phone,

        });

        //Check, does this Mhp already exist?  If so, return 401
        User.findOne({ Username: req.body.Username })
            .then((foundOne) => {
                if (foundOne) {

                    return res.status(401).json({
                        message: "User username already exists",
                    });
                }

                // Otherwise, try to save User
                // Send 500 error if failed
                // Send 201 on success
                user.save().then((result) => {
                    if (!result) {

                        return res.status(500).json({
                            message: "Error Creating User",
                        });
                    }

                    res.status(201).json({
                        message: "User registered!",
                        result: result,
                    });
                });
            })
            .catch((err) => {
                res.status(500).json({
                    error: err,
                });
            });
    });
});

// login (user authenticate)
// POST
// api path '/api/login'
// requires username/password json object
// This API is used by all admin user types, MHP, GP and Admin
// determined by Usertype field in req.body

router.post("/UserLogin", (req, res, next) => {
    let fetchedUser;

    //Check to see if admin exists in database
    User.findOne({ Username: req.body.username })
        .then((user) => {
            if (user == null) {
                //if not found, return 401
                return res.status(401).json({
                    message: "User username not found",
                });
            }

            // if found, fetch the practitioner entry
            fetchedUser = user;
            // compare hashed passwords
            return bcrypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            console.log("Successfully found User:", fetchedUser.Username);
            //on password check fail return 401
            if (!result) {
                return res.status(401).json({
                    message: "Authentication failed.  Incorrect password",
                });
            }

            //otherwise, create a jsonwebtoken
            // Deconstructed token components will be
            // Email
            // userId

            const token = jwt.sign(
                // The secret key is random, and signs the token key
                {
                    username: fetchedUser.Username,
                    userId: fetchedUser._id,
                    user: true,
                },
                keys.secretOrKey, { expiresIn: "1h" },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token,
                    });
                }
            );
            console.log("User authenticated with token ");
        })
        .catch((e) => {
            console.log(e);
        });
});







module.exports = router;

module.exports = router;