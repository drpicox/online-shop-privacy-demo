# Online Shop Project Guidelines

## Project Overview
This project consists of two applications:
1. **Shop** - A demonstration e-commerce application that tracks user actions and behaviors
2. **Viewer** - An application that visualizes tracked data from all Shop clients in real-time

The objective is to demonstrate how user actions in e-commerce platforms can be tracked and monitored, raising awareness about data privacy. The Shop application includes tracking of viewport size, cursor movements, and scroll positions. All user actions in the Shop application are captured and transmitted in real-time to the Viewer application, which can display and replay these actions across multiple client sessions.

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
  
- **Real-time Communication**:
  - Actions from shop clients are intercepted by Redux middleware
  - All actions are transmitted via WebSockets to the server
  - The Viewer application receives these actions in real-time
  - Viewer maintains and updates client states by replaying received actions
  - Viewer can request current full state from any connected client when needed

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

## Viewer Application Features
- **Real-time Action Monitoring**: View actions from all connected shop clients as they occur
- **Client State Visualization**: See the current state of any connected shop client
- **Action Replay**: The viewer updates client states by replaying actions against the original state
- **Multi-client Tracking**: Monitor multiple shop clients simultaneously
- **On-demand State Requests**: Request the full current state from any connected client