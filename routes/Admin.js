const router = require("express").Router();
const eventService = require("../services/EventService");
const coordinatorService = require("../services/CoordinatorService");

router.get("/", (req, res) => {
    if (req.isAuthenticated() && req.user.type === "admin") {
        eventService
            .getAllEvents()
            .then(events => {
                res.render("Admin", { events: events });
            })
            .catch(() => {
                res.render("Admin", { events: {} });
            });
    } else {
        res.redirect("/users/login");
    }
});

router
    .route("/events/add")
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
