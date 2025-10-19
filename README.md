# API REST con Express y MySQL

Una API REST completa construida con Node.js, Express y MySQL, lista para producción con tests automatizados y pipelines CI/CD.

## ✨ Características

- ✅ **CRUD de Usuarios** (almacenamiento en memoria)
- ✅ **CRUD de Productos** (MySQL)
- ✅ **31 tests automatizados** (Jest + Supertest)
- ✅ **Pipelines CI/CD** (GitHub Actions + Azure DevOps)
- ✅ **Docker** containerization
- ✅ **Validaciones** de entrada completas
- ✅ **Seguridad** contra SQL injection

## 🗄️ Base de Datos MySQL

La API se conecta a MySQL con la siguiente configuración:

```
Host: sql.freedb.tech
Puerto: 3306
Base de datos: freedb_testpipeline
Usuario: freedb_adminpipeline
```

La tabla `producto` se crea automáticamente al iniciar el servidor.

## Instalación

```bash
npm install
```

## Uso

Para iniciar el servidor:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000` y se conectará automáticamente a MySQL.

Verás un mensaje como:
```
✅ Conexión a MySQL exitosa
✅ Tabla "producto" verificada/creada

🚀 Servidor corriendo en http://localhost:3000
📝 API Usuarios: http://localhost:3000/api/usuarios
📦 API Productos: http://localhost:3000/api/productos

✅ Conectado a MySQL: freedb_testpipeline
```

## Endpoints

### 🏠 Principal

### GET /
Ruta principal con información de la API y endpoints disponibles

### 👥 API de Usuarios (In-Memory)

### GET /api/usuarios
Obtener todos los usuarios

### GET /api/usuarios/:id
Obtener un usuario específico por ID

### POST /api/usuarios
Crear un nuevo usuario
- Body: `{ "nombre": "string", "email": "string" }`

### PUT /api/usuarios/:id
Actualizar un usuario existente
- Body: `{ "nombre": "string", "email": "string" }` (campos opcionales)

### DELETE /api/usuarios/:id
Eliminar un usuario

---

### 📦 API de Productos (MySQL)

### GET /api/productos
Obtener todos los productos

### GET /api/productos/:id
Obtener un producto específico por ID

### POST /api/productos
Crear un nuevo producto
- Body: `{ "nombre": "string", "und": "string", "precio": number, "cantidad": number }`
- Validaciones:
  - Todos los campos son requeridos
  - `precio` debe ser >= 0
  - `cantidad` debe ser un entero >= 0

### PUT /api/productos/:id
Actualizar un producto existente
- Body: `{ "nombre": "string", "und": "string", "precio": number, "cantidad": number }` (todos opcionales)

### DELETE /api/productos/:id
Eliminar un producto

## Ejemplos de uso

### Productos

#### Crear un producto
```bash
curl -X POST http://localhost:3000/api/productos -H "Content-Type: application/json" -d "{\"nombre\":\"Laptop\",\"und\":\"unidad\",\"precio\":1299.99,\"cantidad\":10}"
```

#### Obtener todos los productos
```bash
curl http://localhost:3000/api/productos
```

#### Actualizar un producto
```bash
curl -X PUT http://localhost:3000/api/productos/1 -H "Content-Type: application/json" -d "{\"precio\":1199.99}"
```

#### Eliminar un producto
```bash
curl -X DELETE http://localhost:3000/api/productos/1
```

### Usuarios

### Obtener todos los usuarios
```bash
curl http://localhost:3000/api/usuarios
```

### Crear un usuario
```bash
curl -X POST http://localhost:3000/api/usuarios -H "Content-Type: application/json" -d "{\"nombre\":\"Ana\",\"email\":\"ana@example.com\"}"
```

### Actualizar un usuario
```bash
curl -X PUT http://localhost:3000/api/usuarios/1 -H "Content-Type: application/json" -d "{\"nombre\":\"Juan Carlos\"}"
```

### Eliminar un usuario
```bash
curl -X DELETE http://localhost:3000/api/usuarios/1
```

## 🧪 Tests

El proyecto incluye 31 tests automatizados:

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch (desarrollo)
npm run test:watch
```

## 🔄 CI/CD

El proyecto incluye pipelines configurados para:

- **GitHub Actions**: `.github/workflows/ci.yml`
- **Azure DevOps**: `azure-pipelines.yml`

Ambos pipelines ejecutan tests automáticamente en múltiples versiones de Node.js (18.x y 20.x).

## 🐳 Docker

```bash
# Construir imagen
docker build -t firstapi .

# Ejecutar contenedor
docker run -p 3000:3000 firstapi
```

## 📚 Documentación Adicional

- **[PRODUCTOS_API.md](PRODUCTOS_API.md)** - Documentación detallada de la API de Productos
- **[TESTING.md](TESTING.md)** - Guía completa de testing y CI/CD
- **[RESUMEN_FINAL.md](RESUMEN_FINAL.md)** - Resumen completo del proyecto

## 🔧 Tecnologías

- **Express** - Framework web
- **MySQL2** - Cliente MySQL con Promises
- **Jest** - Framework de testing
- **Supertest** - Testing de endpoints HTTP
- **Docker** - Containerización

## 📊 Estado del Proyecto

```
✅ 31/31 tests pasando (100%)
⚡ Tiempo de ejecución: ~17s
📦 2 APIs funcionando (Usuarios + Productos)
🗄️ Conectado a MySQL
🔒 Seguridad contra SQL injection
```
