const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {generateToken, authenticationToken} = require('../middleware/authToken');
const { ErrorMessage } = require('formik');

exports.registerUser = async (req, res) => {
    const {username, email, password } = req.body;
    const userId = new mongoose.Types.ObjectId();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "INVALID_EMAIL", msg: "Format email tidak valid!" });
    }

    try {    
        let user = await User.findOne({email});
        if (user){
            return res.status(400).json({error: "EMAIL_ALREADY_REGISTERED", msg: "Email sudah terdaftar!" } );
        }
        user = new User ({
          _id: new mongoose.Types.ObjectId(),
            username,
            email,
            password,
            data : {}
        });

       
      
       
        await user.save();
        res.send('User registered');
    }   catch  {
        res.status(500).send("Ada kesalahan !");
    }
};

exports.loginUser = async (req, res) => {
  

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email});
  

      if (!user) {
        return res.status(400).json({error : "EMAIL_NOT_FOUND", msg : "Email tidak ditemukan!"});
      }
      if (user.password !== password) {
        return res.status(400).json({error: "INVALID_PASSWORD", msg: "Password salah!"});
      }

      
      // membuat token jwt
      const token = generateToken(user);
    

      res.json({token, username: user.username});
      console.log('Membuat token di login : ', token); // debuging 


  
    } catch (err) {
      console.error(err.message);
      res.status(500).json({error: "SERVER_ERROR", msg: "Ada kesalahan!"});
    }

  };