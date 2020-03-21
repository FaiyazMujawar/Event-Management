const Event = require("../models/Event");
const coordinatorService = require("./CoordinatorService");
const eventRepo = require("../repos/EventRepo")


class EventService {
    constructor() { }
    async addEvent(name, date, desc) {
        return new Promise((resolve, reject) => {
            eventRepo.eventExists(name, date)
                .then(res => {
                    if (res) {
                        const reply = {
                            status: false,
                            msg: "Event already exists!"
                        }
                        console.log("Event not added,already exists");
                        return reject(reply)
                    }
                })
                .catch(res => {
                    if (res === false) {
                        eventRepo.addEvent(name, date, desc)
                            .then(result => {
                                if (result) {
                                    console.log("Event added");
                                    const reply = {
                                        status: true,
                                        msg: "Event added!"
                                    }
                                    return resolve(reply)
                                }
                            })
                            .catch(result => {
                                console.log("Event not added");
                                const reply = {
                                    status: false,
                                    msg: "An unexprected error occured!"
                                }
                                return reject(reply)
                            })
                    } else {
                        const reply = {
                            status: false,
                            msg: "Unexpected error occurred!"
                        }
                        return reject(reply)
                    }
                })
        })
    }

    async getAllEvents() {
        Event.find()
            .then(events => {
                if (events) {
                    return Promise.resolve(events)
                }
                Promise.reject(null)
            })
            .catch(error => { Promise.reject(error) })
    }

    getEventByCoordinator(name) {
        event = coordinatorService.getCordinatorEvent(name);
        Event.find({ name: event }, (error, events) => {
            if (error) {
                console.log(error);
                return null;
            } else {
                return events;
            }
        });
    }
}

module.exports = new EventService();
