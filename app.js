const express = require('express');
const app = express();
const productoRoutes = require('./routes/productoRoutes');

// Middleware para parsear JSON
app.use(express.json());

// Base de datos simulada
let usuarios = [
  { id: 1, nombre: 'Juan', email: 'juan@example.com' },
  { id: 2, nombre: 'María', email: 'maria@example.com' },
  { id: 3, nombre: 'Pedro', email: 'pedro@example.com' }
];

// Función para resetear la base de datos (útil para tests)
const resetDatabase = () => {
  usuarios = [
    { id: 1, nombre: 'Juan', email: 'juan@example.com' },
    { id: 2, nombre: 'María', email: 'maria@example.com' },
    { id: 3, nombre: 'Pedro', email: 'pedro@example.com' }
  ];
};

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'Bienvenido a la API REST con Express',
    version: '2.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      productos: '/api/productos'
    }
  });
});

// Rutas de productos (MySQL)
app.use('/api/productos', productoRoutes);

// GET - Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  res.json(usuarios);
});

// GET - Obtener un usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  
  if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

// POST - Crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }
  
  const nuevoUsuario = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
    nombre,
    email
  };
  
  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// PUT - Actualizar un usuario
app.put('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, email } = req.body;
  const index = usuarios.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  if (nombre) usuarios[index].nombre = nombre;
  if (email) usuarios[index].email = email;
  
  res.json(usuarios[index]);
});

// DELETE - Eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = usuarios.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  const usuarioEliminado = usuarios.splice(index, 1);
  res.json({ mensaje: 'Usuario eliminado', usuario: usuarioEliminado[0] });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = { app, resetDatabase };
