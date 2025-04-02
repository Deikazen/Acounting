const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_key_saya';


//buat token
function generateToken(user){
    const token = jwt.sign({id : user._id , email : user.email}, SECRET_KEY, {expiresIn: '1h'} );
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
    const decoded = jwt.verify(token, SECRET_KEY);
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