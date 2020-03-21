const User = require("../models/User.js");
const coordinatorRepo = require("../repos/CoordinatorRepo")

class CoordinatorService {
    constructor() { }
    async addCoordinator(firstName, lastName, username, password, eventName) {
        return new Promise((resolve, reject) => {
            coordinatorRepo.existsByUsername(username)
                .then(found => {
                    if (found) {
                        console.log("coord not added,already exists");
                        const reply = {
                            status: false,
                            msg: "Username already exists!"
                        }
                        return reject(reply)
                    } else {
                        /* coordinatorRepo.addCoordinator(firstName, lastName, username, password, eventName)
                            .then(res => {
                                if (res.status) {
                                    console.log("coord added");
                                    console.log("c-add-response", res);
                                    return resolve(res)
                                }
                                console.log("coord not added");
                                console.log("c-add-response", res);
                                return reject(res)
                            })
                            .catch(error => {
                                return reject(error)
                            }) */
                    }
                })
                .catch(res => {
                    if (res === false) {
                        coordinatorRepo.addCoordinator(firstName, lastName, username, password, eventName)
                            .then(res => {
                                if (res.status) {
                                    console.log("coord added");
                                    console.log("c-add-response", res);
                                    return resolve(res)
                                }

                            })
                            .catch(error => {
                                console.log("coord not added");
                                console.log("c-add-response", error);
                                return reject(error)
                            })
                    } else {
                        const reply = {
                            status: false,
                            msg: "Unexpected error occurred"
                        }
                        return reject(reply)
                    }
                })
        })
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
