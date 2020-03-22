const router = require("express").Router();
const coordinatorService = require("../services/CoordinatorService");
const eventService = require("../services/EventService");

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.type === "admin") {
            eventService
                .getAllEvents()
                .then(events => {
                    res.render("Admin", { events: events });
                })
                .catch(() => {
                    res.render("Admin", { events: undefined });
                });
        } else if (req.user.type === "coordinator") {
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
            .addCoordinator(firstName, lastName, username, password, eventName)
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

module.exports = router;
