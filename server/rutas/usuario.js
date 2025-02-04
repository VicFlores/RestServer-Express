const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../modelos/model_usuario');
const { verificarToken, verificarAdmin } = require('../middlewares/autentificacion')
const app = express();


// Get; obtener un registro

app.get('/usuario', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({

                    ok: true,
                    usuarios,
                    cantidad: conteo
                });
            });

        });
});

// Post: crear nuevo registro

app.post('/usuario', [verificarToken, verificarAdmin], (req, res) => {

    let body = req.body;
    let usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {

            return res.status(400).json({

                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({

            ok: true,
            usuario: usuarioDB
        });
    });

});

// Put: Actualizar un registro

app.put('/usuario/:id', [verificarToken, verificarAdmin], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado  ']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({

            ok: true,
            usuario: usuarioDB
        });
    })

});

// Delete

app.delete('/usuario/:id', [verificarToken, verificarAdmin], (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {

            return res.status(400).json({

                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {

            return res.status(400).json({

                ok: false,
                err: {

                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({

            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;