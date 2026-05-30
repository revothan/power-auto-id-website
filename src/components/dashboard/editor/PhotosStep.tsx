import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  Loader2,
  Star,
  Trash2,
  Upload,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  deleteCarPhoto,
  uploadCarPhoto,
} from '@/lib/dashboard/upload'
import { supabase } from '@/lib/supabase/client'

const MAX_PHOTOS = 20

interface Props {
  carId: string
}

interface PhotoRow {
  id: string
  storage_path: string
  sort_order: number
  is_cover: boolean
}

export function PhotosStep({ carId }: Props) {
  const qc = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyCount, setBusyCount] = useState(0)

  const { data: photos = [], isLoading } = useQuery<PhotoRow[]>({
    queryKey: ['car-photos', carId],
    queryFn: async () => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('car_images')
        .select('id, storage_path, sort_order, is_cover')
        .eq('car_id', carId)
        .order('sort_order', { ascending: true })
      if (error) {
        console.error('photos fetch error:', error)
        return []
      }
      return data
    },
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['car-photos', carId] })

  const deleteMut = useMutation({
    mutationFn: deleteCarPhoto,
    onSuccess: invalidate,
  })

  const setCoverMut = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('supabase not ready')
      // Clear current cover then set new one — within a single Supabase round-trip is hard;
      // do two updates. The partial unique index prevents two covers existing simultaneously.
      const { error: clearErr } = await supabase
        .from('car_images')
        .update({ is_cover: false })
        .eq('car_id', carId)
        .eq('is_cover', true)
      if (clearErr) throw clearErr
      const { error: setErr } = await supabase
        .from('car_images')
        .update({ is_cover: true })
        .eq('id', id)
      if (setErr) throw setErr
    },
    onSuccess: invalidate,
  })

  const moveMut = useMutation({
    mutationFn: async ({ a, b }: { a: PhotoRow; b: PhotoRow }) => {
      if (!supabase) throw new Error('supabase not ready')
      // Swap sort_order
      const updates = [
        supabase.from('car_images').update({ sort_order: b.sort_order }).eq('id', a.id),
        supabase.from('car_images').update({ sort_order: a.sort_order }).eq('id', b.id),
      ]
      const results = await Promise.all(updates)
      const err = results.find((r) => r.error)?.error
      if (err) throw err
    },
    onSuccess: invalidate,
  })

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError(null)
    const startCount = photos.length
    const room = MAX_PHOTOS - startCount
    const toUpload = Array.from(files).slice(0, Math.max(0, room))
    if (toUpload.length === 0) {
      setError(`Maksimal ${MAX_PHOTOS} foto.`)
      return
    }
    setBusyCount(toUpload.length)
    let nextOrder = startCount > 0 ? Math.max(...photos.map((p) => p.sort_order)) + 1 : 0
    let setFirstAsCover = startCount === 0
    for (const file of toUpload) {
      try {
        await uploadCarPhoto(carId, file, {
          sortOrder: nextOrder++,
          isCover: setFirstAsCover,
        })
        setFirstAsCover = false
        invalidate()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal upload foto.'
        setError(message)
        break
      } finally {
        setBusyCount((c) => c - 1)
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const ordered = [...photos].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Foto</h2>
          <p className="text-xs text-muted-foreground">
            {photos.length}/{MAX_PHOTOS} foto • klik bintang untuk set cover.
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Format: JPG, PNG, atau WebP. HEIC dari iPhone tidak didukung — convert dulu ke JPG.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={photos.length >= MAX_PHOTOS || busyCount > 0}
          className="gap-2"
        >
          {busyCount > 0 ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Tambah foto
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : ordered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-12 text-sm text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
          <div>Belum ada foto.</div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {ordered.map((photo, idx) => {
            const url = supabase
              ? supabase.storage.from('car-images').getPublicUrl(photo.storage_path).data.publicUrl
              : ''
            return (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg border bg-muted"
              >
                <div className="aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                {photo.is_cover && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <Star className="h-3 w-3 fill-current" />
                    Cover
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-1">
                    <IconButton
                      label="Pindah naik"
                      onClick={() => {
                        if (idx === 0) return
                        moveMut.mutate({ a: ordered[idx], b: ordered[idx - 1] })
                      }}
                      disabled={idx === 0 || moveMut.isPending}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton
                      label="Pindah turun"
                      onClick={() => {
                        if (idx === ordered.length - 1) return
                        moveMut.mutate({ a: ordered[idx], b: ordered[idx + 1] })
                      }}
                      disabled={idx === ordered.length - 1 || moveMut.isPending}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </IconButton>
                  </div>
                  <div className="flex gap-1">
                    <IconButton
                      label="Set cover"
                      onClick={() => setCoverMut.mutate(photo.id)}
                      disabled={photo.is_cover || setCoverMut.isPending}
                    >
                      <Star className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton
                      label="Hapus"
                      onClick={() => {
                        if (window.confirm('Hapus foto ini?')) {
                          deleteMut.mutate({
                            id: photo.id,
                            storagePath: photo.storage_path,
                          })
                        }
                      }}
                      disabled={deleteMut.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconButton>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function IconButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded bg-white/95 text-foreground shadow-sm transition disabled:opacity-40 hover:bg-white"
    >
      {children}
    </button>
  )
}
