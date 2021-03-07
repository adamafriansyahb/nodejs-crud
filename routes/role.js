const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

router.get('/', async (req, res) => {
    const roles = await Role.find();
    res.render('admin/role/index', {roles: roles});
});

router.get('/create', (req, res) => {
    res.render('admin/role/create');
});

router.post('/', async (req, res) => {
    if (!req.body.name) {
        res.render('admin/role/create', {errorMessage: "Field Name is required!"});
    }

    else {
        const role = new Role({
            name: req.body.name
        });
    
        try {
            await role.save();
            req.flash('success_message', 'New role added');
            res.redirect('/admin/role');
        }
        catch(err) {
            console.log(err);
            res.redirect('/admin/role/create');
        }
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        res.render('admin/role/edit', {role: role});
    }
    catch(err) {
        console.log(err);
        res.redirect('/admin/role');
    }
});

router.put('/:id', async (req, res) => {
    let role;
    try {
        role = await Role.findById(req.params.id);
        role.name = req.body.name;

        await role.save();

        req.flash('success_message', 'Role edited.');
        res.redirect('/admin/role');
    }
    catch(err) {
        console.log(err);
        req.flash('error_message', 'Error updating role.');
        res.render('admin/role/edit', {role});
    }
});

router.delete('/:id', async (req, res) => {
    let role;
    try {
        role = await Role.findById(req.params.id);
        await role.remove();
        req.flash('error_message', 'Role deleted.');
        res.redirect('/admin/role');
    }
    catch(err) {
        console.log(err);
        req.flash('error_message', err.message);
        res.redirect('/admin/role');
    }
});

module.exports = router;