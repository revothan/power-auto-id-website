import { CarStatus } from '@/types/supabase'

export type TransitionVariant =
  | 'default'
  | 'outline'
  | 'destructive'
  | 'success'

export interface CarTransition {
  /**
   * Stable id for the action — used as a React key and to dispatch in the editor.
   */
  id: string
  label: string
  next: CarStatus
  variant: TransitionVariant
  /**
   * If true, the action prompts for a `rejected_reason` before running.
   * Stored on the row as `rejected_reason` (also clears it when set to null).
   */
  requiresReason?: boolean
  /**
   * If true, the action requires the strict listing schema to pass (e.g.
   * publishing or approving). Status-only transitions like withdraw/archive
   * don't need data completeness.
   */
  requiresStrictData?: boolean
  /**
   * If true, requires ≥1 photo. Implies requiresStrictData should also be
   * checked at call sites.
   */
  requiresPhoto?: boolean
  /**
   * If true, stamps `approved_by` + `approved_at` from the current user.
   */
  stampsApproval?: boolean
  /**
   * If true, stamps `submitted_at` from now().
   */
  stampsSubmitted?: boolean
  /**
   * If true, clears `rejected_reason` (e.g. when restoring a rejected row).
   */
  clearsRejectedReason?: boolean
  /**
   * If true, stamps `sold_at` (and flips `sold` boolean for legacy column).
   */
  stampsSold?: boolean
}

interface Args {
  status: CarStatus
  isAdmin: boolean
  isOwner: boolean
}

/**
 * The list of buttons to render in the editor's action bar for the given
 * row + viewer. Order matters: most-prominent first.
 */
export function getAvailableTransitions(args: Args): CarTransition[] {
  const { status, isAdmin, isOwner } = args
  const out: CarTransition[] = []

  if (status === 'draft') {
    if (isOwner || isAdmin) {
      out.push({
        id: 'submit',
        label: 'Submit untuk approval',
        next: 'pending_approval',
        variant: 'default',
        requiresStrictData: true,
        requiresPhoto: true,
        stampsSubmitted: true,
      })
    }
    if (isAdmin) {
      out.push({
        id: 'publish',
        label: 'Publish langsung',
        next: 'available',
        variant: 'success',
        requiresStrictData: true,
        requiresPhoto: true,
        stampsApproval: true,
        clearsRejectedReason: true,
      })
    }
  }

  if (status === 'pending_approval') {
    if (isAdmin) {
      out.push({
        id: 'approve',
        label: 'Approve & publish',
        next: 'available',
        variant: 'success',
        requiresStrictData: true,
        requiresPhoto: true,
        stampsApproval: true,
        clearsRejectedReason: true,
      })
      out.push({
        id: 'reject',
        label: 'Reject',
        next: 'rejected',
        variant: 'destructive',
        requiresReason: true,
      })
    }
    if (isOwner && !isAdmin) {
      out.push({
        id: 'withdraw',
        label: 'Tarik kembali ke draft',
        next: 'draft',
        variant: 'outline',
      })
    }
  }

  if (status === 'rejected') {
    if (isOwner || isAdmin) {
      out.push({
        id: 'resubmit',
        label: 'Submit lagi setelah revisi',
        next: 'pending_approval',
        variant: 'default',
        requiresStrictData: true,
        requiresPhoto: true,
        stampsSubmitted: true,
        clearsRejectedReason: true,
      })
    }
    if (isAdmin) {
      out.push({
        id: 'back-to-draft',
        label: 'Kembalikan ke draft',
        next: 'draft',
        variant: 'outline',
        clearsRejectedReason: true,
      })
    }
  }

  if (status === 'available') {
    if (isAdmin) {
      out.push({
        id: 'reserve',
        label: 'Tandai reserved',
        next: 'reserved',
        variant: 'default',
      })
      out.push({
        id: 'sold',
        label: 'Tandai sold',
        next: 'sold',
        variant: 'outline',
        stampsSold: true,
      })
      out.push({
        id: 'archive',
        label: 'Arsipkan',
        next: 'archived',
        variant: 'outline',
      })
    }
  }

  if (status === 'reserved') {
    if (isAdmin) {
      out.push({
        id: 'available-from-reserved',
        label: 'Kembalikan ke available',
        next: 'available',
        variant: 'default',
      })
      out.push({
        id: 'sold-from-reserved',
        label: 'Tandai sold',
        next: 'sold',
        variant: 'outline',
        stampsSold: true,
      })
    }
  }

  if (status === 'sold') {
    if (isAdmin) {
      out.push({
        id: 'archive-sold',
        label: 'Arsipkan',
        next: 'archived',
        variant: 'outline',
      })
    }
  }

  if (status === 'archived') {
    if (isAdmin) {
      out.push({
        id: 'restore-to-draft',
        label: 'Pulihkan ke draft',
        next: 'draft',
        variant: 'outline',
      })
    }
  }

  return out
}

/**
 * Whether the form fields should accept edits in this status. Sales can only
 * edit their own rows when status is in the "editable" set (matches RLS).
 * Admin can edit anything.
 */
export function canEditFields(args: Args): boolean {
  const { status, isAdmin, isOwner } = args
  if (isAdmin) return true
  if (!isOwner) return false
  return status === 'draft' || status === 'pending_approval' || status === 'rejected'
}
