var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/user');
var configAuth = require('./auth');

module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: configAuth.facebookAuth.profileFields,
        passReqToCallback: true
    },

        (req, accessToken, refreshToken, profile, done) => {
        if (req.user) {
            User.findOne({ facebook: profile.id }, (err, existingUser) => {
                if (err) { return done(err); }
                if (existingUser) {
                    req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                    done(err);
                } else {
                    User.findById(req.user.id, (err, user) => {
                        if (err) { return done(err); }
                        user.facebook = profile.id;
                        user.tokens.push({ kind: 'facebook', accessToken });
                        user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
                        user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
                        user.save((err) => {
                            req.flash('info', { msg: 'Facebook account has been linked.' });
                            done(err, user);
                        });
                    });
                }
            });
        } else {
            User.findOne({ facebook: profile.id }, (err, existingUser) => {
                if (err) { return done(err); }
                if (existingUser) {
                    return done(null, existingUser);
                }
                User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
                    if (err) { return done(err); }
                    if (existingEmailUser) {
                        req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
                        done(err);
                    } else {
                        const user = new User();
                        user.email = profile._json.email;
                        user.facebook = profile.id;
                        user.tokens.push({ kind: 'facebook', accessToken });
                        user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
                        user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                        user.profile.location = (profile._json.location) ? profile._json.location.name : '';
                        user.save((err) => {
                            done(err, user);
                        });
                    }
                });
            });
        }
    }));

        // facebook will send back the token and profile
      /*  function (token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function () {
                User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        const payload = {
                            sub: user.facebook.id
                        }
                        console.log("old user!!!!");
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();
                        console.log("new user!!!!");
                        // set all of the facebook information in our user model
                        newUser.facebook.id = profile.id; // set the users facebook id                   
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        //newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.name = profile.displayName;
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });

            });
        }));*/

                // find the user in the database based on their facebook id
                
       

    passport.use(new GoogleStrategy({

        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true

    }, (req, accessToken, refreshToken, profile, done) => {
        if (req.user) {
            User.findOne({ google: profile.id }, (err, existingUser) => {
                if (err) { return done(err); }
                if (existingUser) {
                    console.log('There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.');
                    req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                    done(err);
                } else {
                    User.findById(req.user.id, (err, user) => {
                        if (err) { return done(err); }
                        user.google = profile.id;
                        user.tokens.push({ kind: 'google', accessToken });
                        user.profile.name = user.profile.name || profile.displayName;
                        user.profile.picture = user.profile.picture || profile._json.image.url;
                        user.save((err) => {
                            req.flash('info', { msg: 'Google account has been linked.' });
                            done(err, user);
                        });
                    });
                }
            });
        } else {
            User.findOne({ google: profile.id }, (err, existingUser) => {
                if (err) { return done(err); }
                if (existingUser) {
                    return done(null, existingUser);
                }
                User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
                    if (err) { return done(err); }
                    if (existingEmailUser) {
                        console.log('There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.')
                        req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
                        done(err);
                    } else {
                        const user = new User();
                        user.email = profile.emails[0].value;
                        user.google = profile.id;
                        user.tokens.push({ kind: 'google', accessToken });
                        user.profile.name = profile.displayName;
                        user.profile.picture = profile._json.image.url;
                        user.save((err) => {
                            done(err, user);
                        });
                    }
                });
            });
        }
    }));
      /*  function (token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function () {

                // try to find the user based on their google id
                User.findOne({ 'google.id': profile.id }, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if a user is found, log them in
                        return done(null, user);
                    } else {
                        // if the user isnt in our database, create a new user
                        var newUser = new User();

                        // set all of the relevant information
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email

                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        })); */


    passport.use(new TwitterStrategy({

        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL,
        passReqToCallback: true

    }, (req, accessToken, tokenSecret, profile, done) => {
        if (req.user) {
            User.findOne({ twitter: profile.id }, (err, existingUser) => {
                if (err) { return done(err); }
                if (existingUser) {
                    console.log('There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.');
                    req.flash('errors', { msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
                    done(err);
                } else {
                    User.findById(req.user.id, (err, user) => {
                        if (err) { return done(err); }
                        user.twitter = profile.id;
                        user.tokens.push({ kind: 'twitter', accessToken, tokenSecret });
                        user.profile.name = user.profile.name || profile.displayName;
                        user.profile.location = user.profile.location || profile._json.location;
                        user.profile.picture = user.profile.picture || profile._json.profile_image_url_https;
                        user.save((err) => {
                            if (err) { return done(err); }
                            console.log('Twitter account has been linked.');
                            req.flash('info', { msg: 'Twitter account has been linked.' });
                            done(err, user);
                        });
                    });
                }
            });
        } else {
            User.findOne({ twitter: profile.id }, (err, existingUser) => {
                if (err) { return done(err); }
                if (existingUser) {
                    return done(null, existingUser);
                }
                const user = new User();
                // Twitter will not provide an email address.  Period.
                // But a person’s twitter username is guaranteed to be unique
                // so we can "fake" a twitter email address as follows:
                user.email = `${profile.username}@twitter.com`;
                user.twitter = profile.id;
                user.tokens.push({ kind: 'twitter', accessToken, tokenSecret });
                user.profile.name = profile.displayName;
                user.profile.location = profile._json.location;
                user.profile.picture = profile._json.profile_image_url_https;
                user.save((err) => {
                    done(err, user);
                });
            });
        }
    }));
        /*function (token, tokenSecret, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function () {

                User.findOne({ 'twitter.id': profile.id }, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser = new User();

                        // set all of the user data that we need
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        // save our user into the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            });

        })); */
    function isAuthenticated(req, res, next){
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/signup');
    };

    function isAuthorized(req, res, next){
        const provider = req.path.split('/').slice(-1)[0];
        const token = req.user.tokens.find(token => token.kind === provider);
        if (token) {
            next();
        } else {
            res.redirect(`/auth/${provider}`);
        }
    };

};




