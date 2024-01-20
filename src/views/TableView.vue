<script>
import { retrieveAll } from '@/services/apiService'

export default {
  data: () => ({
    tableItems: {
      headers: [
        { title: 'Source', value: 'source' },
        { title: 'Timestamp', value: 'timestamp' },
        { title: 'Quote', value: 'quote' }
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
      const n = await retrieveAll()
      console.log(n)
      this.tableItems.items = n.Items
      console.log(this.tableItems.items)
      this.tableItems.loading = false
      this.tableItems.totalItems = n.Count
      this.tableItems.loading = false
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
  ></v-data-table>
</template>
<!-- @update:options="loadItems" 
    { title: 'Actions', key: 'actions', sortable: false }

-->
