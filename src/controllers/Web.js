// Node imports
var moment = require('moment');
// Own imports
const Item = require('../models/Item');

const ctrl = {};

moment.locale('es');

ctrl.index = async (req, res, next) => {
    try {
        // Busco los anuncios en Mongo
        Item.list(req.query, function(error,result) {
            // Error
            if (error) {
                next({status: 500, message: error});
                return;
            }
            // Ok
            res.render('index.ejs',  {
                status: 'ok',
                number: result.length,
                items: result,
                moment: moment
            });
        });
    } catch (error) {
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
                    status: 'ok',
                    item: result,
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