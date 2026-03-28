<script setup lang="ts">
import { LocalScope } from '@all1ndev/vue-local-scope';
import { computed } from 'vue';

import { POLL_INTERVAL_MS } from 'src/composables/api/scansApi/constants';
import type { DeviceInfo, ScanDetail } from 'src/composables/api/scansApi/types';

import { i18nSubPath } from 'src/utils/common';

const props = defineProps<{
  scanDetail: ScanDetail;
  scanProgress: number;
  scanBuffer: number;
  bindResults: {
    serialNumber: string;
    success: boolean;
  }[];
}>();

const modelValue = defineModel<Map<string, DeviceInfo>>({
  required: true,
});

const i18n = i18nSubPath('components.devices.ScanResultPanel');

const networkTypeColor = {
  wired: 'primary',
  wireless: 'accent',
  unknown: 'grey',
};

const bindingStatusColor: Record<string, string> = {
  unbound: 'grey',
  bound_self: 'positive',
  bound_other: 'warning',
};

const computedDeviceInfos = computed(() => {
  return props.scanDetail?.recognized.toSorted((a, b) => a.name.localeCompare(b.name));
});

const selectAll = () => {
  if (modelValue.value.size === computedDeviceInfos.value?.length) {
    modelValue.value.clear();
  } else {
    modelValue.value = new Map(
      computedDeviceInfos.value?.map((deviceInfo) => [deviceInfo.serialNumber, deviceInfo]),
    );
  }
};

const selectWired = () => {
  computedDeviceInfos.value?.forEach((deviceInfo) => {
    if (deviceInfo.network.find((item) => item.type === 'wired' && item.ip)) {
      modelValue.value.set(deviceInfo.serialNumber, deviceInfo);
    }
  });
};

const selectWireless = () => {
  computedDeviceInfos.value?.forEach((deviceInfo) => {
    if (deviceInfo.network.find((item) => item.type === 'wireless' && item.ip)) {
      modelValue.value.set(deviceInfo.serialNumber, deviceInfo);
      console.log(deviceInfo);
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
          :animation-speed="POLL_INTERVAL_MS * 2"
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
          v-for="deviceInfo in computedDeviceInfos"
          :key="deviceInfo.serialNumber"
          tag="label"
          v-ripple
        >
          <LocalScope
            :bindResult="
              props.bindResults.find(({ serialNumber }) => serialNumber === deviceInfo.serialNumber)
                ?.success
            "
            :preferredNetwork="
              deviceInfo.network.toSorted((a, b) => a.type.localeCompare(b.type))[0]
            "
            #default="{ bindResult, preferredNetwork }"
          >
            <q-item-section v-if="preferredNetwork" side>
              <q-checkbox
                :model-value="modelValue.has(deviceInfo.serialNumber)"
                @click="
                  modelValue.has(deviceInfo.serialNumber)
                    ? modelValue.delete(deviceInfo.serialNumber)
                    : modelValue.set(deviceInfo.serialNumber, deviceInfo)
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
              <q-item-label v-if="preferredNetwork" class="row items-center q-gutter-x-sm" caption>
                <div>
                  {{ preferredNetwork.ip }}
                </div>
                <q-chip
                  class="text-caption"
                  :color="networkTypeColor[preferredNetwork.type]"
                  dense
                  :label="i18n(`labels.networkType.${preferredNetwork.type ?? 'unknown'}`)"
                  text-color="white"
                />
              </q-item-label>
            </q-item-section>
            <q-item-section class="q-gutter-y-sm" side>
              <q-badge
                :color="bindingStatusColor[deviceInfo.bindingStatus]"
                :label="i18n(`labels.bindingStatus.${deviceInfo.bindingStatus}`)"
                text-color="white"
              />
              <q-badge
                v-if="deviceInfo.region"
                color="primary"
                :label="deviceInfo.region"
                text-color="white"
              />
            </q-item-section>
            <div
              class="absolute-full"
              :class="{
                'bg-red': bindResult === false,
                'bg-green': bindResult === true,
              }"
              style="z-index: -100; opacity: 0.75"
            />
          </LocalScope>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-card>
</template>

<style scoped></style>
