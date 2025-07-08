import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import L from 'leaflet' // Import Leaflet for polyline operations

export const useTransportStore = defineStore('transport', () => {
  // State (reactive variables)
  const origin = ref(null)               // Set default null to origin coordinates
  const destination = ref(null)          // Set default null to destination coordinates
  const originText = ref('')
  const destinationText = ref('')
  const departureTime = ref('08:00')     // Default departure time set to 08:00
  const routes = ref([])                 // Replaces state.routes
  const selectedRouteIndex = ref(0)
  const isLoading = ref(false)
  const error = ref(null)
  const map = ref(null)                  // Leaflet map instance
  const markers = ref({                  // Replaces state.originMarker/destinationMarker
    origin: null,
    destination: null
  })
  const routePolylines = ref([])         // Replaces state.routePolylines

  // Helper Methods
  function showError(message) {
    error.value = message
  }

  function clearError() {
    error.value = null
  }

  function setLoading(loading) {
    isLoading.value = loading
  }

  function clearPolylines() {
    routePolylines.value.forEach(polyline => {
      if (map.value) map.value.removeLayer(polyline)
    })
    routePolylines.value = []
  }

  // Custom polyline decoder implementation
  function decodePolyline(encoded) {
    let index = 0
    let len = encoded.length
    let lat = 0, lng = 0
    let array = []

    while (index < len) {
      let b, shift = 0, result = 0

      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)

      let dlat = (result & 1) ? ~(result >> 1) : (result >> 1)
      lat += dlat
      shift = 0
      result = 0

      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)

      let dlng = (result & 1) ? ~(result >> 1) : (result >> 1)
      lng += dlng

      array.push([lat * 1e-5, lng * 1e-5])
    }

    return array
  }

  function drawRoute(index) {
    clearPolylines()
    const itinerary = routes.value[index]
    if (!itinerary) return

    itinerary.legs.forEach((leg) => {
      if (!leg.legGeometry?.points) return
      const latlngs = decodePolyline(leg.legGeometry.points)
      const color = leg.mode === "WALK"
        ? "#888"
        : leg.route?.color
          ? `#${leg.route.color}`
          : "#2563eb"

      if (map.value) {
        const pl = L.polyline(latlngs, { color, weight: 5, opacity: 0.7 }).addTo(map.value)
        routePolylines.value.push(pl)
      }
    })
  }

  // Actions (methods)
  function setOrigin(coords, text) {
    origin.value = coords
    originText.value = text
  }

  function setDestination(coords, text) {
    destination.value = coords
    destinationText.value = text
  }

  async function fetchRoutes() {
    if (!origin.value || !destination.value || !departureTime.value) {
      showError("Harap masukkan asal, tujuan, dan waktu keberangkatan.")
      return
    }

    clearError()
    setLoading(true)
    routes.value = []
    selectedRouteIndex.value = 0
    clearPolylines()

    const dateStr = new Date().toISOString().slice(0, 10)

    const query = `
      query Plan(
        $fromPlace: String!
        $toPlace: String!
        $date: String!
        $time: String!
        $arriveBy: Boolean!
        $transportModes: [TransportMode!]
      ) {
        plan(
          fromPlace: $fromPlace
          toPlace: $toPlace
          date: $date
          time: $time
          arriveBy: $arriveBy
          transportModes: $transportModes
        ) {
          itineraries {
            duration
            legs {
              mode
              startTime
              endTime
              duration
              from {
                name
              }
              to {
                name
              }
              route {
                shortName
                longName
                color
              }
              agency {
                name
              }
              legGeometry {
                length
                points
              }
            }
          }
        }
      }
    `

    const variables = {
      fromPlace: `${origin.value[0]},${origin.value[1]}`,
      toPlace: `${destination.value[0]},${destination.value[1]}`,
      date: dateStr,
      time: departureTime.value,
      arriveBy: false,
      transportModes: [
        { mode: "RAIL" },
        { mode: "BUS" },
        { mode: "WALK" },
      ]
    }

    try {
      const response = await axios.post(
        "https://api.transportforbandung.org/linraya",
        { query, variables },
        { headers: { "Content-Type": "application/json" } }
      )

      const result = response.data

      if (result.errors) {
        console.error("GraphQL errors:", result.errors)
        showError("Terjadi kesalahan. Silakan coba lokasi atau waktu yang berbeda.")
        return
      }

      routes.value = result.data?.plan?.itineraries || []

      if (routes.value.length === 0) {
        showError("Tidak ditemukan rute. Silakan coba lokasi atau waktu yang berbeda.")
      } else {
        drawRoute(0)
      }
    } catch (err) {
      console.error("Fetch error:", err)
      showError("Gagal mengambil data. Silakan periksa koneksi Anda dan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  // Getters (computed properties)
  const hasRoutes = computed(() => routes.value.length > 0)

  return {
    // State
    origin,
    destination,
    originText,
    destinationText,
    departureTime,
    routes,
    selectedRouteIndex,
    isLoading,
    error,
    map,
    markers,
    routePolylines,

    // Actions
    setOrigin,
    setDestination,
    fetchRoutes,
    drawRoute,
    clearPolylines,

    // Helper Methods
    showError,
    clearError,
    setLoading,

    // Getters
    hasRoutes
  }
})
