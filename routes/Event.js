const router = require("express").Router();
const coordinatorService = require("../services/CoordinatorService");
const eventService = require("../services/EventService");
const registrarService = require("../services/RegistrarService");

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === "admin") {
            eventService
                .getEvents()
                .then(events => {
                    res.render("Admin", { events: events });
                })
                .catch(() => {
                    res.render("Admin", { events: undefined });
                });
        } else if (req.user.type === "coordinator") {
            coordinatorService
                .getCoordinatorEvent(req.user.username)
                .then(event => {
                    registrarService
                        .getEventRegistrars(event.name)
                        .then(registrars => {
                            res.render("CoordinatorEvent", {
                                event: event,
                                registrars: registrars
                            });
                        })
                        .catch(() => {
                            res.render("CoordinatorEvent", {
                                event: event,
                                registrars: undefined
                            });
                        });
                })
                .catch(() => {
                    console.log("in coordEvent catch()");
                    res.render("CoordinatorEvent", {
                        event: undefined,
                        coords: undefined
                    });
                });
        }
    } else {
        res.redirect("/users/login");
    }
});

router.get("/event/:eventName", (req, res) => {
    if (req.isAuthenticated() && req.user.type === "admin") {
        eventService
            .getEvent(req.params.eventName)
            .then(event => {
                coordinatorService
                    .getEventCoordinators(req.params.eventName)
                    .then(coords => {
                        res.render("AdminEvent", {
                            event: event,
                            coords: coords
                        });
                    })
                    .catch(() => {
                        res.render("AdminEvent", {
                            event: undefined,
                            coords: undefined
                        });
                    });
            })
            .catch(() => {
                res.render("AdminEvent", { event: undefined });
            });
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
        const {
            eventName,
            date,
            desc,
            firstName,
            lastName,
            username,
            password
        } = req.body;
        coordinatorService
            .addEventCoordinator(
                firstName,
                lastName,
                username,
                password,
                eventName
            )
            .then(response => {
                console.log("msg:", response.msg);
                eventService
                    .addEvent(eventName, date, desc)
                    .then(reply => {
                        console.log("msg", reply.msg);
                    })
                    .catch(err => {
                        console.log("msg", err.msg);
                    });
            })
            .catch(error => {
                console.log("msg", error.msg);
            });
        res.send("yep");
    });

router
    .route("/event/:eventName/registrars")
    .get((req, res) => {
        if (req.isAuthenticated() && req.user.type === "coordinator") {
            res.render("AddRegistrar", { eventName: req.params.eventName });
        }
    })
    .post((req, res) => {
        if (req.isAuthenticated() && req.user.type === "coordinator") {
            const {
                firstName,
                lastName,
                username,
                password,
                eventName
            } = req.body;
            registrarService
                .addRegistrar(
                    firstName,
                    lastName,
                    username,
                    password,
                    eventName
                )
                .then(response => {
                    res.send(response);
                })
                .catch(error => {
                    res.send(error);
                });
        } else {
        }
    });

module.exports = router;
