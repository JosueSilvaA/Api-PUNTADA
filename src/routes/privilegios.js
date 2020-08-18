const express = require('express');
const router = express.Router();
const privilegio = require('../models/privilegio');
const Result = require('../helpers/result');
const rol = require('../models/rol');
const autenticar = require('../middlewares/autenticationJWT')
const decodeJWT = require('../configs/decodedJWT')




// Registrar un privilegio

router.post('/registroPrivilegio',function(req,res){
    let nuevoPrivilegio = new privilegio({
        nombre:req.body.nombre,
        descripcion:req.body.descripcion
    });

    let result = Result.createResult();
    nuevoPrivilegio.save()
    .then(response=>{
        result.Error = false
        result.Response = 'Privilegio registrado con exito'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});

// Obtener los privilegios

router.get('/obtenerPrivilegios',function(req,res){
    let result = Result.createResult();
    privilegio.find({},{nombre:true,descripcion:true}).then(response=>{
        result.Error = false
        result.Response = 'Todos los privilegios'
        result.Items = response
        res.send(result)
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
});


// Privilegios que no están en un rol.

router.post('/obtenerPrivilegiosNotInRol',function(req,res){
    let result = Result.createResult();

    rol.findOne({'nombre': req.body.rol}, {nombre:true, privilegios: true}).then(response => {
        privilegio.find({_id: {$nin: response.privilegios}}, {nombre:true, descripcion: true}).then(response=>{
            result.Error = false
            result.Response = 'Privilegios faltantes en el rol'
            result.Items = response
            res.send(result)
        })
    }).catch(err=>{
        result.Error = err
        result.Response = 'Ocurrio un error'
        result.Success = false
        res.send(result)
    });
   
});

router.get('/privilegiosUsuario', autenticar, (req, res) => {
    let result = Result.createResult();

    const decodedToken = decodeJWT(req.headers["access-token"]);
    let privilegios;
    if (decodedToken.rol === "5f0ccc649f8a780c206d9d9e") {
      privilegios = {
        users: true,
        editProduct: true,
        deleteProduc: true,
        newProduct: true,
        mainReport: true,
        MainInventory: true,
        catalogo: true,
        clientInvoice: true,
        providerInvoice: true,
        roles: true,
        manageRole: true,
        invoiceList: true,
        mainInvoice: true,
        employeeSalesReport: true,
        VentasDiarias: true,
        bitacora: true,
        providers: true,
        mostSelledProducts: true,
      };
    } else if (decodedToken.rol === "5f0cd30b40fbd42fb0278891") {
        privilegios = {
          users: false,
          editProduct: true,
          deleteProduc: false,
          newProduct: true,
          mainReport: false,
          MainInventory: true,
          catalogo: true,
          clientInvoice: true,
          providerInvoice: true,
          roles: false,
          manageRole: false,
          invoiceList: true,
          mainInvoice: true,
          employeeSalesReport: false,
          VentasDiarias: true,
          bitacora: false,
          providers: true,
          mostSelledProducts: true,
        };
    }
    result.Error = false;
    result.Response = "Privilegios del usuario.";
    result.Items = privilegios;
    res.send(result);
})

module.exports = router;