const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.get('/register', (req, res) => {
    res.send('This is register page.');
})

module.exports = router;