<script setup lang="ts">
import { ref } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { useValidation } from 'src/composables/useValidation'
import WizardShell from 'src/components/WizardShell/WizardShell.vue'
import Step1Attendee from 'src/components/steps/Step1Attendee/Step1Attendee.vue'
import Step2Sessions from 'src/components/steps/Step2Sessions/Step2Sessions.vue'
import Step3Addons from 'src/components/steps/Step3Addons/Step3Addons.vue'
import Step4Review from 'src/components/steps/Step4Review/Step4Review.vue'
import SuccessScreen from 'src/components/SuccessScreen/SuccessScreen.vue'

const { reset } = useRegistration()
const { resetValidation } = useValidation()
const submitted = ref(false)

function onSubmit(): void {
  submitted.value = true
}

/** Back to Home — clear the registration and return to a pristine step 1. */
function onHome(): void {
  reset()
  resetValidation()
  submitted.value = false
}
</script>

<template>
  <SuccessScreen
    v-if="submitted"
    @home="onHome"
  />

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
