<script setup lang="ts">
import { ref } from 'vue';

import ScanResultGridView from 'components/devices/ScanResultGridView.vue';
import ScanResultListView from 'components/devices/ScanResultListView.vue';

import type { ScanDetail } from 'src/api/scans';
import { i18nSubPath } from 'src/utils/common';

const props = defineProps<{
  scanDetail: ScanDetail | undefined;
  scanProgress: number;
  scanBuffer: number;
  pollIntervalMs: number;
}>();

const i18n = i18nSubPath('components.devices.ScanResultPanel');

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
</script>

<template>
  <q-card v-if="props.scanDetail" class="q-mb-md column" bordered flat>
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
    <q-card-section>
      <div class="row items-center q-gutter-x-sm">
        <div class="text-subtitle1">
          {{ i18n('labels.displayMode') }}
        </div>
        <q-btn-toggle :options="displayOptions" no-caps v-model="displayOption" />
      </div>
    </q-card-section>
    <q-scroll-area class="col-grow" style="min-height: 0">
      <scan-result-grid-view
        v-if="props.scanDetail"
        v-show="displayOption === 'grid'"
        :model-value="props.scanDetail.recognized"
      />
      <scan-result-list-view
        v-if="props.scanDetail"
        v-show="displayOption === 'list'"
        :model-value="props.scanDetail.recognized"
      />
    </q-scroll-area>
  </q-card>
</template>

<style scoped></style>
