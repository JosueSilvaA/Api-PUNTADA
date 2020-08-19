const mongoose = require('mongoose');

const bitacora = new mongoose.Schema({
    usuario:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    actividad:{
        type:String,
        required:true
    },
    finalidad:{
        type:String,
        required:true
    },
    categoria:{
        type:String,
        required:true
    },
    creada:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('bitacora',bitacora);