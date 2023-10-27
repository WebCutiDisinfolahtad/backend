const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')
const Auth = require('../middleware/auth')
const { body, param, validationResult } = require('express-validator');
const { Validation } = require("../validators");
const { route } = require('.');

router.route('/register').post(Validation.register, controller.register)

router.route('/login').post(Validation.login, controller.login)

router.route('/me').post(Auth.verifyToken, controller.me)

router.route('/personel').post(Auth.verifyToken, controller.personel)

router.route('/personelbynopers').post(Auth.verifyToken, controller.personelbynopers)

router.route('/option_user').get(controller.option_user)

router.route('/option_personel').get(controller.option_personel)

router.route('/daftarinpersonel').post(Auth.verifyToken, controller.daftarinpersonel)

router.route('/users').post(Auth.verifyToken, controller.user)

router.route('/requestcuti').post(Auth.verifyToken, controller.requestcuti)

router.route('/option_jnscuti').get(controller.option_jnscuti)

router.route('/disposisi').post(Auth.verifyToken, controller.disposisi)

router.route('/disposisiupdate').put(Auth.verifyToken, controller.disposisiupdate)

router.route('/logout').post(Auth.verifyToken, controller.logout)

router.route('/updateuser').put(Auth.verifyToken, controller.updateuser)

router.route('/updatepersonel').put(Auth.verifyToken, controller.updatepersonel)

router.route('/deleteuser').delete(Auth.verifyToken, controller.deleteuser)

router.route('/getoneuser').post(Auth.verifyToken, controller.getoneuser)

router.route('/disposisibynopers').post(Auth.verifyToken, controller.disposisiByNopers)

router.route('/nosurat').post(Auth.verifyToken, controller.getnosurat)

router.route('/createnosurat').post(Auth.verifyToken, controller.createnosurat)

router.route('/getnosuratbynocuti').post(Auth.verifyToken, controller.getnosuratbynocuti)

module.exports = router