<script setup lang="ts">
import { computed } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { useValidation } from 'src/composables/useValidation'
import AppHeader from 'src/components/AppHeader/AppHeader.vue'
import Stepper, { type StepItem } from 'src/components/Stepper/Stepper.vue'
import Text from 'src/components/Text/Text.vue'

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
const { validateAll, stepHasError } = useValidation()

// Reactive: badges clear as soon as the user resolves the error (post-submit).
const errorSteps = computed(() =>
  Object.entries(stepHasError.value)
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
  // Stay on Review on failure — the error banner + per-step badges + field hints
  // surface what's missing (no auto-jump).
  if (!result.valid) return
  emit('submit')
}
</script>

<template>
  <div class="bg-surface-l0 flex h-screen flex-col">
    <!-- Header — 72px -->
    <AppHeader class="shrink-0" />
    <div class="bg-[var(--border-neutral-muted)] h-px shrink-0" />

    <!-- Stepper — 80px -->
    <div class="flex h-[80px] shrink-0 items-center px-6 lg:px-30">
      <Stepper
        class="w-full"
        :steps="STEPS"
        :current="state.currentStep"
        :error-steps="errorSteps"
        @navigate="goTo"
      />
    </div>
    <div class="bg-[var(--border-neutral-muted)] h-px shrink-0" />

    <!-- Form — fills the remaining viewport, scrolls -->
    <div class="flex-1 overflow-y-auto px-6 py-10 lg:px-30">
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
    <div class="bg-[var(--border-neutral-muted)] h-px shrink-0" />

    <!-- Actions — 72px -->
    <div class="flex h-[72px] shrink-0 items-center justify-between px-6 lg:px-30">
      <button
        v-if="state.currentStep > 1"
        type="button"
        class="bg-surface-l2 hover:bg-surface-l3 cursor-pointer rounded-md border-0 px-4 py-2"
        @click="goBack"
      >
        <Text
          as="span"
          variant="subtitle2"
          color="neutral"
        >
          Back
        </Text>
      </button>
      <span v-else />

      <button
        type="button"
        class="bg-accent-emphasis-rest hover:bg-accent-emphasis-hover cursor-pointer rounded-[10px] border-0 px-5 py-2"
        @click="isLastStep ? submit() : goNext()"
      >
        <Text
          as="span"
          variant="subtitle2"
          color="inverse"
        >
          {{ isLastStep ? 'Submit Registration' : NEXT_LABEL[state.currentStep] }}
        </Text>
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
