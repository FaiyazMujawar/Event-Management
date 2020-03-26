const User = require("../models/User");
const eventRepo = require("./EventRepo");

class UserRepo {
    constructor() {}

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

    async getUsers(eventName, type) {
        return new Promise((resolve, reject) => {
            User.find({ eventName: eventName, type: type }, (error, users) => {
                if (error) {
                    return reject(null);
                } else {
                    if (!users) {
                        return reject(null);
                    } else {
                        return resolve(users);
                    }
                }
            });
        });
    }

    async getUserEvent(username) {
        return new Promise((resolve, reject) => {
            User.findOne({ username: username }, (error, user) => {
                if (error) {
                    return reject(null);
                } else {
                    if (!user) {
                        return reject(null);
                    } else {
                        return eventRepo
                            .getEvent(user.eventName)
                            .then(event => {
                                return resolve(event);
                            })
                            .catch(() => {
                                return reject(null);
                            });
                    }
                }
            });
        });
    }

    async addUser(firstName, lastName, username, password, eventName, type) {
        return new Promise((resolve, reject) => {
            User.register(
                {
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    type: type,
                    eventName: eventName
                },
                password,
                (error, user) => {
                    if (error) {
                        const reply = {
                            status: null,
                            msg: "An unexpected error occurred!"
                        };
                        return reject(reply);
                    } else {
                        if (!user) {
                            const reply = {
                                status: false,
                                msg: "User not saved!"
                            };
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

    async deleteAllUsers(eventName, type) {
        return new Promise((resolve, reject) => {
            User.deleteMany({ eventName: eventName, type: type }, error => {
                if (error) {
                    return reject(false);
                } else {
                    return resolve(true);
                }
            });
        });
    }
}

module.exports = new UserRepo();
