const Product = require("../models/Product");

const crearProducto = async (req, res) => {
  try {
    const { image, title, description, price, coupon } = req.body;

    if (!image || !title || !description || !price) {
      return res.status(400).json({
        mensaje: "Todos los campos obligatorios deben estar completos"
      });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        mensaje: "El precio debe ser un número mayor que cero"
      });
    }

    let precioFinal = Number(price);

    if (coupon === "DESC50") {
      precioFinal = Number(price) * 0.5;
    }

    const producto = new Product({
      image,
      title,
      description,
      price,
      coupon,
      precioFinal
    });

    await producto.save();

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear producto",
      error: error.message
    });
  }
};

const listarProductos = async (req, res) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar productos",
      error: error.message
    });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      producto
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar producto",
      error: error.message
    });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const producto = await Product.findByIdAndDelete(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado"
      });
    }

    res.status(200).json({
      mensaje: "Producto eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar producto",
      error: error.message
    });
  }
};

module.exports = {
  crearProducto,
  listarProductos,
  actualizarProducto,
  eliminarProducto
};