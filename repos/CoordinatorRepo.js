const User = require("../models/User");

class CoordinatorRepo {
    constructor() {}
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
                            status: null,
                            msg: "An unexpected error occurred!"
                        };
                        console.log("in some error");
                        return reject(reply);
                    } else {
                        if (!user) {
                            const reply = {
                                status: false,
                                msg: "User not saved!"
                            };
                            console.log("in not user saved");
                            return reject(reply);
                        } else {
                            const reply = {
                                status: true,
                                msg: "User added!"
                            };
                            return resolve(reply);
                        }
                    }
                }
            );
        });
    }

    async existsByUsername(username) {
        return new Promise((resolve, reject) => {
            User.findOne({ username: username }, (error, user) => {
                if (error) {
                    return reject(null);
                } else {
                    if (!user) {
                        return reject(false);
                    } else {
                        return resolve(true);
                    }
                }
            });
        });
    }
}

module.exports = new CoordinatorRepo();
