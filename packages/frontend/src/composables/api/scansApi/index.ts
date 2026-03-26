import { IPv4 } from 'ip-num';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, ref } from 'vue';

import { app } from 'boot/eden';
import { useScansStore } from 'stores/scans';
import { i18nSubPath } from 'src/utils/common';

import { MAX_IP_COUNT, POLL_INTERVAL_MS } from './constants';
import type { ScanDetail } from './types';

export const useScansApi = () => {
  const { ipRanges } = storeToRefs(useScansStore());
  const i18n = i18nSubPath('composables.api.scansApi');

  const scanDetail = ref<ScanDetail>();
  const scanId = ref<string>();
  const getScanInterval = ref<number>();
  const isPolling = ref(false);

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
      (scanDetail.value.queuedCount + scanDetail.value.processingCount) /
        scanDetail.value.totalCount
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
      const { data, error } = await app.api.v1.scans({ scanId: scanId.value }).get();
      if (error) {
        Notify.create({
          type: 'negative',
          message: i18n('notifications.getScanDetailFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      scanDetail.value = data.data;
    } catch (error) {
      Notify.create({
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
        Notify.create({
          type: 'positive',
          message: i18n('notifications.getScanDetailSuccess'),
        });
      }
    } catch (e) {
      Notify.create({
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
      Notify.create({
        type: 'warning',
        message: i18n('notifications.requestScanInProgress'),
      });
      return;
    }
    try {
      const { data, error } = await app.api.v1.scans.post(ipRanges.value);
      if (error) {
        Notify.create({
          type: 'negative',
          message: i18n('notifications.requestScanFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      scanId.value = data.data;
      await fetchScanDetail();
      getScanInterval.value = window.setInterval(() => void pollScanDetail(), POLL_INTERVAL_MS);
      Notify.create({
        type: 'positive',
        message: i18n('notifications.requestScanSuccess'),
        caption: `id: ${data.data}`,
      });
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: i18n('notifications.requestScanError'),
        caption: (error as Error).message,
      });
    }
  };

  onBeforeUnmount(() => {
    stopPolling();
  });

  return {
    scanDetail,
    totalCount,
    scanProgress,
    scanBuffer,
    isScanning,
    requestScan,
    stopPolling,
    POLL_INTERVAL_MS,
  };
};
