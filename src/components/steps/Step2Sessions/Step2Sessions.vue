<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegistration } from 'src/composables/useRegistration'
import { useConflicts } from 'src/composables/useConflicts'
import { useValidation } from 'src/composables/useValidation'
import { useLocale } from 'src/composables/useLocale'
import { loadSessions, groupSessionsByDate } from 'src/data/sessions'
import type { Session, SessionTrack } from 'src/types/session'
import SelectableCard from '@lib/nitra-ui/SelectableCard/SelectableCard.vue'
import OptionGroup from '@lib/nitra-ui/OptionGroup/OptionGroup.vue'
import Chip from '@lib/nitra-ui/Chip/Chip.vue'
import Checkbox from '@lib/nitra-ui/Checkbox/Checkbox.vue'
import Text from '@lib/nitra-ui/Text/Text.vue'

const { t } = useI18n()
const { timeRange, dayLabel, sessionTitle, sessionSpeakerTitle, trackLabel } = useLocale()
const { state } = useRegistration()
const { fullSessionIds } = useConflicts()
const { sessionConflictIds } = useValidation()

const sessionsByDay = groupSessionsByDate(loadSessions())
const days = Object.keys(sessionsByDay)
const activeDay = ref(days[0] ?? '')
const dayOptions = computed(() => days.map((day) => ({ label: dayLabel(day), value: day })))

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
  return fullSessionIds.has(session.id)
}
/** A selected session overlapping another, surfaced after a submit attempt. */
function isConflicting(session: Session): boolean {
  return sessionConflictIds.value.has(session.id)
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
    <Text
      as="h2"
      variant="h4"
      color="neutral"
    >
      {{ t('step2.title') }}
    </Text>

    <OptionGroup
      variant="tab"
      block
      :options="dayOptions"
      :model-value="activeDay"
      :label="t('step2.selectDay')"
      @update:model-value="(v) => (activeDay = String(v))"
    />

    <Text
      variant="body-medium"
      color="brand"
    >
      {{ t('step2.selectedCount', { count: state.selectedSessionIds.length }) }}
    </Text>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SelectableCard
        v-for="session in visibleSessions"
        :key="session.id"
        :level="0"
        :selected="isSelected(session.id)"
        :full="isFull(session)"
        :error="isConflicting(session)"
        @select="toggle(session)"
      >
        <div class="flex items-center justify-between gap-2">
          <Chip
            tone="custom"
            class="uppercase"
            :class="TRACK_CLASS[session.track]"
          >
            <Text
              as="span"
              variant="body-xs-medium"
            >
              {{ trackLabel(session.track) }}
            </Text>
          </Chip>
          <Checkbox
            :checked="isSelected(session.id)"
            :class="isSelected(session.id) ? 'text-[var(--bg-brand-emphasis-rest)]' : 'text-gray-700'"
          />
        </div>

        <Text
          as="h3"
          variant="subtitle1"
          color="neutral"
        >
          {{ sessionTitle(session.id) }}
        </Text>
        <Text
          variant="body"
          color="muted"
        >
          {{ session.speaker }}, {{ sessionSpeakerTitle(session.id) }}
        </Text>
        <Text
          variant="body-xs"
          color="quiet"
        >
          {{ timeRange(session.date, session.endDate) }}
        </Text>

        <div class="bg-surface-l2 h-[6px] overflow-hidden rounded-full">
          <div
            class="h-full rounded-full"
            :class="barClass(session)"
            :style="{ width: `${fillPercent(session)}%` }"
          />
        </div>
        <Text
          variant="body-xs-medium"
          :class="spotsClass(session)"
        >
          {{ isFull(session) ? t('step2.soldOut') : t('step2.spotsLeft', { count: spotsLeft(session) }) }}
        </Text>

        <Text
          v-if="isConflicting(session)"
          variant="body-xs"
          color="danger"
          class="flex items-center gap-1"
        >
          <q-icon
            name="error_outline"
            size="14px"
          />
          {{ t('step2.conflict') }}
        </Text>
      </SelectableCard>
    </div>
  </div>
</template>
