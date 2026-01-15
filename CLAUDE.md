# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture Overview

This is a Vue 3 frontend application for stock fundamental research, built with Vite.

### Layer Structure

- **Views** (`src/views/`) - Page-level components mapped to routes. Handle route-specific data fetching and compose smaller components.
- **Components** (`src/components/`) - Reusable UI components. Receive data via props, emit events to parents.
- **Services** (`src/services/`) - API layer. All backend communication goes through services, keeping components clean of fetch logic.
- **Router** (`src/router/`) - Vue Router configuration with HTML5 history mode.

### Data Flow

1. Views call service methods on mount or user action
2. Services make HTTP requests to backend API (configured via `VITE_API_BASE_URL`)
3. Services return promises; views handle loading/error states
4. Components receive data as props, emit events for user interactions

### Key Files

- `src/main.js` - App entry point, mounts Vue and router
- `src/services/stockService.js` - Stock API service with `getStockData()`, `searchStocks()`, `getStockFundamentals()`
- `src/router/index.js` - Routes: `/` (Home), `/stock/:symbol` (StockDetail)

### API Configuration

Backend URL defaults to `http://localhost:3000`. Override with `VITE_API_BASE_URL` environment variable.

### Component Patterns

- Options API style (not Composition API)
- SearchBar uses 300ms debounce for search input
- Route params passed as props via `props: true` in router config
