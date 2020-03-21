const User = require("../models/User.js");
const coordinatorRepo = require("../repos/CoordinatorRepo")

class CoordinatorService {
    constructor() { }
    async addCoordinator(firstName, lastName, username, password, eventName) {
        return new Promise((resolve, reject) => {
            coordinatorRepo.existsByUsername(username)
                .then(user => {
                    console.log(user);
                    console.log("coord not added,already exists");
                    const reply = {
                        status: false,
                        msg: "Username already exists!"
                    }
                    return reject(reply)
                })
                .catch(() => {
                    coordinatorRepo.addCoordinator(firstName, lastName, username, password, eventName)
                        .then(res => {
                            console.log("coord added");
                            console.log("c-add-response", res);
                            return resolve(res)
                        })
                        .catch(res => {
                            console.log("coord not added");
                            console.log("c-add-response", res);
                            return reject(res)
                        })
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
