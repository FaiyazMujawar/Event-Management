const Event = require("../models/Event");
const coordinatorService = require("./CoordinatorService");
const eventRepo = require("../repos/EventRepo")


class EventService {
    constructor() { }
    async addEvent(name, date, desc) {
        return eventRepo.eventExists(name, date)
            .then(() => {
                const reply = {
                    status: false,
                    msg: "Event already exists!"
                }
                console.log("Event not added,already exists");
                return Promise.reject(reply)
            })
            .catch(() => {
                eventRepo.addEvent(name, date, desc)
                    .then(() => {
                        console.log("Event added");
                        const reply = {
                            status: true,
                            msg: "Event added!"
                        }
                        return Promise.resolve(reply)
                    })
                    .catch(() => {
                        console.log("Event not added");
                        const reply = {
                            status: false,
                            msg: "An unexprected error occured!"
                        }
                        return Promise.reject(reply)
                    })
            })
    }

    async getAllEvents() {
        Event.find()
            .then(events => { return Promise.resolve(events) })
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
