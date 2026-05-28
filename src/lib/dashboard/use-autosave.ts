import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ListingFormValues } from './listing-schema'

interface AutosaveOptions {
  carId: string
  /**
   * react-hook-form's `formState.dirtyFields`. Only dirty fields are sent.
   */
  dirtyFields: Partial<Record<keyof ListingFormValues, unknown>>
  /**
   * Snapshot of the current form values; we rebuild the payload from this.
   */
  values: ListingFormValues
  enabled: boolean
  onSaved?: () => void
  onError?: (err: unknown) => void
}

/**
 * Trigger this from a field's onBlur. It builds a diff from dirtyFields and
 * sends one UPDATE. Debounced lightly so multiple blurs in the same tick
 * coalesce.
 */
export function useAutosave() {
  const timer = useRef<number | null>(null)
  const pending = useRef<AutosaveOptions | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  const flush = async () => {
    if (!pending.current || !supabase) return
    const opts = pending.current
    pending.current = null
    timer.current = null

    if (!opts.enabled) return

    const payload: Record<string, unknown> = {}
    for (const key of Object.keys(opts.dirtyFields) as (keyof ListingFormValues)[]) {
      const value = opts.values[key]
      payload[key] = value === '' ? null : value
    }
    if (Object.keys(payload).length === 0) return

    const { error } = await supabase
      .from('cars')
      .update(payload)
      .eq('id', opts.carId)
    if (error) {
      opts.onError?.(error)
    } else {
      opts.onSaved?.()
    }
  }

  return (opts: AutosaveOptions) => {
    pending.current = opts
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, 350)
  }
}
