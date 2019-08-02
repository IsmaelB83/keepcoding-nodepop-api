'use strict';
// Node imports
var moment = require('moment');
const { validationResult } = require('express-validator');
// Own imports
const Item = require('../models/Item');
const Log = require('../utils/log');


const ctrl = {};

moment.locale('es');

ctrl.index = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Busco los anuncios en Mongo
        Item.list(req.query.name, req.query.venta, req.query.tag, req.query.price, parseInt(req.query.limit),
            parseInt(req.query.skip), req.query.fields, req.query.sort, function(error, results) {
            // Error
            if (error) {
                next({error});
                return;
            } 
            // Ok
            res.render('index.ejs',  {
                success: true,
                count: results.length,
                results: results,
                moment: moment
            });
        });
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

ctrl.detail = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Busco el anuncio por ID
        let result = await Item.findById(req.params.id);
        if (result) {
            // Ok
            res.render('detail.ejs',  {
                success: true,
                result: result,
                moment: moment
            });
            return;
        }
        // Si llego aquí es que no se encontró nada
        next({status: 404, error: 'Not found'});
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}


module.exports = ctrl;