import { event } from 'src/mocks/event.js'
import type { TicketType } from 'src/types/ticket'

/**
 * Load the ticket tiers from the event mock. Prices live in the mock only —
 * never hardcode them (General 299 / VIP 599 / Student 99 come from here).
 */
export function loadTicketTypes(): TicketType[] {
  return event.ticketTypes as TicketType[]
}
