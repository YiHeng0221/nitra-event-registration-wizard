<script setup lang="ts">
import WizardShell from 'src/components/WizardShell/WizardShell.vue'
import Step1Attendee from 'src/components/steps/Step1Attendee/Step1Attendee.vue'
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="bg-surface-l1 p-4">
        <h1 class="text-h4 text-neutral mb-4">
          WebDev Summit 2028 — Registration
        </h1>
        <WizardShell>
          <template #step-attendee>
            <Step1Attendee />
          </template>
        </WizardShell>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
