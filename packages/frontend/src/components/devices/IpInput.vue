<script setup lang="ts">
import { IPv4, isIPv4 } from 'ip-num';

import { i18nSubPath } from 'src/utils/common';

const modelValue = defineModel<string>({ required: true });

const i18n = i18nSubPath('components.devices.IpInput');
</script>

<template>
  <q-input
    dense
    outlined
    :rules="[
      (value?: string) => !(value?.length && !isIPv4(new IPv4(value))) || i18n('labels.invalidIp'),
    ]"
    v-model="modelValue"
  />
</template>

<style scoped></style>
