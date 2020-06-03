require('./config/config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Get; obtener un registro

app.get('/usuario', (req, res) => {
    res.json('get usuario')
});

// Post: crear nuevo registro

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {

        res.status(400).json({

            ok: false,
            mensaje: 'El nombre es obligtorio'
        })
    } else {

        res.json({

            persona: body
        });
    }


});

// Put: Actualizar un registro

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;

    res.json({

        id
    })
});

// Delete

app.delete('/usuario', (req, res) => {
    res.json('delete usuario')
})

app.listen(process.env.PORT, () => {

    console.log('Escuchando el puerto:', 3000);
})