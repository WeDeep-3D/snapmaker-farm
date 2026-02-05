<script setup lang="ts">
import { copyToClipboard, openURL, useQuasar } from 'quasar';
import { computed, ref } from 'vue';

import type { ScanDetail } from 'src/api/scans';
import { generateColorFromVersion } from 'src/utils/color';
import { i18nSubPath } from 'src/utils/common';

const props = defineProps<{
  modelValue: ScanDetail['recognized'];
}>();

const i18n = i18nSubPath('components.devices.ScanResultGridView');

const { notify } = useQuasar();

const isDownloading = ref(false);

const computedDeviceInfos = computed(() => {
  return props.modelValue.toSorted((a, b) => a.name.localeCompare(b.name));
});

const copySerialNumber = async (serialNumber: string) => {
  try {
    await copyToClipboard(serialNumber);
    notify({
      type: 'positive',
      message: i18n('notifications.copySerialNumberSuccess'),
    });
  } catch (error) {
    notify({
      type: 'negative',
      message: i18n('notifications.copySerialNumberFailed'),
      caption: (error as Error).message,
    });
  }
};

const downloadLog = (deviceInfo: ScanDetail['recognized'][0]) => {
  const ip = deviceInfo.network.toSorted((a, b) => a.type.localeCompare(b.type))[0]?.ip;
  if (!ip) {
    notify({
      type: 'negative',
      message: i18n('notifications.downloadLogNoIpAddress'),
    });
    return;
  }
  isDownloading.value = true;
  try {
    openURL(
      `${process.env.HTTP_BASE_URL ?? (process.env.DEV ? 'http://localhost:3000' : '')}/api/v1/devices/${ip}/logs`,
      undefined,
    );
  } catch (error) {
    notify({
      type: 'negative',
      message: i18n('notifications.downloadLogFailed'),
      caption: (error as Error).message,
    });
  } finally {
    isDownloading.value = false;
  }
};
</script>

<template>
  <div class="row q-col-gutter-sm">
    <div
      class="col-12 col-sm-6 col-md-4 col-xl-2"
      v-for="(deviceInfo, index) in computedDeviceInfos"
      :key="index"
    >
      <q-card>
        <q-card-section>
          <div class="row items-baseline">
            <div>
              {{ i18n('labels.deviceName') }}
            </div>
            <q-chip dense :label="deviceInfo.name" square />
          </div>
          <div class="row items-baseline">
            <div>
              {{ i18n('labels.serialNumber') }}
            </div>
            <q-chip
              clickable
              dense
              :label="deviceInfo.serialNumber"
              square
              @click="copySerialNumber(deviceInfo.serialNumber)"
            />
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="q-gutter-y-sm">
          <div
            v-for="networkInfo in deviceInfo.network.toSorted((a, b) =>
              a.type.localeCompare(b.type),
            )"
            :key="networkInfo.mac"
            class="row"
          >
            <q-card class="row items-center text-caption" bordered flat>
              <div
                class="text-white q-pa-xs"
                :class="{
                  'bg-primary': networkInfo.type === 'wired',
                  'bg-accent': networkInfo.type === 'wireless',
                }"
                style="border-radius: 4px 0 0 4px"
              >
                {{ i18n(`labels.networkType.${networkInfo.type}`) }}
              </div>
              <div class="q-pa-xs">
                {{ networkInfo.ip }}
              </div>
              <q-tooltip
                anchor="center end"
                self="center start"
                transition-show="jump-right"
                transition-hide="jump-left"
              >
                {{ i18n('labels.macAddress', { mac: networkInfo.mac }) }}
              </q-tooltip>
            </q-card>
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="row q-gutter-sm">
          <q-btn label="Download log" no-caps @click="downloadLog(deviceInfo)" />
        </q-card-section>
        <div class="absolute-top-right row text-white text-caption">
          <div class="bg-primary q-px-xs" style="border-radius: 0 0 0 4px">
            {{ deviceInfo.model }}
          </div>
          <div
            class="q-px-xs"
            :class="`bg-${generateColorFromVersion(deviceInfo.version).color} text-${generateColorFromVersion(deviceInfo.version).textColor}`"
            style="border-radius: 0 4px 0 0"
          >
            {{ deviceInfo.version }}
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<style scoped></style>
