<script setup>
import { ref, onMounted } from 'vue'
import { retrieve, deleteItem } from '@/services/apiService'
import TableView from '@/components/TableView.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import FormDialog from '@/components/dialogs/FormDialog.vue'

const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Name', key: 'name' },
  { title: 'Item', key: 'item' },
  { title: 'Mileage', key: 'mileage' },
  { title: 'Comments', key: 'comments' },
  { title: 'Actions', key: 'actions', sortable: false, width: 100, align: 'end' }
]

const items = ref([])
const loading = ref(false)
const totalItems = ref(0)
const confirmDialog = ref()
const formDialog = ref()
const currentItem = ref(null)
const path = '/cars'

onMounted(() => {
  getAll()
})

async function getAll() {
  loading.value = true
  try {
    const res = await retrieve({ path })
    items.value = res.Items
    totalItems.value = res.Count
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
async function editItem(item) {
  currentItem.value = item
  formDialog.value.dialog = true
}

function doConfirm(item) {
  currentItem.value = item
  confirmDialog.value.setDialog(true)
}

async function doDelete() {
  try {
    const res = await deleteItem({
      path,
      id: currentItem.value.timestamp,
      name: currentItem.value.name
    })
    if (res.$metadata?.httpStatusCode === 200) getAll()
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <v-row>
    <v-col cols="6"><h1 class="h3">Car Maintenance Records</h1></v-col>
    <v-col cols="6" align="end">
      <v-btn
        density="compact"
        color="success"
        icon="mdi-plus"
        @click="formDialog.dialog = true"
      ></v-btn>
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
  <ConfirmDialog ref="confirmDialog" @doAction="doDelete" @doCancel="currentItem = null" />
  <FormDialog
    ref="formDialog"
    :car="currentItem"
    :totalItems="totalItems"
    @closing="currentItem = null"
    :formName="'cars'"
  />
</template>
