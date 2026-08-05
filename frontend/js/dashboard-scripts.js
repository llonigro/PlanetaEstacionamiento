// VARIABLES GLOBALES
let vehiculoId = null; // id del vehículo del usuario en sesión
let vehiculoEnCochera = false; // true cuando el vehículo tiene un registro de ingreso activo
let vehiculoOriginal = null;
let modoVehiculoFormulario = "editar";
// Estado de confirmaciones de servicios
let serviciosConfirmados = {
  lavado: false,
  valet: false,
};

const API_URL = "http://localhost:3000";
const CAMPOS_VEHICULO = ["marca", "modelo", "color", "patente"];

// INICIALIZACIÓN

document.addEventListener("DOMContentLoaded", async () => {
  await obtenerDatosUsuarioActual();

  inicializarModales();
  inicializarBloqueoAccionesRapidas();
  inicializarBloqueoServicios();
  inicializarBotonCerrarSesion();

  // Mostrar datos guardados localmente de forma instantánea
  cargarVehiculoDesdeLocalStorage();

  await cargarVehiculoUsuario();
  // Verificamos si el vehículo cargado tiene un registro activo (está dentro)
  if (vehiculoId) {
    const activo = await verificarRegistroActivo(vehiculoId);
    vehiculoEnCochera = activo;
  }

  actualizarBloqueosSegunEstado();

  // Event listener de guardar vehículo
  document
    .getElementById("btn-guardar-vehiculo")
    .addEventListener("click", guardarVehiculo);

  // Listeners de confirmación de servicios
  const btnConfirmarLavado = document.getElementById("confirmar-lavado");
  if (btnConfirmarLavado) {
    btnConfirmarLavado.addEventListener("click", () => {
      serviciosConfirmados.lavado = true;
      guardarServiciosConfirmadosEnLocalStorage();
      document.getElementById("modal-lavado").classList.remove("is-active");
      actualizarBloqueosSegunEstado();
    });
  }

  const btnConfirmarValet = document.getElementById("confirmar-valet");
  if (btnConfirmarValet) {
    btnConfirmarValet.addEventListener("click", () => {
      serviciosConfirmados.valet = true;
      guardarServiciosConfirmadosEnLocalStorage();
      document.getElementById("modal-valet").classList.remove("is-active");
      actualizarBloqueosSegunEstado();
    });
  }

  // Event listener de confirmar registro de cochera
  document
    .getElementById("confirmar-registro-cochera")
    .addEventListener("click", registrarIngresoCochera);

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

//async function cerrarSesion() {
//  try {
//    const respuesta = await fetch(`${API_URL}/logout`, {
//      method: "POST",
//      credentials: "include",
//    });
//
//    if (respuesta.ok) {
//      window.location.href = "inicio.html";
//    }
//  } catch (error) {
//    console.error("Error al cerrar sesión", error);
//  }
//}

// GESTIÓN DE MODALES

function inicializarModales() {
  // Botones que abren modales
  document.querySelectorAll("[data-modal]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const modalId = boton.dataset.modal;
      const modal = document.getElementById(modalId);

      if (!modal) return;

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

  document.getElementById("marca-vehiculo").textContent = vehiculo.marca;
  document.getElementById("modelo-vehiculo").textContent = vehiculo.modelo;
  document.getElementById("modelo-vehiculo-2").textContent = vehiculo.modelo;
  document.getElementById("color-vehiculo").textContent = vehiculo.color;
  document.getElementById("patente-vehiculo").textContent = vehiculo.patente;
  document.getElementById("permitir-valet-vehiculo").textContent =
    vehiculo.permitir_valet ? "Sí" : "No";

  guardarVehiculoEnLocalStorage(normalizarVehiculo(vehiculo));
}

function mostrarVehiculoSinRegistro() {
  vehiculoId = null;
  vehiculoOriginal = null;
  vehiculoEnCochera = false;
  serviciosConfirmados = {
    lavado: false,
    valet: false,
  };

  const seccionVehiculo = document.querySelector(".seccion-vehiculo");
  if (seccionVehiculo) {
    seccionVehiculo.classList.add("vehiculo-sin-registro");
  }

  document.getElementById("marca-vehiculo").textContent = "[Marca]";
  document.getElementById("modelo-vehiculo").textContent =
    "[Nombre del vehículo]";
  document.getElementById("modelo-vehiculo-2").textContent = "[Modelo]";
  document.getElementById("color-vehiculo").textContent = "[Color]";
  document.getElementById("patente-vehiculo").textContent = "[ABC123]";
  document.getElementById("permitir-valet-vehiculo").textContent = "[Sí/No]";

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

    // No desmontamos el bloqueo del contenedor aquí: el bloqueo depende
    // de si el vehículo está realmente dentro de una cochera (vehiculoEnCochera).

    // Cargamos el estado de confirmaciones de servicios
    cargarServiciosConfirmadosDesdeLocalStorage();

    return true;
  } catch (e) {
    console.warn("Error al cargar vehiculo desde localStorage:", e);
    return false;
  }
}

function limpiarVehiculoLocalStorage() {
  try {
    localStorage.removeItem("vehiculo_datos");
    localStorage.removeItem("servicios_confirmados");
  } catch (e) {
    console.warn("No se pudo limpiar localStorage:", e);
  }
}

function guardarServiciosConfirmadosEnLocalStorage() {
  try {
    localStorage.setItem(
      "servicios_confirmados",
      JSON.stringify(serviciosConfirmados),
    );
  } catch (e) {
    console.warn("No se pudo guardar servicios_confirmados:", e);
  }
}

function cargarServiciosConfirmadosDesdeLocalStorage() {
  try {
    const raw = localStorage.getItem("servicios_confirmados");
    if (!raw) return false;
    const datos = JSON.parse(raw);
    if (!datos) return false;
    serviciosConfirmados = Object.assign(serviciosConfirmados, datos);
    return true;
  } catch (e) {
    console.warn("Error al cargar servicios_confirmados:", e);
    return false;
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

    if (!esEdicion) {
      vehiculoEnCochera = false;
      serviciosConfirmados = {
        lavado: false,
        valet: false,
      };
      guardarServiciosConfirmadosEnLocalStorage();
    }

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

    if (!respuesta.ok) {
      if (respuesta.status === 404) {
        mostrarVehiculoSinRegistro();
        return;
      }

      throw new Error("No se pudo obtener el vehículo del usuario");
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

      tarjeta.innerHTML = `
        <strong>${cochera.numero}</strong>

        <i class="fas fa-car"></i>

        <span>
          ${cochera.libre ? "Libre" : "Ocupada"}
        </span>
      `;

      // Solo permitimos seleccionar cocheras libres
      if (cochera.libre) {
        tarjeta.addEventListener("click", () => {
          abrirModalRegistroCochera(cochera);
        });
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

  const modal = document.getElementById("modal-registro-cochera");
  if (!modal) return;

  document.getElementById("registro-numero-cochera").textContent =
    cochera.numero;

  document.getElementById("registro-fecha-ingreso").value = "";
  document.getElementById("registro-fecha-egreso").value = "";

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
    // Marcar que ahora el vehículo está en cochera y actualizar bloqueos
    vehiculoEnCochera = true;
    actualizarBloqueosSegunEstado();
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
      if (!vehiculoEnCochera && !esVerCocheras) {
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
  const seccionServicios = document.querySelector(".contenedor-tarjetas");

  if (!seccionServicios) return;

  seccionServicios.addEventListener(
    "click",
    (e) => {
      const tarjeta = e.target.closest(".servicios-tarjetas");
      if (!tarjeta) return;

      // Si el vehículo no está dentro, bloqueamos el acceso a servicios
      if (!vehiculoEnCochera) {
        e.preventDefault();
        e.stopPropagation();
        alert(
          "Los servicios están bloqueados hasta que el vehículo se guarde en una cochera.",
        );
        return;
      }

      // Verificamos si la tarjeta clickeada está inactiva
      const estaActivo = tarjeta.dataset.activo === "true";
      if (!estaActivo) {
        e.preventDefault();
        e.stopPropagation();
        alert("Este servicio no se encuentra activo en este momento.");
        return;
      }

      // Verificamos si la acción fue confirmada desde los botones (lavado/valet)
      const modalRef = tarjeta.dataset.modal || "";
      let clave = null;
      if (modalRef.includes("lavado")) clave = "lavado";
      else if (modalRef.includes("valet")) clave = "valet";

      if (clave && !serviciosConfirmados[clave]) {
        e.preventDefault();
        e.stopPropagation();
        const texto =
          clave === "lavado" ? "Reservar lavado" : "Solicitar valet";
        alert(
          `Debes confirmar la acción desde el botón '${texto}' antes de usar este servicio.`,
        );
      }
    },
    true,
  );
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

// Actualiza el estado visual y habilitación de botones según si el vehículo está en cochera
function actualizarBloqueosSegunEstado() {
  const contAcciones = document.getElementById("contenedor-acciones-rapidas");
  // Actualizamos la clase del contenedor según si el vehículo está dentro de una cochera
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

  const contServ = document.querySelector(".contenedor-tarjetas");
  if (contServ) {
    const tarjetas = contServ.querySelectorAll(".servicios-tarjetas");
    tarjetas.forEach((tarjeta) => {
      const boton = tarjeta.querySelector(".btn-accion-servicio");
      const tarjetaActiva = tarjeta.dataset.activo === "true";

      if (boton) {
        // Determinar clave de servicio (lavado / valet) por el modal o clase
        const modalRef = tarjeta.dataset.modal || "";
        let clave = null;
        if (modalRef.includes("lavado")) clave = "lavado";
        else if (modalRef.includes("valet")) clave = "valet";

        const confirmado = clave ? !!serviciosConfirmados[clave] : true;

        // Habilitamos solo si el vehículo está en cochera, la tarjeta es activa
        // y la acción correspondiente fue previamente confirmada
        const habilitado = vehiculoEnCochera && tarjetaActiva && confirmado;
        boton.disabled = !habilitado;
        tarjeta.classList.toggle("servicio-bloqueado", !habilitado);
      }
    });
  }
}
