var mongoose        = require("mongoose");

var PlayerSchema = new mongoose.Schema({
    name: String,
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    }
});
// working on why foundPlayer.remove() does not remove the item

PlayerSchema.pre('remove', async function(next) {
    await this.populate('team').execPopulate();
    var team = this.team;
    var players = this.team.players;
    for(var i = 0; i < players.length; i++) {
        if(players[i].equals(this._id)) {
            players.splice(i, 1);
            team.players = players;
            team.save();
            break;
        }
    }
    next();
});

module.exports = mongoose.model("Player", PlayerSchema);