<script setup lang="ts">
const demoProjects: {
  id: number;
  name: string;
  description: string;
  deviceIdList: string[];
  plates: {
    id: string;
    count: {
      total: number;
      completed: number;
      failed: number;
      printing: number;
    };
    deviceModel: string;
    fileId: string;
    weight: number;
    time: {
      file: number;
      actual: number;
    };
    filamentIdList: string[];
  }[];
  status: 'pending' | 'printing' | 'completed' | 'failed';
  time: {
    begin: string;
    deadline: string;
    end: string;
  };
}[] = [];
</script>

<template>
  <q-page class="column q-gutter-lg q-pa-md">
    <div class="row q-gutter-md">
      <q-card
        v-for="project in demoProjects"
        :key="project.id"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card-section>
          <div class="text-h6">{{ project.name }}</div>
          <div class="text-subtitle2">{{ project.description }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div><strong>Status:</strong> {{ project.status }}</div>
          <div><strong>Devices:</strong> {{ project.deviceIdList.join(', ') }}</div>
          <div>
            <strong>Timeframe:</strong> {{ project.time.begin }} - {{ project.time.deadline }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-subtitle1">Plates:</div>
          <div v-for="(plate, index) in project.plates" :key="index" class="q-mt-sm">
            <div><strong>Model:</strong> {{ plate.deviceModel }}</div>
            <div><strong>Weight:</strong> {{ plate.weight }}g</div>
            <div>
              <strong>Time (File/Actual):</strong> {{ plate.time.file }}s / {{ plate.time.actual }}s
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped></style>
