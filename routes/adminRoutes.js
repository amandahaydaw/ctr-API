const express = require("express");
const Admin = require("../models/admin");
const Practitioner = require("../models/practitioner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const keys = require("../config/keys");

//Create Admin user
router.post("/temp/createAdmin", (req, res, next) => {
    // hashing password
    bcrypt.hash(req.body.Password, 12).then((hash) => {
        const admin = new Admin({
            Username: req.body.Username,
            Password: hash,
            _Type: "Admin",
        });

        //check if new username is existed
        Admin.findOne({ Username: req.body.Username })
            .then((Admin1) => {
                if (Admin1) {
                    return res.status(401).json({
                        message: "Admin user account Already Exists! Please choose another username",
                    });
                }
                admin.save().then((result) => {
                    if (!result) {
                        return res.status(500).json({
                            message: "Error with Creating Admin user account",
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

//create practitioner account
router.post("/admin/createPractitioner",
    //to handle token encrypted
    //passport.authenticate("admin", { session: true }),
    (req, res, next) => {
        bcrypt.hash(req.body.password, 12).then((hash) => {
            const practitioner = new Practitioner({
                Username: req.body.Username,
                password: hash,
                givenname: req.body.givenname,
                familyname: req.body.familyname,
                Email: req.body.Email,
                Phone: req.body.Phone,

            });
            //checking if practitioner account name is existed
            Practitioner.findOne({ Username: req.body.Username })
                .then((foundOne) => {
                    if (foundOne) {

                        return res.status(401).json({
                            message: "Practitioner username already exists",
                        });
                    }
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

//login to addin account

router.post("/AdminLogin", (req, res, next) => {
    let fetchedAdmin;
    Admin.findOne({ Username: req.body.username })
        .then((admin) => {
            if (admin == null) {
                return res.status(401).json({
                    message: "Admin username not found",
                });
            }
            fetchedAdmin = admin;
            return bcrypt.compare(req.body.password, admin.Password);
        })
        .then((result) => {
            console.log("Successfully found Admin user account name:", fetchedAdmin.Username);
            if (!result) {
                return res.status(401).json({
                    message: "Authentication failed.  Incorrect password",
                });
            }
            const token = jwt.sign({
                    username: fetchedAdmin.Username,
                    userId: fetchedAdmin._id,
                    admin: true,
                },
                keys.secretOrKey, { expiresIn: "3h" },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token,
                    });
                }
            );
            console.log("Admin authenticated with token!please loggout and loggin again ");
        })
        .catch((e) => {
            console.log(e);
        });
});


//login to practitioner account 
router.get(
    "/admin/createPractitioners",
    (req, res) => {
        Practitioner.find({}, (err, practitionerList) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!practitionerList.length) {
                return res
                    .status(404)
                    .json({ success: false, error: "Database empty" });
            }
            return res.status(200).json({ success: true, data: practitionerList });
        }).catch((err) => console.log(err));
    }
);
module.exports = router;
module.exports = router;