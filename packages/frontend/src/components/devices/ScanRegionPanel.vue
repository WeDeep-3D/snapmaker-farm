<script setup lang="ts">
import { Dialog } from 'quasar';
import { onMounted, ref } from 'vue';

import AddRegionDialog from 'components/devices/AddRegionDialog.vue';

import { useRegionsApi } from 'src/composables/devices/regionsApi';
import type { Region } from 'src/composables/devices/regionsApi/types';

import { i18nSubPath } from 'src/utils/common';

const modelValue = defineModel<Region | undefined>({ required: true });

const i18n = i18nSubPath('components.devices.ScanRegionPanel');

const regionsApi = useRegionsApi();

const availableRegions = ref<Region[]>([]);
const isLoading = ref(false);

const showAddRegionDialog = () => {
  Dialog.create({
    component: AddRegionDialog,
  }).onOk(() => {
    retrieveRegions().catch((error) => console.log(error));
  });
};

const retrieveRegions = async () => {
  isLoading.value = true;
  availableRegions.value = (await regionsApi.getRegions()) ?? [];
  isLoading.value = false;
};

onMounted(async () => {
  await retrieveRegions();
});
</script>

<template>
  <q-card bordered flat>
    <q-card-section>
      {{ i18n('labels.description') }}
    </q-card-section>
    <q-card-section>
      <q-select
        :label="i18n('labels.region')"
        :loading="isLoading"
        :options="availableRegions"
        option-label="name"
        option-value="id"
        outlined
        v-model="modelValue"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.name }}</q-item-label>
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:after>
          <q-btn
            color="primary"
            :disable="isLoading"
            icon="add"
            :label="i18n('labels.newRegion')"
            no-caps
            @click.stop.prevent="showAddRegionDialog"
          />
        </template>
      </q-select>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
