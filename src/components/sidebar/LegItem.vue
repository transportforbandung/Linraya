<template>
  <div class="leg-item">
    <div class="leg-icon" :class="{ walk: leg.mode === 'WALK' }">
      {{ leg.mode === "WALK" ? '🚶' : '🚌' }}
    </div>
    <div class="leg-content">
      <div class="leg-badge" :style="badgeStyle">
        {{ badgeText }}
      </div>
      <div class="leg-route">
        {{ isFirst ? "Asal" : leg.from.name }} → {{ isLast ? "Tujuan" : leg.to.name }}
      </div>
      <div class="leg-time">
        {{ startTime }} - {{ endTime }} ({{ duration }} menit)
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  leg: {
    type: Object,
    required: true
  },
  isFirst: {
    type: Boolean,
    default: false
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

const badgeStyle = computed(() => {
  if (props.leg.mode === "WALK") {
    return `background-color: #888; color: ${getContrastYIQ('#888')};`
  } else if (props.leg.route) {
    const color = props.leg.route.color ? `#${props.leg.route.color}` : '#3b82f6'
    return `background-color: ${color}; color: ${getContrastYIQ(color)};`
  }
  return ''
})

const badgeText = computed(() => {
  if (props.leg.mode === "WALK") {
    return 'Berjalan kaki'
  } else if (props.leg.route) {
    return `${props.leg.agency?.name || ''} ${props.leg.route.shortName || ''}`.trim()
  }
  return ''
})

const startTime = computed(() => formatTime(props.leg.startTime))
const endTime = computed(() => formatTime(props.leg.endTime))
const duration = computed(() => Math.round(props.leg.duration / 60))

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function getContrastYIQ(hexcolor) {
  if (!hexcolor) return 'black'
  hexcolor = hexcolor.replace("#", "")
  const r = parseInt(hexcolor.substr(0, 2), 16)
  const g = parseInt(hexcolor.substr(2, 2), 16)
  const b = parseInt(hexcolor.substr(4, 2), 16)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return yiq >= 128 ? 'black' : 'white'
}
</script>

<style scoped>
.leg-item {
  display: flex;
  margin-bottom: 1.25rem;
}

.leg-icon {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
  font-size: 0.875rem;
}

.leg-icon.walk {
  background-color: #e5e7eb;
}

.leg-content {
  flex-grow: 1;
}

.leg-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  height: 1.75rem;
  line-height: 1.25rem;
}

.leg-route {
  font-weight: 600;
  margin-bottom: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.leg-time {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.25rem;
}
</style>
