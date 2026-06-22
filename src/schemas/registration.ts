import { z } from 'zod'
import {
  contactStepSchema,
  ticketStepSchema,
  sessionsStepSchema,
  addonsStepSchema,
} from 'src/schemas/steps'

/**
 * The whole registration, composed from the per-step schemas. Validated once at
 * submit (#22). Conditional rule: selecting any merchandise makes the shipping
 * address required.
 */
export const registrationSchema = z
  .object({
    // Contact fields are nested under `attendee` to match RegistrationState.
    attendee: contactStepSchema,
    ...ticketStepSchema.shape,
    ...sessionsStepSchema.shape,
    ...addonsStepSchema.shape,
  })
  .superRefine((data, ctx) => {
    const hasMerchandise = Object.keys(data.merchandise).length > 0
    if (hasMerchandise && data.attendee.shippingAddress.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['attendee', 'shippingAddress'],
        message: 'validation.shippingMerch',
      })
    }
  })

export type RegistrationInput = z.infer<typeof registrationSchema>
export type ContactInput = z.infer<typeof contactStepSchema>
export type TicketInput = z.infer<typeof ticketStepSchema>
export type SessionsInput = z.infer<typeof sessionsStepSchema>
export type AddonsInput = z.infer<typeof addonsStepSchema>
