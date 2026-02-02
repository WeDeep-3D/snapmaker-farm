<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { ref } from 'vue';

import IpInput from 'components/devices/IpInput.vue';

import { i18nSubPath } from 'src/utils/common';

defineEmits<{
  ok: [payload?: unknown];
  hide: [];
}>();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const { notify } = useQuasar();

const i18n = i18nSubPath('components.devices.ScanDevicesDialog');

const ipRanges = ref([
  {
    begin: '',
    end: '',
  },
]);

const confirm = () => {
  notify({});
  onDialogOK();
};
</script>

<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card flat>
      <q-card-section class="text-h6">
        {{ i18n('labels.title') }}
      </q-card-section>
      <q-card-section class="q-gutter-y-md">
        <q-card bordered flat>
          <q-card-section class="row items-center justify-between">
            <div class="text-body1">
              {{ i18n('labels.ipRanges') }}
            </div>
            <q-btn
              color="primary"
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
          <q-card-actions class="q-gutter-x-md" align="right"> </q-card-actions>
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
