const jwt = require('jsonwebtoken')
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

// Generate Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, JWT_ACCESS_SECRET, {
        expiresIn: '15m'
    })
}

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    })
}

// Verify Access Token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_ACCESS_SECRET)
    } catch (error) {
        return null
    }
}

// Verify refresh Token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET)
    } catch (error) {
        return null
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}