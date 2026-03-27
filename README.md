
# Testimo

<div align="center">
  <img src="assets/testimo-logo.svg" alt="Logo de Testimo" width="400" />
</div>

**Testimo** es la plataforma SaaS moderna para recolectar, gestionar y mostrar testimonios de clientes. Convierte el feedback positivo en crecimiento para tu negocio con widgets embebibles, personalizables y ultra rápidos, listos para cualquier sitio web.

![Banner Testimo](https://via.placeholder.com/1200x400?text=Testimo+Banner)

> 🚀 **Nota de Hackatón**: Este proyecto fue desarrollado durante un hackatón para demostrar una solución Full-Stack completa (NestJS, React, Web Components) con foco en experiencia de desarrollador, arquitectura hexagonal y preparación empresarial.


## 🚀 Características avanzadas

- **Gestión total de testimonios**: Alta, edición, aprobación, eliminación y visualización con validaciones y lógica de negocio real.
- **Filtros avanzados y búsqueda**: Filtra testimonios por estado, autor, calificación, categoría, tipo de media y rango de fechas. Encuentra el testimonio ideal en segundos.
- **Analíticas en tiempo real**: Visualiza vistas, clics, tasa de conversión, ranking de testimonios y tendencias históricas. Exporta métricas a Excel con un clic.
- **Multi-tenant y roles**: Cada organización ve solo sus datos. Soporte para administradores, editores y moderadores.
- **Widget SDK ultra rápido**: Integra testimonios en cualquier web (React, Vue, Angular, HTML puro) con personalización total y carga instantánea (<10kb gzipped).
- **Seguridad y privacidad**: Lista blanca de dominios, protección anti-spam, autenticación JWT y control de acceso granular.
- **Arquitectura empresarial**: Hexagonal, desacoplada, lista para escalar y personalizar. Separación estricta de dominio, infraestructura y presentación.
- **Infraestructura lista para producción**: Docker Compose, Traefik, Supabase, Cloudinary y PostgreSQL. Despliegue en minutos en cualquier nube.

## 🏆 ¿Por qué Testimo?

- **Convierte más**: Los testimonios aumentan la confianza y la conversión. Con Testimo, puedes medir el impacto real y optimizar tu estrategia.
- **Ahorra tiempo**: Panel intuitivo, filtros inteligentes y exportación directa. Menos clicks, más resultados.
- **Escala sin límites**: Desde startups hasta empresas, Testimo se adapta a tu crecimiento y necesidades.
- **Integración sin fricción**: Un solo script, sin dependencias, y soporte para cualquier stack moderno.

## ⚙️ Cómo funciona

1. **Recolecta testimonios**: Tus clientes envían feedback desde tu web o desde el dashboard.
2. **Modera y aprueba**: Filtra, aprueba o elimina testimonios fácilmente desde el panel de administración.
3. **Analiza y exporta**: Visualiza métricas clave, aplica filtros avanzados y exporta los datos para reportes o marketing.
4. **Publica en tu web**: Inserta el widget y muestra los mejores testimonios en segundos, con personalización total.

## 🛠️ Tecnologías utilizadas

- **Backend**: NestJS, TypeORM, PostgreSQL.
- **Frontend**: React, Vite, TypeScript, CSS Modules.
- **SDK**: Web Components en TypeScript (Vite Library Mode).
- **Infraestructura**: Docker, Traefik, Supabase (opcional), Cloudinary.

## 🚀 Primeros pasos

### 1. Instalación rápida

Puedes levantar todo el stack localmente usando Docker Compose:

```bash
docker-compose up -d
```

### 2. Uso del SDK (Widget)

Incorpora el widget en tu sitio web:

```html
<!-- Usar la API Cloud de Testimo (por defecto) -->
<script src="https://cdn.testimo.app/sdk.js"></script>
<cubepath-widget organization-id="TU_ORG_ID"></cubepath-widget>

<!-- O apunta a tu instancia auto-hospedada -->
<cubepath-widget 
  organization-id="TU_ORG_ID" 
  api-url="https://api.tu-dominio.com"
></cubepath-widget>
```

### 3. Desarrollo local

#### Backend (API)
```bash
cd server
npm install
npm run start:dev
```

#### Frontend (Dashboard)
```bash
cd client
npm install
npm run dev
```

#### SDK (Widget)
```bash
cd sdk
npm install
npm run build
```

## 📦 Estructura del proyecto

```
/
├── client/     # Dashboard React para gestión de testimonios
├── server/     # Backend API NestJS
├── sdk/        # Biblioteca del widget embebible
└── assets/     # Recursos estáticos y media
```

## 🧩 Arquitectura y buenas prácticas

- **Componentización avanzada**: Cada sección de características está implementada como un componente React independiente, facilitando la extensión y el mantenimiento.
- **Estilos modernos**: Uso de CSS Modules para un diseño atractivo y consistente.
- **Escapado seguro de HTML**: Los bloques de código y ejemplos usan técnicas de escape para evitar errores de JSX/Babel.
- **Documentación clara**: Cada sección y funcionalidad está documentada y estructurada para facilitar la comprensión y la colaboración.

## 📄 Licencia

Este proyecto es software de código abierto bajo la licencia [MIT](LICENSE).
