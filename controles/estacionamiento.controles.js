


const VerUsuarios = (req, res) => {
    res.send("usuarios del estacionamiento")
}
const CrearUsuario = (req, res) => {
    res.send(" crear usuario de estacionamiento")
}

const BorrarUsuario = (req, res) => {
    res.send(" borrar usuario de estacionamiento")
}


module.exports= {
    VerUsuarios,
    CrearUsuario,
    BorrarUsuario,
}