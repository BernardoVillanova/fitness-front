<template>
  <nav :class="['student-navbar', { 'navbar-dark': isDarkMode, 'navbar-light': !isDarkMode, 'navbar-mobile': isMobile }]">
    <!-- Logo/Header -->
    <div class="navbar-header" v-if="!isMobile">
      <div class="logo-section">
        <h1 class="logo-text">Winx Fitness</h1>
        <p class="user-role">Área do Aluno</p>
      </div>
    </div>

    <!-- Mobile hamburger button -->
    <button v-if="isMobile" @click="toggleMenu" class="hamburger-menu">
      <i :class="menuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
    </button>

    <!-- Navigation links -->
    <ul :class="['nav-links', { 'menu-open': menuOpen }]">
      <!-- Dashboard Principal -->
      <li>
        <router-link to="/dashboard-student" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-home"></i>
          </div>
          <span v-if="!isMobile">Dashboard</span>
        </router-link>
      </li>

      <!-- Meus Treinos -->
      <li>
        <router-link to="/student/workouts" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-dumbbell"></i>
          </div>
          <span v-if="!isMobile">Meus Treinos</span>
        </router-link>
      </li>

      <!-- Meu Progresso -->
      <li>
        <router-link to="/student/progress" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <span v-if="!isMobile">Meu Progresso</span>
        </router-link>
      </li>

      <!-- Histórico -->
      <li>
        <router-link to="/student/history" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-history"></i>
          </div>
          <span v-if="!isMobile">Histórico</span>
        </router-link>
      </li>

      <!-- Meu Instrutor -->
      <li>
        <router-link to="/student/instructor" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-user-tie"></i>
          </div>
          <span v-if="!isMobile">Meu Instrutor</span>
        </router-link>
      </li>

      <!-- Metas -->
      <li>
        <router-link to="/student/goals" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-bullseye"></i>
          </div>
          <span v-if="!isMobile">Minhas Metas</span>
        </router-link>
      </li>
    </ul>

    <!-- Divider -->
    <div class="divider" v-if="!isMobile"></div>

    <!-- Bottom section -->
    <ul class="bottom-links" v-if="!isMobile">
      <!-- Meu Perfil -->
      <li>
        <router-link to="/student/profile" class="nav-item">
          <div class="nav-icon">
            <i class="fas fa-user"></i>
          </div>
          <span>Meu Perfil</span>
        </router-link>
      </li>
      
      <!-- Configurações -->
      <li>
        <router-link to="/student/settings" class="nav-item">
          <div class="nav-icon">
            <i class="fas fa-cog"></i>
          </div>
          <span>Configurações</span>
        </router-link>
      </li>

      <!-- Modo Escuro -->
      <li>
        <div class="nav-item dark-mode-toggle" @click="toggleDarkMode">
          <div class="nav-icon">
            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </div>
          <span>{{ isDarkMode ? 'Modo Claro' : 'Modo Escuro' }}</span>
          <div class="toggle-switch">
            <input type="checkbox" :checked="isDarkMode" @change="toggleDarkMode" id="studentDarkModeToggle">
            <label for="studentDarkModeToggle" class="toggle-label">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </li>

      <!-- Logout -->
      <li>
        <div class="nav-item logout-item" @click="logout">
          <div class="nav-icon">
            <i class="fas fa-sign-out-alt"></i>
          </div>
          <span>Sair</span>
        </div>
      </li>
    </ul>

    <!-- Mobile bottom section -->
    <div v-if="isMobile" class="mobile-bottom">
      <router-link to="/student/profile" class="nav-item mobile-profile">
        <div class="nav-icon">
          <i class="fas fa-user"></i>
        </div>
      </router-link>
      <button @click="logout" class="nav-item mobile-logout">
        <div class="nav-icon">
          <i class="fas fa-sign-out-alt"></i>
        </div>
      </button>
    </div>
  </nav>
</template>

<script>
import { useThemeStore } from '@/store/theme';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: "StudentNavBar",

  setup() {
    const themeStore = useThemeStore();
    const authStore = useAuthStore();
    const { isDarkMode } = storeToRefs(themeStore);
    const { toggleDarkMode } = themeStore;
    const router = useRouter();
    
    const isMobile = ref(window.innerWidth <= 768);
    const menuOpen = ref(false);

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768;
      if (!isMobile.value) {
        menuOpen.value = false;
      }
    };

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

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
      toggleMenu
    };
  }
};
</script>

