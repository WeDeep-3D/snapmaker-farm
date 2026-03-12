<script setup lang="ts">
import { bus } from 'boot/bus';
import { i18nSubPath } from 'src/utils/common';

const i18n = i18nSubPath('layouts.drawers.devices.DeviceDetailsDrawer');

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
