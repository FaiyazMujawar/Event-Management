const participantService = require("../services/ParticipantService");
const mail = require("../services/MailService");

class Registrar {
    constructor() {}

    async addParticipant(req, res) {
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
                    mail.sendConfirmation(email, req.user.eventName);
                    return resolve(response);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }
}

module.exports = new Registrar();
