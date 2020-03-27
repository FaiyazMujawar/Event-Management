const coordinatorService = require("../services/CoordinatorService");
const registrarService = require("../services/RegistrarService");
const participantService = require("../services/ParticipantService");

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
}

module.exports = new Coordinator();
