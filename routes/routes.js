const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')
const Auth = require('../middleware/auth')
const { body, param, validationResult } = require('express-validator');
const { Validation } = require("../validators");

router.route('/register').post(Validation.register, controller.register)

router.route('/login').post(Validation.login, controller.login)

router.route('/personel').get(Auth.verifyToken, controller.personel)

router.route('/option_user').get(controller.option_user)

router.route('/users').get(Auth.verifyToken, controller.user)

module.exports = router