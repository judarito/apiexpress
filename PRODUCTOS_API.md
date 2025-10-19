# API REST con MySQL - Gestión de Productos

## 📦 Nueva Funcionalidad: CRUD de Productos

La API ahora incluye un sistema completo de gestión de productos conectado a MySQL.

## 🗄️ Base de Datos

### Configuración MySQL

```
Host: sql.freedb.tech
Puerto: 3306
Base de datos: freedb_testpipeline
Usuario: freedb_adminpipeline
Password: cw3F!ZcJcJRyYZj
```

### Tabla: producto

| Campo    | Tipo         | Descripción                    |
|----------|--------------|--------------------------------|
| id       | INT          | Auto-increment, Primary Key    |
| nombre   | VARCHAR(255) | Nombre del producto            |
| und      | VARCHAR(50)  | Unidad de medida               |
| precio   | DOUBLE       | Precio del producto            |
| cantidad | INT          | Cantidad en inventario         |

## 🚀 Endpoints de Productos

### Base URL
```
http://localhost:3000/api/productos
```

### 1. Obtener todos los productos
```http
GET /api/productos
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "nombre": "Laptop",
    "und": "unidad",
    "precio": 1200.50,
    "cantidad": 10,
    "created_at": "2025-10-18T10:30:00.000Z",
    "updated_at": "2025-10-18T10:30:00.000Z"
  }
]
```

### 2. Obtener un producto por ID
```http
GET /api/productos/:id
```

**Parámetros:**
- `id` (number) - ID del producto

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "nombre": "Laptop",
  "und": "unidad",
  "precio": 1200.50,
  "cantidad": 10
}
```

**Respuesta error (404):**
```json
{
  "error": "Producto no encontrado"
}
```

### 3. Crear un nuevo producto
```http
POST /api/productos
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Mouse Inalámbrico",
  "und": "unidad",
  "precio": 25.99,
  "cantidad": 50
}
```

**Validaciones:**
- Todos los campos son requeridos
- `precio` debe ser un número ≥ 0
- `cantidad` debe ser un entero ≥ 0

**Respuesta exitosa (201):**
```json
{
  "id": 2,
  "nombre": "Mouse Inalámbrico",
  "und": "unidad",
  "precio": 25.99,
  "cantidad": 50
}
```

### 4. Actualizar un producto
```http
PUT /api/productos/:id
Content-Type: application/json
```

**Body (todos los campos opcionales):**
```json
{
  "nombre": "Mouse Inalámbrico Pro",
  "und": "unidad",
  "precio": 29.99,
  "cantidad": 45
}
```

**Respuesta exitosa (200):**
```json
{
  "id": 2,
  "nombre": "Mouse Inalámbrico Pro",
  "und": "unidad",
  "precio": 29.99,
  "cantidad": 45
}
```

### 5. Eliminar un producto
```http
DELETE /api/productos/:id
```

**Respuesta exitosa (200):**
```json
{
  "mensaje": "Producto eliminado exitosamente",
  "producto": {
    "id": 2,
    "nombre": "Mouse Inalámbrico Pro",
    "und": "unidad",
    "precio": 29.99,
    "cantidad": 45
  }
}
```

## 📝 Ejemplos con cURL

### Crear un producto
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Teclado Mecánico",
    "und": "unidad",
    "precio": 89.99,
    "cantidad": 15
  }'
```

### Obtener todos los productos
```bash
curl http://localhost:3000/api/productos
```

### Obtener un producto específico
```bash
curl http://localhost:3000/api/productos/1
```

### Actualizar un producto
```bash
curl -X PUT http://localhost:3000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 79.99,
    "cantidad": 20
  }'
```

### Eliminar un producto
```bash
curl -X DELETE http://localhost:3000/api/productos/1
```

## 🧪 Tests Automatizados

Los tests incluyen validaciones completas para:

- ✅ Listar productos (con/sin datos)
- ✅ Obtener producto por ID
- ✅ Crear productos con validaciones
- ✅ Actualizar productos (completo y parcial)
- ✅ Eliminar productos
- ✅ Manejo de errores 404
- ✅ Validaciones de tipos de datos

### Ejecutar tests
```bash
npm test
```

### Ejecutar solo tests de productos
```bash
npm test -- productos.test.js
```

## 🏗️ Arquitectura

```
firstapi/
├── config/
│   └── database.js           # Configuración MySQL
├── models/
│   └── productoModel.js      # Modelo de datos
├── routes/
│   └── productoRoutes.js     # Rutas y controladores
├── __tests__/
│   ├── api.test.js          # Tests usuarios
│   └── productos.test.js    # Tests productos
└── app.js                    # App principal
```

## 🔧 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

## 🚦 Iniciar el Servidor

```bash
npm start
```

El servidor:
1. Se conectará a MySQL
2. Creará la tabla `producto` si no existe
3. Iniciará en http://localhost:3000

## ⚠️ Códigos de Error

| Código | Descripción                          |
|--------|--------------------------------------|
| 200    | Operación exitosa                    |
| 201    | Recurso creado exitosamente          |
| 400    | Datos de entrada inválidos           |
| 404    | Recurso no encontrado                |
| 500    | Error interno del servidor           |

## 🔐 Seguridad

- Pool de conexiones configurado
- Prepared statements (previene SQL injection)
- Validación de tipos de datos
- Manejo de errores centralizado

## 📊 Modelo de Datos

El modelo `ProductoModel` proporciona:

- `getAll()` - Obtener todos los productos
- `getById(id)` - Obtener producto por ID
- `create(producto)` - Crear nuevo producto
- `update(id, producto)` - Actualizar producto
- `delete(id)` - Eliminar producto
- `deleteAll()` - Limpiar tabla (solo para tests)

## 🎯 Próximos Pasos

- [ ] Agregar paginación
- [ ] Implementar búsqueda y filtros
- [ ] Agregar autenticación
- [ ] Implementar caché
- [ ] Agregar logging avanzado
