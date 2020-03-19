const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
const passportLocal = require("passport-local-mongoose");

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    type: String,
    eventName: String
});

UserSchema.plugin(passportLocal);

module.exports = model("User", UserSchema);
