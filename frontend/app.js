// app.js (Frontend)
const API_URL = 'http://localhost:5000'; // El puerto de tu Express

// GET UNICO
const GET = fetch(API_URL + "/usuarios/23")
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error(error))

console.log(GET);

// POST
const POST = fetch(API_URL + "/usuarios" , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: "Juan Pérez",
            email: "juan.perez@example.com",
            contrasenia: "dkdkkddkdkd",
            rol: "cliente",
            telefono: "123456789"
    })
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error(error))


