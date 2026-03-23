# Testimonial CMS - Casos de Uso

## Información General de la Feature

| Campo              | Descripción                                      |
|--------------------|--------------------------------------------------|
| Nombre             | testimonial-cms                                  |
| Nombre amigable    | Testimonial CMS                                  |
| Objetivo principal | Construir un sistema CMS especializado en la gestión y publicación de testimonios y casos de éxito para sitios web e instituciones |
| Área / Dominio     | Edtech / Social Proof / Marketing de Contenidos  |
| Tipo               | Funcionalidad principal / Core                   |
| Prioridad / Épica  | [P0 / Épica Social Proof]         |
| Estado actual      | [En planificación / En desarrollo ]        |

## Casos de Uso Principales

### 1. Creación y edición de testimonios con texto, imagen y video

**Usuario principal / Rol:**  
Admin / Editor

**¿Qué problema resuelve? / Valor entregado:**  
Las instituciones y empresas con comunidades activas necesitan mostrar el impacto de sus programas o productos mediante historias reales. Permite recopilar, organizar y publicar testimonios en distintos formatos (texto, video, imagen) de forma sencilla y estructurada.

**Flujo principal (happy path):**

1. El usuario (admin/editor) accede al dashboard del CMS
2. Selecciona "Nuevo Testimonio" o edita uno existente
3. Ingresa/completa: texto del testimonio, sube imagen(es) y/o video (vía upload o integración)
4. Guarda el testimonio → queda en estado borrador/pendiente de revisión

**Escenarios alternativos importantes:**

- **Subida desde URL externa** (ej. YouTube link)  
  - Comportamiento: extrae metadata/thumbnail automáticamente vía integración

- **Edición masiva**  
  - Permite seleccionar varios y editar campos comunes (categoría, tags)

**Casos de error / Estados no felices manejados:**

- Formato de archivo no soportado → Mensaje "Solo se permiten JPG, PNG, MP4, etc."
- Video demasiado grande → "El archivo excede el límite de X MB"
- Campos obligatorios vacíos → Validación en frontend "El texto del testimonio es requerido"

**Reglas de negocio clave:**

- Soporte para múltiples formatos: texto, imagen y video
- Integración con API de YouTube y Cloudinary para manejo multimedia

**Ejemplos reales de uso en la vida diaria del producto:**

- Institución educativa sube video testimonial de alumno egresado
- Empresa agrega testimonio escrito + foto de cliente satisfecho

---

### 2. Clasificación por categorías y sistema de tags y búsqueda inteligente

**Usuario principal / Rol:**  
Admin / Editor / Visitante (búsqueda pública)

**¿Qué problema resuelve? / Valor entregado:**  
Organizar testimonios para facilitar su descubrimiento y reutilización en diferentes contextos (producto, evento, cliente, industria).

**Flujo principal (happy path):**

1. Editor asigna categoría(s) y tags al crear/editar testimonio
2. Guarda cambios
3. Visitante (o sitio externo vía API) filtra/búsqueda por categoría, tag o texto inteligente

**Escenarios alternativos importantes:**

- **Búsqueda fuzzy/full-text**  
  - Encuentra coincidencias parciales o sinónimos

**Casos de error / Estados no felices manejados:**

- Categoría no existente → Sugerir crear nueva o seleccionar de lista

**Reglas de negocio clave:**

- Clasificación por categorías: producto, evento, cliente, industria
- Sistema de tags libre + búsqueda inteligente

---

### 3. Moderación y revisión antes de publicación

**Usuario principal / Rol:**  
Editor / Admin (revisores)

**¿Qué problema resuelve? / Valor entregado:**  
Garantizar calidad, autenticidad y cumplimiento antes de mostrar públicamente los testimonios.

**Flujo principal (happy path):**

1. Editor crea testimonio → queda en "Pendiente"
2. Admin/revisor revisa contenido, multimedia y metadata
3. Aprueba → cambia a "Publicado" y ya es visible vía frontend/API

**Escenarios alternativos importantes:**

- **Rechazo con comentarios**  
  - Devuelve a editor con feedback

**Casos de error / Estados no felices manejados:**

- Contenido inapropiado detectado → Rechazado + motivo registrado

**Reglas de negocio clave:**

- Workflow de moderación obligatoria antes de publicación

---

### 4. Embeds y API pública para integrar los testimonios en otras webs

**Usuario principal / Rol:**  
Visitante / Desarrollador externo / Sitio web cliente

**¿Qué problema resuelve? / Valor entregado:**  
Permitir que los testimonios curados se muestren fácilmente en sitios web propios, landing pages, etc.

**Flujo principal (happy path):**

1. Admin genera embed code (widget, iframe, script) o consulta API
2. Desarrollador pega el código en su sitio → testimonios se renderizan (carousel, grid, etc.)
3. O bien: llamada API REST → recibe JSON con testimonios filtrados

**Escenarios alternativos importantes:**

- **Filtrado dinámico en embed** (por categoría/tag)

**Casos de error / Estados no felices manejados:**

- API key inválida → 401 Unauthorized
- Testimonio no público → No aparece en respuesta

**Reglas de negocio clave:**

- Embeds fáciles de copiar/pegar
- API REST documentada para consulta externa

## Casos de Uso Secundarios / Edge cases

- **Caso:** Roles y permisos diferenciados  
  Prioridad: Alta  
  Descripción: Roles: admin (full), editor (crea/edita), visitante (solo lectura pública)

- **Caso:** Analítica de engagement (visualizaciones, clics en embeds)  
  Prioridad: Media  
  Descripción: [No explícito en requerimientos, pero mencionado en necesidad inicial]

## Dependencias y Conexiones con otras Features

| Feature relacionada     | Tipo de dependencia   | Detalle / Qué necesita                          |
|-------------------------|-----------------------|-------------------------------------------------|
| Autenticación & Roles   | Obligatoria           | Manejo de admin, editor y visitante             |
| Cloudinary              | Obligatoria           | Almacenamiento y entrega de imágenes/videos     |
| YouTube API             | Obligatoria           | Embed y metadata de videos de YouTube           |
| Frontend público        | Integración           | Renderiza testimonios publicados vía embed/API  |

## Eventos que dispara / Escucha

- Dispara evento: `testimonial.created` → { id, status: "pending" }
- Dispara evento: `testimonial.published` → { id, categories, tags }
- Dispara evento: `testimonial.viewed` (si se implementa analítica)

## Métricas clave sugeridas

- Número de testimonios creados / publicados por mes
- Tasa de aprobación / rechazo en moderación
- Uso de API / embeds (llamadas mensuales)
- Visualizaciones de testimonios en sitios externos
- Categorías/tags más usadas

## Notas / Consideraciones / Deudas

- Integración con API de YouTube y Cloudinary para manejo multimedia
- Dashboard de administración funcional
- Documentación de API obligatoria
- Demostración de integración en sitio externo como entregable