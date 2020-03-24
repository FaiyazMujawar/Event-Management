// const coordinatorRepo = require("../repos/CoordinatorRepo");
const userRepo = require("../repos/UserRepo");

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
                .then(found => {
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
        return new Promise((resolve, reject) => {
            return userRepo
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
            return userRepo
                .getUserEvent(username)
                .then(event => {
                    return resolve(event);
                })
                .catch(() => {
                    return reject(null);
                });
        });
    }
}

module.exports = new CoordinatorService();
