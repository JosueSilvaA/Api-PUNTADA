const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwtKey = require('./configs/jwtKey')
var database = require('./connection/connection');
database();
/* Import Rutas */
const usuariosRouter = require('./routes/usuarios');


//express
const app = express()

//cors
app.use(cors())

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

app.use('/api/usuario', cors(), usuariosRouter);

//Cacth error on routes
app.use((req, res, next) => {
    console.log('Ruta desconocida')
    res.send('Undefined route')
})

//Start server
app.listen(app.get('port'), ()=> {
    console.log('Server on port: ', app.get('port'))
})