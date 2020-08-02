const mongoose = require('mongoose');

const facturaProveedor = new mongoose.Schema({
    proveedor:{
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
        type:Number,
        required:true,
        trim:true
    },
    isv:{
        type:Number,
        required:true,
        trim:true
    },
    total:{
        type:Number,
        required:true,
        trim:true
    },
    estado:{
        type:String,
        trim:true,
        required:true
    }
});


module.exports = mongoose.model('facturasProveedores',facturaProveedor);