const User = require("../models/User.js");
const coordinatorRepo = require("../repos/CoordinatorRepo")

class CoordinatorService {
    constructor() { }
    async addCoordinator(firstName, lastName, username, password, eventName) {
        return coordinatorRepo.existsByUsername(username)
            .then(() => {
                console.log("coord not added,already exists");
                const reply = {
                    status: false,
                    msg: "Username already exists!"
                }
                return Promise.reject(reply)
            })
            .catch(() => {
                coordinatorRepo.addCoordinator(firstName, lastName, username, password, eventName)
                    .then(res => {
                        console.log("coord added");
                        console.log("c-add-response", res);
                        return Promise.resolve(res)
                    })
                    .catch(res => {
                        console.log("coord not added");
                        console.log("c-add-response", res);
                        return Promise.reject(res)
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
