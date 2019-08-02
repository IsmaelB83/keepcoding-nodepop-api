'use strict';
// Node imports
const express = require('express');
const { query, param, body } = require('express-validator');
// Own imports
const ItemCtrl = require('../../controllers/apiv1/Item');


module.exports = () => {
    const router = express.Router();
    // Rutas de anuncios
    router.get('/anuncios/', [
        query('name').optional().isLength({min:1, max: 30}).withMessage('debe estar entre 1 y 30 carácteres'),
        query('skip').optional().isInt({ gt: 0 }).withMessage('debe ser un numero entero mayor que 0'),
        query('limit').optional().isInt({ gt: 0 }).withMessage('debe ser un numero entero mayor que 0'),
        query('price').optional().custom(value => {
            let aux = value.split('-');
            let result = true;
            for (let i = 0; i < aux.length; i++) {
                if (aux[i] && isNaN(+aux[i])) {
                    result = false;
                }
            }
            return result;
        }).withMessage('debe ser numérico'),
    ], ItemCtrl.select);
    router.get('/anuncios/:id', [
        param('id').matches(/^[0-9a-fA-F]{24}$/).withMessage('presenta un formato incorrecto'),
    ], ItemCtrl.selectOne);
    router.put('/anuncios/:id', [
        param('id').matches(/^[0-9a-fA-F]{24}$/).withMessage('presenta un formato incorrecto'),
        body('name').optional().isLength({min:1, max: 30}).withMessage('debe estar entre 1 y 30 carácteres'),
        body('description').optional().optional().isLength({min:0, max: 100}).withMessage('debe estar entre 0 y 100 carácteres'),
        body('price').optional().isNumeric().withMessage('debe ser numérico'),
        body('photo').optional().exists().withMessage('es obligatorio indicar una foto'),
    ], ItemCtrl.update);
    router.post('/anuncios/', [
        body('name').isLength({min:1, max: 30}).withMessage('debe estar entre 1 y 30 carácteres'),
        body('description').optional().isLength({min:0, max: 100}).withMessage('debe estar entre 0 y 100 carácteres'),
        body('price').isNumeric().withMessage('debe ser numérico'),
        body('photo').exists().withMessage('es obligatorio indicar una foto'),
    ], ItemCtrl.create);
    // Rutas de tags
    router.get('/tags', ItemCtrl.tags);
    // Retorno el router
    return router;
}