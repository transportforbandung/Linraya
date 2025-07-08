<template>
  <div class="error-message">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String
})
</script>

<style scoped>
.error-message {
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
  font-size: 0.875rem;
}
</style>
