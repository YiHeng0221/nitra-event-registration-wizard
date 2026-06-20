<script setup lang="ts">
import { ref } from 'vue'
import WizardShell from 'src/components/WizardShell/WizardShell.vue'
import Step1Attendee from 'src/components/steps/Step1Attendee/Step1Attendee.vue'
import Step2Sessions from 'src/components/steps/Step2Sessions/Step2Sessions.vue'
import Step3Addons from 'src/components/steps/Step3Addons/Step3Addons.vue'
import Step4Review from 'src/components/steps/Step4Review/Step4Review.vue'
import SuccessScreen from 'src/components/SuccessScreen/SuccessScreen.vue'

const submitted = ref(false)

function onSubmit(): void {
  submitted.value = true
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="bg-surface-l1 p-4">
        <h1 class="text-h4 text-neutral mb-4">
          WebDev Summit 2028 — Registration
        </h1>

        <SuccessScreen v-if="submitted" />

        <WizardShell
          v-else
          @submit="onSubmit"
        >
          <template #step-attendee>
            <Step1Attendee />
          </template>
          <template #step-sessions>
            <Step2Sessions />
          </template>
          <template #step-addons>
            <Step3Addons />
          </template>
          <template #step-review>
            <Step4Review />
          </template>
        </WizardShell>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
