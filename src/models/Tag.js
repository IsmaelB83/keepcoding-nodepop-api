const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Tags que puede contener un anuncio
 */
const TagSchema = new Schema(
    {  
        /**
         * Nombre del tag
         */
        name: { type: String },
    },
    {
        /**
         * Añade las propiedades de created y updated
         */
        timestamps: true,
    }    
);

module.exports = mongoose.model('Tag', TagSchema);