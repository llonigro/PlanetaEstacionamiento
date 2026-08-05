// const nombreGerente = document.getElementById("nombre-gerente");
// nombreGerente.textContent = datos.nombre;

let cocheraSeleccionada = null;
let usuarioActual = null;
let registroDetalleActualId = null;

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

  if (pagina === "gerente-registros.html") {
    inicializarModalRegistro();
    cargarRegistros();
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
    const libre = document.getElementById("estado-cochera").value;
    const clima = document.getElementById("clima-cochera").value;

    const respuesta = await fetch("http://localhost:3000/cocheras", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        numero,
        tipo,
        libre,
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
    (cochera) => cochera.libre === true,
  ).length;

  const ocupadas = cocheras.filter((cochera) => cochera.libre === false).length;

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
  tarjeta.querySelector(".js-clima").textContent = cochera.clima;

  const estado = tarjeta.querySelector(".js-estado");
  const esLibre = cochera.libre === true;

  if (esLibre) {
    estado.textContent = "Disponible";
    estado.classList.add("is-success");
  } else {
    estado.textContent = "Ocupada";
    estado.classList.add("is-danger");
  }

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

  document.getElementById("detalle-clima-cochera").value = cochera.clima;

  // Abrirlo en modo detalles

  activarModoDetalles();

  modal.classList.add("is-active");
}

function activarModoDetalles() {
  const numero = document.getElementById("detalle-numero-cochera");

  const tipo = document.getElementById("detalle-tipo-cochera");

  const clima = document.getElementById("detalle-clima-cochera");

  numero.disabled = true;
  tipo.disabled = true;
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
  const clima = document.getElementById("detalle-clima-cochera").value;

  const respuesta = await fetch(`http://localhost:3000/cocheras/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      numero,
      tipo,
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

async function cargarDatosUsuarioActual() {
  try {
    const respuesta = await fetch("http://localhost:3000/usuario", {
      method: "GET",
      credentials: "include",
    });

    if (!respuesta.ok) {
      usuarioActual = { rol: "empleado" };
      return;
    }

    const datos = await respuesta.json();
    usuarioActual = datos;
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error);
    usuarioActual = { rol: "empleado" };
  }
}

function esGerente() {
  return usuarioActual?.rol === "gerente";
}

async function cargarRegistros() {
  const respuesta = await fetch("http://localhost:3000/registros", {
    credentials: "include",
  });

  const registros = await respuesta.json();

  const tbody = document.getElementById("registros-body");

  tbody.innerHTML = "";

  registros.forEach((registro) => {
    const fila = document.createElement("tr");
    const puedeRegistrarEgreso =
      esGerente() && !registro.fecha_egreso && !registro.anulado;

    fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.cochera_id}</td>
            <td>${registro.vehiculo_id}</td>
            <td>${formatearFecha(registro.fecha_ingreso)}</td>
            <td>${formatearFecha(registro.fecha_egreso)}</td>
            <td>$${registro.precio_total}</td>
            
            <td>
                <div class="acciones-registro">
                    <button
                        class="boton-accion ver"
                        onclick="verRegistro(${registro.id})"
                        title="Ver detalles"
                    >
                        <i class="fas fa-eye"></i>
                    </button>

                    <button
                        class="boton-accion egreso"
                        ${puedeRegistrarEgreso ? "" : "disabled"}
                        onclick="registrarEgreso(${registro.id})"
                        title="${
                          registro.fecha_egreso
                            ? "El egreso ya fue registrado"
                            : puedeRegistrarEgreso
                              ? "Registrar egreso"
                              : "Solo el gerente puede asignar el precio"
                        }"
                    >
                        <i class="fas fa-right-from-bracket"></i>
                    </button>

                    <button
                        class="boton-accion eliminar"
                        onclick="anularRegistro(${registro.id})"
                        title="Anular registro"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

    tbody.appendChild(fila);
  });
}

function formatearFecha(fecha) {
  if (!fecha) return "-";

  return new Date(fecha).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function verRegistro(id) {
  try {
    const respuesta = await fetch(`http://localhost:3000/registros/${id}`, {
      credentials: "include",
    });

    const registro = await respuesta.json();

    if (!respuesta.ok) {
      alert(registro.mensaje);
      return;
    }

    document.getElementById("detalle-id").textContent =
      `Registro #${registro.id}`;

    document.getElementById("detalle-patente").textContent = registro.patente;

    document.getElementById("detalle-marca").textContent = registro.marca;

    document.getElementById("detalle-modelo").textContent = registro.modelo;

    document.getElementById("detalle-cochera").textContent =
      registro.cochera_id;

    document.getElementById("detalle-ingreso").textContent = formatearFecha(
      registro.fecha_ingreso,
    );

    document.getElementById("detalle-egreso").textContent = formatearFecha(
      registro.fecha_egreso,
    );

    const precioInput = document.getElementById("detalle-precio");
    const precioAyuda = document.getElementById("detalle-precio-ayuda");

    precioInput.value = registro.precio_total ?? 0;

    const puedeEditarPrecio =
      esGerente() && !registro.anulado && !registro.fecha_egreso;
    precioInput.readOnly = !puedeEditarPrecio;
    precioAyuda.textContent = puedeEditarPrecio
      ? "El gerente puede asignar el precio al cerrar este registro."
      : "Solo el gerente puede modificar el precio de un registro activo.";

    const estado = document.getElementById("detalle-estado");

    // Estado del registro: Activo, Finalizado o Anulado
    if (registro.anulado) {
      estado.textContent = "Anulado";
    } else if (registro.fecha_egreso) {
      estado.textContent = "Finalizado";
    } else {
      estado.textContent = "Activo";
    }

    // Habilitar o deshabilitar el botón de egreso según el estado del registro
    const btnEgreso = document.getElementById("boton-egreso");
    registroDetalleActualId = registro.id;

    if (esGerente() && !registro.fecha_egreso && !registro.anulado) {
      btnEgreso.disabled = false;
    } else {
      btnEgreso.disabled = true;
    }

    document
      .getElementById("modal-detalle-registro")
      .classList.add("is-active");
  } catch (error) {
    console.error("Error al obtener registro:", error);
    alert("No se pudo obtener el registro.");
  }
}

