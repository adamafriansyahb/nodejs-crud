const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const User = require('../models/User');

router.get('/', async (req, res) => {
    const menus = await Menu.find();
    const user = await User.findById(req.user._id).populate('role').exec();
    res.render('admin/menu/index', {user, menus});
});

router.get('/create', async (req, res) => {
    const user = await User.findById(req.user._id).populate('role').exec();
    res.render('admin/menu/create', {user});
});

router.post('/', async (req, res) => {
    const menu = new Menu({
        name: req.body.name,
        text: req.body.text,
        path: req.body.path,
        logo: req.body.logo
    });
    try {
        await menu.save();
        req.flash('success_message', 'Menu created successfully.');
        res.redirect('/admin/menu');
    }
    catch(err) {
        console.log(err);
        res.render('admin/menu/create', {menu});
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        const user = await User.findById(req.user._id).populate('role').exec();
        res.render('admin/menu/edit', {user, menu});
    }
    catch(err) {
        console.log(err);
        res.redirect('/admin/menu');
    }
});

router.put('/:id', async (req, res) => {
    let menu;
    try {
        menu = await Menu.findById(req.params.id);
        menu.name = req.body.name;
        menu.text = req.body.text;
        menu.path = req.body.path;
        menu.logo = req.body.logo;
        await menu.save();

        req.flash('success_message', 'Menu updated.');
        res.redirect('/admin/menu');
    }
    catch (err) {
        console.log(err);
        req.flash('error_message', 'Error updating menu.');
        res.render('admin/menu/edit', {menu});
    }
});

router.delete('/:id', async (req, res) => {
    let menu;
    try {
        menu = await Menu.findById(req.params.id);
        await menu.remove();
        req.flash('error_message', 'Menu has been deleted.');
        res.redirect('/admin/menu');
    }
    catch(err) {
        req.flash('error_message', err.message);
        res.redirect('/admin/menu');
    }
});

module.exports = router;