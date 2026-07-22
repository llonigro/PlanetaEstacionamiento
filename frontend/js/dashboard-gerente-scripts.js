// const nombreGerente = document.getElementById("nombre-gerente");
// nombreGerente.textContent = datos.nombre;

async function cargarSeccion(pagina, elementoActivo) {
  const respuesta = await fetch(pagina);

  const contenido = await respuesta.text();

  document.getElementById("contenido-dashboard").innerHTML = contenido;

  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("is-active");
  });

  elementoActivo.classList.add("is-active");

  inicializarScriptsSeccion(pagina);
}

function inicializarScriptsSeccion(pagina) {
  if (pagina === "gerente-cocheras.html") {
    inicializarModal();

    agregarCochera();
  }

  if (pagina === "gerente-tarifas.html") {
    inicializarModal();
  }

  if (pagina === "gerente-servicios.html") {
    inicializarModal();
  }
}

function agregarCochera() {
  const form = document.getElementById("form-agregar-cochera");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const numero = document.getElementById("numero-cochera").value;
    const tipo = document.getElementById("tipo-cochera").value;
    const estado = document.getElementById("estado-cochera").value;
    const clima = document.getElementById("clima-cochera").value;

    const respuesta = await fetch("http://localhost:3000/cocheras", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        numero,
        tipo,
        estado,
        clima,
      }),
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      alert("Cochera agregada exitosamente");
    } else {
      alert("Error al agregar la cochera: " + resultado.error);
    }
  });
}

// Cargar la sección de inicio al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  const dashboard = document.querySelector(".menu-item");

  cargarSeccion("gerente-inicio.html", dashboard);
});
