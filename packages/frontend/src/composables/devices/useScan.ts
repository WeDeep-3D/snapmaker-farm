import { IPv4 } from 'ip-num';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { computed, onBeforeUnmount, ref } from 'vue';

import type { ScanDetail } from 'src/api/scans';
import { createScan, getScan } from 'src/api/scans';
import { i18nSubPath } from 'src/utils/common';
import { useScansStore } from 'stores/scans';

export const MAX_IP_COUNT = 65536n;

const POLL_INTERVAL_MS = 500;

export const useScan = () => {
  const { notify } = useQuasar();
  const { ipRanges } = storeToRefs(useScansStore());
  const i18n = i18nSubPath('components.devices.ScanPanel');

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
