<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { useConflicts } from 'src/composables/useConflicts'
import { loadSessions, groupSessionsByDate } from 'src/data/sessions'
import { formatTimeRange, formatDayLabel } from 'src/utils/datetime'
import type { Session, SessionTrack } from 'src/types/session'
import SelectableCard from 'src/components/SelectableCard/SelectableCard.vue'

const { state } = useRegistration()
const { fullSessionIds } = useConflicts()

const sessionsByDay = groupSessionsByDate(loadSessions())
const days = Object.keys(sessionsByDay)
const activeDay = ref(days[0] ?? '')

const visibleSessions = computed<Session[]>(() => sessionsByDay[activeDay.value] ?? [])

/** Track badge colour, by track. */
const TRACK_CLASS: Record<SessionTrack, string> = {
  main: 'bg-surface-l2 text-neutral-muted',
  frontend: 'bg-accent-muted-rest text-accent-emphasis',
  backend: 'bg-info-muted-rest text-info-emphasis',
  devops: 'bg-warning-muted-rest text-warning-emphasis',
}

function isSelected(id: string): boolean {
  return state.selectedSessionIds.includes(id)
}

function toggle(session: Session): void {
  if (fullSessionIds.value.has(session.id)) return
  const index = state.selectedSessionIds.indexOf(session.id)
  if (index >= 0) state.selectedSessionIds.splice(index, 1)
  else state.selectedSessionIds.push(session.id)
}

function spotsLeft(session: Session): number {
  return Math.max(session.capacity - session.registered, 0)
}

function fillPercent(session: Session): number {
  return Math.min(Math.round((session.registered / session.capacity) * 100), 100)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-h6 text-neutral font-bold">
      Select Sessions
    </h2>

    <div
      role="radiogroup"
      aria-label="Conference day"
      class="bg-surface-l2 inline-flex w-fit gap-1 rounded-lg p-1"
    >
      <button
        v-for="day in days"
        :key="day"
        type="button"
        role="radio"
        :aria-checked="activeDay === day"
        class="rounded-md px-3 py-1 text-subtitle2 transition-colors"
        :class="
          activeDay === day
            ? 'bg-brand-emphasis-rest text-inverse'
            : 'text-neutral-muted hover:bg-surface-l3'
        "
        @click="activeDay = day"
      >
        {{ formatDayLabel(day) }}
      </button>
    </div>

    <p class="text-neutral-muted text-sm">
      {{ state.selectedSessionIds.length }} session(s) selected
    </p>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SelectableCard
        v-for="session in visibleSessions"
        :key="session.id"
        :selected="isSelected(session.id)"
        :full="fullSessionIds.has(session.id)"
        @select="toggle(session)"
      >
        <div class="flex items-start justify-between gap-2">
          <span
            class="rounded-full px-2 py-0.5 text-xs font-medium uppercase"
            :class="TRACK_CLASS[session.track]"
          >
            {{ session.track }}
          </span>
          <q-icon
            :name="isSelected(session.id) ? 'check_box' : 'check_box_outline_blank'"
            size="20px"
            :class="isSelected(session.id) ? 'text-brand' : 'text-neutral-quiet'"
          />
        </div>

        <h3 class="text-subtitle1 text-neutral mt-2 font-semibold">
          {{ session.title }}
        </h3>
        <p class="text-neutral-muted text-sm">
          {{ session.speaker }}, {{ session.speakerTitle }}
        </p>
        <p class="text-neutral-muted mt-1 text-sm">
          {{ formatTimeRange(session.date, session.endDate) }}
        </p>

        <div class="bg-surface-l3 mt-3 h-1.5 overflow-hidden rounded-full">
          <div
            class="h-full rounded-full"
            :class="fullSessionIds.has(session.id) ? 'bg-danger-emphasis-rest' : 'bg-accent-emphasis-rest'"
            :style="{ width: `${fillPercent(session)}%` }"
          />
        </div>
        <p
          class="mt-1 text-xs font-medium"
          :class="fullSessionIds.has(session.id) ? 'text-danger' : 'text-accent-emphasis'"
        >
          {{ fullSessionIds.has(session.id) ? 'Sold Out' : `${spotsLeft(session)} spots left` }}
        </p>
      </SelectableCard>
    </div>
  </div>
</template>
