const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const adminController = require('../controller/admin_controller')
const {verifyToken} = require('../utility/verifyToken')
router.post('/signup',body("email").isEmail().isLength({min:8,max:50}).withMessage("typr valid email"),body('password').isLength({min:8,max:50}).withMessage('type valid password'),adminController.signUp)
router.post('/login',body("email").isEmail().isLength({min:8,max:50}).withMessage("type valid phone number"),body('password').isLength({min:8,max:50}).withMessage('type valid password'),adminController.login)
module.exports = router
