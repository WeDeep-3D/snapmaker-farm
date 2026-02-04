<script setup lang="ts">
import { ref } from 'vue';

import { i18nSubPath } from 'src/utils/common';
import ScanPanel from 'components/devices/ScanPanel.vue';
import DevicesPanel from 'components/devices/DevicesPanel.vue';

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

const panelOptions = [
  {
    label: i18n('labels.viewDevices'),
    icon: 'print',
    value: 'devices',
  },
  {
    label: i18n('labels.scanDevices'),
    icon: 'search',
    value: 'scan',
  },
];

const displayOption = ref<'grid' | 'list'>('grid');
const panelOption = ref('devices');
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
        <q-btn-toggle :options="panelOptions" no-caps v-model="panelOption" />
      </q-card-section>
    </q-card>
    <devices-panel v-show="panelOption === 'devices'" :display="displayOption" />
    <scan-panel v-show="panelOption === 'scan'" class="col-grow" />
  </q-page>
</template>

<style scoped></style>
