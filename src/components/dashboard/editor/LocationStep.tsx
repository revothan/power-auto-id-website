import { useQuery } from '@tanstack/react-query'
import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth/AuthProvider'
import { ListingFormValues } from '@/lib/dashboard/listing-schema'
import { supabase } from '@/lib/supabase/client'

interface Props {
  form: UseFormReturn<ListingFormValues>
  onBlurAny: () => void
}

const SELECT_CLASS =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function LocationStep({ form, onBlurAny }: Props) {
  const { register, formState: { errors } } = form
  const { isAdmin } = useAuth()

  const { data: branches = [] } = useQuery({
    queryKey: ['editor-branches'],
    queryFn: async () => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('branches')
        .select('id, name')
        .eq('is_active', true)
        .order('name')
      if (error) {
        console.error('branches fetch error:', error)
        return []
      }
      return data
    },
  })

  const { data: salesStaff = [] } = useQuery({
    queryKey: ['editor-sales-staff'],
    queryFn: async () => {
      if (!supabase) return []
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['sales', 'admin'])
        .eq('is_active', true)
        .order('full_name', { nullsFirst: false })
      if (error) {
        console.error('sales staff fetch error:', error)
        return []
      }
      return data
    },
  })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>Cabang</Label>
        <select
          {...register('branch_id')}
          onBlur={onBlurAny}
          className={SELECT_CLASS}
        >
          <option value="">— pilih cabang —</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        {errors.branch_id && (
          <p className="text-xs text-destructive">{errors.branch_id.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>
          Sales PIC{!isAdmin && <span className="ml-1 text-muted-foreground">(otomatis kamu)</span>}
        </Label>
        <select
          {...register('sales_pic_id')}
          onBlur={onBlurAny}
          className={SELECT_CLASS}
          disabled={!isAdmin}
        >
          <option value="">— pilih PIC —</option>
          {salesStaff.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name || p.email}
              {p.role === 'admin' ? ' (admin)' : ''}
            </option>
          ))}
        </select>
        {errors.sales_pic_id && (
          <p className="text-xs text-destructive">{errors.sales_pic_id.message}</p>
        )}
      </div>
    </div>
  )
}
