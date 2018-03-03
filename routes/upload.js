/*    ignore for now   !!!!!!!!!!!*/

var express = require('express');
var router = express.Router();
const User = require("../models/user");
const Job = require("../models/job");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('upload');
});

router.post('/', function (req, res, next) {
    const job_name = req.body.name;
    const images = req.body.images;
    const share = req.body.share;
    var visible;
    if (share) {
        visible = req.body.visible;
    }
    else {
        visible = false;
    }
    const new_job = {
        user_id: req.user.id,
        name: job_name,
        share: share,
        visible: visible,
        images: images,
        time: Date.now()
    }
    Job.create(newJob, function (err, new_job) {
        if (err) {
            console.log(err)
        }
        console.log("new_job is " + new_job)
    })
})

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;