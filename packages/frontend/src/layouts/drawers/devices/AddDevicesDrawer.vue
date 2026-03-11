<script setup lang="ts">
import { ref } from 'vue';

import ScanPanel from 'components/devices/ScanPanel.vue';
import ScanResultGridView from 'components/devices/ScanResultGridView.vue';
import ScanResultListView from 'components/devices/ScanResultListView.vue';
import { bus } from 'boot/bus';

import type { ScanDetail } from 'src/api/scans';
import { i18nSubPath } from 'src/utils/common';

const i18n = i18nSubPath('layouts.drawers.devices.AddDevicesDrawer');

const displayOptions = [
  {
    label: i18n('labels.grid'),
    icon: 'grid_view',
    value: 'grid',
  },
  {
    label: i18n('labels.list'),
    icon: 'format_list_bulleted',
    value: 'list',
  },
];

const displayOption = ref<'grid' | 'list'>('list');
const scanDetail = ref<ScanDetail>();
const step = ref(1);

const closeDrawer = () => {
  bus.emit('drawer', 'close', 'right');
};
</script>

<template>
  <div class="column fit">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>{{ i18n('labels.title') }}</q-toolbar-title>
      <q-btn dense flat icon="close" @click="closeDrawer" />
    </q-toolbar>

    <q-stepper class="col-grow no-shadow" v-model="step" vertical color="primary" animated flat>
      <q-step :name="1" :title="i18n('labels.setRegionTitle')" icon="settings" :done="step > 1">
        {{ i18n('labels.setRegionDescription') }}
        <q-stepper-navigation>
          <q-btn color="primary" :label="i18n('labels.continue')" no-caps @click="step += 1" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="2" :title="i18n('labels.scanDevicesTitle')" icon="radar" :done="step > 2">
        <scan-panel v-model="scanDetail" />
        <q-stepper-navigation>
          <q-btn color="primary" :label="i18n('labels.continue')" no-caps @click="step += 1" />
          <q-btn
            flat
            color="primary"
            :label="i18n('labels.back')"
            class="q-ml-sm"
            @click="step -= 1"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" :title="i18n('labels.selectDevicesTitle')" icon="devices">
        <div class="row items-center q-gutter-x-sm q-mb-md">
          <div class="text-subtitle1">
            {{ i18n('labels.displayMode') }}
          </div>
          <q-btn-toggle :options="displayOptions" no-caps v-model="displayOption" />
        </div>
        <q-scroll-area style="height: calc(100vh - 400px)">
          <scan-result-grid-view
            v-if="scanDetail"
            v-show="displayOption === 'grid'"
            :model-value="scanDetail.recognized"
          />
          <scan-result-list-view
            v-if="scanDetail"
            v-show="displayOption === 'list'"
            :model-value="scanDetail.recognized"
          />
        </q-scroll-area>
        <q-stepper-navigation>
          <q-btn color="primary" :label="i18n('labels.bindDevices')" no-caps @click="closeDrawer" />
          <q-btn
            flat
            color="primary"
            :label="i18n('labels.back')"
            class="q-ml-sm"
            @click="step -= 1"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<style scoped></style>
