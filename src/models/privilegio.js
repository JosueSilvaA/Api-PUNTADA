const mongoose = require('mongoose');

const privilegio = new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        unique:true
    },
    descripcion:{
        type:String,
        required:true,
        unique:true
    },
    creada: { 
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('privilegios',privilegio);