
# Testimo

<div align="center">
  <img src="assets/testimo-logo.svg" alt="Logo de Testimo" width="400" />
</div>

**Testimo** es la plataforma SaaS moderna para recolectar, gestionar y mostrar testimonios de clientes. Convierte el feedback positivo en crecimiento para tu negocio con widgets embebibles, personalizables y ultra rápidos, listos para cualquier sitio web.

![Banner Testimo](https://via.placeholder.com/1200x400?text=Testimo+Banner)

> 🚀 **Nota de Hackatón**: Este proyecto fue desarrollado durante un hackatón para demostrar una solución Full-Stack completa (NestJS, React, Web Components) con foco en experiencia de desarrollador, arquitectura hexagonal y preparación empresarial.

## ✨ Características principales

- **SDK multiplataforma**: Integra widgets en React, Vue, Angular o Vanilla JS con una sola línea de código.
- **Listo para auto-hospedaje**: Usa nuestra nube o despliega tu propia instancia para control total de tus datos.
- **Widgets personalizables**: Soporte para grid, lista, modos oscuro/claro y CSS a medida.
- **Seguridad empresarial**: Lista blanca de dominios y protección anti-spam integrada.
- **Rápido y liviano**: SDK Web Component sin dependencias (< 10kb gzipped).
- **Arquitectura hexagonal**: Separación clara de dominios, infraestructura y presentación para máxima escalabilidad.
- **Carga y gestión de imágenes**: Soporte para subir imágenes de testimonios vía Cloudinary.

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
