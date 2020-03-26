const userRepo = require("../repos/UserRepo");
const _ = require("lodash");

class CoordinatorService {
    constructor() {}

    async addEventCoordinator(
        firstName,
        lastName,
        username,
        password,
        eventName
    ) {
        return new Promise((resolve, reject) => {
            userRepo
                .existsByUsername(username)
                .then(() => {
                    const reply = {
                        status: false,
                        msg: "Username already exists!"
                    };
                    return reject(reply);
                })
                .catch(res => {
                    if (res === false) {
                        userRepo
                            .addUser(
                                firstName,
                                lastName,
                                username,
                                password,
                                eventName,
                                "coordinator"
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
        eventName = _.lowerCase(eventName);
        eventName = eventName.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        return new Promise((resolve, reject) => {
            userRepo
                .getUsers(eventName, "coordinator")
                .then(coords => {
                    return resolve(coords);
                })
                .catch(() => {
                    return reject(null);
                });
        });
    }

    async getCoordinatorEvent(username) {
        return new Promise((resolve, reject) => {
            userRepo
                .getUserEvent(username)
                .then(result => {
                    const event = {
                        event: result,
                        eventURI: _.kebabCase(result.name)
                    };
                    return resolve(event);
                })
                .catch(() => {
                    return reject(null);
                });
        });
    }

    async deleteAllCorrdinators(eventName) {
        return new Promise((resolve, reject) => {
            userRepo
                .deleteAllUsers(eventName, "coordinator")
                .then(() => {
                    return resolve(true);
                })
                .catch(() => {
                    return reject(false);
                });
        });
    }
}

module.exports = new CoordinatorService();
