<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { bus } from 'boot/bus';
import AddDevicesPanel from 'components/devices/AddDevicesPanel.vue';
import DeviceDetailsPanel from 'components/devices/DeviceDetailsPanel.vue';

const content = ref<'addDevices' | 'deviceDetails'>('deviceDetails');
const deviceId = ref<string>();
const width = ref(500);

const onContentSwitch = (newContent: 'addDevices' | 'deviceDetails', newDeviceId?: string) => {
  content.value = newContent;
  width.value = newContent === 'addDevices' ? 700 : 500;
  if (newDeviceId?.length) {
    deviceId.value = newDeviceId;
  }
};

onMounted(() => bus.on('devicesDrawer', onContentSwitch));
onBeforeUnmount(() => bus.off('devicesDrawer', onContentSwitch));
</script>

<template>
  <q-drawer
    bordered
    no-swipe-backdrop
    no-swipe-close
    no-swipe-open
    side="right"
    :width="width"
    @show="bus.emit('drawer', 'open', 'right')"
    @hide="bus.emit('drawer', 'close', 'right')"
  >
    <add-devices-panel v-if="content === 'addDevices'" />
    <device-details-panel v-else-if="content === 'deviceDetails'" :device-id="deviceId"/>
  </q-drawer>
</template>

<style scoped></style>
