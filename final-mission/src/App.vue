<template>
  <router-view />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
export default {
  mounted() {
    console.clear()
  },
  components: {
    RouterView,
    RouterLink
  }
}
</script>
