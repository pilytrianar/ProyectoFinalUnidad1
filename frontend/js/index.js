function mostrarVista(idVista) {
  const vistas = document.querySelectorAll(".vista");

  vistas.forEach((vista) => {
    vista.classList.add("oculto");
  });

  const vistaSeleccionada = document.getElementById(idVista);

  if (vistaSeleccionada) {
    vistaSeleccionada.classList.remove("oculto");
  }

  if (idVista === "productosDom") {
    verificarPermisosProductos();
    cargarProductos();
  }
}

// Validación del login principal
async function validarLogin(event) {
  event.preventDefault();

  const correo = document.getElementById("loginCorreo").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const mensaje = document.getElementById("mensajeLogin");

  try {
    const respuesta = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo, password })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = data.mensaje;
      mensaje.style.color = "red";
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("rol", data.usuario.rol);

    mensaje.textContent = "Login exitoso";
    mensaje.style.color = "green";

    if (data.usuario.rol === "admin") {
      mostrarVista("productosDom");
    } else {
      mostrarVista("solicitudes");
    }

  } catch (error) {
    mensaje.textContent = "Error al conectar con el servidor";
    mensaje.style.color = "red";
  }
}

// Validación del registro
async function validarRegistro(event) {
  event.preventDefault();

  const nombre = document.getElementById("registroNombre").value.trim();
  const correo = document.getElementById("registroCorreo").value.trim();
  const password = document.getElementById("registroPassword").value.trim();
  const rol = document.getElementById("registroRol").value;
  const mensaje = document.getElementById("mensajeRegistro");

  try {
    const respuesta = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombre, correo, password, rol })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = data.mensaje;
      mensaje.style.color = "red";
      return;
    }

    mensaje.textContent = "Registro exitoso. Ahora puedes iniciar sesión.";
    mensaje.style.color = "green";

    setTimeout(() => {
      mostrarVista("login");
    }, 800);

  } catch (error) {
    mensaje.textContent = "Error al conectar con el servidor";
    mensaje.style.color = "red";
  }
}

// Validación de solicitudes
async function validarSolicitud(event) {
  event.preventDefault();

  const formulario = event.target;

  const nombreAcudiente = formulario.querySelector("#nombreAcudiente").value.trim();
  const correo = formulario.querySelector("#correoSolicitud").value.trim();
  const servicio = formulario.querySelector("#servicioSolicitud").value.trim();
  const mensaje = formulario.querySelector("#mensajeSolicitud").value.trim();
  const respuestaMsg = formulario.querySelector("#mensajeSolicitudRespuesta");

  const token = localStorage.getItem("token");

  if (!token) {
    respuestaMsg.textContent = "Debes iniciar sesión para crear una solicitud.";
    respuestaMsg.style.color = "red";
    return;
  }

  try {
    const respuesta = await fetch("http://localhost:3000/api/solicitudes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        nombreAcudiente,
        correo,
        servicio,
        mensaje
      })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      respuestaMsg.textContent = data.mensaje;
      respuestaMsg.style.color = "red";
      return;
    }

    respuestaMsg.textContent = "Solicitud creada correctamente.";
    respuestaMsg.style.color = "green";

    formulario.reset();

  } catch (error) {
    respuestaMsg.textContent = "Error al conectar con el servidor.";
    respuestaMsg.style.color = "red";
  }
}

function validarCorreo(correo) {
  const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return expresion.test(correo);
}

const cuponValido = "DESC50";

let productos = [];
let productoEditandoId = null;
let isAdmin = localStorage.getItem("rol") === "admin";

const formularioProducto = document.getElementById("product-form");
const contenedorProductos = document.getElementById("products-container");
const adminSection = document.getElementById("admin-section");
const btnLogout = document.getElementById("btn-logout");

