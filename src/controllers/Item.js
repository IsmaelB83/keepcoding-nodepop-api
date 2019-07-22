// Own imports
const Item = require('../models/Item');

const ctrl = {};

ctrl.select = async (req, res, next) => {
    try {
        Item.list(req.query, function(err,result) {
            // Error
            if (err) {
                next(err);
                return;
            }
            // Ok
            res.json({
                status: 'ok',
                number: result.length,
                result: result
            });
        });
    } catch (error) {
        // Error no controlado
        log.fatal(`Error incontrolado: ${error}`);
        res.json({
            status: 'ko',
            description: `Error incontrolado: ${error}`,
        });
    }
}

ctrl.selectOne = async (req, res, next) => {
    try {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            let item = await Item.findById(req.params.id);   
            if (item) {
                res.json({
                    status: 'ok',
                    number: 1,
                    result: item
                });
            } else {
                res.json({
                    status: 'ko',
                    description: `Id ${req.params.id} no encontrado`,
                });
            }   
        } else {
            res.json({
                status: 'ko',
                description: `Id ${req.params.id} incorrecto`,
            });
        }
    } catch (error) {
        // Error no controlado
        log.fatal(`Error incontrolado: ${error}`);
        res.json({
            status: 'ko',
            description: `Error incontrolado: ${error}`,
        });
    }
}

ctrl.create = async (req, res, next) => {
    try {
        let item = new Item({...req.body});
        item = await item.save();
        res.json({
            status: 'ok',
            number: 1,
            result: item
        });
    } catch (error) {
        // Error no controlado
        log.fatal(`Error incontrolado: ${error}`);
        res.json({
            status: 'ko',
            description: `Error incontrolado: ${error}`,
        });
    }
}

ctrl.update = async (req, res, next) => {
    try {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            // Busco el anuncio indicado
            let item = await Item.findById(req.params.id);
            // Si viene el parametro en el body lo sobreescribo
            item.name = req.body.name?req.body.name:item.name;
            item.price = req.body.price?req.body.price:item.price;
            item.type = req.body.type?req.body.type:item.type;
            item.photo = req.body.photo?req.body.photo:item.photo;
            item.tags = req.body.tags?req.body.tags:item.tags;
            item.active = req.body.active?req.body.active:item.active;
            // Salvo datos en mongo
            item = await item.save();
            if (item) {
                // Se ha podido grabar el resultado
                res.json({
                    status: 'ok',
                    number: 1,
                    result: item
                });
            } else {
                // No se ha conseguido grabar el resultado
                res.json({
                    status: 'ko',
                    description: `Id ${req.params.id} no encontrado`,
                });
            }   
        } else {
            // El ID indicado por parámetro no es correcto
            res.json({
                status: 'ko',
                description: `Id ${req.params.id} incorrecto`,
            });
        }
    } catch (error) {
        // Error no controlado
        log.fatal(`Error incontrolado: ${error}`);
        res.json({
            status: 'error',
            description: `Error incontrolado: ${error}`,
        });
    }
}

module.exports = ctrl;