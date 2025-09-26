#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

interface ImageManifest {
  [imagePath: string]: {
    formats: {
      avif: Record<string, string>;
      webp: Record<string, string>;
      original: Record<string, string>;
    };
    placeholder: string;
    aspectRatio: string;
    originalSize: {
      width: number;
      height: number;
      filesize: number;
    };
  };
}

interface ImageVariant {
  format: 'avif' | 'webp' | 'original';
  width: number;
  quality: number;
  outputPath: string;
}

const SIZES = [200, 400, 800, 1200];
const QUALITY = 80;
const INPUT_DIR = 'static/images';
const OUTPUT_DIR = 'static/images-optimized';

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function getImageFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function scanDir(currentDir: string): Promise<void> {
    const items = await fs.readdir(currentDir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);

      if (item.isDirectory()) {
        await scanDir(fullPath);
      } else if (item.isFile() && /\.(png|jpg|jpeg|webp|avif)$/i.test(item.name)) {
        files.push(fullPath);
      }
    }
  }

  await scanDir(dir);
  return files;
}

async function getImageInfo(imagePath: string): Promise<sharp.Metadata> {
  const image = sharp(imagePath);
  return await image.metadata();
}

async function generateVariants(imagePath: string, relativePath: string): Promise<ImageVariant[]> {
  const variants: ImageVariant[] = [];
  const baseName = path.parse(relativePath).name;
  const ext = path.parse(relativePath).ext;

  for (const width of SIZES) {
    // AVIF variant
    variants.push({
      format: 'avif',
      width,
      quality: QUALITY,
      outputPath: path.join(OUTPUT_DIR, 'avif', `${baseName}-${width}w.avif`)
    });

    // WebP variant
    variants.push({
      format: 'webp',
      width,
      quality: QUALITY,
      outputPath: path.join(OUTPUT_DIR, 'webp', `${baseName}-${width}w.webp`)
    });

    // Original format variant (for fallback)
    variants.push({
      format: 'original',
      width,
      quality: QUALITY,
      outputPath: path.join(OUTPUT_DIR, 'responsive', `${baseName}-${width}w${ext}`)
    });
  }

  return variants;
}

async function processImage(imagePath: string, variant: ImageVariant): Promise<void> {
  await ensureDirectoryExists(path.dirname(variant.outputPath));

  let pipeline = sharp(imagePath)
    .resize(variant.width, undefined, {
      withoutEnlargement: true,
      fit: 'inside'
    });

  switch (variant.format) {
    case 'avif':
      pipeline = pipeline.avif({ quality: variant.quality });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality: variant.quality });
      break;
    case 'original':
      pipeline = pipeline.jpeg({ quality: variant.quality });
      break;
  }

  await pipeline.toFile(variant.outputPath);
}

async function generatePlaceholder(imagePath: string, baseName: string): Promise<string> {
  const placeholderPath = path.join(OUTPUT_DIR, 'placeholders', `${baseName}-blur.webp`);
  await ensureDirectoryExists(path.dirname(placeholderPath));

  await sharp(imagePath)
    .resize(20, 20, { fit: 'inside' })
    .blur(2)
    .webp({ quality: 20 })
    .toFile(placeholderPath);

  return `/${placeholderPath}`;
}

async function buildManifest(imageFiles: string[]): Promise<ImageManifest> {
  const manifest: ImageManifest = {};

  for (const imagePath of imageFiles) {
    const relativePath = path.relative(INPUT_DIR, imagePath);
    const baseName = path.parse(relativePath).name;
    const metadata = await getImageInfo(imagePath);
    const stats = await fs.stat(imagePath);

    // Generate placeholder
    const placeholderPath = await generatePlaceholder(imagePath, baseName);

    // Generate variants
    const variants = await generateVariants(imagePath, relativePath);

    for (const variant of variants) {
      console.log(`Processing ${variant.format} ${variant.width}w: ${variant.outputPath}`);
      await processImage(imagePath, variant);
    }

    // Build manifest entry
    const formats = {
      avif: {} as Record<string, string>,
      webp: {} as Record<string, string>,
      original: {} as Record<string, string>
    };

    for (const size of SIZES) {
      formats.avif[size.toString()] = `/${OUTPUT_DIR}/avif/${baseName}-${size}w.avif`;
      formats.webp[size.toString()] = `/${OUTPUT_DIR}/webp/${baseName}-${size}w.webp`;
      formats.original[size.toString()] = `/${OUTPUT_DIR}/responsive/${baseName}-${size}w${path.parse(relativePath).ext}`;
    }

    manifest[relativePath] = {
      formats,
      placeholder: placeholderPath,
      aspectRatio: metadata.width && metadata.height ? `${metadata.width}/${metadata.height}` : '1/1',
      originalSize: {
        width: metadata.width || 0,
        height: metadata.height || 0,
        filesize: stats.size
      }
    };
  }

  return manifest;
}

async function main(): Promise<void> {
  try {
    console.log('🖼️  Starting image optimization...');

    // Ensure output directories exist
    await ensureDirectoryExists(OUTPUT_DIR);
    await ensureDirectoryExists(path.join(OUTPUT_DIR, 'avif'));
    await ensureDirectoryExists(path.join(OUTPUT_DIR, 'webp'));
    await ensureDirectoryExists(path.join(OUTPUT_DIR, 'responsive'));
    await ensureDirectoryExists(path.join(OUTPUT_DIR, 'placeholders'));

    // Find all image files
    const imageFiles = await getImageFiles(INPUT_DIR);
    console.log(`Found ${imageFiles.length} images to process`);

    if (imageFiles.length === 0) {
      console.log('No images found to optimize');
      return;
    }

    // Build manifest and process images
    const manifest = await buildManifest(imageFiles);

    // Write manifest
    const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`✅ Optimization complete! Generated manifest at ${manifestPath}`);
    console.log(`📊 Processed ${imageFiles.length} images with ${SIZES.length} size variants each`);

  } catch (error) {
    console.error('❌ Error during image optimization:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as optimizeImages };