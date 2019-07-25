'use strict';
// Own imports
const Item = require('../../models/Item');
// Node imports
const log = require('../../utils/log');

const ctrl = {};

ctrl.select = async (req, res, next) => {
    try {
        Item.list(req.query.name, req.query.venta, req.query.tag, req.query.precio, req.query.limit, 
            req.query.skip, req.query.fields, req.query.sort, function(error, results) {
            // Error
            if (error) {
                next({message: error});
                return;
            }
            // Ok
            res.json({
                success: true,
                count: results.length,
                results: results
            });
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({message: error});
    }
}

ctrl.selectOne = async (req, res, next) => {
    try {
        // Busco haciendo uso de findById. Hago un regex previo para evitar errores de mongoose
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            let item = await Item.findById(req.params.id);   
            if (item) {
                res.json({
                    success: true, 
                    result: item
                });
                return;
            }   
        } 
        // Si llegamos aquí es que no se ha encontrado un resultado
        next({
            status: 404,
            message: 'Not Found'
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({message: error});
    }
}

ctrl.create = async (req, res, next) => {
    try {
        let item = new Item({...req.body});
        item = await item.save();
        if (item) {
            res.json({
                success: true, 
                result: item
            });
            return;
        }
        // Si se ha llegado hasta aquí es que no se ha podido insertar
        next({message: 'Not created'});
        res.status(500).json({error: 'No se ha podido insertar el anuncio'});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({message: error});
    }
}

ctrl.update = async (req, res, next) => {
    try {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            // Actualizo el anuncio y retorno el item actualizado
            let item = await Item.updateItem(req.params.id, new Item({...req.body}));
            if (item) {
                res.json({
                    success: true,
                    result: item
                });
                return;
            }
        }
        // Si llegamos aquí es que no se ha encontrado un resultado
        next({ status: 404, message: 'Not Found' });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({message: error});
    }
}

ctrl.tags = async (req, res, next) => {
    try {
        // Esta ruta devuelve los tags existentes en la base de datos, y el contador de apariencias de cada uno
        next({ status: 404, message: 'Not Found' });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({message: error});
    }
}


module.exports = ctrl;