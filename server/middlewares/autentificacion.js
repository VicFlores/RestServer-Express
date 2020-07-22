const jwt = require('jsonwebtoken');

//====================
// Verificar Token
//====================

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    messge: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario

        next()
    });
}

//====================
// Verificar AdminRole
//====================

let verificarAdmin = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador'
            }
        });
    }
};

//====================
// Verificar Token Imagen
//====================

let verificarTokeImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    messge: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario

        next()
    });
}
module.exports = {
    verificarToken,
    verificarAdmin,
    verificarTokeImg
}