document.addEventListener("DOMContentLoaded", () => {

    const images = document.querySelectorAll('.fade-img');

    images.forEach(img => {

        // Verificamos si la imagen ya se cargó (por caché)
        if (img.complete) {
            img.classList.add('is-loaded');
            img.parentElement.classList.add('is-loaded');
            
        } else {
            // Si no, esperamos al evento load
            img.addEventListener('load', () => {
                img.classList.add('is-loaded');
                img.parentElement.classList.add('is-loaded');
            });
        }
    });
});