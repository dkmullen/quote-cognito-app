<template>
  <v-dialog width="500">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card :title="props.title">
        <v-card-text> {{ props.message }} </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :text="props.cancelText" @click="isActive.value = false"></v-btn>
          <v-btn variant="flat" color="primary" @click="doAction(), (isActive.value = false)">{{
            props.actionText
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: 'Confirm' },
  message: { String, default: 'Are you sure?' },
  cancelText: { String, default: 'Cancel' },
  actionText: { String, default: 'Okay' }
})
const emit = defineEmits(['doAction'])

function doAction() {
  emit('doAction')
}
</script>

<style lang="scss" scoped></style>
