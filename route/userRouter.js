const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controller/userController');


// rute registrasi user
router.post('/register', registerUser);

// rute login user 
router.post('/login', loginUser);

router.post('/protected')



module.exports = router;