const User = require("../models/User.js");

class CoordinatorService {
    constructor() {}
    addCoordinator(firstName, lastName, username, password, eventName) {
        return User.findOne({ username: username }, (error, user) => {
            if (error) {
                console.log(error);
            } else {
                if (user) {
                    const reply = {
                        status: false,
                        msg: "Co-ordinator already exists!"
                    };
                    return reply;
                } else {
                    return User.register(
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
                                return reply;
                            } else {
                                if (!user) {
                                    const reply = {
                                        status: false,
                                        msg: "User not saved!"
                                    };
                                    return reply;
                                } else {
                                    const reply = {
                                        status: true,
                                        msg: null
                                    };
                                    return reply;
                                }
                            }
                        }
                    );
                }
            }
        });
    }
    getCordinatorEvent(name) {
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
