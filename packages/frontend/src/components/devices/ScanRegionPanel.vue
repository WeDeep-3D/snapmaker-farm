<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { type Region, useRegionsApi } from 'src/composables/devices/regionsApi';
import { i18nSubPath } from 'src/utils/common';

const modelValue = defineModel<Region | undefined>({ required: true });

const i18n = i18nSubPath('components.devices.ScanRegionPanel');

const regionsApi = useRegionsApi();

const availableRegions = ref<Region[]>([]);
const isAddingRegion = ref(false);
const isCreatingRegion = ref(false);
const newRegionName = ref<string>();

const createRegion = async () => {
  if (!newRegionName.value) {
    return;
  }
  isCreatingRegion.value = true;
  const created = await regionsApi.createRegion(newRegionName.value);
  if (created) {
    await retrieveRegions();
    modelValue.value = availableRegions.value.find((r) => r.id === created.id);
    newRegionName.value = '';
    isAddingRegion.value = false;
  }
  isCreatingRegion.value = false;
};

const retrieveRegions = async () => {
  availableRegions.value = (await regionsApi.getRegions()) ?? [];
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
        v-if="!isAddingRegion"
        :label="i18n('labels.region')"
        :options="availableRegions"
        option-label="name"
        option-value="id"
        outlined
        v-model="modelValue"
      >
        <template v-slot:after>
          <q-btn
            color="primary"
            icon="add"
            :label="i18n('labels.newRegion')"
            no-caps
            @click.stop.prevent="isAddingRegion = true"
          />
        </template>
      </q-select>
      <q-input
        v-else
        clearable
        :loading="isCreatingRegion"
        :label="i18n('labels.newRegion')"
        outlined
        v-model="newRegionName"
      >
        <template v-slot:after>
          <div class="row q-gutter-x-sm">
            <q-btn
              color="primary"
              dense
              :disable="!newRegionName?.length"
              icon="check"
              :loading="isCreatingRegion"
              :label="i18n('labels.confirm')"
              no-caps
              @click.stop.prevent="createRegion"
            />
            <q-btn
              color="negative"
              dense
              :disable="isCreatingRegion"
              icon="close"
              :label="i18n('labels.cancel')"
              no-caps
              @click.stop.prevent="isAddingRegion = false"
            />
          </div>
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
