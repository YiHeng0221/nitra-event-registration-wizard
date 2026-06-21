import { z } from 'zod'

// Validation messages are i18n keys, resolved to the active locale at display
// time in useValidation (so error hints translate with the language switch).

/** Step 1 — attendee contact fields. Shipping is conditionally required (see registrationSchema). */
export const contactStepSchema = z.object({
  fullName: z.string().min(1, 'validation.fullName'),
  email: z.email('validation.email'),
  phone: z.string().min(1, 'validation.phone'),
  company: z.string().min(1, 'validation.company'),
  jobTitle: z.string().min(1, 'validation.jobTitle'),
  shippingAddress: z.string(),
})

/** Step 1 — ticket tier selection (null fails: a ticket must be chosen). */
export const ticketStepSchema = z.object({
  ticketId: z.enum(['general', 'vip', 'student'], { error: 'validation.ticket' }),
})

/** Step 2 — chosen session ids (selection itself is optional; conflicts are checked separately). */
export const sessionsStepSchema = z.object({
  selectedSessionIds: z.array(z.string()),
})

/** A single merchandise line. */
export const merchandiseSelectionSchema = z.object({
  size: z.string().nullable(),
  quantity: z.number().int().min(1),
})

/** Step 3 — add-on selections. */
export const addonsStepSchema = z.object({
  selectedWorkshopIds: z.array(z.string()),
  selectedMealIds: z.array(z.string()),
  merchandise: z.record(z.string(), merchandiseSelectionSchema),
})
