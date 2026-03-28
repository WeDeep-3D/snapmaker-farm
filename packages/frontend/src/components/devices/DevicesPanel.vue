<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useDevicesApi } from 'src/composables/api/devicesApi';
import type { Device } from 'src/composables/api/devicesApi/types';

import DevicesGridView from 'components/devices/DevicesGridView.vue';

defineProps<{
  display: 'grid' | 'list';
}>();

const { getDevices } = useDevicesApi();

const devices = ref<Device[]>([]);
const selectedDevices = ref(new Set<string>());

const retrieveDevices = async () => {
  devices.value = ((await getDevices()) ?? []).toSorted((a, b) => {
    if (a.deviceInfo && b.deviceInfo) {
      return a.deviceInfo?.name.localeCompare(b.deviceInfo?.name);
    }
    const modelComparison = a.model.localeCompare(b.model);
    if (modelComparison) {
      return modelComparison;
    }
    return a.serialNumber.localeCompare(b.serialNumber);
  });
};

onMounted(async () => {
  await retrieveDevices();
});
</script>

<template>
  <devices-grid-view v-if="display === 'grid'" :devices="devices" v-model="selectedDevices" />
</template>

<style scoped></style>
