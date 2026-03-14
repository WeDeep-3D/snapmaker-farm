<script setup lang="ts">
import { i18nSubPath } from 'src/utils/common';

const i18n = i18nSubPath('components.devices.ScanRegionPanel');

const getRegions = () => {}
</script>

<template>
  <q-card bordered flat>
    <q-card-section>
      {{ i18n('labels.description') }}
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
