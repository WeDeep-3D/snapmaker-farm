<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { bus } from 'boot/bus';
import AddDevicesDrawer from 'layouts/drawers/devices/AddDevicesDrawer.vue';
import DeviceDetailsDrawer from 'layouts/drawers/devices/DeviceDetailsDrawer.vue';

const content = ref<'addDevices' | 'deviceDetails'>('deviceDetails');
const width = ref(500);

const onContentSwitch = (newContent: 'addDevices' | 'deviceDetails') => {
  content.value = newContent;
  width.value = newContent === 'addDevices' ? 700 : 500;
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
    <add-devices-drawer v-if="content === 'addDevices'" />
    <device-details-drawer v-else-if="content === 'deviceDetails'" />
  </q-drawer>
</template>

<style scoped></style>
