const router = require("express").Router();
const eventService = require("../Services/EventService");
const coordinatorService = require("../Services/CoordinatorService");

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
        let cReply = coordinatorService.addCoordinator(
            firstName,
            lastName,
            username,
            password,
            eventName
        );
        console.log("status", cReply.status, "msg", cReply.msg);
        if (cReply.status) {
            console.log("co-ord saved");
            let eReply = eventService.addEvent(eventName, date, desc);
            if (eReply.status) {
                console.log("event saved");
            } else {
                console.log(eReply.msg);
            }
        } else {
            console.log(cReply.msg);
        }
        res.send("yep");
    });
module.exports = router;
