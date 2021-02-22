const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', async (req, res) => {
    const {name, email, password1, password2} = req.body;
    let errors = [];

    if (!name || !email || !password1 || !password2) {
        errors.push({message: "Please insert all fields."});
    }

    if (password1.length < 6) {
        errors.push({message: "Password must be at least 6 characters."});
    }

    if (password1 !== password2) {
        errors.push({message: "Passwords don't match."});
    }

    if (errors.length > 0) {
        res.render('auth/register', {name, email, password1, password2, errors});
    }
    else {
        const user = await User.findOne({email: email});
        if (user) {
            errors.push({message: "Email has already been registered."});
            res.render('auth/register', {name, email, password1, password2, errors});
        }
        else {
            const newUser = new User({
                name: name,
                email: email,
                password: password1
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    if (err) {
                        throw err;
                    }

                    newUser.password = hash;
                    try {
                        const registeredUser = await newUser.save();
                        req.flash('success_message', 'You have successfully registered.');
                        res.redirect('/login');
                    }
                    catch (err) {
                        console.log(err.message);
                    }
                });
            });
        }
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_message', 'You are logged out.');
    res.redirect('/login');
});

module.exports = router;