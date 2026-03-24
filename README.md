# Testimo

<div align="center">
  <img src="assets/testimo-logo.svg" alt="Testimo Logo" width="400" />
</div>

**Testimo** is the modern SaaS platform for collecting, managing, and showcasing customer testimonials. Turn customer love into business growth with beautiful, embeddable widgets that work anywhere.

![Testimo Banner](https://via.placeholder.com/1200x400?text=Testimo+Banner)

> 🚀 **Hackathon Project Note**: This project was built during a hackathon to demonstrate a complete Full-Stack solution (NestJS, React, Web Components) with a focus on developer experience and enterprise-readiness.

## ✨ Features

- **Multi-Platform SDK**: Embed widgets in React, Vue, Angular, or Vanilla JS with a single line of code.
- **Self-Hosted Ready**: Use our cloud or host your own instance for full data sovereignty.
- **Customizable Widgets**: Grid, List, Dark/Light modes, and custom CSS support.
- **Enterprise Security**: Domain whitelisting and spam protection built-in.
- **Fast & Lightweight**: Zero-dependency Web Component SDK (< 10kb gzipped).

## 🛠️ Tech Stack

- **Backend**: NestJS, TypeORM, PostgreSQL.
- **Frontend**: React, Vite, TypeScript.
- **SDK**: Vanilla TypeScript Web Components (Vite Library Mode).
- **Infrastructure**: Docker, Traefik, Supabase (optional).

## 🚀 Getting Started

### 1. Installation

You can run the entire stack locally using Docker Compose:

```bash
docker-compose up -d
```

### 2. Usage (SDK)

Embed the widget in your website:

```html
<!-- Use the Testimo Cloud API (Default) -->
<script src="https://cdn.testimo.app/sdk.js"></script>
<cubepath-widget organization-id="YOUR_ORG_ID"></cubepath-widget>

<!-- OR Point to your Self-Hosted Instance -->
<cubepath-widget 
  organization-id="YOUR_ORG_ID" 
  api-url="https://api.your-domain.com"
></cubepath-widget>
```

### 3. Development

#### Server (API)
```bash
cd server
npm install
npm run start:dev
```

#### Client (Dashboard)
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

## 📦 Project Structure

```
/
├── client/     # React Dashboard for managing testimonials
├── server/     # NestJS API Backend
├── sdk/        # The embeddable widget library
└── docker/     # Infrastructure configuration
```

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).
