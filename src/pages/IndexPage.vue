<script setup lang="ts">
// Single mount point for the registration wizard.
// The wizard shell (QStepper + steps + live summary) is implemented in #23;
// this page only establishes the route and placeholder while the structure lands.
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-surface-l1">
        <div
          class="text-neutral-muted text-subtitle1"
          data-testid="wizard-placeholder"
        >
          Registration wizard mounts here
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
