'use strict';
// Node imports
const express = require('express');
const { check } = require('express-validator');
// Own imports
const WebCtrl = require('../controllers/Web');


module.exports = () => {
    const router = express.Router();
    // Rutas de anuncios
    router.get('/', [
        check('name').isLength({max: 30}).withMessage('máximo 30 caracteres'),
        check('description').isLength({max: 100}).withMessage('máximo 100 caracteres'),
        check('skip').isNumeric({max: 100}).withMessage('must be numeric'),
        check('limit').isNumeric({max: 100}).withMessage('must be numeric')
    ], WebCtrl.index);
    router.get('/:id', WebCtrl.detail);
    // Retorno el router
    return router;
}