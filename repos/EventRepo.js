const Event = require("../models/Event")
class EventRepo {
    constructor() { }

    async eventExists(name, date) {
        return new Promise((resolve, reject) => {
            Event.findOne({ name: name, date: date })
                .then(event => {
                    if (event) {
                        return resolve(true)
                    }
                    return reject(false)
                })
                .catch(() => { return reject(null) })
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
                .then(result => {
                    if (result) {
                        return resolve(true)
                    }
                    return reject(false)
                })
                .catch(() => { return reject(null) })
        })
    }
}

module.exports = new EventRepo()