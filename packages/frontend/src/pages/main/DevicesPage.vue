<script setup lang="ts">
import { ref } from 'vue';

import { bus } from 'boot/bus';
import DevicesPanel from 'components/devices/DevicesPanel.vue';
import { i18nSubPath } from 'src/utils/common';

const i18n = i18nSubPath('pages.main.DevicesPage');

const displayOptions = [
  {
    label: i18n('labels.grid'),
    icon: 'grid_view',
    value: 'grid',
  },
  {
    label: i18n('labels.list'),
    icon: 'format_list_bulleted',
    value: 'list',
  },
];

const displayOption = ref<'grid' | 'list'>('list');
const panelOption = ref('devices');

const showAddDevicesDrawer = () => {
  bus.emit('devicesDrawer', 'addDevices');
  bus.emit('drawer', 'open', 'right');
};
</script>

<template>
  <q-page class="column q-gutter-lg q-pa-md">
    <q-card bordered flat>
      <q-card-section class="row justify-between">
        <div class="row items-center q-gutter-x-sm">
          <div class="text-h6">
            {{ i18n('labels.displayMode') }}
          </div>
          <q-btn-toggle :options="displayOptions" no-caps v-model="displayOption" />
        </div>
        <q-btn :label="i18n('labels.scanDevices')" @click="showAddDevicesDrawer" />
      </q-card-section>
    </q-card>
    <devices-panel v-show="panelOption === 'devices'" :display="displayOption" />
  </q-page>
</template>

<style scoped></style>
