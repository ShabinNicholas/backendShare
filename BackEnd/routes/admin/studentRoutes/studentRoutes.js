const express = require('express')
const route = express.Router()
const studentController = require('../../../Controller/studentController')
// const authMiddleware = require('../../../middleware/authMiddleware')
const adminAuthController = require('../../../Controller/adminAuthController')
const authMiddleware = require('../../../middleware/authMiddleware')


route.post('/student-post', studentController.newStudent)     
route.get('/students-details', authMiddleware, studentController.getStudents)
route.get('/student-view/:id', authMiddleware, studentController.getStudent)
route.put('/edit-student/:id', authMiddleware, studentController.editStudent)
route.delete('/delete-student/:id', authMiddleware, studentController.deleteStudent)
route.delete('/delete-selected-students', authMiddleware, studentController.deleteSelectedStudents)
route.post('/profilePic', studentController.profilePic)
// route.get('/check', studentController.check)

route.post('/refresh-token', adminAuthController.refreshTokens)



module.exports = route