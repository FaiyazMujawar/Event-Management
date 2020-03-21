const User = require("../models/User");

class CoordinatorRepo {
    constructor() { }
    async addCoordinator(firstName, lastName, username, password, eventName) {
        return new Promise((resolve, reject) => {
            User.register(
                {
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    type: "coordinator",
                    eventName: eventName
                },
                password,
                (error, user) => {
                    if (error) {
                        console.log(error);
                        const reply = {
                            status: false,
                            msg: "An unexpected error occurred!"
                        };
                        console.log("in some error");
                        return reject(false);
                    } else {
                        if (!user) {
                            const reply = {
                                status: false,
                                msg: "User not saved!"
                            };
                            console.log("in not user saved");
                            return reject(false);
                        } else {
                            const reply = {
                                status: true,
                                msg: null
                            };
                            console.log("in user saved");
                            return resolve(true);
                        }
                    }
                }
            );
        })
    }

    async getCoordinatorEvent(username) {
        return User.findOne({ username: username })
            .then(user => { return Promise.resolve(user.eventName) })
            .catch(() => { return Promise.reject(null) })
    }

    async existsByUsername(username) {
        return new Promise((resolve, reject) => {
            User.findOne({ username: username })
                .then(user => {
                    console.log("user", user);
                    return resolve(true)
                })
                .catch(() => { return reject(false) });
        })
    }
}

module.exports = new CoordinatorRepo();
