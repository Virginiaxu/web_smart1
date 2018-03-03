var express = require('express');
var router = express.Router();
var fs = require("fs");
const User = require("../models/user");
const Job = require("../models/job");
//const Result = require("../models/result");


var multer = require('multer');
var upload = multer({ limits: { fileSize: 2000000 }, dest: '/uploads/' })

router.get('/', isAuthenticated, function (req, res, next) {
    res.render('user');
});

router.post('/account', isAuthenticated, upload.array('images', 12),function (req, res, next) {
    var user_id = req.user.id;
 
    User.findById(user_id, function (err, user) {
        if (err) {
            res.status(500).send(err);
        } else {
            console.log("posted name is " + req.body.fname);
            console.log("posted last name is " + req.body.lname)  
            if (req.body.fname) {
                user.profile.fname = req.body.fname;
                console.log("profile first name is " + user.profile.fname);
            }
            if (req.body.lname) {
                user.profile.fname = req.body.fname;
            }
            if(req.body.aemail)
                user.profile.aemail = req.body.aemail;
            if (req.body.labname)
                user.profile.labname = req.body.labname;
            user.save(function (err, user) {
                console.log("saving......")
                if (err) {
                    res.status(500).send(err)
                }
                console.log(user.profile.fname)
                res.redirect("/user/account");
            }); 
        }
    })
   
});

router.get('/upload', isAuthenticated, function (req, res, next) {
    res.render('upload');
});

router.get('/previous', isAuthenticated, function (req, res, next) {
    var user_id = req.user.id;
    console.log("user id is " + user_id)
    Job.find().where('user_id').equals(user_id).exec(function (err, jobs) {
        if (err) {
            console.log(err);
        }
        console.log("the previous jobs is " + jobs);
        res.render("previous", { jobs: jobs });
    })
});


router.post('/upload', isAuthenticated, upload.array('images', 12), function (req, res, next) {
    console.log("job name is " + req.body.name)
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

router.get('/account', isAuthenticated, function (req, res, next) {

    res.render('account');
});


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signup');
};



//need to verify the token

module.exports = router;