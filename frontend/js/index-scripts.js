
/* Scripts para el burger menu de la navbar */
document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Add a click event on each of them
  $navbarBurgers.forEach( el => {
    el.addEventListener('click', () => {

      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });

});

/* Scripts para el modal de registro */
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    if(event.key === "Escape") {
      closeAllModals();
    }
  });
})

/* Scripts para mostrar/ocultar contraseña */
document.addEventListener('DOMContentLoaded', () => {
  const contraseniaInput = document.getElementById("password");
  const botonMostrar = document.getElementById("mostrar-contrasenia")
  const ojoIcono = document.getElementById("ojo-icono")

  if (contraseniaInput && botonMostrar && ojoIcono) {
    botonMostrar.addEventListener('click', () => {
      if (contraseniaInput.type == 'password') {
        contraseniaInput.type = 'text';

        ojoIcono.classList.remove('fa-eye');
        ojoIcono.classList.add('fa-eye-slash');
      } else {
        contraseniaInput.type = 'password';

        ojoIcono.classList.remove('fa-eye-slash');
        ojoIcono.classList.add('fa-eye');
      }
    });
  };
})
