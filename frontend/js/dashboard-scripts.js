// VARIABLES GLOBALES
let vehiculoId = null; // id del vehículo del usuario en sesión
let vehiculoEnCochera = false; // true cuando el vehículo tiene un registro de ingreso activo
let vehiculoOriginal = null;
let modoVehiculoFormulario = "editar";
let catalogoPrecios = {}; // { servicioId: precio } para mostrar en la UI y bloquear servicios reservados

const LAVADO_SERVICIO_ID = 2; // ID del servicio de lavado en la base de datos
const VALET_SERVICIO_ID = 1; // ID del servicio de valet en la base de datos
const API_URL = "http://localhost:3000";
const CAMPOS_VEHICULO = ["marca", "modelo", "color", "patente"];

// INICIALIZACIÓN

document.addEventListener("DOMContentLoaded", async () => {
  await obtenerDatosUsuarioActual();

  inicializarModales();
  inicializarModalLavado();
  inicializarModalVerLavado();
  inicializarModalValet();
  inicializarModalVerValet();
  inicializarBloqueoAccionesRapidas();
  inicializarBotonCerrarSesion();

  // Mostrar datos guardados localmente de forma instantánea
  cargarVehiculoDesdeLocalStorage();

  await cargarVehiculoUsuario();

  // Cargar el catálogo de precios
  await cargarCatalogoServicios();

  // Actualizamos la UI de cochera actual y el estado vehiculoEnCochera
  if (vehiculoId) {
    await actualizarCocheraActual();
  }

  await actualizarBloqueosSegunEstado();

  // Event listener de guardar vehículo
  const btnGuardarVehiculo = document.getElementById("btn-guardar-vehiculo");
  if (btnGuardarVehiculo) {
    btnGuardarVehiculo.addEventListener("click", guardarVehiculo);
  }

  // Event listener de confirmar registro de cochera
  const btnConfirmarRegistroCochera = document.getElementById(
    "confirmar-registro-cochera",
  );
  if (btnConfirmarRegistroCochera) {
    btnConfirmarRegistroCochera.addEventListener(
      "click",
      registrarIngresoCochera,
    );
  }
  // 1. Intentamos cargar el vehículo desde LocalStorage
  const tieneVehiculo = cargarVehiculoDesdeLocalStorage();

  // 2. Si se cargó correctamente, asignamos el vehiculoId y verificamos la API
  if (tieneVehiculo) {
    const vehiculoGuardado = JSON.parse(localStorage.getItem("vehiculo_datos"));

    if (vehiculoGuardado && vehiculoGuardado.id) {
      vehiculoId = Number(vehiculoGuardado.id);

      // 3. Consultamos el estado a la API para bloquear botones si hay un servicio activo
      if (typeof verificarEstadoServiciosYBloquear === "function") {
        await verificarEstadoServiciosYBloquear();
      }
    }
  }

  inicializarBotonCocheras();
});

// AUTENTICACIÓN Y SESIÓN

async function obtenerDatosUsuarioActual() {
  try {
    const respuesta = await fetch(`${API_URL}/usuario`, {
      method: "GET",
      credentials: "include",
    });

    if (!respuesta.ok) {
      // Si la sesión no es válida, redirigimos al inicio
      // (por ejemplo, si la cookie no existe o ha expirado)
      alert("No hay sesión activa. Redirigiendo al inicio.");
      window.location.href = "inicio.html";
      return;
    }
    const usuario = await respuesta.json();
    const usuarioId = usuario.id;

    window.usuarioLogueadoId = usuarioId;
  } catch (error) {
    console.error("Error al obtener la sesión:", error);
  }
}

// GESTIÓN DE MODALES

function inicializarModales() {
  // Botones que abren modales
  document.querySelectorAll("[data-modal]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const modalId = boton.dataset.modal;
      const modal = document.getElementById(modalId);

      if (!modal) return;

      if (
        modalId === "modal-lavado" ||
        modalId === "modal-valet" ||
        modalId === "modal-ver-lavado" ||
        modalId === "modal-ver-valet"
      ) {
        return;
      }

      if (modal.id === "modal-vehiculo") {
        prepararModalVehiculo(boton.dataset.vehiculoModo || "editar");
      }

      modal.classList.add("is-active");
    });
  });

  // Botones que cierran modales
  document.querySelectorAll(".modal").forEach((modal) => {
    const cerrarModal = () => {
      modal.classList.remove("is-active");
    };

    const botonCerrar = modal.querySelector(".delete");
    const botonCancelar = modal.querySelector(".btn-modal-cancelar");
    const fondo = modal.querySelector(".modal-background");

    if (botonCerrar) botonCerrar.addEventListener("click", cerrarModal);
    if (botonCancelar) botonCancelar.addEventListener("click", cerrarModal);
    if (fondo) fondo.addEventListener("click", cerrarModal);
  });
}

// VEHICULO

function normalizarVehiculo(vehiculo = {}) {
  return {
    id: vehiculo.id ?? vehiculo.idVehiculo ?? null,
    marca: (vehiculo.marca ?? "").trim(),
    modelo: (vehiculo.modelo ?? "").trim(),
    color: (vehiculo.color ?? "").trim(),
    patente: (vehiculo.patente ?? "").trim().toUpperCase(),
    permitir_valet:
      typeof vehiculo.permitir_valet === "boolean"
        ? vehiculo.permitir_valet
        : String(vehiculo.permitir_valet).toLowerCase() === "true",
  };
}

