import { useQuasar } from 'quasar';

import { app } from 'boot/eden';
import { i18nSubPath } from 'src/utils/common';

export interface Region {
  id: string;
  name: string;
  description: string | null;
  createdAt: string | null;
}

export const useRegionsApi = () => {
  const { notify } = useQuasar();
  const i18n = i18nSubPath('composables.devices.regionsApi');

  const createRegion = async (name: string, description?: string) => {
    try {
      const { data, error } = await app.api.v1.regions.post({
        name,
        ...(description !== undefined ? { description } : {}),
      });
      if (error) {
        notify({
          type: 'negative',
          message: i18n('notifications.createRegionFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      notify({
        type: 'positive',
        message: i18n('notifications.createRegionSuccess'),
      });
      return data.data as Region | undefined;
    } catch (error) {
      notify({
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
        notify({
          type: 'negative',
          message: i18n('notifications.getRegionsFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      return data.data as Region[] | undefined;
    } catch (error) {
      notify({
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
