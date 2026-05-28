import { Badge, BadgeProps } from '@/components/ui/badge'
import { CarStatus } from '@/types/supabase'

const STATUS_META: Record<
  CarStatus,
  { label: string; variant: NonNullable<BadgeProps['variant']> }
> = {
  draft: { label: 'Draft', variant: 'muted' },
  pending_approval: { label: 'Menunggu approval', variant: 'warning' },
  available: { label: 'Available', variant: 'success' },
  reserved: { label: 'Reserved', variant: 'info' },
  sold: { label: 'Sold', variant: 'secondary' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  archived: { label: 'Archived', variant: 'outline' },
}

export function StatusBadge({ status }: { status: CarStatus }) {
  const meta = STATUS_META[status]
  return <Badge variant={meta.variant}>{meta.label}</Badge>
}

export const STATUS_LABELS: Record<CarStatus, string> = Object.fromEntries(
  Object.entries(STATUS_META).map(([k, v]) => [k, v.label]),
) as Record<CarStatus, string>
