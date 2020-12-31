const config = require("../config"),
    CheckAuth = require("./auth/checkauth");

module.exports.load = async(client) => {
    const express = require("express"),
        session = require("express-session"),
        path = require("path"),
        app = express();

    const mainRouter = require("./routes/index"),
        discordAPIRouter = require("./routes/discord"),
        logoutRouter = require("./routes/logout"),
        settingsRouter = require("./routes/settings");
    
    app
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .engine("html", require("ejs").renderFile)
        .use(express.static(path.join(__dirname, "/public")))
        .set("views", path.join(__dirname, "/views"))
        .set("port", config.Dashboard.port)
        .use(session({ secret: config.Dashboard.expressSessionPassword, resave: false, saveUninitialized: false }))

        .use("/api", discordAPIRouter)
        .use("/logout", logoutRouter)
        .use("/settings", settingsRouter)
        .use("/", mainRouter)

        .use(CheckAuth, function(req, res){
            res.status(404).render("404", {
                user: req.userInfos,
                currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`
            });
        })
        .use(CheckAuth, function(req, res, err){
            console.error(err.stack);
            if(!req.user) return res.redirect("/");
            res.status(500).render("500", {
                user: req.userInfos,
                currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`
            });
        });

    app.listen(app.get("port"), () => {
        console.log(`Dashboard is listening on port ${app.get("port")}`);
    });
};