// Node imports
const fs = require('fs');
// Own imports
const database = require('./index');
const Item = require('../models/Item');
const Config = require('../config');

// Inicializar base de datos
initDB();

/**
 * Función para inicializar la base de datos y cargar los anuncios predefinidos
 */
async function initDB() {
    try {
        // Conecto a la base de datos
        debugger;
        await database.connectToMongo(Config.mongodb);
        // Borro los datos de la colección de anuncion
        await Item.deleteMany({});
        // Creo los nuevos anuncios desde el json
        let dump = JSON.parse(fs.readFileSync('./src/database/data.json', 'utf8'));
        let items = [];
        for (let i = 0; i < dump.anuncios.length; i++) {
            items.push (new Item({...dump.anuncios[i]}));
        }
        await Item.insertMany(items);
        log.info(`Base de datos inicializada con ${items.length} anuncios.`);
        log.info(`Proceso de inicialización finalizado. Puede arrancar la API mediante "npm start".`);
    } catch (error) {
        log.fatal('ERROR: No se ha inicializar la base de datos.');
        log.fatal(error);
    }
}