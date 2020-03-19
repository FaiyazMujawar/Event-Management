const router = require("express").Router();
const eventService = require("../Services/EventService");

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("Admin");
    } else {
        events = eventService.getAllEvents();
        res.redirect("/users/login", { events: event });
    }
});
module.exports = router;
