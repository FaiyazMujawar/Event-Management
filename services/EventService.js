const Event = require("../models/Event");
const eventRepo = require("../repos/EventRepo");
const coordinatorService = require("../services/CoordinatorService");

class EventService {
    constructor() {}
    async addEvent(name, date, desc) {
        return new Promise((resolve, reject) => {
            eventRepo
                .eventExists(name, date)
                .then(() => {
                    const reply = {
                        status: false,
                        msg: "Event already exists!"
                    };
                    return reject(reply);
                })
                .catch(res => {
                    if (res === false) {
                        eventRepo
                            .addEvent(name, date, desc)
                            .then(() => {
                                const reply = {
                                    status: true,
                                    msg: "Event added!"
                                };
                                return resolve(reply);
                            })
                            .catch(() => {
                                const reply = {
                                    status: false,
                                    msg: "An unexprected error occured!"
                                };
                                return reject(reply);
                            });
                    } else {
                        const reply = {
                            status: false,
                            msg: "Unexpected error occurred!"
                        };
                        return reject(reply);
                    }
                });
        });
    }

    async getAllEvents() {
        return new Promise((resolve, reject) => {
            Event.find((error, events) => {
                if (error) {
                    return reject(null);
                } else {
                    if (!events) {
                        return reject(null);
                    } else {
                        return resolve(events);
                    }
                }
            });
        });
    }

    async getEvent(name) {
        return new Promise((resolve, reject) => {
            eventRepo
                .getEvent(name)
                .then(event => {
                    return resolve(event);
                })
                .catch(() => {
                    return reject(null);
                });
        });
    }
}

module.exports = new EventService();
