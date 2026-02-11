<script setup>
import { ref, onMounted } from 'vue'
import { retrieve, deleteItem } from '@/services/apiService'
import { useRouter } from 'vue-router'
import TableView from '@/components/TableView.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import FormDialog from '@/components/dialogs/FormDialog.vue'

const headers = [
  { title: 'Id', key: 'id' },
  { title: 'Speaker', key: 'speaker' },
  { title: 'Quote', key: 'quote' },
  { title: 'Source', key: 'source' },
  { title: 'Actions', key: 'actions', sortable: false, width: 100, align: 'end' }
]

const items = ref([])
const loading = ref(false)
const totalItems = ref(0)
const confirmDialog = ref()
const formDialog = ref()
const tempItem = ref(null)

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

function doConfirm(item) {
  tempItem.value = item
  confirmDialog.value.setDialog(true)
}

async function doDelete() {
  try {
    const res = await deleteItem(tempItem.value.id)
    if (res.$metadata?.httpStatusCode === 200) getAllQuotes()
  } catch(err) {
    console.error(err)
  }
}

</script>

<template>
  <v-row justify="end">
    <v-col cols="auto">
      <v-btn density="compact" color="success" icon="mdi-plus" @click="formDialog.dialog = true"></v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <TableView 
        :headers="headers" 
        :items="items" 
        :loading="loading"
        :totalItems="totalItems"
        :sort-by="[{ key: 'id', order: 'asc' }]"
        @edit="editItem"
        @delete="doConfirm"
      />
    </v-col>
  </v-row>
  <ConfirmDialog ref="confirmDialog" @doAction="doDelete" @doCancel="tempItem = null" />
  <FormDialog ref="formDialog" />
</template>
