import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IpRange } from 'stores/scans/types';

export const useScansStore = defineStore(
  'scans',
  () => {
    const ipRanges = ref<IpRange[]>([
      {
        begin: '',
        end: '',
      },
    ]);

    const removeIpRange = (index: number) => {
      ipRanges.value.splice(index, 1);
      if (ipRanges.value.length === 0) {
        ipRanges.value.push({ begin: '', end: '' });
      }
    };

    return {
      ipRanges,
      removeIpRange,
    };
  },
  {
    persist: true,
  },
);
