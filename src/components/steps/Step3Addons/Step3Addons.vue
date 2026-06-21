<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegistration } from 'src/composables/useRegistration'
import { useConflicts } from 'src/composables/useConflicts'
import { loadAddons } from 'src/data/addons'
import { formatTimeRange } from 'src/utils/datetime'
import type { WorkshopAddon, MealAddon, MerchandiseAddon } from 'src/types/addon'
import SelectableCard from 'src/components/SelectableCard/SelectableCard.vue'
import NumberStepper from 'src/components/NumberStepper/NumberStepper.vue'
import Banner from 'src/components/Banner/Banner.vue'
import OrderSummary from 'src/components/OrderSummary/OrderSummary.vue'
import Text from 'src/components/Text/Text.vue'

const { t } = useI18n()
const { state } = useRegistration()
const { unavailableWorkshopIds } = useConflicts()

const addons = loadAddons()
const workshops = addons.filter((a): a is WorkshopAddon => a.category === 'workshop')
const meals = addons.filter((a): a is MealAddon => a.category === 'meal')
const merchandise = addons.filter((a): a is MerchandiseAddon => a.category === 'merchandise')

type CategoryKey = 'workshop' | 'meal' | 'merchandise'
const CATEGORIES = computed<Array<{ key: CategoryKey; label: string }>>(() => [
  { key: 'workshop', label: t('step3.catWorkshops') },
  { key: 'meal', label: t('step3.catMeals') },
  { key: 'merchandise', label: t('step3.catMerch') },
])
const category = ref<CategoryKey>('workshop')

// --- Workshops ---
function isWorkshopSelected(id: string): boolean {
  return state.selectedWorkshopIds.includes(id)
}
function workshopFull(workshop: WorkshopAddon): boolean {
  return workshop.registered >= workshop.capacity
}
function toggleWorkshop(workshop: WorkshopAddon): void {
  if (workshopFull(workshop) || unavailableWorkshopIds.value.has(workshop.id)) return
  const index = state.selectedWorkshopIds.indexOf(workshop.id)
  if (index >= 0) state.selectedWorkshopIds.splice(index, 1)
  else state.selectedWorkshopIds.push(workshop.id)
}

// --- Meals ---
function isMealSelected(id: string): boolean {
  return state.selectedMealIds.includes(id)
}
function toggleMeal(id: string): void {
  const index = state.selectedMealIds.indexOf(id)
  if (index >= 0) state.selectedMealIds.splice(index, 1)
  else state.selectedMealIds.push(id)
}

// --- Merchandise ---
const hasMerchandise = computed(() => Object.keys(state.merchandise).length > 0)

