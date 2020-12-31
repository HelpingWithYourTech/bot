module.exports = async (req, res, next) => {
    if(req.session.user){
        return next();
    }else {
        const redirectURL = ((req.originalURL.includes("login") || req.originalURL === "/") ? "/selector" : req.originalURL);
        const state = Math.random().toString(36).substring(5);
        req.client.states[state] = redirectURL;
        return res.redirect(`/api/login?state=${state}`);
    }
}