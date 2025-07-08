<template>
  <div
    v-if="clickPosition"
    ref="menuElement"
    class="map-menu leaflet-popup"
  >
    <div class="close-button" @click="$emit('close')" aria-label="Close popup">×</div>
    <div class="leaflet-popup-content-wrapper">
      <div class="leaflet-popup-content">
        <button @click="$emit('set-origin', clickPosition.latlng)" style="background-color:#3b82f6">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="10" r="3"/>
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
            </svg>
          </span> Pilih sebagai asal
        </button>
        <button @click="$emit('set-destination', clickPosition.latlng)" style="background-color:#10b981">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="10" r="3"/>
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
            </svg>
          </span> Pilih sebagai tujuan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useTransportStore } from '@/stores/transport'

const props = defineProps({
  clickPosition: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'set-origin', 'set-destination'])

const transportStore = useTransportStore()
const menuElement = ref(null)

// Update position when map moves
const updatePosition = () => {
  if (!menuElement.value || !props.clickPosition || !transportStore.map) return

  const point = transportStore.map.latLngToContainerPoint(props.clickPosition.latlng)
  menuElement.value.style.transform = `translate(${point.x}px, ${point.y}px)`
}

// Set up map movement listeners
onMounted(() => {
  if (transportStore.map) {
    transportStore.map.on('move', updatePosition)
    transportStore.map.on('moveend', updatePosition)
    updatePosition()
  }
})

onUnmounted(() => {
  if (transportStore.map) {
    transportStore.map.off('move', updatePosition)
    transportStore.map.off('moveend', updatePosition)
  }
})

// Update position when click position changes
watch(() => props.clickPosition, updatePosition)
</script>

<style scoped>
.map-menu {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  transform-origin: top left;
  pointer-events: auto;
}

.leaflet-popup-content-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px 18px 8px 9px;
  min-width: 180px;
}

.leaflet-popup-content {
  margin: 0;
}

.close-button {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  z-index: 1001;
}

.close-button:hover {
  color: #ef4444;
}

.map-menu button {
  padding: 6px 12px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 4px;
  width: 100%;
}

.map-menu button:hover {
  filter: brightness(1.1);
}

.icon {
  margin-right: 8px;
  font-size: 16px;
}
</style>
