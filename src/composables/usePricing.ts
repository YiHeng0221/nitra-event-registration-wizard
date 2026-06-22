import { computed, type ComputedRef } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { useCatalog } from 'src/composables/useCatalog'

/** VIP perk: 10% off the workshop subtotal only. */
const VIP_WORKSHOP_DISCOUNT_RATE = 0.1

// Currency is intentionally fixed to USD / `$X,XXX.XX` regardless of UI locale
// (per spec) — it does NOT follow the i18n locale like dates in useLocale do.
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export interface UsePricing {
  /** Selected ticket tier's price, or 0 when none is chosen. */
  ticketPrice: ComputedRef<number>
  /** Sum of the selected workshops' prices (the VIP discount base). */
  workshopSubtotal: ComputedRef<number>
  /** Workshops + meals + merchandise (quantity-weighted); excludes the ticket. */
  addonsSubtotal: ComputedRef<number>
  /** VIP: workshop subtotal × 10%; otherwise 0. */
  discount: ComputedRef<number>
  /** Final payable: ticket + add-ons − discount. */
  total: ComputedRef<number>
  /** Format a number as `$X,XXX.XX`. */
  formatCurrency: (amount: number) => string
}

/** Reactive pricing derived from the registration state and the mock catalog. */
export function usePricing(): UsePricing {
  const { state } = useRegistration()
  const { ticketTypes, addonPriceById } = useCatalog()

  const ticketPrice = computed(
    () => ticketTypes.find((ticket) => ticket.id === state.ticketId)?.price ?? 0,
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
