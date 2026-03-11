<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

import { bus } from 'boot/bus';
import AddDevicesDrawer from 'layouts/drawers/devices/AddDevicesDrawer.vue';
import DeviceDetailsDrawer from 'layouts/drawers/devices/DeviceDetailsDrawer.vue';

type DevicesDrawerContent = 'addDevices' | 'deviceDetails';

const content = ref<DevicesDrawerContent>('deviceDetails');

const onContentSwitch = (newContent: DevicesDrawerContent) => {
  content.value = newContent;
};

bus.on('devicesDrawer', onContentSwitch);

onBeforeUnmount(() => {
  bus.off('devicesDrawer', onContentSwitch);
});
</script>

<template>
  <q-drawer
    bordered
    no-swipe-backdrop
    no-swipe-close
    no-swipe-open
    side="right"
    :width="500"
    @show="bus.emit('drawer', 'open', 'right')"
    @hide="bus.emit('drawer', 'close', 'right')"
  >
    <add-devices-drawer v-if="content === 'addDevices'" />
    <device-details-drawer v-else-if="content === 'deviceDetails'" />
  </q-drawer>
</template>

<style scoped></style>
