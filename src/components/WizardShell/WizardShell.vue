<script setup lang="ts">
import { ref } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { useValidation, type ValidationResult } from 'src/composables/useValidation'

const emit = defineEmits<{ submit: [] }>()

/** The four wizard steps; `slot` names the content slot a parent fills in. */
const STEPS = [
  { step: 1, title: 'Attendee', slot: 'step-attendee' },
  { step: 2, title: 'Sessions', slot: 'step-sessions' },
  { step: 3, title: 'Add-ons', slot: 'step-addons' },
  { step: 4, title: 'Review', slot: 'step-review' },
] as const

const { state } = useRegistration()
const { validateAll } = useValidation()

// Last submit-time validation; drives the per-step error badges.
const lastValidation = ref<ValidationResult | null>(null)

function goNext(): void {
  if (state.currentStep < STEPS.length) state.currentStep += 1
}

function goBack(): void {
  if (state.currentStep > 1) state.currentStep -= 1
}

function submit(): void {
  const result = validateAll()
  lastValidation.value = result
  if (!result.valid && result.jumpTo !== null) {
    state.currentStep = result.jumpTo
    return
  }
  emit('submit')
}

function stepHasError(step: number): boolean {
  return Boolean(lastValidation.value?.stepHasError[step])
}
</script>

<template>
  <div class="flex flex-col gap-4 lg:flex-row lg:items-start">
    <div class="flex-1">
      <q-stepper
        v-model="state.currentStep"
        flat
        animated
        header-nav
        class="bg-surface-l0"
      >
        <q-step
          v-for="entry in STEPS"
          :key="entry.step"
          :name="entry.step"
          :title="entry.title"
          :error="stepHasError(entry.step)"
          :done="state.currentStep > entry.step"
        >
          <slot :name="entry.slot">
            <div class="text-neutral-muted">
              {{ entry.title }} — coming soon
            </div>
          </slot>
        </q-step>
      </q-stepper>

      <div class="mt-4 flex justify-between">
        <q-btn
          flat
          label="Back"
          :disable="state.currentStep === 1"
          @click="goBack"
        />
        <q-btn
          v-if="state.currentStep < STEPS.length"
          color="primary"
          label="Next"
          @click="goNext"
        />
        <q-btn
          v-else
          color="primary"
          label="Submit"
          @click="submit"
        />
      </div>
    </div>

    <aside class="w-full lg:w-80">
      <slot name="summary" />
    </aside>
  </div>
</template>
