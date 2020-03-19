const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const EventSchema = new Schema({
    name: String,
    date: Date,
    description: String
});

module.exports = model("Event", EventSchema);
