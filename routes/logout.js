var express = require('express');
var router = express.Router();

app.get('/logout', function (req, res,next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;