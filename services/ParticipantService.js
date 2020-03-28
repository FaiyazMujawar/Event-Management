const participantRepo = require("../repos/ParticipantRepo");
const _ = require("lodash");

class ParticipantService {
    constructor() {}

    async getAllParticipants(eventName) {
        eventName = _.lowerCase(eventName);
        eventName = eventName.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        return new Promise((resolve, reject) => {
            participantRepo
                .getAllParticipants(eventName)
                .then(participants => {
                    return resolve(participants);
                })
                .catch(() => {
                    return reject(null);
                });
        });
    }

    async addParticipant(firstName, lastName, email, contact, eventName) {
        return new Promise((resolve, reject) => {
            participantRepo
                .existsByEmailAndEvent(email, eventName)
                .then(() => {
                    return reject({
                        status: false,
                        msg: "Participant already exists!"
                    });
                })
                .catch(() => {
                    participantRepo
                        .addParticipant(
                            firstName,
                            lastName,
                            email,
                            contact,
                            eventName
                        )
                        .then(response => {
                            return resolve(response);
                        })
                        .catch(error => {
                            return reject(error);
                        });
                });
        });
    }

    async deleteParticipant(eventName, email) {
        return new Promise((resolve, reject) => {
            participantRepo
                .deleteParticipant(eventName, email)
                .then(() => {
                    return resolve(true);
                })
                .catch(() => {
                    return reject(false);
                });
        });
    }

    async deleteAllParticipants(eventName) {
        return new Promise((resolve, reject) => {
            participantRepo
                .deleteParticipants(eventName)
                .then(() => {
                    return resolve(true);
                })
                .catch(() => {
                    return reject(false);
                });
        });
    }
}

module.exports = new ParticipantService();
