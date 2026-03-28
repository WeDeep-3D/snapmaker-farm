<script setup lang="ts">
import { ref, watch } from 'vue';

import type { Device } from 'src/composables/api/devicesApi/types';

import { bus } from 'boot/bus';
import { i18nSubPath } from 'src/utils/common';

const props = defineProps<{
  deviceId: string | undefined;
}>();

const i18n = i18nSubPath('components.devices.DeviceDetailsPanel');

const deviceInfo = ref<Device>();

watch(
  () => props.deviceId,
  async (newDeviceId) => {
    if (newDeviceId) {
      // Fetch device details using the newDeviceId and update deviceInfo
      // For example:
      // deviceInfo.value = await fetchDeviceDetails(newDeviceId);
    }
  },
  { immediate: true }
)

const closeDrawer = () => {
  bus.emit('drawer', 'close', 'right');
};
</script>

<template>
  <div class="column fit">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>{{ i18n('labels.title') }}</q-toolbar-title>
      <q-btn dense flat icon="close" @click="closeDrawer" />
    </q-toolbar>

    <div class="q-pa-md">
      <!-- Device details content will be implemented here -->
    </div>
  </div>
</template>

<style scoped></style>
