const request = require('supertest');
const { app } = require('../app');
const ProductoModel = require('../models/productoModel');
const { pool } = require('../config/database');

describe('API REST de Productos (MySQL)', () => {
  // Limpiar la base de datos antes de todos los tests
  beforeAll(async () => {
    await ProductoModel.deleteAll();
  });

  // Limpiar la base de datos antes de cada test
  beforeEach(async () => {
    await ProductoModel.deleteAll();
  });

  // Limpiar después de todos los tests y cerrar conexiones
  afterAll(async () => {
    await ProductoModel.deleteAll();
    await pool.end();
  });

  describe('GET /api/productos', () => {
    it('debería retornar un array vacío cuando no hay productos', async () => {
      const response = await request(app).get('/api/productos');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('debería retornar todos los productos', async () => {
      // Crear productos de prueba
      await ProductoModel.create({ nombre: 'Laptop', und: 'unidad', precio: 1200.50, cantidad: 10 });
      await ProductoModel.create({ nombre: 'Mouse', und: 'unidad', precio: 25.99, cantidad: 50 });

      const response = await request(app).get('/api/productos');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('debería retornar productos con la estructura correcta', async () => {
      await ProductoModel.create({ nombre: 'Teclado', und: 'unidad', precio: 45.00, cantidad: 30 });

      const response = await request(app).get('/api/productos');
      
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('nombre');
      expect(response.body[0]).toHaveProperty('und');
      expect(response.body[0]).toHaveProperty('precio');
      expect(response.body[0]).toHaveProperty('cantidad');
    });
  });

  describe('GET /api/productos/:id', () => {
    it('debería retornar un producto específico', async () => {
      const producto = await ProductoModel.create({ 
        nombre: 'Monitor', 
        und: 'unidad', 
        precio: 350.00, 
        cantidad: 15 
      });

      const response = await request(app).get(`/api/productos/${producto.id}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', producto.id);
      expect(response.body).toHaveProperty('nombre', 'Monitor');
      expect(response.body).toHaveProperty('precio', 350.00);
    });

    it('debería retornar 404 si el producto no existe', async () => {
      const response = await request(app).get('/api/productos/99999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Producto no encontrado');
    });
  });

  describe('POST /api/productos', () => {
    it('debería crear un nuevo producto', async () => {
      const nuevoProducto = {
        nombre: 'Impresora',
        und: 'unidad',
        precio: 280.00,
        cantidad: 5
      };

      const response = await request(app)
        .post('/api/productos')
        .send(nuevoProducto);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nombre', 'Impresora');
      expect(response.body).toHaveProperty('und', 'unidad');
      expect(response.body).toHaveProperty('precio', 280.00);
      expect(response.body).toHaveProperty('cantidad', 5);
    });

    it('debería retornar 400 si faltan campos requeridos', async () => {
      const productoInvalido = {
        nombre: 'Test',
        und: 'unidad'
        // Falta precio y cantidad
      };

      const response = await request(app)
        .post('/api/productos')
        .send(productoInvalido);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('debería retornar 400 si el precio es negativo', async () => {
      const productoInvalido = {
        nombre: 'Test',
        und: 'unidad',
        precio: -10,
        cantidad: 5
      };

      const response = await request(app)
        .post('/api/productos')
        .send(productoInvalido);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('precio');
    });

    it('debería retornar 400 si la cantidad no es un entero', async () => {
      const productoInvalido = {
        nombre: 'Test',
        und: 'unidad',
        precio: 100,
        cantidad: 5.5
      };

      const response = await request(app)
        .post('/api/productos')
        .send(productoInvalido);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('cantidad');
    });
  });

  describe('PUT /api/productos/:id', () => {
    it('debería actualizar un producto existente', async () => {
      const producto = await ProductoModel.create({ 
        nombre: 'Scanner', 
        und: 'unidad', 
        precio: 150.00, 
        cantidad: 8 
      });

      const datosActualizados = {
        nombre: 'Scanner Pro',
        precio: 180.00,
        cantidad: 10
      };

      const response = await request(app)
        .put(`/api/productos/${producto.id}`)
        .send(datosActualizados);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nombre', 'Scanner Pro');
      expect(response.body).toHaveProperty('precio', 180.00);
      expect(response.body).toHaveProperty('cantidad', 10);
    });

    it('debería actualizar solo campos específicos', async () => {
      const producto = await ProductoModel.create({ 
        nombre: 'Webcam', 
        und: 'unidad', 
        precio: 80.00, 
        cantidad: 20 
      });

      // Pequeña espera para asegurar que el producto está en la DB
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verificar que el producto existe antes de actualizar
      const verificar = await ProductoModel.getById(producto.id);
      expect(verificar).toBeTruthy();

      const datosActualizados = {
        precio: 75.00
      };

      const response = await request(app)
        .put(`/api/productos/${producto.id}`)
        .send(datosActualizados);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nombre', 'Webcam');
      expect(response.body).toHaveProperty('precio', 75.00);
      expect(response.body).toHaveProperty('cantidad', 20);
    });

    it('debería retornar 404 si el producto no existe', async () => {
      const datosActualizados = {
        nombre: 'Test'
      };

      const response = await request(app)
        .put('/api/productos/99999')
        .send(datosActualizados);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Producto no encontrado');
    });

    it('debería retornar 400 si el precio es inválido', async () => {
      const producto = await ProductoModel.create({ 
        nombre: 'Test', 
        und: 'unidad', 
        precio: 100.00, 
        cantidad: 5 
      });

      const response = await request(app)
        .put(`/api/productos/${producto.id}`)
        .send({ precio: -50 });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('precio');
    });
  });

  describe('DELETE /api/productos/:id', () => {
    it('debería eliminar un producto existente', async () => {
      const producto = await ProductoModel.create({ 
        nombre: 'Auriculares', 
        und: 'unidad', 
        precio: 60.00, 
        cantidad: 25 
      });

      // Pequeña espera para asegurar que el producto está en la DB
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verificar que el producto existe antes de eliminar
      const verificar = await ProductoModel.getById(producto.id);
      expect(verificar).toBeTruthy();

      const response = await request(app).delete(`/api/productos/${producto.id}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('mensaje', 'Producto eliminado exitosamente');
      expect(response.body.producto).toHaveProperty('id', producto.id);
    });

    it('debería retornar 404 si el producto no existe', async () => {
      const response = await request(app).delete('/api/productos/99999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Producto no encontrado');
    });

    it('debería reducir el número de productos después de eliminar', async () => {
      const producto1 = await ProductoModel.create({ nombre: 'Producto 1', und: 'unidad', precio: 10, cantidad: 1 });
      const producto2 = await ProductoModel.create({ nombre: 'Producto 2', und: 'unidad', precio: 20, cantidad: 2 });
      
      // Pequeña espera para asegurar que los productos están en la DB
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verificar que ambos productos existen
      const verificar1 = await ProductoModel.getById(producto1.id);
      const verificar2 = await ProductoModel.getById(producto2.id);
      expect(verificar1).toBeTruthy();
      expect(verificar2).toBeTruthy();

      const deleteResponse = await request(app).delete(`/api/productos/${producto2.id}`);
      expect(deleteResponse.status).toBe(200);
      
      // Pequeña espera después de eliminar
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await request(app).get('/api/productos');
      expect(response.body.length).toBe(1);
    });
  });
});
