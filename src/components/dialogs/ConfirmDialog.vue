<template>
  <v-dialog
    :width="props.width"
    v-model="dialog"
    id="wha"
    style="align-items: unset"
    :style="{ top: props.top }"
  >
    <template v-slot:default="{ isActive }">
      <v-card :title="props.title" id="dialog-card">
        <v-card-text> {{ props.message }} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :text="props.cancelText" @click="doCancel"></v-btn>
          <v-btn variant="flat" color="primary" @click="doAction(), (isActive.value = false)">{{
            props.actionText
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
const props = defineProps({
  title: { type: String, default: 'Confirm' },
  message: { String, default: 'Are you sure?' },
  cancelText: { String, default: 'Cancel' },
  actionText: { String, default: 'Okay' },
  width: { String, default: '600' },
  top: { String, default: '100px' }
})
const emit = defineEmits(['doAction', 'doCancel'])

defineExpose({ setDialog })

function doAction() {
  emit('doAction')
}
function doCancel() {
  emit('doCancel')
  dialog.value = false
}
function setDialog(bool) {
  dialog.value = bool
}
</script>
