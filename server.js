require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const authRoute = require('./routes/auth');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}));

app.use('/', authRoute)

app.listen(3000, () => {
    console.log('Server running on port 3000...');
});

