<script setup>
import { ref, onMounted } from 'vue'
import { retrieve, deleteItem } from '@/services/apiService'
import { useRouter } from 'vue-router'
import TableView from '@/components/TableView.vue'

const headers = [
  { title: 'Id', key: 'id' },
  { title: 'Speaker', key: 'speaker' },
  { title: 'Quote', key: 'quote' },
  { title: 'Source', key: 'source' },
  { title: 'Actions', key: 'actions', sortable: false, width: 100 }
]

const items = ref([])
const loading = ref(false)
const totalItems = ref(0)

const router = useRouter()

onMounted(() => {
  getAllQuotes()
})

async function getAllQuotes() {
  loading.value = true
  try {
    const res = await retrieve()
    items.value = res.Items
    totalItems.value = res.Count
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
async function editItem(item) {
  router.push({ name: 'edit', params: { id: item.id } })
}

async function doDelete(item) {
  try {
    const res = await deleteItem(item.id)
  } catch(err) {
    console.error(err)
  }
}

</script>

<template>
  <TableView 
    :headers="headers" 
    :items="items" 
    :loading="loading"
    :totalItems="totalItems"
    :sort-by="[{ key: 'id', order: 'asc' }]"
    @edit="editItem"
    @delete="doDelete"
  />
</template>
