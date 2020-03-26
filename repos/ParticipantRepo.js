const Participant = require("../models/Participant");

class ParticipantRepo {
    constructor() {}

    async existsByEmailAndEvent(email, eventName) {
        return new Promise((resolve, reject) => {
            Participant.findOne(
                { email: email, eventName: eventName },
                (error, participant) => {
                    if (error) {
                        return reject(null);
                    } else {
                        if (!participant) {
                            return reject(false);
                        } else {
                            return resolve(true);
                        }
                    }
                }
            );
        });
    }

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

    async addParticipant(firstName, lastName, email, contact, eventName) {
        const participant = new Participant({
            firstName: firstName,
            lastName: lastName,
            email: email,
            contact: contact,
            eventName: eventName
        });
        return new Promise((resolve, reject) => {
            participant.save({}, (error, result) => {
                if (error) {
                    return reject({
                        status: null,
                        msg: "Unexpected error occurred!"
                    });
                } else {
                    if (!result) {
                        return reject({
                            status: false,
                            msg: "User not saved!"
                        });
                    } else {
                        return resolve({
                            status: true,
                            msg: "User saved!"
                        });
                    }
                }
            });
        });
    }

    async deleteParticipants(eventName) {
        return new Promise((resolve, reject) => {
            Participant.deleteMany({ eventName: eventName }, error => {
                if (error) {
                    return reject(false);
                } else {
                    return resolve(true);
                }
            });
        });
    }
}

module.exports = new ParticipantRepo();
