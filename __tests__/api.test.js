const request = require('supertest');
const { app, resetDatabase } = require('../app');

describe('API REST de Usuarios', () => {
  // Resetear la base de datos antes de cada test
  beforeEach(() => {
    resetDatabase();
  });

  describe('GET /', () => {
    it('debería retornar la información de bienvenida', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje');
      expect(response.body).toHaveProperty('version', '2.0.0');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('usuarios');
      expect(response.body.endpoints).toHaveProperty('productos');
    });
  });

  describe('GET /api/usuarios', () => {
    it('debería retornar todos los usuarios', async () => {
      const response = await request(app).get('/api/usuarios');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('debería retornar usuarios con la estructura correcta', async () => {
      const response = await request(app).get('/api/usuarios');
      
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('nombre');
      expect(response.body[0]).toHaveProperty('email');
    });
  });

  describe('GET /api/usuarios/:id', () => {
    it('debería retornar un usuario específico', async () => {
      const response = await request(app).get('/api/usuarios/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('nombre', 'Juan');
      expect(response.body).toHaveProperty('email', 'juan@example.com');
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      const response = await request(app).get('/api/usuarios/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Usuario no encontrado');
    });
  });

  describe('POST /api/usuarios', () => {
    it('debería crear un nuevo usuario', async () => {
      const nuevoUsuario = {
        nombre: 'Ana',
        email: 'ana@example.com'
      };

      const response = await request(app)
        .post('/api/usuarios')
        .send(nuevoUsuario);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nombre', 'Ana');
      expect(response.body).toHaveProperty('email', 'ana@example.com');
    });

    it('debería retornar 400 si falta el nombre', async () => {
      const usuarioInvalido = {
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/usuarios')
        .send(usuarioInvalido);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Nombre y email son requeridos');
    });

    it('debería retornar 400 si falta el email', async () => {
      const usuarioInvalido = {
        nombre: 'Test'
      };

      const response = await request(app)
        .post('/api/usuarios')
        .send(usuarioInvalido);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Nombre y email son requeridos');
    });
  });

  describe('PUT /api/usuarios/:id', () => {
    it('debería actualizar un usuario existente', async () => {
      const datosActualizados = {
        nombre: 'Juan Carlos',
        email: 'juancarlos@example.com'
      };

      const response = await request(app)
        .put('/api/usuarios/1')
        .send(datosActualizados);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nombre', 'Juan Carlos');
      expect(response.body).toHaveProperty('email', 'juancarlos@example.com');
    });

    it('debería actualizar solo el nombre', async () => {
      const datosActualizados = {
        nombre: 'Juan Carlos'
      };

      const response = await request(app)
        .put('/api/usuarios/1')
        .send(datosActualizados);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nombre', 'Juan Carlos');
      expect(response.body).toHaveProperty('email', 'juan@example.com');
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      const datosActualizados = {
        nombre: 'Test'
      };

      const response = await request(app)
        .put('/api/usuarios/999')
        .send(datosActualizados);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Usuario no encontrado');
    });
  });

  describe('DELETE /api/usuarios/:id', () => {
    it('debería eliminar un usuario existente', async () => {
      const response = await request(app).delete('/api/usuarios/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje', 'Usuario eliminado');
      expect(response.body.usuario).toHaveProperty('id', 1);
    });

    it('debería retornar 404 si el usuario no existe', async () => {
      const response = await request(app).delete('/api/usuarios/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Usuario no encontrado');
    });

    it('debería reducir el número de usuarios después de eliminar', async () => {
      await request(app).delete('/api/usuarios/1');
      
      const response = await request(app).get('/api/usuarios');
      expect(response.body.length).toBe(2);
    });
  });

  describe('Rutas no encontradas', () => {
    it('debería retornar 404 para rutas no existentes', async () => {
      const response = await request(app).get('/api/ruta-inexistente');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Ruta no encontrada');
    });
  });
});
