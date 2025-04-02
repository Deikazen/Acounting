module.exports = (req, res, next) => {
    const amount = req.body.amount ;
    if ( typeof amount !=='number'){
        console.log(amount);
        return res.status(400).send("Masukkan angka ! ");
    }
    next();
};