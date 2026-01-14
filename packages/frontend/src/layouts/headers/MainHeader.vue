<script setup lang="ts">
import { MAIN_NAVIGATIONS } from 'components/navigations';
import ThemeButton from 'components/ThemeButton.vue';

import { bus } from 'boot/bus';
import { i18nSubPath } from 'src/utils/common';

const i18n = i18nSubPath('layouts.headers.MainHeader');
</script>

<template>
  <q-header bordered class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title shrink>
        <q-avatar>
          <q-img src="favicon.ico" />
          <!--          <q-img src="~assets/logos/light/simple.svg" />-->
        </q-avatar>
        {{ i18n('labels.title') }}
      </q-toolbar-title>
      <q-tabs active-bg-color="white" active-color="primary" indicator-color="transparent" no-caps>
        <q-route-tab
          v-for="navigation in MAIN_NAVIGATIONS"
          :key="navigation.route"
          :disable="!navigation.available"
          :icon="navigation.icon"
          :label="navigation.label"
          :to="navigation.route"
          exact
        />
      </q-tabs>
      <q-space />
      <theme-button />
      <q-btn dense flat icon="menu" round @click="bus.emit('drawer', 'switch', 'right')" />
    </q-toolbar>
  </q-header>
</template>

<style scoped></style>
