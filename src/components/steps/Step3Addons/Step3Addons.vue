<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegistration } from 'src/composables/useRegistration'
import { useConflicts } from 'src/composables/useConflicts'
import { useLocale } from 'src/composables/useLocale'
import { loadAddons } from 'src/data/addons'
import type { WorkshopAddon, MealAddon, MerchandiseAddon } from 'src/types/addon'
import SelectableCard from '@lib/nitra-ui/SelectableCard/SelectableCard.vue'
import NumericInput from '@lib/nitra-ui/NumericInput/NumericInput.vue'
import OptionGroup from '@lib/nitra-ui/OptionGroup/OptionGroup.vue'
import Select from '@lib/nitra-ui/Select/Select.vue'
import Banner from '@lib/nitra-ui/Banner/Banner.vue'
import OrderSummary from 'src/components/OrderSummary/OrderSummary.vue'
import Text from '@lib/nitra-ui/Text/Text.vue'

const { t } = useI18n()
const { timeRange, addonName, addonDesc } = useLocale()
const { state } = useRegistration()
const { unavailableWorkshopIds } = useConflicts()

const addons = loadAddons()
const workshops = addons.filter((a): a is WorkshopAddon => a.category === 'workshop')
const meals = addons.filter((a): a is MealAddon => a.category === 'meal')
const merchandise = addons.filter((a): a is MerchandiseAddon => a.category === 'merchandise')

type CategoryKey = 'workshop' | 'meal' | 'merchandise'
const categoryOptions = computed(() => [
  { value: 'workshop', label: t('step3.catWorkshops') },
  { value: 'meal', label: t('step3.catMeals') },
  { value: 'merchandise', label: t('step3.catMerch') },
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

      <OptionGroup
        variant="tab"
        block
        class="mb-4"
        :options="categoryOptions"
        :model-value="category"
        :label="t('step3.selectCategory')"
        @update:model-value="(v) => (category = v as CategoryKey)"
      />

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
              {{ addonName(workshop.id) }}
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
            {{ addonDesc(workshop.id) }}
          </Text>
          <Text
            variant="body"
            color="muted"
          >
            {{ timeRange(workshop.date, workshop.endDate) }}
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
              {{ addonName(meal.id) }}
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
            {{ addonDesc(meal.id) }}
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
              {{ addonName(item.id) }}
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
            {{ addonDesc(item.id) }}
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
              <Select
                inline
                :options="item.sizes.map((size) => ({ label: size, value: size }))"
                :placeholder="t('common.select')"
                :model-value="sizeOf(item.id)"
                @update:model-value="(value) => setSize(item.id, value)"
              />
            </div>
            <div class="flex items-center gap-2">
              <Text
                as="span"
                variant="body-medium"
                color="muted"
              >
                {{ t('step3.qty') }}
              </Text>
              <NumericInput
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
