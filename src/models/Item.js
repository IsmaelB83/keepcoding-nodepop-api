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
        name: { type: String },
        /**
         * Precio del artículo
         */
        price: { type: Number },
        /**
         * Tipo de anuncio: compra o venta
         */
        type: { type: String },
        /**
         * Foto del artículo
         */
        photo: { type: String },
        /**
         * Tags del anuncio
         */
        tags: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
        /**
         * Anuncio activo si(true)/no(false)
         */
        active: { type: Boolean },
    },
    {
        /**
         * Añade las propiedades de created y updated
         */
        timestamps: true,
    }    
);

module.exports = mongoose.model('Item', ItemSchema);