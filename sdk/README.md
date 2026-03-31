### Ejemplo de uso en React + TypeScript

```tsx
import "testimo-widget";

function App() {
  return (
    <testimo-widget 
      organization-id="tu-org-id" 
      theme="light" 
      layout="grid"
    ></testimo-widget>
  );
}
```

Con testimo-widget-types instalado, tendrás autocompletado y validación de props en JSX automáticamente.

# testimo-widget

[![npm version](https://img.shields.io/npm/v/testimo-widget.svg?style=flat-square)](https://www.npmjs.com/package/testimo-widget)

The official SDK for integrating Testimo Testimonial Widgets into your web application.

📦 [Ver en npm](https://www.npmjs.com/package/testimo-widget)



## Installation


### Install from npm

```bash
npm install testimo-widget
```

#### TypeScript/JSX Typings

Si usas TypeScript y/o JSX (React, Preact, etc.), instala también los tipos:

```bash
npm install testimo-widget-types
```

Esto habilita el autocompletado y tipado para <testimo-widget> en proyectos TypeScript/JSX automáticamente.

### Documentation

Consulta la documentación y ejemplos en:
https://www.npmjs.com/package/testimo-widget

### Option: Script Tag (Vanilla JS / Static Sites)

Puedes hostear el `sdk.js` tú mismo o usar un CDN (cuando esté disponible).

```html
<!-- Si es self-hosted (copiado a tu public folder) -->
<script src="/path/to/sdk.js"></script>
```

## Usage

After installation, you can use the `<testimo-widget>` web component anywhere in your HTML.

### Basic Usage

```html
<testimo-widget organization-id="YOUR_ORG_ID"></testimo-widget>
```

### Advanced Configuration

You can configure the widget with the following attributes:

| Attribute | Description | Default |
|-----------|-------------|---------|
| `organization-id` | **Required**. The ID of the organization to fetch testimonials for. | - |
| `api-url` | The base URL of the Testimo API. Use this to override the default production server (e.g. for local development or self-hosting). | `http://cubepathhackaton-api-aymrvj-31e30c-108-165-47-144.traefik.me` |
| `theme` | `light` or `dark` | `light` |
| `layout` | `grid` or `list` | `grid` |

### Example with Custom API URL and Dark Theme

```html
<testimo-widget
  organization-id="123e4567-e89b-12d3-a456-426614174000"
  api-url="https://api.testimo.app"
  theme="dark"
  layout="list"
></testimo-widget>
```


### React Example

1. Import the package in tu entry point (por ejemplo, `main.tsx` o `App.tsx`):
   ```js
   import 'testimo-widget';
   ```

2. Usa el componente:
   ```jsx
   export default function Testimonials() {
     return (
       <testimo-widget
         organization-id="YOUR_ORG_ID"
         theme="light"
         layout="grid"
       ></testimo-widget>
     );
   }
   ```


---

## Development

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Build the SDK:
    ```bash
    npm run build
    ```

## Publishing to NPM

1.  Login to NPM:
    ```bash
    npm login
    ```

2.  Publish:
    ```bash
    npm publish --access public
    ```
