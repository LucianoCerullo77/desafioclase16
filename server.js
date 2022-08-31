const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {optionSQLite} = require('./options/sqliteDB')
const {optionsMDB} = require('./options/mariaDB')
const Productos = require('./productos.js')
const Mensajes = require('./mensajes.js')

app.use(express.static('public'));

const productos = new Productos(optionsMDB, 'productos')
const mensajes = new Mensajes(optionSQLite, 'mensajes')

let productosDB = []
let mensajesDB = []


io.on("connection", function (socket) {
    console.log("User connected");
    socket.emit("productos", productosDB);
    socket.on("newProduct", function (data) {
      productosDB.push(data);
      productos.insertaRegistros(data);
      io.sockets.emit("productos", productosDB);
    });  
    socket.on("table", function (data) {
      productos.crearTabla();
      productos
        .getAll()
        .then((productos) => {
          productosDB = productos;
          io.sockets.emit("productos", productosDB);
        })
        .catch((err) => {
          console.log(err);
        });
    }),


    // socket.emit('mensajes', mensajesDB)
    socket.on('newMensaje', async function(data){
        mensajesDB.push(data)
        mensajes.insertMessage(data)
        io.sockets.emit('mensajes', mensajesDB)
    })

})

server.listen(8080,()=> {
    console.log('Server running on port 8080') 
})

io.on('connection', (socket) => {
    socket.on('nuevoUsuario', async () => {

        const arrMsg = await mensajes.getAll();
        io.sockets.emit('mensaje', arrMsg);

        const arr = await productos.getAll();
        const listaProductos = arr;

        io.sockets.emit('listaProductos', listaProductos);
    })

    socket.on('nuevoProducto', async (data) => {

        const id = await productos.save(data);
        const arr = await productos.getAll();
        
        const listaProductos = arr;
        io.sockets.emit('listaProductos', listaProductos);
    })

    socket.on('nuevoMensaje', async (data) => {
        
        await mensajes.save(data);
        const arrMsgNuevo = await mensajes.getContent();
        
        io.sockets.emit('mensaje', arrMsgNuevo);
    });
})