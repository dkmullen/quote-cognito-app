<script setup>

const props = defineProps(
  { headers: { type: Array } },
  { items: { type: Array } },
  { sortBy: { type: Array } },
  { loading: { type: Boolean } },
  { totalItems: { type: Number } },
)

const emit = defineEmits(['edit', 'delete'])

</script>

<template>
  <v-data-table
    :headers="props.headers"
    fixed-header
    :items="props.items"
    item-key="source"
    items-per-page="100"
    height="84vh"
    :loading="props.loading"
    must-sort
    :sort-by="props.sortBy"
  >
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" class="me-2" @click="emit('edit', item)"> mdi-pencil </v-icon>
      <v-icon size="small" @click="emit('delete', item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>
