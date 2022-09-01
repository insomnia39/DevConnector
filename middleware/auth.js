const jwt = require('jsonwebtoken');
const config = require('config');

function authenticate(req, res, next){
    const token = req.header('token');

    if(!token){
        return res.status(401).json({msg: 'Unauthorized user'});
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Token is not valid'});
    }
}

module.exports = authenticate;