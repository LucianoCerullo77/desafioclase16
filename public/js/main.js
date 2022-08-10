let socket = io.connect()

socket.on('productos', function(data){
    renderProductos(data)
})

function renderProductos(data){
    let html = data.map(function(product){
        return(`<tr>
                    <td class="fw-normal mb-1">${product.title}</td>
                    <td class="fw-normal mb-1">${product.price}</td>
                    <td><img src=${product.foto_url} style="width: 50px; height: 50px"></td>
                </tr>`)
    }).join('')
    document.getElementById('table_products').innerHTML=html

}

function addProduct(){
    let product = {
        title: document.getElementById('title').value, 
        price: document.getElementById('price').value,
        foto_url: document.getElementById('foto_url').value
    }
    socket.emit('newProduct', product)
    document.getElementById('title').value = ''
    document.getElementById('price').value = ''
    document.getElementById('foto_url').value = ''
    document.getElementById('title').focus()
    return false;
}

socket.on('mensajes', function(data){
    renderMensajes(data)
})

function renderMensajes(data){
    let html = data.map(function(mensaje, index){
        return(`<span style="color: #346beb; font-weight: bold;">${mensaje.autor}</span> 
        <span style="color: #a36f0f;">${mensaje.fecha}</span>
        :<span style="color: #0d912c; font-style: italic;">${mensaje.mensaje}</span> <br>`)
    }).join('')
    document.getElementById('mensajes').innerHTML=html

}


function addMensaje(){
    let currentdate = new Date(); 
    let mensaje = {
        autor: document.getElementById('email').value, 
        fecha: "["+currentdate.getDate()+"/"+currentdate.getMonth()+"/"+currentdate.getFullYear()+" "+currentdate.getHours()+":"+currentdate.getMinutes()+":"+currentdate.getSeconds()+"]",
        mensaje: document.getElementById('mensaje').value
    }
    socket.emit('newMensaje', mensaje);
    document.getElementById('mensaje').mensaje = ' '
    document.getElementById('mensaje').focus()
    return false;
}
