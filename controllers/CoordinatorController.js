const coordinatorService = require("../services/CoordinatorService");
const registrarService = require("../services/RegistrarService");
const participantService = require("../services/ParticipantService");
const _ = require("lodash");

class Coordinator {
    constructor() {}

    getEvent(req, res) {
        coordinatorService
            .getCoordinatorEvent(req.user.username)
            .then(event => {
                registrarService
                    .getEventRegistrars(event.event.name)
                    .then(registrars => {
                        participantService
                            .getAllParticipants(event.event.name)
                            .then(participants => {
                                res.render("Coordinator", {
                                    event: event.event,
                                    eventURI: event.eventURI,
                                    registrars: registrars,
                                    participants: participants
                                });
                            })
                            .catch(() => {
                                console.log(event);
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
    }

    addRegistrar(req, res) {
        const { firstName, lastName, username, password } = req.body;
        const eventName = req.user.eventName;
        console.log("event", eventName);
        registrarService
            .addRegistrar(firstName, lastName, username, password, eventName)
            .then(response => {
                res.send(response);
            })
            .catch(error => {
                res.send(error);
            });
    }

    deleteRegistrar(req, res) {
        const { eventName, username } = req.body;
        registrarService
            .deleteRegistrar(eventName, username)
            .then(() => {
                res.send({
                    status: true,
                    msg: "Registrar Deleted"
                });
            })
            .catch(() => {
                res.send({
                    status: false,
                    msg: "Registrar not Deleted"
                });
            });
    }

    async addParticipant(req) {
        return new Promise((resolve, reject) => {
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
                    return resolve(response);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    deleteParticipant(req, res) {
        const { eventName, email } = req.body;
        participantService
            .deleteParticipant(eventName, email)
            .then(() => {
                res.redirect(
                    `/events/event/${_.kebabCase(req.user.eventName)}`
                );
            })
            .catch(() => {
                res.redirect(
                    `/events/event/${_.kebabCase(req.user.eventName)}`
                );
            });
    }
}

module.exports = new Coordinator();
