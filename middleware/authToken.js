const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;


if (!secretKey) {
    console.log("secret key gaada");
}

//buat token
function generateToken(user){
    const token = jwt.sign({id : user._id , email : user.email}, secretKey, {expiresIn: '1h'} );
    return token ;

}

// verifikasi token

function authenticationToken(req, res, next) {
    console.time('auth');
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({message : 'Akses ditolak, token tidak ditemukan'});
    }

    console.timeEnd('auth');
    const token = authHeader.split(' ')[1];
    try {
    const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.id;

        next();
    } catch (error){
        res.status(401).json({message : 'invalid token'});
    }

}    


module.exports = {
    generateToken,
    authenticationToken
};