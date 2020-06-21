require('./config/config');

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// habilitar carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));

// Configuracion global de rutas
app.use(require('./rutas/index'));


mongoose.connect(process.env.URLDB, {

    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {

    if (err) throw err;

    console.log('Conectado a MongoDB');
});

app.listen(process.env.PORT, () => {

    console.log('Escuchando el puerto:', 3000);
})