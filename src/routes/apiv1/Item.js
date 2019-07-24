const express = require('express');
const ItemCtrl = require('../../controllers/apiv1/Item');


module.exports = () => {
    const router = express.Router();
    // Rutas de anuncios
    router.get('/anuncios/', ItemCtrl.select);
    router.get('/anuncios/:id', ItemCtrl.selectOne);
    router.put('/anuncios/:id', ItemCtrl.update);
    router.post('/anuncios/', ItemCtrl.create);
    // Retorno el router
    return router;
}