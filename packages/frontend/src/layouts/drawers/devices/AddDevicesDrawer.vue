<script setup lang="ts">
import { IPv4 } from 'ip-num';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { computed, onBeforeUnmount, ref } from 'vue';

import { bus } from 'boot/bus';
import ScanPanel from 'components/devices/ScanPanel.vue';
import ScanResultGridView from 'components/devices/ScanResultGridView.vue';
import ScanResultListView from 'components/devices/ScanResultListView.vue';

import type { ScanDetail } from 'src/api/scans';
import { createScan, getScan } from 'src/api/scans';
import { i18nSubPath } from 'src/utils/common';
import { useScansStore } from 'stores/scans';

const i18n = i18nSubPath('layouts.drawers.devices.AddDevicesDrawer');

const { notify } = useQuasar();
const { ipRanges } = storeToRefs(useScansStore());

const MAX_IP_COUNT = 65536n;
const POLL_INTERVAL_MS = 500;

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
const scanDetail = ref<ScanDetail>();
const step = ref(1);

const getScanInterval = ref<number>();
const isPolling = ref(false);
const scanId = ref<string>();

const totalCount = computed(() =>
  ipRanges.value.reduce((acc, item) => {
    try {
      const beginNumber = IPv4.fromString(item.begin).value;
      const endNumber = IPv4.fromString(item.end).value;
      return (
        acc +
        (endNumber > beginNumber ? endNumber - beginNumber + 1n : beginNumber - endNumber + 1n)
      );
    } catch {
      return MAX_IP_COUNT;
    }
  }, 0n),
);

const scanProgress = computed(() => {
  if (!scanDetail.value || scanDetail.value.totalCount === 0) {
    return 0;
  }
  return (
    1 -
    (scanDetail.value.queuedCount + scanDetail.value.processingCount) / scanDetail.value.totalCount
  );
});

const scanBuffer = computed(() => {
  if (!scanDetail.value || scanDetail.value.totalCount === 0) {
    return 0;
  }
  return 1 - scanDetail.value.queuedCount / scanDetail.value.totalCount;
});

const isScanning = computed(
  () =>
    scanDetail.value !== undefined &&
    (scanDetail.value.queuedCount > 0 || scanDetail.value.processingCount > 0),
);

const stopPolling = () => {
  if (getScanInterval.value !== undefined) {
    window.clearInterval(getScanInterval.value);
    getScanInterval.value = undefined;
  }
};

const fetchScanDetail = async () => {
  if (!scanId.value) {
    return;
  }
  try {
    const { data } = await getScan(scanId.value);
    if (!data.success) {
      notify({
        type: 'negative',
        message: i18n('notifications.getScanDetailFailed'),
        caption: data.message,
      });
      return;
    }
    scanDetail.value = data.data;
  } catch (error) {
    notify({
      type: 'negative',
      message: i18n('notifications.getScanDetailError'),
      caption: (error as Error).message,
    });
  }
};

const pollScanDetail = async () => {
  if (isPolling.value) {
    return;
  }
  isPolling.value = true;
  try {
    await fetchScanDetail();
    if (scanDetail.value && !isScanning.value) {
      stopPolling();
      notify({
        type: 'positive',
        message: i18n('notifications.getScanDetailSuccess'),
      });
    }
  } catch (e) {
    notify({
      type: 'negative',
      message: i18n('notifications.getScanDetailError'),
      caption: (e as Error).message,
    });
  } finally {
    isPolling.value = false;
  }
};

const requestScan = async () => {
  if (getScanInterval.value !== undefined) {
    notify({
      type: 'warning',
      message: i18n('notifications.requestScanInProgress'),
    });
    return;
  }
  try {
    const { data } = await createScan(ipRanges.value);
    if (!data.success) {
      notify({
        type: 'negative',
        message: i18n('notifications.requestScanFailed'),
        caption: data.message,
      });
      return;
    }
    scanId.value = data.data;
    await fetchScanDetail();
    getScanInterval.value = window.setInterval(() => void pollScanDetail(), POLL_INTERVAL_MS);
    notify({
      type: 'positive',
      message: i18n('notifications.requestScanSuccess'),
      caption: `id: ${data.data}`,
    });
  } catch (error) {
    notify({
      type: 'negative',
      message: i18n('notifications.requestScanError'),
      caption: (error as Error).message,
    });
  }
};

const continueToScan = async () => {
  step.value = 3;
  await requestScan();
};

const closeDrawer = () => {
  bus.emit('drawer', 'close', 'right');
};

onBeforeUnmount(() => {
  stopPolling();
});
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
        <q-card v-if="scanDetail" class="q-mb-md" bordered flat>
          <q-card-section>
            <div class="row items-center q-gutter-x-sm">
              <div class="text-body1">
                {{ i18n('labels.scanProgress') }}
              </div>
              <q-linear-progress
                class="col-grow bg-grey-4"
                :animation-speed="POLL_INTERVAL_MS * 2"
                :buffer="scanBuffer"
                color="primary"
                rounded
                size="2rem"
                track-color="secondary"
                :value="scanProgress"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    text-color="accent"
                    :label="`${(scanProgress * 100).toFixed(2)}%`"
                  />
                </div>
              </q-linear-progress>
            </div>
          </q-card-section>
        </q-card>

        <div class="row items-center q-gutter-x-sm q-mb-md">
          <div class="text-subtitle1">
            {{ i18n('labels.displayMode') }}
          </div>
          <q-btn-toggle :options="displayOptions" no-caps v-model="displayOption" />
        </div>
        <q-scroll-area style="height: calc(100vh - 480px)">
          <scan-result-grid-view
            v-if="scanDetail"
            v-show="displayOption === 'grid'"
            :model-value="scanDetail.recognized"
          />
          <scan-result-list-view
            v-if="scanDetail"
            v-show="displayOption === 'list'"
            :model-value="scanDetail.recognized"
          />
        </q-scroll-area>
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
