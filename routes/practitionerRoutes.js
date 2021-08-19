const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const keys = require("../config/keys");
const Practitioner = require("../models/practitioner");


//login
router.get(
    "/getPractitioner",
    passport.authenticate("practitioner", { session: false }),
    (req, res) => {
        res.status(200).json({ success: true, data: req.user });
    }
);
//create
router.post("/PractitionerLogin", (req, res, next) => {
    let fetchedPrac;
    Practitioner.findOne({ Username: req.body.username })
        .then((practitioner) => {
            if (!practitioner) {
                return res.status(401).json({
                    message: "Practitioner username not found! Please login in with correct username",
                });
            }
            fetchedPrac = practitioner;
            return bcrypt.compare(req.body.password, practitioner.Password);
        })
        .then((result) => {
            console.log("Successfully found Practitioner account:", fetchedPrac.Username);
            if (!result) {
                return res.status(401).json({
                    message: "Authentication failed.  Incorrect password",
                });
            }

            const token = jwt.sign({
                    username: fetchedPrac.Username,
                    userId: fetchedPrac._id,
                    practitioner: true,
                },
                keys.secretOrKey, { expiresIn: "3h" },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token,
                    });
                }
            );
            console.log("Practitioner authenticated with token!please loggout and loggin again ");
        })
        .catch((e) => {
            console.log(e);
        });
});


























router.post("/practitioner/getOnePractitioner",
    passport.authenticate("practitioner", { session: false }),
    (req, res, next) => {
        Practitioner.findOne({ _id: req.body.practitionerID })
            .then((practitioner) => {
                if (practitioner) {
                    return res.status(200).json({
                        practitioner
                    });
                }
            })
    })

router.get(
    "/practitioner/getClients",
    passport.authenticate("practitioner", { session: false }),
    (req, res) => {
        //Check to see if our auth response is an admin
        //Search database for anything
        Client.find({}, (err, client) => {
            if (err) {
                //Return 400 for unspecified failure
                return res.status(400).json({ success: false, error: err });
            }
            if (!client.length) {
                //return 404 error if no entries found
                return res
                    .status(404)
                    .json({ success: false, error: "Database empty" });
            }
            //otherwise, return 200 with list of clients
            return res.status(200).json({ success: true, data: client });
        }).catch((err) => console.log(err));
    }
);

//  TEST ONLY - MUST BE REMOVED BEFORE RELEASE
// getPrac -return all members of the current Practitioners database (will automatically decrypt)
// GET
// api path '/api/test/getdb'
// returns json
router.get("/test/getPrac", (req, res) => {
    //Search database for anything
    Practitioner.find({}, (err, Practitioner) => {
        if (err) {
            //Return 400 for unspecified failure
            return res.status(400).json({ success: false, error: err });
        }
        if (!Practitioner.length) {
            //return 404 error if no entries found
            return res.status(404).json({ success: false, error: "Database empty" });
        }
        //otherwise, return 200 with list of Practitioner
        return res.status(200).json({ success: true, data: Practitioner });
    }).catch((err) => console.log(err));
});

module.exports = router;