async function cargarProductos() {
  try {
    const respuesta = await fetch("http://localhost:3000/api/productos");
    productos = await respuesta.json();
    renderizarProductos();
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function verificarPermisosProductos() {
  isAdmin = localStorage.getItem("rol") === "admin";

  if (adminSection) {
    if (isAdmin) {
      adminSection.classList.remove("hidden");
    } else {
      adminSection.classList.add("hidden");
    }
  }

  if (btnLogout) {
    if (localStorage.getItem("token")) {
      btnLogout.classList.remove("hidden");
    } else {
      btnLogout.classList.add("hidden");
    }
  }

  renderizarProductos();
}

if (btnLogout) {
  btnLogout.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    isAdmin = false;
    productoEditandoId = null;

    if (adminSection) {
      adminSection.classList.add("hidden");
    }

    if (btnLogout) {
      btnLogout.classList.add("hidden");
    }

    if (formularioProducto) {
      formularioProducto.reset();
    }

    renderizarProductos();
    mostrarVista("login");
  });
}

if (formularioProducto) {
  formularioProducto.addEventListener("submit", async function (event) {
    event.preventDefault();

    const image = document.getElementById("image").value.trim();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const coupon = document.getElementById("coupon").value.trim();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión como administrador.");
      return;
    }

    if (!isAdmin) {
      alert("Solo el administrador puede crear o editar productos.");
      return;
    }

    if (!image || !title || !description || isNaN(price) || price <= 0) {
      alert("Por favor completa todos los campos correctamente.");
      return;
    }

    let precioFinal = price;

    if (coupon === cuponValido) {
      precioFinal = price * 0.5;
    }

    const producto = {
      image,
      title,
      description,
      price,
      coupon,
      precioFinal
    };

    const url = productoEditandoId
      ? `http://localhost:3000/api/productos/${productoEditandoId}`
      : "http://localhost:3000/api/productos";

    const metodo = productoEditandoId ? "PUT" : "POST";

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(producto)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        alert(data.mensaje || "Error al guardar producto");
        return;
      }

      alert(productoEditandoId ? "Producto actualizado correctamente" : "Producto creado correctamente");

      productoEditandoId = null;
      formularioProducto.reset();
      cargarProductos();

    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  });
}

function renderizarProductos() {
  if (!contenedorProductos) return;

  contenedorProductos.innerHTML = "";

  productos.forEach((producto) => {
    const productCard = document.createElement("article");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}">
      <h3>${producto.title}</h3>
      <p>${producto.description}</p>
      ${producto.coupon === cuponValido
        ? `<p class="original-price">Precio original: $${Number(producto.price).toLocaleString()}</p>
             <p class="final-price">Precio con descuento: $${Number(producto.precioFinal).toLocaleString()}</p>
             <p class="discount-text">Descuento aplicado: 50%</p>`
        : `<p class="final-price">Precio: $${Number(producto.precioFinal).toLocaleString()}</p>`
      }
      ${isAdmin
        ? `<button class="edit-btn">Editar</button>
             <button class="delete-btn">Eliminar</button>`
        : ""
      }
    `;

    if (isAdmin) {
      const editButton = productCard.querySelector(".edit-btn");
      const deleteButton = productCard.querySelector(".delete-btn");

      editButton.addEventListener("click", function () {
        document.getElementById("image").value = producto.image;
        document.getElementById("title").value = producto.title;
        document.getElementById("description").value = producto.description;
        document.getElementById("price").value = producto.price;
        document.getElementById("coupon").value = producto.coupon || "";

        productoEditandoId = producto._id;

        alert("Producto cargado para edición. Modifica los datos y presiona Guardar.");
      });

      deleteButton.addEventListener("click", async function () {
        const confirmar = confirm("¿Seguro que deseas eliminar este producto?");

        if (!confirmar) return;

        const token = localStorage.getItem("token");

        try {
          const respuesta = await fetch(`http://localhost:3000/api/productos/${producto._id}`, {
            method: "DELETE",
            headers: {
              "Authorization": "Bearer " + token
            }
          });

          const data = await respuesta.json();

          if (!respuesta.ok) {
            alert(data.mensaje || "Error al eliminar producto");
            return;
          }

          alert("Producto eliminado correctamente");
          cargarProductos();

        } catch (error) {
          alert("Error al conectar con el servidor");
        }
      });
    }

    contenedorProductos.appendChild(productCard);
  });
}

cargarProductos();

function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");

  alert("Sesión cerrada");

  mostrarVista("login");
}