<style scoped>
/* Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* Main navbar styles */
.student-navbar {
  width: 280px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  border-right: 1px solid var(--border-color);
  background: var(--bg-primary);
}

/* Header section */
.navbar-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.logo-section {
  text-align: center;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-role {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

/* Navigation links */
.nav-links {
  list-style: none;
  padding: 1rem 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}

.nav-links li {
  margin: 0.25rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  font-size: 0.95rem;
  font-weight: 500;
}

.nav-item:hover {
  background: var(--bg-secondary);
  color: var(--primary-color);
  transform: translateX(4px);
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: var(--secondary-color);
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon i {
  font-size: 1.1rem;
}

/* Divider */
.divider {
  height: 1px;
  background: var(--border-color);
  margin: 1rem 1.5rem;
}

/* Bottom links */
.bottom-links {
  list-style: none;
  padding: 0 0 1rem 0;
  margin: 0;
}

.bottom-links li {
  margin: 0.25rem 0;
}

/* Dark mode toggle */
.dark-mode-toggle {
  justify-content: space-between;
}

.toggle-switch {
  margin-left: auto;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  background: var(--border-color);
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

input[type="checkbox"] {
  display: none;
}

input[type="checkbox"]:checked + .toggle-label {
  background: var(--primary-color);
}

input[type="checkbox"]:checked + .toggle-label .toggle-slider {
  transform: translateX(20px);
}

/* Logout item */
.logout-item {
  color: var(--error-color);
}

.logout-item:hover {
  background: var(--error-bg);
  color: var(--error-color);
}

/* Mobile styles */
.navbar-mobile {
  width: 100%;
  height: auto;
  position: fixed;
  bottom: 0;
  top: auto;
  flex-direction: row;
  padding: 0;
  z-index: 1001;
}

.hamburger-menu {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  padding: 1rem;
  cursor: pointer;
}

.mobile-bottom {
  display: flex;
  justify-content: space-around;
  padding: 0.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.mobile-profile,
.mobile-logout {
  padding: 0.75rem;
  border-radius: 50%;
  background: var(--bg-secondary);
}

@media (max-width: 768px) {
  .student-navbar {
    height: 70px;
    width: 100%;
    position: fixed;
    bottom: 0;
    top: auto;
    flex-direction: row;
    border-right: none;
    border-top: 1px solid var(--border-color);
  }

  .navbar-header {
    display: none;
  }

  .hamburger-menu {
    display: block;
    position: absolute;
    top: -60px;
    right: 1rem;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .nav-links {
    display: none;
    position: absolute;
    bottom: 70px;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px 12px 0 0;
    padding: 1rem 0;
    max-height: 60vh;
    overflow-y: auto;
  }

  .nav-links.menu-open {
    display: block;
  }

  .nav-links li {
    margin: 0;
  }

  .nav-item {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .nav-item:last-child {
    border-bottom: none;
  }

  .bottom-links {
    display: flex;
    justify-content: space-around;
    padding: 0.5rem;
    width: 100%;
    background: var(--bg-primary);
  }

  .bottom-links li {
    flex: 1;
    margin: 0;
  }

  .bottom-links .nav-item {
    justify-content: center;
    padding: 0.75rem 0.5rem;
    flex-direction: column;
    text-align: center;
    font-size: 0.75rem;
    border-bottom: none;
  }

  .bottom-links .nav-item span {
    margin-top: 0.25rem;
    font-size: 0.7rem;
  }

  .divider {
    display: none;
  }

  .dark-mode-toggle {
    display: none;
  }

  .mobile-bottom {
    display: none;
  }
}

/* CSS Variables for theming */
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --error-color: #ef4444;
  --error-bg: #fef2f2;
}

.navbar-dark {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
  --error-bg: #1f1416;
}

/* Smooth scrollbar */
.nav-links::-webkit-scrollbar {
  width: 4px;
}

.nav-links::-webkit-scrollbar-track {
  background: transparent;
}

.nav-links::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

.nav-links::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* Animation for menu toggle */
.nav-links {
  transition: all 0.3s ease;
}

.hamburger-menu i {
  transition: transform 0.3s ease;
}

.hamburger-menu:hover i {
  transform: scale(1.1);
}

/* Focus states for accessibility */
.nav-item:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: -2px;
}

.toggle-label:focus-within {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style>