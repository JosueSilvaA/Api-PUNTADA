const mongoose = require('mongoose');

const bitacora = new mongoose.Schema({
    usuario:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    accion:{
        type:String,
        required:true
    },
    creada:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('bitacora',bitacora);