async function registrarEgreso(id) {
  if (!esGerente()) {
    alert("Solo el gerente puede registrar el egreso y asignar el precio.");
    return;
  }

  const precioInput = document.getElementById("detalle-precio");
  const precioTexto = precioInput?.value?.trim();
  const precioNumero = Number(precioTexto);

  if (!precioTexto || Number.isNaN(precioNumero) || precioNumero < 0) {
    alert("Ingresá un precio válido mayor o igual a 0.");
    return;
  }

  const confirmar = confirm(
    "¿Querés registrar el egreso y cerrar este registro con el precio indicado?",
  );

  if (!confirmar) return;

  try {
    const respuesta = await fetch(
      `http://localhost:3000/registros/egreso/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha_egreso: new Date().toISOString(),
          precio_total: precioNumero,
        }),
      },
    );

    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      alert(
        datos.message ||
          datos.errors?.[0]?.msg ||
          "No se pudo registrar el egreso.",
      );
      return;
    }

    alert("Egreso registrado correctamente.");
    await cargarRegistros();
    document
      .getElementById("modal-detalle-registro")
      .classList.remove("is-active");
  } catch (error) {
    console.error("Error al registrar el egreso:", error);
    alert("Ocurrió un error al registrar el egreso.");
  }
}

async function anularRegistro(id) {
  const confirmar = confirm(
    "¿Estás seguro de que querés anular este registro?",
  );

  if (!confirmar) return;

  try {
    const respuesta = await fetch(`http://localhost:3000/registros/${id}`, {
      method: "DELETE",
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alert(datos.message || "No se pudo anular el registro.");
      return;
    }

    // Actualizamos la tabla
    await cargarRegistros();

    alert("Registro anulado correctamente.");
  } catch (error) {
    console.error("Error al anular registro:", error);
    alert("Ocurrió un error al anular el registro.");
  }
}

function inicializarModalRegistro() {
  const modal = document.getElementById("modal-detalle-registro");

  document
    .getElementById("btn-cerrar-detalle-registro")
    .addEventListener("click", () => {
      modal.classList.remove("is-active");
    });

  document
    .getElementById("btn-cerrar-detalle-registro-2")
    .addEventListener("click", () => {
      modal.classList.remove("is-active");
    });

  document.getElementById("boton-egreso").addEventListener("click", () => {
    if (registroDetalleActualId) {
      registrarEgreso(registroDetalleActualId);
    }
  });

  modal.querySelector(".modal-background").addEventListener("click", () => {
    modal.classList.remove("is-active");
  });
}

// Cargar la sección de inicio al cargar la página
document.addEventListener("DOMContentLoaded", async function () {
  await cargarDatosUsuarioActual();

  const dashboard = document.querySelector(".menu-item");

  cargarSeccion("gerente-inicio.html", dashboard);
});
