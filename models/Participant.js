const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
const ParticipantSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    }
});

module.exports = model("Participant", ParticipantSchema);
