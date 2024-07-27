const jwt = require('jsonwebtoken');

const generateToken = (user_Id) => {
    return jwt.sign(
        { id: user_Id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
        );
}

module.exports = generateToken;