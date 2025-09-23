<template>
  <nav :class="['navbar', { 'navbar-dark': isDarkMode, 'navbar-light': !isDarkMode, 'navbar-mobile': isMobile }]">
    <!-- Logo -->
    <div class="logo-section" v-if="!isMobile">
      <router-link to="/" class="logo-link">
        <h1 class="logo-text">Winx Fitness</h1>
      </router-link>
    </div>

    <!-- Mobile hamburger button -->
    <button v-if="isMobile" @click="toggleMenu" class="hamburger-menu">
      <i :class="menuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
    </button>

    <!-- Navigation links -->
    <ul :class="['nav-links', { 'menu-open': menuOpen }]">
      <li>
        <router-link to="/dashboard" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-th-large"></i>
          </div>
          <span v-if="!isMobile">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/gym" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-building"></i>
          </div>
          <span v-if="!isMobile">Academias</span>
        </router-link>
      </li>
      <li>
        <router-link to="/students" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-users"></i>
          </div>
          <span v-if="!isMobile">Alunos</span>
        </router-link>
      </li>
      <li>
        <router-link to="/workout-plans" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-dumbbell"></i>
          </div>
          <span v-if="!isMobile">Treinos</span>
        </router-link>
      </li>
      <li>
        <router-link to="/settings" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-cog"></i>
          </div>
          <span v-if="!isMobile">Configurações</span>
        </router-link>
      </li>
    </ul>

    <!-- Divider -->
    <div class="divider" v-if="!isMobile"></div>

    <!-- Bottom section -->
    <ul class="bottom-links" v-if="!isMobile">
      <li>
        <router-link to="/security" class="nav-item">
          <div class="nav-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <span>Segurança</span>
        </router-link>
      </li>
      <li>
        <router-link to="/help" class="nav-item">
          <div class="nav-icon">
            <i class="fas fa-question-circle"></i>
          </div>
          <span>Ajuda</span>
        </router-link>
      </li>
      <li>
        <div class="nav-item dark-mode-toggle" @click="toggleDarkMode">
          <div class="nav-icon">
            <i class="fas fa-moon"></i>
          </div>
          <span>Modo Escuro</span>
          <div class="toggle-switch">
            <input type="checkbox" :checked="isDarkMode" @change="toggleDarkMode" id="darkModeToggle">
            <label for="darkModeToggle" class="toggle-label">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </li>
    </ul>

    <!-- Mobile logout button -->
    <button v-if="isMobile" @click="logout" class="nav-item mobile-logout">
      <div class="nav-icon">
        <img :src="iconLogout" alt="Sair">
      </div>
    </button>
  </nav>
</template>

<script>
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, onUnmounted } from 'vue';

import iconLogoutDark from '@/assets/right-from-bracket-dark.svg';
import iconLogoutLight from '@/assets/right-from-bracket-white.svg';

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

    const iconLogout = computed(() => (isDarkMode.value ? iconLogoutLight : iconLogoutDark));

    onMounted(() => {
      window.addEventListener('resize', checkScreenSize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize);
    });

    return { 
      isDarkMode, 
      toggleDarkMode, 
      logout, 
      isMobile, 
      menuOpen, 
      toggleMenu,
      iconLogout
    };
  }
};
</script>

<style scoped>
/* Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* Main navbar styles */
.navbar {
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #2D1B69 0%, #11052C 100%);
  display: flex;
  flex-direction: column;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
}

.navbar-light {
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Logo section */
.logo-section {
  padding: 32px 32px 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.logo-link {
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
}

.logo-link:hover {
  transform: translateX(2px);
}

.logo-text {
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  text-align: left;
  background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
}

.navbar-light .logo-text {
  background: linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #DB2777 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-light .logo-section {
  border-bottom-color: rgba(0, 0, 0, 0.1);
}

/* Navigation links */
.nav-links {
  list-style: none;
  padding: 32px 0 0 0;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-links li {
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 32px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-weight: 400;
  font-size: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  position: relative;
  box-sizing: border-box;
}

.nav-item:hover:not(.active):not(.router-link-active) {
  color: #E2E8F0;
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(90deg, #8B5CF6 0%, #A855F7 100%) !important;
  color: #FFFFFF !important;
  font-weight: 500;
  border-radius: 0 28px 28px 0;
  margin-right: 24px;
  position: relative;
}

.nav-item.router-link-active {
  background: linear-gradient(90deg, #8B5CF6 0%, #A855F7 100%) !important;
  color: #FFFFFF !important;
  font-weight: 500;
  border-radius: 0 28px 28px 0;
  margin-right: 24px;
  position: relative;
}

.nav-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon i {
  font-size: 20px;
}

/* Divider */
.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 24px 32px;
  flex-shrink: 0;
}

/* Bottom links */
.bottom-links {
  list-style: none;
  padding: 0 0 32px 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  margin-top: auto;
  gap: 2px;
}

.bottom-links li {
  margin: 0;
}

/* Dark mode toggle */
.dark-mode-toggle {
  justify-content: space-between;
  padding-right: 32px !important;
  cursor: pointer;
}

.dark-mode-toggle:hover {
  color: #E2E8F0;
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #4A5568;
  border-radius: 12px;
  transition: 0.3s;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .toggle-label {
  background: linear-gradient(90deg, #8B5CF6 0%, #A855F7 100%);
}

input:checked + .toggle-label:before {
  transform: translateX(26px);
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  transition: 0.3s;
}

/* Light mode adjustments */
.navbar-light .nav-item {
  color: #4A5568;
}

.navbar-light .nav-item:hover:not(.active):not(.router-link-active) {
  color: #1A202C;
  background: rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}

.navbar-light .divider {
  background: rgba(0, 0, 0, 0.1);
}

.navbar-light .toggle-label {
  background: #E2E8F0;
}

.navbar-light .dark-mode-toggle:hover {
  color: #1A202C;
  background: rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}

/* Hamburger menu */
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

/* Mobile styles */
@media (max-width: 768px) {
  .navbar-mobile {
    width: 100%;
    height: 80px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 12px;
    position: fixed;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, #2D1B69 0%, #11052C 100%);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  }

  .nav-links {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    gap: 0;
  }

  .nav-links li {
    flex: 1;
  }

  .nav-item {
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    font-size: 12px;
    text-align: center;
    border-radius: 12px;
    margin-right: 0;
  }

  .nav-item span {
    display: none;
  }

  .nav-icon {
    width: 28px;
    height: 28px;
  }

  .nav-icon i {
    font-size: 20px;
  }

  .nav-item.active {
    background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
    border-radius: 12px;
    border-left: none;
  }

  .divider,
  .bottom-links {
    display: none;
  }

  .mobile-logout {
    position: absolute;
    top: 15px;
    right: 20px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .hamburger-menu {
    display: block;
    position: relative;
    top: auto;
    left: auto;
  }

  .menu-open {
    display: flex !important;
    flex-direction: column;
    position: absolute;
    bottom: 80px;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, #2D1B69 0%, #11052C 100%);
    padding: 20px;
    box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.3);
    border-radius: 20px 20px 0 0;
  }

  .menu-open .nav-item {
    flex-direction: row;
    justify-content: flex-start;
    padding: 16px;
    margin-bottom: 8px;
    border-radius: 12px;
  }

  .menu-open .nav-item span {
    display: block;
  }
}
</style>