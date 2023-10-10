const { Services } = require('../services');
const { responseHelper } = require('../helper');
const { use } = require('../routes');


const register = async (req, res, next) => {
    try {
        const { id_user, username, password, kd_jab, kd_oto, nopers} = req.body;
        const result = await Services.register( id_user, username, password, kd_jab, kd_oto, nopers);
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
    
}

const login = async (req, res) => {
    try {
        const { username, password} = req.body;
        const result = await Services.login( username, password);
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.cookie('token',result.token).status(responseHelper.status.success).send(result);
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
}

const me = async (req, res) => {
    try{
        const id_user = req.verified
        const result = await Services.me(id_user);
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
}

const personel = async (req, res) => {
    try{
        const id_user = req.verified
        const result = await Services.personel(id_user);
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
}

const personelbynopers = async (req, res) => {
    try{
        const {nopers} = req.body
        const result = await Services.personelbynopers(nopers);
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
}

const option_user = async (req, res) => {
    try{
        const result = await Services.option_user();
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
}

const user = async (req, res) => {
    try{
        const id_user = req.verified
        const result = await Services.user(id_user);
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
}

const option_personel = async (req, res) => {
    try{
        const result = await Services.option_personel();
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
}

const daftarinpersonel = async (req, res, next) => {
    try {
        const { nopers, nm_user, kd_pkt,kd_corp, kd_smkl, kd_ktm, kd_bag, kd_jab, kd_agama, telp, tgl_lahir} = req.body;
        const result = await Services.daftarinpersonel( nopers, nm_user, kd_pkt,kd_corp, kd_smkl, kd_ktm, kd_bag, kd_jab, kd_agama, telp, tgl_lahir);
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
    
}


const requestcuti = async (req, res, next) => {
    try {
        const { nopers, tahun,kd_jnscuti, tgl_mulai, tgl_akhir,transport, keperluan, alamat} = req.body;
        const result = await Services.requestcuti( nopers, tahun,kd_jnscuti, tgl_mulai, tgl_akhir,transport, keperluan, alamat);
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
    
}

const option_jnscuti = async (req, res) => {
    try{
        const result = await Services.option_jnscuti();
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
}

const disposisi = async (req, res) => {
    try{
        const result = await Services.disposisi();
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
}

const disposisiupdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { dis_kasi, dis_kabag, dis_kasub, dis_sesdis, ket_tolak} = req.body;
        const result = await Services.disposisiupdate( id, dis_kasi, dis_kabag, dis_kasub, dis_sesdis, ket_tolak);
        if (result instanceof Error) {
            throw new Error(result);
        }
        res.status(responseHelper.status.success).json(result);
    
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
    
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie('token').status(responseHelper.status.success).send("Berhasil Logout");
    } catch (error) {
        res.status(responseHelper.status.error).json(error.message);
    }
}

module.exports = {
    register,
    login,
    personel,
    option_user,
    user,
    personelbynopers,
    option_personel,
    daftarinpersonel,
    requestcuti,
    option_jnscuti,
    disposisi,
    disposisiupdate,
    me,
    logout
}