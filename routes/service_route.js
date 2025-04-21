const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const serviceController = require('../controller/service_controller')
const {verifyToken} = require('../utility/verifyToken')
router.get('/services',verifyToken,serviceController.services)
router.delete('/delete',verifyToken,serviceController.services)
router.post('/add',verifyToken,serviceController.addService)
module.exports = router
