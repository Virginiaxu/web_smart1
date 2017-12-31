var express = require('express');
var router = express.Router();
var fs = require("fs");
const User = require("../models/user");
const Job = require("../models/job");
//const Result = require("../models/result");


var multer = require('multer');
var upload = multer({ limits: { fileSize: 2000000 }, dest: '/uploads/' })

router.get('/', isLoggedIn, function (req, res, next) {
    var sessData = req.session;
    sessData.user_id = req.user._id;
    console.log(req.user._id);
    console.log(req.session.user_id);

    res.render('user', {user: req.user});
});


router.get('/upload', function (req, res, next) {
    
    res.render('upload');
});

router.get('/previous', function (req, res, next) {
    var user_id = req.session.user_id;
    Job.find().where('user_id').equals(user_id).exec(function (err, jobs) {
        if (err) {
            console.log(err);
        }
        console.log("the previous jobs is " + jobs);
        res.render("previous", { jobs: jobs });
    })
});



router.post('/upload', upload.array('images', 12), function (req, res, next) {
    var imagesArray = [];
    var files = req.files;
    for (index in files) {
        console.log(files[index].path);
        var image = fs.readFileSync(files[index].path);
        var newImage = {
            data: image,
            contentType: "image/png"
        }
        imagesArray[index] = newImage;
    };
    var share = false;
    if (req.body.share) {
        share = true;
    }
    var visible = false;
    if (share && req.body.visible) {
        visible = true;
    }
    const newJob = {
        user_id: req.session.user_id,
        name: req.body.name,
        share: share,
        visible: visible,
        images: imagesArray,
        time: Date.now()
    }
    Job.create(newJob, function (err, newJob) {
        if (err) {
            console.log(err)
        }
        console.log("new_job is " + newJob)
    })
    res.redirect("/user");
})

router.get('/account', function (req, res, next) {

    res.render('account');
});


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


//need to verify the token

module.exports = router;