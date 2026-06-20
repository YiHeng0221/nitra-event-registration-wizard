import type { TicketId } from 'src/types/ticket'

/** Attendee contact fields collected in Step 1. */
export interface AttendeeInfo {
  fullName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  /** Optional in general, but required once any merchandise is selected (checked at submit). */
  shippingAddress: string
}

/** A chosen merchandise line: selected size (if the item offers sizes) and quantity. */
export interface MerchandiseSelection {
  size: string | null
  quantity: number
}

/**
 * The whole registration as one object — the single source of truth held by
 * the `useRegistration` store (#18). Every step reads and writes this shape.
 */
export interface RegistrationState {
  /** 1–4, the wizard step currently shown. */
  currentStep: number
  attendee: AttendeeInfo
  /** Selected ticket tier, or null until chosen (Step 1). */
  ticketId: TicketId | null
  /** Selected session ids (Step 2). */
  selectedSessionIds: string[]
  /** Selected workshop add-on ids (Step 3). */
  selectedWorkshopIds: string[]
  /** Selected meal add-on ids (Step 3). */
  selectedMealIds: string[]
  /** Merchandise selections keyed by add-on id (Step 3). */
  merchandise: Record<string, MerchandiseSelection>
}
