const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");
const verificarRol = require("../middleware/roleMiddleware");

const {
  crearProducto,
  listarProductos,
  actualizarProducto,
  eliminarProducto
} = require("../controllers/productController");

router.post("/", verificarToken, verificarRol("admin"), crearProducto);
router.get("/", listarProductos);
router.put("/:id", verificarToken, verificarRol("admin"), actualizarProducto);
router.delete("/:id", verificarToken, verificarRol("admin"), eliminarProducto);

module.exports = router;