const express = require('express');
const Publisher = require('../models/Publisher');
const router = express.Router();

router.get('/', async (req, res) => {
    const publishers = await Publisher.find();
    res.render('admin/publisher/index', {publishers: publishers});
});

router.get('/create', (req, res) => {
    res.render('admin/publisher/create');
});

router.get('/:id', async (req, res) => {
    try {
        const publisher = await Publisher.findById(req.params.id);
        res.render('admin/publisher/detail', {publisher: publisher});
    }
    catch (err) {
        console.log(err.message);
        res.redirect('/admin/publisher');
    }
});

router.post('/', async (req, res) => {
    const publisher = new Publisher({
        name: req.body.name,
        headquarter: req.body.headquarter,
        ceo: req.body.ceo,
        foundedAt: new Date(req.body.foundedAt)
    });

    try {
        await publisher.save();
        req.flash('success_message', 'New publisher added.');
        res.redirect('/admin/publisher/');
    }
    catch(err) {
        console.log(err.message);
        res.render('admin/publisher/create', {publisher: publisher});
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const publisher = await Publisher.findById(req.params.id);
        res.render('admin/publisher/edit', {publisher: publisher});
    }
    catch (err) {
        console.log(err.message);
        res.redirect(`/admin/publisher`);
    }
});

router.put('/:id', async (req, res) => {
    let publisher;
    try {
        publisher = await Publisher.findById(req.params.id);
        publisher.name = req.body.name;
        publisher.headquarter = req.body.headquarter;
        publisher.ceo = req.body.ceo;
        publisher.foundedAt = new Date(req.body.foundedAt);

        await publisher.save();
        req.flash('success_message', `Data edited successfully.`);
        res.redirect(`/admin/publisher/${publisher.id}`);
    }
    catch (err) {
        console.log(err.message);
        req.flash('error_message', `Error updating publisher's data.`);
        res.render('admin/publisher/edit', {publisher: publisher});
    }
});

router.delete('/:id', async (req, res) => {
    let publisher;
    try {
        publisher = await Publisher.findById(req.params.id);
        
        await publisher.remove();
        
        req.flash('error_message', `Publisher has been deleted.`);
        res.redirect('/admin/publisher');
    }
    catch (err) {
        console.log();
        if (publisher == null) {
            res.redirect('/admin/publisher');
        }
        else {
            res.redirect(`/admin/publisher/${publisher.id}`);
        }
    }
});

module.exports = router;