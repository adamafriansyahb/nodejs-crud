const express = require('express');
const router = express.Router();
const {checkAuth} = require('../config/auth');
const Menu = require('../models/Menu');
const Book = require('../models/Book');
const User = require('../models/User');

router.get('/', checkAuth, async (req, res) => {
    const page = req.query.page;
    const options = {
        limit: 18,
        page: page,
        sort: {title: 1}
    }
    const user = await User.findById(req.user._id).populate('role').exec();
    const books = await Book.paginate({}, options);
    res.render('home', {user, books: books.docs, config: books});
});

router.get('/admin', checkAuth, async (req, res) => {
    const menus = await Menu.find();
    const user = await User.findById(req.user._id).populate('role').exec();
    res.render('admin/dashboard', {menus, user});
});

module.exports = router;