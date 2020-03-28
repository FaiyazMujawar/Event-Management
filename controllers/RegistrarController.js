const participantService = require("../services/ParticipantService");
const _ = require("lodash");

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
                    return resolve(response);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }
}

module.exports = new Registrar();
