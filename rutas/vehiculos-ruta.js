
const router = require("express");
const router = express.Router();

/////////////////////////////// Tabla vehiculos //////////////////////////////////////////// 
router.get("/usuarios", VerUsuarios);

router.get("/usuarios/:id", VerUsuario);

router.post("/usuarios", CrearUsuario);

router.patch("/usuarios/:id", ActualizarUsuario); // la diferencia entre patch y put es que patch actualiza parcialmente no completo como put

router.delete("/usuarios/:id", BorrarUsuario);

///////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;