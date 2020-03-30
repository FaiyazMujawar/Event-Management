const coordinatorService = require("../services/CoordinatorService");
const eventService = require("../services/EventService");
const registrarService = require("../services/RegistrarService");
const participantService = require("../services/ParticipantService");
const _ = require("lodash");
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
                const name = event.event.name;
                coordinatorService
                    .getEventCoordinators(name)
                    .then(coords => {
                        res.render("AdminEvent", {
                            event: event.event,
                            coords: coords,
                            eventURI: event.eventURI
                        });
                    })
                    .catch(() => {
                        res.render("AdminEvent", {
                            event: event,
                            coords: undefined,
                            eventURI: event.eventURI
                        });
                    });
            })
            .catch(error => {
                console.log("here", error);
                res.render("AdminEvent", {
                    event: undefined,
                    coords: undefined,
                    eventURI: undefined
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

    deleteCoordinator(req, res) {
        coordinatorService
            .deleteCoordinator(req.params.eventName, req.body.username)
            .then(() => {
                res.redirect(`/events/event/${req.params.eventName}`);
            })
            .catch(() => {
                res.redirect(`/events/event/${req.params.eventName}`);
            });
    }

    async addCoordinator(req) {
        return new Promise((resolve, reject) => {
            const { firstName, lastName, username, password } = req.body;
            coordinatorService
                .addEventCoordinator(
                    firstName,
                    lastName,
                    username,
                    password,
                    req.body.eventName
                )
                .then(response => {
                    return resolve(true);
                })
                .catch(error => {
                    return reject(false);
                });
        });
    }
}

module.exports = new Admin();
