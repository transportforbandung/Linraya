<template>
  <div class="route-item">
    <button
      class="route-summary"
      :class="{ active: isActive }"
      @click="$emit('click')"
    >
      <div class="route-info">
        <div class="route-duration">{{ duration }}</div>
        <div class="route-stats">{{ transitLegsCount }} rute transportasi umum</div>
        <div class="route-stats">{{ walkLegsCount }} kali berjalan kaki</div>
      </div>
      <div class="route-toggle" :class="{ active: isActive }">
        {{ isActive ? '▲' : '▼' }}
      </div>
    </button>

    <div v-if="isActive" class="route-details">
      <div class="time-summary">
        <div class="time-row">
          <span class="time-label">Berangkat</span>
          <span class="time-label">Tiba</span>
        </div>
        <div class="time-row">
          <span class="time-value">{{ startTime }}</span>
          <span class="time-value">{{ endTime }}</span>
        </div>
      </div>

      <div class="legs-container">
        <LegItem
          v-for="(leg, index) in route.legs"
          :key="index"
          :leg="leg"
          :is-first="index === 0"
          :is-last="index === route.legs.length - 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LegItem from './LegItem.vue'

const props = defineProps({
  route: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const duration = computed(() => {
  const mins = Math.round(props.route.duration / 60)
  return `${mins} menit`
})

const transitLegsCount = computed(() =>
  props.route.legs.filter(leg => leg.mode !== "WALK").length
)

const walkLegsCount = computed(() =>
  props.route.legs.filter(leg => leg.mode === "WALK").length
)

const startTime = computed(() => formatTime(props.route.legs[0].startTime))
const endTime = computed(() => formatTime(props.route.legs[props.route.legs.length - 1].endTime))

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style scoped>
.route-item {
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.route-summary {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.route-summary.active {
  background-color: #dbeafe;
  border-left: 4px solid #3b82f6;
}

.route-summary:hover:not(.active) {
  background-color: #f9fafb;
}

.route-info {
  flex-grow: 1;
}

.route-duration {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.route-stats {
  font-size: 0.75rem;
  color: #6b7280;
}

.route-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #e5e7eb;
  color: #4b5563;
  font-size: 0.75rem;
}

.route-toggle.active {
  background-color: #3b82f6;
  color: white;
}

.route-details {
  padding: 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.time-summary {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.time-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.time-label {
  font-weight: 500;
  color: #4b5563;
}

.time-value {
  font-weight: 600;
  color: #1f2937;
}

.legs-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
