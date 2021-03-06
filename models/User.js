const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
const passportLocal = require("passport-local-mongoose");

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    }
});

UserSchema.plugin(passportLocal);

module.exports = model("User", UserSchema);
