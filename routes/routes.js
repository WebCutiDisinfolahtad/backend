const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')
const Auth = require('../middleware/auth')
const { body, param, validationResult } = require('express-validator');
const { Validation } = require("../validators");

router.route('/register').post(Validation.register, controller.register)

router.route('/login').post(Validation.login, controller.login)

router.route('/me').get(Auth.verifyToken, controller.me)

router.route('/personel').get(Auth.verifyToken, controller.personel)

router.route('/personelbynopers').get(Auth.verifyToken, controller.personelbynopers)

router.route('/option_user').get(controller.option_user)

router.route('/option_personel').get(controller.option_personel)

router.route('/daftarinpersonel').post(Auth.verifyToken, controller.daftarinpersonel)

router.route('/users').get(Auth.verifyToken, controller.user)

router.route('/requestcuti').post(Auth.verifyToken, controller.requestcuti)

router.route('/option_jnscuti').get(controller.option_jnscuti)

router.route('/disposisi').get(Auth.verifyToken, controller.disposisi)

router.route('/disposisiupdate/:id').put(Auth.verifyToken, controller.disposisiupdate)

router.route('/logout').post(Auth.verifyToken, controller.logout)

module.exports = router