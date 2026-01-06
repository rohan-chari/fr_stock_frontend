# Stock Fundamental Research Frontend

A Vue.js application for stock fundamental research built with industry best practices.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── SearchBar.vue   # Search input component
│   └── README.md
├── views/              # Page-level components (routes)
│   ├── Home.vue        # Landing page
│   ├── StockDetail.vue # Stock detail page
│   └── README.md
├── router/             # Vue Router configuration
│   └── index.js        # Route definitions
├── services/           # API services and business logic
│   ├── stockService.js # Stock API service
│   └── README.md
├── App.vue             # Root component
├── main.js             # Application entry point
└── style.css           # Global styles
```

## Architecture

This project follows Vue.js best practices:

- **Component-based architecture** - Reusable, single-responsibility components
- **Router-based navigation** - Vue Router for page routing
- **Service layer** - Separated API logic from components
- **Views/Pages** - Top-level route components
- **Separation of concerns** - Clear boundaries between layers

## Routes

- `/` - Home page with search functionality
- `/stock/:symbol` - Stock detail page (e.g., `/stock/AAPL`)

## Environment Variables

Create a `.env` file based on `.env.example` to configure API endpoints.

