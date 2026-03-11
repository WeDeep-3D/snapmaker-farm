<script setup lang="ts">
import { ref } from 'vue';

import { bus } from 'boot/bus';
import ScanPanel from 'components/devices/ScanPanel.vue';
import ScanResultPanel from 'components/devices/ScanResultPanel.vue';

import { MAX_IP_COUNT, useScan } from 'src/composables/devices/scan';
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
    <div class="text-h5 q-pt-lg q-pl-lg">
      {{ i18n('labels.title') }}
    </div>

    <q-stepper class="col-grow column" animated color="primary" flat vertical v-model="step">
      <q-step :name="1" :done="step > 1" icon="settings" :title="i18n('labels.setRegionTitle')">
        {{ i18n('labels.setRegionDescription') }}
        <q-stepper-navigation>
          <q-btn color="primary" :label="i18n('labels.continue')" no-caps @click="step += 1" />
        </q-stepper-navigation>
      </q-step>
      <q-step :name="2" :done="step > 2" icon="radar" :title="i18n('labels.scanDevicesTitle')">
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
      <q-step
        :name="3"
        :class="{ 'col-grow': step === 3 }"
        icon="devices"
        :title="i18n('labels.selectDevicesTitle')"
      >
        <scan-result-panel
          class="col-grow"
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

<style scoped>
:deep(.q-stepper__content) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
}

:deep(.q-stepper__step.col-grow) {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

:deep(.q-stepper__step.col-grow > .q-stepper__tab) {
  flex-grow: 0;
  flex-shrink: 0;
}

:deep(.q-stepper__step.col-grow > .q-stepper__step-content) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
}

:deep(.q-stepper__step.col-grow .q-stepper__step-inner) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
}
</style>
