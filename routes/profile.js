var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
    res.render('profile', {user: req.user});
});

module.exports = router;