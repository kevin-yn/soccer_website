var express = require("express");
var router = express.Router();

var Team        = require("../models/team"),
    Player      = require("../models/player"),
    middlewareObj = require("../middleware/index");

// ======================
// TEAM ROUTES
// ======================

// INDEX - show all teams
router.get("/", function(req, res) {
    Team.find({}, function(err, allTeams) {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("teams/index", {teams: allTeams});
        }
    });
});

// CREATE - add new team
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    res.render("teams/new");
});

router.post("/", middlewareObj.isLoggedIn, function(req, res) {
    var team = req.body.team;
    var players = req.body.players;
    Team.create(team, async function(err, newTeam) {
        if(err) {
            console.log(err);
            return res.redirect("back");
        }
        // add players
        for(var i = 0; i < 5; i++) {
            if(players[i] != "") {
                var newPlayer = new Player({
                    name: players[i],
                    team: newTeam._id
                })
                newPlayer.save();
                newTeam.players.push(newPlayer);
            }
        }
        // add admin of the team
        newTeam.admin.id = req.user._id;
        newTeam.admin.name = req.user.username;
        newTeam.save();
        res.redirect("/teams");
    });
});

// SHOW - show more info about an existing Team
router.get("/:team_id", function(req, res) {
    Team.findById(req.params.team_id).populate("players").exec(function(err, foundTeam) {
        if(err) {
            console.log(err);
            return res.redirect("back");
        } 
        if (!foundTeam) {
            req.flash("error", "Team not found");
            return res.redirect("back");
        }
        res.render("teams/show", {team: foundTeam});
    });
});

// EDIT - edit an existing Team
router.get("/:team_id/edit", middlewareObj.checkTeamOwnership, function(req, res) {
    Team.findById(req.params.team_id, function(err, foundTeam) {
        if(err) {
            console.log(err);
            return res.redirect("back");
        } 
        if (!foundTeam) {
            req.flash("error", "Team not found");
            return res.redirect("back");
        }
        res.render("teams/edit", { team: foundTeam });
    });
});

router.put("/:team_id", middlewareObj.checkTeamOwnership, function(req, res) {
    Team.findByIdAndUpdate(req.params.team_id, req.body.team, function(err, foundTeam) {
        if(err) {
            console.log(err);
            return res.redirect("back");
        } 
        if (!foundTeam) {
            req.flash("error", "Team not found");
            return res.redirect("back");
        }
        res.redirect("/teams/" + req.params.team_id);
    });
});

// DELETE - delete an existing Team
router.delete("/:team_id", middlewareObj.checkTeamOwnership, async function(req, res) {
    try {
        let foundTeam = await Team.findById(req.params.team_id);
        if (!foundTeam) {
            req.flash("error", "Team not found");
            return res.redirect("back");
        }
        await foundTeam.remove();
        req.flash("success", "Team: " + foundTeam.name + " deleted");
        res.redirect("/teams");
    } catch (error) {
        console.log(error.message);
        res.redirect("/teams");
    }
});

module.exports = router;

