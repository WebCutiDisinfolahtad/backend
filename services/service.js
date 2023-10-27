require("dotenv").config();
const { databaseQuery } = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cookies = require ('../node_modules/universal-cookie');
const { Context } = require("express-validator/src/context");
const { BadRequestError, UnauthorizedError } = require('../errors')
const cookie = new Cookies();

const register = async (username, password, kd_oto, nopers) => {
    try {
        
        const query = `
        INSERT INTO tabel_user (id_user, username, password, kd_oto, nopers)
        SELECT CONCAT(p.kd_jab, p.kd_bag), $1, $2, o.kd_oto, CAST($4 AS VARCHAR)
        FROM tabel_personel p
        INNER JOIN tabel_otorisasi o ON o.ur_oto = $3
        WHERE p.nopers = $4;
       ` ;
        const hash = await bcrypt.hash(password,10)
        const result = await databaseQuery(query, [username, hash, kd_oto, nopers]);
        console.log(result)
        if (!result){
			throw new BadRequestError('Isi Field dengan yang sesuai');
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
       
        const compares = await bcrypt.compare(password, result.rows[0].password)
        
        if (!compares){
			throw new UnauthorizedError('Invalid Credentials');
		}
        else {
            
            const token = jwt.sign((result.rows[0]), process.env.SECRET);
            result.rows[0].token = token
            return (
                result.rows[0]
            )
        }
    } catch (error) {
        return new BadRequestError('User Belum Terdaftar')
    }
}

const me = async (id_user) => {
    try {
        const query = `SELECT
        u.id_user,
        u.username,
        o.ur_oto AS otorisasi,
        j.ur_jenis_jab AS jenis_jabatan,
        b.ur_bag AS subdis
        
    FROM
        tabel_user u
        INNER JOIN tabel_otorisasi o ON u.kd_oto = o.kd_oto
        INNER JOIN tabel_personel p ON u.nopers = p.nopers
        INNER JOIN tabel_jabatan jb ON p.kd_jab = jb.kd_jab
        INNER JOIN tabel_jenis_jabatan j ON jb.kd_jenis_jab = j.kd_jenis_jab
        INNER JOIN tabel_bagian b ON jb.kd_bag = b.kd_bag
    WHERE
        u.id_user = $1;`;
        const result = await databaseQuery(query, [id_user]);

        return (
            result.rows
        )
        
    } catch (error) {
        return error
    }
}

const personel = async (id_user) => {
    try {
        const query = `SELECT
        tabel_personel.nopers,
        tabel_personel.nm_pers,
        tabel_pangkat.ur_pkt AS pangkat,
        tabel_korps.ur_corp AS korps,
        tabel_stmkl.ur_smkl AS stmkl,
        tabel_kotama.ur_ktm AS kotama,
        tabel_bagian.ur_bag AS bagian,
        tabel_jabatan.ur_jab AS jabatan,
        tabel_agama.ur_agama AS agama,
        tabel_personel.telp,
        tabel_personel.tgl_lahir,
        tabel_sisa_cuti.cuti_tahunan AS sisa_cuti
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
    INNER JOIN
        tabel_sisa_cuti ON tabel_personel.nopers = tabel_sisa_cuti.no_pers
    
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
        tabel_pangkat.ur_pkt AS pangkat,
        tabel_korps.ur_corp AS korps,
        tabel_stmkl.ur_smkl AS stmkl,
        tabel_kotama.ur_ktm AS kotama,
        tabel_bagian.ur_bag AS bagian,
        tabel_jabatan.ur_jab AS jabatan,
        tabel_agama.ur_agama AS agama,
        tabel_personel.telp,
        tabel_personel.tgl_lahir,
        tabel_sisa_cuti.cuti_tahunan AS sisa_cuti
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
    INNER JOIN
        tabel_sisa_cuti ON tabel_personel.nopers = tabel_sisa_cuti.no_pers
    WHERE tabel_personel.nopers=$1
    
    `;
    const result1 = await databaseQuery(query1, [nopers]);
    
    return(result1.rows)

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

const daftarinpersonel = async (nopers, nm_user, kd_pkt,kd_corp, kd_smkl, kd_ktm, kd_bag, kd_jab, kd_agama, telp, tgl_lahir) => {
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
            INSERT INTO tabel_personel VALUES ($8, $9, (SELECT kd_pkt FROM pangkat), (SELECT kd_corp FROM corp), (SELECT kd_smkl FROM smkl), (SELECT kd_ktm FROM ktm), (SELECT kd_bag FROM bag), (SELECT kd_jab FROM jab), (SELECT kd_agama FROM agama), $10, $11)
        `;
        const result = await databaseQuery(query, [kd_pkt, kd_corp, kd_smkl, kd_ktm, kd_bag, kd_jab, kd_agama, nopers, nm_user, telp, tgl_lahir]);
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
        INSERT INTO tabel_disposisi VALUES ((SELECT no_cuti FROM nomor_cuti), 0, 0, 0, 0, '0')` ;
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
        const query = `SELECT 
        tabel_nomcuti.no_cuti AS no_cuti,
        tabel_nomcuti.nopers AS nopers,
        tabel_personel.nm_pers AS nm_pers,
        tabel_pangkat.ur_pkt AS pangkat,
        tabel_korps.ur_corp AS korps,
        tabel_stmkl.ur_smkl AS stmkl,
        tabel_kotama.ur_ktm AS kotama,
        tabel_bagian.ur_bag AS bagian,
        tabel_jabatan.ur_jab AS jabatan,
        tabel_nomcuti.created_at AS tanggal_pengajuan,
        tabel_jns_cuti.ur_bag AS jenis_cuti,
        tabel_sisa_cuti.cuti_tahunan AS sisa_cuti,
        tabel_disposisi.dis_kasi AS dis_kasi,
        tabel_disposisi.dis_kabag AS dis_kabag,
        tabel_disposisi.dis_kasub AS dis_kasub,
        tabel_disposisi.dis_sesdis AS dis_sesdis,
        tabel_disposisi.dis_kadis AS dis_kadis,
        tabel_ket_disposisi.ur_disposisi AS ket_status,
        tabel_nomcuti.tgl_mulai AS tgl_mulai,
        tabel_nomcuti.tgl_akhir AS tgl_akhir

        FROM tabel_disposisi
        INNER JOIN tabel_nomcuti ON tabel_disposisi.no_cuti = tabel_nomcuti.no_cuti
        INNER JOIN tabel_personel ON tabel_nomcuti.nopers = tabel_personel.nopers
        INNER JOIN tabel_pangkat ON tabel_personel.kd_pkt = tabel_pangkat.kd_pkt
        INNER JOIN tabel_korps ON tabel_personel.kd_corp = tabel_korps.kd_corp
        INNER JOIN tabel_stmkl ON tabel_personel.kd_smkl = tabel_stmkl.kd_smkl
        INNER JOIN tabel_kotama ON tabel_personel.kd_ktm = tabel_kotama.kd_ktm
        INNER JOIN tabel_bagian ON tabel_personel.kd_bag = tabel_bagian.kd_bag
        INNER JOIN tabel_jabatan ON tabel_personel.kd_jab = tabel_jabatan.kd_jab
        INNER JOIN tabel_jns_cuti ON tabel_nomcuti.kd_jnscuti = tabel_jns_cuti.kd_jnscuti
        INNER JOIN tabel_sisa_cuti ON tabel_nomcuti.nopers = tabel_sisa_cuti.no_pers
        INNER JOIN tabel_ket_disposisi ON tabel_disposisi.ket_tolak = tabel_ket_disposisi.kd_disposisi

        `;
        const result = await databaseQuery(query);

        return (
            
            result.rows
        )

    } catch (error) {
        return error
    }
    
}

const disposisiupdate = async (id_cuti, dis_kasi, dis_kabag, dis_kasub, dis_sesdis,dis_kadis) => {
    try {
        console.log(id_cuti, dis_kasi, dis_kabag, dis_kasub, dis_sesdis,dis_kadis)
        const query = `UPDATE tabel_disposisi SET dis_kasi=$1, dis_kabag=$2, dis_kasub=$3, dis_sesdis=$4, dis_kadis=$5 WHERE no_cuti=$6` ;
        const result = await databaseQuery(query, [dis_kasi, dis_kabag, dis_kasub, dis_sesdis,dis_kadis, id_cuti]);
        
        if (!result){
			throw new Error('Register Error');
		}
        if (dis_kadis == 2 || dis_sesdis == 2){
            const query1 = `UPDATE tabel_disposisi SET ket_tolak = 2 WHERE no_cuti=$1` ;
            await databaseQuery(query1, [id_cuti]);
            const query2 = `UPDATE tabel_sisa_cuti
            SET cuti_tahunan = cuti_tahunan - (
              SELECT EXTRACT(DAY FROM AGE(tgl_akhir, tgl_mulai)) AS selisih_hari
              FROM tabel_nomcuti
              WHERE no_cuti = $1
            ) 
            WHERE no_pers IN (
              SELECT nopers
              FROM tabel_nomcuti
              WHERE no_cuti = $1
            )` ;
            await databaseQuery(query2, [id_cuti]);
        }else if (dis_kadis == 1 || dis_sesdis == 1 ){
            const query1 = `UPDATE tabel_disposisi SET ket_tolak = 1 WHERE no_cuti=$1` ;
            await databaseQuery(query1, [id_cuti]);
        }
		return ("Update Disposisi Berhasil")
    } catch (error) {
        return error
    }
    
}

const updateUser = async (id_user, username, password, kd_oto, nopers) => {
    try {
        //update tabel user tetapi isi kd_oto dengan ur_oto pada tabel_otorisasi
        const query = `UPDATE tabel_user SET username=$1, password=$2, kd_oto=$3, nopers=$4 WHERE id_user=$5`
        const hash = await bcrypt.hash(password,10)
        const result = await databaseQuery(query, [username, hash,kd_oto,nopers, id_user]);
        if (!result){
            throw new Error('Update Error');
        }
        return ("Update User Berhasil")
    } catch (error) {
        return error
    }
    
}

const updatePersonel = async (nopers, nm_pers, kd_pkt, kd_corp, kd_smkl, kd_ktm, kd_bag, kd_jab, kd_agama, telp, tgl_lahir) => {
    try {
        console.log(nopers, nm_pers, kd_pkt, kd_corp, kd_smkl, kd_ktm, kd_bag, kd_jab, kd_agama, telp, tgl_lahir)
        const query = `UPDATE tabel_personel SET nm_pers=$1, kd_pkt=(SELECT kd_pkt FROM tabel_pangkat WHERE ur_pkt=$2), kd_corp=(SELECT kd_corp FROM tabel_korps WHERE ur_corp=$3), kd_smkl=(SELECT kd_smkl FROM tabel_stmkl WHERE ur_smkl=$4), kd_ktm=(SELECT kd_ktm FROM tabel_kotama WHERE ur_ktm=$5), kd_bag=(SELECT kd_bag FROM tabel_bagian WHERE ur_bag=$6), kd_jab=(SELECT kd_jab FROM tabel_jabatan WHERE ur_jab=$7), kd_agama=(SELECT kd_agama FROM tabel_agama WHERE ur_agama=$8), telp=$9, tgl_lahir=$10 WHERE nopers=$11`
        const result = await databaseQuery(query, [nm_pers, kd_pkt, kd_corp, kd_smkl, kd_ktm, kd_bag, kd_jab, kd_agama, telp, tgl_lahir, nopers]);
        if (!result){
            throw new Error('Update Error');
        }
        return ("Update Personel Berhasil")
    } catch (error) {
        return error
    }
    
}

const deleteUser = async (id_user) => {
    try {
        const query = `DELETE FROM tabel_user WHERE id_user=$1`
        const result = await databaseQuery(query, [id_user]);
        if (!result){
            throw new Error('Delete Error');
        }
        return ("Delete User Berhasil")
    } catch (error) {
        return error
    }
    
}

const getOneUser = async (nopers) => {
    try {
        const query = `SELECT * FROM tabel_user WHERE nopers=$1`
        const result = await databaseQuery(query, [nopers]);
        if (!result){
            throw new Error('Get One User Error');
        }
        return (result.rows)
    } catch (error) {
        return error
    }
    
}

const disposisibynopers = async (nopers) => {
    try {
        const query = `
        SELECT 
        tabel_nomcuti.no_cuti AS no_cuti,
        tabel_nomcuti.nopers AS nopers,
        tabel_personel.nm_pers AS nm_pers,
        tabel_pangkat.ur_pkt AS pangkat,
        tabel_korps.ur_corp AS korps,
        tabel_stmkl.ur_smkl AS stmkl,
        tabel_kotama.ur_ktm AS kotama,
        tabel_bagian.ur_bag AS bagian,
        tabel_jabatan.ur_jab AS jabatan,
        tabel_nomcuti.created_at AS tanggal_pengajuan,
        tabel_jns_cuti.ur_bag AS jenis_cuti,
        tabel_sisa_cuti.cuti_tahunan AS sisa_cuti,
        tabel_disposisi.dis_kasi AS dis_kasi,
        tabel_disposisi.dis_kabag AS dis_kabag,
        tabel_disposisi.dis_kasub AS dis_kasub,
        tabel_disposisi.dis_sesdis AS dis_sesdis,
        tabel_ket_disposisi.ur_disposisi AS ket_status,
        tabel_nomcuti.tgl_mulai AS tgl_mulai,
        tabel_nomcuti.tgl_akhir AS tgl_akhir,
        tabel_personel.telp AS telp,
        tabel_nomcuti.alamat AS alamat,
        tabel_nomcuti.transport AS transport,
        tabel_nomcuti.keperluan AS keperluan
        FROM tabel_disposisi
        INNER JOIN tabel_nomcuti ON tabel_disposisi.no_cuti = tabel_nomcuti.no_cuti
        INNER JOIN tabel_personel ON tabel_nomcuti.nopers = tabel_personel.nopers
        INNER JOIN tabel_pangkat ON tabel_personel.kd_pkt = tabel_pangkat.kd_pkt
        INNER JOIN tabel_korps ON tabel_personel.kd_corp = tabel_korps.kd_corp
        INNER JOIN tabel_stmkl ON tabel_personel.kd_smkl = tabel_stmkl.kd_smkl
        INNER JOIN tabel_kotama ON tabel_personel.kd_ktm = tabel_kotama.kd_ktm
        INNER JOIN tabel_bagian ON tabel_personel.kd_bag = tabel_bagian.kd_bag
        INNER JOIN tabel_jabatan ON tabel_personel.kd_jab = tabel_jabatan.kd_jab
        INNER JOIN tabel_jns_cuti ON tabel_nomcuti.kd_jnscuti = tabel_jns_cuti.kd_jnscuti
        INNER JOIN tabel_sisa_cuti ON tabel_nomcuti.nopers = tabel_sisa_cuti.no_pers
        INNER JOIN tabel_ket_disposisi ON tabel_disposisi.ket_tolak = tabel_ket_disposisi.kd_disposisi
        WHERE tabel_nomcuti.nopers=$1
        `;

        const result = await databaseQuery(query, [nopers]);
        if (!result){
            throw new Error('Get One User Error');
        }
        return (result.rows)
    } catch (error) {
        return error
    }
    
}




const noSurat = async () => {
    try {
        const query = `SELECT * FROM table_nosurat`
        const result = await databaseQuery(query);
        if (!result){
            throw new Error('Get One User Error');
        }
        return (result.rows)
    } catch (error) {
        return error
    }
    
}

const createNosurat = async (no_cuti) => {
    try {
        const query1 = `SELECT * FROM table_nosurat WHERE no_cuti=$1`
        const result1 = await databaseQuery(query1, [no_cuti]);
        if (!result1){
            throw new Error('Nomor cuti Sudah Terbit');
        }
        const query = `INSERT INTO table_nosurat VALUES (default, $1)`
        const result = await databaseQuery(query, [no_cuti]);
        if (!result){
            throw new Error('Get One User Error');
        }
        return ("Nomor Surat Berhasil Dibuat")
    } catch (error) {
        return error
    }
    
}

const nosuratbynocuti = async (no_cuti) => {
    try {
        console.log(no_cuti)    
        const query = `SELECT * FROM table_nosurat WHERE no_cuti=$1`
        const result = await databaseQuery(query, [no_cuti]);
        if (!result){
            throw new Error('Get One User Error');
        }
        console.log(result.rows)
        return (result.rows)
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
    disposisiupdate,
    me,
    updateUser,
    updatePersonel,
    deleteUser,
    getOneUser,
    disposisibynopers,
    noSurat,
    createNosurat,
    nosuratbynocuti

}