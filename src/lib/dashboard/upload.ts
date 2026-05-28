import { supabase } from '@/lib/supabase/client'

export interface ResizedImage {
  blob: Blob
  width: number
  height: number
  sizeBytes: number
}

const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.82

/**
 * Resize an image client-side via Canvas, cap on the larger dimension,
 * re-encode as JPEG. Returns the resized blob + final dimensions.
 */
export async function resizeImage(file: File): Promise<ResizedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File bukan gambar.')
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Gagal membaca file.'))
    reader.readAsDataURL(file)
  })

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image()
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error('Gagal memuat gambar.'))
    el.src = dataUrl
  })

  const { width: srcW, height: srcH } = img
  let targetW = srcW
  let targetH = srcH
  const longest = Math.max(srcW, srcH)
  if (longest > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / longest
    targetW = Math.round(srcW * scale)
    targetH = Math.round(srcH * scale)
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas tidak tersedia.')
  ctx.drawImage(img, 0, 0, targetW, targetH)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/jpeg', JPEG_QUALITY),
  )
  if (!blob) throw new Error('Gagal meng-encode gambar.')

  return { blob, width: targetW, height: targetH, sizeBytes: blob.size }
}

/**
 * Upload one resized photo for a car. Path layout: `{carId}/{uuid}.jpg` —
 * required by the storage RLS policy.
 *
 * Inserts a row in `car_images`. If `isCover` is true, clears the previous
 * cover before inserting (partial unique index allows only one).
 */
export async function uploadCarPhoto(
  carId: string,
  file: File,
  opts: { sortOrder: number; isCover?: boolean },
) {
  if (!supabase) throw new Error('Supabase belum siap.')

  const resized = await resizeImage(file)
  const uuid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  const storagePath = `${carId}/${uuid}.jpg`

  const { error: uploadError } = await supabase.storage
    .from('car-images')
    .upload(storagePath, resized.blob, {
      contentType: 'image/jpeg',
      upsert: false,
    })
  if (uploadError) throw uploadError

  if (opts.isCover) {
    const { error: clearError } = await supabase
      .from('car_images')
      .update({ is_cover: false })
      .eq('car_id', carId)
      .eq('is_cover', true)
    if (clearError) {
      console.error('Failed to clear previous cover:', clearError)
    }
  }

  const { data, error: insertError } = await supabase
    .from('car_images')
    .insert({
      car_id: carId,
      storage_path: storagePath,
      sort_order: opts.sortOrder,
      is_cover: opts.isCover ?? false,
      width: resized.width,
      height: resized.height,
      size_bytes: resized.sizeBytes,
    })
    .select()
    .single()
  if (insertError) {
    // Best-effort cleanup so we don't leave orphan blobs in storage
    await supabase.storage.from('car-images').remove([storagePath])
    throw insertError
  }
  return data
}

export async function deleteCarPhoto(args: {
  id: string
  storagePath: string
}) {
  if (!supabase) throw new Error('Supabase belum siap.')
  // Delete the row first; the RLS-protected delete is the trust gate.
  // Storage object goes next.
  const { error: rowErr } = await supabase
    .from('car_images')
    .delete()
    .eq('id', args.id)
  if (rowErr) throw rowErr
  const { error: storageErr } = await supabase.storage
    .from('car-images')
    .remove([args.storagePath])
  if (storageErr) console.error('Storage cleanup failed:', storageErr)
}
