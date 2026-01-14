import { defineStore, acceptHMRUpdate } from 'pinia';
import { Dark } from 'quasar';
import { computed, ref } from 'vue';

import { i18nGlobal } from 'boot/i18n';
import { DARK_MODES } from 'stores/settings/constants';
import type { Locales } from 'stores/settings/types';

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const darkMode = ref<Dark['mode']>(Dark.mode);
    const locale = computed({
      get: () => i18nGlobal.locale,
      set: (value: Locales) => {
        i18nGlobal.locale = value;
      },
    });

    const applyTheme = () => {
      Dark.set(darkMode.value);
    };

    const toggleTheme = () => {
      const index = DARK_MODES.indexOf(darkMode.value);
      darkMode.value = DARK_MODES[(index + 1) % DARK_MODES.length] ?? 'auto';
      applyTheme();
    };

    return {
      darkMode,
      locale,
      applyTheme,
      toggleTheme,
    };
  },
  {
    persist: true,
  },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
