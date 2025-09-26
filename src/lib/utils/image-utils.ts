/**
 * Image optimization utilities
 *
 * This module provides utility functions for working with optimized images,
 * including format detection, size selection, and browser capability checks.
 */

import type {
  ImageFormat,
  ImageFormats,
  ImageSizeString,
  ImageManifest,
  ImageManifestEntry,
  ImageUtils
} from '$lib/types/image-manifest';

/**
 * Cache for format support detection
 */
const formatSupportCache = new Map<ImageFormat, boolean>();

/**
 * Check if a specific image format is supported by the browser
 */
export function isFormatSupported(format: ImageFormat): boolean {
  if (typeof window === 'undefined') {
    // Server-side: assume modern browser support
    return format !== 'original';
  }

  if (formatSupportCache.has(format)) {
    return formatSupportCache.get(format)!;
  }

  let supported = false;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    switch (format) {
      case 'avif':
        supported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
        break;
      case 'webp':
        supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        break;
      case 'original':
        supported = true;
        break;
    }
  } catch {
    supported = false;
  }

  formatSupportCache.set(format, supported);
  return supported;
}

/**
 * Get the best image format for the current browser
 */
export function getBestFormat(formats: ImageFormats): ImageFormat {
  // Prefer AVIF for best compression
  if (formats.avif && Object.keys(formats.avif).length > 0 && isFormatSupported('avif')) {
    return 'avif';
  }

  // Fallback to WebP for good compression and wide support
  if (formats.webp && Object.keys(formats.webp).length > 0 && isFormatSupported('webp')) {
    return 'webp';
  }

  // Final fallback to original format
  return 'original';
}

/**
 * Get the appropriate image size based on viewport width and DPR
 */
export function getAppropriateSize(
  availableSizes: ImageSizeString[],
  viewportWidth: number = 800,
  devicePixelRatio: number = 1
): ImageSizeString {
  const targetWidth = viewportWidth * devicePixelRatio;

  // Sort sizes numerically
  const sortedSizes = availableSizes
    .map(size => parseInt(size, 10))
    .sort((a, b) => a - b);

  // Find the smallest size that's larger than or equal to target
  const appropriateSize = sortedSizes.find(size => size >= targetWidth);

  // If no size is large enough, use the largest available
  const selectedSize = appropriateSize || sortedSizes[sortedSizes.length - 1];

  return selectedSize.toString() as ImageSizeString;
}

/**
 * Generate a srcset string from format URLs
 */
export function generateSrcset(formatUrls: Record<ImageSizeString, string>): string {
  return Object.entries(formatUrls)
    .map(([width, url]) => `${url} ${width}w`)
    .join(', ');
}

/**
 * Get the optimal image URL for given constraints
 */
export function getOptimalImageUrl(
  imageEntry: ImageManifestEntry,
  preferredSize: ImageSizeString = '800',
  preferredFormat?: ImageFormat
): string {
  const format = preferredFormat || getBestFormat(imageEntry.formats);
  const formatUrls = imageEntry.formats[format];

  // Return the requested size if available
  if (formatUrls[preferredSize]) {
    return formatUrls[preferredSize];
  }

  // Fallback to the first available size
  const availableSizes = Object.keys(formatUrls) as ImageSizeString[];
  if (availableSizes.length > 0) {
    return formatUrls[availableSizes[0]];
  }

  // Final fallback to placeholder
  return imageEntry.placeholder;
}

/**
 * Load and parse the image manifest
 */
export async function loadImageManifest(): Promise<ImageManifest | null> {
  try {
    const response = await fetch('/images-optimized/manifest.json');
    if (!response.ok) {
      console.warn('Image manifest not found, using fallback images');
      return null;
    }

    const manifest = await response.json();
    return manifest as ImageManifest;
  } catch (error) {
    console.warn('Failed to load image manifest:', error);
    return null;
  }
}

/**
 * Get image data from manifest by path
 */
export function getImageData(
  manifest: ImageManifest | null,
  imagePath: string
): ImageManifestEntry | null {
  if (!manifest) return null;

  // Normalize path by removing leading slashes and static/ prefix
  const normalizedPath = imagePath
    .replace(/^\//, '')
    .replace(/^static\//, '');

  return manifest[normalizedPath] || null;
}

/**
 * Calculate compression ratio for an image
 */
export function calculateCompressionRatio(
  originalSize: number,
  optimizedSize: number
): number {
  if (originalSize === 0) return 0;
  return Math.round((1 - optimizedSize / originalSize) * 100);
}

/**
 * Generate sizes attribute based on breakpoints
 */
export function generateSizesAttribute(breakpoints?: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string {
  const defaultBreakpoints = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
    ...breakpoints
  };

  return `(max-width: 640px) ${defaultBreakpoints.mobile}, (max-width: 1024px) ${defaultBreakpoints.tablet}, ${defaultBreakpoints.desktop}`;
}

/**
 * Preload critical images
 */
export function preloadImage(
  imageEntry: ImageManifestEntry,
  size: ImageSizeString = '800',
  format?: ImageFormat
): void {
  if (typeof window === 'undefined') return;

  const targetFormat = format || getBestFormat(imageEntry.formats);
  const formatUrls = imageEntry.formats[targetFormat];
  const url = formatUrls[size] || Object.values(formatUrls)[0];

  if (!url) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;

  // Set type attribute for better browser optimization
  switch (targetFormat) {
    case 'avif':
      link.type = 'image/avif';
      break;
    case 'webp':
      link.type = 'image/webp';
      break;
  }

  document.head.appendChild(link);
}

/**
 * Implementation of ImageUtils interface
 */
export const imageUtils: ImageUtils = {
  getBestFormat,
  getAppropriateSize,
  generateSrcset,
  isFormatSupported
};

/**
 * Create a responsive image source set configuration
 */
export function createResponsiveConfig(
  imageEntry: ImageManifestEntry,
  sizes?: string
) {
  const bestFormat = getBestFormat(imageEntry.formats);
  const formatUrls = imageEntry.formats[bestFormat];

  return {
    srcset: generateSrcset(formatUrls),
    sizes: sizes || generateSizesAttribute(),
    src: Object.values(formatUrls)[0],
    aspectRatio: imageEntry.aspectRatio,
    placeholder: imageEntry.placeholder
  };
}

/**
 * Debug utility to log image optimization stats
 */
export function logImageStats(imageEntry: ImageManifestEntry, imagePath: string): void {
  if (typeof console === 'undefined') return;

  const originalSize = imageEntry.originalSize.filesize;
  const formats = Object.keys(imageEntry.formats) as ImageFormat[];

  console.group(`📊 Image Stats: ${imagePath}`);
  console.log(`Original: ${(originalSize / 1024).toFixed(1)}KB`);

  formats.forEach(format => {
    const formatUrls = imageEntry.formats[format];
    Object.entries(formatUrls).forEach(([size, url]) => {
      // Note: We can't get actual file size without fetching, so we estimate
      const estimatedRatio = format === 'avif' ? 0.3 : format === 'webp' ? 0.6 : 1;
      const estimatedSize = originalSize * estimatedRatio;
      const savings = calculateCompressionRatio(originalSize, estimatedSize);
      console.log(`${format} ${size}w: ~${(estimatedSize / 1024).toFixed(1)}KB (${savings}% savings)`);
    });
  });

  console.groupEnd();
}