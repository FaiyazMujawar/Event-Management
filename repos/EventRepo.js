const Event = require("../models/Event")
class EventRepo {
    constructor() { }

    async eventExists(name, date) {
        return new Promise((resolve, reject) => {
            Event.findOne({ name: name, date: date })
                .then(() => { return resolve(true) })
                .catch(() => { return reject(false) })
        })
    }

    async addEvent(name, date, desc) {
        const event = new Event({
            name: name,
            date: date,
            desc: desc
        })
        return new Promise((resolve, reject) => {
            event.save()
                .then(() => { return resolve(true) })
                .catch(() => { return reject(false) })
        })
    }
}

module.exports = new EventRepo()