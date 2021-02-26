const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const Publisher = require('../models/Publisher');
const uploadConfig = require('../config/upload');
const Book = require('../models/Book');

const filePath = 'uploads/bookCovers';
const upload = uploadConfig(filePath)

router.get('/', async (req, res) => {
    const books = await Book.find();
    res.render('admin/book/index', {books: books});
});

router.get('/create', async (req, res) => {
    try {
        const authors = await Author.find();
        const publishers = await Publisher.find();
        res.render('admin/book/create', {authors: authors, publishers: publishers});
    }
    catch (err) {
        console.log(err.message);
        res.redirect('/admin/book');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').populate('publisher').exec();
        res.render('admin/book/detail', {book: book});
    }
    catch (err) {
        console.log(err.message);
        res.redirect('/admin/book');
    }
});

router.post('/', upload.single('cover'), async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        pageCount: req.body.pageCount,
        publishedAt: new Date(req.body.publishedAt),
        publisher: req.body.publisher,
        summary: req.body.summary,
        cover: req.file.path
    });

    try {
        await book.save();
        res.redirect('/admin/book');
    }
    catch (err) {
        console.log(err.message);
        // console.log(mongoose.Types.ObjectId.isValid(req.body.author));
        res.redirect('/')
    }
});

module.exports = router;