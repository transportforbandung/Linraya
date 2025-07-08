<template>
  <div class="routes-container">
    <div v-if="isLoading && !hasRoutes" class="loading-message">
      <p>Mencari rute terbaik...</p>
      <p>Proses ini membutuhkan waktu 2-10 detik</p>
    </div>

    <div v-else-if="!hasRoutes" class="placeholder-message">
      Pilih lokasi asal dan tujuan. Cari tempat di baris pencarian atau klik kanan di peta,
      lalu klik "Cari Rute" untuk melihat opsi transportasi umum yang tersedia.
    </div>

    <div v-else class="routes-list">
      <RouteItem
        v-for="(route, index) in routes"
        :key="index"
        :route="route"
        :is-active="index === selectedRouteIndex"
        @click="selectRoute(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTransportStore } from '@/stores/transport'
import RouteItem from './RouteItem.vue'

const transportStore = useTransportStore()

const isLoading = computed(() => transportStore.isLoading)
const hasRoutes = computed(() => transportStore.routes.length > 0)
const routes = computed(() => transportStore.routes)
const selectedRouteIndex = computed(() => transportStore.selectedRouteIndex)

const selectRoute = (index) => {
  transportStore.selectedRouteIndex = index === transportStore.selectedRouteIndex ? -1 : index
  transportStore.drawRoute(index)
}
</script>

<style scoped>
.routes-container {
  margin-top: 1.5rem;
}

.loading-message {
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.placeholder-message {
  text-align: center;
  padding: 1.5rem 0;
  color: #6b7280;
  font-size: 0.75rem;
  max-width: 20rem;
  margin: 0 auto;
}

.routes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
