# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React Three Fiber (R3F) TypeScript starter template built with Vite, designed for creating 3D web experiences with custom shaders. The project uses a modern React 19 + Three.js stack with comprehensive shader support and development tooling.

## Essential Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all TypeScript/TSX files

### Package Management
This project uses npm as the package manager (bun.lock exists but npm is the primary manager).

## Architecture Overview

### Core Stack
- **React 19** with TypeScript in strict mode
- **React Three Fiber** for declarative Three.js
- **Vite** for fast development and building
- **TailwindCSS 4.x** for styling

### Key Dependencies Architecture
- **@react-three/fiber**: Core R3F for React-Three.js bridge
- **@react-three/drei**: Helper components (OrbitControls, Environment, etc.)
- **@react-three/postprocessing**: Post-processing effects pipeline
- **three-custom-shader-material**: For custom shader integration
- **leva**: Debug UI controls (collapsed by default in production-like setup)
- **r3f-perf**: Performance monitoring overlay
- **GSAP**: Animation library with React integration

### Shader System
- **vite-plugin-glsl**: Handles shader imports (.glsl, .wgsl, .vert, .frag, .vs, .fs)
- Shader files can be imported directly as strings
- TypeScript declarations for all shader formats in `src/types/global.d.ts`
- Compression disabled for development, watch mode enabled

### Project Structure
```
src/
├── main.tsx          # App entry point with Canvas setup
├── Experience.tsx    # Main 3D scene component
├── index.css         # Global styles (TailwindCSS + full-screen setup)
├── types/
│   └── global.d.ts   # Asset type declarations (shaders, models, textures, audio)
└── vite-env.d.ts     # Vite environment types
```

### Canvas Configuration
- Antialiasing enabled
- Shadow mapping enabled
- Camera: 45° FOV, 0.1-200 near/far
- Full-screen setup via CSS

### Type System
- Strict TypeScript with comprehensive linting
- Custom type declarations for 3D assets (GLB, GLTF, FBX, OBJ, MTL)
- Texture formats (JPG, PNG, WebP, EXR, Basis, KTX2)
- Shader formats (GLSL, VERT, FRAG)
- HDR environment maps and audio files

### Development Features
- Hot module replacement for shaders
- Leva debug controls (background color example implemented)
- Performance monitoring overlay
- ESLint with React hooks and refresh rules
- Path aliases configured for clean imports

## Key Patterns

### Scene Architecture
The main scene logic lives in `Experience.tsx`. This component should contain:
- 3D objects and lighting setup
- Leva controls for debugging
- Environment configuration
- Performance monitoring

### Asset Imports
Thanks to type declarations, you can import assets directly:
```typescript
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.frag'
import model from './models/scene.glb'
```

### Custom Shaders
Use `three-custom-shader-material` for extending existing Three.js materials with custom shaders while maintaining features like lighting and shadows.

## Development Workflow

1. **Scene Development**: Modify `Experience.tsx` for 3D content
2. **Shader Development**: Create `.glsl/.vert/.frag` files and import them
3. **Debug Controls**: Add Leva controls for real-time parameter tweaking
4. **Performance**: Monitor via r3f-perf overlay (top-left)
5. **Styling**: Use TailwindCSS for UI elements outside the Canvas

## Build System Notes

- TypeScript compilation happens before Vite build
- Shader files are bundled as strings
- Production builds exclude development tools
- Path aliases support both relative and absolute imports

## Testing Approach
No test runner is currently configured. For testing 3D scenes, consider:
- Visual regression testing
- Unit tests for utility functions
- Integration tests for shader compilation
