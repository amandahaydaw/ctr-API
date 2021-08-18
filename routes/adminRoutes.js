const express = require("express");
const Admin = require("../models/admin");
const Practitioner = require("../models/practitioner");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

const keys = require("../config/keys");

//Create Admin user
// POST
// api path '/api/temp/createAdmin'
// requires client json object {Username, Password}
// IMPORTANT
// This route creates an admin user without AUTHORISATION
// the route should be deleted once used.  It should not be accessed by the GUI
// and should only be called from POSTMAN

router.post("/temp/createAdmin", (req, res, next) => {
    // hash the password field, then assign all json attributes to temporary variables within a client object
    bcrypt.hash(req.body.Password, 12).then((hash) => {
        const admin = new Admin({
            Username: req.body.Username,
            Password: hash,
            _Type: "Admin",
        });

        //Check, does this Admin already exist?  If so, return 401
        Admin.findOne({ Username: req.body.Username })
            .then((Admin1) => {
                if (Admin1) {
                    return res.status(401).json({
                        message: "Admin account Already Exists",
                    });
                }

                // Otherwise, try to save client
                // Send 500 error if failed
                // Send 201 on success
                admin.save().then((result) => {
                    if (!result) {
                        return res.status(500).json({
                            message: "Error Creating Admin",
                        });
                    }
                    res.status(201).json({
                        message: "Admin registered!",
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


router.post("/admin/createPractitioner",
    //passport.authenticate("admin", { session: true }),
    (req, res, next) => {
        // hash the password field, then assign all json attributes to temporary variables within a client object

        bcrypt.hash(req.body.password, 12).then((hash) => {
            const practitioner = new Practitioner({
                Username: req.body.Username,
                password: hash,
                givenname: req.body.givenname,
                familyname: req.body.familyname,
                Email: req.body.Email,
                Phone: req.body.Phone,

            });

            //Check, does this Mhp already exist?  If so, return 401
            Practitioner.findOne({ Username: req.body.Username })
                .then((foundOne) => {
                    if (foundOne) {

                        return res.status(401).json({
                            message: "Practitioner username already exists",
                        });
                    }

                    // Otherwise, try to save Practitioner
                    // Send 500 error if failed
                    // Send 201 on success
                    practitioner.save().then((result) => {
                        if (!result) {

                            return res.status(500).json({
                                message: "Error Creating Practitioner",
                            });
                        }

                        res.status(201).json({
                            message: "Practitioner registered!",
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
    }
);

// login (user authenticate)
// POST
// api path '/api/login'
// requires username/password json object
// This API is used by all admin user types, MHP, GP and Admin
// determined by Usertype field in req.body

router.post("/AdminLogin", (req, res, next) => {
    let fetchedAdmin;

    //Check to see if admin exists in database
    Admin.findOne({ Username: req.body.username })
        .then((admin) => {
            if (admin == null) {
                //if not found, return 401
                return res.status(401).json({
                    message: "Admin username not found",
                });
            }

            // if found, fetch the practitioner entry
            fetchedAdmin = admin;
            // compare hashed passwords
            return bcrypt.compare(req.body.password, admin.Password);
        })
        .then((result) => {
            console.log("Successfully found Admin:", fetchedAdmin.Username);
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
                    username: fetchedAdmin.Username,
                    userId: fetchedAdmin._id,
                    admin: true,
                },
                keys.secretOrKey, { expiresIn: "1h" },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token,
                    });
                }
            );
            console.log("Admin authenticated with token ");
        })
        .catch((e) => {
            console.log(e);
        });
});



router.get(
    "/admin/createPractitioners",
    // passport.authenticate("admin", { session: false }),
    (req, res) => {
        //Check to see if our auth response is an admin
        //Search database for anything
        Practitioner.find({}, (err, practitionerList) => {
            if (err) {
                //Return 400 for unspecified failure
                return res.status(400).json({ success: false, error: err });
            }
            if (!practitionerList.length) {
                //return 404 error if no entries found
                return res
                    .status(404)
                    .json({ success: false, error: "Database empty" });
            }
            //otherwise, return 200 with list of Practitioners's
            return res.status(200).json({ success: true, data: practitionerList });
        }).catch((err) => console.log(err));
    }
);



module.exports = router;

module.exports = router;