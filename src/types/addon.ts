/** Fields shared by every add-on, regardless of category. */
interface AddonBase {
  id: string
  name: string
  description: string
  price: number
}

/** A workshop has a time slot + capacity, so it can conflict with sessions. */
export interface WorkshopAddon extends AddonBase {
  category: 'workshop'
  /** ISO 8601 start timestamp. */
  date: string
  /** ISO 8601 end timestamp. */
  endDate: string
  capacity: number
  registered: number
}

/** A meal package — flat, no options. */
export interface MealAddon extends AddonBase {
  category: 'meal'
}

/** Merchandise may offer sizes and a per-order quantity cap. */
export interface MerchandiseAddon extends AddonBase {
  category: 'merchandise'
  sizes?: string[]
  maxQuantity?: number
}

/** Discriminated union over `category`; mirrors `src/mocks/addons.js`. */
export type Addon = WorkshopAddon | MealAddon | MerchandiseAddon

export type AddonCategory = Addon['category']
