function inicializarScriptsUsuario() {

    const botonConfirmarRegistro = document.getElementById("confirmar-registro");

    console.log(botonConfirmarRegistro);

    if (botonConfirmarRegistro) {
        botonConfirmarRegistro.addEventListener("click", async (event) => {
            event.preventDefault();

            // console.log("Botón de registro clickeado");

            await registrarUsuario();
        });
    }
    
    const botonConfirmarLogin = document.getElementById("confirmar-sesion");

    if (botonConfirmarLogin) {
        botonConfirmarLogin.addEventListener("click", async (event) => {
            event.preventDefault();
            await iniciarSesion();
        });
    }
}


async function registrarUsuario() {
    // Asignar los valores de los campos del formulario a variables
    try {
        const usuarioData = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            contrasenia: document.getElementById("contrasenia").value,
            telefono: document.getElementById("telefono").value,
            rol: 'usuario' 
        };

        // Hacer la solicitud POST al backend para registrar el usuario
        const respuesta = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioData)
        });

        // Capturar la respuesta del backend y convertirla a JSON
        const result = await respuesta.json();

        // Manejar la respuesta del backend
        if (!respuesta.ok) {

            // Limpiar los mensajes de error anteriores
            document.querySelectorAll('.help').forEach(p => p.textContent = '');

            document.querySelectorAll('.input').forEach(input => input.classList.remove('is-danger'));

            // Capturar errores de codigo de estado HTTP 
            if(result.errors){
                result.errors.forEach(error => {

                    const errorElement = document.getElementById(`error-${error.path}`);
                    const inputElement = document.getElementById(error.path);

                    if (inputElement) {
                        inputElement.classList.add('is-danger');
                    }

                    if (errorElement) {
                        errorElement.textContent = error.msg;
                    }
                });

            } else {
                alert(`Error: ${result.message}`);
            }

        } else {
            alert('Usuario registrado con éxito');
            console.log('Usuario registrado:', result);
            // Limpiar los campos del formulario después de un registro exitoso
            document.getElementById("nombre").value = '';
            document.getElementById("email").value = '';
            document.getElementById("contrasenia").value = '';
            document.getElementById("telefono").value = '';
            // cerrar modal
            const modal = document.getElementById("menu-registro");
            if (modal) {
                modal.classList.remove("is-active");
            }
        }

    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

async function iniciarSesion() {
    const email = document.getElementById("login-email").value;
    const contrasenia = document.getElementById("login-contrasenia").value;

    const respuesta = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({email, contrasenia})
    });
}
