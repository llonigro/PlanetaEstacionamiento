// MODAL SCRIPTS BULMA
function inicializarModal() {
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
}
