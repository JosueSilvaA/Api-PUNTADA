const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

/* Import Rutas */



//express
const app = express()

//cors
app.use(cors())

//Server port
app.set('port', process.env.PORT || 3000)



//Middlewares
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


/* Routes */
//Initial route
app.get('/', (req, res) =>{
    res.send('Server Api-LaPuntada')
})


//Cacth error on routes
app.use((req, res, next) => {
    console.log('Ruta desconocida')
    res.send('Undefined route')
})

//Start server
app.listen(app.get('port'), ()=> {
    console.log('Server on port: ', app.get('port'))
})