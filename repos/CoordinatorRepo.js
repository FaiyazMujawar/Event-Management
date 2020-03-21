const User = require("../models/User");

class CoordinatorRepo {
    constructor() { }
    async addCoordinator(firstName, lastName, username, password, eventName) {
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
                    console.log("in some error");
                    return Promise.reject(false);
                } else {
                    if (!user) {
                        const reply = {
                            status: false,
                            msg: "User not saved!"
                        };
                        console.log("in not user saved");
                        return Promise.reject(false);
                    } else {
                        const reply = {
                            status: true,
                            msg: null
                        };
                        console.log("in user saved");
                        return Promise.resolve(true);
                    }
                }
            }
        );
    }

    async getCoordinatorEvent(username) {
        return User.findOne({ username: username })
            .then(user => { return Promise.resolve(user.eventName) })
            .catch(() => { return Promise.reject(null) })
    }

    async existsByUsername(username) {
        return User.findOne({ username: username })
            .then(() => { return Promise.resolve(true) })
            .catch(() => { return Promise.reject(false) });
    }
}

module.exports = new CoordinatorRepo();
