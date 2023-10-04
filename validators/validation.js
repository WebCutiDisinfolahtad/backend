const { param, body } = require('express-validator');
const { validator } = require('./validator');

const register = [
    // body('nama').isLength({min:5}),
    // body('email').isEmail(),
    // body('password').isLength({min:5}),
    // body('alamat').isLength({min:10}),
    validator
]

const login = [
    // body('email').isEmail(),
    // body('password').isLength({min:5}),
    validator
]

module.exports = {
    register,
    login
}