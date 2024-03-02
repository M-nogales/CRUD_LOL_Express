"use strict";
let express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  app = express();
//Parse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//configuración del env
require("dotenv").config();
let port = process.env.PORT || 4000;
// FILES STATIC
app.use(express.static(__dirname + "/public/"));
// VIEWS
app.set("view engine", "ejs"),
app.set("views", __dirname + "/views/");
// ROUTES
app.use("/", require("./router/champion"));
// conex MongoDB
/**Variables que tendremos siempre
 * lo correcto será declararlas EN VARIABLES DE ENTORNO
 * para que nadie vea directamente nuestras credenciales
 */
/**
 *! admin, pass
 *! IP 0.0.0.0/0
 */
//!cambiar
// metidos con .env
// const user = "admin";
// const password = "pass";
// const dbname = "Pokemon";
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.xwyuo0z.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`; // url de conexión
//useNewUrlParser: true, useUnifiedTopology: true
mongoose
  .connect(uri)
  .then(() => console.log("Base de datos conectada"))
  .catch((e) => console.log(e));

app
  .use((req, res) => {
    res.status(404).render("404.ejs", {
      titulo: "Error 404",
      descripcion: "Page Not Found",
    });
  })
  .listen(port);
console.log("Iniciando Express en el puerto http://localhost:3000/");
