<template>
  <div class="fill-height">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.fill-height {
  min-height: 100vh;
}

:root {
  --bg-color: #ffffff;
  --text-color: #333;
  --highlight-color: #007bff;
  --button-color: #007bff;
  --button-hover-color: #0056b3;
}

.dark-mode {
  --bg-color: #1a1a1a;
  --text-color: #f4f4f4;
  --highlight-color: #a855f7;
  --button-color: #6a0dad;
  --button-hover-color: #531d99;
}


</style>