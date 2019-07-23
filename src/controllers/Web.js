// Node imports
var moment = require('moment');
// Own imports
const Item = require('../models/Item');

const ctrl = {};

moment.locale('es');

ctrl.index = async (req, res, next) => {
    try {
        // Busco los anuncios en Mongo
        let limit = req.query.limit || null;
        let skip = req.query.skip || null;
        let fields = req.query.fields || null;
        let sort = req.query.sort || null;
        let filter = {}
        if (req.query.name) filter.name = { '$regex': req.query.name, '$options': 'i' };
        if (req.query.type) filter.type = req.query.type.toLowerCase();
        if (req.query.tag) filter.tags = req.query.tag.toLowerCase();
        Item.list(filter, limit, skip, fields, sort, function(err,result) {
            // Error
            if (err) {
                res.render('err.ejs', {})
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
        // Error no controlado
        log.fatal(`Error incontrolado: ${error}`);
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
        res.render('err.ejs', {})
    } catch (error) {
        // Error no controlado
        log.fatal(`Error incontrolado: ${error}`);
        res.render('err.ejs', {error})
    }
}

module.exports = ctrl;