require("dotenv").config();
const { databaseQuery } = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cookies = require ('../node_modules/universal-cookie');
const { Context } = require("express-validator/src/context");

const cookie = new Cookies();

const register = async (id_user, nm_user,username, password,kt_kunci, kd_oto, no_pers, kd_ktm, kd_smkl) => {
    try {
        const query = `INSERT INTO tabel_user VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)` ;
        const hash = await bcrypt.hash(password,10)
        const result = await databaseQuery(query, [id_user, nm_user, username, hash,kt_kunci, kd_oto, no_pers, kd_ktm, kd_smkl]);
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

const personel = async (id_user) => {
    try {
        const query = `SELECT * FROM tabel_personel`;
        const result = await databaseQuery(query);

        return (
            
            result.rows
        )

    } catch (error) {
        return error
    }
    
}

const personelbynopers = async (nopers) => {
    try {
        const query1 = `SELECT * FROM tabel_personel where nopers=$1`;
        const query2 = `SELECT cuti_tahunan FROM tabel_sisa_cuti where no_pers=$1`;
        const [result1, result2] = await Promise.all([databaseQuery(query1, [nopers]), databaseQuery(query2, [nopers])]);
        
        return {
            
            pers : result1.rows,
            sisa_cuti : result2.rows
        }

    } catch (error) {
        return error
    }
    
}

const option_user = async (id_user) => {
    try {
        const oto = `SELECT ur_oto FROM tabel_otorisasi`;
        const ktm = `SELECT ur_ktm FROM tabel_kotama`;
        const smkl = `SELECT ur_smkl FROM tabel_stmkl`;
        const [result1, result2, result3] = await Promise.all([databaseQuery(oto), databaseQuery(ktm), databaseQuery(smkl)]);
        
        return {
            ur_oto: result1.rows,
            ur_ktm: result2.rows,
            ur_smkl: result3.rows
        }

    } catch (error) {
        return error
    }
    
}

const user = async (id_user) => {
    try {
        const query = `SELECT * FROM tabel_user`;
        const result = await databaseQuery(query);

        return (
            
            result.rows
        )

    } catch (error) {
        return error
    }
    
}

const daftarinpersonel = async (nopers, nm_user,gelardpn, gelarblk, kd_pkt,kd_corp, kd_smkl, kd_ktm, kd_bag, kd_jab, kd_agama, telp, tgl_lahir) => {
    try {
        const query = `INSERT INTO tabel_personel VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)` ;
        const result = await databaseQuery(query, [nopers, nm_user, gelardpn, gelarblk , kd_pkt,kd_corp, kd_smkl, kd_ktm, kd_bag, kd_jab, kd_agama, telp, tgl_lahir]);
        if (!result){
			throw new Error('Register Error');
		}
		return ("Data Register Success")
    } catch (error) {
        return error
    }
}

const option_personel = async (id_user) => {
    try {
        const pkt = `SELECT ur_pkt FROM tabel_pangkat`;
        const corps = `SELECT ur_corp FROM tabel_korps`;
        const bag = `SELECT ur_bag FROM tabel_bagian`;
        const jab = `SELECT ur_jab FROM tabel_jabatan`;
        const ktm = `SELECT ur_ktm FROM tabel_kotama`;
        const smkl = `SELECT ur_smkl FROM tabel_stmkl`;
        const [result1, result2, result3, result4, result5, result6] = await Promise.all([databaseQuery(corps), databaseQuery(ktm), databaseQuery(smkl), databaseQuery(pkt), databaseQuery(bag), databaseQuery(jab)]);
        
        return {
            pangkat : result4.rows,
            korps: result1.rows,
            bagian: result5.rows,
            jabatan: result6.rows,
            ur_ktm: result2.rows,
            ur_smkl: result3.rows
        }

    } catch (error) {
        return error
    }
    
}


module.exports = {
    register,
    login,
    personel,
    option_user,
    user,
    personelbynopers,
    daftarinpersonel,
    option_personel
}