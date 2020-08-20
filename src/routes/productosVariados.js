const express = require('express');
const router = express.Router();
const productoVariado = require('../models/productoVariado');
const Result = require('../helpers/result');
const mongoose = require('mongoose');
const AutenticationToken = require('../middlewares/autenticationJWT')
const cloudinary = require("../configs/Credenciales");
const fs = require("fs-extra");
const estructuraBitacora = require('../helpers/esquemaBitacora');
const decodeJWT = require('../configs/decodedJWT');
// registrar un producto variado

router.post('/registroProducto',AutenticationToken,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    let nuevoProducto = new productoVariado({
        nombre:req.body.nombre,
        proveedor:mongoose.Types.ObjectId(req.body.proveedor),
        precio:req.body.precio,
        tipoVariado:req.body.tipoVariado,
        descripcion:req.body.descripcion
    });
    nuevoProducto.save().then(response=>{
        result.Error = false
        result.Response = 'Producto Variado registrado con exito'
        result.Items = response
        res.send(result)
        estructuraBitacora(
            token.id,
            response._id,
            'Se registro un producto variado',
            'Gestion Productos Variados',
            'PRODUCTOS VARIADOS'
          )
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
});

// Obtener productos variados

router.get('/obtenerProductosVariados',AutenticationToken,function(req,res){
    let result = Result.createResult();
    productoVariado.find({}).then(response=>{
        let productosActivos = [];
        for(let i = 0; i < response.length;i++){
            if(response[i].estado == true){
                 productosActivos.push(response[i]);
            }
        }
        result.Error = false
        result.Response = 'Todos los productos variados'
        result.Items = productosActivos
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});

// Editar producto variados

router.put('/:idProducto/editarProductoVariado',AutenticationToken,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    productoVariado.updateOne(
        {_id:req.params.idProducto},
        {
            nombre:req.body.nombre,
            precio:req.body.precio,
            tipoVariado:req.body.tipoVariado,
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
                    'Se edito un producto variado',
                    'Gestion Productos Variados',
                    'PRODUCTOS VARIADOS'
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

// Editar Imagen del producto

router.put('/:idProducto/editarImagen',AutenticationToken,function(req,res){
    let result = Result.createResult();
    productoVariado.updateOne(
        {_id:req.params.idProducto},
        {
            imgProducto:req.body.imgProducto
        }
        ).then(response => {
            if (response.nModified === 1 && response.n === 1) {
                result.Error = false
                result.Response = 'Se modifico la imagen del producto'
                res.send(result)
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


// Eliminar producto variado

router.put('/:idProducto/eliminarProductoVariado',AutenticationToken,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    productoVariado.updateOne(
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
                    'Se elimino un producto variado',
                    'Gestion Productos Variados',
                    'PRODUCTOS VARIADOS'
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

/* Cambiar imagen producto variado */
router.post("/cambiarImagenVariado/:idProducto", AutenticationToken,
  async (req, res) => {
    let token = decodeJWT(req.headers['access-token']);
    let file = req.file;
    let result = Result.createResult();
    let id_publica = req.params.idProducto;
    const borrarAnt = await cloudinary.uploader.destroy(
      "productos/variados" + id_publica
    );

    if (borrarAnt.error === undefined) {
      const resultCloud = await cloudinary.uploader.upload(file.path, {
        public_id: id_publica,
        folder: "productos/variados",
        user_filename: true,
      });
      fs.unlink(file.path);
      productoVariado
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
                'Se modifico la imagen de un producto variado',
                'Gestion Productos Variados',
                'PRODUCTOS VARIADOS'
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