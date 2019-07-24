// Node imports
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// Own imports
const routerWeb = require('../routes/Web');
const routerItem = require('../routes/apiv1/Item');


module.exports = function(app) {
    // View engine settings (ejs)
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    // Static files
    app.use(express.static('public'));
    // Middlewares
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    // Routers
    app.use('/', routerWeb());
    app.use('/apiv1', routerItem());
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });
    // error handler
    app.use(function(error, req, res, next) {
        // status 500 si no se indica lo contrario
        if (!error.status) error.status = 500;
        // set locals, only providing error in development
        res.locals.message = error.message;
        res.locals.error = req.app.get('env') === 'development' ? error : {};
        // render the error page
        res.status(error.status);
        res.render('error', {error});
    });
    // Retorno la aplicación
    return app;
};