function obtenerVehiculoDesdeVista() {
  return normalizarVehiculo({
    id: vehiculoId,
    marca: document.getElementById("marca-vehiculo")?.textContent ?? "",
    modelo: document.getElementById("modelo-vehiculo-2")?.textContent ?? "",
    color: document.getElementById("color-vehiculo")?.textContent ?? "",
    patente: document.getElementById("patente-vehiculo")?.textContent ?? "",
    permitir_valet:
      (
        document.getElementById("permitir-valet-vehiculo")?.textContent ?? ""
      ).trim() === "Sí",
  });
}

function obtenerVehiculoDesdeFormulario() {
  return normalizarVehiculo({
    id: vehiculoId,
    marca: document.getElementById("input-marca").value,
    modelo: document.getElementById("input-modelo").value,
    color: document.getElementById("input-color").value,
    patente: document.getElementById("input-patente").value,
    permitir_valet:
      document.getElementById("input-permitir-valet").value === "true",
  });
}

function cargarDatosVehiculo() {
  CAMPOS_VEHICULO.forEach((campo) => {
    const dato = document.getElementById(`${campo}-vehiculo`);
    const input = document.getElementById(`input-${campo}`);

    if (dato && input) {
      input.value = dato.textContent.trim();
    }
  });

  const datoPermitirValet = document.getElementById("permitir-valet-vehiculo");
  const inputPermitirValet = document.getElementById("input-permitir-valet");

  if (datoPermitirValet && inputPermitirValet) {
    inputPermitirValet.value =
      datoPermitirValet.textContent.trim() === "Sí" ? "true" : "false";
  }

  vehiculoOriginal = obtenerVehiculoDesdeVista();
}

function prepararModalVehiculo(modo) {
  const titulo = document.getElementById("modal-vehiculo-titulo");
  const textoBoton = document.getElementById("btn-vehiculo-texto");
  const botonEliminar = document.getElementById("btn-eliminar-vehiculo");

  modoVehiculoFormulario = modo === "crear" ? "crear" : "editar";

  if (modoVehiculoFormulario === "crear") {
    vehiculoOriginal = null;
    document.getElementById("input-marca").value = "";
    document.getElementById("input-modelo").value = "";
    document.getElementById("input-color").value = "";
    document.getElementById("input-patente").value = "";
    document.getElementById("input-permitir-valet").value = "true";

    if (titulo) titulo.textContent = "Agregar vehículo";
    if (textoBoton) textoBoton.textContent = "Agregar vehículo";
    if (botonEliminar) botonEliminar.classList.add("is-hidden");
    return;
  }

  cargarDatosVehiculo();

  if (titulo) titulo.textContent = "Editar vehículo";
  if (textoBoton) textoBoton.textContent = "Confirmar edición";
  if (botonEliminar) botonEliminar.classList.remove("is-hidden");
}

function tieneCambiosVehiculo(original, actual) {
  if (!original || !actual) return true;

  return ["marca", "modelo", "color", "patente", "permitir_valet"].some(
    (campo) => original[campo] !== actual[campo],
  );
}

function actualizarSeccionVehiculo(vehiculo) {
  const seccionVehiculo = document.querySelector(".seccion-vehiculo");

  if (seccionVehiculo) {
    seccionVehiculo.classList.remove("vehiculo-sin-registro");
  }

  vehiculoId = vehiculo.id ?? vehiculoId;
  vehiculoOriginal = normalizarVehiculo(vehiculo);

  const elMarca = document.getElementById("marca-vehiculo");
  const elModelo = document.getElementById("modelo-vehiculo");
  const elModelo2 = document.getElementById("modelo-vehiculo-2");
  const elColor = document.getElementById("color-vehiculo");
  const elPatente = document.getElementById("patente-vehiculo");
  const elValet = document.getElementById("permitir-valet-vehiculo");

  if (elMarca) elMarca.textContent = vehiculo.marca;
  else console.warn("Elemento marca-vehiculo no encontrado en el DOM");

  if (elModelo) elModelo.textContent = vehiculo.modelo;
  else console.warn("Elemento modelo-vehiculo no encontrado en el DOM");

  if (elModelo2) elModelo2.textContent = vehiculo.modelo;
  else console.warn("Elemento modelo-vehiculo-2 no encontrado en el DOM");

  if (elColor) elColor.textContent = vehiculo.color;
  else console.warn("Elemento color-vehiculo no encontrado en el DOM");

  if (elPatente) elPatente.textContent = vehiculo.patente;
  else console.warn("Elemento patente-vehiculo no encontrado en el DOM");

  if (elValet) elValet.textContent = vehiculo.permitir_valet ? "Sí" : "No";
  else console.warn("Elemento permitir-valet-vehiculo no encontrado en el DOM");

  guardarVehiculoEnLocalStorage(normalizarVehiculo(vehiculo));
}

function mostrarVehiculoSinRegistro() {
  vehiculoId = null;
  vehiculoOriginal = null;
  vehiculoEnCochera = false;

  const seccionVehiculo = document.querySelector(".seccion-vehiculo");
  if (seccionVehiculo) {
    seccionVehiculo.classList.add("vehiculo-sin-registro");
  }

  const elM = document.getElementById("marca-vehiculo");
  const elMo = document.getElementById("modelo-vehiculo");
  const elMo2 = document.getElementById("modelo-vehiculo-2");
  const elC = document.getElementById("color-vehiculo");
  const elP = document.getElementById("patente-vehiculo");
  const elV = document.getElementById("permitir-valet-vehiculo");

  if (elM) elM.textContent = "[Marca]";
  if (elMo) elMo.textContent = "[Nombre del vehículo]";
  if (elMo2) elMo2.textContent = "[Modelo]";
  if (elC) elC.textContent = "[Color]";
  if (elP) elP.textContent = "[ABC123]";
  if (elV) elV.textContent = "[Sí/No]";

  limpiarVehiculoLocalStorage();
  actualizarBloqueosSegunEstado();
}

