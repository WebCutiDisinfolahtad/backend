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
        const pangkat = `SELECT kd_pkt FROM tabel_pangkat WHERE ur_pkt=$1` ;
        const corp = `SELECT kd_corp FROM tabel_korps WHERE ur_corp=$1` ;
        const smkl = `SELECT kd_smkl FROM tabel_stmkl WHERE ur_smkl=$1` ;
        const ktm = `SELECT kd_ktm FROM tabel_kotama WHERE ur_ktm=$1` ;
        const bag = `SELECT kd_bag FROM tabel_bagian WHERE ur_bag=$1` ;
        const jab = `SELECT kd_jab FROM tabel_jabatan WHERE ur_jab=$1` ;
        const agama = `SELECT kd_agama FROM tabel_agama WHERE ur_agama=$1` ;
        const result0 = await databaseQuery(pangkat, [kd_pkt]);
        const result1 = await databaseQuery(corp, [kd_corp]);
        const result2 = await databaseQuery(smkl, [kd_smkl]);
        const result3 = await databaseQuery(ktm, [kd_ktm]);
        const result4 = await databaseQuery(bag, [kd_bag]);
        const result5 = await databaseQuery(jab, [kd_jab]);
        const result6 = await databaseQuery(agama, [kd_agama]);
        const result = await databaseQuery(query, [nopers, nm_user, gelardpn, gelarblk , result0.rows[0].kd_pkt,result1.rows[0].kd_corp, result2.rows[0].kd_smkl, result3.rows[0].kd_ktm, result4.rows[0].kd_bag, result5.rows[0].kd_jab, result6.rows[0].kd_agama, telp, tgl_lahir]);
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


const requestcuti = async (nopers, tahun, kd_jnscuti, tgl_mulai, tgl_akhir,transport, keperluan, alamat) => {
    try {
        const query = `INSERT INTO tabel_nomcuti VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8)` ;
        const jenis = `SELECT kd_jnscuti FROM tabel_jns_cuti WHERE ur_bag=$1` ;
        const result0 = await databaseQuery(jenis, [kd_jnscuti]);
        const result = await databaseQuery(query, [nopers, tahun,result0.rows[0].kd_jnscuti, tgl_mulai, tgl_akhir,transport, keperluan, alamat]);
        const idCuti = `SELECT no_cuti FROM tabel_nomcuti WHERE nopers=$1 ` ;
        const idResult = await databaseQuery(idCuti, [nopers]);
        const query2 = `INSERT INTO tabel_disposisi VALUES ($1, 0, 0, 0, 0, 'Proses Disposisi')` ;
        const result2 = await databaseQuery(query2, [idResult.rows[0].no_cuti]);
        if (!result){
			throw new Error('Register Error');
		}
		return ("Pengajuan Cuti Berhasil")
    } catch (error) {
        return error
    }
}

const option_jnscuti = async (id_user) => {
    try {
        const jns = `SELECT ur_bag FROM tabel_jns_cuti`;
        const result = await databaseQuery(jns);
        return {
            jenisCuti : result.rows,
        }

    } catch (error) {
        return error
    }
    
}

const disposisi = async () => {
    try {
        const query = `SELECT * FROM tabel_disposisi`;
        const result = await databaseQuery(query);

        return (
            
            result.rows
        )

    } catch (error) {
        return error
    }
    
}

const disposisiupdate = async (id, dis_kasi, dis_kabag, dis_kasub, dis_sesdis, ket_tolak) => {
    try {
        const query = `UPDATE tabel_disposisi SET dis_kasi=$1, dis_kabag=$2, dis_kasub=$3, dis_sesdis=$4, ket_tolak=$5 WHERE no_cuti=$6` ;
        const result = await databaseQuery(query, [dis_kasi, dis_kabag, dis_kasub, dis_sesdis, ket_tolak, id]);
        
        if (!result){
			throw new Error('Register Error');
		}
		return ("Update Disposisi Berhasil")
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
    option_personel,
    requestcuti,
    option_jnscuti,
    disposisi,
    disposisiupdate

}