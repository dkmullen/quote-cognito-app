<script setup>
defineOptions({
  inheritAttrs: false
})
const props = defineProps({
  items: { type: Array },
  inputType: { type: String, default: 'text' },
  rows: { type: Number, default: 4 }
})
</script>
<template>
  <div v-if="props.inputType === 'text'">
    <v-text-field v-bind="$attrs"></v-text-field>
  </div>
  <div v-if="props.inputType === 'select'">
    <v-select v-bind="$attrs" :items="props.items"></v-select>
  </div>
  <div v-if="props.inputType === 'textarea'">
    <v-textarea v-bind="$attrs" :rows="props.rows"></v-textarea>
  </div>
</template>
