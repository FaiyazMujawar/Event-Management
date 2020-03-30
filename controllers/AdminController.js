const coordinatorService = require("../services/CoordinatorService");
const eventService = require("../services/EventService");
const registrarService = require("../services/RegistrarService");
const participantService = require("../services/ParticipantService");
const _ = require("lodash");
class Admin {
    constructor() {}
    getAllEvents(res) {
        eventService
            .getEvents()
            .then(events => {
                res.render("Admin", { events: events });
            })
            .catch(() => {
                res.render("Admin", { events: undefined });
            });
    }

    getEvent(req, res) {
        eventService
            .getEvent(req.params.eventName)
            .then(event => {
                const name = event.name;
                coordinatorService
                    .getEventCoordinators(req.params.eventName)
                    .then(coords => {
                        res.render("AdminEvent", {
                            event: event,
                            eventURI: _.kebabCase(name),
                            coords: coords
                        });
                    })
                    .catch(() => {
                        res.render("AdminEvent", {
                            event: undefined,
                            coords: undefined,
                            eventURI: undefined
                        });
                    });
            })
            .catch(() => {
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
                console.log("msg:", response.msg);
                eventService
                    .addEvent(eventName, date, desc)
                    .then(reply => {
                        console.log("msg", reply.msg);
                        res.redirect("/events");
                    })
                    .catch(err => {
                        console.log("msg", err.msg);
                        res.redirect("/events");
                    });
            })
            .catch(error => {
                console.log("msg", error.msg);
                res.redirect("/events");
            });
    }

    updateEvent(req, res) {
        const { oldname, eventName, date, desc } = req.body;
        eventService
            .updateEvent(oldname, eventName, date, desc)
            .then(response => {
                res.redirect(`/events/event/${_.kebabCase(eventName)}`);
            })
            .catch(error => {
                res.redirect(`/events/event/${_.kebabCase(eventName)}`);
            });
    }

    deleteEvent(req, res) {
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
                                    .deleteAllParticipants(eventName)
                                    .then(() => {
                                        /* res.send({
                                            status: true,
                                            msg: "Event deleted"
                                        }); */
                                        res.redirect("/events");
                                    })
                                    .catch(() => {
                                        res.redirect("/events");
                                        /* res.send({
                                            status: true,
                                            msg:
                                                "Event deleted,participants not deleted"
                                        }); */
                                    });
                            })
                            .catch(() => {
                                res.send({
                                    status: true,
                                    msg: "Event deleted,registrars not deleted"
                                });
                            });
                    })
                    .catch(() => {
                        res.send({
                            status: false,
                            msg: "Event deleted,co-ordiantors deletion failed"
                        });
                    });
            })
            .catch(error => {
                res.send(error);
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
