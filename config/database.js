const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'sql.freedb.tech',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'freedb_testpipeline',
  user: process.env.DB_USER || 'freedb_adminpipeline',
  password: process.env.DB_PASSWORD || 'cw3F!ZcJcJRyYZj',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
    return false;
  }
};

// Función para inicializar la tabla si no existe
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Crear tabla si no existe
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS producto (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        und VARCHAR(50) NOT NULL,
        precio DOUBLE NOT NULL,
        cantidad INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.query(createTableQuery);
    console.log('✅ Tabla "producto" verificada/creada');
    
    connection.release();
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};
