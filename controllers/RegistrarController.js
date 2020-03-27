const participantService = require("../services/ParticipantService");
const _ = require("lodash");

class Registrar {
    constructor() {}
    getEvent(res) {
        res.render("Registrar", {
            eventURI: _.kebabCase(req.user.eventName)
        });
    }

    addParticipant(req, res) {
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
                console.log("msg:", response.msg);
            })
            .catch(error => {
                console.log("msg:", error.msg);
            });
        res.redirect(`/events/event/${req.params.eventName}`);
    }
}

module.exports = new Registrar();
