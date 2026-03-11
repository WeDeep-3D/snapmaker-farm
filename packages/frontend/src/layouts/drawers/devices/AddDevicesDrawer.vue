<script setup lang="ts">
import { ref } from 'vue';

import { bus } from 'boot/bus';
import ScanPanel from 'components/devices/ScanPanel.vue';
import ScanResultPanel from 'components/devices/ScanResultPanel.vue';

import { MAX_IP_COUNT, useScan } from 'src/composables/devices/useScan';
import { i18nSubPath } from 'src/utils/common';

const i18n = i18nSubPath('layouts.drawers.devices.AddDevicesDrawer');

const {
  scanDetail,
  totalCount,
  scanProgress,
  scanBuffer,
  isScanning,
  requestScan,
  stopPolling,
  POLL_INTERVAL_MS,
} = useScan();

const step = ref(1);

const continueToScan = async () => {
  step.value = 3;
  await requestScan();
};

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

    <q-stepper class="col-grow no-shadow" v-model="step" vertical color="primary" animated flat>
      <q-step :name="1" :title="i18n('labels.setRegionTitle')" icon="settings" :done="step > 1">
        {{ i18n('labels.setRegionDescription') }}
        <q-stepper-navigation>
          <q-btn color="primary" :label="i18n('labels.continue')" no-caps @click="step += 1" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="2" :title="i18n('labels.scanDevicesTitle')" icon="radar" :done="step > 2">
        <scan-panel />
        <q-stepper-navigation>
          <q-btn
            color="primary"
            :disable="totalCount >= MAX_IP_COUNT"
            :label="i18n('labels.startScan')"
            no-caps
            @click="continueToScan"
          />
          <q-btn
            flat
            color="primary"
            :label="i18n('labels.back')"
            class="q-ml-sm"
            @click="step -= 1"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" :title="i18n('labels.selectDevicesTitle')" icon="devices">
        <scan-result-panel
          :scan-detail="scanDetail"
          :scan-progress="scanProgress"
          :scan-buffer="scanBuffer"
          :poll-interval-ms="POLL_INTERVAL_MS"
        />
        <q-stepper-navigation>
          <q-btn
            color="primary"
            :disable="isScanning"
            :label="i18n('labels.bindDevices')"
            no-caps
            @click="closeDrawer"
          />
          <q-btn
            flat
            color="primary"
            :label="i18n('labels.back')"
            class="q-ml-sm"
            @click="
              stopPolling();
              step -= 1;
            "
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<style scoped></style>
