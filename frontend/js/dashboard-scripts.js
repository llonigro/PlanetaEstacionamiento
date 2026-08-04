let vehiculoEnEsperaId = null;

const API_URL = "http://localhost:3000";
const CAMPOS_VEHICULO = ["marca", "modelo", "año", "color", "patente"];

document.addEventListener("DOMContentLoaded", () => {
  inicializarModales();
  inicializarBloqueoAccionesRapidas();
  inicializarBloqueoServicios();

  // Botón de guardar vehículo
  document
    .getElementById("btn-guardar-vehiculo")
    .addEventListener("click", guardarVehiculo);

  // Botón de confirmar registro de cochera
  document
    .getElementById("confirmar-registro-cochera")
    .addEventListener("click", registrarIngresoCochera);

  inicializarBotonCocheras();
});

async function obtenerDatosUsuarioActual() {
  try {
    const respuesta = await fetch("http://localhost:3000/perfil", {
      method: "GET",
      credentials: "include",
    });

    if (!respuesta.ok) {
      // Si la sesión no es válida, redirigimos al inicio
      // (por ejemplo, si la cookie no existe o ha expirado)
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

function inicializarBloqueoAccionesRapidas() {
  const menuAcciones = document.getElementById("acciones-rapidas");

  if (!menuAcciones) return;

  menuAcciones.addEventListener(
    "click",
    (e) => {
      if (!vehiculoEnEsperaId) {
        e.preventDefault();
        e.stopPropagation();
        alert("No hay un vehículo registrado para realizar esta acción.");
      }
    },
    true,
  );
}

function inicializarBloqueoServicios() {
  const seccionServicios = document.getElementById("contenedor-servicios");

  if (!seccionServicios) return;

  seccionServicios.addEventListener(
    "click",
    (e) => {
      // 1. Si no hay vehículo registrado, bloqueamos toda la sección
      if (!vehiculoEnEsperaId) {
        e.preventDefault();
        e.stopPropagation();
        alert("No hay un vehículo registrado para ver los servicios.");
        return;
      }

      // 2. Si hay vehículo, verificamos si la tarjeta clickeada está inactiva
      const tarjeta = e.target.closest(".servicios-tarjetas");
      if (tarjeta) {
        const estaActivo = tarjeta.dataset.activo === "true";
        if (!estaActivo) {
          e.preventDefault();
          e.stopPropagation();
          alert("Este servicio no se encuentra activo en este momento.");
        }
      }
    },
    true,
  );
}

// MODALES

function inicializarModales() {
  // Botones que abren modales
  document.querySelectorAll("[data-modal]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const modalId = boton.dataset.modal;
      const modal = document.getElementById(modalId);

      if (!modal) return;

      if (modal.id === "modal-vehiculo") {
        cargarDatosVehiculo();
      }

      modal.classList.add("is-active");
    });
  });
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

function cargarDatosVehiculo() {
  CAMPOS_VEHICULO.forEach((campo) => {
    const dato = document.getElementById(`${campo}-vehiculo`);
    const input = document.getElementById(`input-${campo}`);

    if (dato && input) {
      input.value = dato.textContent.trim();
    }
  });
}

async function guardarVehiculo() {
  const usuarioId = localStorage.getItem("usuario_id");

  const marca = document.getElementById("input-marca").value.trim();
  const modelo = document.getElementById("input-modelo").value.trim();
  const año = document.getElementById("input-año").value.trim();
  const color = document.getElementById("input-color").value.trim();
  const patente = document.getElementById("input-patente").value.trim();
  const permitirValet = document.getElementById("input-permitir-valet").value;

  if (!marca || !modelo || !año || !color || !patente) {
    alert("Por favor, completa todos los campos del vehículo.");
    return;
  }

  const datosVehiculo = {
    marca,
    modelo,
    año: Number(año),
    color,
    patente,
    usuario_id: Number(usuarioId),
    permitir_valet: permitirValet === "true",
  };

  try {
    const respuesta = await fetch(`${API_URL}/vehiculos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosVehiculo),
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || "Error al guardar el vehículo");
    }

    const vehiculoGuardado = await respuesta.json();
    vehiculoEnEsperaId = vehiculoGuardado.id;

    document.getElementById("input-marca").value = "";
    document.getElementById("input-modelo").value = "";
    document.getElementById("input-año").value = "";
    document.getElementById("input-color").value = "";
    document.getElementById("input-patente").value = "";

    document
      .getElementById("contenedor-acciones-rapidas")
      .classList.remove("menu-bloqueado");
    document.getElementById("modal-vehiculo").classList.remove("is-active");
  } catch (error) {
    console.error("Error al guardar el vehículo:", error);
    alert("Hubo un problema al guardar el vehículo.");
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
    const respuesta = await fetch("http://localhost:3000/cocheras");

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
  if (!vehiculoEnEsperaId) {
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
    vehiculo_id: vehiculoEnEsperaId,
    fechaEgreso: fechaEgreso,
  };

  try {
    // 1. Hacemos el POST a tu ruta del backend
    const respuesta = await fetch(`${API_URL}/registros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  } catch (error) {
    console.error("Error al registrar el ingreso:", error);
    alert("Hubo un problema al registrar la cochera.");
  }
}

async function cerrarSesion() {
  try {
    const respuesta = await fetch("http://localhost:3000/logout", {
      method: "POST", // o GET dependiendo de cómo definas la ruta
      credentials: "include",
    });

    if (respuesta.ok) {
      window.location.href = "inicio.html";
    }
  } catch (error) {
    console.error("Error al cerrar sesión", error);
  }
}
