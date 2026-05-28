/**
 * Utilities for optimizing and transforming images from Supabase Storage
 */

/**
 * Transform a Supabase Storage image URL with optimization parameters
 * 
 * @param url The original image URL from Supabase
 * @param width The desired width of the image
 * @param height Optional desired height of the image
 * @param quality Optional quality setting (20-100, default 80)
 * @param resize Optional resize mode ('cover', 'contain', 'fill')
 * @returns The transformed image URL
 */
export function optimizeImage(
  url: string,
  width: number,
  height?: number,
  quality: number = 50,
  resize: 'cover' | 'contain' | 'fill' = 'cover'
): string {
  // Return original URL if it's not a Supabase Storage URL
  if (!url.includes('supabase.co/storage')) {
    return url;
  }

  // Check if the URL already contains transformation parameters
  if (url.includes('?width=') || url.includes('&width=')) {
    return url;
  }

  // Construct base URL - extract the path
  // Example URL: https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/car-images/SUZUKI%20XL7%20ZETA%20AT%202021/xl7.jpg
  // Transform to: https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/render/image/public/car-images/SUZUKI%20XL7%20ZETA%20AT%202021/xl7.jpg
  
  // Split the URL into parts
  const urlParts = url.split('/storage/v1/object/');
  
  if (urlParts.length !== 2) {
    return url; // Not in the expected format, return original
  }
  
  const baseUrl = urlParts[0];
  const objectPath = urlParts[1];
  
  // Construct the transformed URL
  let transformedUrl = `${baseUrl}/storage/v1/render/image/${objectPath}?width=${width}`;
  
  // Add optional parameters
  if (height) {
    transformedUrl += `&height=${height}`;
  }
  
  transformedUrl += `&quality=${quality}&resize=${resize}`;
  
  return transformedUrl;
}

/**
 * Get different sized image transformations for responsive loading
 * 
 * @param url The original image URL from Supabase
 * @returns Object containing different sized versions of the image
 */
export function getResponsiveImageSources(url: string) {
  return {
    thumbnail: optimizeImage(url, 200, 150, 40),
    small: optimizeImage(url, 400, 300, 45),
    medium: optimizeImage(url, 800, 600, 50),
    large: optimizeImage(url, 1200, 900, 55),
    original: url
  };
}

/**
 * Preload an image to improve perceived loading time
 *
 * @param url The image URL to preload
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

import { supabase } from './supabase/client';
import type { Car } from '@/types/supabase';

interface ImageLike {
  storage_path: string;
  sort_order: number;
  is_cover: boolean;
}

/**
 * Build the public URL for a path in the car-images bucket.
 */
export function carImageUrl(storagePath: string): string {
  if (!supabase) return '';
  return supabase.storage.from('car-images').getPublicUrl(storagePath).data.publicUrl;
}

/**
 * Returns all gallery image URLs for a car, sorted by `sort_order` with the
 * cover first. Falls back to the legacy `car.images[]` array when no
 * `car_images` rows exist (so existing listings keep working through Phase 7).
 */
export function resolveCarImageUrls(car: Car): string[] {
  const rows = car.car_images ?? [];
  if (rows.length > 0) {
    const sorted = [...rows].sort((a, b) => {
      if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1;
      return a.sort_order - b.sort_order;
    });
    return sorted.map((r) => carImageUrl(r.storage_path));
  }
  return car.images ?? [];
}

/**
 * Returns the single cover URL for a car, preferring car_images then falling
 * back to the legacy `title_image`.
 */
export function resolveCarCoverUrl(car: Car): string {
  const rows = car.car_images ?? [];
  const cover = rows.find((r) => r.is_cover) ?? rows[0];
  if (cover) return carImageUrl(cover.storage_path);
  return car.title_image || (car.images?.[0] ?? '');
}

export function _coverFromList(rows: ImageLike[]): ImageLike | undefined {
  return rows.find((r) => r.is_cover) ?? rows[0];
}
