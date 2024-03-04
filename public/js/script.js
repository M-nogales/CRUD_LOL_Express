"use strict";

let deleteChampLinks = document.querySelectorAll(".deleteChamp");
let RemoveModalLink = document.querySelector("#confirmRemove");

// para cada elemento con la clase .deleteChamp
// hacemos una función anonima que añade a cada elemento un EventListener
deleteChampLinks.forEach(function (deleteChampLink) {
  deleteChampLink.addEventListener("click", function (event) {
    event.preventDefault();

    // Id del campeón seleccionado
    let championId = this.dataset.id;
    // Actualiza el atributo 'href' del enlace dentro del modal con el ID del campeón
    RemoveModalLink.href = `/${championId}`;
  });
});
console.log(RemoveModalLink.href);
RemoveModalLink.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    const data = await fetch(RemoveModalLink.href, {
      method: "delete",
    });
    const res = await data.json();
    console.log(res);
    if (res.estado) {
      window.location.href = "/";
    } else {
      console.log(res);
    }
  } catch (error) {
    console.log(error);
  }
});

//! edit champions

let editChampLinks = document.querySelectorAll(".editChamp");
console.log(editChampLinks);
let editForm = document.querySelector("#editChampionForm");

editChampLinks.forEach(function (editChampLink) {
  editChampLink.addEventListener("click", async (e) => {
    e.preventDefault();

    // Id del campeón seleccionado
    let editChampionId = editChampLink.dataset.id;
    let editData = await fetch(`/${editChampionId}`, {
      method: "get",
    });
    const res = await editData.json();
    console.log(res);

    document.querySelector("#championId").value = res.champion.id;
    document.querySelector("#editChampionName").value = res.champion.name;
    // Acceder a las habilidades a través del objeto 'abilities'
    document.querySelector("#championQ").value = res.champion.abilities.Q;
    document.querySelector("#championW").value = res.champion.abilities.W;
    document.querySelector("#championE").value = res.champion.abilities.E;
    document.querySelector("#championR").value = res.champion.abilities.R;
    document.querySelector("#editChampionRole").value = res.champion.role;
    document.querySelector("#editChampionDescription").value =
      res.champion.description;
    document.querySelector(
      "#editChampionImage"
    ).src = `imgs/${res.champion.image}`;
    // Modificar el atributo 'action' del formulario para incluir el ID del campeón
    editForm.action = `/${editChampionId}`;
    editForm.dataset.championId = editChampionId;
  });
});

//al hacer click en la imagen se abre un input para añadir una nueva imagen
document.getElementById('editChampionImage').addEventListener('click', function() {
  document.getElementById('editImageInput').click();
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let championId2 = editForm.dataset.championId;
  //guardamos los datos en un objeto formidable e imgs
  const formData = new FormData(editForm);
 
  // Añadimos el archivo al objeto FormData
  const imageFile = document.getElementById('editImageInput').files[0];
  if (imageFile) {
     formData.append('editImage', imageFile);
  }
 
  const data = await fetch(`/${championId2}`, {
     method: "PUT",
     body: formData,
  });
 
  const res = await data.json();
  if (res.estado) {
     window.location.href = "/";
  } else {
    showAlert(res.mensaje);
    }
 });

 function showAlert(message) {
  const table = document.getElementById('table');
  if (!table) {
      console.error('No se encontró la tabla con el ID "table"');
      return;
  }

  // Crear el contenedor de alerta
  const alertContainer = document.createElement('div');
  alertContainer.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
  `;

  // Insertar el contenedor de alerta justo antes de la tabla
  table.parentNode.insertBefore(alertContainer, table);
}
