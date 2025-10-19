const { app } = require('./app');
const { testConnection, initializeDatabase } = require('./config/database');
const PORT = process.env.PORT || 3000;

// Inicializar la aplicación
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Inicializar la base de datos (crear tablas si no existen)
    await initializeDatabase();
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📝 API Usuarios: http://localhost:${PORT}/api/usuarios`);
      console.log(`📦 API Productos: http://localhost:${PORT}/api/productos`);
      console.log(`\n✅ Conectado a MySQL: freedb_testpipeline\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
