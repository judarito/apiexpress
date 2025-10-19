# Guía de Testing y CI/CD

## 📋 Resumen

Este proyecto incluye un conjunto completo de tests automatizados y configuración de CI/CD para múltiples plataformas.

## 🧪 Tests Automatizados

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

### Cobertura de Tests

Los tests cubren todos los endpoints de la API:

- ✅ **GET /** - Ruta principal
- ✅ **GET /api/usuarios** - Listar todos los usuarios
- ✅ **GET /api/usuarios/:id** - Obtener usuario por ID
- ✅ **POST /api/usuarios** - Crear nuevo usuario
- ✅ **PUT /api/usuarios/:id** - Actualizar usuario
- ✅ **DELETE /api/usuarios/:id** - Eliminar usuario
- ✅ **Rutas 404** - Manejo de rutas no encontradas

### Estadísticas

```
✅ 15 tests pasando
📊 100% de cobertura de endpoints
⚡ Tiempo de ejecución: ~1.3s
```

## 🔄 Pipelines de CI/CD

### GitHub Actions

El proyecto incluye un pipeline de GitHub Actions (`.github/workflows/ci.yml`) que:

- ✅ Se ejecuta en cada push y pull request
- ✅ Prueba con Node.js 18.x y 20.x
- ✅ Ejecuta todos los tests
- ✅ Genera reportes de cobertura
- ✅ Sube resultados a Codecov

**Para activarlo:**
1. Haz push de tu código a GitHub
2. Los tests se ejecutarán automáticamente
3. Revisa los resultados en la pestaña "Actions"

### Azure Pipelines

El proyecto incluye configuración para Azure DevOps (`azure-pipelines.yml`) que:

- ✅ Se ejecuta en cada push a main/develop
- ✅ Prueba con múltiples versiones de Node.js
- ✅ Publica resultados de tests
- ✅ Publica cobertura de código

**Para activarlo:**
1. Crea un proyecto en Azure DevOps
2. Conecta tu repositorio
3. Selecciona el archivo `azure-pipelines.yml`
4. El pipeline se configurará automáticamente

## 🐳 Docker

### Construir Imagen

```bash
docker build -t firstapi .
```

### Ejecutar Contenedor

```bash
docker run -p 3000:3000 firstapi
```

### Características del Dockerfile

- ✅ Build multi-stage para optimizar tamaño
- ✅ Usuario no-root para seguridad
- ✅ Imagen basada en Alpine (ligera)
- ✅ Variables de entorno configurables

## 📁 Estructura del Proyecto

```
firstapi/
├── __tests__/              # Tests automatizados
│   └── api.test.js        # Suite de tests de la API
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions pipeline
├── app.js                 # Aplicación Express (separada del servidor)
├── index.js               # Punto de entrada del servidor
├── jest.config.js         # Configuración de Jest
├── azure-pipelines.yml    # Azure DevOps pipeline
├── Dockerfile             # Configuración Docker
├── .dockerignore          # Archivos excluidos de Docker
└── package.json           # Dependencias y scripts
```

## 🛠️ Tecnologías Utilizadas

- **Express**: Framework web
- **Jest**: Framework de testing
- **Supertest**: Testing de endpoints HTTP
- **jest-junit**: Reportes XML para CI/CD

## 📊 Reportes

Los tests generan varios tipos de reportes:

- **Consola**: Resultados inmediatos durante desarrollo
- **Coverage**: Reporte HTML en `coverage/lcov-report/index.html`
- **JUnit XML**: Para integración con CI/CD en `coverage/junit.xml`

## 🚀 Mejores Prácticas Implementadas

1. **Separación de Responsabilidades**: `app.js` vs `index.js`
2. **Tests Aislados**: Cada test resetea la base de datos
3. **Cobertura Completa**: Todos los endpoints testeados
4. **CI/CD Multi-plataforma**: GitHub Actions y Azure Pipelines
5. **Containerización**: Docker listo para producción
6. **Reportes**: Múltiples formatos para diferentes necesidades

## 🔍 Debugging Tests

Si un test falla:

```bash
# Ver resultados detallados
npm test -- --verbose

# Ejecutar un test específico
npm test -- -t "nombre del test"

# Ver cobertura de código
npm run test:coverage
```

## 📝 Agregar Nuevos Tests

1. Crea tests en `__tests__/nombre.test.js`
2. Usa el patrón describe/it de Jest
3. Usa supertest para llamadas HTTP
4. Asegúrate de resetear el estado antes de cada test

Ejemplo:

```javascript
describe('Nueva funcionalidad', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('debería hacer algo específico', async () => {
    const response = await request(app).get('/ruta');
    expect(response.status).toBe(200);
  });
});
```

## 🎯 Próximos Pasos

- [ ] Agregar tests de integración
- [ ] Configurar tests E2E
- [ ] Agregar linting (ESLint)
- [ ] Configurar pre-commit hooks
- [ ] Agregar tests de rendimiento
- [ ] Implementar tests de seguridad
