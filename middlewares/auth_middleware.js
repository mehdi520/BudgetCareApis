const jwt = require('jsonwebtoken');

const requireAuth = (req,res,next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'You are not authorized' });
    }
    else
    {
       
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Access denied' });
            }
            req.user = user;
            next();
        });

    }

};


module.exports = {
    requireAuth
};