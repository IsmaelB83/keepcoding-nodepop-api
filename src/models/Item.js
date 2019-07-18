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

module.exports = mongoose.model('Item', ItemSchema);