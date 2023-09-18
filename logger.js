function log(req, res, next){
    console.log('Logging...', req.url);
    next();
}

module.exports = log;