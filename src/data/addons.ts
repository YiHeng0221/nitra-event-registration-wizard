import { addons as rawAddons } from 'src/mocks/addons.js'
import type { Addon } from 'src/types/addon'

/** Load all add-ons from the mock, typed to the domain shape (mock is source of truth). */
export function loadAddons(): Addon[] {
  return rawAddons as Addon[]
}

/** Add-ons grouped into the three display sections. */
export interface AddonsByCategory {
  workshop: Addon[]
  meal: Addon[]
  merchandise: Addon[]
}

/** Split add-ons into workshop / meal / merchandise, preserving order. */
export function groupAddonsByCategory(addons: Addon[]): AddonsByCategory {
  const groups: AddonsByCategory = { workshop: [], meal: [], merchandise: [] }
  for (const addon of addons) {
    groups[addon.category].push(addon)
  }
  return groups
}
