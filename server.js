require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

const mongoose = require('mongoose');

const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);

// Routes
const homeRoute = require('./routes/home');
const authRoute = require('./routes/auth');
const adminBookRoute = require('./routes/book');
const adminAuthorRoute = require('./routes/author');
const adminPublisherRoute = require('./routes/publisher');
const adminUserRoute = require('./routes/user');
const adminRoleRoute = require('./routes/role');
const adminMenuRoute = require('./routes/menu');

const {checkAuth} = require('./config/auth');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false, limit: '10mb'}));
app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => {
    console.log(error);
});
db.once('open', () => {
    console.log('Connected to database.');
});

app.use('/', homeRoute);
app.use('/', authRoute);
app.use('/admin/book', checkAuth, adminBookRoute);
app.use('/admin/author', checkAuth, adminAuthorRoute);
app.use('/admin/publisher', checkAuth, adminPublisherRoute);
app.use('/admin/user', checkAuth, adminUserRoute);
app.use('/admin/role', checkAuth, adminRoleRoute);
app.use('/admin/menu', checkAuth, adminMenuRoute);

app.listen(4000, () => {
    console.log('Server running on port 4000...');
});