// Persistencia local: guardar y cargar vehículo en localStorage
function guardarVehiculoEnLocalStorage(vehiculo) {
  try {
    localStorage.setItem("vehiculo_datos", JSON.stringify(vehiculo));
  } catch (e) {
    console.warn("No se pudo guardar en localStorage:", e);
  }
}

function cargarVehiculoDesdeLocalStorage() {
  try {
    const raw = localStorage.getItem("vehiculo_datos");
    if (!raw) {
      mostrarVehiculoSinRegistro();
      return false;
    }

    const vehiculo = JSON.parse(raw);

    if (!vehiculo) {
      mostrarVehiculoSinRegistro();
      return false;
    }

    actualizarSeccionVehiculo(normalizarVehiculo(vehiculo));

    return true;
  } catch (e) {
    console.warn("Error al cargar vehiculo desde localStorage:", e);
    return false;
  }
}

function limpiarVehiculoLocalStorage() {
  try {
    localStorage.removeItem("vehiculo_datos");
  } catch (e) {
    console.warn("No se pudo limpiar localStorage:", e);
  }
}

// Manejo de cierre de sesión en cliente: limpia la copia local y redirige.
function inicializarBotonCerrarSesion() {
  const btn = document.getElementById("btn-cerrar-sesion");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    limpiarVehiculoLocalStorage();

    // Intentamos llamar al endpoint logout
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // Ignoramos errores de red; igualmente redirigimos
    }

    window.location.href = "inicio.html";
  });
}

async function guardarVehiculo() {
  const usuarioId = window.usuarioLogueadoId;

  const datosFormulario = obtenerVehiculoDesdeFormulario();

  if (
    !datosFormulario.marca ||
    !datosFormulario.modelo ||
    !datosFormulario.color ||
    !datosFormulario.patente
  ) {
    alert("Por favor, completa todos los campos del vehículo.");
    return;
  }

  const datosVehiculo = {
    marca: datosFormulario.marca,
    modelo: datosFormulario.modelo,
    color: datosFormulario.color,
    patente: datosFormulario.patente,
    usuario_id: Number(usuarioId),
    permitir_valet: datosFormulario.permitir_valet,
  };

  try {
    const esEdicion = modoVehiculoFormulario === "editar" && vehiculoId;

    if (esEdicion) {
      const datosOriginales = normalizarVehiculo(
        vehiculoOriginal || obtenerVehiculoDesdeVista(),
      );
      if (!tieneCambiosVehiculo(datosOriginales, datosFormulario)) {
        document.getElementById("modal-vehiculo").classList.remove("is-active");
        return;
      }
    }

    const respuesta = await fetch(
      esEdicion ? `${API_URL}/vehiculos/${vehiculoId}` : `${API_URL}/vehiculos`,
      {
        method: esEdicion ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(datosVehiculo),
      },
    );

    if (!respuesta.ok) {
      let mensaje = "Error al guardar el vehículo.";

      try {
        const errorData = await respuesta.json();
        const mensajesValidacion = Array.isArray(errorData?.errors)
          ? errorData.errors.map((error) => error?.msg).filter(Boolean)
          : [];

        if (mensajesValidacion.length > 0) {
          mensaje = mensajesValidacion.join("\n");
        } else {
          mensaje = errorData?.message || errorData?.mensaje || mensaje;
        }
      } catch (e) {
        // Si la respuesta no es JSON, usamos el mensaje por defecto.
      }

      alert(mensaje);
      return;
    }

    const vehiculoGuardado = await respuesta.json();

    actualizarSeccionVehiculo(normalizarVehiculo(vehiculoGuardado));

    actualizarBloqueosSegunEstado();
    document.getElementById("modal-vehiculo").classList.remove("is-active");
  } catch (error) {
    console.error("Error al guardar el vehículo:", error);
    alert("Hubo un problema al guardar el vehículo.");
  }
}

async function cargarVehiculoUsuario() {
  try {
    const respuesta = await fetch(
      `${API_URL}/vehiculos/usuario/${window.usuarioLogueadoId}`,
      {
        credentials: "include",
      },
    );

    // Si el backend responde 204 (sin contenido) o 404, consideramos que
    // el usuario no tiene vehículo y mostramos la UI por defecto.
    if (!respuesta.ok) {
      if (respuesta.status === 404 || respuesta.status === 204) {
        mostrarVehiculoSinRegistro();
        return;
      }

      throw new Error("No se pudo obtener el vehículo del usuario");
    }

    // Si el servidor devolvió 204 (No Content) la propiedad ok sería true
    // (status 204) pero no hay cuerpo para parsear. Comprobamos y evitamos
    // intentar parsear JSON vacío.
    if (respuesta.status === 204) {
      mostrarVehiculoSinRegistro();
      return;
    }

    const vehiculo = await respuesta.json();

    actualizarSeccionVehiculo(normalizarVehiculo(vehiculo));

    // Actualizamos la UI según el estado (las acciones seguirán bloqueadas
    // hasta que el vehículo tenga un ingreso registrado en una cochera).
    actualizarBloqueosSegunEstado();

    // Actualizamos copia local
    guardarVehiculoEnLocalStorage(vehiculo);
  } catch (error) {
    console.error("Error al cargar vehículo:", error);
  }
}

// COCHERAS

function inicializarBotonCocheras() {
  const botonAbrir = document.getElementById("ver-cocheras");

  if (botonAbrir) {
    botonAbrir.addEventListener("click", cargarCocheras);
  }
}

