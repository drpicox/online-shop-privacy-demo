# Online Shop Project Guidelines

## Project Overview
This project consists of two applications:
1. **Shop** - A demonstration e-commerce application that tracks user actions and behaviors
2. **Viewer** - A future application that will visualize the tracked data from the Shop application

The objective is to demonstrate how user actions in e-commerce platforms can be tracked and monitored, raising awareness about data privacy. The Shop application includes tracking of viewport size, cursor movements, and scroll positions.

## Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture
- **Application Structure**: 
  - `/app/shop` - Shop application
  - `/app/viewer` - Viewer application (to be implemented)
  - `/store` - Redux state management
  - `/components` - Shared React components
  - `/lib` - Utility functions and helpers

- **State Management**: 
  - Shop uses Redux Toolkit with slice pattern
  - Tracking data is collected in the `trackingSlice`
  - Each application has its own Redux store (`shopStore` and `viewerStore`)

## Code Style
- **TypeScript**: Strict mode enabled. Use explicit types for function parameters and returns.
- **Imports**: Use absolute imports with `@/` prefix (`import X from '@/components/X'`).
- **Components**: React functional components with TypeScript props interfaces.
- **State Management**: Redux Toolkit for global state, hooks for component state.
- **Naming**: 
  - PascalCase for components and types
  - camelCase for variables, functions, and instances
  - Use descriptive, semantic names
- **Redux**: Slice pattern with typed selectors and dispatch
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Error Handling**: Use try/catch for async operations, handle empty states with fallbacks
- **Client Components**: Mark with 'use client' directive when using hooks or browser APIs