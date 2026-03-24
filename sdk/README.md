# @cubepath/widget

The official SDK for integrating CubePath Testimonial Widgets into your web application.

## Installation

### Option 1: Using NPM (Recommended for React/Vue/Angular)

```bash
npm install @cubepath/widget
```

### Option 2: Using a Script Tag (Vanilla JS / Static Sites)

You can host the `sdk.js` file yourself or use a CDN (once published).

```html
<!-- If self-hosted (e.g. copied to your public folder) -->
<script src="/path/to/sdk.js"></script>
```

## Usage

After installation, you can use the `<cubepath-widget>` web component anywhere in your HTML.

### Basic Usage

```html
<cubepath-widget organization-id="YOUR_ORG_ID"></cubepath-widget>
```

### Advanced Configuration

You can configure the widget with the following attributes:

| Attribute | Description | Default |
|-----------|-------------|---------|
| `organization-id` | **Required**. The ID of the organization to fetch testimonials for. | - |
| `api-url` | The base URL of the CubePath API. Use this to override the default production server (e.g. for local development or self-hosting). | `http://cubepathhackaton-api-aymrvj-31e30c-108-165-47-144.traefik.me` |
| `theme` | `light` or `dark` | `light` |
| `layout` | `grid` or `list` | `grid` |

### Example with Custom API URL and Dark Theme

```html
<cubepath-widget
  organization-id="123e4567-e89b-12d3-a456-426614174000"
  api-url="https://api.cubepath.com"
  theme="dark"
  layout="list"
></cubepath-widget>
```

### React Example

1. Import the package in your entry point (e.g., `main.tsx` or `App.tsx`):
   ```typescript
   import '@cubepath/widget';
   ```

2. Use the component (you may need to extend JSX types for TypeScript):
   ```tsx
   export default function Testimonials() {
     return (
       <cubepath-widget
         organization-id="my-org-id"
         api-url="https://api.cubepath.com"
       ></cubepath-widget>
     );
   }
   ```

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
