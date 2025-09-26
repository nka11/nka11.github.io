/**
 * Image optimization manifest types
 *
 * This file defines TypeScript interfaces for the image optimization system,
 * ensuring type safety when working with optimized images and their manifests.
 */

export type ImageFormat = 'avif' | 'webp' | 'original';

export type ImageSize = 200 | 400 | 800 | 1200;

export type ImageSizeString = '200' | '400' | '800' | '1200';

export type PlaceholderType = 'blur' | 'skeleton' | 'none';

export type LoadingType = 'lazy' | 'eager';

/**
 * Represents the different format variants of an image
 */
export interface ImageFormats {
  avif: Record<ImageSizeString, string>;
  webp: Record<ImageSizeString, string>;
  original: Record<ImageSizeString, string>;
}

/**
 * Original image metadata
 */
export interface OriginalImageSize {
  width: number;
  height: number;
  filesize: number;
}

/**
 * Complete manifest entry for a single image
 */
export interface ImageManifestEntry {
  formats: ImageFormats;
  placeholder: string;
  aspectRatio: string;
  originalSize: OriginalImageSize;
}

/**
 * Complete image manifest mapping image paths to their optimized variants
 */
export interface ImageManifest {
  [imagePath: string]: ImageManifestEntry;
}

/**
 * Props for the OptimizedImage component
 */
export interface OptimizedImageProps {
  /** Original image path relative to static/ */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Responsive sizes attribute */
  sizes?: string;
  /** Loading behavior */
  loading?: LoadingType;
  /** Whether to preload this image for LCP optimization */
  priority?: boolean;
  /** CSS aspect ratio (overrides calculated ratio) */
  aspectRatio?: string;
  /** Placeholder strategy while loading */
  placeholder?: PlaceholderType;
  /** Additional CSS classes */
  class?: string;
}

/**
 * Image variant configuration for build-time processing
 */
export interface ImageVariant {
  format: ImageFormat;
  width: ImageSize;
  quality: number;
  outputPath: string;
}

/**
 * Build-time configuration for image processing
 */
export interface ImageProcessingConfig {
  /** Input directory for original images */
  inputDir: string;
  /** Output directory for optimized images */
  outputDir: string;
  /** Target sizes for responsive images */
  sizes: ImageSize[];
  /** Quality setting for lossy formats */
  quality: number;
  /** Formats to generate */
  formats: ImageFormat[];
}

/**
 * Runtime image loading state
 */
export interface ImageLoadingState {
  isLoaded: boolean;
  isIntersecting: boolean;
  hasError: boolean;
  shouldLoadImage: boolean;
  showPlaceholder: boolean;
}

/**
 * Image optimization statistics
 */
export interface OptimizationStats {
  originalSize: number;
  optimizedSizes: Record<ImageFormat, Record<ImageSizeString, number>>;
  compressionRatio: number;
  formats: ImageFormat[];
  generatedVariants: number;
}

/**
 * Helper type for extracting image paths from manifest
 */
export type OptimizedImagePath = keyof ImageManifest;

/**
 * Helper type for getting available sizes for an image format
 */
export type AvailableSizes<T extends ImageManifestEntry> = keyof T['formats']['webp'];

/**
 * Utility function types for image operations
 */
export interface ImageUtils {
  /**
   * Get the best format for the current browser
   */
  getBestFormat(formats: ImageFormats): ImageFormat;

  /**
   * Get the appropriate size based on viewport
   */
  getAppropriateSize(sizes: ImageSizeString[], viewportWidth: number): ImageSizeString;

  /**
   * Generate srcset string for a format
   */
  generateSrcset(formatUrls: Record<ImageSizeString, string>): string;

  /**
   * Check if format is supported by browser
   */
  isFormatSupported(format: ImageFormat): boolean;
}

/**
 * Type guard to check if an object is a valid ImageManifestEntry
 */
export function isImageManifestEntry(obj: any): obj is ImageManifestEntry {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.formats &&
    typeof obj.formats === 'object' &&
    obj.formats.avif &&
    obj.formats.webp &&
    obj.formats.original &&
    typeof obj.placeholder === 'string' &&
    typeof obj.aspectRatio === 'string' &&
    obj.originalSize &&
    typeof obj.originalSize.width === 'number' &&
    typeof obj.originalSize.height === 'number' &&
    typeof obj.originalSize.filesize === 'number'
  );
}

/**
 * Type guard to check if an object is a valid ImageManifest
 */
export function isImageManifest(obj: any): obj is ImageManifest {
  return (
    obj &&
    typeof obj === 'object' &&
    Object.values(obj).every(isImageManifestEntry)
  );
}