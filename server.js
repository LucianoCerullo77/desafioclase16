const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fs = require('fs')
const {optionSQLite} = require('./options/sqliteDB')
const {optionsMDB} = require('./options/mariaDB')
const Productos = require('./productos.js')
const Mensajes = require('./mensajes.js')

app.use(express.static('public'));

const productos = new Productos(optionsMDB, 'productos')
const mensajes = new Mensajes(optionSQLite, 'mensajes')

let productosDB = []
let mensajesDB = []

io.on('connection', function(socket){
    console.log('User connected')
    socket.emit('productos', productosDB)
    socket.on('newProduct', function(data){
        productosDB.push(data)
        productos.push(data)
        io.sockets.emit('productos', productosDB)
    })
    socket.emit('mensajes', mensajesDB)
    socket.on('newMensaje', function(data){
        mensajesDB.push(data)
        mensajes.insertMessage(data)
        io.sockets.emit('mensajes', mensajesDB)
    })

})

server.listen(8080,()=> {
    console.log('Server running on port 8080') 
})