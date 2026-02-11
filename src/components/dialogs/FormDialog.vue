<script setup>
import { ref } from 'vue'
import MainForm from '@/views/MainForm.vue'

const dialog = ref(false)
const props = defineProps({
  width: { String, default: '600' },
})

defineExpose({ dialog })

</script>

<template>
  <v-dialog
    :width="props.width"
    v-model="dialog"
    style="align-items: unset"
  >
    <template v-slot:default="{ isActive }">
      <v-card id="dialog-card">
        <v-card-text>
            <MainForm @close="dialog = false" />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
