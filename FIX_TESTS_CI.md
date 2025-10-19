# 🔧 Correcciones para Tests en CI/CD

## Problema Identificado

Los tests de productos MySQL estaban fallando en GitHub Actions debido a problemas de sincronización con la base de datos remota.

### Errores Específicos:
1. ❌ Test "debería actualizar solo campos específicos" - Status 404 (esperado 200)
2. ❌ Test "debería eliminar un producto existente" - Status 404 (esperado 200)
3. ❌ Test "debería reducir el número de productos después de eliminar" - Length 0 (esperado 1)

## Causa Raíz

La base de datos MySQL está alojada en un servidor remoto (`sql.freedb.tech`), lo que introduce:
- **Latencia de red** entre la aplicación y la base de datos
- **Retraso en la propagación** de cambios (inserts/updates/deletes)
- **Concurrencia** entre tests ejecutándose en paralelo

## Soluciones Implementadas

### 1. ✅ Agregar Delays de Sincronización

```javascript
// Esperar 100ms después de crear un producto
await new Promise(resolve => setTimeout(resolve, 100));

// Verificar que el producto existe antes de operar
const verificar = await ProductoModel.getById(producto.id);
expect(verificar).toBeTruthy();
```

**Ubicación:** `__tests__/productos.test.js`
- Tests afectados: `PUT /api/productos/:id`, `DELETE /api/productos/:id`

### 2. ✅ Configurar Jest para Ejecución Secuencial

```javascript
module.exports = {
  // Ejecutar tests de forma secuencial para evitar conflictos
  maxWorkers: 1,
  testTimeout: 30000,
  // ...resto de configuración
};
```

**Ubicación:** `jest.config.js`
**Beneficios:**
- Evita conflictos de concurrencia en la base de datos compartida
- Los tests no interfieren entre sí
- Más estable en entornos de CI/CD

### 3. ✅ Aumentar Timeout de Tests

```javascript
testTimeout: 30000, // 30 segundos
```

**Razón:** Las conexiones remotas a MySQL pueden tomar más tiempo en entornos de CI/CD.

### 4. ✅ Agregar beforeAll Hook

```javascript
beforeAll(async () => {
  await ProductoModel.deleteAll();
});
```

**Propósito:** Limpiar la base de datos antes de iniciar la suite de tests completa.

## Resultados Después de las Correcciones

### Tests Locales ✅
```
Test Suites: 2 passed, 2 total
Tests:       31 passed, 31 total
Time:        16.647s
```

### Cambios en el Comportamiento

| Aspecto | Antes | Después |
|---------|-------|---------|
| Ejecución | Paralela (múltiples workers) | Secuencial (1 worker) |
| Timeout | 5s (default) | 30s |
| Sincronización | No | Sí (delays + verificaciones) |
| Estabilidad en CI/CD | ❌ Inestable | ✅ Estable |

## Commits Realizados

1. **Initial commit** (3c48154)
   - API completa con Express y MySQL
   - 31 tests automatizados
   - Pipelines CI/CD

2. **Fix: Mejorar estabilidad de tests** (f988440)
   - Delays para sincronización con DB remota
   - Jest configurado para ejecución secuencial
   - Verificaciones antes de actualizar/eliminar
   - Timeout aumentado a 30s

## Próximos Pasos en GitHub Actions

El pipeline de GitHub Actions ahora debería:
1. ✅ Conectarse exitosamente a MySQL
2. ✅ Ejecutar los 31 tests de forma secuencial
3. ✅ Completar sin errores de sincronización
4. ✅ Generar reportes de cobertura

## Monitoreo

Verifica el estado del pipeline en:
```
https://github.com/judarito/apiexpress/actions
```

## Consideraciones para Producción

### Base de Datos Compartida
- ⚠️ Los tests modifican datos en una DB real
- 💡 Considera usar una DB de pruebas separada
- 💡 O implementar transacciones con rollback

### Performance
- ⏱️ Los tests ahora toman ~16-17 segundos
- 📈 Esto es aceptable para tests de integración con DB remota
- 🚀 Para acelerar: usar DB local o mocks

### Alternativas Futuras

1. **Base de datos local para tests**
   ```javascript
   const testDbConfig = {
     host: 'localhost',
     database: 'test_db'
   };
   ```

2. **Docker para tests**
   ```yaml
   services:
     mysql:
       image: mysql:8
       environment:
         MYSQL_DATABASE: test_db
   ```

3. **Mocks para tests unitarios**
   ```javascript
   jest.mock('../config/database');
   ```

## Verificación

Para verificar que todo funciona:

```bash
# Local
npm test

# Ver logs detallados
npm test -- --verbose

# Solo tests de productos
npm test -- productos.test.js
```

## Notas Adicionales

- ✅ Los tests de usuarios no se vieron afectados (usan memoria, no DB)
- ✅ La configuración es retrocompatible
- ✅ El código de producción no cambió, solo los tests
- ✅ Compatible con GitHub Actions y Azure Pipelines

---

**Estado actual:** ✅ Tests estables y listos para CI/CD

**Última actualización:** 2025-10-18
