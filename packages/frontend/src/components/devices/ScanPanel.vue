<script setup lang="ts">
import { IPv4 } from 'ip-num';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { computed, onBeforeUnmount, ref } from 'vue';

import IpInput from 'components/devices/IpInput.vue';
import ScanResultGridView from 'components/devices/ScanResultGridView.vue';

import type { ScanDetail } from 'src/api/scans';
import { createScan, getScan } from 'src/api/scans';
import { i18nSubPath } from 'src/utils/common';
import { useScansStore } from 'stores/scans';
import ScanResultListView from 'components/devices/ScanResultListView.vue';

defineProps<{
  display: 'grid' | 'list';
}>();

const { notify } = useQuasar();
const { ipRanges } = storeToRefs(useScansStore());
const i18n = i18nSubPath('components.devices.ScanPanel');

const MAX_IP_COUNT = 65536n;
const POLL_INTERVAL_MS = 500;

const getScanInterval = ref<number>();
const isPolling = ref(false);
const scanId = ref<string>();
const scanDetail = ref<ScanDetail>();

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

const stopPolling = () => {
  if (getScanInterval.value !== undefined) {
    window.clearInterval(getScanInterval.value);
    getScanInterval.value = undefined;
  }
};

const pollScanDetail = async () => {
  if (isPolling.value) {
    return;
  }
  isPolling.value = true;
  try {
    await getScanDetail();
    if (
      scanDetail.value &&
      scanDetail.value.queuedCount === 0 &&
      scanDetail.value.processingCount === 0
    ) {
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

const getScanDetail = async () => {
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
    await getScanDetail();
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

onBeforeUnmount(() => {
  stopPolling();
});
</script>

<template>
  <div :class="{
    'row': $q.screen.gt.sm,
    'column': $q.screen.lt.md,
  }">
    <q-card class="column col-12 col-md-auto" bordered flat>
      <q-card-section class="row items-center justify-between">
        <div class="text-body1">
          {{ i18n('labels.ipRanges') }}
        </div>
        <q-btn
          color="primary"
          dense
          icon="add"
          :label="i18n('labels.addRange')"
          no-caps
          @click="ipRanges.push({ begin: '', end: '' })"
        />
      </q-card-section>
      <q-list
        :class="{
          'col-grow': $q.screen.gt.sm,
        }"
        bordered
        separator
      >
        <q-item v-for="(ipRange, index) in ipRanges" :key="index">
          <q-item-section>
            <div class="row justify-end items-baseline q-gutter-x-sm">
              <ip-input v-model="ipRange.begin" />
              <div class="text-body1">~</div>
              <ip-input v-model="ipRange.end" />
            </div>
          </q-item-section>
          <q-item-section side>
            <q-btn
              color="negative"
              dense
              icon="delete"
              @click="
                ipRanges.length > 1
                  ? ipRanges.splice(index, 1)
                  : (ipRanges = [{ begin: '', end: '' }])
              "
            />
          </q-item-section>
        </q-item>
      </q-list>
      <q-card-section>
        <q-btn
          class="full-width"
          color="primary"
          :disable="totalCount >= MAX_IP_COUNT"
          :label="i18n('labels.requestScan')"
          no-caps
          @click="requestScan"
        />
      </q-card-section>
    </q-card>
    <q-card
      v-if="scanDetail"
      class="col-grow column"
      :class="{
        'q-ml-md': $q.screen.gt.sm,
        'q-mt-md': $q.screen.lt.md,
      }"
      bordered
      flat
    >
      <q-card-section>
        <div class="row items-center q-gutter-x-sm">
          <div class="text-body1">
            {{ i18n('labels.scanProgress') }}
          </div>
          <q-linear-progress
            class="col-grow bg-grey-4"
            :animation-speed="POLL_INTERVAL_MS * 2"
            :buffer="1 - scanDetail.queuedCount / scanDetail.totalCount"
            color="primary"
            rounded
            size="2rem"
            track-color="secondary"
            :value="
              1 - (scanDetail.queuedCount + scanDetail.processingCount) / scanDetail.totalCount
            "
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="white"
                text-color="accent"
                :label="`${((1 - (scanDetail.queuedCount + scanDetail.processingCount) / scanDetail.totalCount) * 100).toFixed(2)}%`"
              />
            </div>
          </q-linear-progress>
        </div>
      </q-card-section>
      <q-separator />
      <q-scroll-area class="col-grow" style="height: 10vh">
        <scan-result-grid-view
          v-show="display === 'grid'"
          class="q-pa-md"
          :model-value="scanDetail.recognized"
        />
        <scan-result-list-view
          v-show="display === 'list'"
          class="q-pa-md"
          :model-value="scanDetail.recognized"
        />
      </q-scroll-area>
    </q-card>
  </div>
</template>

<style scoped></style>
