const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const EventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = model("Event", EventSchema);
