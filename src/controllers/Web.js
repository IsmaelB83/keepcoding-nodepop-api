// Node imports
var moment = require('moment');
// Own imports
const Item = require('../models/Item');

const ctrl = {};

ctrl.index = async (req, res, next) => {
    try {
        // Busco los anuncios en Mongo
        let result;
        if (req.query.tag) result = await Item.find({tags: req.query.tag});
        else result = await Item.find();
        // Ok
        moment.locale('es');
        res.render('index.ejs',  {
            status: 'ok',
            number: result.length,
            items: result,
            moment: moment
        });
        return;
        
        Item.list(req.query, function(err,result) {
            // Error
            if (err) {
                res.render('err.ejs', {})
                return;
            }
            // Ok
            res.render('index.ejs',  {
                status: 'ok',
                number: result.length,
                result: result
            });
        });
    } catch (error) {
        // Error no controlado
        log.fatal(`Error incontrolado: ${error}`);
    }
}

module.exports = ctrl;