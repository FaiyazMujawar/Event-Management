const User = require("../models/User.js");
const coordinatorRepo = require("../repos/CoordinatorRepo");

class CoordinatorService {
    constructor() {}

    async addCoordinator(firstName, lastName, username, password, eventName) {
        return new Promise((resolve, reject) => {
            coordinatorRepo
                .existsByUsername(username)
                .then(found => {
                    const reply = {
                        status: false,
                        msg: "Username already exists!"
                    };
                    return reject(reply);
                })
                .catch(res => {
                    if (res === false) {
                        coordinatorRepo
                            .addCoordinator(
                                firstName,
                                lastName,
                                username,
                                password,
                                eventName
                            )
                            .then(res => {
                                return resolve(res);
                            })
                            .catch(error => {
                                return reject(error);
                            });
                    } else {
                        const reply = {
                            status: false,
                            msg: "Unexpected error occurred"
                        };
                        return reject(reply);
                    }
                });
        });
    }

    async getEventCoordinators(eventName) {
        return new Promise((resolve, reject) => {
            User.find({ eventName: eventName }, (error, coords) => {
                if (error) {
                    return reject(null);
                } else {
                    if (!coords) {
                        return reject(null);
                    } else {
                        return resolve(coords);
                    }
                }
            });
        });
    }
}

module.exports = new CoordinatorService();
