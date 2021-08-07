/* practitionerRoutes.js

This page sets up all the API routes for accessing the mhp database

 * 2/4/2021 10:30pm- Bevan Fairleigh - Created.  
 *
 */



const express = require("express");


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

const keys = require("../config/keys");
const Practitioner = require("../models/practitioner");



router.get(
    "/getPractitioner",
    passport.authenticate("practitioner", { session: false }),
    (req, res) => {
        res.status(200).json({ success: true, data: req.user });
    }
);

// login (user authenticate)
// POST
// api path '/api/login'
// requires username/password json object
// This API is used by all admin user types, MHP, GP and Admin
// determined by Usertype field in req.body
router.post("/PractitionerLogin", (req, res, next) => {
    let fetchedPrac;

    //Check to see if practitioner exists in database
    Practitioner.findOne({ Username: req.body.username })
        .then((practitioner) => {
            if (!practitioner) {
                //if not found, return 401
                return res.status(401).json({
                    message: "Practitioner username not found",
                });
            }
            // if found, fetch the practitioner entry
            fetchedPrac = practitioner;
            // compare hashed passwords
            return bcrypt.compare(req.body.password, practitioner.Password);
        })
        .then((result) => {
            console.log("Successfully found Practitioner:", fetchedPrac.Username);
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
                    username: fetchedPrac.Username,
                    userId: fetchedPrac._id,
                    practitioner: true,
                },
                keys.secretOrKey, { expiresIn: "1h" },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token,
                    });
                }
            );
            console.log("Practitioner authenticated with token ");
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