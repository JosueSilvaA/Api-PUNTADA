const mongoose = require('mongoose');

const rol = new mongoose.Schema({
    nombre:{
        type:String,
        trim:true
    },
    privilegios:{
        type:Array,
        default:[]
    }
});

module.exports = mongoose.model('roles',rol);