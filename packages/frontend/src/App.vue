<script setup lang="ts">
import { onMounted } from 'vue';

import { useSettingsStore } from 'stores/settings';

const { applyTheme, updateLocale } = useSettingsStore();

onMounted(() => {
  applyTheme();
  updateLocale()
});
</script>

<template>
  <router-view />
</template>
