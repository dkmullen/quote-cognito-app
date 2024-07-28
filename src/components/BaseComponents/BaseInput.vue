<script setup>
const props = defineProps({
  label: { type: String, default: 'Label' },
  type: { type: String, default: 'text' },
  id: { type: String },
  items: { type: Array },
  inputType: { type: String, default: 'text' },
  rows: { type: Number, default: 4 }
})
</script>
<template>
  <div v-if="props.inputType === 'text'">
    <v-text-field :label="props.label" :type="props.type" :id="props.id"> </v-text-field>
  </div>
  <div v-if="props.inputType === 'select'">
    <v-select :label="props.label" :items="props.items" :id="props.id"></v-select>
  </div>
  <div v-if="props.inputType === 'textarea'">
    <v-textarea :label="props.label" :id="props.id" :rows="props.rows"></v-textarea>
  </div>
</template>
