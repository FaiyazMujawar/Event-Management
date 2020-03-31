const router = require("express").Router();
const _ = require("lodash");
const Admin = require("../controllers/AdminController");
const Coordinator = require("../controllers/CoordinatorController");
const Registrar = require("../controllers/RegistrarController");

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.session.response);
        if (req.user.type === "admin") {
            Admin.getAllEvents()
                .then(events => {
                    res.render("Admin", {
                        events: events,
                        response: req.session.response
                    });
                    req.session.response = {
                        success: undefined,
                        error: undefined
                    };
                })
                .catch(() => {
                    res.render("Admin", {
                        events: undefined,
                        response: undefined
                    });
                    req.session.response = {
                        success: undefined,
                        error: undefined
                    };
                });
        } else if (req.user.type === "coordinator") {
            res.redirect(`/events/event/${_.kebabCase(req.user.eventName)}`);
        } else if (req.user.type === "registrar") {
            res.redirect(
                `/events/event/${_.kebabCase(req.user.eventName)}/participants`
            );
        }
    } else {
        res.redirect("/users/login");
    }
});

router
    .route("/add")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.type === "admin") {
                res.render("AddEvent", { response: req.session.response });
                req.session.response = {
                    success: undefined,
                    error: undefined
                };
            } else {
                req.session.response = {
                    success: undefined,
                    error: "Access denied!"
                };
                res.redirect("/events");
            }
        } else {
            res.redirect("/users/login");
        }
    })
    .post((req, res) => {
        Admin.addEvent(req, res);
    });

router
    .route("/event/:eventName")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.type === "admin") {
                Admin.getEvent(req, res);
            } else if (req.user.type === "coordinator") {
                Coordinator.getEvent(req, res);
            } else {
                res.redirect("/events");
            }
            req.session.response = undefined;
        } else {
            res.redirect("/users/login");
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
            }
        } else {
            res.redirect("/users/login");
        }
    });

router.post("/event/:eventName/coordinators", (req, res) => {
    if (req.user.type === "admin") {
        if (req.body.action === "add") {
            Admin.addCoordinator(req)
                .then(() => {
                    req.session.response = {
                        success: "Co-ordinator added!",
                        error: undefined
                    };
                    res.redirect(`/events/event/${req.params.eventName}`);
                    req.session.response = undefined;
                })
                .catch(() => {
                    req.session.response = {
                        success: undefined,
                        error: "Co-ordinator addition failed!"
                    };
                    res.redirect(`/events/event/${req.params.eventName}`);
                    req.session.response = undefined;
                });
        } else if (req.body.action === "delete") {
            Admin.deleteCoordinator(req, res);
        }
    }
});

router
    .route("/event/:eventName/registrars")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.type === "coordinator") {
                res.render("AddRegistrar", {
                    eventName: _.kebabCase(req.user.eventName)
                });
            } else {
                res.redirect("/events");
            }
        } else {
            res.redirect("/users/login");
        }
    })
    .post((req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.type === "coordinator") {
                if (req.body.action === "delete") {
                    Coordinator.deleteRegistrar(req, res);
                } else {
                    Coordinator.addRegistrar(req, res);
                }
            }
        } else {
            res.redirect("/users/login");
        }
    });

router
    .route("/event/:eventName/participants")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.type === "registrar") {
                res.render("AddParticipant", {
                    eventName: req.user.eventName,
                    eventURI: _.kebabCase(req.user.eventName),
                    response: req.session.response
                });
                req.session.response = undefined;
            } else {
                res.redirect("/events");
            }
        } else {
            res.redirect("/users/login");
        }
    })
    .post((req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.type === "coordinator") {
                if (req.body.action === "delete") {
                    Coordinator.deleteParticipant(req, res);
                } else {
                    Coordinator.addParticipant(req)
                        .then(response => {
                            res.redirect(
                                `/events/event/${_.kebabCase(
                                    req.user.eventName
                                )}`
                            );
                        })
                        .catch(error => {
                            res.redirect(
                                `/events/event/${_.kebabCase(
                                    req.user.eventName
                                )}`
                            );
                        });
                }
            } else if (req.user.type === "registrar") {
                Registrar.addParticipant(req, res)
                    .then(() => {
                        req.session.response = {
                            success: "Participant added!",
                            error: undefined
                        };
                        res.redirect(
                            `/events/event/${req.params.eventName}/participants`
                        );
                        req.session.response = undefined;
                    })
                    .catch(() => {
                        req.session.response = {
                            success: "Participant added!",
                            error: undefined
                        };
                        res.redirect(
                            `/events/event/${req.params.eventName}/participants`
                        );
                        req.session.response = undefined;
                    });
            }
        } else {
            res.redirect("/users/login");
        }
    });

module.exports = router;
