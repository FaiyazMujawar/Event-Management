// const registrarRepo = require("../repos/RegistrarRepo");
const userRepo = require("../repos/UserRepo");

class RegistrarService {
    constructor() {}

    async getEventRegistrars(eventName) {
        return new Promise((resolve, reject) => {
            userRepo
                .getUsers(eventName, "registrar")
                .then(registrars => {
                    return resolve(registrars);
                })
                .catch(() => {
                    return reject(null);
                });
        });
    }

    async addRegistrar(firstName, lastName, username, password, eventName) {
        return new Promise((resolve, reject) => {
            userRepo
                .addUser(
                    firstName,
                    lastName,
                    username,
                    password,
                    eventName,
                    "registrar"
                )
                .then(response => {
                    return resolve(response);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }
}

module.exports = new RegistrarService();
