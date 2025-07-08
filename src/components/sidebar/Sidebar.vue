<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="sidebar">
    <SearchForm />
    <h2>Pilihan Rute</h2>
    <div class="routes-list">
      <RouteList />
    </div>
  </div>
</template>

<script setup>
import SearchForm from './SearchForm.vue'
import RouteList from './RouteList.vue'
</script>

<style scoped>
.sidebar {
  width: 30rem;
  min-width: 30rem;
  background-color: white;
  padding: 1.5rem;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

.main-logo {
  padding: 2rem 0;
  width: 12rem;
}

sidebar h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 100%;
    max-width: 100%;
    height: 40vh;
  }
}
</style>
