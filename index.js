const express = require('express');
require('dotenv').config();//para variables de entorno
const cors = require('cors');
const { dbConnection  } = require('./database/config');
// console.log(process.env); //ver los proceso

//Base de datos
dbConnection();


//crear el servidor de express
const app = express();

//cors
app.use(cors());

//Directorio publico
app.use(express.static('./public'));

//Lectura y parseo del body
app.use(express.json());

//Rutas
//middleware para autenticacion
app.use('/api/auth', require('./routes/auth'));

//middleware para eventos
app.use('/api/events', require('./routes/events'));

app.get('*',(req, res) =>{
    res.sendFile(__dirname+'/public/index.html');
});

//escuchar peticiones
app.listen(process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});