
/**
 * @file Este archivo almacena todas las rutas que comprenden el servidor y las respuestas a las peticiones que llegan a las mismas.
 */
'use strict'

//Cargamos express
var express = require('express');
//cargamos el router
var api = express.Router();

/**
 * @event Respuesta POST para devolver los usuarios que se encuentren
 * en la party
 *
 */
api
    .get( '/', function( req, res ) {
        res.sendFile( path.join( __dirname, 'client', 'index.html' ));
    });

module.exports = api;