import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth/AuthProvider'
import { supabase } from '@/lib/supabase/client'

/**
 * Creates a blank draft row owned by the current user, then redirects to the
 * editor. The editor only ever works against a real car_id, which keeps the
 * photo upload + autosave paths simple.
 */
export default function NewListingPage() {
  const { session } = useAuth()
  const [newId, setNewId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session || newId || !supabase) return
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase!
        .from('cars')
        .insert({
          status: 'draft',
          created_by: session.user.id,
          sales_pic_id: session.user.id,
        })
        .select('id')
        .single()
      if (cancelled) return
      if (error || !data) {
        setError(error?.message ?? 'Gagal membuat draft.')
      } else {
        setNewId(data.id)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [session, newId])

  if (newId) {
    return <Navigate to={`/dashboard/listings/${newId}/edit`} replace />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <h1 className="text-lg font-semibold">Gagal membuat draft</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}
