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
    async getCordinatorEvent(name) {
        User.find({ username: name }, (error, user) => {
            if (error) {
                console.log(error);
                return null;
            } else {
                return user.eventName;
            }
        });
    }
}

module.exports = new CoordinatorService();
