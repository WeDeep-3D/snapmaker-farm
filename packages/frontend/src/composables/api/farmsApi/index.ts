import { Notify } from 'quasar';

import { app } from 'boot/eden';
import { i18nSubPath } from 'src/utils/common';

export const useFarmsApi = () => {
  const i18n = i18nSubPath('composables.api.farmsApi');

  const getFarm = async () => {
    try {
      const { data, error } = await app.api.v1.farms.get();
      if (error) {
        Notify.create({
          type: 'negative',
          message: i18n('notifications.getFarmFailed'),
          caption: error.value.message ?? i18n('notifications.unknownError'),
        });
        return;
      }
      return data.data;
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: i18n('notifications.getFarmError'),
        caption: (error as Error).message,
      });
    }
  };

  return {
    getFarm,
  };
};