async function cargarCocheras() {
  const contenedor = document.getElementById("contenedor-cocheras");

  try {
    const respuesta = await fetch(`${API_URL}/cocheras`);

    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las cocheras");
    }

    const cocheras = await respuesta.json();

    contenedor.innerHTML = "";

    cocheras.forEach((cochera) => {
      const tarjeta = document.createElement("div");

      tarjeta.classList.add("cochera");

      tarjeta.dataset.estado = cochera.libre;

      // Determinar si el objeto cochera trae información de registro/fecha_egreso
      const fechaEgresoIso =
        cochera.fecha_egreso ||
        (cochera.registro && cochera.registro.fecha_egreso);

      const fechaEgresoHtml = fechaEgresoIso
        ? `<div class="cochera-egreso">Egreso: ${formatFecha(fechaEgresoIso)}</div>`
        : "";

      tarjeta.innerHTML = `
        <strong>${cochera.numero}</strong>

        <i class="fas fa-car"></i>

        <span>
          ${cochera.libre ? "Libre" : "Ocupada"}
        </span>
        ${fechaEgresoHtml}
      `;

      // Solo permitimos seleccionar cocheras libres y sólo si el vehículo
      // NO está ya asignado a otra cochera (bloqueo desde frontend)
      if (cochera.libre) {
        if (!vehiculoEnCochera) {
          tarjeta.addEventListener("click", () => {
            abrirModalRegistroCochera(cochera);
          });
        } else {
          // visualmente marcamos que no es seleccionable cuando ya hay un ingreso activo
          tarjeta.classList.add("no-seleccionable");
          tarjeta.title = "El vehículo ya está asignado a una cochera";
        }
      }

      contenedor.appendChild(tarjeta);
    });
  } catch (error) {
    console.error("Error al cargar cocheras:", error);

    contenedor.innerHTML = `
      <p class="mensaje-error">
        No se pudieron cargar las cocheras.
      </p>
    `;
  }
}

function abrirModalRegistroCochera(cochera) {
  if (!vehiculoId) {
    alert("No hay un vehículo registrado para asignar a la cochera.");
    return;
  }

  // Evitar abrir el modal si el vehículo ya tiene un ingreso activo
  if (vehiculoEnCochera) {
    alert(
      "El vehículo ya está asignado a una cochera. No puede seleccionar otra.",
    );
    return;
  }

  const modal = document.getElementById("modal-registro-cochera");
  if (!modal) return;

  document.getElementById("registro-numero-cochera").textContent =
    cochera.numero;

  document.getElementById("registro-fecha-ingreso").value = "";

  // Si el objeto cochera trae una fecha de egreso conocida, la mostramos
  const fechaEgresoIso =
    cochera.fecha_egreso || (cochera.registro && cochera.registro.fecha_egreso);

  document.getElementById("registro-fecha-egreso").value = fechaEgresoIso
    ? isoToInputValue(fechaEgresoIso)
    : "";

  const btnConfirmar = document.getElementById("confirmar-registro-cochera");
  btnConfirmar.dataset.cocheraId = cochera.id;
  modal.classList.add("is-active");
}

// REGISTRO DE INGRESO

async function registrarIngresoCochera() {
  const btnConfirmar = document.getElementById("confirmar-registro-cochera");
  const cocheraId = btnConfirmar.dataset.cocheraId;

  const inputEgreso = document.getElementById("registro-fecha-egreso").value;

  // Lógica de la fecha de egreso (Optativo)
  let fechaEgreso = null;
  if (inputEgreso) {
    fechaEgreso = new Date(inputEgreso).toISOString();
  }

  const datosRegistro = {
    cochera_id: cocheraId,
    vehiculo_id: vehiculoId,
    fechaEgreso: fechaEgreso,
  };

  try {
    // Hacemos el POST al endpoint de registros para asignar la cochera al vehículo
    const respuesta = await fetch(`${API_URL}/registros/ingreso`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(datosRegistro),
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || "Error al registrar");
    }

    // Cerramos el modal en caso de éxito
    document
      .getElementById("modal-registro-cochera")
      .classList.remove("is-active");

    // Volvemos a cargar las cocheras para que la pantalla se actualice y esta aparezca "Ocupada"
    await cargarCocheras();
    // Actualizamos la UI de cochera actual desde los registros y bloqueos
    await actualizarCocheraActual();
  } catch (error) {
    console.error("Error al registrar el ingreso:", error);
    alert("Hubo un problema al registrar la cochera.");
  }
}

// BLOQUEO DE ACCIONES Y SERVICIOS

function inicializarBloqueoAccionesRapidas() {
  const menuAcciones = document.getElementById("contenedor-acciones-rapidas");

  if (!menuAcciones) return;

  menuAcciones.addEventListener(
    "click",
    (e) => {
      // Si el vehículo no está dentro (no hay ingreso registrado), bloqueamos
      // todas las acciones excepto "ver-cocheras"
      const boton = e.target.closest("button");
      const esVerCocheras = boton && boton.id === "ver-cocheras";
      // Si no hay ningún vehículo agregado, también bloqueamos 'ver-cocheras'.
      const hayVehiculo = Boolean(vehiculoId);

      // Permitimos 'ver-cocheras' sólo si hay vehículo (aunque no esté en cochera).
      const permitirVerCocheras = esVerCocheras && hayVehiculo;

      if (!vehiculoEnCochera && !permitirVerCocheras) {
        e.preventDefault();
        e.stopPropagation();
        alert(
          "Las acciones están bloqueadas hasta que el vehículo se guarde en una cochera.",
        );
      }
    },
    true,
  );
}

function inicializarBloqueoServicios() {
  const contenedorServicios = document.getElementById("seccion-servicios");

  if (!contenedorServicios) return;

  contenedorServicios.addEventListener(
    "click",
    (e) => {
      const boton = e.target.closest("button");
      if (!boton) return;

      // Si el vehículo no está dentro (no hay ingreso registrado), bloqueamos
      // todas las acciones de servicios.
      if (!vehiculoEnCochera) {
        e.preventDefault();
        e.stopPropagation();
        alert(
          "Los servicios están bloqueados hasta que el vehículo se guarde en una cochera.",
        );
      }
    },
    true,
  );
}

