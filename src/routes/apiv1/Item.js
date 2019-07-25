'use strict';
// Node imports
const express = require('express');
const { check } = require('express-validator');
// Own imports
const ItemCtrl = require('../../controllers/apiv1/Item');


module.exports = () => {
    const router = express.Router();
    // Rutas de anuncios
    router.get('/anuncios/', [
        check('name').isLength({max: 30}).withMessage('máximo 30 caracteres'),
        check('description').isLength({max: 100}).withMessage('máximo 100 caracteres'),
        check('skip').isNumeric({max: 100}).withMessage('must be numeric'),
        check('limit').isNumeric({max: 100}).withMessage('must be numeric')
    ], ItemCtrl.select);
    router.get('/anuncios/:id', ItemCtrl.selectOne);
    router.put('/anuncios/:id', ItemCtrl.update);
    router.post('/anuncios/', ItemCtrl.create);
    // Rutas de tags
    router.get('/tags', ItemCtrl.tags);
    // Retorno el router
    return router;
}