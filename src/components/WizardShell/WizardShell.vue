<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegistration } from 'src/composables/useRegistration'
import { useValidation } from 'src/composables/useValidation'
import AppHeader from 'src/components/AppHeader/AppHeader.vue'
import Stepper, { type StepItem } from '@lib/nitra-ui/Stepper/Stepper.vue'
import Button from '@lib/nitra-ui/Button/Button.vue'

const emit = defineEmits<{ submit: [] }>()

const { t } = useI18n()

const STEPS = computed<StepItem[]>(() => [
  { n: 1, label: t('stepper.attendee') },
  { n: 2, label: t('stepper.sessions') },
  { n: 3, label: t('stepper.addons') },
  { n: 4, label: t('stepper.review') },
])

/** Contextual label for the primary action, by current step. */
const NEXT_LABEL = computed<Record<number, string>>(() => ({
  1: t('nav.nextSessions'),
  2: t('nav.nextAddons'),
  3: t('nav.nextReview'),
}))

const { state } = useRegistration()
const { validateAll, stepHasError } = useValidation()

// Reactive: badges clear as soon as the user resolves the error (post-submit).
const errorSteps = computed(() =>
  Object.entries(stepHasError.value)
    .filter(([, hasError]) => hasError)
    .map(([step]) => Number(step)),
)

const isLastStep = computed(() => state.currentStep >= STEPS.value.length)

function goTo(step: number): void {
  state.currentStep = step
}
function goNext(): void {
  if (state.currentStep < STEPS.value.length) state.currentStep += 1
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
      <Button
        v-if="state.currentStep > 1"
        variant="secondary"
        @click="goBack"
      >
        {{ t('common.back') }}
      </Button>
      <span v-else />

      <Button
        variant="primary"
        @click="isLastStep ? submit() : goNext()"
      >
        {{ isLastStep ? t('nav.submit') : NEXT_LABEL[state.currentStep] }}
      </Button>
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
