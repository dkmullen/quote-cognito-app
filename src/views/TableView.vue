<script>
import { retrieve } from '@/services/apiService'

export default {
  data: () => ({
    tableItems: {
      headers: [
        { title: 'Source', value: 'source' },
        { title: 'Timestamp', value: 'timestamp' },
        { title: 'Quote', value: 'quote' },
        { title: 'Actions', key: 'actions', sortable: false }
      ],
      search: '',
      items: [],
      loading: true,
      totalItems: 0,
      itemsPerPage: 10
    }
  }),

  mounted() {
    this.getAllQuotes()
  },
  methods: {
    async getAllQuotes() {
      this.tableItems.loading = true
      const n = await retrieve()
      this.tableItems.items = n.Items
      this.tableItems.loading = false
      this.tableItems.totalItems = n.Count
      this.tableItems.loading = false
    },
    editItem(item) {
      console.log(item)
      this.$router.push({ name: 'edit', params: { id: item.timestamp } })
    },
    deleteItem(item) {
      console.log(item)
    }
  }
}
</script>

<template>
  <v-data-table
    :headers="tableItems.headers"
    :items="tableItems.items"
    item-key="source"
    items-per-page="5"
    :loading="tableItems.loading"
  >
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>
