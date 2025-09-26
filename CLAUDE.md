# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit-based personal website and CV application for Nicolas Karageuzian that combines modern web technologies with semantic web capabilities.

**Key Technologies:**
- **SvelteKit 2** with **Svelte 5** (runes enabled) for the frontend framework
- **SveltePress** for static site generation and documentation
- **TypeScript** for type safety
- **Semantic Web Stack**: RDF/TTL files with Oxigraph WASM store for CV data
- **Raw CSS** for styling
- **MDSvex** for markdown processing in Svelte
- **Vitest** for unit testing, **Playwright** for E2E testing

## Development Commands

**Package Management:** Use `npm` exclusively (specified in packageManager field)

```bash
# Development
npm dev                 # Start development server on port 5173

# Building
npm build              # Build for production (outputs to dist/)

# Testing
npm test               # Run Vitest unit tests
npm test:ui            # Run Vitest with UI
npx playwright test     # Run E2E tests (auto-starts dev server)
```

## Architecture

### Semantic CV System
The core innovation is a **semantic CV system** using RDF/TTL data:

- **Data Files**: CV data stored as Turtle (.ttl) files in `static/cv/`
  - `europass.ttl` - Main person data and work experiences
  - `skills.ttl` - Skills and competencies
  - `projects/` - Individual project files
  - `orgroles/` - Organization/role definitions

- **Semantic Store**: Uses **Oxigraph WASM** for client-side SPARQL queries
  - Store initialization: `src/lib/semcv/semantic_cv_store.ts`
  - Adapters: `src/lib/semcv/adapters/` - Convert SPARQL results to TypeScript interfaces

- **CV Variants**: Support for different CV presentations via SPARQL-defined variants

### Component Architecture
- **Theme Components**: `src/theme/` - SveltePress theme customization
- **CV Components**: `src/lib/components/schemaorgcv/` - Semantic CV display components
- **Routes**:
  - `/cv` - Main CV interface with variant selection
  - `/cv/[variant]` - Specific CV variants
  - `/articles` - Technical articles
  - `/cv_work_seo` - SEO-optimized work experience page

### Static Site Generation
- **SveltePress Integration**: Custom theme with global/page layouts
- **MDSvex**: Markdown processing for articles
- **Static Adapter**: Outputs to `dist/` for static hosting

## Development Patterns

### Working with Semantic Data
1. **TTL Files**: Follow existing ontology patterns in `static/cv/ontology.ttl`
2. **Adapters**: Create new adapters in `src/lib/semcv/adapters/` for new data types
3. **SPARQL Queries**: Use consistent prefixes and follow existing query patterns
4. **Type Safety**: Define interfaces in `src/lib/semcv/models.ts`

### Component Development
- **Svelte 5 Runes**: Use `$state`, `$derived`, `$effect` for reactivity
- **Raw CSS**: 
- **File Naming**: Use PascalCase for components, camelCase for utilities

### Testing
- **Unit Tests**: Place `.test.ts` files alongside source files
- **E2E Tests**: Playwright config auto-starts dev server on port 5173
- **Semantic Tests**: Test SPARQL queries and adapter functions

## Code Quality

### TypeScript Configuration
- **Strict Mode**: Full TypeScript strict mode enabled
- **Path Aliases**: Use `$lib` for `src/lib` imports
- **Svelte Integration**: Proper TypeScript integration with Svelte 5

### Build Process
- **Vite**: Modern build tool with SvelteKit integration
- **Static Generation**: Optimized for static hosting (GitHub Pages)
- **Asset Handling**: Proper handling of TTL files and semantic data

## Data Management

### Semantic CV Data Files
- **Location**: All CV data in `static/cv/`
- **Format**: Turtle (.ttl) files following Europass and custom ontologies
- **Loading**: Client-side loading via Oxigraph for dynamic queries
- **Server-Side**: SSR loading in `+page.server.ts` for SEO and initial data

### Content Management
- **Articles**: Markdown files in `src/content/articles/`
- **Site Specs**: Documentation in `src/content/site-specs/`
- **i18n**: Internationalization support via svelte-i18n

## Performance Considerations
- **WASM Loading**: Oxigraph WASM bundle loaded asynchronously
- **Static Generation**: Pre-built pages for better performance
- **Semantic Data**: Client-side SPARQL for dynamic CV generation
- **Code Splitting**: Leverage SvelteKit's automatic code splitting