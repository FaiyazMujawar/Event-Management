const router = require("express").Router();
const _ = require("lodash");
const coordinatorService = require("../services/CoordinatorService");
const eventService = require("../services/EventService");
const registrarService = require("../services/RegistrarService");
const participantService = require("../services/ParticipantService");

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
                        .getEventRegistrars(event.event.name)
                        .then(registrars => {
                            participantService
                                .getAllParticipants(event.name)
                                .then(participants => {
                                    res.render("Coordinator", {
                                        event: event.event,
                                        eventURI: event.eventURI,
                                        registrars: registrars,
                                        participants: participants
                                    });
                                })
                                .catch(() => {
                                    res.render("Coordinator", {
                                        event: event.event,
                                        eventURI: event.eventURI,
                                        registrars: registrars,
                                        participants: undefined
                                    });
                                });
                        })
                        .catch(() => {
                            res.render("Coordinator", {
                                event: event.event,
                                eventURI: event.eventURI,
                                registrars: undefined,
                                participants: undefined
                            });
                        });
                })
                .catch(() => {
                    res.render("Coordinator", {
                        event: undefined,
                        eventURI: undefined,
                        coords: undefined,
                        participants: undefined
                    });
                });
        } else if (req.user.type === "registrar") {
            res.render("Registrar", {
                eventURI: _.kebabCase(req.user.eventName)
            });
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
                        res.render("AdminEvent", {
                            event: undefined,
                            coords: undefined
                        });
                    });
            }
        }
    })
    .post((req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.type === "admin") {
                if (req.body.action === "delete") {
                    const eventName = req.body.eventName;
                    eventService
                        .deleteEvent(eventName)
                        .then(() => {
                            coordinatorService
                                .deleteAllCorrdinators(eventName)
                                .then(() => {
                                    registrarService
                                        .deleteAllRegistrars(eventName)
                                        .then(() => {
                                            participantService
                                                .deleteAllParticipants(
                                                    eventName
                                                )
                                                .then(() => {
                                                    res.send({
                                                        status: true,
                                                        msg: "Event deleted"
                                                    });
                                                })
                                                .catch(() => {
                                                    res.send({
                                                        status: true,
                                                        msg:
                                                            "Event deleted,participants not deleted"
                                                    });
                                                });
                                        })
                                        .catch(() => {
                                            res.send({
                                                status: true,
                                                msg:
                                                    "Event deleted,registrars not deleted"
                                            });
                                        });
                                })
                                .catch(() => {
                                    res.send({
                                        status: false,
                                        msg:
                                            "Event deleted,co-ordiantors deletion failed"
                                    });
                                });
                        })
                        .catch(error => {
                            res.send(error);
                        });
                } else {
                    const { oldname, eventName, date, desc } = req.body;
                    eventService
                        .updateEvent(oldname, eventName, date, desc)
                        .then(response => {
                            res.send(response);
                        })
                        .catch(error => {
                            res.send(error);
                        });
                }
            } else if (req.user.type === "registrar") {
                const { firstName, lastName, email, contact } = req.body;
                participantService
                    .addParticipant(
                        firstName,
                        lastName,
                        email,
                        contact,
                        req.user.eventName
                    )
                    .then(response => {
                        console.log("msg:", response.msg);
                    })
                    .catch(error => {
                        console.log("msg:", error.msg);
                    });
                res.redirect(`/events/event/${req.params.eventName}`);
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
        let {
            eventName,
            date,
            desc,
            firstName,
            lastName,
            username,
            password
        } = req.body;
        eventName = eventName.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
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
            res.render("AddRegistrar");
        }
    })
    .post((req, res) => {
        if (req.isAuthenticated() && req.user.type === "coordinator") {
            const { firstName, lastName, username, password } = req.body;
            const eventName = req.user.eventName;
            console.log("event", eventName);
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
