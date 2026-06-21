<script setup lang="ts">
// App header: logo emblem + event name. Left-aligned on desktop, centered on mobile.
import Text from 'src/components/Text/Text.vue'
</script>

<template>
  <header class="flex h-[72px] items-center justify-center px-12 md:justify-start">
    <div class="flex items-center gap-3">
      <span class="bg-brand-emphasis-rest flex h-10 w-10 items-center justify-center rounded-lg">
        <!-- N emblem (Logo.svg) — white mark on brand-emphasis square -->
        <svg
          class="text-inverse h-[14px] w-7"
          viewBox="6 13 28 14"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M26.9988 27.015C15.7304 26.9826 19.3543 20.0128 13 20.0038V12.9922C22.6405 13.0062 20.0417 19.9935 26.9988 20.0035V27.0147V27.015Z" />
          <path d="M34.0006 12.9922H27V20.0035H34.0006V12.9922Z" />
          <path d="M13.0006 20H6V27.0113H13.0006V20Z" />
        </svg>
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
