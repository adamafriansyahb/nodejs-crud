const express = require('express');
const Author = require('../models/Author');
const router = express.Router();

router.get('/', async (req, res) => {
    const authors = await Author.find(); 
    res.render('admin/author/index', {authors: authors});
});

router.get('/create', (req, res) => {
    res.render('admin/author/create');
});

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('admin/author/detail', {author: author});
    }
    catch (err) {
        console.log(err.message);
        res.redirect('/admin/author/');
    }
});

router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name,
        nationality: req.body.nationality
    });

    try {
        const newAuthor = await author.save();
        req.flash('success_message', "New author added.");
        res.redirect('/admin/author/');
    }
    catch (err) {
        res.render('admin/author/create', {
            author: author
        });
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('admin/author/edit', {author: author});
    }
    catch(err) {
        res.redirect('/admin/author');
    }
});

router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        author.nationality = req.body.nationality;
        await author.save();
        req.flash('success_message', 'Data edited successfully.');
        res.redirect(`/admin/author/${author.id}`);
    }
    catch (err) {
        req.flash('error_message', `Error updating author's data.`);
        res.render('admin/author/edit', {author: author});
    }
});

router.delete('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        req.flash('error_message', 'Author has been deleted.');
        res.redirect('/admin/author');
    }
    catch (err) {
        console.log(err.message);
        if (author == null) {
            res.redirect('/admin/author');
        }
        else {
            req.flash('error_message', err.message);
            res.redirect(`/admin/author/${author.id}`);
        }
    }
});

module.exports = router;