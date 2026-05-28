import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth/AuthProvider'

const schema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirm'],
  })
type Values = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const { status, updatePassword, signOut } = useAuth()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Supabase auto-handles the recovery deep link (detectSessionInUrl: true by default),
  // which exchanges the URL params for a temporary session. While that's in flight the
  // status is 'initializing'. After it resolves we're 'authenticated' and can call
  // updateUser. If we end up 'unauthenticated', the link was bad or expired.
  const linkInvalid = status === 'unauthenticated'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirm: '' },
  })

  useEffect(() => {
    // After successful reset, send them to login (forces a fresh sign-in).
    if (!submitted) return
    const t = window.setTimeout(() => {
      void signOut().finally(() => navigate('/login', { replace: true }))
    }, 1500)
    return () => window.clearTimeout(t)
  }, [submitted, signOut, navigate])

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await updatePassword(values.password)
      setSubmitted(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengubah password.'
      setFormError(message)
    }
  })

  return (
    <>
      <Helmet>
        <title>Reset Password | Power Auto ID</title>
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              Power Auto ID
            </Link>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            {submitted ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
                <h1 className="mt-3 text-lg font-semibold">Password diperbarui</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Mengarahkan ke halaman login…
                </p>
              </div>
            ) : status === 'initializing' ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : linkInvalid ? (
              <div className="text-center">
                <h1 className="text-lg font-semibold">Link tidak valid</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Link reset sudah kadaluwarsa atau sudah dipakai. Minta link baru
                  dari halaman lupa password.
                </p>
                <Button asChild className="mt-6 w-full">
                  <Link to="/forgot-password">Minta link baru</Link>
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-semibold">Atur Password Baru</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Minimal 8 karakter.
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password baru</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      autoFocus
                      disabled={isSubmitting}
                      {...register('password')}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm">Konfirmasi password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      {...register('confirm')}
                    />
                    {errors.confirm && (
                      <p className="text-sm text-destructive">{errors.confirm.message}</p>
                    )}
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    >
                      {formError}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan password baru
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
