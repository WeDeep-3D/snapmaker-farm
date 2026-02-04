<script setup lang="ts">
import { IPv4, isIPv4 } from 'ip-num';

import { i18nSubPath } from 'src/utils/common';

const modelValue = defineModel<string>({ required: true });

const i18n = i18nSubPath('components.devices.IpInput');
</script>

<template>
  <q-input
    dense
    hide-bottom-space
    maxlength="15"
    no-error-icon
    outlined
    :rules="[
      (value?: string) => {
        if (!value?.length) {
          return true;
        }
        try {
          return isIPv4(IPv4.fromString(value || ''));
        } catch {
          return i18n('labels.invalidIp');
        }
      },
    ]"
    v-model="modelValue"
    style="width: 15rch"
  />
</template>

<style scoped></style>
