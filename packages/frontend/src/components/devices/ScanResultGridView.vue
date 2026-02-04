<script setup lang="ts">
import { copyToClipboard, useQuasar } from 'quasar';
import type { ScanDetail } from 'src/api/scans';
import { i18nSubPath } from 'src/utils/common';

defineProps<{
  modelValue: ScanDetail['recognized'];
}>();

const i18n = i18nSubPath('components.devices.ScanResultGridView');

const { notify } = useQuasar();

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
</script>

<template>
  <div class="row q-col-gutter-md">
    <div
      class="col-12 col-sm-6 col-md-4 col-xl-2"
      v-for="(deviceInfo, index) in modelValue"
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
        <q-card-section class="row q-gutter-sm">
          <q-chip class="text-caption" dense icon="mdi-ip" :label="deviceInfo.ip" />
          <q-chip
            class="text-caption"
            dense
            icon="mdi-expansion-card-variant"
            :label="deviceInfo.network?.macAddress"
          />
          <q-chip
            class="text-caption"
            dense
            icon="mdi-alpha-v-circle"
            :label="deviceInfo.version"
          />
        </q-card-section>
        <div class="absolute-top-right row text-white text-caption">
          <div class="bg-primary q-px-xs" style="border-radius: 0 0 0 4px">
            {{ deviceInfo.model }}
          </div>
          <div
            class="q-px-xs"
            :class="{
              'bg-positive': deviceInfo.network?.type === 'wired',
              'bg-warning': deviceInfo.network?.type == 'wireless',
              'bg-grey': !deviceInfo.network?.type || deviceInfo.network.type === 'unknown',
            }"
            style="border-radius: 0 4px 0 0"
          >
            {{ deviceInfo.network?.type ?? 'N/A' }}
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<style scoped></style>
