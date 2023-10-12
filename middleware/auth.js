const jwt = require(`jsonwebtoken`);
require('dotenv').config()

const Auth = {
    verifyToken(req, res, next){
        
        const token = req.cookies['token'] || req.body.token
        console.log(token)
        if(token){
            const verified = jwt.verify(token, process.env.SECRET)
            
            req.verified = verified.id_user
            
            

            if(verified){
                console.log(`Succesfully Verified`)
                return next()
            }
        } else {
            res.status(403).send({message: `Youre not authenticated, please login first`})
        }
    }
}

module.exports = Auth;