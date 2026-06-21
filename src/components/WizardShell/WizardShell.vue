<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { useValidation, type ValidationResult } from 'src/composables/useValidation'
import AppHeader from 'src/components/AppHeader/AppHeader.vue'
import Stepper, { type StepItem } from 'src/components/Stepper/Stepper.vue'

const emit = defineEmits<{ submit: [] }>()

const STEPS: StepItem[] = [
  { n: 1, label: 'Attendee Info' },
  { n: 2, label: 'Sessions' },
  { n: 3, label: 'Add-ons' },
  { n: 4, label: 'Review' },
]

/** Contextual label for the primary action, by current step. */
const NEXT_LABEL: Record<number, string> = {
  1: 'Next: Session Selection',
  2: 'Next: Add-ons',
  3: 'Next: Review',
}

const { state } = useRegistration()
const { validateAll } = useValidation()

const lastValidation = ref<ValidationResult | null>(null)
const errorSteps = computed(() =>
  Object.entries(lastValidation.value?.stepHasError ?? {})
    .filter(([, hasError]) => hasError)
    .map(([step]) => Number(step)),
)

const isLastStep = computed(() => state.currentStep >= STEPS.length)

function goTo(step: number): void {
  state.currentStep = step
}
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
</script>

<template>
  <div class="bg-surface-l0 overflow-hidden rounded-xl">
    <!-- Header -->
    <AppHeader />
    <div class="border-neutral-muted border-t" />

    <!-- Stepper -->
    <div class="px-6 py-6 lg:px-30">
      <Stepper
        :steps="STEPS"
        :current="state.currentStep"
        :error-steps="errorSteps"
        @navigate="goTo"
      />
    </div>
    <div class="border-neutral-muted border-t" />

    <!-- Form -->
    <div class="px-6 py-10 lg:px-30">
      <Transition
        name="fade"
        mode="out-in"
      >
        <slot
          v-if="state.currentStep === 1"
          name="step-attendee"
        />
        <slot
          v-else-if="state.currentStep === 2"
          name="step-sessions"
        />
        <slot
          v-else-if="state.currentStep === 3"
          name="step-addons"
        />
        <slot
          v-else
          name="step-review"
        />
      </Transition>
    </div>
    <div class="border-neutral-muted border-t" />

    <!-- Actions -->
    <div class="flex items-center justify-between px-6 py-6 lg:px-30">
      <button
        v-if="state.currentStep > 1"
        type="button"
        class="text-neutral text-subtitle2 bg-surface-l2 hover:bg-surface-l3 cursor-pointer rounded-md border-0 px-4 py-2 font-medium"
        @click="goBack"
      >
        Back
      </button>
      <span v-else />

      <button
        type="button"
        class="bg-accent-emphasis-rest hover:bg-accent-emphasis-hover text-inverse text-subtitle2 cursor-pointer rounded-md border-0 px-5 py-2 font-medium"
        @click="isLastStep ? submit() : goNext()"
      >
        {{ isLastStep ? 'Submit Registration' : NEXT_LABEL[state.currentStep] }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
