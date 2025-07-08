<template>
  <div class="app-container">
    <NavBar />
    <div class="main-content">
      <Sidebar />
      <MapView />
    </div>
  </div>
</template>

<script setup>
import NavBar from '@/components/header-footer/SiteHeader.vue'
import MapView from '@/components/map/MapView.vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

.app-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex: 1;
  height: calc(100vh - 100px); /* Adjust for header/footer */
  width: 100%;
  overflow: hidden;
}

.map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
}
</style>
