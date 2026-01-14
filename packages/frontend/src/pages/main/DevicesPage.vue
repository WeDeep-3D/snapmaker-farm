<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/device/scan', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        begin: '10.100.252.0',
        end: '10.100.253.255',
      }),
      redirect: 'follow',
    });
    const reader = response.body?.getReader();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('Stream finished.');
        break;
      }
      console.log('Received chunk:', new TextDecoder().decode(value));
    }
  } catch (error) {
    console.error('Fetch request failed:', error);
  }
});
</script>

<template>
  <q-page></q-page>
</template>

<style scoped></style>
