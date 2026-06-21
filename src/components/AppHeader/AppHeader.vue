<script setup lang="ts">
// App header: logo emblem + event name. Left-aligned on desktop, centered on mobile.
import Text from 'src/components/Text/Text.vue'
</script>

<template>
  <header class="flex h-[72px] items-center justify-center px-12 md:justify-start">
    <div class="flex items-center gap-3">
      <span class="bg-neutral-emphasis-rest flex h-9 w-9 items-center justify-center rounded-lg">
        <q-icon
          name="hub"
          size="20px"
          class="text-inverse"
        />
      </span>
      <Text
        as="span"
        variant="subtitle1"
        color="neutral"
      >
        WebDev Summit 2028
      </Text>
    </div>
  </header>
</template>
