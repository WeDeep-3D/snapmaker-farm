<script setup lang="ts">
import { storeToRefs } from 'pinia';

import IpInput from 'components/devices/IpInput.vue';

import { i18nSubPath } from 'src/utils/common';
import { useScansStore } from 'stores/scans';

const { ipRanges } = storeToRefs(useScansStore());
const i18n = i18nSubPath('components.devices.ScanPanel');
</script>

<template>
  <q-card class="column" bordered flat>
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
    <q-list bordered separator>
      <q-item v-for="(ipRange, index) in ipRanges" :key="index">
        <q-item-section>
          <div class="row justify-end items-baseline q-gutter-x-sm">
            <ip-input v-model="ipRange.begin" />
            <div class="text-body1">~</div>
            <ip-input v-model="ipRange.end" />
          </div>
        </q-item-section>
        <q-item-section side>
          <q-btn
            color="negative"
            dense
            icon="delete"
            @click="
              ipRanges.length > 1
                ? ipRanges.splice(index, 1)
                : (ipRanges = [{ begin: '', end: '' }])
            "
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<style scoped></style>
