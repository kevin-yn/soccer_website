var mongoose = require("mongoose");
var passLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    // passport-local-mongoose adds username and password
})

UserSchema.plugin(passLocalMongoose);

module.exports = mongoose.model("User", UserSchema);