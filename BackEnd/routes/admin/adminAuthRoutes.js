const express = require('express')
const adminAuthController = require('../../Controller/adminAuthController')
const route = express.Router()

route.post('/signUpAdmin', adminAuthController.signUpAdmin)
route.post('/signinAdmin', adminAuthController.signinAdmin)

//refresh token

module.exports = route