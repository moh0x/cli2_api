const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const authController = require('../controller/auth_user')
const {verifyToken} = require('../utility/verifyToken')
router.post('/signup',body("email").isEmail().isLength({min:8,max:50}).withMessage("type valid email"),body('password').isLength({min:8,max:50}).withMessage('type valid password'),body('fullname').isString().isLength({min:6,max:30}).withMessage('type valid fullname'),body('phoneNumber').isString().isLength({min:10,max:15}).withMessage('type valid phone number'),authController.signUp)
router.post('/login',body("email").isEmail().isLength({min:8,max:50}).withMessage("type valid email"),body('password').isLength({min:8,max:50}).withMessage('type valid password'),authController.login)
router.post('/logout',verifyToken,authController.logout)
router.put('/update-profile',verifyToken,authController.updateProfile)
router.get('/user-info',verifyToken,authController.userInfo)
router.patch('/verifyAccount',body("verifyCode").isString().isLength({min:1,max:5}).withMessage("type valid code"),verifyToken,authController.confirmAccountFunc);
router.patch('/resetPassword',body("email").isEmail().isLength({min:6,max:50}).withMessage("type valid email"),body("resetPasswordCode").isString().isLength({min:1,max:5}).withMessage("type valid code"),body("resetPasswordCode").isString().isLength({min:1,max:6}),body('password').isString().isLength({min:8,max:30}).withMessage("type valid password"),authController.resetPasswordFunc);
router.patch('/sendResetCode',body("email").isEmail().isLength({min:6,max:50}).withMessage("type valid email"),authController.sendResetCodeFunc);
module.exports = router