import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth/AuthProvider'

const schema = z.object({
  email: z.string().email('Format email tidak valid'),
})
type Values = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await requestPasswordReset(values.email)
      setSubmitted(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim email reset.'
      setFormError(message)
    }
  })

  return (
    <>
      <Helmet>
        <title>Lupa Password | Power Auto ID</title>
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
                <h1 className="mt-3 text-lg font-semibold">Cek email kamu</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Jika alamat email tersebut terdaftar, link reset password sudah
                  dikirim. Buka link tersebut untuk mengatur password baru.
                </p>
                <Button asChild className="mt-6 w-full">
                  <Link to="/login">Kembali ke login</Link>
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-semibold">Lupa Password</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Masukkan email kamu — kami akan kirim link untuk mengatur password
                  baru.
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      disabled={isSubmitting}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
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
                    Kirim link reset
                  </Button>

                  <p className="text-center text-sm">
                    <Link
                      to="/login"
                      className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Kembali ke login
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
