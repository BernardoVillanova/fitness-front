<template>
  <nav :class="['navbar', { 'navbar-mobile': isMobile }]">
    <button v-if="isMobile" @click="toggleMenu" class="hamburger-menu">
      <i :class="menuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
    </button>

    <div class="logo">W</div>

    <ul :class="['nav-links', { 'menu-open': menuOpen }]">
      <li>
        <router-link to="/home">
          <i class="fas fa-home"></i>
          <span v-if="!isMobile">Home</span>
        </router-link>
      </li>
      <li>
        <router-link to="/students">
          <i class="fas fa-user-graduate"></i>
          <span v-if="!isMobile">Alunos</span>
        </router-link>
      </li>
      <li>
        <router-link to="/workout-plans">
          <i class="fas fa-dumbbell"></i>
          <span v-if="!isMobile">Treinos</span>
        </router-link>
      </li>
      <li>
        <button @click="logout">
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="!isMobile">Sair</span>
        </button>
      </li>
    </ul>

    <!-- Perfil e Tema -->
    <div class="bottom-section">
      <div class="profile">
        <i class="fas fa-user-circle"></i>
        <span v-if="!isMobile">Perfil</span>
      </div>
      <button @click="toggleDarkMode" class="theme-toggle">
        <i class="fas" :class="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
        <span v-if="!isMobile">{{ isDarkMode ? 'Claro' : 'Escuro' }}</span>
      </button>
    </div>
  </nav>
</template>

<script>
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: "DashboardNavBar",

  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    const { toggleDarkMode } = themeStore;
    const router = useRouter();
    
    const isMobile = ref(window.innerWidth <= 768);
    const menuOpen = ref(false);

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const logout = () => {
      console.log('Usuário deslogado');
      router.push('/login');
    };

    onMounted(() => {
      window.addEventListener('resize', checkScreenSize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize);
    });

    return { isDarkMode, toggleDarkMode, logout, isMobile, menuOpen, toggleMenu };
  }
};
</script>

<style scoped>
.navbar {
  width: 80px;
  height: 100vh;
  background: #1e1e2d;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  transition: all 0.3s ease-in-out;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.navbar-mobile {
  width: 100%;
  height: 60px;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #1e1e2d;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.3);
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 30px;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s;
}

.nav-links li {
  margin: 20px 0;
}

.nav-links a,
.nav-links button {
  color: white;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-links i {
  font-size: 18px;
  margin-bottom: 5px;
}

/* BARRA INFERIOR NO MOBILE */
.bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
}

/* PERFIL E TEMA */
.profile,
.theme-toggle {
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px 0;
  cursor: pointer;
}

.theme-toggle {
  background: none;
  border: none;
}

/* MENU HAMBURGUER */
.hamburger-menu {
  display: none;
  position: absolute;
  top: 15px;
  left: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

/* MODO MOBILE: NAVBAR INFERIOR */
@media (max-width: 768px) {
  .navbar {
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }

  .logo {
    margin-bottom: 0;
  }

  .nav-links {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    position: absolute;
    bottom: 10px;
  }

  .nav-links li {
    margin: 0 10px;
  }

  .nav-links a span,
  .nav-links button span,
  .profile span,
  .theme-toggle span {
    display: none;
  }

  .hamburger-menu {
    display: block;
  }

  .menu-open {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 60px;
    background: #1e1e2d;
    width: 100%;
    padding: 15px 0;
    box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.3);
  }

  .menu-open li {
    margin: 10px 0;
  }
}
</style>
