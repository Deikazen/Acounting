const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {generateToken, authenticationToken} = require('./middleware/authToken');
const app = express();
const userRouter = require('./route/userRouter');
const itemRoute = require('./route/itemRoute');
const mongoose = require('./config/db');
require('dotenv').config();

app.use(cors());


const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/user', userRouter);
app.use('/',itemRoute);



app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});