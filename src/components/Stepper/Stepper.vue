<script setup lang="ts">
import Text from 'src/components/Text/Text.vue'

export interface StepItem {
  n: number
  label: string
}

const props = defineProps<{
  steps: StepItem[]
  current: number
  /** Step numbers that currently carry validation errors. */
  errorSteps?: number[]
}>()

const emit = defineEmits<{ navigate: [step: number] }>()

type Status = 'done' | 'current' | 'error' | 'future'

function statusOf(step: number): Status {
  if (props.errorSteps?.includes(step)) return 'error'
  if (step < props.current) return 'done'
  if (step === props.current) return 'current'
  return 'future'
}

const CIRCLE_CLASS: Record<Status, string> = {
  done: 'bg-brand-emphasis-rest text-inverse',
  current: 'bg-brand-emphasis-rest text-inverse',
  error: 'bg-danger-emphasis-rest text-inverse',
  future: 'bg-surface-l3 text-neutral-muted',
}
const LABEL_CLASS: Record<Status, string> = {
  done: 'text-neutral',
  current: 'text-neutral',
  error: 'text-danger',
  future: 'text-neutral-muted',
}
</script>

<template>
  <nav class="flex items-center">
    <template
      v-for="(step, index) in steps"
      :key="step.n"
    >
      <button
        type="button"
        class="flex shrink-0 cursor-pointer items-center gap-2 border-0 bg-transparent"
        @click="emit('navigate', step.n)"
      >
        <span
          class="flex h-8 w-8 items-center justify-center rounded-full"
          :class="CIRCLE_CLASS[statusOf(step.n)]"
        >
          <q-icon
            v-if="statusOf(step.n) === 'done'"
            name="check"
            size="18px"
          />
          <q-icon
            v-else-if="statusOf(step.n) === 'error'"
            name="priority_high"
            size="16px"
          />
          <Text
            v-else
            as="span"
            variant="body-medium"
          >{{ step.n }}</Text>
        </span>
        <Text
          as="span"
          variant="subtitle2"
          :class="LABEL_CLASS[statusOf(step.n)]"
          nowrap
        >
          {{ step.label }}
        </Text>
      </button>

      <span
        v-if="index < steps.length - 1"
        class="mx-3 h-0.5 flex-1 rounded-full"
        :class="current > step.n ? 'bg-brand-emphasis-rest' : 'bg-surface-l3'"
      />
    </template>
  </nav>
</template>
