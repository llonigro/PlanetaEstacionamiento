function inicializarScriptsNavbar() {
  /* Scripts para el burger menu de la navbar */

  // Get all "navbar-burger" elements
  const navbarBurgers = document.querySelectorAll(".navbar-burger");

  // Add a click event on each of them
  navbarBurgers.forEach((el) => {
    el.addEventListener("click", () => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle("is-active");
      $target.classList.toggle("is-active");
    });
  });

  /* Scripts para el modal */

  // Abrir y cerrar modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el, limpiar = true) {
    $el.classList.remove("is-active");

    if (limpiar) {
      $el.querySelectorAll("input").forEach((input) => {
        input.value = "";
      });
    }
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Abrir modal al hacer clic en el botón correspondiente
  document.querySelectorAll(".js-modal-trigger").forEach(($trigger) => {
    const targetId = $trigger.dataset.target;
    const targetModal = document.getElementById(targetId);

    $trigger.addEventListener("click", () => openModal(targetModal));
  });

  // Add a click event on various child elements to close the parent modal
  document
    .querySelectorAll(".modal-background, .modal-close, .js-modal-close")
    .forEach(($close) => {
      const $target = $close.closest(".modal");

      $close.addEventListener("click", () => {
        closeModal($target);
      });
    });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });

  /* Scripts para mostrar/ocultar contraseña */

  // Buscar todos los botones de ojo
  const botonesOjo = document.querySelectorAll(".boton-ojo");

  botonesOjo.forEach((boton) => {
    boton.addEventListener("click", () => {
      // Buscar el input y el icono que están en el mismo contenedor que el botón
      const contenedor = boton.closest(".control");
      const input = contenedor.querySelector(".input-password");
      const icono = boton.querySelector(".icono-ojo");

      // Ocultar o mostrar la contraseña y cambiar el icono
      if (input && icono) {
        if (input.type === "password") {
          input.type = "text";
          icono.classList.remove("fa-eye");
          icono.classList.add("fa-eye-slash");
        } else {
          input.type = "password";
          icono.classList.remove("fa-eye-slash");
          icono.classList.add("fa-eye");
        }
      }
    });
  });
}

function inicializarModalRegistro() {
  const boton = document.getElementById("btn-comenzar");
  const modal = document.getElementById("menu-registro");

  boton.addEventListener("click", () => {
    modal.classList.add("is-active");
  });

  modal.querySelector(".modal-background").addEventListener("click", () => {
    modal.classList.remove("is-active");
  });

  modal.querySelector(".modal-close").addEventListener("click", () => {
    modal.classList.remove("is-active");
  });

  modal.querySelector(".js-modal-close").addEventListener("click", () => {
    modal.classList.remove("is-active");
  });
}

async function cargarNavbar() {
  try {
    const respuesta = await fetch("navbar.html");
    const data = await respuesta.text();

    document.getElementById("navbar-placeholder").innerHTML = data;

    inicializarScriptsNavbar();
    inicializarScriptsUsuario();
    inicializarModalRegistro();
  } catch (error) {
    console.error("Error al cargar los scripts:", error);
  }
}
