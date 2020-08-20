const express = require('express');
const router = express.Router();
const productoEscolar = require('../models/productoEscolar');
const Result = require('../helpers/result');
const mongoose = require('mongoose');
const AutenticationToken = require('../middlewares/autenticationJWT')
const cloudinary = require("../configs/Credenciales");
const fs = require("fs-extra");
const estructuraBitacora = require('../helpers/esquemaBitacora');
const decodeJWT = require('../configs/decodedJWT');
// registrar un producto escolares

router.post('/registroProducto',AutenticationToken,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    let nuevoProducto = new productoEscolar({
        nombre:req.body.nombre,
        marca:req.body.marca,
        color:req.body.color,
        proveedor:mongoose.Types.ObjectId(req.body.proveedor),
        precio:req.body.precio,
        tipoUtil:req.body.tipoUtil,
        descripcion:req.body.descripcion
    });
    nuevoProducto.save().then(response=>{
        result.Error = false
        result.Response = 'Producto Escolar registrado con exito'
        result.Items = response
        res.send(result)
        estructuraBitacora(
          token.id,
          response._id,
          'Se registro un producto escolar',
          'Gestion Productos Escolares',
          'PRODUCTOS ESCOLARES'
        )
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
});

// Obtener Producto Escolar

router.get('/obtenerProductosEscolares',AutenticationToken,function(req,res){
    let result = Result.createResult();
    productoEscolar.find({}).then(response=>{
        let productosActivos = [];
        for(let i = 0; i < response.length;i++){
            if(response[i].estado == true){
                 productosActivos.push(response[i]);
            }
        }
        result.Error = false
        result.Response = 'Todos los productos escolares'
        result.Items = productosActivos
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});

// Editar producto escolar

router.put('/:idProducto/editarProductoEscolar',AutenticationToken,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    productoEscolar.updateOne(
        {_id:req.params.idProducto},
        {
            nombre:req.body.nombre,
            marca:req.body.marca,
            color:req.body.color,
            precio:req.body.precio,
            tipoUtil:req.body.tipoUtil,
            descripcion:req.body.descripcion
        }
        ).then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se modifico la informacion del producto'
                res.send(result)
                estructuraBitacora(
                  token.id,
                  req.params.idProducto,
                  'Se edito un producto escolar',
                  'Gestion Productos Escolares',
                  'PRODUCTOS ESCOLARES'
                )
            } else if (response.nModified === 0 && response.n === 1) {
                result.Error = false
                result.Response = 'No se realizo ningun cambio'
                res.send(result)
            } else {
                result.Error = 'Id Invalido'
                result.Success = false
                res.send(result)
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            res.send(result)
        });
});

// Eliminar producto escolar

router.put('/:idProducto/eliminarProductoEscolar',AutenticationToken,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    productoEscolar.updateOne(
        {_id:req.params.idProducto},
        {
            estado:false
        }
        ).then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se elimino el producto con exito'
                res.send(result)
                estructuraBitacora(
                  token.id,
                  req.params.idProducto,
                  'Se elimino un producto escolar',
                  'Gestion Productos Escolares',
                  'PRODUCTOS ESCOLARES'
                )
            }else{
                result.Error = 'Id Invalido'
                result.Success = false
                res.send(result)
            }
        })
        .catch(err => {
            result.Error = err
            result.Response = 'Ocurrio un error'
            res.send(result)
        });
});

/* Cambiar imagen producto escolar */
router.post("/cambiarImagenEscolar/:idProducto",AutenticationToken,
  async (req, res) => {
    let token = decodeJWT(req.headers['access-token']);
    let file = req.file;
    let result = Result.createResult();
    let id_publica = req.params.idProducto;
    const borrarAnt = await cloudinary.uploader.destroy(
      "productos/escolares" + id_publica
    );

    if (borrarAnt.error === undefined) {
      const resultCloud = await cloudinary.uploader.upload(file.path, {
        public_id: id_publica,
        folder: "productos/escolares",
        user_filename: true,
      });
      fs.unlink(file.path);
      productoEscolar
        .updateOne(
          {
            _id: mongoose.Types.ObjectId(id_publica),
          },
          {
            imgProducto: resultCloud.secure_url,
          }
        )
        .then((response) => {
          if (response.nModified === 1 && response.n === 1) {
            result.Error = false;
            result.Response = "Se cambio la imagen del producto.";
            res.send(result);
            estructuraBitacora(
              token.id,
              req.params.idProducto,
              'Se modifico la imagen de un producto escolar',
              'Gestion Productos Escolares',
              'PRODUCTOS ESCOLARES'
            )
          } else if (response.nModified === 0 && response.n === 1) {
            result.Error = false;
            result.Response = "No se realizo ningun cambio";
            res.send(result);
          } else {
            result.Error = "Id Invalido";
            result.Success = false;
            res.send(result);
          }
        })
        .catch((err) => {
          result.Error = err;
          result.Response = "Ocurrio un error";
          res.send(result);
        });
    } else {
      result.Error = true;
      result.Response = "Ocurrio un error";
      res.send(result);
    }
  }
);

module.exports = router;