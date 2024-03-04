const express = require("express");
const router = express.Router();
const Champion = require("../models/champion");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

// create (save)
router.post("/", (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../public/imgs");
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    console.log(fields);
    if (err) {
      console.error("Error al parsear el formulario", err);
      return res.status(500).send("Error al procesar el formulario");
    }

    if (!files.image || !files.image.length) {
      console.error("No se subió ningún archivo de imagen");
      return res.status(400).send("No se subió ningún archivo de imagen");
    }

    //? por alguna razón fields vuelve como array y lo tengo que pasar a string,
    //? quizá cosa del formidable
    //  console.log("-----------------------");
    //  console.log(files.image[0]);
    //  console.log("-----------------------");

    const imageFile = files.image[0];
    // fecha y hora actuales para usarlas como nombre de archivo
    const currentDate = new Date();
    const formattedDate = currentDate
      .toISOString()
      .replace(/:/g, "-")
      .replace("T", "_")
      .replace(/\..+/, "");
    const newFileName = `${formattedDate}.${imageFile.originalFilename
      .split(".")
      .pop()}`;
    // Define la ruta de destino para el archivo
    const destinationPath = path.join(form.uploadDir, newFileName);

    // Mueve el archivo a la carpeta
    fs.rename(imageFile.filepath, destinationPath, async (err) => {
      if (err) {
        console.error("Error al mover el archivo", err);
        return res.status(500).send("Error al procesar el archivo");
      }

      const lastChampion = await Champion.findOne().sort({ id: -1 }).limit(1);
      let newId;
      if (lastChampion) {
        newId = lastChampion.id + 1;
      } else {
        newId = 1;
      }

      const championData = {
        id: newId,
        name: fields.name[0],
        abilities: {
          Q: fields["abilities.Q"][0],
          W: fields["abilities.W"][0],
          E: fields["abilities.E"][0],
          R: fields["abilities.R"][0],
        },
        role: fields.role[0],
        description: fields.description[0],
        image: newFileName,
      };

      try {
        const newChampion = new Champion(championData);
        await newChampion.save(); // Usa await para esperar a que se complete la operación save
        res.redirect("/"); // Redirige al usuario después de guardar el campeón
      } catch (error) {
        console.log("error", error);
        res.status(500).send("Error al guardar el campeón");
      }
    });
  });
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
// delete one
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  console.log("_id desde backend", id);
  try {
    // en la doc de mongoose encontramos esta func para eliminar
    const ChampionDB = await Champion.findByIdAndDelete({ _id: id });
    console.log(ChampionDB);
    //res.redirect('/pokemon) daría un error
    if (!ChampionDB) {
      res.json({
        estado: false,
        mensaje: "No se puede eliminar el Producto.",
      });
    } else {
      res.json({
        estado: true,
        mensaje: "Campeón eliminado",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
// update
router.put("/:id", async (req, res) => {
  const editId = req.params.id;
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../public/imgs");
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {

    const imageFile = files.editImage[0];
    let fecha = new Date();
    const formattedDate = fecha
      .toISOString()
      .replace(/:/g, "-")
      .replace("T", "_")
      .replace(/\..+/, "");
    const newFileName = `${formattedDate}.${imageFile.originalFilename
      .split(".")
      .pop()}`;

    // Define la ruta de destino para el archivo
    const destinationPath = path.join(form.uploadDir, newFileName);

    fs.rename(imageFile.filepath, destinationPath, async (err) => {

      const champion = await Champion.findById(editId);
      if (!champion) {
        console.error("Champion not found");
        return res.status(404).send("Champion not found");
      }

      // Elimina la imagen existente
      const existingImagePath = path.join(form.uploadDir, champion.image);
      console.log(existingImagePath);
      fs.unlink(existingImagePath, async (err) => {
        if (err && err.code === "ENOENT") {
          console.info("La imagen no existe, no es necesario eliminarla.");
        } else if (err) {
          console.error("Error al eliminar la imagen existente");
          return res.status(500).send("Error al eliminar la imagen existente");
        }
        Number(fields.id);

        // Actualiza el champ en la base de datos con la nueva imagen
        try {
          await Champion.findByIdAndUpdate(
            editId,
            {
              id: Number(fields.id),
              name: fields.name,
              abilities: {
                Q: fields["edit.Abilities.Q"][0],
                W: fields["edit.Abilities.W"][0],
                E: fields["edit.Abilities.E"][0],
                R: fields["edit.Abilities.R"][0],
              },
              role: fields.editRole[0],
              description: fields.editDescription[0],
              image: newFileName, // Actualiza la imagen con el nuevo nombre de archivo
            },
            {
              useFindAndModify: false,
            }
          );
          res.json({
            estado: true,
            mensaje: "Champion editado",
          });
        } catch (error) {
          console.log(error);
          res.json({
            estado: false,
            mensaje: "Problema al editar el Champion",
          });
        }
      });
    });
  });
});
router.get("/showChamps", async (req, res) => {
  //arrayChampionDB datos de mongodb y lo metemos al de la vista
  const arrayChampionDB = await Champion.find();
  console.log(arrayChampionDB);
  res.render("details", {
    arrayChampion: arrayChampionDB,
  });
});
module.exports = router;
