import { loadSessions } from 'src/data/sessions'
import { loadAddons } from 'src/data/addons'
import { loadTicketTypes } from 'src/data/tickets'
import type { Session } from 'src/types/session'
import type { Addon, WorkshopAddon } from 'src/types/addon'
import type { TicketType } from 'src/types/ticket'

// The mock catalog is static for the app's lifetime, so it's loaded and indexed
// once at module init and shared by every consumer — building these Maps per
// composable call (as several composables did) was redundant work.
const sessions = loadSessions()
const sessionById = new Map(sessions.map((session) => [session.id, session]))

const addons = loadAddons()
const addonPriceById = new Map(addons.map((addon) => [addon.id, addon.price]))
const workshops = addons.filter(
  (addon): addon is WorkshopAddon => addon.category === 'workshop',
)

const ticketTypes = loadTicketTypes()

export interface Catalog {
  /** All sessions, in mock order. */
  sessions: Session[]
  /** Session lookup by id. */
  sessionById: Map<string, Session>
  /** All add-ons, in mock order. */
  addons: Addon[]
  /** Add-on unit price by id (0 if unknown via callers' `?? 0`). */
  addonPriceById: Map<string, number>
  /** Add-ons of the `workshop` category (the only ones with a time slot). */
  workshops: WorkshopAddon[]
  /** Ticket tiers, in mock order. */
  ticketTypes: TicketType[]
}

/**
 * Shared, read-only access to the static mock catalog and its precomputed
 * indexes. Everything is loaded once at module scope; this just hands it out.
 */
export function useCatalog(): Catalog {
  return { sessions, sessionById, addons, addonPriceById, workshops, ticketTypes }
}