// Cuando el usuario selecciona o cambia de vehículo:
function seleccionarVehiculo(id) {
  vehiculoId = id;
  localStorage.setItem("vehiculoSeleccionadoId", id); // <--- Guardar en storage
  verificarEstadoServiciosYBloquear();
}

async function actualizarBloqueoServiciosCliente() {
  if (!vehiculoId) return;

  try {
    const res = await fetch(`${API_URL}/servicios`, { credentials: "include" });
    if (!res.ok) return;

    const solicitudes = await res.json();

    // Obtener IDs de servicios activos para el vehículo actual (excluyendo cancelados)
    const serviciosActivosIds = solicitudes
      .filter(
        (s) =>
          Number(s.vehiculo_id) === Number(vehiculoId) &&
          s.estado !== "Cancelado",
      )
      .map((s) => Number(s.servicio_id));

    // Recorrer las tarjetas y bloquear/desbloquear
    document.querySelectorAll("[data-servicio-id]").forEach((tarjeta) => {
      const servicioId = Number(tarjeta.dataset.servicioId);
      const estaReservado = serviciosActivosIds.includes(servicioId);

      tarjeta.classList.toggle("servicio-reservado", estaReservado);

      const btn = tarjeta.querySelector("button");
      if (btn) {
        btn.disabled = estaReservado;
        if (estaReservado) btn.textContent = "Reservado";
      }
    });
  } catch (e) {
    console.warn("Error al verificar estado de servicios:", e);
  }
}

// Comprueba si existe un registro activo (sin fecha_egreso y no anulado) para el vehículo
async function verificarRegistroActivo(vehiculoId) {
  try {
    const respuesta = await fetch(`${API_URL}/registros`, {
      credentials: "include",
    });
    if (!respuesta.ok) return false;
    const registros = await respuesta.json();

    return registros.some(
      (r) =>
        (r.vehiculo_id === vehiculoId ||
          Number(r.vehiculo_id) === Number(vehiculoId)) &&
        !r.fecha_egreso &&
        !r.anulado,
    );
  } catch (e) {
    console.warn("No se pudo verificar registro activo:", e);
    return false;
  }
}

// Helper: formatea una ISO a una cadena legible (fecha y hora local)
function formatFecha(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso;
  }
}

// Helper: convierte ISO a valor para input datetime-local (YYYY-MM-DDTHH:MM)
function isoToInputValue(iso) {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 16);
  } catch (e) {
    return "";
  }
}

// Obtiene el registro activo (objeto) para un vehículo, o null
async function obtenerRegistroActivoObjeto(vehiculoId) {
  try {
    const respuesta = await fetch(`${API_URL}/registros`, {
      credentials: "include",
    });
    if (!respuesta.ok) return null;
    const registros = await respuesta.json();

    return (
      registros.find(
        (r) =>
          (r.vehiculo_id === vehiculoId ||
            Number(r.vehiculo_id) === Number(vehiculoId)) &&
          !r.fecha_egreso &&
          !r.anulado,
      ) || null
    );
  } catch (e) {
    console.warn("No se pudo obtener registro activo:", e);
    return null;
  }
}

// Obtiene cochera por id
async function obtenerCocheraPorId(id) {
  try {
    const respuesta = await fetch(`${API_URL}/cocheras/${id}`);
    if (!respuesta.ok) return null;
    return await respuesta.json();
  } catch (e) {
    console.warn("No se pudo obtener cochera:", e);
    return null;
  }
}

// Actualiza la sección visual que muestra en qué cochera está el vehículo
async function actualizarCocheraActual() {
  const cont = document.getElementById("cochera-actual");
  const numeroElem = document.getElementById("cochera-actual-numero");
  const fechaElem = document.getElementById("cochera-actual-fecha");

  if (!cont || !numeroElem || !fechaElem) return;

  if (!vehiculoId) {
    cont.classList.add("is-hidden");
    vehiculoEnCochera = false;
    return;
  }

  const registro = await obtenerRegistroActivoObjeto(vehiculoId);

  if (!registro) {
    // No hay registro activo
    cont.classList.add("is-hidden");
    vehiculoEnCochera = false;
    actualizarBloqueosSegunEstado();
    return;
  }

  // Hay un registro activo: mostramos la cochera
  let cochera = null;
  if (registro.cochera_id) {
    cochera = await obtenerCocheraPorId(registro.cochera_id);
  }

  const numero = cochera?.numero || registro.cochera_id || "--";
  numeroElem.textContent = numero;

  // Mostrar fecha de ingreso si viene
  fechaElem.textContent = registro.fecha_ingreso
    ? `Ingreso: ${formatFecha(registro.fecha_ingreso)}`
    : "";

  cont.classList.remove("is-hidden");
  vehiculoEnCochera = true;
  actualizarBloqueosSegunEstado();
}

// Actualiza el estado visual y habilitación de botones según si el vehículo está en cochera
function actualizarBloqueosSegunEstado() {
  const contAcciones = document.getElementById("contenedor-acciones-rapidas");
  const contServicios = document.getElementById("seccion-servicios");

  if (contAcciones) {
    if (vehiculoEnCochera) contAcciones.classList.remove("menu-bloqueado");
    else contAcciones.classList.add("menu-bloqueado");
  }

  if (contAcciones) {
    const botones = contAcciones.querySelectorAll("button");
    botones.forEach((btn) => {
      if (btn.id === "ver-cocheras") {
        const habilitado = Boolean(vehiculoId);
        btn.disabled = !habilitado;
        btn.classList.toggle("inactivo", !habilitado);
        return;
      }
      btn.disabled = !vehiculoEnCochera;
      btn.classList.toggle("inactivo", !vehiculoEnCochera);
    });
  }
}

