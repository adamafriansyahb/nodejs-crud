const express = require('express');
const router = express.Router();
const fs = require('fs');
const Author = require('../models/Author');
const Publisher = require('../models/Publisher');
const uploadConfig = require('../config/upload');
const Book = require('../models/Book');
const User = require('../models/User');

const filePath = 'uploads/bookCovers';
const upload = uploadConfig(filePath)

router.get('/', async (req, res) => {
   
    let query = Book.find();

    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));

    }
    if (req.query.author != null && req.query.author != '') {
        query = query.regex('author', new RegExp(req.query.author, 'i'));
    }

    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishedAt', req.query.publishedBefore);
    }

    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishedAt', req.query.publishedAfter);
    }
    
    try {
        const books = await query.populate('author').populate('publisher').exec();
        const user = await User.findById(req.user._id).populate('role').exec();
        console.log(user);
        res.render('admin/book/index', {
            books,
            user,
            searchOptions: req.query
        });
    }
    catch(err) {
        console.log(err);
        res.redirect(`/admin/book`);
    }
    
    // const page = req.query.page;

    // const options = {
    //     limit: 20,
    //     page: page
    // }
    
    // const books = await Book.paginate({}, options);

    // console.log(books);
    // res.render('admin/book/index', {books: books.docs, config: books});

});

router.get('/create', async (req, res) => {
    try {
        const authors = await Author.find();
        const publishers = await Publisher.find();
        const user = await User.findById(req.user._id).populate('role').exec();
        res.render('admin/book/create', {authors, publishers, user});
    }
    catch (err) {
        console.log(err.message);
        res.redirect('/admin/book');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').populate('publisher').exec();
        const user = await User.findById(req.user._id).populate('role').exec();
        res.render('admin/book/detail', {book, user});
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
        req.flash('success_message', 'New book added.');
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
        const user = await User.findById(req.user._id).populate('role').exec();
        res.render('admin/book/edit', {
            user,
            book,
            authors,
            publishers  
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

router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        await book.remove();

        fs.unlink(book.cover, (err) => {
            if (err) {
                console.log(err);
            }
        });
        
        req.flash('error_message', 'Book has been deleted.');
        res.redirect('/admin/book');
    }
    catch (err) {
        console.log(err);
        res.redirect(`/admin/book/${book.id}`);
    }
});

module.exports = router;