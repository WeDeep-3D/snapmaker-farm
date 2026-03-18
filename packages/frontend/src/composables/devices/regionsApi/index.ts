import { Notify } from 'quasar';

import { app } from 'boot/eden';
import { i18nSubPath } from 'src/utils/common';

export const useRegionsApi = () => {
  const i18n = i18nSubPath('composables.devices.regionsApi');

  const createRegion = async (name: string, description: string | null = null) => {
    try {
      const { data, error } = await app.api.v1.regions.post({
        name,
        description: description,
      });
      if (error) {
        Notify.create({
          type: 'negative',
          message: i18n('notifications.createRegionFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      Notify.create({
        type: 'positive',
        message: i18n('notifications.createRegionSuccess'),
      });
      return data.data;
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: i18n('notifications.createRegionError'),
        caption: (error as Error).message,
      });
    }
  };

  const getRegions = async () => {
    try {
      const { data, error } = await app.api.v1.regions.get();
      if (error) {
        Notify.create({
          type: 'negative',
          message: i18n('notifications.getRegionsFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      return data.data;
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: i18n('notifications.getRegionsError'),
        caption: (error as Error).message,
      });
    }
  };

  return {
    createRegion,
    getRegions,
  };
};
