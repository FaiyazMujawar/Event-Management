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

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/users/login");
});

module.exports = router;
