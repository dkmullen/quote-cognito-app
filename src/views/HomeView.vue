<script setup>
const links = [
  {
    label: 'Gmail',
    link: 'https://mail.google.com/mail/u/0/#inbox',
    icon: 'mdi-email-outline',
    color: 'error'
  },
  { label: 'ESPN', link: 'https://espn.com/', icon: 'mdi-football', color: 'error' },
  {
    label: 'AWS',
    link: 'https://us-east-2.console.aws.amazon.com/console/home?region=us-east-2#"',
    icon: 'mdi-aws',
    color: 'warning'
  },
  { label: 'LinkTree', link: 'https://linktr.ee/dkmullen', icon: 'mdi-link' },
  { label: 'GitHub', link: 'https://github.com/dkmullen', icon: 'mdi-github' },
  { label: 'Kagi', link: 'https://kagi.com/', icon: 'mdi-magnify' },
  {
    label: 'Daring Fireball',
    link: 'https://daringfireball.net/',
    icon: 'mdi-plus'
  },
  {
    label: 'Vuetify',
    link: 'https://vuetifyjs.com/en/components/all/#containment',
    icon: 'mdi-palette-swatch-outline'
  }
]
</script>
<template>
  <div class="d-flex align-center justify-center"></div>
  <v-container class="link-wrapper">
    <v-row>
      <v-col v-for="i in links" :index="i.label" cols="12" md="6">
        <a :href="i.link">
          <v-btn class="mr-4 mb-1" density="comfortable" color="primary" :icon="i.icon"></v-btn>
          <span>{{ i.label }}</span>
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.link-wrapper {
  max-width: 600px;
}
a {
  font-size: x-large;
  text-decoration: none;
  color: white;
}
</style>
