const Event = require("../models/Event");
const eventRepo = require("../repos/EventRepo");

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
        Event.find()
            .then(events => {
                if (events) {
                    return Promise.resolve(events);
                }
                Promise.reject(null);
            })
            .catch(error => {
                Promise.reject(error);
            });
    }
}

module.exports = new EventService();
