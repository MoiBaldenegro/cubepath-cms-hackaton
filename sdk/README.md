# @cubepath/widget

This is the SDK for the CubePath Testimonial Widget.

## Installation

```bash
npm install @cubepath/widget
```

## Usage

### Vanilla JS / HTML

```html
<script type="module" src="https://unpkg.com/@cubepath/widget/dist/cubepath-widget.js"></script>
<cubepath-widget organization-id="YOUR_ORG_ID"></cubepath-widget>
```

### React / Vue / Angular

1.  Import the package:
    ```javascript
    import '@cubepath/widget';
    ```

2.  Use the component:
    ```html
    <cubepath-widget organization-id="YOUR_ORG_ID"></cubepath-widget>
    ```

## Development

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Build:
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
