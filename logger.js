const logger = (req, res, next) => {
    if(req.method !== "OPTIONS"){
        console.log(`${req.method} - ${req.path}`);
        next()
    }
}

module.exports = logger;