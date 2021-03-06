var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function (req, res) {
    res.render("home");
});

// show register form
router.get("/register", function (req, res) {
    //res.send("here");
    res.render("register");
});

//handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to Soccer Tournament *** " + user.username);
            res.redirect("/");
        });
    });
});

//show login form
router.get("/login", function (req, res) {
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome Back '
    }), function (req, res) {
    });

// logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("back");
});

// change password 
router.get("/changepw", function (req, res) {
    res.render("changePw");
});

router.post("/changePw", function (req, res) {
    User.findOne({ username: req.body.username }, function (err, foundUser) {
        if (err) {
            console.log(err);
            req.flash("error", "Failed to change password");
            return res.redirect("back");
        }
        foundUser.changePassword(req.body.oldpassword, req.body.newpassword, function (err) {
            if (err) {
                console.log(err.message);
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Changed password for " + foundUser.username);
                res.redirect("/login");
            }
        })
    });
});



module.exports = router;