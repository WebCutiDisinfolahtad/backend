require("dotenv").config();
const { databaseQuery } = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cookies = require ('../node_modules/universal-cookie')

const cookie = new Cookies();

const register = async (id_user, nm_user,username, password, kd_oto, no_pers, kd_ktm, kd_smkl) => {
    try {
        const query = `INSERT INTO tabel_user VALUES ($1, $2, $3, $4, $5, $6, $7, $8)` ;
        const hash = await bcrypt.hash(password,10)
        const result = await databaseQuery(query, [id_user, nm_user, username, hash, kd_oto, no_pers, kd_ktm, kd_smkl]);
        if (!result){
			throw new Error('Register Error');
		}
		return ("Data Register Success")
    } catch (error) {
        return error
    }
}

const login = async (username,password) => {
    try {
        const query = `SELECT * FROM tabel_user WHERE username=$1`;
        const result = await databaseQuery(query, [username]);
        const compares = bcrypt.compare(password, result.rows[0].password)
        if (!compares){
			throw new Error('Login Error');
		}
        else {
            const token = jwt.sign((result.rows[0]), process.env.SECRET);
            result.rows[0].token = token
            return (
                result.rows[0]
            )
        }
    } catch (error) {
        return error
    }
}

module.exports = {
    register,
    login
}