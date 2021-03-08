const express = require('express');
const router = express.Router();
const {checkAuth} = require('../config/auth');
const Menu = require('../models/Menu');

router.get('/', checkAuth, (req, res) => {
    res.render('home', {name: req.user.name});
});

router.get('/admin', checkAuth, async (req, res) => {
    const menus = await Menu.find();
    res.render('admin/dashboard', {menus});
});

module.exports = router;