// Funciones simples para controlar la visibilidad
function abrirModalLavado() {
  const modal = document.getElementById("modal-lavado");
  if (modal) modal.classList.add("is-active");
}

function cerrarModalLavado() {
  const modal = document.getElementById("modal-lavado");
  if (modal) modal.classList.remove("is-active");
}

function inicializarModalLavado() {
  const btnAbrir = document.getElementById("reservar-lavado");
  const btnCerrar = document.getElementById("cerrar-modal-lavado");
  const btnCancelar = document.getElementById("cancelar-lavado");
  const btnConfirmar = document.getElementById("confirmar-lavado");

  btnAbrir?.addEventListener("click", () => {
    if (!vehiculoId) {
      alert("Debes seleccionar un vehículo primero.");
      return;
    }
    abrirModalLavado();
  });

  btnCerrar?.addEventListener("click", cerrarModalLavado);
  btnCancelar?.addEventListener("click", cerrarModalLavado);

  btnConfirmar?.addEventListener("click", async () => {
    if (!vehiculoId) return;

    // Tomamos el precio del objeto global
    const precioFinal = catalogoPrecios[LAVADO_SERVICIO_ID] || 2500;

    const datosReserva = {
      servicio_id: LAVADO_SERVICIO_ID,
      vehiculo_id: vehiculoId,
      precio_final: precioFinal,
    };

    try {
      const res = await fetch(`${API_URL}/servicios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosReserva),
        credentials: "include",
      });

      if (res.ok) {
        alert("¡Reserva de lavado realizada con éxito!");
        verificarEstadoServiciosYBloquear();
        cerrarModalLavado();

        if (typeof actualizarEstadoServiciosDisponibles === "function") {
          await actualizarEstadoServiciosDisponibles();
        }
      } else {
        const err = await res.json();
        const mensajeError = Array.isArray(err)
          ? err[0]?.msg
          : err.mensaje || "Error al procesar la reserva";
        alert(`Error al reservar: ${mensajeError}`);
      }
    } catch (error) {
      console.error("Error al procesar la reserva de lavado:", error);
    }
  });
}

async function cargarCatalogoServicios() {
  try {
    const res = await fetch(`${API_URL}/catalogo`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      const lista = Array.isArray(data) ? data : [data];

      // Guardamos en el objeto global
      lista.forEach((serv) => {
        const id = serv.id ?? serv.servicio_id;
        const precio =
          serv.precio_base ?? serv.precio ?? serv.precio_final ?? 0;
        catalogoPrecios[id] = Number(precio);
      });

      // Tomamos el precio del lavado o 2500 por defecto
      const precioLavado = catalogoPrecios[LAVADO_SERVICIO_ID] || 2500;
      const precioFormateado = `$${precioLavado.toLocaleString("es-AR")}`;

      // Tomamos el precio del valet o 5000 por defecto
      const precioValet = catalogoPrecios[VALET_SERVICIO_ID] || 5000;
      const precioValetFormateado = `$${precioValet.toLocaleString("es-AR")}`;

      // Actualizamos el precio en "Ver lavado" (Tarjeta/Modal principal)
      const elemVer = document.getElementById("precio-ver-lavado");
      if (elemVer) elemVer.textContent = precioFormateado;

      // Actualizamos el precio en "Ver valet" (Tarjeta/Modal principal)
      const elemVerValet = document.getElementById("precio-ver-valet");
      if (elemVerValet) elemVerValet.textContent = precioValetFormateado;

      // Actualizamos el precio en "Reservar lavado" (Modal de confirmación)
      const elemReservar = document.getElementById("precio-reservar-lavado");
      if (elemReservar) elemReservar.textContent = precioFormateado;

      // Actualizamos el precio en "Reservar valet" (Modal de confirmación)
      const elemReservarValet = document.getElementById(
        "precio-reservar-valet",
      );
      if (elemReservarValet)
        elemReservarValet.textContent = precioValetFormateado;
    }
  } catch (e) {
    console.warn("Error al cargar catálogo de servicios:", e);
  }
}

// VER LAVADO

async function abrirModalVerLavado() {
  await cargarDatosModalVerLavado();
  const modal = document.getElementById("modal-ver-lavado");
  if (modal) modal.classList.add("is-active");
}

function cerrarModalVerLavado() {
  const modal = document.getElementById("modal-ver-lavado");
  if (modal) modal.classList.remove("is-active");
}

function inicializarModalVerLavado() {
  const btnAbrir = document.getElementById("btn-ver-lavado");

  // Buscar botones de cierre dentro del mismo modal
  const modal = document.getElementById("modal-ver-lavado");
  const btnCerrar = modal?.querySelector(".delete, #cerrar-modal-ver-lavado");
  const btnFondo = modal?.querySelector(".modal-background");
  const btnCancelar = modal?.querySelector(".btn-modal-cancelar");

  // Evento para abrir
  btnAbrir?.addEventListener("click", abrirModalVerLavado);

  // Eventos para cerrar
  btnCerrar?.addEventListener("click", cerrarModalVerLavado);
  btnFondo?.addEventListener("click", cerrarModalVerLavado);
  btnCancelar?.addEventListener("click", cerrarModalVerLavado);
}

async function cargarDatosModalVerLavado() {
  if (!vehiculoId) return;

  try {
    const res = await fetch(`${API_URL}/servicios`, { credentials: "include" });
    if (!res.ok) return;

    const data = await res.json();
    const lista = Array.isArray(data) ? data : [];

    // 1. Buscamos el servicio usando exactamente las columnas de la BD
    const reserva = lista.find((s) => {
      return (
        Number(s.vehiculo_id) === Number(vehiculoId) &&
        Number(s.servicio_id) === LAVADO_SERVICIO_ID &&
        s.estado !== "Cancelado"
      );
    });

    if (!reserva) return;

    // 2. ESTADO Y DESCRIPCIÓN (columna: estado)
    const estadoTxt = reserva.estado || "En Espera";
    const elemEstado = document.getElementById("estado-lavado");
    const elemDesc = document.getElementById("descripcion-estado-lavado");

    if (elemEstado) elemEstado.textContent = estadoTxt;
    if (elemDesc) {
      const estLower = estadoTxt.toLowerCase();
      if (estLower === "en espera") {
        elemDesc.textContent =
          "Tu solicitud de lavado fue recibida y está en espera.";
      } else if (estLower === "en proceso") {
        elemDesc.textContent =
          "Tu vehículo se encuentra siendo lavado en este momento.";
      } else {
        elemDesc.textContent = `Estado actual: ${estadoTxt}`;
      }
    }

    // 3. DATOS DEL VEHÍCULO (extraido de los elementos del HTML)
    const vehiculoTexto =
      document.getElementById("modelo-vehiculo")?.textContent ||
      document.getElementById("nombre-vehiculo")?.textContent ||
      "Vehículo seleccionado";

    const patenteTexto =
      document.getElementById("patente-actual")?.textContent ||
      document.getElementById("patente-vehiculo")?.textContent ||
      "---";

    const elemVehiculo = document.getElementById("lavado-vehiculo");
    const elemPatente = document.getElementById("lavado-patente");

    if (elemVehiculo) elemVehiculo.textContent = vehiculoTexto;
    if (elemPatente) elemPatente.textContent = patenteTexto;

    // 4. DATOS DEL SERVICIO (columnas: fecha_solicitud y precio_final)
    const elemFecha = document.getElementById("lavado-fecha");
    const elemPrecio = document.getElementById("lavado-precio");

    if (elemFecha && reserva.fecha_solicitud) {
      const f = new Date(reserva.fecha_solicitud);
      elemFecha.textContent = `${f.toLocaleDateString("es-AR")} · ${f.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`;
    }

    if (elemPrecio) {
      const precio =
        reserva.precio_final ?? catalogoPrecios[LAVADO_SERVICIO_ID] ?? 2500;
      elemPrecio.textContent = `$${Number(precio).toLocaleString("es-AR")}`;
    }
  } catch (error) {
    console.error("Error al cargar datos en modal ver lavado:", error);
  }
}
// VALET

function abrirModalValet() {
  const modal = document.getElementById("modal-valet");
  if (modal) modal.classList.add("is-active");
}

function cerrarModalValet() {
  const modal = document.getElementById("modal-valet");
  if (modal) modal.classList.remove("is-active");
}

function inicializarModalValet() {
  const btnAbrir = document.getElementById("solicitar-valet");
  const btnCerrar = document.getElementById("cerrar-modal-valet");
  const btnCancelar = document.getElementById("cancelar-valet");
  const btnConfirmar = document.getElementById("confirmar-valet");
  const inputDireccion = document.getElementById("ubicacion-valet");

  btnAbrir?.addEventListener("click", () => {
    if (!vehiculoId) {
      alert("Debes seleccionar un vehículo primero.");
      return;
    }
    abrirModalValet();
  });

  btnCerrar?.addEventListener("click", cerrarModalValet);
  btnCancelar?.addEventListener("click", cerrarModalValet);

  btnConfirmar?.addEventListener("click", async () => {
    if (!vehiculoId) return;

    // Capturamos la dirección ingresada en el modal (si aplica)
    const direccion = inputDireccion?.value?.trim() || "";

    if (!direccion) {
      alert("Por favor, ingresa una dirección de entrega.");
      return;
    }

    // Tomamos el precio del catálogo o fallback a 5000
    const precioFinal = catalogoPrecios[VALET_SERVICIO_ID] || 5000;

    const datosReserva = {
      servicio_id: VALET_SERVICIO_ID,
      vehiculo_id: vehiculoId,
      usuario_valet_id: window.usuarioLogueadoId,
      direccion_entrega: direccion,
      precio_final: precioFinal,
    };

    try {
      const res = await fetch(`${API_URL}/servicios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosReserva),
        credentials: "include",
      });

      if (res.ok) {
        alert("¡Solicitud de Valet realizada con éxito!");
        if (inputDireccion) inputDireccion.value = ""; // Limpia el input
        verificarEstadoServiciosYBloquear();
        cerrarModalValet();

        if (typeof actualizarEstadoServiciosDisponibles === "function") {
          await actualizarEstadoServiciosDisponibles();
        }
      } else {
        const err = await res.json();
        const mensajeError = Array.isArray(err)
          ? err[0]?.msg
          : err.mensaje || "Error al procesar la solicitud";
        alert(`Error al solicitar valet: ${mensajeError}`);
      }
    } catch (error) {
      console.error("Error al procesar la reserva de valet:", error);
    }
  });
}

