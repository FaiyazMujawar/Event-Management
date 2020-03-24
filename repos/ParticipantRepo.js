const Participant = require("../models/Participant");

class ParticipantRepo {
    constructor() {}
    async getAllParticipants(eventName) {
        return new Promise((resolve, reject) => {
            Participant.find(
                { eventName: eventName },
                (error, participants) => {
                    if (error) {
                        return reject(null);
                    } else {
                        if (!participants) {
                            return reject(null);
                        } else {
                            return resolve(participants);
                        }
                    }
                }
            );
        });
    }
}

module.exports = new ParticipantRepo();
