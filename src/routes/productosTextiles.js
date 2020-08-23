const express = require('express');
const router = express.Router();
const productoTextil = require('../models/productoTextil');
const Result = require('../helpers/result');
const mongoose = require('mongoose');
const AutenticationToken = require('../middlewares/autenticationJWT')
const cloudinary = require("../configs/Credenciales");
const fs = require("fs-extra");
const estructuraBitacora = require('../helpers/esquemaBitacora');
const decodeJWT = require('../configs/decodedJWT');
const AutenticacionLv1 = require("../middlewares/autenticacionLvl1");
const AutenticacionLv2 = require("../middlewares/autenticacionLvl2");
const AutenticacionLv3 = require("../middlewares/autenticacionLvl3");
const { sendAdminNotification } = require('../helpers/SendPushNotification');


// registrar un producto textil

router.post('/registroProducto',AutenticacionLv2 ,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    let nuevoProducto = new productoTextil({
        nombre:req.body.nombre,
        color:req.body.color,
        rbaColor:req.body.rbaColor,
        proveedor:mongoose.Types.ObjectId(req.body.proveedor),
        precio:req.body.precio,
        descripcion:req.body.descripcion,
        tipoTextil:req.body.tipoTextil
    });
    nuevoProducto.save().then(response=>{
        result.Error = false
        result.Response = 'Producto Textil registrado con exito'
        result.Items = response
        res.send(result)
        estructuraBitacora(
            token.id,
            response._id,
            'Se registro un producto textil',
            'Gestion Productos Textiles',
            'PRODUCTOS TEXTILES'
          )
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    })
});

// obtener todos los productos textiles

router.get('/obtenerProductosTextiles',AutenticationToken,function(req,res){
    let result = Result.createResult();
    productoTextil.find({}).then(response=>{
        let productosActivos = [];
        for(let i = 0; i < response.length;i++){
            if(response[i].estado == true){
                 productosActivos.push(response[i]);
            }
        }
        result.Error = false
        result.Response = 'Todos los productos textiles'
        result.Items = productosActivos
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});

// Editar producto textil

router.put('/:idProducto/editarProductoTextil',AutenticacionLv1,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    productoTextil.updateOne(
        {_id:req.params.idProducto},
        {
            nombre:req.body.nombre,
            color:req.body.color,
            precio:req.body.precio,
            tipoTextil:req.body.tipoTextil,
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
                    'Se edito un producto textil',
                    'Gestion Productos Textiles',
                    'PRODUCTOS TEXTILES'
                  )
                sendAdminNotification(
                  "La Puntada",
                  `El usuario ${req.decoded.user} editó el producto textil ${req.params.idProducto}.`
                );
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

router.put('/:idProducto/editarImagen',AutenticacionLv2,function(req,res){
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
                estructuraBitacora(
                  req.decoded.id,
                  req.params.idProducto,
                  "Se edito la imagen de un producto textil",
                  "Gestion Productos Textiles",
                  "PRODUCTOS TEXTILES"
                );
                sendAdminNotification(
                  "La Puntada",
                  `El usuario ${req.decoded.user}  cambió la imagen del producto ${req.params.idProducto}.`
                );
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


// Eliminar producto textil

router.put('/:idProducto/eliminarProductoTextil',AutenticacionLv1 ,function(req,res){
    let result = Result.createResult();
    let token = decodeJWT(req.headers['access-token']);
    productoTextil.updateOne(
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
                    'Se elimino un producto textil',
                    'Gestion Productos Textiles',
                    'PRODUCTOS TEXTILES'
                  )
                  sendAdminNotification('La Puntada', `El usuario ${req.decoded.user} eliminó el producto textil ${req.params.idProducto}`)
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

/* Cambiar imagen producto textil */
router.post("/cambiarImagenTextil/:idProducto", AutenticacionLv2,
  async (req, res) => {
    let token = decodeJWT(req.headers['access-token']);
    let file = req.file;
    let result = Result.createResult();
    let id_publica = req.params.idProducto;
    const borrarAnt = await cloudinary.uploader.destroy(
      "productos/textiles" + id_publica
    );

    if (borrarAnt.error === undefined) {
      const resultCloud = await cloudinary.uploader.upload(file.path, {
        public_id: id_publica,
        folder: "productos/textiles",
        user_filename: true,
      });
      fs.unlink(file.path);
      productoTextil
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
                'Se modifico la imagen de un producto textil',
                'Gestion Productos Textiles',
                'PRODUCTOS TEXTILES'
              )
                  sendAdminNotification(
                    "La Puntada",
                    `El usuario ${req.decoded.user} cambió la imagen del producto textil ${req.params.idProducto}`
                  );
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