const express = require("express");
const app = express();
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const router = require("./routes/router");
const PORT = process.env.PORT || 8080;
const { prods } = require("./classes/products");
const { messages } = require("./classes/messages");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.set("view engine", "ejs");

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

io.on("connection", async function (socket) {
  console.log("Un cliente se ha conectado");
  let products = await prods.getAll();
  socket.emit("product-load", { products });

  let chat = await messages.getAll();
  socket.emit("chat-load", { chat });

  socket.on("new-product", async (product) => {
    await prods.save(product);
    products = await prods.getAll();
    io.sockets.emit("product-load", { products });
  });

  socket.on("new-message", async (message) => {
    await messages.save(message);
    chat = await messages.getAll();
    io.sockets.emit("chat-load", { chat });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Listening on port number ${PORT}`);
});

httpServer.on("error", (error) => console.log(`Error on the server${error}`));