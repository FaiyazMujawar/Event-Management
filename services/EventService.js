const eventRepo = require("../repos/EventRepo");
const _ = require("lodash");

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
                        name = name.replace(/\w\S*/g, function(txt) {
                            return (
                                txt.charAt(0).toUpperCase() +
                                txt.substr(1).toLowerCase()
                            );
                        });
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

    async getEvents() {
        return new Promise((resolve, reject) => {
            return eventRepo
                .getAllEvents()
                .then(result => {
                    const events = [];
                    result.forEach(event => {
                        events.push({
                            id: event._id,
                            name: event.name,
                            date: event.date,
                            desc: event.description,
                            eventURI: _.kebabCase(event.name)
                        });
                    });
                    return resolve(events);
                })
                .catch(() => {
                    return reject(null);
                });
        });
    }

    async getEvent(name) {
        name = _.lowerCase(name);
        name = name.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
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

    async deleteEvent(name) {
        return new Promise((resolve, reject) => {
            eventRepo
                .deleteEvent(name)
                .then(() => {
                    return resolve({
                        status: true,
                        msg: "Event deleted!"
                    });
                })
                .catch(() => {
                    return reject({
                        status: false,
                        msg: "Event not deleted!"
                    });
                });
        });
    }
}

module.exports = new EventService();
