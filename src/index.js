'use strict';
// Node imports
const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
// Own imports
const Config = require('./config');
const database = require('./database');
const server = require('./app');
const log = require('./utils/log');

// Configuración del servidor indicada por parámetros de usuario?
const CONFIG = {
    HTTPS: process.env.HTTPS,
    PORT: process.env.PORT || Config.ports[0]
};

// Crear aplicación express y arrancar el server
const app = server(express());
initServer()

/**
* Función asincrona para inicializar el servidor
*/
async function initServer() {
    try {
        // Conectar a BD
        let connected = await database.connectToMongo(Config.mongodb);
        if (connected === false) {
            log.fatal('Se cierra la aplicación dado que no es posible conectar a mongodb');
            process.exit(1);
        }
        // Si se conecto a mongo se continua con la inicialización del server express
        let server;
        if (!CONFIG.HTTPS) {
            server = http.createServer(app);
        } else {
            console.log(CONFIG);
            const privateKey = fs.readFileSync(Config.privateKey, 'utf8');
            const certificate = fs.readFileSync(Config.certificate, 'utf8');
            const ca = fs.readFileSync(Config.ca, 'utf8');
            const credentials = {
                key: privateKey,
                cert: certificate,
                ca: ca
            };
            server = https.createServer(credentials, app);
        }
        // Arranco el server
        server.listen(CONFIG.PORT, () => {
            console.log(CONFIG);
            log.info(`OK - ${CONFIG.HTTPS?'HTTPS':'HTTP'} Server running on port ${CONFIG.PORT}`);
        });        
    } catch (error) {
        // Error no controlado
        console.log(`Error while starting server: ${error.code} ${error.path}`);
        console.log(error);
        process.exit(1);
    }
}