// const nombreGerente = document.getElementById("nombre-gerente");
// nombreGerente.textContent = datos.nombre;

let cocheraSeleccionada = null;

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

    cargarCocheras();

    inicializarModalCochera();
  }

  if (pagina === "gerente-tarifas.html") {
    inicializarModal();
  }

  if (pagina === "gerente-servicios.html") {
    inicializarModal();
  }
}

function agregarCochera() {
  const form = document.getElementById("formulario-cochera");

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

      form.reset();

      document
        .getElementById("modal-agregar-cochera")
        .classList.remove("is-active");

      cargarCocheras();
    } else {
      alert("Error al agregar la cochera: " + resultado.error);
    }
  });
}

async function cargarCocheras() {
  const respuesta = await fetch("http://localhost:3000/cocheras");

  const cocheras = await respuesta.json();

  const contenedor = document.getElementById("contenedor-cocheras");

  contenedor.innerHTML = "";

  cocheras.forEach((cochera) => {
    const tarjeta = crearTarjetaCochera(cochera);

    contenedor.appendChild(tarjeta);
  });

  actualizarResumenCocheras(cocheras);
}

function actualizarResumenCocheras(cocheras) {
  const total = cocheras.length;

  const disponibles = cocheras.filter(
    (cochera) => cochera.estado === "Disponible",
  ).length;

  const ocupadas = cocheras.filter(
    (cochera) => cochera.estado === "Ocupada",
  ).length;

  document.getElementById("cocheras-total").textContent = total;
  document.getElementById("cocheras-disponibles").textContent = disponibles;
  document.getElementById("cocheras-ocupadas").textContent = ocupadas;
}

function crearTarjetaCochera(cochera) {
  const plantilla = document.getElementById("plantilla-cochera");

  const tarjeta = plantilla.content.cloneNode(true).querySelector(".column");

  // Cargar los datos de la cochera en la tarjeta
  tarjeta.querySelector(".js-numero").textContent = cochera.numero;
  tarjeta.querySelector(".js-tipo").textContent = cochera.tipo;
  tarjeta.querySelector(".js-estado").textContent = cochera.estado;
  tarjeta.querySelector(".js-clima").textContent = cochera.clima;

  const btnDetalles = tarjeta.querySelector(".btn-detalles");

  btnDetalles.addEventListener("click", () => {
    verDetallesCochera(cochera);
  });

  return tarjeta;
}

function verDetallesCochera(cochera) {
  cocheraSeleccionada = cochera;

  const modal = document.getElementById("modal-detalles-cochera");

  document.getElementById("detalle-numero-cochera").value = cochera.numero;

  document.getElementById("detalle-tipo-cochera").value = cochera.tipo;

  document.getElementById("detalle-estado-cochera").value = cochera.estado;

  document.getElementById("detalle-clima-cochera").value = cochera.clima;

  // Abrirlo en modo detalles

  activarModoDetalles();

  modal.classList.add("is-active");
}

function activarModoDetalles() {
  const numero = document.getElementById("detalle-numero-cochera");

  const tipo = document.getElementById("detalle-tipo-cochera");

  const estado = document.getElementById("detalle-estado-cochera");

  const clima = document.getElementById("detalle-clima-cochera");

  numero.disabled = true;
  tipo.disabled = true;
  estado.disabled = true;
  clima.disabled = true;

  document
    .getElementById("botones-detalles-cochera")
    .classList.remove("is-hidden");

  document.getElementById("botones-edicion-cochera").classList.add("is-hidden");

  document.getElementById("titulo-modal-cochera").textContent =
    "Detalles de la cochera";
}

function activarModoEdicion() {
  document.getElementById("detalle-numero-cochera").disabled = false;

  document.getElementById("detalle-tipo-cochera").disabled = false;

  document.getElementById("detalle-estado-cochera").disabled = false;

  document.getElementById("detalle-clima-cochera").disabled = false;

  document
    .getElementById("botones-detalles-cochera")
    .classList.add("is-hidden");

  document
    .getElementById("botones-edicion-cochera")
    .classList.remove("is-hidden");

  document.getElementById("titulo-modal-cochera").textContent =
    "Editar cochera";
}

async function guardarEdicionCochera() {
  const id = cocheraSeleccionada.id;

  const numero = document.getElementById("detalle-numero-cochera").value;
  const tipo = document.getElementById("detalle-tipo-cochera").value;
  const estado = document.getElementById("detalle-estado-cochera").value;
  const clima = document.getElementById("detalle-clima-cochera").value;

  const respuesta = await fetch(`http://localhost:3000/cocheras/${id}`, {
    method: "PATCH",

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
    alert("Cochera actualizada correctamente");

    document
      .getElementById("modal-detalles-cochera")
      .classList.remove("is-active");

    await cargarCocheras();
  } else {
    alert(
      "Error al actualizar la cochera: " +
        (resultado.error || resultado.message),
    );
  }
}

function cancelarEdicion() {
  verDetallesCochera(cocheraSeleccionada);
}

function inicializarModalCochera() {
  const modal = document.getElementById("modal-detalles-cochera");

  document
    .getElementById("btn-editar-cochera")
    .addEventListener("click", activarModoEdicion);

  document
    .getElementById("btn-cancelar-edicion-cochera")
    .addEventListener("click", cancelarEdicion);

  document
    .getElementById("btn-aceptar-edicion-cochera")
    .addEventListener("click", guardarEdicionCochera);

  document
    .getElementById("btn-borrar-cochera")
    .addEventListener("click", borrarCochera);

  document
    .getElementById("btn-cerrar-detalles-cochera")
    .addEventListener("click", () => {
      modal.classList.remove("is-active");
    });

  modal.querySelector(".modal-background").addEventListener("click", () => {
    modal.classList.remove("is-active");
  });
}

async function borrarCochera() {
  const id = cocheraSeleccionada.id;

  const confirmar = confirm("¿Estás seguro de que querés borrar esta cochera?");

  if (!confirmar) {
    return;
  }

  const respuesta = await fetch(`http://localhost:3000/cocheras/${id}`, {
    method: "DELETE",
  });

  const resultado = await respuesta.json();

  if (respuesta.ok) {
    alert("Cochera eliminada correctamente");

    document
      .getElementById("modal-detalles-cochera")
      .classList.remove("is-active");

    await cargarCocheras();
  } else {
    alert(
      "Error al borrar la cochera: " + (resultado.error || resultado.message),
    );
  }
}

// Cargar la sección de inicio al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  const dashboard = document.querySelector(".menu-item");

  cargarSeccion("gerente-inicio.html", dashboard);
});
