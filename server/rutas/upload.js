const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const Usuario = require('../modelos/model_usuario');
const Producto = require('../modelos/model_producto');

const app = express();

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  
  let tipo = req.params.tipo;
  let id = req.params.id; 
  
  if (!req.files) {
    return res.status(400).json({
      ok: false, 
      err: {message: 'No se ha seleccionado ningun archivo'}
    });
  }

  // VAlidar tipo

  let tiposValidos = ['productos', 'usuarios'];

  if (tiposValidos.indexOf(tipo) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: `Los tipos validas son: ${tiposValidos.join(', ')}`,
      },
    });
  }

  let archivo = req.files.archivo;
  let nombreSeparado = archivo.name.split('.');
  let extension = nombreSeparado[nombreSeparado.length -1];

  // Extensiones permitidas

  let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif']

  if (extensionesValidas.indexOf(extension) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: `Las extensiones validas son: ${extensionesValidas.join(', ')}`,
      },
      ext: extension,
    });
  }

  // Cambio de nombre al archivo

  let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

  archivo.mv(`uploads/${tipo}/${ nombreArchivo }`, (err) => { 
    if (err)
      return res.status(500).json({
        ok: false,
        err,
      });
    
    // Aqui imagen cargada
    if (tipo === 'usuarios'){
      imagenUsuario(id, res, nombreArchivo);
    }else {
      imagenProducto(id, res, nombreArchivo);
    }
    
  });
});

function imagenUsuario(id, res, nombreArchivo){
  Usuario.findById(id, (err, usuarioDB) => {
     
    if (err){
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB){
      borraArchivo(nombreArchivo, 'usuarios'); 
      return res.status(400).json({
        ok: false,
        message: 'Usuario no existe'
      });
    }

    borraArchivo(usuarioDB.img, 'usuarios') 
    
    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true, 
        usuarioGuardado,
        img: nombreArchivo,
      });
    });
  })
}

function imagenProducto(id, res, nombreArchivo) {
  
  Producto.findById(id, (err, productoDB) => {
     
    if (err){
      borraArchivo(nombreArchivo, 'productos'); // NOmbre de la carpeta
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB){
      borraArchivo(nombreArchivo, 'productos'); 
      return res.status(400).json({
        ok: false,
        message: 'Producto no existe'
      });
    }

    borraArchivo(productoDB.img, 'productos') 
    
    productoDB.img = nombreArchivo;

    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true, 
        productoGuardado,
        img: nombreArchivo,
      });
    });
  })
};

function borraArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)){
      fs.unlinkSync(pathImagen);
    }
}

module.exports = app; 
