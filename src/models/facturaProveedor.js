const mongoose = require('mongoose');

const facturaProveedor = new mongoose.Schema({
    nombreProveedor:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    fechaFactura:{
        type:Date,
        required:true,
    },
    creada:{ 
        type: Date,
        default: Date.now
    },
    productos:{
        type:mongoose.SchemaTypes.Array,
        required:true
    },
    subTotal:{
        type:mongoose.SchemaTypes.Decimal128,
        required:true,
        trim:true
    },
    isv:{
        type:mongoose.SchemaTypes.Decimal128,
        required:true,
        trim:true
    },
    total:{
        type:mongoose.SchemaTypes.Decimal128,
        required:true,
        trim:true
    },
    estado:{
        type:String,
        trim:true,
        required:true
    }
});


module.exports = mongoose.model('facturaProveedor',facturaProveedor);