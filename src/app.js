'use strict';
// Node imports
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


module.exports = function(app) {
    // View engine settings (ejs)
    app.set('views', path.join(__dirname, './views'));
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
    app.use('/', require('./routes/Web')());
    app.use('/apiv1', require('./routes/apiv1/Item')());
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        next(createError(404));
    });
    // error handler
    app.use(function(error, req, res, next) {
        // Validation error
        if (error.array) { 
            error.status = 422;
            const errInfo = error.array({ onlyFirstError: true })[0];
            error.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
        }
        // status 500 si no se indica lo contrario
        res.status(error.status || 500);
        // Middleware de la API
        if (isAPI(req)) {
            res.json({
                success: false, 
                error: error.message
            });
            return;
        }
        // set locals, only providing error in development
        res.locals.message = error.message;
        res.locals.error = req.app.get('env') === 'development' ? error : {};
        // render the error page
        res.render('error', {error});
    });
    // Retorno la aplicación
    return app;
};

/**
 * Chequea si la url de la que proviene el request es de la API o de la Vista 
 * @param {Request} req Request que efectua la llamada al server
 */
function isAPI(req) {
    return req.originalUrl.indexOf('/api') === 0;
}