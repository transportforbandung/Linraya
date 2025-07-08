<template>
  <div class="search-form">
    <div class="form-group">
      <label for="origin">Asal</label>
      <SearchInput id="origin" v-model="originText" placeholder="Cari lokasi asal" :suggestions="originSuggestions"
        @select-suggestion="handleOriginSelect" @update:modelValue="fetchOriginSuggestions" />
    </div>

    <div class="form-group">
      <label for="destination">Tujuan</label>
      <SearchInput id="destination" v-model="destinationText" placeholder="Cari lokasi tujuan"
        :suggestions="destinationSuggestions" @select-suggestion="handleDestinationSelect"
        @update:modelValue="fetchDestinationSuggestions" />
    </div>

    <div class="form-group">
      <label for="departure-time">Waktu keberangkatan</label>
      <input type="time" id="departure-time" v-model="departureTime">
    </div>

    <button id="search-button" :disabled="isLoading" @click="handleSearch">
      {{ isLoading ? 'Mencari Rute...' : 'Cari Rute' }}
    </button>

    <ErrorMessage v-if="error" :message="error" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTransportStore } from '@/stores/transport'
import debounce from 'lodash/debounce'
import axios from 'axios'
import SearchInput from './SearchInput.vue'
import ErrorMessage from './ErrorMessage.vue'

const transportStore = useTransportStore()
const originText = ref('')
const destinationText = ref('')
const departureTime = ref('08:00')
const originSuggestions = ref([])
const destinationSuggestions = ref([])
const originLoading = ref(false)
const destinationLoading = ref(false)
const isLoading = computed(() => transportStore.isLoading)
const error = computed(() => transportStore.error)

// Fetch suggestions for origin
const fetchOriginSuggestions = debounce(
  async (query) => {
    if (!query.trim()) {
      originSuggestions.value = []
      originLoading.value = true
      return
    }
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&viewbox=107.213795,-6.519308,107.95582,-7.24864&bounded=1`
      )
      originSuggestions.value = response.data
    }
    catch (err) {
      console.error('Search error:', err)
      originSuggestions.value = []
    }
    finally {
      originLoading.value = false
    }
  }, 400
)

// Fetch suggestions for destination
const fetchDestinationSuggestions = debounce(
  async (query) => {
    if (!query.trim()) {
      destinationSuggestions.value = []
      destinationLoading.value = true
      return
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&viewbox=107.213795,-6.519308,107.95582,-7.24864&bounded=1`
      )
      destinationSuggestions.value = response.data
    } catch (err) {
      console.error('Search error:', err)
      destinationSuggestions.value = []
    }
    finally {
      destinationLoading.value = false
    }
  }, 400
)

// Handle origin selection from suggestions
const handleOriginSelect = (place) => {
  const coords = [parseFloat(place.lat), parseFloat(place.lon)]
  originText.value = place.display_name
  transportStore.setOrigin(coords, place.display_name)

  // Update map view
  if (transportStore.map) {
    transportStore.map.setView(coords, 15)
  }
}

// Handle destination selection from suggestions
const handleDestinationSelect = (place) => {
  const coords = [parseFloat(place.lat), parseFloat(place.lon)]
  destinationText.value = place.display_name
  transportStore.setDestination(coords, place.display_name)

  // Update map view
  if (transportStore.map) {
    transportStore.map.setView(coords, 15)
  }
}

// Handle search button click
const handleSearch = () => {
  transportStore.departureTime = departureTime.value
  transportStore.fetchRoutes()
}

// Sync with store values
watch(() => transportStore.originText, (newVal) => {
  if (newVal !== originText.value) {
    originText.value = newVal
  }
})

watch(() => transportStore.destinationText, (newVal) => {
  if (newVal !== destinationText.value) {
    destinationText.value = newVal
  }
})

watch(() => transportStore.departureTime, (newVal) => {
  if (newVal !== departureTime.value) {
    departureTime.value = newVal
  }
})
</script>

<style scoped>
.search-form {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #0985AB;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

button {
  background-color: #0985AB;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
}

button:hover {
  background-color: #0985AB;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
