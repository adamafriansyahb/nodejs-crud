module.exports = {
    checkAuth: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_message', 'Please log in first.');
        res.redirect('/login');
    }
}