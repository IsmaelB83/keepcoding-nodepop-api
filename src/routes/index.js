const express = require('express');
const { ItemCtrl, TagCtrl } = require('../controllers');

module.exports = () => {
    const router = express.Router();
    // Rutas de anuncios
    router.get('/tag/:id', TagCtrl.all);
    router.post('/tag/', TagCtrl.create);
    // Rutas de anuncios
    router.get('/item/:id', ItemCtrl.all);
    router.post('/item/', ItemCtrl.create);
    // Retorno el router
    return router;
}