// VER VALET
async function abrirModalVerValet() {
  await cargarDatosModalVerValet();
  const modal = document.getElementById("modal-ver-valet");
  if (modal) modal.classList.add("is-active");
}

function cerrarModalVerValet() {
  const modal = document.getElementById("modal-ver-valet");
  if (modal) modal.classList.remove("is-active");
}

function inicializarModalVerValet() {
  const btnAbrir = document.getElementById("btn-ver-valet");

  // Buscar botones de cierre dentro del mismo modal
  const modal = document.getElementById("modal-ver-valet");
  const btnCerrar = modal?.querySelector(".delete, #cerrar-modal-ver-valet");
  const btnFondo = modal?.querySelector(".modal-background");
  const btnCancelar = modal?.querySelector(".btn-modal-cancelar");

  // Evento para abrir
  btnAbrir?.addEventListener("click", abrirModalVerValet);

  // Eventos para cerrar
  btnCerrar?.addEventListener("click", cerrarModalVerValet);
  btnFondo?.addEventListener("click", cerrarModalVerValet);
  btnCancelar?.addEventListener("click", cerrarModalVerValet);
}

async function cargarDatosModalVerValet() {
  if (!vehiculoId) return;

  try {
    const res = await fetch(`${API_URL}/servicios`, { credentials: "include" });
    if (!res.ok) return;

    const data = await res.json();
    const lista = Array.isArray(data) ? data : [];

    // 1. Buscamos el servicio activo de Valet para este vehículo
    const reserva = lista.find((s) => {
      return (
        Number(s.vehiculo_id) === Number(vehiculoId) &&
        Number(s.servicio_id) === VALET_SERVICIO_ID &&
        s.estado !== "Cancelado"
      );
    });

    if (!reserva) return;

    // 2. ESTADO Y DESCRIPCIÓN
    const estadoTxt = reserva.estado || "En Espera";
    const elemEstado = document.getElementById("estado-valet");
    const elemDesc = document.getElementById("descripcion-estado-valet");

    if (elemEstado) elemEstado.textContent = estadoTxt;
    if (elemDesc) {
      const estLower = estadoTxt.toLowerCase();
      if (estLower === "en espera") {
        elemDesc.textContent =
          "Tu solicitud de valet fue recibida y está en espera.";
      } else if (estLower === "en proceso" || estLower === "en camino") {
        elemDesc.textContent = "Tu vehículo está siendo trasladado.";
      } else if (estLower === "finalizado") {
        elemDesc.textContent = "El servicio de traslado fue completado.";
      } else {
        elemDesc.textContent = `Estado actual: ${estadoTxt}`;
      }
    }

    // 3. DATOS DEL VEHÍCULO Y DESTINO
    const m = document.getElementById("marca-vehiculo")?.textContent || "";
    const mod =
      document.getElementById("modelo-vehiculo-2")?.textContent ||
      document.getElementById("modelo-vehiculo")?.textContent ||
      "";
    const pat =
      document.getElementById("patente-vehiculo")?.textContent ||
      document.getElementById("patente-actual")?.textContent ||
      "---";

    const elemVehiculo = document.getElementById("valet-vehiculo");
    const elemPatente = document.getElementById("valet-patente");
    const elemDestino = document.getElementById("valet-destino");

    if (elemVehiculo)
      elemVehiculo.textContent =
        `${m} ${mod}`.trim() || "Vehículo seleccionado";
    if (elemPatente) elemPatente.textContent = pat;
    if (elemDestino)
      elemDestino.textContent =
        reserva.direccion_entrega || "Sin dirección registrada";

    // --- DENTRO DE cargarDatosModalVerValet ---

    const elemLabelMonto = document.getElementById("valet-monto-label");
    const elemSubtituloMonto = document.getElementById("valet-monto-subtitulo");
    const elemPrecio = document.getElementById("valet-precio");

    // En la vista del cliente que solicita el servicio, SIEMPRE se muestra como Precio
    if (elemLabelMonto) {
      elemLabelMonto.textContent = "Precio";
    }

    if (elemSubtituloMonto) {
      elemSubtituloMonto.textContent = "Por el servicio de traslado";
    }

    if (elemPrecio) {
      const precio = reserva
        ? (reserva.precio_final ?? catalogoPrecios[VALET_SERVICIO_ID] ?? 5000)
        : 0;

      elemPrecio.textContent = `$${Number(precio).toLocaleString("es-AR")}`;
    }
  } catch (error) {
    console.error("Error al cargar datos en modal ver valet:", error);
  }
}

