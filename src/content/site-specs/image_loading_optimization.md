# Image Loading Optimization Specifications

## Overview

Comprehensive image optimization system for the SvelteKit website to dramatically improve initial page load performance while maintaining high image quality. The system preserves original images and generates optimized variants in a dedicated directory structure.

## Architecture

### Directory Structure
```
static/
├── images/               # Original images (preserved)
│   ├── iagen/           # AI-generated images (3MB+ files)
│   ├── logos/           # Logo files
│   └── avatar.jpg       # Profile image
└── images-optimized/    # Generated optimized images (gitignored)
    ├── webp/           # WebP format variants
    ├── avif/           # AVIF format variants
    ├── thumbs/         # Thumbnail variants (200px, 400px, 800px)
    ├── responsive/     # Responsive size variants
    └── placeholders/   # Blur/LQIP placeholders
```

### Build System Integration

#### 1. Vite Plugin Configuration
```typescript
// vite.config.ts additions
import { imagetools } from 'vite-plugin-imagetools';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    imagetools({
      include: ['**/*.{png,jpg,jpeg,webp,avif}'],
      exclude: ['**/images-optimized/**'],
      defaultDirectives: new URLSearchParams({
        format: 'webp;avif;original',
        quality: '80',
        width: '200;400;800;1200',
        withoutEnlargement: 'true'
      })
    })
  ]
});
```

#### 2. Image Processing Pipeline
- **Input**: Original images from `static/images/`
- **Processing**: Generate multiple formats and sizes during build
- **Output**: Optimized variants in `static/images-optimized/`
- **Formats**: WebP (primary), AVIF (modern browsers), original (fallback)
- **Sizes**: 200px, 400px, 800px, 1200px width variants
- **Quality**: 80% for lossy formats, lossless compression for logos

#### 3. Git Configuration
```gitignore
# Generated optimized images
static/images-optimized/
```

## Implementation Components

### 1. OptimizedImage Svelte Component
```typescript
// src/lib/components/OptimizedImage.svelte
interface OptimizedImageProps {
  src: string;           // Original image path
  alt: string;           // Alt text
  sizes?: string;        // Responsive sizes attribute
  loading?: 'lazy' | 'eager';
  priority?: boolean;    // Preload critical images
  aspectRatio?: string;  // CSS aspect ratio
  placeholder?: 'blur' | 'skeleton' | 'none';
}
```

#### Features:
- **Progressive Enhancement**: Works without JavaScript
- **Format Detection**: Serves AVIF → WebP → original based on browser support
- **Responsive Images**: Uses `<picture>` with `srcset` for optimal sizing
- **Lazy Loading**: Intersection Observer with `loading="lazy"` fallback
- **Placeholder Strategies**: Blur placeholders for smooth loading experience
- **Preloading**: Critical images loaded immediately for LCP optimization

### 2. ImageInText Component Enhancement
```typescript
// Enhanced src/lib/components/ImageInText.svelte
- Replace direct image usage with OptimizedImage component
- Modal uses high-quality variants (800px+)
- Thumbnail in text uses small variants (200px-400px)
- Blur placeholder during modal loading
```

### 3. Build-time Image Processing
```typescript
// scripts/optimize-images.ts
- Scan static/images/ for new/modified images
- Generate optimized variants with @squoosh/lib
- Create LQIP (Low Quality Image Placeholders)
- Generate responsive srcset mappings
- Update image manifest for component usage
```

### 4. Image Manifest System
```json
// static/images-optimized/manifest.json
{
  "images/iagen/CyberNico.png": {
    "formats": {
      "avif": {
        "200": "/images-optimized/avif/CyberNico-200w.avif",
        "400": "/images-optimized/avif/CyberNico-400w.avif",
        "800": "/images-optimized/avif/CyberNico-800w.avif",
        "1200": "/images-optimized/avif/CyberNico-1200w.avif"
      },
      "webp": { /* similar structure */ },
      "original": { /* similar structure */ }
    },
    "placeholder": "/images-optimized/placeholders/CyberNico-blur.webp",
    "aspectRatio": "16/9",
    "originalSize": { "width": 1920, "height": 1080, "filesize": 3145728 }
  }
}
```

