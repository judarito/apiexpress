const express = require('express');
const router = express.Router();
const ProductoModel = require('../models/productoModel');

// GET - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await ProductoModel.getAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await ProductoModel.getById(id);
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, und, precio, cantidad } = req.body;
    
    // Validaciones
    if (!nombre || !und || precio === undefined || cantidad === undefined) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos: nombre, und, precio, cantidad' 
      });
    }

    if (typeof precio !== 'number' || precio < 0) {
      return res.status(400).json({ error: 'El precio debe ser un número mayor o igual a 0' });
    }

    if (!Number.isInteger(cantidad) || cantidad < 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número entero mayor o igual a 0' });
    }

    const nuevoProducto = await ProductoModel.create({ nombre, und, precio, cantidad });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, und, precio, cantidad } = req.body;
    
    // Validaciones de tipo si se proporcionan
    if (precio !== undefined && (typeof precio !== 'number' || precio < 0)) {
      return res.status(400).json({ error: 'El precio debe ser un número mayor o igual a 0' });
    }

    if (cantidad !== undefined && (!Number.isInteger(cantidad) || cantidad < 0)) {
      return res.status(400).json({ error: 'La cantidad debe ser un número entero mayor o igual a 0' });
    }

    const productoActualizado = await ProductoModel.update(id, { nombre, und, precio, cantidad });
    
    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productoEliminado = await ProductoModel.delete(id);
    
    if (!productoEliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ 
      mensaje: 'Producto eliminado exitosamente', 
      producto: productoEliminado 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
