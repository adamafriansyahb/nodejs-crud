const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');

router.get('/', async (req, res) => {
    const page = req.query.page;
    const options = {
        limit: 10,
        page: page,
        populate: 'role'
    }
    const users = await User.paginate({}, options);
    res.render('admin/user/index', {users: users.docs, config: users});
});

router.get('/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const roles = await Role.find();

        res.render('admin/user/edit', {user, roles});
    }
    catch(err) {
        console.log(err);
        res.redirect('/admin/user');
    }
});

router.put('/:id', async (req, res) => {
    let user;
    const roles = await Role.find();
    try {
        user = await User.findById(req.params.id);
        user.role = req.body.role;
        
        await user.save();
        res.redirect('/admin/user');
    }
    catch(err) {
        console.log(err);
        res.render('admin/user/edit', {user, roles});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await user.remove();
        req.flash('success_message', 'User removed.');
        res.redirect('/admin/user');
    }
    catch(err){
        console.log(err);
        req.flash('error_message', err.message);
        res.redirect('/admin/user');
    } 
});

module.exports = router;