import { computed, type ComputedRef } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { loadTicketTypes } from 'src/data/tickets'
import { loadAddons } from 'src/data/addons'

/** VIP perk: 10% off the workshop subtotal only. */
const VIP_WORKSHOP_DISCOUNT_RATE = 0.1

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export interface UsePricing {
  ticketPrice: ComputedRef<number>
  workshopSubtotal: ComputedRef<number>
  addonsSubtotal: ComputedRef<number>
  /** VIP: workshop subtotal × 10%; otherwise 0. */
  discount: ComputedRef<number>
  total: ComputedRef<number>
  /** Format a number as `$X,XXX.XX`. */
  formatCurrency: (amount: number) => string
}

/** Reactive pricing derived from the registration state and the mock catalog. */
export function usePricing(): UsePricing {
  const { state } = useRegistration()
  const tickets = loadTicketTypes()
  const addonPriceById = new Map(loadAddons().map((addon) => [addon.id, addon.price]))

  const ticketPrice = computed(
    () => tickets.find((ticket) => ticket.id === state.ticketId)?.price ?? 0,
  )

  const workshopSubtotal = computed(() =>
    state.selectedWorkshopIds.reduce((sum, id) => sum + (addonPriceById.get(id) ?? 0), 0),
  )

  const mealSubtotal = computed(() =>
    state.selectedMealIds.reduce((sum, id) => sum + (addonPriceById.get(id) ?? 0), 0),
  )

  const merchandiseSubtotal = computed(() =>
    Object.entries(state.merchandise).reduce(
      (sum, [id, selection]) => sum + (addonPriceById.get(id) ?? 0) * selection.quantity,
      0,
    ),
  )

  const addonsSubtotal = computed(
    () => workshopSubtotal.value + mealSubtotal.value + merchandiseSubtotal.value,
  )

  const discount = computed(() =>
    state.ticketId === 'vip' ? workshopSubtotal.value * VIP_WORKSHOP_DISCOUNT_RATE : 0,
  )

  const total = computed(() => ticketPrice.value + addonsSubtotal.value - discount.value)

  function formatCurrency(amount: number): string {
    return currencyFormatter.format(amount)
  }

  return { ticketPrice, workshopSubtotal, addonsSubtotal, discount, total, formatCurrency }
}
