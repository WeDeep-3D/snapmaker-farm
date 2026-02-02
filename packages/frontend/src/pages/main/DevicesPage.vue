<script setup lang="ts">
import { Dialog } from 'quasar';
import { ref } from 'vue';

import ScanDevicesDialog from 'components/devices/ScanDevicesDialog.vue';

import { i18nSubPath } from 'src/utils/common';

const i18n = i18nSubPath('pages.main.DevicesPage');

const displayOptions = [
  {
    icon: 'grid_view',
    value: 'grid',
    slot: 'grid',
  },
  {
    icon: 'format_list_bulleted',
    value: 'list',
    slot: 'list',
  },
];

const currentDisplayOption = ref('grid');

const showAddDeviceDialog = () => {
  Dialog.create({
    component: ScanDevicesDialog,
    componentProps: {},
  }).onOk(() => {});
};
</script>

<template>
  <q-page class="column q-gutter-lg q-pa-md">
    <q-card bordered flat>
      <q-card-section class="row justify-between q-gutter-x-md">
        <q-btn-toggle
          dense
          :options="displayOptions"
          toggle-color="primary"
          v-model="currentDisplayOption"
        >
          <template v-for="option in displayOptions" :key="option.value" v-slot:[option.slot]>
            <q-tooltip>
              {{ i18n(`tooltips.display.${option.value}`) }}
            </q-tooltip>
          </template>
        </q-btn-toggle>
        <q-btn color="primary" :label="i18n('labels.scanDevices')" @click="showAddDeviceDialog" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped></style>