function actualizarEstadoBotonesAccion(hayServicioEnCurso) {
  // Seleccionamos todos los botones de acción rápida (por clase o ID)
  const botones = document.querySelectorAll(
    ".btn-accion-rapida, #solicitar-valet, #reservar-lavado",
  );

  botones.forEach((btn) => {
    btn.disabled = hayServicioEnCurso;

    if (hayServicioEnCurso) {
      btn.classList.add("disabled", "is-disabled");
    } else {
      btn.classList.remove("disabled", "is-disabled");
      btn.removeAttribute("title");
    }
  });
}

async function verificarEstadoServiciosYBloquear() {
  if (!vehiculoId) return;

  try {
    const res = await fetch(`${API_URL}/servicios`, { credentials: "include" });
    if (!res.ok) return;

    const data = await res.json();
    const lista = Array.isArray(data) ? data : [];

    // Buscamos si existe CUALQUIER servicio activo para este auto
    const servicioEnCurso = lista.find((s) => {
      const mismoVehiculo = Number(s.vehiculo_id) === Number(vehiculoId);

      // Normalizamos el string limpiando espacios y pasándolo a minúsculas
      const estadoLimpio = String(s.estado || "")
        .trim()
        .toLowerCase();

      // Si NO es ni finalizado ni cancelado, el servicio sigue activo
      const estaActivo =
        estadoLimpio !== "finalizado" && estadoLimpio !== "cancelado";

      return mismoVehiculo && estaActivo;
    });

    // Pasamos true si hay un servicio en curso (bloquea), o false si está todo libre (desbloquea)
    actualizarEstadoBotonesAccion(Boolean(servicioEnCurso));
  } catch (error) {
    console.error("Error al verificar estado de botones:", error);
  }
}
