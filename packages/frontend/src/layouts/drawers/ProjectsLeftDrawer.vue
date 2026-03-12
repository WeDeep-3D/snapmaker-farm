<script setup lang="ts">
import { bus } from 'boot/bus';
import { i18nSubPath } from 'src/utils/common';

const i18n = i18nSubPath('layouts.drawers.ProjectsLeftDrawer');
</script>

<template>
  <q-drawer
    class="q-pa-md"
    behavior="desktop"
    bordered
    no-swipe-backdrop
    no-swipe-close
    no-swipe-open
    side="left"
    :width="400"
    @mini-state="bus.emit('drawer', $event ? 'minimize' : 'maximize', 'left')"
    @show="bus.emit('drawer', 'open', 'left')"
    @hide="bus.emit('drawer', 'close', 'left')"
  >
    <div class="text-h6">
      {{ i18n('labels.title') }}
    </div>
  </q-drawer>
</template>

<style scoped></style>
