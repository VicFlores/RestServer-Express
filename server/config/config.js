//=======================
// Puerto
//=======================

process.env.PORT = process.env.PORT || 3000;

//=======================
// Entorno
//=======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

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