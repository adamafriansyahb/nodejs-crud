const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin/book/index');
});

router.get('/create', (req, res) => {
    res.render('admin/book/create');
});

router.post('/', (req, res) => {
    
});

module.exports = router;