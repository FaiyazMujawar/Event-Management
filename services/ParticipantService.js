const participantRepo = require("../repos/ParticipantRepo");

class ParticipantService {
    constructor() {}
    async getAllParticipants(eventName) {
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
}
