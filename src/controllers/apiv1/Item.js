'use strict';
// Own imports
const { validationResult } = require('express-validator');
// Node imports
const Item = require('../../models/Item');
const Log = require('../../utils/log');

const ctrl = {};

ctrl.select = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Listado
        Item.list(req.query.name, req.query.venta, req.query.tag, req.query.price, parseInt(req.query.limit), 
            parseInt(req.query.skip), req.query.fields, req.query.sort, function(error, results) {
            // Error
            if (error) {
                next({error});
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
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

ctrl.selectOne = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        let item = await Item.findById(req.params.id);   
        if (item) {
            res.json({
                success: true, 
                result: item
            });
            return;
        }   
        // Si llegamos aquí es que no se ha encontrado un resultado
        next({ status: 404, error: 'Not Found' });
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

ctrl.create = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Nuevo anuncio
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
        next({error: 'No se ha podido insertar el anuncio'});
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

ctrl.update = async (req, res, next) => {
    try {
        // Validaciones
        validationResult(req).throw();
        // Actualizo el anuncio y retorno el item actualizado
        let item = await Item.updateItem(req.params.id, new Item({...req.body}));
        if (item) {
            res.json({
                success: true,
                result: item
            });
            return;
        }
        // Si llegamos aquí es que no se ha encontrado un resultado
        next({ status: 404, error: 'Not Found' });
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}

ctrl.tags = async (req, res, next) => {
    try {
        // Listado
        let results = await Item.find().distinct('tags');
        if (results) {
            res.json({
                success: true,
                count: results.length,
                results: results
            });
            return;
        }
        // Si llegamos aquí es que no se ha encontrado un resultado
        next({ status: 404, error: 'Not Found' });
    } catch (error) {
        // Los errores de validación de usuario NO me interesa loguerarlos
        if (!error.array) Log.fatal(`Error incontrolado: ${error}`);
        next(error);
    }
}


module.exports = ctrl;