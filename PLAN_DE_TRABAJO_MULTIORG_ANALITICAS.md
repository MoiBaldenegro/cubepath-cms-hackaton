# Plan de Trabajo: Multiorganización Real y Analíticas de Widget

## 1. Soporte Multiorganización Real (Multi-tenant)

### Objetivo
Asegurar que todos los datos y operaciones estén correctamente aislados por organización en backend y frontend, siguiendo hexagonal Architecture y los patrones existentes.

### Subtareas
- [ ] Revisar y reforzar el uso de `OrganizationId` en entidades, casos de uso y repositorios (NestJS, TypeORM)
- [ ] Garantizar que todos los endpoints (REST y widget) reciben y validan el `organizationId`
- [ ] Revisar y reforzar el filtrado por organización en queries y servicios
- [ ] Revisar el contexto de autenticación en frontend y su propagación al widget
- [ ] Mejorar UI/UX para admins multi-organización (filtros, selección, seguridad)
- [ ] Tests de integración multi-tenant

## 2. Analíticas de Performance del Widget

### Objetivo
Permitir a los administradores visualizar métricas clave de uso del widget: vistas, clics, conversiones, etc.

### Subtareas
- [ ] Definir modelo de datos y endpoints para eventos de analítica (NestJS)
- [ ] Implementar tracking de vistas/clics en el SDK/widget
- [ ] Crear endpoints para registrar y consultar métricas
- [ ] Visualizar analíticas en el dashboard admin (React)
- [ ] Tests de integración y validación de métricas

## 3. Buenas Prácticas y Convenciones
- Seguir estructura de carpetas y patrones de Clean Architecture
- Componentización y separación de concerns en frontend
- Tipado estricto y validaciones en backend y frontend
- Documentar endpoints y modelos nuevos

---

## Siguiente paso inmediato
1. Revisar y reforzar el uso de `OrganizationId` en backend (entidades, casos de uso, repositorios, endpoints)
2. Luego, avanzar a tracking y endpoints de analíticas

---

Este plan se irá marcando y actualizando conforme se avance en la implementación.
