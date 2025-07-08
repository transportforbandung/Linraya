<template>
  <div class="search-container">
    <input
      :id="id"
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      :placeholder="placeholder"
      class="search-input"
    >
    <div
      class="suggestions-list"
      :class="{ visible: showSuggestions && suggestions.length > 0 }"
    >
      <div
        v-for="(place, index) in suggestions"
        :key="index"
        class="suggestion-item"
        @mousedown.prevent="handleSelect(place)"
      >
        <p>{{ place.display_name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  suggestions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'select-suggestion'])

const showSuggestions = ref(false)

const handleSelect = (place) => {
  emit('update:modelValue', place.display_name)
  emit('select-suggestion', place)
  showSuggestions.value = false
}

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  max-height: 15rem;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: none;
}

.suggestions-list.visible {
  display: block;
}

.suggestion-item {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
}

.suggestion-item:hover {
  background-color: #f9fafb;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item p {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  word-break: break-word;
}
</style>
