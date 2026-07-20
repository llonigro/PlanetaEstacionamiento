
// Script para manejar la barra de progreso de los servicios en el dashboard
const tarjetas = document.querySelectorAll(".servicios-tarjetas");

const ordenEstados = ["espera", "lavando", "listo"];

const progreso = {
    espera: "0%",
    lavando: "50%",
    listo: "100%"
}

const mensajesEstado = {
    espera: "En espera",
    lavando: "Lavando",
    listo: "Listo"
};


// Iteramos sobre cada tarjeta de servicio para actualizar su barra de progreso y estado
tarjetas.forEach(tarjeta => {

    const estado = tarjeta.dataset.estado;

    const barra = tarjeta.querySelector(".barra-progreso");
    const mensaje = tarjeta.querySelector(".mensaje-servicio");
    const pasos = tarjeta.querySelectorAll(".paso");
    const lineaActiva = tarjeta.querySelector(".linea-activa")
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

    pasos.forEach(paso => {

        const estadoPaso = paso.dataset.paso;
        const posicionPaso = ordenEstados.indexOf(estadoPaso);

        // Si el paso es menor o igual al estado actual, lo marcamos como activo y actualizamos la barra de progreso
        if (posicionPaso <= posicionActual) {
            paso.classList.add("activo");
            barra.classList.add(estado);
        }

    });

});