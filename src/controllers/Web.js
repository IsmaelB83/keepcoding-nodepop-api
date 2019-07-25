'use strict';
// Node imports
var moment = require('moment');
// Own imports
const Item = require('../models/Item');
const log = require('../utils/log');


const ctrl = {};

moment.locale('es');

ctrl.index = async (req, res, next) => {
    try {
        // Busco los anuncios en Mongo
        Item.list(req.query.name, req.query.venta, req.query.tag, req.query.precio, req.query.limit, 
            req.query.skip, req.query.fields, req.query.sort, function(error, results) {
            // Error
            if (error) {
                next({status: 500, message: error});
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
        debugger;
        log.fatal(`Error incontrolado: ${error}`);
        next({status: 500, message: error});
    }
}

ctrl.detail = async (req, res, next) => {
    try {
        // Busco el anuncio por ID
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
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
        }
        next({status: 404, message: 'Not found'});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({status: 500, message: error});
    }
}


module.exports = ctrl;