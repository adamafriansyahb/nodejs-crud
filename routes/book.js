const express = require('express');
const router = express.Router();
const fs = require('fs');
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

router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const authors = await Author.find();
        const publishers = await Publisher.find();

        res.render('admin/book/edit', {
            book: book,
            authors: authors,
            publishers: publishers    
        });
    }
    catch(err) {
        console.log(err.message);
        res.redirect('/admin/book');
    }
});

router.put('/:id', upload.single('cover'), async (req, res) => {
    let book;
    let errorTitleMsg;
    let errorAuthorMsg;
    let errorPageCountMsg;
    let errorPublishedAtMsg;
    let errorPublisherMsg;
    let errorSummaryMsg;
    
    const authors = await Author.find();
    const publishers = await Publisher.find();
    const {title, author, pageCount, publishedAt, publisher, summary} = req.body;

    try {
        book = await Book.findById(req.params.id);
        const oldCover = book.cover;

        if (!title || !author || !pageCount || !publishedAt || !publisher || !summary) {
            if (!title) {
                errorTitleMsg = "Title field is required.";
            }
            if (!author) {
                errorAuthorMsg = "Author field is required.";
            }
            if (!pageCount) {
                errorPageCountMsg = "Page count field is required.";
            }
            if (!publishedAt) {
                errorPublishedAtMsg = "Published at field is required.";
            }
            if (!publisher) {
                errorPublisherMsg = "Publisher field is required.";
            }
            if (!summary) {
                errorSummaryMsg = "Summary field is required.";
            }
            res.render('admin/book/edit', {
                book,
                authors,
                publishers,
                errorTitleMsg,
                errorAuthorMsg,
                errorPageCountMsg,
                errorPublishedAtMsg,
                errorPublisherMsg,
                errorSummaryMsg,
            });
        }

        book.title = title;
        book.author = author;
        book.pageCount = pageCount;
        book.publishedAt = new Date(publishedAt);
        book.publisher = publisher;
        book.summary = summary;

        if (req.file != null) {
            book.cover = req.file.path;
            fs.unlink(oldCover, (err) => {
                if (err) {
                    console.log(err.message);
                }
            });
        }
        
        await book.save();

        req.flash('success_message','Book edited successfully.');
        res.redirect(`/admin/book/${book.id}`);

    }
    catch (err) {
        console.log(err);
        redirect('/admin/book');
    }
});

module.exports = router;