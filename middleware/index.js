var Team = require("../models/team");
var Player = require("../models/player");

// all the middlewares are here

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You have to be logged in to perform this action");
        res.redirect("/login");
    }
}


middlewareObj.checkTeamOwnership = function(req, res, next) {
    if(!req.isAuthenticated()) {
        req.flash("error", "You have to log in first!");
        return res.redirect("back");
    }
    Team.findById(req.params.team_id, function(err, foundTeam) {
        if(err) {
            req.flash("error", "Team not found");
            return res.redirect("back");
        }
        if(foundTeam.admin.id.equals(req.user._id)) {
            return next();
        } else {
            req.flash("error", "You are not authorized to perform this action");
            return res.redirect("back");
        }
    });
}

middlewareObj.checkPlayerOwnership = function(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You have to log in first!");
        return res.redirect("back");
    }
    Player.findById(req.params.player_id, async function(err, foundPlayer) {
        if(err) {
            req.flash("error", "Player not found");
            return res.redirect("back");
        }
        await foundPlayer.populate('team', 'admin').execPopulate();
        if (foundPlayer.team.admin.id.equals(req.user._id)) {
            return next();
        } else {
            req.flash("error", "You are not authorized to perform this action");
            return res.redirect("back");
        }
    });
}

module.exports = middlewareObj;