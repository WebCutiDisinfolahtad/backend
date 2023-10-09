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
        const query = `SELECT
        tabel_personel.nopers,
        tabel_personel.nm_pers,
        tabel_personel.gelardpn,
        tabel_personel.gelarblk,
        tabel_pangkat.ur_pkt AS pangkat,
        tabel_korps.ur_corp AS korps,
        tabel_stmkl.ur_smkl AS stmkl,
        tabel_kotama.ur_ktm AS kotama,
        tabel_bagian.ur_bag AS bagian,
        tabel_jabatan.ur_jab AS jabatan,
        tabel_agama.ur_agama AS agama,
        tabel_personel.telp,
        tabel_personel.tgl_lahir
    FROM
        tabel_personel
    INNER JOIN
        tabel_pangkat ON tabel_personel.kd_pkt = tabel_pangkat.kd_pkt
    INNER JOIN
        tabel_korps ON tabel_personel.kd_corp = tabel_korps.kd_corp
    INNER JOIN
        tabel_stmkl ON tabel_personel.kd_smkl = tabel_stmkl.kd_smkl
    INNER JOIN
        tabel_kotama ON tabel_personel.kd_ktm = tabel_kotama.kd_ktm
    INNER JOIN
        tabel_bagian ON tabel_personel.kd_bag = tabel_bagian.kd_bag
    INNER JOIN
        tabel_jabatan ON tabel_personel.kd_jab = tabel_jabatan.kd_jab
    INNER JOIN
        tabel_agama ON tabel_personel.kd_agama = tabel_agama.kd_agama;
    
    `;
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
        const query1 = `SELECT
        tabel_personel.nopers,
        tabel_personel.nm_pers,
        tabel_personel.gelardpn,
        tabel_personel.gelarblk,
        tabel_pangkat.ur_pkt AS pangkat,
        tabel_korps.ur_corp AS korps,
        tabel_stmkl.ur_smkl AS stmkl,
        tabel_kotama.ur_ktm AS kotama,
        tabel_bagian.ur_bag AS bagian,
        tabel_jabatan.ur_jab AS jabatan,
        tabel_agama.ur_agama AS agama,
        tabel_personel.telp,
        tabel_personel.tgl_lahir
    FROM
        tabel_personel
    INNER JOIN
        tabel_pangkat ON tabel_personel.kd_pkt = tabel_pangkat.kd_pkt
    INNER JOIN
        tabel_korps ON tabel_personel.kd_corp = tabel_korps.kd_corp
    INNER JOIN
        tabel_stmkl ON tabel_personel.kd_smkl = tabel_stmkl.kd_smkl
    INNER JOIN
        tabel_kotama ON tabel_personel.kd_ktm = tabel_kotama.kd_ktm
    INNER JOIN
        tabel_bagian ON tabel_personel.kd_bag = tabel_bagian.kd_bag
    INNER JOIN
        tabel_jabatan ON tabel_personel.kd_jab = tabel_jabatan.kd_jab
    INNER JOIN
        tabel_agama ON tabel_personel.kd_agama = tabel_agama.kd_agama
    WHERE tabel_personel.nopers=$1
    
    `;
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
        const query = `
            SELECT ur_oto, NULL AS ur_ktm, NULL AS ur_smkl FROM tabel_otorisasi
            UNION ALL
            SELECT NULL AS ur_oto, ur_ktm, NULL AS ur_smkl FROM tabel_kotama
            UNION ALL
            SELECT NULL AS ur_oto, NULL AS ur_ktm, ur_smkl FROM tabel_stmkl
        `;
        const result = await databaseQuery(query);
        
        return {
            ur_oto: result.rows.map(row => row.ur_oto).filter(Boolean),
            ur_ktm: result.rows.map(row => row.ur_ktm).filter(Boolean),
            ur_smkl: result.rows.map(row => row.ur_smkl).filter(Boolean)
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
        const query = `
            WITH pangkat AS (
                SELECT kd_pkt FROM tabel_pangkat WHERE ur_pkt=$1
            ),
            corp AS (
                SELECT kd_corp FROM tabel_korps WHERE ur_corp=$2
            ),
            smkl AS (
                SELECT kd_smkl FROM tabel_stmkl WHERE ur_smkl=$3
            ),
            ktm AS (
                SELECT kd_ktm FROM tabel_kotama WHERE ur_ktm=$4
            ),
            bag AS (
                SELECT kd_bag FROM tabel_bagian WHERE ur_bag=$5
            ),
            jab AS (
                SELECT kd_jab FROM tabel_jabatan WHERE ur_jab=$6
            ),
            agama AS (
                SELECT kd_agama FROM tabel_agama WHERE ur_agama=$7
            )
            INSERT INTO tabel_personel VALUES ($8, $9, $10, $11, (SELECT kd_pkt FROM pangkat), (SELECT kd_corp FROM corp), (SELECT kd_smkl FROM smkl), (SELECT kd_ktm FROM ktm), (SELECT kd_bag FROM bag), (SELECT kd_jab FROM jab), (SELECT kd_agama FROM agama), $12, $13)
        `;
        const result = await databaseQuery(query, [kd_pkt, kd_corp, kd_smkl, kd_ktm, kd_bag, kd_jab, kd_agama, nopers, nm_user, gelardpn, gelarblk, telp, tgl_lahir]);
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
        const query = `
        SELECT ur_pkt, NULL AS ur_corp, NULL AS ur_bag, NULL AS ur_jab, NULL AS ur_ktm, NULL AS ur_smkl FROM tabel_pangkat
        UNION ALL
        SELECT NULL AS ur_pkt, ur_corp, NULL AS ur_bag, NULL AS ur_jab, NULL AS ur_ktm, NULL AS ur_smkl FROM tabel_korps
        UNION ALL
        SELECT NULL AS ur_pkt, NULL AS ur_corp, ur_bag, NULL AS ur_jab, NULL AS ur_ktm, NULL AS ur_smkl FROM tabel_bagian
        UNION ALL
        SELECT NULL AS ur_pkt, NULL AS ur_corp, NULL AS ur_bag, ur_jab, NULL AS ur_ktm, NULL AS ur_smkl FROM tabel_jabatan
        UNION ALL
        SELECT NULL AS ur_pkt, NULL AS ur_corp, NULL AS ur_bag, NULL AS ur_jab, ur_ktm, NULL AS ur_smkl FROM tabel_kotama
        UNION ALL
        SELECT NULL AS ur_pkt, NULL AS ur_corp, NULL AS ur_bag, NULL AS ur_jab, NULL AS ur_ktm, ur_smkl FROM tabel_stmkl
        `
        const result = await databaseQuery(query);

        return {
            ur_pkt : result.rows.map(row => row.ur_pkt).filter(Boolean),
            ur_corp : result.rows.map(row => row.ur_corp).filter(Boolean),
            ur_bag : result.rows.map(row => row.ur_bag).filter(Boolean),
            ur_jab : result.rows.map(row => row.ur_jab).filter(Boolean),
            ur_ktm : result.rows.map(row => row.ur_ktm).filter(Boolean),
            ur_smkl : result.rows.map(row => row.ur_smkl).filter(Boolean)
            
        }

    } catch (error) {
        return error
    }
    
}


const requestcuti = async (nopers, tahun, kd_jnscuti, tgl_mulai, tgl_akhir,transport, keperluan, alamat) => {
    try {
        const query = `
        WITH jenis_cuti AS(
            SELECT kd_jnscuti FROM tabel_jns_cuti WHERE ur_bag=$1
        )
        INSERT INTO tabel_nomcuti VALUES (default, $2, $3, (SELECT kd_jnscuti FROM jenis_cuti), $4, $5, $6, $7, $8)
                    `;
        const result = await databaseQuery(query, [ kd_jnscuti, nopers, tahun, tgl_mulai, tgl_akhir,transport, keperluan, alamat]);
        const query2 = `
        WITH nomor_cuti AS(
            SELECT no_cuti FROM tabel_nomcuti WHERE nopers=$1
        )
        INSERT INTO tabel_disposisi VALUES ((SELECT no_cuti FROM nomor_cuti), 0, 0, 0, 0, 'Proses Disposisi')` ;
        const result2 = await databaseQuery(query2, [nopers]);
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