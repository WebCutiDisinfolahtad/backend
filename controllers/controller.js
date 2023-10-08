const { Services } = require('../services');
const { responseHelper } = require('../helper');
const { use } = require('../routes');


const register = async (req, res, next) => {
    try {
        const { id_user, nm_user, username, password, kt_kunci, kd_oto, no_pers, kd_ktm, kd_smkl} = req.body;
        const result = await Services.register( id_user, nm_user, username, password, kt_kunci, kd_oto, no_pers, kd_ktm, kd_smkl);
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


module.exports = {
    register,
    login,
    personel,
    option_user,
    user
}