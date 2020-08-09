const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwtKey = require('./configs/jwtKey')
var database = require('./connection/connection');
database();
/* Import Rutas */
const usuariosRouter = require('./routes/usuarios');
const rolesRouter = require('./routes/roles');
const privilegiosRouter = require('./routes/privilegios');
const proveedorRouter = require('./routes/proveedores');
const productoEscolarRouter = require('./routes/productosEscolares');
const productoTextilRouter = require('./routes/productosTextiles');
const productoVariadoRouter = require('./routes/productosVariados');
const productoGeneral = require('./routes/productosGeneral')
const facturaClienteRouter = require('./routes/facturasClientes');
const facturaProveedorRouter = require('./routes/facturasProveedores');
const reporteVentas = require('./routes/reportesVentas');
//express
const app = express()

//cors
app.use(cors());

//Server port
app.set('port', process.env.PORT || 3000)
app.set('key', jwtKey.key)
app.get('key')



//Middlewares
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


/* Routes */
//Initial route
app.get('/', (req, res) =>{
    res.send('Server Api-LaPuntada')
})

app.use('/api/usuario',usuariosRouter);
app.use('/api/rol',rolesRouter);
app.use('/api/privilegio',privilegiosRouter);
app.use('/api/proveedor',proveedorRouter);
app.use('/api/productoEscolar',productoEscolarRouter);
app.use('/api/productoTextil',productoTextilRouter);
app.use('/api/productoVariado',productoVariadoRouter);
app.use('/api/productoGeneral',productoGeneral);
app.use('/api/facturaCliente',facturaClienteRouter);
app.use('/api/facturaProveedor/',facturaProveedorRouter);
app.use('/api/reporteVentas', reporteVentas);
//Cacth error on routes
app.use((req, res, next) => {
    console.log('Ruta desconocida')
    res.send('Undefined route')
})

//Start server
app.listen(app.get('port'), ()=> {
    console.log('Server on port: ', app.get('port'))
})