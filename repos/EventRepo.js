const Event = require("../models/Event");
class EventRepo {
    constructor() {}

    async eventExists(name, date) {
        return new Promise((resolve, reject) => {
            Event.findOne({ name: name, date: date }, (error, event) => {
                if (error) {
                    return reject(null);
                } else {
                    if (!event) {
                        return reject(false);
                    } else {
                        return resolve(true);
                    }
                }
            });
        });
    }

    async addEvent(name, date, desc) {
        const event = new Event({
            name: name,
            date: date,
            description: desc
        });
        return new Promise((resolve, reject) => {
            event.save({}, (error, result) => {
                if (error) {
                    return reject(null);
                } else {
                    if (!result) {
                        return reject(false);
                    } else {
                        return resolve(true);
                    }
                }
            });
        });
    }

    async getEvent(eventName) {
        return new Promise((resolve, reject) => {
            Event.findOne({ name: eventName }, (error, event) => {
                if (error) {
                    return reject(null);
                } else {
                    if (!event) {
                        return reject(null);
                    } else {
                        return resolve(event);
                    }
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

    async deleteEvent(eventName) {
        return new Promise((resolve, reject) => {
            Event.deleteOne({ name: eventName }, error => {
                if (error) {
                    return reject(false);
                } else {
                    return resolve(true);
                }
            });
        });
    }
}

module.exports = new EventRepo();
