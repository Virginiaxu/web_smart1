module.exports = function (app, passport) {
    console.log("executing the function");

    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['public_profile', 'email']
        }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/user',
            failureRedirect: '/signin'
        }));

    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        }));

    /*app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureFlash: true
        }), function (req, res) {
            res.redirect(req.body.ref_path);
        }
    );*/

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/user',
            failureRedirect: '/signin'
        }));

    app.get('/auth/twitter',
        passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/user',
            failureRedirect: '/signin'
        }));


    app.get('/logout', function (req, res, next) {
        req.logout();
        res.redirect('/');
    });
}