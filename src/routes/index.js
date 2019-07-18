const express = require('express');
const { ItemCtrl } = require('../controllers');

module.exports = () => {
    const router = express.Router();
    // Rutas de anuncios
    router.get('/item/', ItemCtrl.select);
    router.get('/item/:id', ItemCtrl.selectOne);
    router.put('/item/:id', ItemCtrl.update);
    router.post('/item/', ItemCtrl.create);
    // Retorno el router
    return router;
}