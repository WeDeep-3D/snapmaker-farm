<script setup lang="ts">
import axios from 'axios';
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';

import type { ScanDetail } from 'src/api/scans';
import { i18nSubPath } from 'src/utils/common';

const props = defineProps<{
  modelValue: ScanDetail['recognized'];
}>();

const i18n = i18nSubPath('components.devices.ScanResultListView');

const { notify } = useQuasar();

const selectedDevices = ref(new Map<string, number>());
const morphGroupModel = ref<'btn' | 'card'>('btn');
const selectedFile = ref<File>();
const isUploading = ref(false);

const computedDeviceInfos = computed(() => {
  return props.modelValue
    .map((deviceInfo) => ({
      ...deviceInfo,
      network: deviceInfo.network.toSorted((a, b) => a.type.localeCompare(b.type))[0]!,
    }))
    .toSorted((a, b) => a.name.localeCompare(b.name));
});

const selectAll = () => {
  if (selectedDevices.value.size === computedDeviceInfos.value.length) {
    selectedDevices.value.clear();
  } else {
    computedDeviceInfos.value.forEach((deviceInfo) => {
      const ip = deviceInfo.network.ip;
      if (ip) {
        selectedDevices.value.set(ip, 0);
      }
    });
  }
};

const selectWired = () => {
  computedDeviceInfos.value.forEach((deviceInfo) => {
    const ip = deviceInfo.network.ip;
    if (ip && deviceInfo.network.type === 'wired') {
      selectedDevices.value.set(ip, 0);
    }
  });
};

const selectWireless = () => {
  computedDeviceInfos.value.forEach((deviceInfo) => {
    const ip = deviceInfo.network.ip;
    if (ip && deviceInfo.network.type === 'wireless') {
      selectedDevices.value.set(ip, 0);
    }
  });
};

const startUpload = async () => {
  if (!selectedFile.value) {
    return;
  }
  const targetDevices = Array.from(selectedDevices.value.keys());
  if (!targetDevices.length) {
    notify({
      type: 'warning',
      message: i18n('notifications.uploadNoDeviceSelected'),
    });
    return;
  }
  isUploading.value = true;
  const fileSize = selectedFile.value.size;
  const formData = new FormData();
  formData.append('file', selectedFile.value, selectedFile.value.name);
  try {
    const results = await Promise.allSettled(
      targetDevices.map(async (ip) => {
        // noinspection HttpUrlsUsage
        await axios.post(`http://${ip}:7125/server/files/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            selectedDevices.value.set(ip, progressEvent.loaded / (progressEvent.total ?? fileSize));
          },
        });
      }),
    );
    const failed = results.filter((result) => result.status === 'rejected');
    const succeededCount = results.length - failed.length;
    if (!failed.length) {
      notify({
        type: 'positive',
        message: i18n('notifications.uploadSuccess', { count: succeededCount }),
      });
      morphGroupModel.value = 'btn';
      selectedFile.value = undefined;
      selectedDevices.value.clear();
    } else {
      notify({
        type: 'negative',
        message:
          failed.length === results.length
            ? i18n('notifications.uploadFailed')
            : i18n('notifications.uploadPartial', {
                success: succeededCount,
                failed: failed.length,
              }),
        caption: failed
          .map((result) => (result.reason as Error)?.message ?? String(result.reason))
          .join('; '),
      });
    }
  } finally {
    isUploading.value = false;
  }
};
</script>

<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12">
      <q-card class="row q-gutter-x-sm q-pa-sm" bordered flat>
        <q-btn color="primary" dense icon="select_all" no-caps outline @click="selectAll" />
        <q-space />
        <q-btn
          color="primary"
          :label="i18n('labels.selectWired')"
          no-caps
          outline
          @click="selectWired"
        />
        <q-btn
          color="accent"
          :label="i18n('labels.selectWireless')"
          no-caps
          outline
          @click="selectWireless"
        />
      </q-card>
    </div>
    <div
      class="col-12 col-sm-6 col-md-4 col-xl-2"
      v-for="(deviceInfo, index) in computedDeviceInfos"
      :key="index"
    >
      <q-item
        tag="label"
        v-ripple
        style="border-width: 1px; border-style: solid; border-color: #cdcdcd; border-radius: 4px"
      >
        <q-item-section side top>
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
          <q-item-label>
            {{ deviceInfo.name }}
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
        <q-linear-progress
          v-if="selectedDevices.has(deviceInfo.network.ip)"
          class="absolute-full"
          :buffer="selectedDevices.get(deviceInfo.network.ip)"
          color="green-3"
          rounded
          size="3.5rem"
          track-color="primary"
          :value="(selectedDevices.get(deviceInfo.network.ip) ?? 0) >= 1 ? 1 : 0"
          style="z-index: -1"
        />
      </q-item>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        v-morph:btn:mygroup:250.resize="morphGroupModel"
        class="absolute-bottom-right"
        color="primary"
        :disable="isUploading || !selectedDevices.size"
        fab
        icon="upload"
        size="2rem"
        @click="morphGroupModel = 'card'"
      />
      <q-card
        v-morph:card:mygroup:250.resize="morphGroupModel"
        class="absolute-bottom-right bg-primary text-white"
        style="min-width: 18rem; border-bottom-right-radius: 2rem"
      >
        <q-card-section class="column q-gutter-y-md">
          <div class="text-h6">
            {{ i18n('labels.uploadGCodeFile') }}
          </div>
          <q-file
            accept=".json,.gcode"
            clearable
            color="white"
            input-class="text-white"
            :label="i18n('labels.chooseFile')"
            label-color="white"
            outlined
            v-model="selectedFile"
          />
          <div class="row justify-end q-gutter-x-sm">
            <q-btn
              color="positive"
              :disable="!selectedFile || isUploading"
              :loading="isUploading"
              :label="i18n('labels.startUpload')"
              no-caps
              @click="startUpload"
            />
            <q-btn flat :label="i18n('labels.cancel')" no-caps @click="morphGroupModel = 'btn'" />
          </div>
        </q-card-section>
      </q-card>
    </q-page-sticky>
  </div>
</template>

<style scoped></style>
