const express = require("express");
const router = express.Router();
const Result = require("../helpers/result");
const facturaCliente = require("../models/facturaCliente");
const moment = require("moment");

router.get("/obtenerVentasEmpleado/:idEmpleado/:fechaParametro", (req, res) => {
  // 2020-08-03_2020-08-07
  let result = Result.createResult();
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
    })
    .catch((err) => {
      result.Error = err;
      result.Response = "Ocurrio un error";
      result.Success = false;
      res.send(result);
    });
});

module.exports = router;
