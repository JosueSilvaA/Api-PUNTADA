const mongoose = require('mongoose');

const rol = new mongoose.Schema({
    nombre:{
        type:String,
        trim:true,
        unique:true
    },
    descripcion:{
        type:String,
        required:true,
        unique:true
    },
    privilegios:[{type: mongoose.Schema.Types.ObjectId, ref: 'privilegios'}]
});

module.exports = mongoose.model('roles',rol);