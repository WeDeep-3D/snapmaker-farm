<script setup lang="ts">
import { computed, ref } from 'vue';

import type { ScanDetail } from 'src/api/scans';
import { i18nSubPath } from 'src/utils/common';

const props = defineProps<{
  scanDetail: ScanDetail | undefined;
  scanProgress: number;
  scanBuffer: number;
  pollIntervalMs: number;
}>();

const i18n = i18nSubPath('components.devices.ScanResultPanel');

const selectedDevices = ref(new Map<string, number>());

const computedDeviceInfos = computed(() => {
  return props.scanDetail?.recognized
    .map((deviceInfo) => ({
      ...deviceInfo,
      network: deviceInfo.network.toSorted((a, b) => a.type.localeCompare(b.type))[0]!,
    }))
    .toSorted((a, b) => a.name.localeCompare(b.name));
});

const selectAll = () => {
  if (selectedDevices.value.size === computedDeviceInfos.value?.length) {
    selectedDevices.value.clear();
  } else {
    computedDeviceInfos.value?.forEach((deviceInfo) => {
      const ip = deviceInfo.network.ip;
      if (ip) {
        selectedDevices.value.set(ip, 0);
      }
    });
  }
};

const selectWired = () => {
  computedDeviceInfos.value?.forEach((deviceInfo) => {
    const ip = deviceInfo.network.ip;
    if (ip && deviceInfo.network.type === 'wired') {
      selectedDevices.value.set(ip, 0);
    }
  });
};

const selectWireless = () => {
  computedDeviceInfos.value?.forEach((deviceInfo) => {
    const ip = deviceInfo.network.ip;
    if (ip && deviceInfo.network.type === 'wireless') {
      selectedDevices.value.set(ip, 0);
    }
  });
};
</script>

<template>
  <q-card v-if="props.scanDetail" class="q-mb-md" bordered flat>
    <q-card-section>
      <div class="row items-center q-gutter-x-sm">
        <div class="text-body1">
          {{ i18n('labels.scanProgress') }}
        </div>
        <q-linear-progress
          class="col-grow bg-grey-4"
          :animation-speed="props.pollIntervalMs * 2"
          :buffer="props.scanBuffer"
          color="primary"
          rounded
          size="2rem"
          track-color="secondary"
          :value="props.scanProgress"
        >
          <div class="absolute-full flex flex-center">
            <q-badge
              color="white"
              text-color="accent"
              :label="`${(props.scanProgress * 100).toFixed(2)}%`"
            />
          </div>
        </q-linear-progress>
      </div>
    </q-card-section>
    <q-separator />
    <q-scroll-area class="full-height" style="min-height: 0">
      <div class="col-12">
        <q-card class="row q-gutter-x-sm q-pa-sm" bordered flat>
          <q-btn
            color="primary"
            icon="select_all"
            :label="i18n('labels.selectUnselectAll')"
            no-caps
            outline
            @click="selectAll"
          />
          <q-space />
          <q-btn
            color="secondary"
            icon="cable"
            :label="i18n('labels.selectWired')"
            no-caps
            outline
            @click="selectWired"
          />
          <q-btn
            color="accent"
            icon="wifi"
            :label="i18n('labels.selectWireless')"
            no-caps
            outline
            @click="selectWireless"
          />
        </q-card>
      </div>
      <q-list separator>
        <q-item
          v-for="(deviceInfo, index) in computedDeviceInfos"
          :key="index"
          tag="label"
          v-ripple
        >
          <q-item-section side>
            <q-checkbox
              :model-value="selectedDevices.has(deviceInfo.network.ip)"
              @click="
                selectedDevices.has(deviceInfo.network.ip)
                  ? selectedDevices.delete(deviceInfo.network.ip)
                  : selectedDevices.set(deviceInfo.network.ip, 0)
              "
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="row items-center q-gutter-x-sm">
              <div>
                {{ deviceInfo.name }}
              </div>
              <q-chip class="text-caption" dense :label="deviceInfo.version" />
            </q-item-label>
            <q-item-label caption>
              {{ deviceInfo.network.ip }}
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-chip
              class="text-caption"
              :color="
                deviceInfo.network.type === 'wired'
                  ? 'primary'
                  : deviceInfo.network.type === 'wireless'
                    ? 'accent'
                    : 'grey'
              "
              dense
              :label="i18n(`labels.networkType.${deviceInfo.network.type ?? 'unknown'}`)"
              text-color="white"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-card>
</template>

<style scoped></style>
