const express = require("express");
const router = express.Router();
const Champion = require("../models/champion");

router.get("/create", (req, res) => {
  res.render("crear");
});
//find
router.get("/", async (req, res) => {
  //arrayChampionDB datos de mongodb y lo metemos al de la vista
  const arrayChampionDB = await Champion.find();
  console.log(arrayChampionDB);
  res.render("index", {
    arrayChampion: arrayChampionDB,
  });
});
//create "save"
router.post("/", async (req, res) => {
  const body = req.body; // gracias al bodyparser podremos
  // recuperar todo lo que viene del body
  console.log(body);
  try {
    const lastChampion = await Champion.findOne().sort({ id: -1 }).limit(1);
    let newId;
    if (lastChampion) {
      newId = lastChampion.id + 1;
    } else {
      newId = 1;
    }
    // Crea un nuevo campeón con el nuevo id y los datos del body
    const ChampionDB = new Champion({ ...body, id: newId });
    //creamos un nuevo campeón
    await ChampionDB.save(); //guardamos con save()
    res.redirect("/"); //volvemos al listado
  } catch (error) {
    console.log("error", error);
  }
});
// find one
router.get("/:id", async (req, res) => {
  // el valor id de la ruta
  const id = req.params.id; // en la platilla pokemon.ejs le pusimos
  // a este campo pokemon.id, por eso lo llamamos params.id
  try {
    const ChampionDB = await Champion.findOne({ _id: id }); //id_ porque así lo indica MONGO
    //mostrar por consola el doc que nos devuelve
    console.log(ChampionDB);
    res.json({
      champion: ChampionDB,
      error: false,
    });
  } catch (error) {
    //Si el id indicado no se encuentra
    console.log("Se ha producido un error", error);
    res.render("detalle", {
      //Mostraremos el error en la vista
      error: true,
      mensaje: "Champion not found!",
    });
  }
});
// delete one
router.delete('/:id', async (req,res) =>{
  const id = req.params.id;
  console.log('_id desde backend',id);
  try {
    // en la doc de mongoose encontramos esta func para eliminar
    const ChampionDB = await Champion.findByIdAndDelete({ _id:id});
    console.log(ChampionDB);
    //res.redirect('/pokemon) daría un error
    if (!ChampionDB) {
  res.json({
    estado:false,
    mensaje: 'No se puede eliminar el Producto.'
  })      
    } else {
      res.json({
        estado:true,
        mensaje: 'Campeón eliminado'
      })
    }
  } catch (error) {
    console.log(error);
  }
} )
// update
router.put('/:id',async (req,res)=>{
  const id = req.params.id;
  const body = req.body;
  console.log(id);
  console.log('body',body);
  try {
    const ChampionDB = await Champion.findByIdAndUpdate(
      id, body , { useFindAndModify:false}
    )
    console.log(ChampionDB);
    res.json({
      estado:true,
      mensaje:'Champion editado'
    })
  } catch (error) {
    console.log(error);
    res.json({
      estado: false,
      mensaje: 'Problema al editar el Champion'
    })
  }
})
module.exports = router;
