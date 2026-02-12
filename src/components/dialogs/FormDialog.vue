<script setup>
import { ref } from 'vue'
import QuoteForm from '../QuoteForm.vue'
import CarForm from '../CarForm.vue'

const dialog = ref(false)
const props = defineProps({
  formName: { type: String, default: 'quotes' },
  width: { type: String, default: '600' },
  quote: { type: Object, default: null},
  car: { type: Object, default: null},
  totalItems: { type: Number, default: 0 }
})

const emit = defineEmits(['closing'])
function doClose() {
  emit('closing')
  dialog.value = false
}

defineExpose({ dialog })

</script>

<template>
  <v-dialog
    :width="props.width"
    v-model="dialog"
    style="align-items: unset"
    persistent
  >
    <template v-slot:default="{ isActive }">
      <v-card id="dialog-card">
        <v-card-text>
            <QuoteForm v-if="formName === 'quotes'" @close="doClose" :quote="quote" :totalItems="totalItems" />
            <CarForm v-if="formName === 'cars'" @close="doClose" :car="car" :totalItems="totalItems" />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
