const express = require("express");
const router = express.Router();
const Result = require("../helpers/result");
const facturaCliente = require("../models/facturaCliente");
const moment = require("moment");
const AutenticationToken = require('../middlewares/autenticationJWT')
const estructuraBitacora = require('../helpers/esquemaBitacora');
const decodeJWT = require('../configs/decodedJWT');
const { sendAdminNotification } = require("../helpers/SendPushNotification");


router.get("/obtenerVentasEmpleado/:idEmpleado/:fechaParametro",AutenticationToken, (req, res) => {
  // 2020-08-03_2020-08-07
  let result = Result.createResult();
  let token = decodeJWT(req.headers['access-token']);
  facturaCliente
    .find(
      { nombreEmpleado: req.params.idEmpleado },
      {
        nombreCliente: true,
        fechaFactura: true,
        nombreEmpleado: true,
        subTotal: true,
        isv: true,
        total: true,
        rtn: true,
      }
    )
    .then((response) => {
      if (req.params.fechaParametro !== 'null') {
        const tempArrayDate = req.params.fechaParametro.split("_");
        response.forEach((element) => {
          if (element.fechaFactura) {
            let dateFinal = moment(element.fechaFactura).isSameOrBefore(tempArrayDate[1]);
            let dateInitial = moment(element.fechaFactura).isSameOrAfter(tempArrayDate[0]);
            if (dateFinal && dateInitial) {
              result.Items.push(element);
            }
          }
        });
      } else {
          result.Items = response;
      }
      result.Error = false;
      result.Response = "Ventas realizadas por el empleado.";
      res.send(result);
      estructuraBitacora(
        token.id,
        response._id,
        'Se realizo un reporte de ventas por empleado',
        'Gestion de Reportes',
        'REPORTES DE VENTAS POR EMPLEADO'
      )
      sendAdminNotification(
        "La Puntada",
        `El usuario ${req.decoded.user} generó un reporte de ventas del empleado ${response[0].nombreEmpleado}.`
      );
    })
    .catch((err) => {
      result.Error = err;
      result.Response = "Ocurrio un error";
      result.Success = false;
      res.send(result);
    });
});


// producto mas vendido

router.get('/productoMasVendido',AutenticationToken,function(req,res){
  let result = Result.createResult();
  const listaProductos = [];
  let token = decodeJWT(req.headers['access-token']);
  facturaCliente.find({},{productos:true})
  .then(response=>{
    const productosFacturaArray = response;
    const productosUnicos = [];
    productosFacturaArray.forEach((factura)=>{
      factura.productos.forEach(producto=>{
        listaProductos.push(producto)
      })
    })
    
    productosUnicos.push(listaProductos[0]);
    
    listaProductos.forEach((producto) =>{
      let link = false;
      productosUnicos.forEach((pro,index)=>{
        if(producto.producto === pro.producto){
          link = true;
          productosUnicos[index].cantidad += producto.cantidad;
        }
      })
      if(link ===  false){
        productosUnicos.push(producto)
      }
    })

    var ProductosOrdenados = productosUnicos.sort(function(a, b){  
      if (a.cantidad > b.cantidad) {
      return -1;
      }
    });
    result.Error = false;
    result.Response = "Producto mas vendido";
    result.Items = ProductosOrdenados;
    res.send(result);
    estructuraBitacora(
      token.id,
      ProductosOrdenados[0].producto,
      'Se realizo un reporte de productos mas vendidos',
      'Gestion de Reportes',
      'REPORTES DE PRODUCTO MAS VENDIDO'
    )
    sendAdminNotification(
      "La Puntada",
      `El usuario ${req.decoded.user} generó un nuevo reporte de productos más vendidos.`
    );
  })
  .catch(err=>{
    result.Error = err;
    result.Response = "Ocurrio un error";
    result.Success = false;
    res.send(result);
  });
})
module.exports = router;
