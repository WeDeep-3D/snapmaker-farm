<script setup lang="ts">
import { Duration } from 'luxon';

import type { Device } from 'src/composables/api/devicesApi/types';

import { bus } from 'boot/bus';
import { i18nSubPath } from 'src/utils/common';

defineProps<{
  devices: Device[];
}>();

const modelValue = defineModel<Set<string>>({ required: true });

const i18n = i18nSubPath('components.devices.DevicesGridView');

const showDeviceDetailsDrawer = (deviceId: string): void => {
  bus.emit('devicesDrawer', 'deviceDetails', deviceId);
  bus.emit('drawer', 'open', 'right');
};

const toggleDevice = (id: string): void => {
  if (modelValue.value.has(id)) {
    modelValue.value.delete(id);
  } else {
    modelValue.value.add(id);
  }
};
</script>

<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12 col-sm-6 col-md-4 col-xl-2" v-for="(device, index) in devices" :key="index">
      <q-card>
        <div class="row q-gutter-x-sm items-center q-pa-xs">
          <div>
            <q-checkbox
              :model-value="modelValue.has(device.id)"
              @update:model-value="toggleDevice(device.id)"
            />
          </div>
          <q-space />
          <div>
            <q-btn flat icon="open_in_new" round @click="showDeviceDetailsDrawer(device.id)" />
          </div>
        </div>
        <q-separator />
        <q-card-section class="row items-center q-gutter-x-sm">
          <div>
            {{ device.deviceInfo?.name ?? device.serialNumber }}
          </div>
          <q-space />
          <div>
            {{ i18n(`printStates.${device.printInfo?.state ?? 'unknown'}`) }}
          </div>
          <q-btn v-if="device.printInfo?.message.length" dense icon="notifications">
            <q-badge floating color="red" rounded />
            <q-popup-proxy>
              <q-card flat>
                <q-card-section>
                  {{ device.printInfo.message }}
                </q-card-section>
              </q-card>
            </q-popup-proxy>
          </q-btn>
        </q-card-section>
        <q-separator />
        <q-card-section class="row items-center q-gutter-x-md">
          <div class="row col-grow">
            <q-card class="col-grow" bordered flat>
              <q-skeleton />
            </q-card>
          </div>
          <div v-if="device.printInfo" class="column">
            <div>
              {{ i18n('labels.cost', { cost: device.printInfo.filamentUsed.toFixed(2) }) }}
            </div>
            <div>
              {{
                i18n('labels.remaining', {
                  duration: Duration.fromMillis(
                    device.printInfo.duration.total - device.printInfo.duration.current,
                  ).toHuman({ listStyle: 'narrow' }),
                })
              }}
            </div>
          </div>
          <div v-else class="column">
            <q-skeleton type="text" />
            <q-skeleton type="text" />
          </div>
        </q-card-section>
        <q-card-section v-if="device.printInfo">
          <div class="text-caption">
            {{ i18n('labels.filename', { filename: device.printInfo.filename }) }}
          </div>
          <q-linear-progress
            color="primary"
            rounded
            size="1.5rem"
            :value="device.printInfo.progress"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="white"
                text-color="primary"
                :label="`${(device.printInfo.progress * 100).toFixed(2)}%`"
              />
            </div>
          </q-linear-progress>
          <div>
            {{
              i18n('labels.layers', {
                current: device.printInfo.layerCount.current,
                total: device.printInfo.layerCount.total,
              })
            }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<style scoped></style>
