<template>
  <div>
    <RouterView /> <!-- APENAS UMA VEZ! -->
  </div>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
  name:"App",
  components: {
    RouterView
  }
};
</script>
