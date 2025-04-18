const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const courseController = require('../controller/course_controller')
const {verifyToken} = require('../utility/verifyToken')
router.get('/course-info/:id',verifyToken,courseController.courseInfo)
router.get('/courses',verifyToken,courseController.courses)
router.delete('/delete',verifyToken,courseController.deleteCourse)
module.exports = router
