// const nombreGerente = document.getElementById("nombre-gerente");
// nombreGerente.textContent = datos.nombre;


async function cargarSeccion(pagina, elementoActivo) {

    const respuesta = await fetch(pagina);

    const contenido = await respuesta.text();

    document.getElementById("contenido-dashboard").innerHTML = contenido;

    document.querySelectorAll(".menu-item").forEach(item => {

            item.classList.remove("is-active");

        });


    elementoActivo.classList.add("is-active");

    if (pagina === "gerente-cocheras.html") {
        inicializarModalCochera();
    }

}

function inicializarModalCochera() {

    const modal =
        document.getElementById("modal-agregar-cochera");

    const btnAbrir =
        document.getElementById("btn-agregar-cochera");

    const btnCerrar =
        document.getElementById("btn-cerrar-modal");

    const btnCancelar =
        document.getElementById("btn-cancelar-modal");


    // Abrir modal
    btnAbrir.addEventListener("click", function () {

        modal.classList.add("is-active");

    });


    // Cerrar modal
    btnCerrar.addEventListener("click", function () {

        modal.classList.remove("is-active");

    });


    // Cancelar
    btnCancelar.addEventListener("click", function () {

        modal.classList.remove("is-active");

    });


    // Cerrar al hacer click en el fondo
    modal.querySelector(".modal-background").addEventListener("click", function () {

            modal.classList.remove("is-active");

        });

}

// Cargar la sección de inicio al cargar la página
document.addEventListener("DOMContentLoaded", function () {

    const dashboard = document.querySelector(".menu-item");

    cargarSeccion("gerente-inicio.html", dashboard);

});