// Own imports
const { Tag } = require('../models');

const ctrl = {};

ctrl.all = async (req, res, next) => {
    try {
        let tags = await Tag.find({});
        res.json({
            status: 'ok',
            result: tags
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
        let Tag = new Tag({...req.body});
        Tag = await Tag.save();
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