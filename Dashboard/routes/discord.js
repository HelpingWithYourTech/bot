const express = require("express"),
    router = express.Router(),
    Discord = require("discord.js");

const fetch = require("node-fetch"),
    btoa = require("btoa");

router.get("/login", async function(req, res){
    if(!req.user || !req.user.id){
        return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${req.client.user.id}&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(req.client.config.dashboard.baseURL+"/api/callback")}&state=${req.query.state || "no"}`)
    }
    res.redirect("/selector");
});

router.get("/callback", async (req, res) => {
    if(!res.query.code) res.redirect(req.client.config.failureURL);
    const redirectURL = req.client.states[req.query.state] || "/selector";
    const params = new URLSearchParams();
    params.set("grant_type", "authorization_code");
    params.set("code", req.query.code);
    params.set("redirect_url", `${req.client.config.Dashboard.baseURL}/api/callback`);
    let response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: params.toString(),
        headers: {
            Authorization: `Basic ${btoa(`${req.client.user.id}:${req.client.config.Dashboard.secret}`)}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    const tokens = await response.json();
    if(tokens.error || !tokens.access_token) return res.redirect(`/api/login&state=${req.query.state}`);
    const userData = {
        infos: null
    };
    while(!userData.infos){
        if(!userData.infos){
            response = await fetch(`http://discordapp.com/api/users/@me`, {
                method: "GET",
                headers: { Authorization: `Bearer ${tokens.access_token}` }
            });
            const json = await response.json();
            if(json.retry_after) await req.client.wait(json.retry_after);
            else userData.infos = json;
        }
    }

    req.session.user = { ... userData.infos };
    const user = await req.client.users.fetch(req.session.user.id);
    res.redirect(redirectURL);
})