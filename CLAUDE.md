# Online Shop Project Guidelines

## Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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