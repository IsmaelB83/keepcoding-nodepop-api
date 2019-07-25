// Own imports
const Item = require('../../models/Item');

const ctrl = {};


ctrl.select = async (req, res, next) => {
    try {
        Item.list(req.query, function(error, results) {
            // Error
            if (error) {
                next({
                    success: false, 
                    message: error
                });
                return;
            }
            // Ok
            res.json({
                success: true,
                results: results
            });
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({success: false, message: error});
    }
}

ctrl.selectOne = async (req, res, next) => {
    try {
        // Busco haciendo uso de findById. Hago un regex previo para evitar errores de mongoose
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            let item = await Item.findById(req.params.id);   
            if (item) {
                res.json({
                    success: false, 
                    result: item
                });
                return;
            }   
        } 
        // Si llegamos aquí es que no se ha encontrado un resultado
        next({
            status: 404,
            success: false, 
            message: 'Not Found'
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({success: false, message: error});
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
        next({
            success: false, 
            message: 'Not created'
        });
        res.status(500).json({error: 'No se ha podido insertar el anuncio'});
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({success: false, message: error});
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
        next({
            status: 404,
            success: false, 
            message: 'Not Found'
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({success: false, message: error});
    }
}

ctrl.tags = async (req, res, next) => {
    try {
        // Esta ruta devuelve los tags existentes en la base de datos, y el contador de apariencias de cada uno
        res.json({
            anuncios: 'http://localhost:3001/apiv1/anuncios/',
            tags: 'http://localhost:3001/apiv1/tags/'
        });
    } catch (error) {
        log.fatal(`Error incontrolado: ${error}`);
        next({success: false, message: error});
    }
}


module.exports = ctrl;