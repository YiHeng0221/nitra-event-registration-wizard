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

/** Track badge colours (bg + text), by track. */
const TRACK_CLASS: Record<SessionTrack, string> = {
  main: 'bg-gray-50 text-gray-700',
  frontend: 'bg-orange-50 text-orange-600',
  backend: 'bg-blue-50 text-blue-600',
  devops: 'bg-yellow-200 text-yellow-900',
}

function isSelected(id: string): boolean {
  return state.selectedSessionIds.includes(id)
}
function isFull(session: Session): boolean {
  return fullSessionIds.value.has(session.id)
}
function toggle(session: Session): void {
  if (isFull(session)) return
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

/** Capacity bar fill colour by how full the session is. */
function barClass(session: Session): string {
  if (isFull(session)) return 'bg-danger-emphasis-rest'
  const fill = fillPercent(session)
  if (fill >= 70) return 'bg-orange-600'
  if (fill >= 50) return 'bg-yellow-800'
  return 'bg-[var(--bg-brand-emphasis-rest)]'
}
function spotsClass(session: Session): string {
  if (isFull(session)) return 'text-danger-emphasis'
  const fill = fillPercent(session)
  if (fill >= 70) return 'text-orange-700'
  if (fill >= 50) return 'text-yellow-800'
  return 'text-[var(--bg-brand-emphasis-rest)]'
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
      class="bg-surface-l2 inline-flex w-fit gap-1 rounded-md p-1"
    >
      <button
        v-for="day in days"
        :key="day"
        type="button"
        role="radio"
        :aria-checked="activeDay === day"
        class="cursor-pointer rounded-md border-0 bg-transparent px-3 py-1.5 text-[14px] font-semibold transition-colors"
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

    <p class="text-brand text-sm font-medium">
      {{ state.selectedSessionIds.length }} session(s) selected
    </p>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SelectableCard
        v-for="session in visibleSessions"
        :key="session.id"
        :level="0"
        :selected="isSelected(session.id)"
        :full="isFull(session)"
        @select="toggle(session)"
      >
        <div class="flex items-center justify-between gap-2">
          <span
            class="rounded-full px-[6px] py-[3px] text-[11px] font-medium uppercase"
            :class="TRACK_CLASS[session.track]"
          >
            {{ session.track }}
          </span>
          <q-icon
            :name="isSelected(session.id) ? 'check_box' : 'check_box_outline_blank'"
            size="18px"
            :class="isSelected(session.id) ? 'text-[var(--bg-brand-emphasis-rest)]' : 'text-gray-700'"
          />
        </div>

        <h3 class="text-subtitle1 text-neutral mt-2 font-semibold">
          {{ session.title }}
        </h3>
        <p class="text-neutral-muted text-[12px]">
          {{ session.speaker }}, {{ session.speakerTitle }}
        </p>
        <p class="text-neutral-quiet mt-1 text-[11px]">
          {{ formatTimeRange(session.date, session.endDate) }}
        </p>

        <div class="bg-surface-l2 mt-3 h-[6px] overflow-hidden rounded-full">
          <div
            class="h-full rounded-full"
            :class="barClass(session)"
            :style="{ width: `${fillPercent(session)}%` }"
          />
        </div>
        <p
          class="mt-1 text-[11px] font-medium"
          :class="spotsClass(session)"
        >
          {{ isFull(session) ? 'Sold Out' : `${spotsLeft(session)} spots left` }}
        </p>
      </SelectableCard>
    </div>
  </div>
</template>
