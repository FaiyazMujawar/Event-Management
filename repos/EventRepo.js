const Event = require("../models/Event")
class EventRepo {
    constructor() { }

    async eventExists(name, date) {
        return Event.findOne({ name: name, date: date })
            .then(() => { return Promise.resolve(true) })
            .catch(() => { return Promise.reject(false) })
    }

    async addEvent(name, date, desc) {
        const event = new Event({
            name: name,
            date: date,
            desc: desc
        })
        return event.save()
            .then(() => { return Promise.resolve(true) })
            .catch(() => { return Promise.reject(false) })
    }
}

module.exports = new EventRepo()