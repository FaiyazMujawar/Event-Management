const router = require("express").Router();
const _ = require("lodash");
const Admin = require("../controllers/AdminController");
const Coordinator = require("../controllers/CoordinatorController");
const Registrar = require("../controllers/RegistrarController");

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === "admin") {
            Admin.getAllEvents(res);
        } else if (req.user.type === "coordinator") {
            Coordinator.getEvent(req, res);
        } else if (req.user.type === "registrar") {
            Registrar.getEvent(res);
        }
    } else {
        res.redirect("/users/login");
    }
});

router
    .route("/event/:eventName")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.type === "admin") {
                Admin.getEvent(req, res);
            }
        }
    })
    .post((req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.type === "admin") {
                if (req.body.action === "delete") {
                    Admin.deleteEvent(req, res);
                } else {
                    Admin.updateEvent(req, res);
                }
            } else if (req.user.type === "registrar") {
                Registrar.addParticipant(req, res);
            }
        } else {
            res.redirect("/users/login");
        }
    });

router
    .route("/add")
    .get((req, res) => {
        if (req.isAuthenticated() && req.user.type === "admin") {
            res.render("AddEvent");
        } else {
            res.redirect("/users/login");
        }
    })
    .post((req, res) => {
        Admin.addEvent(req, res);
    });

router
    .route("/event/:eventName/registrars")
    .get((req, res) => {
        if (req.isAuthenticated() && req.user.type === "coordinator") {
            res.render("AddRegistrar", {
                eventName: _.kebabCase(req.user.eventName)
            });
        }
    })
    .post((req, res) => {
        if (req.isAuthenticated() && req.user.type === "coordinator") {
            console.log("here");
            Coordinator.addRegistrar(req, res);
        } else {
        }
    });

module.exports = router;
