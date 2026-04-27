const corsConfig = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Accept, Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");

    if(req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next()
}

module.exports = corsConfig;