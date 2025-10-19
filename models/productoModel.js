const { pool } = require('../config/database');

class ProductoModel {
  // Obtener todos los productos
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM producto ORDER BY id DESC');
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  // Obtener un producto por ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  // Crear un nuevo producto
  static async create(producto) {
    const { nombre, und, precio, cantidad } = producto;
    try {
      const [result] = await pool.query(
        'INSERT INTO producto (nombre, und, precio, cantidad) VALUES (?, ?, ?, ?)',
        [nombre, und, precio, cantidad]
      );
      return {
        id: result.insertId,
        nombre,
        und,
        precio,
        cantidad
      };
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  // Actualizar un producto
  static async update(id, producto) {
    const { nombre, und, precio, cantidad } = producto;
    try {
      // Primero verificar si existe
      const existing = await this.getById(id);
      if (!existing) {
        return null;
      }

      // Construir query dinámicamente solo con campos proporcionados
      const updates = [];
      const values = [];

      if (nombre !== undefined) {
        updates.push('nombre = ?');
        values.push(nombre);
      }
      if (und !== undefined) {
        updates.push('und = ?');
        values.push(und);
      }
      if (precio !== undefined) {
        updates.push('precio = ?');
        values.push(precio);
      }
      if (cantidad !== undefined) {
        updates.push('cantidad = ?');
        values.push(cantidad);
      }

      if (updates.length === 0) {
        return existing;
      }

      values.push(id);
      const query = `UPDATE producto SET ${updates.join(', ')} WHERE id = ?`;
      
      await pool.query(query, values);
      
      // Retornar el producto actualizado
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  // Eliminar un producto
  
  static async delete(id) {
    try {
      // Primero obtener el producto antes de eliminarlo
      const producto = await this.getById(id);
      if (!producto) {
        return null;
      }

      await pool.query('DELETE FROM producto WHERE id = ?', [id]);
      return producto;
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  // Limpiar todos los productos (útil para tests)
  static async deleteAll() {
    try {
      await pool.query('DELETE FROM producto');
      await pool.query('ALTER TABLE producto AUTO_INCREMENT = 1');
    } catch (error) {
      throw new Error(`Error al limpiar productos: ${error.message}`);
    }
  }
}

module.exports = ProductoModel;
