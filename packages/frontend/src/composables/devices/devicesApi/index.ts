import { Notify } from 'quasar';

import { app } from 'boot/eden';
import { i18nSubPath } from 'src/utils/common';

import type { CreateDeviceBody } from './types';

export const useDevicesApi = () => {
  const i18n = i18nSubPath('composables.devices.devicesApi');

  const getDevices = async (regionId?: string) => {
    try {
      const { data, error } = await app.api.v1.devices.get({ query: regionId ? { regionId } : {} });
      if (error) {
        Notify.create({
          type: 'negative',
          message: i18n('notifications.getDevicesFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      return data.data;
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: i18n('notifications.getDevicesError'),
        caption: (error as Error).message,
      });
    }
  };

  const createDevice = async (body: CreateDeviceBody, force = false) => {
    try {
      const { data, error } = await app.api.v1.devices.post(body, { query: { force } });
      if (error) {
        Notify.create({
          type: 'negative',
          message: i18n('notifications.createDeviceFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      Notify.create({
        type: 'positive',
        message: i18n('notifications.createDeviceSuccess'),
      });
      return data.data;
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: i18n('notifications.createDeviceError'),
        caption: (error as Error).message,
      });
    }
  };

  const removeDevice = async (id: string) => {
    try {
      const { data, error } = await app.api.v1.devices({ id }).delete();
      if (error) {
        Notify.create({
          type: 'negative',
          message: i18n('notifications.removeDeviceFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      Notify.create({
        type: 'positive',
        message: i18n('notifications.removeDeviceSuccess'),
      });
      return data.data;
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: i18n('notifications.removeDeviceError'),
        caption: (error as Error).message,
      });
    }
  };

  const downloadDeviceLogs = async (id: string) => {
    try {
      const { data, error } = await app.api.v1.devices({ id }).logs.get();
      if (error) {
        Notify.create({
          type: 'negative',
          message: i18n('notifications.downloadDeviceLogsFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      if (!data.data) {
        Notify.create({
          type: 'negative',
          message: i18n('notifications.downloadDeviceLogsFailed'),
          caption: i18n('notifications.unknownError'),
        });
        return;
      }
      const { filename, content } = data.data;
      const bytes = Uint8Array.from(atob(content), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      Notify.create({
        type: 'positive',
        message: i18n('notifications.downloadDeviceLogsSuccess'),
      });
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: i18n('notifications.downloadDeviceLogsError'),
        caption: (error as Error).message,
      });
    }
  };

  return {
    getDevices,
    createDevice,
    removeDevice,
    downloadDeviceLogs,
  };
};
