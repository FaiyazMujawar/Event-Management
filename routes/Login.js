const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");

router
    .route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post(
        passport.authenticate("local", { failureRedirect: "/users/login" }),
        (req, res) => {
            res.redirect("/events");
        }
    );

module.exports = router;
