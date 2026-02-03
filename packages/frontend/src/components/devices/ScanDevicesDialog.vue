<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import type { SetIntervalAsyncTimer } from 'set-interval-async';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async';
import { onBeforeUnmount, ref } from 'vue';

import IpInput from 'components/devices/IpInput.vue';

import type { ScanDetail } from 'src/api/scans';
import { createScan, getScan } from 'src/api/scans';
import { i18nSubPath } from 'src/utils/common';
defineEmits<{
  ok: [payload?: unknown];
  hide: [];
}>();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const { notify } = useQuasar();

const i18n = i18nSubPath('components.devices.ScanDevicesDialog');

const getScanInterval = ref<SetIntervalAsyncTimer<[]>>();
const ipRanges = ref([
  {
    begin: '',
    end: '',
  },
]);
const scanId = ref<string>();
const scanDetail = ref<ScanDetail>();

const requestScan = async () => {
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
    getScanInterval.value = setIntervalAsync(async () => {
      await getScanDetail();
      if (scanDetail.value && scanDetail.value.processedCount >= scanDetail.value.totalCount) {
        if (getScanInterval.value) {
          (async () => {
            if (getScanInterval.value) {
              await clearIntervalAsync(getScanInterval.value);
            }
          })().catch((e) => console.log(e));
          notify({
            type: 'positive',
            message: i18n('notifications.getScanDetailSuccess'),
          });
        }
      }
    }, 1000);
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

const getScanDetail = async () => {
  if (!scanId.value) {
    return;
  }
  try {
    const { data } = await getScan(scanId.value);
    if (!data.success) {
      notify({
        type: 'negative',
        message: i18n('messages.getScanDetailFailed'),
        caption: data.message,
      });
      return;
    }
    scanDetail.value = data.data;
  } catch (error) {
    notify({
      type: 'negative',
      message: i18n('messages.getScanDetailError'),
      caption: (error as Error).message,
    });
    return;
  }
};

const confirm = () => {
  notify({});
  onDialogOK();
};

onBeforeUnmount(async () => {
  if (getScanInterval.value) {
    await clearIntervalAsync(getScanInterval.value);
  }
});
</script>

<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card flat>
      <q-card-section class="text-h6">
        {{ i18n('labels.title') }}
      </q-card-section>
      <q-card-section>
        <q-card bordered flat>
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
          <q-list separator>
            <q-item v-for="(ipRange, index) in ipRanges" :key="index">
              <q-item-section>
                <div class="row items-baseline q-gutter-x-sm">
                  <ip-input v-model="ipRange.begin" />
                  <div class="text-body1">~</div>
                  <ip-input v-model="ipRange.end" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-actions class="q-gutter-x-md" align="right">
            <q-btn
              color="primary"
              :label="i18n('labels.requestScan')"
              no-caps
              @click="requestScan"
            />
          </q-card-actions>
        </q-card>
      </q-card-section>
      <q-card-section v-if="scanDetail">
        <q-card bordered flat>
          <q-card-section>
            <q-linear-progress
              size="25px"
              :value="scanDetail.processedCount / scanDetail.totalCount"
              color="accent"
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  color="white"
                  text-color="accent"
                  :label="`${((scanDetail.processedCount / scanDetail.totalCount) * 100).toFixed(2)}%`"
                />
              </div>
            </q-linear-progress>
          </q-card-section>
          <q-list>
            <q-item v-for="(ip, index) in scanDetail.recognized" :key="index">
              <q-item-section>
                {{ ip }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat :label="i18n('labels.confirm')" color="negative" no-caps @click="confirm" />
        <q-btn color="primary" :label="i18n('labels.cancel')" no-caps @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
