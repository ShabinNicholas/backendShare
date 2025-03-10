const SignUpSchema = require('../Models/Signup')
const utils = require('../Utils/util')
const tokenUtils = require('../Utils/tokenUtils')
const bcrypt = require('bcrypt')
const user = require('../Models/user')

const signUpAdmin = async (req, res) => {
    try {
        const existingUser = await SignUpSchema.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exist please try logging in or use a different email."
            })
        }
        const hashedPassword = await utils.passwordHashing(req.body.password)
        const newSignUp = new SignUpSchema({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        await newSignUp.save()
        // const accessToken = tokenUtils.generateAccessToken(newSignUp)
        // const refreshToken = tokenUtils.generateRefreshToken(newSignUp)

        // Save refresh token to the user in the database (optional) saving it for future use
        // newSignUp.refreshToken = refreshToken;
        // await newSignUp.save()
        // Send response
        res.status(201).json({
            message: "User signed up successfully",
            data: newSignUp,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: error,
            message: "Error while signing up user"
        })
    }
}
const signinAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await SignUpSchema.findOne({ email });
        if (!userData) {
            return res.status(404).json({
                message: "User not found",
                devMessage: "No such email id exist"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, userData.password).then((result) => {
            return result
        });
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }
        const accessToken = tokenUtils.generateAccessToken(userData)
        const refreshToken = tokenUtils.generateRefreshToken(userData)
        userData.refreshToken = refreshToken
        await userData.save()
        res.status(200).json({
            message: "Signed in successfully",
            accessToken,
            refreshToken,
            user: {
                id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error in signing in",
            error: error
        });
    }
};

const refreshTokens = async (req, res) => {
    const { refreshToken } = req.body;
    console.log(refreshToken);
    
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not provided"
        })
    }
    try {
        const decoded = tokenUtils.verifyRefreshToken(refreshToken)
        if (!decoded) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' })
        }
        // Find user by decoded ID from refresh token
        const user = await SignUpSchema.findById(decoded.id)
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid or expired refresh token at user check' })
        }
        // Generate new refresh token to the 
        const newAccessToken = tokenUtils.generateAccessToken(user)
        const newRefreshToken = tokenUtils.generateRefreshToken(user)

        // Save the new refresh token to the database
        user.refreshToken = newRefreshToken
        await user.save();

        // Send new tokens
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    } catch (error) {
        res.status(500).json({ message: 'Error refreshing tokens', error: error.message })
    }
}


module.exports = {
    signUpAdmin,
    signinAdmin,
    refreshTokens
}