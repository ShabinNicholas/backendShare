const jwt = require('jsonwebtoken');
const utils = require('../Utils/tokenUtils')

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Authorization denied. No token provided' })
    }

    const decoded = utils.verifyAccessToken(token)
    if (!decoded) {
        return res.status(403).json({ message: "Invalid or expired access token" })
    }
    req.user = decoded
    next()}

    module.exports = authMiddleware
