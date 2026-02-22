<script setup>
const props = defineProps({
  headers: { type: Array },
  items: { type: Array },
  sortBy: { type: Array },
  loading: { type: Boolean },
  totalItems: { type: Number },
  readOnly: { type: Boolean, default: false }
})

const emit = defineEmits(['edit', 'delete', 'view'])
</script>

<template>
  <v-data-table
    :headers="headers"
    fixed-header
    :items="items"
    item-key="source"
    items-per-page="100"
    height="80vh"
    :loading="loading"
    must-sort
    :sort-by="sortBy"
  >
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon v-if="!readOnly" class="me-2" @click="emit('edit', item)"> mdi-pencil </v-icon>
      <v-icon v-if="readOnly" @click="emit('view', item)"> mdi-eye </v-icon>
      <v-icon @click="emit('delete', item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>
