// Own imports
const { Item } = require('../models');

const ctrl = {};

ctrl.all = async (req, res, next) => {
    try {
        let items = await Item.find({});
        res.json({
            status: 'ok',
            result: items
        });
    } catch (error) {
        // Log
        log.fatal(`Error incontrolado: ${error}`);
        // Respondo
        res.json({
            status: 'error',
            description: `Uncontrolled error: ${error}`,
        });
    }
}

ctrl.create = async (req, res, next) => {
    try {
        let item = new Item({...req.body});
        item = await item.save();
        res.json({status: 'ok'});
    } catch (error) {
        // Log
        log.fatal(`Error incontrolado: ${error}`);
        // Respondo
        res.json({
            status: 'error',
            description: `Uncontrolled error: ${error}`,
        });
    }
}

module.exports = ctrl;