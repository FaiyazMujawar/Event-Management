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
                            .getAllParticipants(event.event.name)
                            .then(participants => {
                                console.log(event);
                                console.log(event.eventURI);
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

    deleteParticipant(req, res) {
        const { eventName, email } = req.body;
        participantService
            .deleteParticipant(eventName, email)
            .then(() => {
                res.send({
                    status: true,
                    msg: "Participant Deleted"
                });
            })
            .catch(() => {
                res.send({
                    status: true,
                    msg: "Participant Deleted"
                });
            });
    }
}

module.exports = new Coordinator();
