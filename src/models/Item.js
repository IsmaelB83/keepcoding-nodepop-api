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
        name: { type: String, required: true },
        /**
         * Precio del artículo
         */
        price: { type: Number, required: true },
        /**
         * Tipo de anuncio: compra o venta
         */
        type: { type: String, enum: ['buy', 'sell'], required: true },
        /**
         * Foto del artículo
         */
        photo: { type: String, required: true },
        /**
         * Tags del anuncio
         */
        tags: [{ type: String, enum: ['work', 'lifestyle', 'motor', 'mobile']}],
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
 * @param {String} query Query a realizar a mongo sobre la colección Item
 * @param {String} callback Función a llamar al terminar la consulta
 */
ItemSchema.statics.list = function(query, callback) {
    // Monto la query, según sean los parametros pasados por el usuario en la query
    let filter = {}
    if (query.name) filter.name = query.name;
    if (query.type) filter.type = query.type;
    let limit = query.limit || null;
    let skip = query.skip || null;
    let fields = query.fields || null;
    let sort = query.sort || null;
    // Realizo la query a Mongo
    let query = Item.find(filter);
    query.limit(limit);
    query.skip(skip);
    query.select(fields);
    query.sort(sort);
    query.exec(callback);
}

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;