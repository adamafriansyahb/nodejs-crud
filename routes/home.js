const express = require('express');
const router = express.Router();
const {checkAuth} = require('../config/auth');
const Menu = require('../models/Menu');
const Book = require('../models/Book');

router.get('/', checkAuth, async (req, res) => {
    const page = req.query.page;
    const options = {
        limit: 18,
        page: page,
        sort: {title: 1}
    }
    const books = await Book.paginate({}, options);
    res.render('home', {name: req.user.name, books: books.docs, config: books});
});

router.get('/admin', checkAuth, async (req, res) => {
    const menus = await Menu.find();
    res.render('admin/dashboard', {menus});
});

module.exports = router;