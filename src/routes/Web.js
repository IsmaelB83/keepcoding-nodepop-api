const express = require('express');
const WebCtrl = require('../controllers/Web');


module.exports = () => {
    const router = express.Router();
    // Rutas de anuncios
    router.get('/', WebCtrl.index);
    // Retorno el router
    return router;
}