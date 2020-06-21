//=======================
// Puerto
//=======================

process.env.PORT = process.env.PORT || 3000;

//=======================
// Entorno
//=======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================
// Fecha de expiracion Token
//=======================

process.env.CADUCACION_TOKEN = 60 * 60 * 24 * 30;

//=======================
// Seed autentificacion
//=======================

process.env.SEED = process.env.SEED || 'seed-desarrollo';

//=======================
// Conexion BD
//=======================

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {

    urlDB = process.env.MongoDB_URI
}

process.env.URLDB = urlDB;

//=======================
// Google client ID
//=======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '509853441996-ohk7aopiab1dd3dpjcl2embklt300t3u.apps.googleusercontent.com';