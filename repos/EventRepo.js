const Event = require("../models/Event")
class EventRepo {
    constructor() { }

    async eventExists(name, date) {
        console.log("in eventExists");
        return new Promise((resolve, reject) => {
            Event.findOne({ name: name, date: date }, (error, event) => {
                if (error) {
                    return reject(null)
                } else {
                    if (!event) {
                        return reject(false)
                    } else {
                        return resolve(true)
                    }
                }
            })
        })
    }

    async addEvent(name, date, desc) {
        console.log("in add event");
        const event = new Event({
            name: name,
            date: date,
            desc: desc
        })
        return new Promise((resolve, reject) => {
            event.save({}, (error, result) => {
                if (error) {
                    return reject(null)
                } else {
                    if (!result) {
                        return reject(false)
                    } else {
                        return resolve(true)
                    }
                }
            })
        })
    }
}

module.exports = new EventRepo()