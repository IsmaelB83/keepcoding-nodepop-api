// Node imports
const express = require('express');
const http = require('http');
// Own imports
const { config } = require('./config');
const database = require('./database');
const server = require('./server');


// Función asincrona para inicializar el servidor
async function initServer() {
    // Base de datos
    await database.connectToMongo();
    // Servidor HTTP
    try {
        const httpServer = http.createServer(app);
        httpServer.listen(config.ports[config.http_type], () => {
            log.info(`HTTP OK - Server running on port ${config.ports[config.http_type]}`);
        });        
    } catch (error) {
        log.fatal(`HTTP Error - Server not running: ${error.code} ${error.path}`);
        log.fatal(error);
    }
}


// Crear server y arrancarlo
const app = server(express());
initServer();