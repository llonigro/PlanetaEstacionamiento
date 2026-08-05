const { iniciarSesion } = require("../servicio/servicio-login.js");

const login = async (req, res) => {
  try {
    const { email, contrasenia } = req.body;
    const { token, usuario } = await iniciarSesion(email, contrasenia);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60 * 1000, // 8 horas en milisegundos
    });
    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: usuario,
    });
  } catch (error) {
    console.error("Error en el login:", error.message);
    res.status(401).json({ mensaje: error.message });
  }
};

const logout = (req, res) => {
  // Para cerrar sesión, simplemente limpiamos la cookie
  res.clearCookie("token");
  res.status(200).json({ mensaje: "Sesión cerrada correctamente" });
};

module.exports = { login, logout };
