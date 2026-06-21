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
  <div
    v-if="submitted"
    class="bg-surface-l1 flex min-h-screen items-center justify-center p-6"
  >
    <div class="w-full max-w-[640px]">
      <SuccessScreen />
    </div>
  </div>

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
</template>
