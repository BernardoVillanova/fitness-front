<template>
    <footer 
      class="footer"
      :class="isDarkMode ? 'dark' : 'light'"
    >
      <p>© 2025 Sua Plataforma. Todos os direitos reservados.</p>
    </footer>
</template>

<script>
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';

  export default {
    name: 'FooterSection',
    
    setup() {
      const themeStore = useThemeStore();
      const { isDarkMode } = storeToRefs(themeStore);
      
      return{
        isDarkMode,
      }
    }
  }
</script>
  
<style scoped>
.footer {
  text-align: center;
  padding: 20px;
  background-color: var(--bg-color);
  color: var(--text-color);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.light {
  --primary-color: #007bff;
  --background-color: #f9f9f9;
  --text-color: #333;
  --card-background: #fff;
}

.dark {
  --primary-color: #6441a5;
  --background-color: #121212;
  --text-color: #eee;
  --card-background: #1e1e1e;
}

.light, .dark {
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
  