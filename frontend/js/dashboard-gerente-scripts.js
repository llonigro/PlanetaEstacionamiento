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
    inicializarModal();
    inicializarModalRegistro();
    cargarRegistros();
  }

  if (pagina === "gerente-tarifas.html") {
    inicializarModal();
  }

  if (pagina === "gerente-servicios.html") {
    inicializarModal();
    cargarServicios();
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
      alert("Error al agregar la cochera: " + resultado.message);
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

    // Pedir detalles del vehículo a la API de vehículos
    const resVehiculo = await fetch(
      `http://localhost:3000/vehiculos/${registro.vehiculo_id}`,
      {
        credentials: "include",
      },
    );

    const vehiculo = await resVehiculo.json();

    document.getElementById("detalle-patente").textContent =
      vehiculo.patente || "Error al obtener patente";
    document.getElementById("detalle-marca").textContent =
      vehiculo.marca || "Error al obtener marca";
    document.getElementById("detalle-modelo").textContent =
      vehiculo.modelo || "Error al obtener modelo";
    document.getElementById("detalle-permite-valet").textContent =
      vehiculo.permite_valet ? "Sí" : "No";

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

// Carga simultánea de Catálogo y Solicitudes
async function cargarServicios() {
  await Promise.all([cargarTablaCatalogo(), cargarTablaSolicitudes()]);
}

// Cargar Catálogo (Precios Base)
async function cargarTablaCatalogo() {
  const tbody = document.getElementById("tbody-catalogo");
  if (!tbody) return;

  try {
    const res = await fetch("http://localhost:3000/catalogo", {
      credentials: "include",
    });
    const servicios = await res.json();

    if (!res.ok || !Array.isArray(servicios)) {
      tbody.innerHTML = `<tr><td colspan="5" class="has-text-danger has-text-centered">Error al cargar el catálogo</td></tr>`;
      return;
    }

    tbody.innerHTML = servicios
      .map(
        (s) => `
      <tr>
        <td>#${s.id}</td>
        <td>${s.nombre}</td>
        <td>${s.descripcion}</td>
        <td>
          <div class="field has-addons" style="justify-content: center;">
            <p class="control"><a class="button is-static">$</a></p>
            <p class="control">
              <input class="input" type="number" id="precio-base-${s.id}" value="${s.precio_base}" style="width: 120px; text-align: center;">
            </p>
          </div>
        </td>
        <td>
          <div class="acciones-registro">
            <button class="boton-accion egreso" title="Guardar Precio Base" onclick="guardarPrecioBase(${s.id})">
              <i class="fas fa-save"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Error al cargar catálogo:", err);
  }
}

// Cargar Solicitudes de Clientes
async function cargarTablaSolicitudes() {
  const tbody = document.getElementById("tbody-solicitudes");
  if (!tbody) return;

  try {
    const res = await fetch("http://localhost:3000/servicios", {
      credentials: "include",
    });
    const solicitudes = await res.json();

    if (!res.ok || !Array.isArray(solicitudes)) {
      tbody.innerHTML = `<tr><td colspan="7" class="has-text-danger has-text-centered">Error al cargar solicitudes</td></tr>`;
      return;
    }

    tbody.innerHTML = solicitudes
      .map(
        (item) => `
      <tr>
        <td>#${item.id}</td>
        <td>Vehículo #${item.vehiculo_id}</td>
        <td>${item.servicio_nombre || `Servicio #${item.servicio_id}`}</td>
        <td>${formatearFecha(item.fecha_solicitud)}</td>
        <td>
          <div class="select is-small">
            <select id="estado-${item.id}">
              <option value="En Espera" ${item.estado === "en espera" ? "selected" : ""}>En Espera</option>
              <option value="En Proceso" ${item.estado === "en Proceso" ? "selected" : ""}>En Proceso</option>
              <option value="Finalizado" ${item.estado === "finalizado" ? "selected" : ""}>Finalizado</option>
            </select>
          </div>
        </td>
        <td>
          <div class="field has-addons" style="justify-content: center;">
            <p class="control"><a class="button is-static">$</a></p>
            <p class="control">
              <input class="input" type="number" id="precio-final-${item.id}" value="${item.precio_final ?? 0}" style="width: 110px; text-align: center;">
            </p>
          </div>
        </td>
        <td>
          <div class="acciones-registro">
            <button class="boton-accion egreso" title="Guardar Cambios" onclick="actualizarServicioCliente(${item.id})">
              <i class="fas fa-check"></i>
            </button>
            <button class="boton-accion eliminar" title="Eliminar Solicitud" onclick="eliminarServicioCliente(${item.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Error al cargar solicitudes:", err);
  }
}

// Guardar Modificación de Precio Base en el Catálogo
async function guardarPrecioBase(id) {
  const estadoActual = document.getElementById(`estado-${id}`);
  const precioInput = document.getElementById(`precio-base-${id}`);
  const precioBase = Number(precioInput.value);

  if (isNaN(precioBase) || precioBase < 0) {
    alert("Ingresá un precio base válido.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/catalogo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        estado: estadoActual,
        precio_base: precioBase,
      }),
    });

    if (res.ok) {
      alert("Precio base actualizado correctamente.");
    } else {
      const err = await res.json();
      alert("Error al actualizar: " + (err.message || err.error));
    }
  } catch (err) {
    console.error(err);
    alert("Ocurrió un error al intentar actualizar el precio base.");
  }
}

// Guardar Modificación de Estado y Precio Final en Solicitudes
async function actualizarServicioCliente(id) {
  const estado = document.getElementById(`estado-${id}`).value;
  const precioInput = document.getElementById(`precio-final-${id}`);
  const precioFinal = Number(precioInput.value);

  if (isNaN(precioFinal) || precioFinal < 0) {
    alert("Ingresá un precio final válido.");
    return;
  }

  console.log("Enviando a backend:", { estado, precio_final: precioFinal });

  try {
    const res = await fetch(`http://localhost:3000/servicios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        estado: estado,
        precio_final: precioFinal,
      }),
    });

    if (res.ok) {
      alert("Servicio actualizado correctamente.");
    } else {
      const err = await res.json();
      alert("Error al actualizar: " + (err.message || err.error));
    }
  } catch (err) {
    console.error(err);
    alert("Ocurrió un error al actualizar la solicitud.");
  }
}

async function eliminarServicioCliente(id) {
  const confirmar = confirm(
    "¿Estás seguro de que querés eliminar esta solicitud de servicio?",
  );

  if (!confirmar) return;

  try {
    const res = await fetch(`http://localhost:3000/servicios/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      alert("Solicitud eliminada correctamente.");
      await cargarTablaSolicitudes();
    } else {
      const err = await res.json();
      alert("Error al eliminar: " + (err.message || err.error));
    }
  } catch (err) {
    console.error(err);
    alert("Ocurrió un error al intentar eliminar la solicitud.");
  }
}

// Cargar la sección de inicio al cargar la página
document.addEventListener("DOMContentLoaded", async function () {
  await cargarDatosUsuarioActual();

  await cargarTablaCatalogo();
  await cargarTablaSolicitudes();

  const dashboard = document.querySelector(".menu-item");

  cargarSeccion("gerente-inicio.html", dashboard);
});
