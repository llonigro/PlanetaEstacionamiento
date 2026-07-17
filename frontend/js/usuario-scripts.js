async function registrarUsuario() {
    const usuario = document.getElementById("usuario").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const respuesta = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, email, password })
    });

    const data = await respuesta.json();
    if (respuesta.status === 201) {
        alert('Usuario registrado exitosamente');
    } else {
        alert('Error al registrar usuario: ' + data.error);
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
