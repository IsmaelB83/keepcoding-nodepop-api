// Import node modules
const mongoose = require('mongoose');
const fs = require('fs');
// Import own modules
const { config } = require('../config');
const { log } = require('../utils');
const { Item } = require('../models');

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
    deleteCollection: async() => {
                            try {
                                // Borro toda la colección
                                await Item.deleteMany({});
                            } catch (error) {
                                log.fatal(`Error borrando colección: ${error}`);
                            }
                        },
    createCollection: async () => {
                            try {
                                // Creo un set de datos de prueba a partir del fichero json
                                var dump = JSON.parse(fs.readFileSync('./src/database/data.json', 'utf8'));
                                for (const key in dump) {
                                    if (dump.hasOwnProperty(key)) {
                                        const element = dump[key];
                                        let item = new Item({...element});
                                        await item.save();                                    
                                    }
                                }
                            } catch (error) {
                                log.fatal(`Error creando item en colección: ${error}`);
                            }
                        }
}

module.exports = database;
