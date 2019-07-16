// Node imports
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
// Own imports
const router = require('../routes/index');

module.exports = function(app) {
    // Static files
    app.use(express.static('public'));
    // Middlewares
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended: true}));
    // Routers
    app.use('/', router());
    // Retorno la aplicación
    return app;
};