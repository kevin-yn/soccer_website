var express             = require("express"),
    app                 = express(),
    flash               = require("connect-flash");
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    LocalStrategy       = require("passport-local").Strategy,
    middlewareObj       = require("./middleware/index");

// =============
// Basic Setup
// =============
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(flash());
 
// ==========================
// Setup and Config MongoDB
// ==========================
mongoose.connect("mongodb+srv://Calvin:attitude005258@yelpcamp-rtxbd.mongodb.net/test?retryWrites=true&w=majority", 
    { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(function() {
    console.log("successfully connected to database");
}).catch(function(err) {
    console.log("ERR database", err.message);
});

// =============
// SCHEMA SETUP
// =============
var User        = require("./models/user");

// ==========================
// Setup and Config PASSPORT
// ==========================
app.use(require("express-session")({ // use express-session
    secret: "hahaha",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); // ask passport to use session
// config passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =============
// MIDDLEWARE SETUP
// =============
app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
    next();
});


// =============
// ROUTES SETUP
// =============
var teamRoutes          = require("./routes/teams");
var playerRoutes        = require("./routes/players");
var indexRoutes         = require("./routes/index");

app.use("", indexRoutes);
app.use("/teams", teamRoutes);
app.use("/players", playerRoutes);


app.get("*", function(req, res) {
    res.send("Wrong address bro");
});

// app.listen(8080, () => {
//     console.log("listening on port 8080");
// })


app.listen(process.env.PORT, process.env.IP, function () {
    console.log("The Soccer_website Server Has Started!");
});
