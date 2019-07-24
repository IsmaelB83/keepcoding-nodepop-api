// Own imports
const Item = require('../../models/Item');

const ctrl = {};

ctrl.select = async (req, res, next) => {
    try {
        Item.list(req.query, function(error,result) {
            // Error
            if (error) {
                res.status(500).json({error});
                return;
            }
            // Ok
            res.json({
                number: result.length,
                result: result
            });
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        res.status(500).json({error});
    }
}

ctrl.selectOne = async (req, res, next) => {
    try {
        // Busco haciendo uso de findById. Hago un regex previo para evitar errores de mongoose
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            let item = await Item.findById(req.params.id);   
            if (item) {
                res.json({
                    number: 1,
                    result: item
                });
                return;
            }   
        } 
        // Si llegamos aquí es que no seha encontrado un resultado
        res.status(404).json({error: 'Not found'});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        res.status(500).json({error});
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
        log.fatal(`Error incontrolado: ${error}`);
        res.status(500).json({error});
    }
}

ctrl.update = async (req, res, next) => {
    try {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            // Busco el anuncio indicado
            let item = await Item.findById(req.params.id);
            if (item) {
                // Si viene el parametro en el body lo sobreescribo
                item.name = req.body.name?req.body.name:item.name;
                item.price = req.body.price?req.body.price:item.price;
                item.type = req.body.type?req.body.type:item.type;
                item.photo = req.body.photo?req.body.photo:item.photo;
                item.tags = req.body.tags?req.body.tags:item.tags;
                item.description = req.body.description?req.body.description:item.description;
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
                    res.status(500).json({error: 'No se han podido guardar los cambios'});
                }
                return;
            }
        }
        // Si llegamos aquí es que no seha encontrado un resultado
        res.status(404).json({error: 'Not found'});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        res.status(500).json({error});
    }
}

module.exports = ctrl;