function quantityOf(id: string): number {
  return state.merchandise[id]?.quantity ?? 0
}
function setQuantity(item: MerchandiseAddon, quantity: number): void {
  if (quantity <= 0) {
    delete state.merchandise[item.id]
    return
  }
  const existingSize = state.merchandise[item.id]?.size ?? item.sizes?.[0] ?? null
  state.merchandise[item.id] = { size: existingSize, quantity }
}
function sizeOf(id: string): string | null {
  return state.merchandise[id]?.size ?? null
}
function setSize(id: string, size: string | number | null): void {
  const entry = state.merchandise[id]
  if (entry) entry.size = size === null ? null : String(size)
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <div class="lg:col-span-2">
      <Text
        as="h2"
        variant="h4"
        color="neutral"
        class="mb-4"
      >
        {{ t('step3.title') }}
      </Text>

      <div
        role="tablist"
        class="bg-surface-l2 mb-4 flex w-full gap-1 rounded-[10px] p-1 md:inline-flex md:w-fit"
      >
        <button
          v-for="entry in CATEGORIES"
          :key="entry.key"
          type="button"
          role="tab"
          :aria-selected="category === entry.key"
          class="flex-1 cursor-pointer whitespace-nowrap rounded-[8px] border-0 px-3 py-2 text-center text-[13px] transition-colors md:flex-none md:px-5"
          :class="
            category === entry.key
              ? 'bg-brand-emphasis-rest text-inverse font-semibold'
              : 'text-neutral-muted hover:bg-surface-l3 bg-transparent font-medium'
          "
          @click="category = entry.key"
        >
          {{ entry.label }}
        </button>
      </div>

      <!-- Workshops -->
      <div
        v-if="category === 'workshop'"
        class="flex flex-col gap-4"
      >
        <SelectableCard
          v-for="workshop in workshops"
          :key="workshop.id"
          :level="0"
          :selected="isWorkshopSelected(workshop.id)"
          :full="workshopFull(workshop)"
          :disabled="unavailableWorkshopIds.has(workshop.id)"
          @select="toggleWorkshop(workshop)"
        >
          <div class="flex items-start justify-between gap-2">
            <Text
              as="h3"
              variant="subtitle1"
              color="neutral"
            >
              {{ workshop.name }}
            </Text>
            <Text
              as="span"
              variant="subtitle1"
              color="neutral"
            >
              ${{ workshop.price }}
            </Text>
          </div>
          <Text
            variant="body"
            color="muted"
          >
            {{ workshop.description }}
          </Text>
          <Text
            variant="body"
            color="muted"
          >
            {{ formatTimeRange(workshop.date, workshop.endDate) }}
          </Text>
          <Text
            variant="body-xs-medium"
            :class="workshopFull(workshop) || unavailableWorkshopIds.has(workshop.id) ? 'text-danger' : 'text-neutral-quiet'"
          >
            <template v-if="workshopFull(workshop)">
              {{ t('step3.soldOut') }}
            </template>
            <template v-else-if="unavailableWorkshopIds.has(workshop.id)">
              {{ t('step3.unavailable') }}
            </template>
            <template v-else>
              {{ t('step3.spotsRemaining', { count: Math.max(workshop.capacity - workshop.registered, 0) }) }}
            </template>
          </Text>
        </SelectableCard>
      </div>

      <!-- Meals -->
      <div
        v-else-if="category === 'meal'"
        class="flex flex-col gap-4"
      >
        <SelectableCard
          v-for="meal in meals"
          :key="meal.id"
          :level="0"
          :selected="isMealSelected(meal.id)"
          @select="toggleMeal(meal.id)"
        >
          <div class="flex items-start justify-between gap-2">
            <Text
              as="h3"
              variant="subtitle1"
              color="neutral"
            >
              {{ meal.name }}
            </Text>
            <Text
              as="span"
              variant="subtitle1"
              color="neutral"
            >
              ${{ meal.price }}
            </Text>
          </div>
          <Text
            variant="body"
            color="muted"
          >
            {{ meal.description }}
          </Text>
        </SelectableCard>
      </div>

      <!-- Merchandise -->
      <div
        v-else
        class="flex flex-col gap-4"
      >
        <Banner
          v-if="hasMerchandise"
          variant="info"
          icon="info"
        >
          <Text
            variant="body-md-semibold"
            color="neutral"
          >
            {{ t('step3.shippingTitle') }}
          </Text>
          <Text
            variant="body-md"
            color="neutral"
          >
            {{ t('step3.shippingBody') }}
          </Text>
        </Banner>

        <SelectableCard
          v-for="item in merchandise"
          :key="item.id"
          :level="0"
          :selected="quantityOf(item.id) > 0"
        >
          <div class="flex items-start justify-between gap-2">
            <Text
              as="h3"
              variant="subtitle1"
              color="neutral"
            >
              {{ item.name }}
            </Text>
            <Text
              as="span"
              variant="subtitle1"
              color="neutral"
            >
              ${{ item.price }}
            </Text>
          </div>
          <Text
            variant="body"
            color="muted"
          >
            {{ item.description }}
          </Text>

          <div class="flex flex-wrap items-center gap-4">
            <div
              v-if="item.sizes"
              class="flex items-center gap-2"
            >
              <Text
                as="span"
                variant="body-medium"
                color="muted"
              >
                {{ t('step3.size') }}
              </Text>
              <select
                class="bg-surface-l0 border-neutral-muted text-neutral rounded-md border px-3 py-1.5 outline-none"
                :value="sizeOf(item.id) ?? ''"
                @change="setSize(item.id, ($event.target as HTMLSelectElement).value)"
              >
                <option
                  value=""
                  disabled
                >
                  {{ t('common.select') }}
                </option>
                <option
                  v-for="size in item.sizes"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <Text
                as="span"
                variant="body-medium"
                color="muted"
              >
                {{ t('step3.qty') }}
              </Text>
              <NumberStepper
                :model-value="quantityOf(item.id)"
                :min="0"
                :max="item.maxQuantity"
                @update:model-value="setQuantity(item, $event)"
              />
              <Text
                as="span"
                variant="body-xs"
                color="quiet"
              >
                {{ t('step3.max', { count: item.maxQuantity }) }}
              </Text>
            </div>
          </div>

          <Text
            v-if="quantityOf(item.id) > 0"
            variant="body-xs-medium"
            color="success"
            class="flex items-center gap-1"
          >
            <q-icon
              name="check"
              size="14px"
            />
            {{ t('step3.added') }}
          </Text>
        </SelectableCard>
      </div>
    </div>

    <aside class="lg:col-span-1">
      <OrderSummary />
    </aside>
  </div>
</template>
