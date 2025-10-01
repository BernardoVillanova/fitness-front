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
  /* Light Mode */
  --card-bg: #ffffff;
  --text-color: #0f172a;
  --text-muted: #64748b;
  --text-secondary: #475569;
  --border-color: #e2e8f0;
  --bg-secondary: #f8fafc;
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --success-color: #10b981;
  --warning-color: #eab308;
  --danger-color: #ef4444;
}

.dark-mode {
  /* Dark Mode */
  --card-bg: #1e1e2d;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --text-secondary: #6b7280;
  --border-color: #2d2d3f;
  --bg-secondary: #171723;
  --primary-color: #667eea;
  --primary-hover: #5568d3;
  --success-color: #10b981;
  --warning-color: #eab308;
  --danger-color: #ef4444;
}


</style>