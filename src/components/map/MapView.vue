<template>
  <div class="map-container">
    <div id="map" ref="mapElement"></div>
    <MapMenu
      v-if="contextMenuCoords"
      :clickPosition="contextMenuCoords"
      @close="closeMenu"
      @set-origin="handleSetOrigin"
      @set-destination="handleSetDestination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet.fullscreen/Control.FullScreen.js'
import { useTransportStore } from '@/stores/transport'
import MapMenu from './MapMenu.vue'

const transportStore = useTransportStore()
const mapElement = ref(null)
const mapInstance = ref(null)
const contextMenuCoords = ref(null)
const isGPSActive = ref(false)
const watchId = ref(null)
const userMarker = ref(null)
const gpsButton = ref(null)
const originMarker = ref(null)
const destinationMarker = ref(null)

onMounted(() => {
  if (!mapElement.value) return

  // Initialize map with OpenStreetMap tiles
  mapInstance.value = L.map(mapElement.value).setView([-6.921469933354896, 107.60979493527732], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapInstance.value)

  // Fix marker icons
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'
  })

  // Add fullscreen control
  L.control.fullscreen({
    position: 'topleft',
    title: 'Toggle Fullscreen',
    forceSeparateButton: true
  }).addTo(mapInstance.value)

  // Add GPS control
  createGPSButton()

  // Right-click handler
  mapInstance.value.on('contextmenu', (e) => {
    e.originalEvent.preventDefault()
    contextMenuCoords.value = {
      latlng: e.latlng,
      containerPoint: mapInstance.value.latLngToContainerPoint(e.latlng)
    }
  })

  transportStore.map = mapInstance.value
})

onUnmounted(() => {
  stopGPSTracking()
})

// GPS Functions
const initGPSTracking = () => {
  if (isGPSActive.value) return

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.")
    return
  }

  const userIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  })

  userMarker.value = L.marker([0, 0], {
    icon: userIcon,
    title: "Your Location"
  }).addTo(mapInstance.value)

  let hasCentered = false

  watchId.value = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      userMarker.value.setLatLng([latitude, longitude])
      if (!hasCentered) {
        mapInstance.value.setView([latitude, longitude], 16)
        hasCentered = true
      }
    },
    (error) => {
      console.error("Error getting location:", error.message)
      stopGPSTracking()
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  )

  isGPSActive.value = true
  gpsButton.value.getContainer().classList.add('active')
  gpsButton.value.getContainer().title = 'Nonaktifkan Pelacakan GPS'
}

const stopGPSTracking = () => {
  if (watchId.value !== null) {
    navigator.geolocation.clearWatch(watchId.value)
    watchId.value = null
  }
  if (userMarker.value) {
    mapInstance.value.removeLayer(userMarker.value)
    userMarker.value = null
  }
  isGPSActive.value = false
  if (gpsButton.value) {
    gpsButton.value.getContainer().classList.remove('active')
    gpsButton.value.getContainer().title = 'Aktifkan Pelacakan GPS'
  }
}

const createGPSButton = () => {
  const GPSButton = L.Control.extend({
    onAdd: function() {
      const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-gps')
      button.innerHTML = '<i class="bi bi-geo-alt"></i>'
      button.title = 'Aktifkan Pelacakan GPS'
      button.style.cssText = `
        width: 34px;
        height: 34px;
        background-color: white;
        border: 2px solid rgba(0,0,0,0.2);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      `

      L.DomEvent.on(button, 'click', (e) => {
        L.DomEvent.stopPropagation(e)
        isGPSActive.value ? stopGPSTracking() : initGPSTracking()
      })

      return button
    }
  })

  gpsButton.value = new GPSButton({ position: 'topleft' }).addTo(mapInstance.value)
}

onMounted(() => {
  const params = new
  URLSearchParams(window.location.search)

  const r = params.get('r') // for origin
  const d = params.get('d') // for destination

  if (r) {
    const [lat, lng] = r.split(',').map(Number)
    handleSetOrigin({ lat, lng })
  }

  if (d) {
    const [lat, lng] = d.split(',').map(Number)
    handleSetDestination({ lat, lng })
  }
})

// Origin and Destination Markers
const originIcon = L.icon({
  iconUrl: '@/assets/origin-marker.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32], // adjust depending on the image
})

const destinationIcon = L.icon({
  iconUrl: '@/assets/destination-marker.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

// Existing menu handlers
const handleSetOrigin = (coords) => {
  transportStore.setOrigin([coords.lat, coords.lng], `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`)
  contextMenuCoords.value = null

  if (originMarker.value) {
    originMarker.value.setLatLng(coords)
  } else {
    originMarker.value = L.marker(coords, { icon: originIcon }).addTo(mapInstance.value)
  }
}

const handleSetDestination = (coords) => {
  transportStore.setDestination([coords.lat, coords.lng], `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`)
  contextMenuCoords.value = null

  if (destinationMarker.value) {
    destinationMarker.value.setLatLng(coords)
  } else {
    destinationMarker.value = L.marker(coords, { icon: destinationIcon }).addTo(mapInstance.value)
  }
}

const closeMenu = () => {
  contextMenuCoords.value = null
}

watch(() => transportStore.origin, (newOrigin) => {
  if (!newOrigin) return
  if (originMarker.value) {
    originMarker.value.setLatLng(newOrigin)
  } else {
    originMarker.value = L.marker(newOrigin, { icon: originIcon }).addTo(mapInstance.value)
  }
})

watch(() => transportStore.destination, (newDestination) => {
  if (!newDestination) return
  if (destinationMarker.value) {
    destinationMarker.value.setLatLng(newDestination)
  } else {
    destinationMarker.value = L.marker(newDestination, { icon: destinationIcon }).addTo(mapInstance.value)
  }
})
</script>

<style scoped>
.map-container {
  position: relative;
  flex: 1;
  height: 100%;
}

#map {
  height: 100%;
  width: 100%;
}
</style>

<style>
/* GPS Button Styles */
.leaflet-control-gps {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.4);
}

.leaflet-control-gps.active {
  background-color: #3b82f6;
  color: white;
}

/* Fullscreen Button Styles */
.leaflet-control-fullscreen {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.4);
}

.leaflet-control-fullscreen a {
  color: #333;
}

.leaflet-control-fullscreen a:hover {
  color: #3b82f6;
}
</style>
