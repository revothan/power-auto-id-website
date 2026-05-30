import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { DescriptionStep } from '@/components/dashboard/editor/DescriptionStep'
import { DocumentsStep } from '@/components/dashboard/editor/DocumentsStep'
import { LocationStep } from '@/components/dashboard/editor/LocationStep'
import { PhotosStep } from '@/components/dashboard/editor/PhotosStep'
import { PricingStep } from '@/components/dashboard/editor/PricingStep'
import { RejectDialog } from '@/components/dashboard/editor/RejectDialog'
import { SpecsStep } from '@/components/dashboard/editor/SpecsStep'
import { STEP_LABELS, StepIndicator } from '@/components/dashboard/editor/StepIndicator'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/AuthProvider'
import {
  ListingFormValues,
  listingDraftSchema,
  listingSubmitSchema,
  STEP_FIELDS,
} from '@/lib/dashboard/listing-schema'
import {
  CarTransition,
  getAvailableTransitions,
} from '@/lib/dashboard/transitions'
import { useAutosave } from '@/lib/dashboard/use-autosave'
import { supabase } from '@/lib/supabase/client'
import { CarStatus } from '@/types/supabase'

const STEP_COUNT = STEP_LABELS.length

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function CarEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAdmin, session } = useAuth()
  const userId = session?.user.id ?? null

  const [step, setStep] = useState(0)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const carQuery = useQuery({
    queryKey: ['car', id],
    enabled: !!id && !!supabase,
    queryFn: async () => {
      if (!supabase || !id) return null
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
  })

  // Photo count is checked freshly at submit time (see runTransition) — we
  // don't cache it here because the cached value goes stale the moment the
  // user uploads in PhotosStep, and the count is a hard gate on submit.
  const countCarPhotos = async (): Promise<number> => {
    if (!supabase || !id) return 0
    const { count, error } = await supabase
      .from('car_images')
      .select('id', { count: 'exact', head: true })
      .eq('car_id', id)
    if (error) return 0
    return count ?? 0
  }

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingDraftSchema),
    defaultValues: {} as ListingFormValues,
    mode: 'onBlur',
  })

  // Hydrate form once the car loads. We reset to mark all fields as pristine
  // — autosave only sends dirty fields.
  useEffect(() => {
    const car = carQuery.data
    if (!car) return
    form.reset({
      make: car.make ?? undefined,
      model: car.model ?? undefined,
      year: car.year ?? undefined,
      color: car.color ?? undefined,
      transmission: car.transmission ?? undefined,
      fuel_type: car.fuel_type ?? undefined,
      mileage: car.mileage ?? undefined,
      engine_size: car.engine_size ?? undefined,
      power: car.power ?? undefined,
      seats: car.seats ?? undefined,
      doors: car.doors ?? undefined,
      condition: car.condition ?? undefined,
      vin: car.vin ?? undefined,
      plate_number: car.plate_number ?? undefined,
      price: car.price ?? undefined,
      market_price: car.market_price ?? undefined,
      description: car.description ?? undefined,
      features: car.features ?? [],
      stnk_holder_name: car.stnk_holder_name ?? undefined,
      bpkb_holder_name: car.bpkb_holder_name ?? undefined,
      tax_due_date: car.tax_due_date ?? undefined,
      service_history: car.service_history ?? undefined,
      branch_id: car.branch_id ?? undefined,
      sales_pic_id: car.sales_pic_id ?? userId ?? undefined,
    })
  }, [carQuery.data, form, userId])

  const triggerAutosave = useAutosave()

  const onBlurAny = useCallback(() => {
    if (!id) return
    setSaveStatus('saving')
    triggerAutosave({
      carId: id,
      dirtyFields: form.formState.dirtyFields as Partial<Record<keyof ListingFormValues, unknown>>,
      values: form.getValues(),
      enabled: true,
      onSaved: () => {
        setSaveStatus('saved')
        // Mark snapshot as pristine so we don't keep resending the same fields
        form.reset(form.getValues(), { keepValues: true })
      },
      onError: (err) => {
        console.error('autosave error:', err)
        setSaveStatus('error')
      },
    })
  }, [id, form, triggerAutosave])

  const car = carQuery.data
  const status: CarStatus | undefined = car?.status

  const stepNode = useMemo(() => {
    if (!id) return null
    switch (step) {
      case 0:
        return <SpecsStep form={form} onBlurAny={onBlurAny} />
      case 1:
        return <PricingStep form={form} onBlurAny={onBlurAny} />
      case 2:
        return <DescriptionStep form={form} onBlurAny={onBlurAny} />
      case 3:
        return <DocumentsStep form={form} onBlurAny={onBlurAny} />
      case 4:
        return <PhotosStep carId={id} />
      case 5:
        return <LocationStep form={form} onBlurAny={onBlurAny} />
      default:
        return null
    }
  }, [step, id, form, onBlurAny])

  // ---- transitions ------------------------------------------------------

  const [rejectOpen, setRejectOpen] = useState(false)

  const transitions = useMemo(
    () =>
      car
        ? getAvailableTransitions({
            status: car.status,
            isAdmin,
            isOwner: car.created_by === userId,
          })
        : [],
    [car, isAdmin, userId],
  )

  const jumpToFirstErrorStep = (
    issues: { path: (string | number)[]; message: string }[],
  ) => {
    const errFields = new Set(
      issues.map((i) => i.path[0] as keyof ListingFormValues),
    )
    for (let i = 0; i < STEP_COUNT; i++) {
      const owned = STEP_FIELDS[i] ?? []
      if (owned.some((f) => errFields.has(f))) {
        setStep(i)
        break
      }
    }
    issues.forEach((issue) => {
      const path = issue.path[0] as keyof ListingFormValues
      form.setError(path, { type: 'manual', message: issue.message })
    })
  }

  const writeRow = async (payload: Record<string, unknown>) => {
    if (!supabase || !id) return false
    setSubmitting(true)
    setSubmitError(null)
    const cleaned: Record<string, unknown> = { ...payload }
    for (const k of Object.keys(cleaned)) {
      if (cleaned[k] === '') cleaned[k] = null
    }
    const { error } = await supabase.from('cars').update(cleaned).eq('id', id)
    setSubmitting(false)
    if (error) {
      setSubmitError(error.message)
      return false
    }
    return true
  }

  const runTransition = async (t: CarTransition, opts?: { reason?: string }) => {
    setSubmitError(null)
    const values = form.getValues()

    if (t.requiresStrictData) {
      const parsed = listingSubmitSchema.safeParse(values)
      if (!parsed.success) {
        jumpToFirstErrorStep(parsed.error.issues)
        setSubmitError('Lengkapi data sebelum melanjutkan.')
        return
      }
    }
    if (t.requiresPhoto) {
      const freshCount = await countCarPhotos()
      if (freshCount < 1) {
        setStep(4)
        setSubmitError('Tambahkan minimal satu foto sebelum melanjutkan.')
        return
      }
    }

    const payload: Record<string, unknown> = { ...values, status: t.next }
    if (t.stampsSubmitted) payload.submitted_at = new Date().toISOString()
    if (t.stampsApproval) {
      payload.approved_by = userId
      payload.approved_at = new Date().toISOString()
    }
    // When publishing (status -> available), ensure the row has a slug so the
    // public detail page can route to it. Don't overwrite an existing one.
    if (t.next === 'available' && !car?.slug && values.make && values.model) {
      const base = [values.make, values.model, values.year, values.color]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      // Suffix a short id slice so concurrent same-spec listings don't collide.
      payload.slug = id ? `${base}-${id.slice(0, 6)}` : base
    }
    if (t.stampsSold) {
      payload.sold_at = new Date().toISOString()
      payload.sold = true
    }
    if (t.clearsRejectedReason) payload.rejected_reason = null
    if (t.requiresReason) payload.rejected_reason = opts?.reason ?? null

    const ok = await writeRow(payload)
    if (ok) navigate('/dashboard/listings')
  }

  const handleSave = async () => {
    const ok = await writeRow({ ...form.getValues() })
    if (ok) setSaveStatus('saved')
  }

  const handleTransitionClick = (t: CarTransition) => {
    if (t.requiresReason) {
      setRejectOpen(true)
      return
    }
    void runTransition(t)
  }

  // ---- render -----------------------------------------------------------

  if (carQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (carQuery.error || !car) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <h1 className="text-lg font-semibold">Listing tidak ditemukan</h1>
        <Button asChild variant="outline">
          <Link to="/dashboard/listings">Kembali ke daftar</Link>
        </Button>
      </div>
    )
  }

  const titleLine =
    [car.year, car.make, car.model].filter(Boolean).join(' ') || 'Listing baru'

  return (
    <>
      <Helmet>
        <title>{titleLine} | Power Auto Dashboard</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/dashboard/listings" className="hover:text-foreground">
                ← Semua listing
              </Link>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold">{titleLine}</h1>
              {status && <StatusBadge status={status} />}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {saveStatus === 'saving' && (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Menyimpan…
              </span>
            )}
            {saveStatus === 'saved' && <span>Tersimpan</span>}
            {saveStatus === 'error' && (
              <span className="text-destructive">Gagal menyimpan</span>
            )}
          </div>
        </div>

        {car.status === 'rejected' && car.rejected_reason && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm"
          >
            <div className="font-medium text-destructive">
              Listing direject oleh admin
            </div>
            <div className="mt-1 text-foreground">{car.rejected_reason}</div>
          </div>
        )}

        <StepIndicator current={step} onJump={setStep} />

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Step {step + 1} dari {STEP_COUNT} — {STEP_LABELS[step]}
          </h2>
          {stepNode}
        </div>

        {submitError && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {submitError}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.min(STEP_COUNT - 1, s + 1))}
              disabled={step === STEP_COUNT - 1}
              className="gap-2"
            >
              Berikutnya
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSave}
              disabled={submitting}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Simpan
            </Button>
            {transitions.map((t) => (
              <Button
                key={t.id}
                type="button"
                variant={
                  t.variant === 'success' || t.variant === 'default'
                    ? 'default'
                    : t.variant === 'destructive'
                      ? 'destructive'
                      : 'outline'
                }
                onClick={() => handleTransitionClick(t)}
                disabled={submitting}
                className={
                  t.variant === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : undefined
                }
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        <RejectDialog
          open={rejectOpen}
          onOpenChange={setRejectOpen}
          onConfirm={async (reason) => {
            const t = transitions.find((x) => x.id === 'reject')
            if (t) await runTransition(t, { reason })
          }}
        />
      </div>
    </>
  )
}
