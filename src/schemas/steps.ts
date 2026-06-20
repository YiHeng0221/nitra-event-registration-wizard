import { z } from 'zod'

/** Step 1 — attendee contact fields. Shipping is conditionally required (see registrationSchema). */
export const contactStepSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.email('Enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().min(1, 'Company is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  shippingAddress: z.string(),
})

/** Step 1 — ticket tier selection (null fails: a ticket must be chosen). */
export const ticketStepSchema = z.object({
  ticketId: z.enum(['general', 'vip', 'student'], { error: 'Select a ticket type' }),
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
