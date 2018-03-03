var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require("passport");
var configDB = require('./config/database.js');
var mongoose = require('mongoose');
var session = require("express-session");
var flash = require('express-flash');

var home = require('./routes/home');
var about = require('./routes/about');
var tutorial = require('./routes/tutorial');
var donate = require('./routes/donate');
var signin = require('./routes/signin');
var register = require('./routes/register');
var user = require('./routes/user');
const MongoStore = require('connect-mongo')(session);

var app = express();
mongoose.connect(configDB.url);

// required for passport
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '111a9f7bd94518b0a3ce374e5e406036faed5bbb',
    store: new MongoStore({
        url: "mongodb://localhost/smart3",
        //url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
        autoReconnect: true,
        clear_interval: 3600
    })
}));
//app.use(session({ secret: '111a9f7bd94518b0a3ce374e5e406036faed5bbb',cookie: { maxAge: 60000 }})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());



require('./config/passport')(passport);

require('./routes/auth')(app, passport); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(path.join(__dirname, 'public')));


app.use('/', home);
app.use('/about', about);
app.use('/donate', donate);

app.use('/tutorial', tutorial);
app.use('/signin', signin);
app.use('/register', register);

app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
 /*   app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // route for logging out
    


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
} */





module.exports = app;
