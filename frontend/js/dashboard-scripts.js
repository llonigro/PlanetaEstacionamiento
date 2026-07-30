// SECCIONES DEL DASHBOARD
function mostrarSeccion(seccionId) {
  const secciones = document.querySelectorAll(".dashboard-section");

  secciones.forEach((seccion) => {
    seccion.classList.add("is-hidden");
  });

  const seccionMostrar = document.getElementById(seccionId);
  if (seccionMostrar) {
    seccionMostrar.classList.remove("is-hidden");
  }
}

// Script para manejar la barra de progreso de los servicios en el dashboard
//
// Estados posibles del servicio de lavado
const ordenEstados = ["espera", "lavando", "listo"];

const progreso = {
  espera: "0%",
  lavando: "50%",
  listo: "100%",
};

const mensajesEstado = {
  espera: "En espera",
  lavando: "Lavando",
  listo: "Listo",
};

// LAVADO

function actualizarEstadoLavado(estado) {
  const tarjeta = document.querySelector(
    '.servicios-tarjetas[data-servicio="lavado"]',
  );

  if (!tarjeta) return;

  const barra = tarjeta.querySelector(".barra-progreso");
  const mensaje = tarjeta.querySelector(".mensaje-servicio");
  const pasos = tarjeta.querySelectorAll(".paso");
  const lineaActiva = tarjeta.querySelector(".linea-activa");
  const estadoTexto = tarjeta.querySelector(".estado-texto");

  // Limpiamos estados anteriores
  pasos.forEach((paso) => {
    paso.classList.remove("activo");
  });

  // Si no hay servicio
  if (estado === "sin-servicio") {
    barra.style.display = "none";
    mensaje.style.display = "block";
    estadoTexto.textContent = "Sin servicio";

    return;
  }

  // Hay un servicio activo
  barra.style.display = "block";
  mensaje.style.display = "none";

  // Actualizamos el texto y la barra
  estadoTexto.textContent = mensajesEstado[estado];
  lineaActiva.style.width = progreso[estado];

  // Buscamos la posición del estado actual
  const posicionActual = ordenEstados.indexOf(estado);

  pasos.forEach((paso) => {
    const estadoPaso = paso.dataset.paso;
    const posicionPaso = ordenEstados.indexOf(estadoPaso);

    if (posicionPaso <= posicionActual) {
      paso.classList.add("activo");
    }
  });
}

async function cargarEstadoLavado() {
  try {
    const respuesta = await fetch("http://localhost:3000/servicios");

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el estado del lavado");
    }

    const datos = await respuesta.json();

    actualizarEstadoLavado(datos.estado);
  } catch (error) {
    console.error("Error al cargar el estado del lavado:", error);
  }
}

// MODALES

function inicializarModales() {
  // Botones que abren modales
  document.querySelectorAll("[data-modal]").forEach((boton) => {
    const modalId = boton.dataset.modal;
    const modal = document.getElementById(modalId);

    if (!modal) return;

    boton.addEventListener("click", () => {
      if (modal.id === "modal-vehiculo") {
        cargarDatosVehiculo();
      }

      modal.classList.add("is-active");
    });

    // Botón X
    const botonCerrar = modal.querySelector(".delete");

    if (botonCerrar) {
      botonCerrar.addEventListener("click", () => {
        modal.classList.remove("is-active");
      });
    }

    // Botón Cancelar
    const botonCancelar = modal.querySelector(".btn-modal-cancelar");

    if (botonCancelar) {
      botonCancelar.addEventListener("click", () => {
        modal.classList.remove("is-active");
      });
    }

    // Fondo
    const fondo = modal.querySelector(".modal-background");

    if (fondo) {
      fondo.addEventListener("click", () => {
        modal.classList.remove("is-active");
      });
    }
  });
}

// VEHICULO

function cargarDatosVehiculo() {
  const campos = ["marca", "modelo", "año", "color", "patente"];

  campos.forEach((campo) => {
    const dato = document.getElementById(`${campo}-vehiculo`);
    const input = document.getElementById(`input-${campo}`);

    if (dato && input) {
      input.value = dato.textContent.trim();
    }
  });
}

function guardarVehiculo() {
  const campos = ["marca", "modelo", "año", "color", "patente"];

  campos.forEach((campo) => {
    const input = document.getElementById(`input-${campo}`);
    const dato = document.getElementById(`${campo}-vehiculo`);

    if (input && dato) {
      dato.textContent = input.value;
    }
  });

  const marca = document.getElementById("input-marca").value;
  const modelo = document.getElementById("input-modelo").value;

  document.getElementById("modelo-completo").textContent = `${marca} ${modelo}`;

  document.getElementById("modal-vehiculo").classList.remove("is-active");
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarModales();
  document
    .getElementById("guardar-vehiculo")
    .addEventListener("click", guardarVehiculo);
  cargarEstadoLavado();
});
