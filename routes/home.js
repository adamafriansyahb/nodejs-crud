const express = require('express');
const router = express.Router();
const {checkAuth} = require('../config/auth');

router.get('/', checkAuth, (req, res) => {
    res.render('home', {name: req.user.name});
});

router.get('/admin', checkAuth, (req, res) => {
    res.render('admin/dashboard');
});

module.exports = router;