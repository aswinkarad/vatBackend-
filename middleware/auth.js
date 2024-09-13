const jwt = require('../utils/jwt');
const cache = require('../utils/cache');
const config = process.env;

module.exports = async (req, res, next) => {
    // if (['/api/client/create'].includes(req.originalUrl)) {
    //     return next();
    // }
    if (['/api/client/login'].includes(req.originalUrl)) {
        return next();
    }
    if (['/api/admin/create'].includes(req.originalUrl)) {
        return next();
    }
    if (['/api/admin/login'].includes(req.originalUrl)) {
        return next();
    }
    // if (['/roles/create'].includes(req.originalUrl)) {
    //     return next();
    // }
   
    
    let token = req.headers.authorization;
    console.log('Authorization Header:', token);
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token) {
        try {
            token = token.trim();
            /* --- Check For Blacklisted Tokens --- */
            const isBlackListed = await cache.get(token);
            if (isBlackListed) {
                return res.status(401).json({ response: 'failed', message: 'Unauthorized' });
            }
            const decoded = await jwt.verifyToken(token);
            console.log(decoded.exp);

            req.user = decoded;
            req.userId = decoded.id;
            req.token = token;
            req.role = decoded.role
            next();
        } catch (error) {
            console.log(error)
            return res.status(401).json({ response: 'failed', message: 'Unauthorized' });
        }
    } else {
        return res.status(400).json({ response: 'failed', message: 'Authorization header is missing.' })
    }

};


