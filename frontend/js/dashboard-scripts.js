// Script para manejar la barra de progreso de los servicios en el dashboard
const tarjetas = document.querySelectorAll(".servicios-tarjetas");

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

// Iteramos sobre cada tarjeta de servicio para actualizar su barra de progreso y estado
tarjetas.forEach((tarjeta) => {
  const servicio = tarjeta.dataset.servicio;

  if (servicio !== "lavado") {
    return;
  }

  const estado = tarjeta.dataset.estado;

  const barra = tarjeta.querySelector(".barra-progreso");
  const mensaje = tarjeta.querySelector(".mensaje-servicio");
  const pasos = tarjeta.querySelectorAll(".paso");
  const lineaActiva = tarjeta.querySelector(".linea-activa");
  const estadoTexto = tarjeta.querySelector(".estado-texto");

  // Estado sin servicio
  if (estado === "sin-servicio") {
    barra.classList.remove("mostrar");
    mensaje.classList.add("mostrar");

    return;
  }

  // Si hay servicio ocultamos el mensaje y mostramos la barra de progreso
  barra.classList.add("mostrar");
  mensaje.classList.remove("mostrar");

  // Actualizamos la barra de progreso y el mensaje según el estado del servicio
  lineaActiva.style.width = progreso[estado];

  estadoTexto.textContent = mensajesEstado[estado];

  // Buscamos el estado actual
  const posicionActual = ordenEstados.indexOf(estado);

  pasos.forEach((paso) => {
    const estadoPaso = paso.dataset.paso;
    const posicionPaso = ordenEstados.indexOf(estadoPaso);

    // Si el paso es menor o igual al estado actual, lo marcamos como activo y actualizamos la barra de progreso
    if (posicionPaso <= posicionActual) {
      paso.classList.add("activo");
      barra.classList.add(estado);
    }
  });
});

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

function inicializarModalVehiculo() {
  const modal = document.getElementById("modal-vehiculo");
  const btnEditar = document.getElementById("btn-editar-vehiculo");
  const btnCerrar = document.getElementById("cerrar-modal-vehiculo");
  const btnGuardar = document.getElementById("btn-guardar-vehiculo");

  if (!modal || !btnEditar || !btnCerrar || !btnGuardar) {
    return;
  }

  btnEditar.addEventListener("click", abrirModalVehiculo);

  btnCerrar.addEventListener("click", cerrarModalVehiculo);

  modal
    .querySelector(".modal-background")
    .addEventListener("click", cerrarModalVehiculo);

  btnGuardar.addEventListener("click", guardarVehiculo);
}

function abrirModalVehiculo() {
  const modal = document.getElementById("modal-vehiculo");

  // Obtenemos los datos que ya están mostrando las tarjetas
  const marca = document.getElementById("marca-vehiculo").textContent;
  const modelo = document.getElementById("modelo-vehiculo").textContent;
  const año = document.getElementById("año-vehiculo").textContent;
  const color = document.getElementById("color-vehiculo").textContent;
  const patente = document.getElementById("patente-vehiculo").textContent;

  // Los colocamos en los inputs
  document.getElementById("input-marca").value = marca;
  document.getElementById("input-modelo").value = modelo;
  document.getElementById("input-año").value = año;
  document.getElementById("input-color").value = color;
  document.getElementById("input-patente").value = patente;

  modal.classList.add("is-active");
}

function cerrarModalVehiculo() {
  const modal = document.getElementById("modal-vehiculo");

  modal.classList.remove("is-active");
}

function guardarVehiculo() {
  const marca = document.getElementById("input-marca").value;
  const modelo = document.getElementById("input-modelo").value;
  const año = document.getElementById("input-año").value;
  const color = document.getElementById("input-color").value;
  const patente = document.getElementById("input-patente").value;

  // Actualizamos la tarjeta
  document.getElementById("marca-vehiculo").textContent = marca;
  document.getElementById("modelo-vehiculo").textContent = modelo;
  document.getElementById("año-vehiculo").textContent = año;
  document.getElementById("color-vehiculo").textContent = color;
  document.getElementById("patente-vehiculo").textContent = patente;

  // Actualizamos el título principal
  document.getElementById("modelo-completo").textContent = `${marca} ${modelo}`;

  cerrarModalVehiculo();
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarModalVehiculo();
});
