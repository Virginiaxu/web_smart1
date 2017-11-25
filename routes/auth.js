module.exports = function (app, passport) {
    console.log("executing the function");
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['public_profile', 'email']
        }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));
    app.get('/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    app.get('/auth/twitter',
        passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    app.get('/logout', function (req, res, next) {
        req.logout();
        res.redirect('/');
    });
}