const coordinatorService = require("../services/CoordinatorService");
const eventService = require("../services/EventService");
const registrarService = require("../services/RegistrarService");
const participantService = require("../services/ParticipantService");
class Admin {
    constructor() {}
    async getAllEvents() {
        return new Promise((resolve, reject) => {
            eventService
                .getEvents()
                .then(events => {
                    return resolve(events);
                })
                .catch(() => {
                    return reject(null);
                });
        });
    }

    getEvent(req, res) {
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

    addEvent(req, res) {
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
                eventService
                    .addEvent(eventName, date, desc)
                    .then(reply => {
                        console.log("msg", reply.msg);
                        req.session.response = {
                            success: reply.msg,
                            error: undefined
                        };
                        res.redirect("/events");
                    })
                    .catch(err => {
                        req.session.response = {
                            success: undefined,
                            error: err.msg
                        };
                        res.redirect("/events");
                    });
            })
            .catch(error => {
                req.session.response = {
                    success: undefined,
                    error: error.msg
                };
                res.redirect("/events");
            });
    }

    updateEvent(req, res) {
        const { oldname, eventName, date, desc } = req.body;
        eventService
            .updateEvent(oldname, eventName, date, desc)
            .then(response => {
                req.session.response = {
                    success: "Event updated!",
                    error: undefined
                };
                res.redirect("/events");
            })
            .catch(error => {
                req.session.response = {
                    success: undefined,
                    error: "Event updation failed!"
                };
                res.redirect("/events");
            });
    }

    deleteEvent(req, res) {
        const eventName = req.body.eventName;
        participantService
            .deleteAllParticipants(eventName)
            .then(() => {
                registrarService
                    .deleteAllRegistrars(eventName)
                    .then(() => {
                        coordinatorService
                            .deleteAllCorrdinators(eventName)
                            .then(() => {
                                eventService
                                    .deleteEvent(eventName)
                                    .then(() => {
                                        req.session.response = {
                                            success: "Event Deleted!",
                                            error: undefined
                                        };
                                        res.redirect("/events");
                                    })
                                    .catch(() => {
                                        req.session.response = {
                                            success: undefined,
                                            error: "Event deletion failed!"
                                        };
                                        res.redirect("/events");
                                    });
                            })
                            .catch(() => {
                                req.session.response = {
                                    success: undefined,
                                    error: "Event deletion failed!"
                                };
                                res.redirect("/events");
                            });
                    })
                    .catch(() => {
                        req.session.response = {
                            success: undefined,
                            error: "Event deletion failed!"
                        };
                        res.redirect("/events");
                    });
            })
            .catch(() => {
                req.session.response = {
                    success: undefined,
                    error: "Event deletion failed!"
                };
                res.redirect("/events");
            });
    }
}

module.exports = new Admin();
