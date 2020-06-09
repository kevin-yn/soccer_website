var express = require("express");
var router = express.Router();

var Team = require("../models/team"),
    Player = require("../models/player"),
    middlewareObj = require("../middleware/index");

// ======================
// TEAM ROUTES
// ======================

// INDEX - show the list of all the players
router.get("", function(req, res) {
    Player.find({}, async function(err, players) {
        if(err) {
            console.log(err);
            res.redirect("back");
            return;
        }
        for (var i in players) {
            await players[i].populate('team', 'profile_pic').execPopulate();
        };
        res.render("players/index", {players: players});
    });
});

// CREATE - add a new player to the team
router.post("", middlewareObj.checkPlayerOwnership, function(req, res) {
    Team.findById(req.body.team_id, function(err, foundTeam) {
        if(err) {
            console.log(err);
            req.flash("error", "Failed to add player");
            return res.redirect("back");
        }
        var newPlayer = new Player({
            name: req.body.player.name,
            team: foundTeam._id
        })
        newPlayer.save();
        foundTeam.players.push(newPlayer);
        foundTeam.save();
        res.redirect("back");
    })
})

// Delete - delete a player and update the team
router.delete("/:player_id", middlewareObj.checkPlayerOwnership, async function(req, res) {
    Player.findById(req.params.player_id, function(err, foundPlayer) {
        if(err) {
            console.log(err);
        } else {
            foundPlayer.remove();
            req.flash("success", "Player: " + foundPlayer.name + " deleted");
        }
        res.redirect("back");
    });
});









module.exports = router;