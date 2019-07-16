// Import node modules
const mongoose = require('mongoose');
// Import own modules
const { config } = require('../config');
const { log } = require('../utils');

const database = {
    connectToMongo: async () => {
                        try {
                            // Conecto a la base de datos
                            let db = await mongoose.connect(config.mongodb, { useNewUrlParser: true });
                            log.info(`Conectado a mongodb ${db.connection.host}:${db.connection.port}/${db.connection.name}`);
                        } catch (error) {
                            log.fatal(`Error conectando a mongo: ${error.errno} ${error.address}:${error.port}`);
                        }
                    },
    createDataBase: async () => {
                        throw 'Not implemented yet';
                    }
}

module.exports = database;
