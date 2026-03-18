<script setup lang="ts">
import { ref } from 'vue';

import ScanRangesPanel from 'components/devices/ScanRangesPanel.vue';
import ScanRegionPanel from 'components/devices/ScanRegionPanel.vue';
import ScanResultPanel from 'components/devices/ScanResultPanel.vue';

import type { Region } from 'src/composables/devices/regionsApi';
import { useScansApi } from 'src/composables/devices/scansApi';
import { MAX_IP_COUNT } from 'src/composables/devices/scansApi/constants';

import { bus } from 'boot/bus';
import { i18nSubPath } from 'src/utils/common';

const i18n = i18nSubPath('layouts.drawers.devices.AddDevicesDrawer');

const { scanDetail, totalCount, scanProgress, scanBuffer, isScanning, requestScan, stopPolling } =
  useScansApi();

const region = ref<Region>();
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
    <q-stepper
      class="col-grow column"
      active-icon="settings"
      animated
      color="primary"
      flat
      vertical
      v-model="step"
    >
      <q-step :name="1" :done="step > 1" icon="location_on" :title="i18n('labels.setRegionTitle')">
        <scan-region-panel v-model="region" />
        <q-stepper-navigation>
          <q-btn color="primary" :label="i18n('labels.continue')" no-caps @click="step += 1" />
        </q-stepper-navigation>
      </q-step>
      <q-step :name="2" :done="step > 2" icon="radar" :title="i18n('labels.scanDevicesTitle')">
        <scan-ranges-panel />
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
/*noinspection CssUnusedSymbol*/
:deep(.q-stepper__content) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
}
/*noinspection CssUnusedSymbol*/
:deep(.q-stepper__step.col-grow) {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
/*noinspection CssUnusedSymbol*/
:deep(.q-stepper__step.col-grow > .q-stepper__tab) {
  flex-grow: 0;
  flex-shrink: 0;
}
/*noinspection CssUnusedSymbol*/
:deep(.q-stepper__step.col-grow > .q-stepper__step-content) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
}
/*noinspection CssUnusedSymbol*/
:deep(.q-stepper__step.col-grow .q-stepper__step-inner) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
}
</style>
