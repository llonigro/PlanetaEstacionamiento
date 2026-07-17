async function registrarUsuario() {
    // Asignar los valores de los campos del formulario a variables
    try {
    const usuario = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Hacer la solicitud POST al backend para registrar el usuario
    const respuesta = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, email, password })
    });

    // Manejar la respuesta del backend
    if (!respuesta.ok) {
        throw new Error('Error al registrar usuario');

    }

    // En caso de éxito, mostrar un mensaje de éxito 
    const data = await respuesta.json();
    console.log('Usuario registrado con éxito:', data);

    // En caso de error, mostrar un mensaje de error  
    } catch (error) {
    console.error('Error al registrar usuario:', error);
    }
}

async function iniciarSesion() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const respuesta = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({email, password})
    });
}
