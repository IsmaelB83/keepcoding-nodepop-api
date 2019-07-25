'use strict';
// Node imports
const mongoose = require('mongoose');
const { Schema } = mongoose;
// Own imports
const log = require('../utils/log');

/**
* Anuncio en nodepop
*/
const ItemSchema = new Schema(
    {  
        /**
        * Nombre del articulo en compra/venta
        */
        name: { type: String, required: true, max: 30, index: true },
        /**
        * Descripcion del articulo en venta
        */
        description: { type: String, max: 100 },
        /**
        * Precio del artículo
        */
        price: { type: Number, required: true },
        /**
        * Tipo de anuncio: compra o venta
        */
        type: { type: String, enum: ['buy', 'sell'], required: true, index: true },
        /**
        * Foto del artículo
        */
        photo: { type: String, required: true },
        /**
        * Tags del anuncio
        */
        tags: [{ type: String, enum: ['work', 'lifestyle', 'motor', 'mobile'], index: true},]
    },
    {
        /**
        * Añade las propiedades de created y updated
        */
        timestamps: true,
    }    
);

/**
* Función estática para listar anuncios de la base de datos
* @param {String} name Para filtrado por nombre de anuncio
* @param {String} venta Para filtrado por anuncios de venta o compra
* @param {String} tag Para filtrado de anuncios con un tag específico
* @param {String} precio Para filtrado por precios
* @param {String} limit Para limitar el número de resultados a obtener
* @param {String} skip Para inidicar el número de resultados a saltar
* @param {String} fields Campos a obtener de la colección
* @param {String} sort Criterio de ordenación
* @param {function} callback Función a llamar al terminar la consulta
*
* Ejemplos de fields:
* http://localhost:3001/apiv1/anuncios?fields=name%20type%20price%20-_id
* http://localhost:3001/apiv1/anuncios?fields=name
* http://localhost:3001/apiv1/anuncios?fields=-_id
*/
ItemSchema.statics.list = function(name, venta, tag, precio, limit, skip, fields, sort, callback) {
    try {
        // Genero filtrado
        let filter = {}
        if (name) filter.name = { '$regex': `^${name}`, '$options': 'i' };
        if (venta) filter.type = venta==='true'?'sell':'buy';
        if (tag) filter.tags = tag.toLowerCase();
        if (precio) {
            let aux = precio.split('-');
            if (aux.length === 2) {
                if(aux[0]==='') {
                    filter.price = {'$lte': aux[1]};
                } else if(aux[1]==='') {
                    filter.price = {'$gte': aux[0]};
                } else {
                    filter.price = {'$gte': aux[0], '$lte': aux[1]};
                }
            }
        }
        // Realizo la query a Mongo
        let queryDB = Item.find(filter);
        queryDB.limit(limit);
        queryDB.skip(skip);
        queryDB.select(fields);
        // Permitir busquedas de mayor a menor
        if (sort) {       
            let aux = sort.split('-');
            if (aux.length === 2) {
                let sort = {};
                sort[aux[0]] = '-1';
                queryDB.sort(sort);
            } else {
                // Búsqueda de menor a mayor (por defecto)
                queryDB.sort(sort);
            }
        }
        queryDB.exec(callback);        
    } catch (error) {
        // Error no controlado
        log.fatal('Error ejecutando consulta.');
        log.fatal(error); 
        callback(error);
    }
}

/**
* Función estática para eliminar todos los anuncios
*/
ItemSchema.statics.deleteAll = async function() {
    try {
        await Item.deleteMany({});
    } catch (error) {
        // Error no controlado
        log.fatal('Error eliminando anuncios.');
        log.fatal(error);
    }
};

/**
* Función estática para insertar varios anuncios al mismo tiempo
*/
ItemSchema.statics.insertAll = async function(items) {
    try {
        await Item.insertMany(items);
    } catch (error) {
        // Error no controlado
        log.fatal('Error insertando anuncios.');
        log.fatal(error);
    }
};

/**
* Función estática para actualizar los datos de un anuncio
* @param {String} id ID que representa a un anuncio en MongoDB
* @param {Item} newItem Objeto con los datos a modificar
*/
ItemSchema.statics.updateItem = async function(id, newItem) {
    try {
        // Busco algún anuncio con ese id
        let item = await Item.findById(id);
        if (item) {
            // Si viene el parametro en el body lo sobreescribo
            item.name = newItem.name?newItem.name:item.name;
            item.price = newItem.price?newItem.price:item.price;
            item.type = newItem.type?newItem.type:item.type;
            item.photo = newItem.photo?newItem.photo:item.photo;
            item.tags = newItem.tags?newItem.tags:item.tags;
            item.description = newItem.description?newItem.description:item.description;
            // Salvo datos en mongo
            item = await item.save();
            return item;
        }
        return false;
    } catch (error) {
        // Error no controlado
        log.fatal('Error insertando anuncio.');
        log.fatal(error);
    }
};


/**
* Creo un indice compuesto por tipo de anuncio (buy/sell) + tags
*/
ItemSchema.index({ types: 1, tags: 1 });


const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;