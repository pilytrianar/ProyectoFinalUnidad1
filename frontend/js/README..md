# 🎓 Proyecto Final - Gamenglish

Aplicación web full stack desarrollada con frontend en HTML, CSS y JavaScript, y backend en Node.js, Express y MongoDB.

---

## 📁 Estructura del proyecto


ProyectoFinalUnidad1/
├── frontend/
├── backend/
├── documentos/
└── README.md


---

## 🔐 Credenciales de acceso

### 👨‍💼 Administrador

Correo: admin@gmail.com  
Contraseña: 123456  

Permite:

- Crear productos  
- Editar productos  
- Eliminar productos  
- Acceder al panel de administración  
- Gestionar solicitudes  

---

### 👤 Usuario normal

Correo: andrea@gmail.com  
Contraseña: 123456  

Permite:

- Crear solicitudes  

---

## ⚙️ 1. Requisitos de ejecución

### 📌 Requisitos

- Node.js  
- npm  
- MongoDB Atlas  
- Postman  
- Navegador web  

---

### 🚀 Ejecutar backend

Entrar a la carpeta backend:


cd backend


Instalar dependencias:


npm install


Crear archivo `.env`:


PORT=3000
MONGO_URI=tu_cadena_de_mongodb
JWT_SECRET=clavesecreta123


Ejecutar servidor:


npm run dev


Salida esperada:


Servidor corriendo en el puerto 3000
MongoDB conectado correctamente


---

### 🌐 Ejecutar frontend

Abrir:


frontend/index.html


O usar Live Server en VS Code.

---

## 📡 2. Diccionario de Endpoints

---

### 🔐 Autenticación

| Método | Ruta | Descripción |
|--------|------|------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |

---

### 📥 Ejemplo Register

Entrada:

```json
{
  "nombre": "Admin",
  "correo": "admin@gmail.com",
  "password": "123456",
  "rol": "admin"
}

Salida:

{
  "mensaje": "Usuario registrado correctamente",
  "usuario": {
    "id": "ID",
    "nombre": "Admin",
    "correo": "admin@gmail.com",
    "rol": "admin"
  }
}
🔑 Ejemplo Login

Entrada:

{
  "correo": "admin@gmail.com",
  "password": "123456"
}

Salida:

{
  "mensaje": "Login exitoso",
  "token": "TOKEN_JWT",
  "usuario": {
    "id": "ID",
    "nombre": "Admin",
    "correo": "admin@gmail.com",
    "rol": "admin"
  }
}
👥 Usuarios
Método	Ruta	Descripción
GET	/api/users/perfil	Perfil usuario
GET	/api/users/panel	Panel usuario
GET	/api/users/admin	Ruta admin

Header:

Authorization: Bearer TOKEN
📨 Solicitudes
Método	Ruta
POST	/api/solicitudes
GET	/api/solicitudes
GET	/api/solicitudes/:id
PUT	/api/solicitudes/:id
DELETE	/api/solicitudes/:id
📥 Ejemplo Solicitud
{
  "nombreAcudiente": "Laura Gomez",
  "correo": "laura@gmail.com",
  "servicio": "Clases presenciales para niños",
  "mensaje": "Quiero información"
}
🛒 Productos
Método	Ruta
POST	/api/productos
GET	/api/productos
PUT	/api/productos/:id
DELETE	/api/productos/:id
📥 Ejemplo Producto
{
  "image": "https://imagen.com",
  "title": "Curso inglés",
  "description": "Clase para niños",
  "price": 50000,
  "coupon": "DESC50",
  "precioFinal": 25000
}
🧪 3. Evidencia de pruebas (Postman)

Se realizaron pruebas de:

Registro usuario
Login
Acceso con token
CRUD solicitudes
CRUD productos
Validaciones
Roles

📂 Evidencias en carpeta:

documentos/
🧠 4. Explicación del DOM

El frontend usa una sola página (index.html).

Las vistas se controlan con JavaScript mediante:

function mostrarVista(idVista) {
  const vistas = document.querySelectorAll(".vista");

  vistas.forEach((vista) => {
    vista.classList.add("oculto");
  });

  const vistaSeleccionada = document.getElementById(idVista);

  if (vistaSeleccionada) {
    vistaSeleccionada.classList.remove("oculto");
  }
}
🧩 Vistas del sistema
Inicio
Servicios
Login
Registro
Solicitudes
Productos DOM
🔐 Manejo de sesión

Se usa localStorage para guardar:

token
rol

Permite:

Control de acceso
Validación de roles
Protección de rutas
