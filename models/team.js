var mongoose = require("mongoose");
var Player = require("../models/player");

var TeamSchema = new mongoose.Schema({
    name: String,
    admin: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    players: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Player"
        }
    ],
    profile_pic: String,
    team_pic: String,
});


TeamSchema.pre('remove', async function(next) {
    await Player.deleteMany({
        _id: {
            $in: this.players
        }
    });
    next();
})

module.exports = mongoose.model("Team", TeamSchema);