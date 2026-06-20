/** The three ticket tiers offered (ids mirror `src/mocks/event.js`). */
export type TicketId = 'general' | 'vip' | 'student'

/**
 * A ticket tier with its price and perks. Shape mirrors the `ticketTypes`
 * entries in `src/mocks/event.js`.
 */
export interface TicketType {
  id: TicketId
  name: string
  price: number
  description: string
  perks: string[]
}
