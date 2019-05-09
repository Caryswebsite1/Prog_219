var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// note: would be better to make this all a global for the routes somehow...
// New code that knows mongo and a nice abstraction layer
var mongo = require('mongodb');
var monk = require('monk'); 

// mongo database connection string to my mongo database:
var db = monk('mongodb + srv://BCStudent:BCStudent1@cluster0-jsvwa.mongodb.net/test?retryWrites=true');

var route = require('./routes/index');
var users = require('./routes/users');
var newroute = require('./routes/newroute');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our routers
app.use(function (req, res, next) {
    req.db = db; // db is what we just created prior slide
    next();
}); 

app.use('/', route);
app.use('/users', users);
app.use('/newroute', newroute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
