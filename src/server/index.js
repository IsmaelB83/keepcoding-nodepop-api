// Node imports
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// Own imports
const router = require('../routes');

module.exports = function(app) {
    // View engine settings (ejs)
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    // Static files
    app.use('/public', express.static('public'));
    // Middlewares
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    // Routers
    app.use('/', router());
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });
    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // render the error page
        res.status(err.status || 500);
        res.render('error', {title: 'Error detectado', err});
    });
    // Retorno la aplicación
    return app;
};