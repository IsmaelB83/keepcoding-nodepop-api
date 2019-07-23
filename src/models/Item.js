const mongoose = require('mongoose');
const { Schema } = mongoose;

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
        tags: [{ type: String, enum: ['work', 'lifestyle', 'motor', 'mobile'], index: true},],
        /**
        * Anuncio activo si(true)/no(false)
        */
        active: { type: Boolean, required: true, default: true },
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
* @param {req.query} query Objecto req.query recibido desde la url
* @param {function} callback Función a llamar al terminar la consulta
*/
ItemSchema.statics.list = function(query, callback) {
    try {
        // Genero filtrado
        let filter = {}
        if (query.name) filter.name = { '$regex': `^${query.name}`, '$options': 'i' };
        if (query.venta) filter.type = query.venta==='true'?'sell':'buy';
        if (query.tag) filter.tags = query.tag.toLowerCase();
        if (query.precio) {
            let aux = query.precio.split('-');
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
        queryDB.limit(query.limit);
        queryDB.skip(query.skip);
        queryDB.select(query.fields);
        // Permitir busquedas de mayor a menor
        if (query.sort) {       
            let aux = query.sort.split('-');
            if (aux.length === 2) {
                let sort = {};
                sort[aux[0]] = '-1';
                queryDB.sort(sort);
            } else {
                // Búsqueda de menor a mayor (por defecto)
                queryDB.sort(query.sort);
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
* Función estática para insertar vairos anuncios al mismo tiempo
*/
ItemSchema.statics.insertAll = async function(items) {
    try {
        await Item.insertMany(items);
    } catch (error) {
        // Error no controlado
        log.fatal('Error insertando anuncios.');
        log.fatal(error);
        process.exit(1);
    }
};


/**
* Creo un indice compuesto por tipo de anuncio (buy/sell) + tags
*/
ItemSchema.index({ types: 1, tags: 1 });


const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;