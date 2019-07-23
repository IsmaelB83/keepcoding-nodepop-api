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
 * @param {String} callback Función a llamar al terminar la consulta
 */
ItemSchema.statics.list = function(filter, limit, skip, fields, sort, callback) {
    // Realizo la query a Mongo
    let query = Item.find(filter);
    query.limit(limit);
    query.skip(skip);
    query.select(fields);
    query.sort(sort);
    query.exec(callback);
}

/**
 * Creo un indice compuesto por tipo de anuncio (buy/sell) + tags
 */
ItemSchema.index({ types: 1, tags: 1 });


const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;