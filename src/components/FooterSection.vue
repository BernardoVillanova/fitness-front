<template>
  <footer class="footer" :class="isDarkMode ? 'dark' : 'light'">
    <p>&copy; 2025 Winx Fitness. Todos os direitos reservados.</p>
  </footer>
</template>

<script>
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";

export default {
  name: "FooterSection",

  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);

    return {
      isDarkMode,
    };
  },
};
</script>

<style scoped>
.footer {
  text-align: center;
  padding: 30px 20px;
  border-top: 1px solid var(--border-color);
  transition: all 0.3s ease;
  font-family: var(--font-family);
}

.light {
  background-color: #f8fafc;
  color: #64748b;
  --border-color: #e2e8f0;
}

.dark {
  background-color: #1a1a1a;
  color: #a0a0a0;
  --border-color: rgba(255, 255, 255, 0.1);
}

.footer p {
  margin: 0;
  font-size: 0.95rem;
}

@media (max-width: 480px) {
  .footer {
    padding: 20px 15px;
  }

  .footer p {
    font-size: 0.9rem;
  }
}
</style>
