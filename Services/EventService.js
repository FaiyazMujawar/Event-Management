const Event = require("../models/Event");
const coordinatorService = require("../Services/CoordinatorService");

class EventService {
    constructor() {}
    addEvent(name, date, desc) {
        return Event.findOne({ name: name, date: date }, (error, event) => {
            if (error) {
                const reply = {
                    status: false,
                    msg: error
                };
                return reply;
            } else {
                if (!event) {
                    const event = new Event({
                        name: name,
                        date: date,
                        description: desc
                    });
                    return event
                        .save()
                        .then(() => {
                            const reply = {
                                status: true,
                                msg: null
                            };
                            return reply;
                        })
                        .catch(error => {
                            console.log(error);
                            const reply = {
                                status: false,
                                msg: error
                            };
                            return reply;
                        });
                } else {
                    const reply = {
                        status: false,
                        msg: "Event already exists!"
                    };
                    return reply;
                }
            }
        });
    }

    getAllEvents() {
        Event.find((error, events) => {
            if (error) {
                console.log(error);
                return null;
            } else {
                return events;
            }
        });
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
