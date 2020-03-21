const router = require("express").Router();
const eventService = require("../services/EventService");
const coordinatorService = require("../services/CoordinatorService");

router.get("/", (req, res) => {
    /* if (req.isAuthenticated()) {
        events = eventService.getAllEvents();
        res.render("Admin", { events: events });
    } else {
        res.redirect("/users/login");
    } */
    let events = eventService.getAllEvents();
    res.render("Admin", { events: events });
});

router
    .route("/events/add")
    .get((req, res) => {
        /* if (req.isAuthenticated()) {
            res.render("AddEvent");
        } else {
            res.redirect("/users/login");
        } */
        res.render("AddEvent");
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

        coordinatorService.addCoordinator(
            firstName,
            lastName,
            username,
            password,
            eventName
        )
            .then(reply => {
                console.log("c-msg", reply.msg);
                eventService.addEvent(name, date, desc)
                    .then(reply => {
                        console.log("Event saved");
                        console.log(reply.msg);
                    })
                    .catch(reply => {
                        console.log("e-msg", reply.msg);
                    })
            })
            .catch(reply => {
                console.log(reply.msg);
            })



        res.send("yep");
    });
module.exports = router;
