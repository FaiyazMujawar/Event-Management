const Event = require("../models/User");

class EventService {
    constructor() {}
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
}

module.exports = new EventService();
