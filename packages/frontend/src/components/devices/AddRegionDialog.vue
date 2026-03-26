<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';

import { i18nSubPath } from 'src/utils/common';
import { useRegionsApi } from 'src/composables/api/regionsApi';

defineEmits<{
  ok: [];
  hide: [];
}>();

const i18n = i18nSubPath('components.devices.AddRegionDialog');

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const regionName = ref<string>();
const regionDescription = ref<string>();
const isCreating = ref(false);

const confirm = async () => {
  if (!regionName.value) {
    return;
  }
  isCreating.value = true;
  const regionsApi = useRegionsApi();
  const created = await regionsApi.createRegion(regionName.value, regionDescription.value);
  if (created) {
    onDialogOK();
  }
  isCreating.value = false;
};

const cancel = () => {
  onDialogCancel();
};
</script>

<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card flat>
      <q-card-section class="text-h5">
        {{ i18n('labels.title') }}
      </q-card-section>
      <q-card-section>
        {{ i18n('labels.description') }}
      </q-card-section>
      <q-card-section class="column q-gutter-y-md" style="min-width: 24rem;">
        <q-input
          clearable
          :loading="isCreating"
          :label="i18n('labels.regionName')"
          outlined
          v-model="regionName"
        />
        <q-input
          clearable
          :loading="isCreating"
          :label="i18n('labels.regionDescription')"
          outlined
          v-model="regionDescription"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          :disable="!regionName?.length"
          icon="check"
          :loading="isCreating"
          :label="i18n('labels.confirm')"
          no-caps
          @click="confirm"
        />
        <q-btn
          :disable="isCreating"
          flat
          icon="close"
          :label="i18n('labels.cancel')"
          no-caps
          @click="cancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
