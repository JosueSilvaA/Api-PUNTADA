const mongoose = require('mongoose');
const Usuario = require('./usuario');

const bitacora = new mongoose.Schema({
    usuario:{
        type:mongoose.SchemaTypes.ObjectId,
        ref: 'usuario',
        required:true
    },
    entidadAlterada:{
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

module.exports = mongoose.model('bitacoras',bitacora);