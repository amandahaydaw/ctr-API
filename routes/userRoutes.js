const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

const keys = require("../config/keys");

//creating user account
router.post("/admin/createUser", (req, res, next) => {
    bcrypt.hash(req.body.password, 12).then((hash) => {
        const user = new User({
            Username: req.body.Username,
            password: hash,
            givenname: req.body.givenname,
            familyname: req.body.familyname,
            Email: req.body.Email,
            Phone: req.body.Phone,

        });
        User.findOne({ Username: req.body.Username })
            .then((foundOne) => {
                if (foundOne) {

                    return res.status(401).json({
                        message: "User username already exists!Please choose another username",
                    });
                }
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

//logging in
router.post("/UserLogin", (req, res, next) => {
    let fetchedUser;
    User.findOne({ Username: req.body.username })
        .then((user) => {
            if (user == null) {
                return res.status(401).json({
                    message: "User username not found",
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            console.log("Successfully found User:", fetchedUser.Username);
            if (!result) {
                return res.status(401).json({
                    message: "Authentication failed.  Incorrect password",
                });
            }
            const token = jwt.sign({
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
            console.log("User authenticated with token!please loggout and loggin again ");
        })
        .catch((e) => {
            console.log(e);
        });
});







module.exports = router;

module.exports = router;