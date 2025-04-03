const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {generateToken, authenticationToken} = require('./middleware/authToken');
const app = express();
const userRouter = require('./route/userRouter');
const itemRoute = require('./route/itemRoute');
const mongoose = require('./config/db');
require('dotenv').config();
const path = require('path');


app.use(cors());


const port = process.env.PORT || 3000;

// Middleware untuk melayani file frontend
app.use(express.static(path.join(__dirname, 'frontend/public')));

// Route untuk menangani permintaan ke frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/public', 'index.html'));
});


app.get('/api', (req, res) => {
  res.send('Welcome to the backend API!');
});

app.use(express.json());
app.use('/user', userRouter);
app.use('/',itemRoute);



app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});