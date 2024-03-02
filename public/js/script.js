"use strict";

let deleteChampLinks = document.querySelectorAll(".deleteChamp");
console.log(deleteChampLinks);
let RemoveModalLink = document.querySelector("#confirmRemove");

// para cada elemento con la clase .deleteChamp
// hacemos una función anonima que añade a cada elemento un EventListener
deleteChampLinks.forEach(function (deleteChampLink) {
  deleteChampLink.addEventListener("click", function (event) {
    event.preventDefault();

    // Id del campeón seleccionado
    let championId = this.dataset.id;
    // Actualiza el atributo 'href' del enlace dentro del modal con el ID del campeón
    console.log("Efsf");
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
    document.querySelector("#editChampionImage").value = res.champion.image;

    // Modificar el atributo 'action' del formulario para incluir el ID del campeón
    editForm.action = `/${editChampionId}`;
    editForm.dataset.championId = editChampionId;
  });
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener el ID del campeón del dataset del formulario
  const championId = editForm.dataset.championId;
  console.log(editForm.elements);
  const id = editForm.elements["id"].value;
  console.log(editForm.elements["edit.Abilities.Q"].value);
  const name = editForm.elements["editName"].value;
  const Q = editForm.elements["edit.Abilities.Q"].value;
  const W = editForm.elements["edit.Abilities.W"].value;
  const E = editForm.elements["edit.Abilities.E"].value;
  const R = editForm.elements["edit.Abilities.R"].value;
  const role = editForm.elements["editRole"].value;
  const description = editForm.elements["editDescription"].value;
  const image = editForm.elements["editImage"].value;

  // Enviar los datos utilizando fetch de tipo PUT
  const data = await fetch(`/${championId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      name,
      abilities: { Q, W, E, R },
      role,
      description,
      image,
    }),
  });

  const res = await data.json();
  if (res.estado) {
    window.location.href = "/";
  } else {
    console.log(res);
  }
});