## Performance Optimization Strategies

### 1. Initial Page Load Optimization
- **Critical Images**: Preload above-the-fold images
- **Lazy Loading**: All other images load on scroll/interaction
- **Format Selection**: AVIF first (50% smaller), WebP fallback, original last resort
- **Size Selection**: Serve appropriate size based on viewport/device pixel ratio

### 2. Loading Experience
- **Blur Placeholders**: Tiny blurred versions (1-2KB) for smooth loading
- **Skeleton Screens**: For images in article lists/grids
- **Progressive Loading**: Low quality → high quality transition
- **Intersection Observer**: Load images 100px before they enter viewport

### 3. Caching Strategy
```typescript
// Service worker integration (optional)
- Cache optimized images aggressively
- Preload article images on hover
- Background updates for image variants
```

### 4. Core Web Vitals Optimization
- **LCP (Largest Contentful Paint)**: Preload hero images, optimize format/size
- **CLS (Cumulative Layout Shift)**: Reserve space with aspect ratios
- **FID (First Input Delay)**: Lazy load non-critical images to reduce main thread blocking

## Development Tools

### 1. Build Scripts
```bash
# Package.json additions
pnpm optimize:images     # Generate all optimized variants
pnpm optimize:images:watch # Watch for changes and regenerate
pnpm analyze:images      # Report on image optimization opportunities
```

### 2. Development Utilities
```typescript
// Image optimization analysis
- Bundle size impact report
- Format support detection
- Performance metrics tracking
- Optimization recommendations
```

### 3. TypeScript Integration
```typescript
// Auto-generated types from manifest
type OptimizedImagePath = keyof typeof imageManifest;
type ImageFormat = 'avif' | 'webp' | 'original';
type ImageSize = 200 | 400 | 800 | 1200;
```

## Implementation Phases

### Phase 1: Core Infrastructure
1. Setup vite-plugin-imagetools
2. Configure build-time image processing
3. Create OptimizedImage component
4. Setup gitignore for generated images

### Phase 2: Component Integration
1. Replace ImageInText with optimized version
2. Add lazy loading throughout site
3. Implement blur placeholders
4. Setup image manifest system

### Phase 3: Advanced Optimizations
1. Service worker caching
2. Preloading strategies
3. Advanced placeholder techniques
4. Performance monitoring

### Phase 4: Monitoring & Analytics
1. Core Web Vitals tracking
2. Image loading performance metrics
3. Format adoption analytics
4. Optimization recommendations dashboard

## Expected Performance Improvements

### File Size Reductions
- **AVIF**: 50-70% smaller than original PNG
- **WebP**: 25-50% smaller than original PNG
- **Responsive Sizing**: 60-90% reduction for mobile devices

### Loading Performance
- **Initial Page Load**: 40-60% faster due to smaller critical images
- **Perceived Performance**: Instant image appearance with blur placeholders
- **Bandwidth Savings**: 70%+ reduction in image data transfer

### Core Web Vitals
- **LCP**: Improved by 30-50% through optimized hero images
- **CLS**: Eliminated through proper aspect ratio reservations
- **Overall Score**: Expected 90+ Lighthouse performance score

## Dependencies

### Build-time
```json
{
  "vite-plugin-imagetools": "^0.7.0",
  "@squoosh/lib": "^0.5.0",
  "sharp": "^0.33.0"
}
```

### Runtime (none - pure web standards)
- Uses native browser APIs
- Progressive enhancement approach
- No JavaScript required for basic functionality

## Compatibility

### Browser Support
- **AVIF**: Chrome 85+, Firefox 93+ (93% coverage)
- **WebP**: All modern browsers (97% coverage)
- **Fallback**: Original format for legacy browsers
- **Responsive Images**: All browsers with `<picture>` support (96% coverage)

### Framework Integration
- **SvelteKit**: Full SSR/SSG compatibility
- **Static Hosting**: All optimizations work with static deployment
- **Development**: Hot reload support for image changes