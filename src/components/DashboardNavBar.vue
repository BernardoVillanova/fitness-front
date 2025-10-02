<template>
  <!-- Botão Flutuante para Expandir Menu -->
  <button 
    v-if="isCollapsed && !isMobile" 
    @click="toggleCollapsed" 
    class="expand-menu-btn"
    title="Expandir menu"
  >
    <i class="fas fa-bars"></i>
  </button>

  <nav :class="['navbar', { 'navbar-dark': isDarkMode, 'navbar-light': !isDarkMode, 'navbar-mobile': isMobile, 'navbar-collapsed': isCollapsed }]">
    <!-- Logo -->
    <div class="logo-section" v-if="!isMobile">
      <div class="logo-header">
        <router-link to="/dashboard" class="logo-link">
          <h1 class="logo-text">Winx Fitness</h1>
        </router-link>
        <button @click="toggleCollapsed" class="collapse-btn" title="Recolher menu">
          <i class="fas fa-angle-left"></i>
        </button>
      </div>
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
      <li class="nav-item-with-submenu">
        <div class="nav-item" @click="toggleWorkoutSubmenu" :class="{ 'has-submenu-active': workoutSubmenuOpen }">
          <div class="nav-icon">
            <i class="fas fa-dumbbell"></i>
          </div>
          <span v-if="!isMobile">Treinos</span>
          <div class="submenu-arrow" v-if="!isMobile">
            <i :class="workoutSubmenuOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
          </div>
        </div>
        <ul class="submenu" v-if="workoutSubmenuOpen && !isMobile">
          <li>
            <router-link to="/exercises" class="nav-item submenu-item" active-class="active">
              <div class="nav-icon">
                <i class="fas fa-list"></i>
              </div>
              <span>Exercícios</span>
            </router-link>
          </li>
          <li>
            <router-link to="/machines" class="nav-item submenu-item" active-class="active">
              <div class="nav-icon">
                <i class="fas fa-cogs"></i>
              </div>
              <span>Aparelhos</span>
            </router-link>
          </li>
          <li>
            <router-link to="/workout-plans" class="nav-item submenu-item" active-class="active">
              <div class="nav-icon">
                <i class="fas fa-clipboard-list"></i>
              </div>
              <span>Planos</span>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>

    <!-- Divider -->
    <div class="divider" v-if="!isMobile"></div>

    <!-- Bottom section -->
    <ul class="bottom-links" v-if="!isMobile">
      <li>
        <router-link to="/instructor-profile" class="nav-item">
          <div class="nav-icon">
            <i class="fas fa-user-circle"></i>
          </div>
          <span>Meu Perfil</span>
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
      <li>
        <div class="nav-item logout-btn" @click="logout">
          <div class="nav-icon">
            <i class="fas fa-sign-out-alt"></i>
          </div>
          <span>Sair</span>
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
    const workoutSubmenuOpen = ref(false);
    const isCollapsed = ref(false);

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const toggleWorkoutSubmenu = () => {
      workoutSubmenuOpen.value = !workoutSubmenuOpen.value;
    };

    const toggleCollapsed = () => {
      isCollapsed.value = !isCollapsed.value;
      localStorage.setItem('dashboardSidebarCollapsed', isCollapsed.value.toString());
    };

    const logout = () => {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      console.log('Usuário deslogado');
      router.push('/login');
    };

    const iconLogout = computed(() => (isDarkMode.value ? iconLogoutLight : iconLogoutDark));

    onMounted(() => {
      window.addEventListener('resize', checkScreenSize);
      
      // Restaurar estado do localStorage
      const saved = localStorage.getItem('dashboardSidebarCollapsed');
      if (saved !== null) {
        isCollapsed.value = saved === 'true';
      }
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
      workoutSubmenuOpen,
      toggleWorkoutSubmenu,
      isCollapsed,
      toggleCollapsed,
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
  display: flex;
  flex-direction: column;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.navbar-collapsed {
  width: 0;
  opacity: 0;
  pointer-events: none;
}

/* Cores tema light - AZUIS */
.navbar-light {
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  border-right: 1px solid rgba(37, 99, 235, 0.1);
}

/* Cores tema dark - ROXOS */
.navbar-dark {
  background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%);
  border-right: 1px solid rgba(139, 92, 246, 0.2);
}

/* Expand Menu Button (Floating) */
.expand-menu-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  z-index: 999;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.expand-menu-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.expand-menu-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

/* Logo section */
.logo-section {
  padding: 32px 32px 24px 32px;
  border-bottom: 1px solid rgba(37, 99, 235, 0.15);
  transition: all 0.3s ease;
}

.navbar-dark .logo-section {
  border-bottom-color: rgba(139, 92, 246, 0.2);
}

.logo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.logo-link {
  text-decoration: none;
  flex: 1;
  display: block;
  transition: all 0.3s ease;
}

.logo-link:hover {
  transform: translateX(2px);
}

.collapse-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.navbar-light .collapse-btn {
  background: rgba(37, 99, 235, 0.1);
  color: #3b82f6;
}

.navbar-light .collapse-btn:hover {
  background: rgba(37, 99, 235, 0.2);
  transform: scale(1.05);
}

.navbar-dark .collapse-btn {
  background: rgba(139, 92, 246, 0.15);
  color: #a855f7;
}

.navbar-dark .collapse-btn:hover {
  background: rgba(139, 92, 246, 0.25);
  transform: scale(1.05);
}

.logo-text {
  margin: 0;
  text-align: left;
  cursor: pointer;
  font-size: 24px;
  font-weight: 700;
  transition: all 0.3s ease;
}

/* Logo cores tema light */
.navbar-light .logo-text {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Logo cores tema dark */
.navbar-dark .logo-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  text-decoration: none;
  font-weight: 400;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  position: relative;
  box-sizing: border-box;
  border-radius: 0;
}

/* Cores nav-item tema light */
.navbar-light .nav-item {
  color: #475569;
}

.navbar-light .nav-item:hover:not(.active):not(.router-link-active) {
  color: #1e293b;
  background: rgba(37, 99, 235, 0.1);
  transform: translateX(4px);
}

/* Cores nav-item tema dark */
.navbar-dark .nav-item {
  color: rgba(255, 255, 255, 0.7);
}

.navbar-dark .nav-item:hover:not(.active):not(.router-link-active) {
  color: #f1f5f9;
  background: rgba(139, 92, 246, 0.15);
  transform: translateX(4px);
}

/* Estados ativos - cores ajustadas */
.navbar-light .nav-item.active,
.navbar-light .nav-item.router-link-active {
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%) !important;
  color: #ffffff !important;
  font-weight: 500;
  border-radius: 0 28px 28px 0;
  margin-right: 24px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.navbar-dark .nav-item.active,
.navbar-dark .nav-item.router-link-active {
  background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%) !important;
  color: #ffffff !important;
  font-weight: 500;
  border-radius: 0 28px 28px 0;
  margin-right: 24px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
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

/* Submenu styles */
.nav-item-with-submenu {
  position: relative;
}

.nav-item.has-submenu-active {
  background: rgba(37, 99, 235, 0.1);
}

.navbar-dark .nav-item.has-submenu-active {
  background: rgba(139, 92, 246, 0.15);
}

.submenu-arrow {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.submenu {
  list-style: none;
  padding: 8px 0;
  margin: 0;
  background: var(--bg-primary, rgba(248, 250, 252, 0.9));
  border-left: 3px solid rgba(37, 99, 235, 0.3);
  margin-left: 32px;
  padding-left: 16px;
  animation: slideDown 0.3s ease-out;
}

.navbar-dark .submenu {
  background: rgba(15, 16, 23, 0.8);
  border-left-color: rgba(139, 92, 246, 0.3);
}

.submenu-item {
  padding: 12px 24px !important;
  font-size: 14px !important;
  margin-right: 0 !important;
  border-radius: 0 !important;
}

.submenu-item.active,
.submenu-item.router-link-active {
  background: rgba(37, 99, 235, 0.15) !important;
  border-radius: 8px !important;
  margin-right: 8px !important;
}

.navbar-dark .submenu-item.active,
.navbar-dark .submenu-item.router-link-active {
  background: rgba(139, 92, 246, 0.2) !important;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Divider */
.divider {
  height: 1px;
  margin: 24px 32px;
  flex-shrink: 0;
}

.navbar-light .divider {
  background: rgba(37, 99, 235, 0.15);
}

.navbar-dark .divider {
  background: rgba(139, 92, 246, 0.2);
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

/* Logout button */
.logout-btn {
  cursor: pointer;
  color: #ef4444 !important;
}

.navbar-dark .logout-btn {
  color: #f87171 !important;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #dc2626 !important;
}

.navbar-dark .logout-btn:hover {
  background: rgba(248, 113, 113, 0.15) !important;
  color: #fca5a5 !important;
}

/* Cores hover tema light */
.navbar-light .dark-mode-toggle:hover {
  color: #1e293b;
  background: rgba(37, 99, 235, 0.1);
  transform: translateX(4px);
}

/* Cores hover tema dark */
.navbar-dark .dark-mode-toggle:hover {
  color: #f1f5f9;
  background: rgba(139, 92, 246, 0.15);
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
  border-radius: 10px;
  transition: 0.3s;
}

/* Toggle cores tema light */
.navbar-light .toggle-label {
  background: #cbd5e1;
}

.navbar-light input:checked + .toggle-label {
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
}

/* Toggle cores tema dark */
.navbar-dark .toggle-label {
  background: #475569;
}

.navbar-dark input:checked + .toggle-label {
  background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
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
  border-radius: 10px;
  transition: 0.3s;
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
    height: 70px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 8px 12px;
    position: fixed;
    bottom: 0;
    left: 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  }

  /* Mobile tema light */
  .navbar-mobile.navbar-light {
    background: linear-gradient(90deg, #f8fafc 0%, #e2e8f0 100%);
    border-top: 1px solid rgba(37, 99, 235, 0.1);
  }

  /* Mobile tema dark */
  .navbar-mobile.navbar-dark {
    background: linear-gradient(90deg, #0f172a 0%, #1e1b4b 100%);
    border-top: 1px solid rgba(139, 92, 246, 0.2);
  }

  .nav-links {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    gap: 0;
    padding: 0;
  }

  .nav-links li {
    flex: 1;
  }

  .nav-item {
    flex-direction: column;
    gap: 4px;
    padding: 8px 4px;
    font-size: 11px;
    text-align: center;
    border-radius: 10px;
    margin-right: 0;
  }

  .nav-item span {
    display: none;
  }

  .nav-icon {
    width: 24px;
    height: 24px;
  }

  .nav-icon i {
    font-size: 18px;
  }

  /* Mobile active states */
  .navbar-light .nav-item.active,
  .navbar-light .nav-item.router-link-active {
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    border-radius: 10px;
    margin-right: 0;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  }

  .navbar-dark .nav-item.active,
  .navbar-dark .nav-item.router-link-active {
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    border-radius: 10px;
    margin-right: 0;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
  }

  .divider,
  .bottom-links {
    display: none;
  }

  .mobile-logout {
    position: absolute;
    top: 12px;
    right: 16px;
    padding: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
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
    bottom: 70px;
    left: 0;
    right: 0;
    padding: 16px;
    box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.2);
    border-radius: 16px 16px 0 0;
  }

  /* Menu open cores tema light */
  .navbar-light .menu-open {
    background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
    border-top: 1px solid rgba(37, 99, 235, 0.1);
  }

  /* Menu open cores tema dark */
  .navbar-dark .menu-open {
    background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%);
    border-top: 1px solid rgba(139, 92, 246, 0.2);
  }

  .menu-open .nav-item {
    flex-direction: row;
    justify-content: flex-start;
    padding: 12px 16px;
    margin-bottom: 4px;
    border-radius: 10px;
    gap: 12px;
  }

  .menu-open .nav-item span {
    display: block;
  }
}

/* Ajustes para telas muito pequenas */
@media (max-width: 480px) {
  .navbar {
    width: 280px;
  }
  
  .logo-section {
    padding: 32px 32px 24px 32px;
  }
  
  .logo-text {
    font-size: 24px;
  }
  
  .nav-item {
    padding: 18px 32px;
    gap: 20px;
    font-size: 16px;
  }
  
  .divider {
    margin: 24px 32px;
  }
  
  .bottom-links {
    padding: 0 0 32px 0;
  }
  
  .dark-mode-toggle {
    padding-right: 32px !important;
  }
}

/* Ajustes adicionais para evitar sobreposição */
@media (min-width: 769px) {
  body {
    margin-left: 280px;
  }
}

/* Transições suaves */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>