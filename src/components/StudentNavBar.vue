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
        <router-link to="/student-dashboard" class="logo-link">
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
        <router-link to="/student-dashboard" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-th-large"></i>
          </div>
          <span v-if="!isMobile">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/student/workouts" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-dumbbell"></i>
          </div>
          <span v-if="!isMobile">Meus Treinos</span>
        </router-link>
      </li>
      <li>
        <router-link to="/student/progress" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <span v-if="!isMobile">Progresso</span>
        </router-link>
      </li>
      <li>
        <router-link to="/student/history" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-history"></i>
          </div>
          <span v-if="!isMobile">Histórico</span>
        </router-link>
      </li>
      <li v-if="hasInstructor">
        <router-link to="/student/instructor" class="nav-item" active-class="active">
          <div class="nav-icon">
            <i class="fas fa-user-tie"></i>
          </div>
          <span v-if="!isMobile">Meu Instrutor</span>
        </router-link>
      </li>
    </ul>

    <!-- Divider -->
    <div class="divider" v-if="!isMobile"></div>

    <!-- Bottom section -->
    <ul class="bottom-links" v-if="!isMobile">
      <li>
        <router-link to="/student/profile" class="nav-item">
          <div class="nav-icon">
            <i class="fas fa-user"></i>
          </div>
          <span>Meu Perfil</span>
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
import api from '@/api';

export default {
  name: "StudentNavBar",
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const themeStore = useThemeStore();
    const authStore = useAuthStore();
    const { isDarkMode } = storeToRefs(themeStore);
    const { toggleDarkMode } = themeStore;
    const router = useRouter();
    
    const isMobile = ref(window.innerWidth <= 768);
    const menuOpen = ref(false);
    const hasInstructor = ref(false);
    const isCollapsed = ref(false);

    const toggleCollapsed = () => {
      isCollapsed.value = !isCollapsed.value;
      localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString());
    };

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

    const checkInstructor = async () => {
      try {
       
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
          hasInstructor.value = false;
          return;
        }

        const userData = JSON.parse(storedUser);
        
       
        if (userData.instructorId) {
          const instructorId = userData.instructorId?.$oid || 
                              userData.instructorId?._id || 
                              userData.instructorId;
          hasInstructor.value = !!(instructorId && instructorId.toString().trim() !== '');
          return;
        }
        
        const studentId = userData.studentId || userData.id;
        
        if (!studentId) {
          hasInstructor.value = false;
          return;
        }
        
       
        let response;
        try {
          response = await api.get(`/students/${studentId}`);
        } catch (err) {
         
          response = await api.get(`/students/user/${userData.id}`);
        }
        
        let instructorId = null;
        
       
        if (response.data.instructorId && typeof response.data.instructorId === 'object') {
          instructorId = response.data.instructorId.$oid || 
                        response.data.instructorId._id || 
                        response.data.instructorId.toString();
        } else {
         
          instructorId = response.data.instructorId;
        }
        
       
        hasInstructor.value = !!(instructorId && instructorId.toString().trim() !== '');
      } catch (error) {
        console.error('Erro ao verificar instrutor:', error);
        hasInstructor.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener('resize', checkScreenSize);
      checkInstructor();
      
     
      const saved = localStorage.getItem('sidebarCollapsed');
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
      hasInstructor,
      isCollapsed,
      toggleCollapsed
    };
  }
};
</script>

<style scoped>
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

.navbar-collapsed {
  transform: translateX(-280px);
}

/* Cores tema light - AZUL #007bff */
.navbar-light {
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  border-right: 1px solid rgba(0, 123, 255, 0.1);
}

/* Cores tema dark - ROXO #6441a5 */
.navbar-dark {
  background: linear-gradient(180deg, #000000 0%, #1a1a1a 100%);
  border-right: 1px solid rgba(100, 65, 165, 0.3);
}

/* Logo section */
.logo-section {
  padding: 32px 20px 24px 32px;
}

.logo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.navbar-dark .collapse-btn {
  background: rgba(100, 65, 165, 0.2);
  color: #8b5cf6;
}

.collapse-btn:hover {
  background: rgba(0, 123, 255, 0.2);
  transform: scale(1.05);
}

.navbar-dark .collapse-btn:hover {
  background: rgba(100, 65, 165, 0.3);
}

.navbar-collapsed .collapse-btn i {
  transform: rotate(180deg);
}

/* Botão flutuante para expandir menu */
.expand-menu-btn {
  position: fixed;
  left: 20px;
  top: 20px;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-mode .expand-menu-btn {
  background: linear-gradient(135deg, #6441a5 0%, #8b5fd9 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.expand-menu-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.6);
}

.dark-mode .expand-menu-btn:hover {
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
}

.expand-menu-btn:active {
  transform: scale(0.95);
}

.logo-section {
  border-bottom: 1px solid rgba(37, 99, 235, 0.15);
  transition: all 0.3s ease;
}

.navbar-dark .logo-section {
  border-bottom-color: rgba(139, 92, 246, 0.2);
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
  margin: 0;
  text-align: left;
  cursor: pointer;
  font-size: 24px;
  font-weight: 700;
  transition: all 0.3s ease;
}

/* Logo cores tema light */
.navbar-light .logo-text {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Logo cores tema dark */
.navbar-dark .logo-text {
  background: linear-gradient(135deg, #6441a5 0%, #8b5fd9 100%);
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
  color: #007bff;
  background: rgba(0, 123, 255, 0.08);
  transform: translateX(4px);
}

/* Cores nav-item tema dark */
.navbar-dark .nav-item {
  color: rgba(255, 255, 255, 0.7);
}

.navbar-dark .nav-item:hover:not(.active):not(.router-link-active) {
  color: #8b5fd9;
  background: rgba(100, 65, 165, 0.12);
  transform: translateX(4px);
}

/* Estados ativos - cores ajustadas */
.navbar-light .nav-item.active,
.navbar-light .nav-item.router-link-active {
  background: linear-gradient(90deg, #007bff 0%, #0056b3 100%) !important;
  color: #ffffff !important;
  font-weight: 500;
  border-radius: 0 28px 28px 0;
  margin-right: 24px;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.navbar-dark .nav-item.active,
.navbar-dark .nav-item.router-link-active {
  background: linear-gradient(90deg, #6441a5 0%, #8b5fd9 100%) !important;
  color: #ffffff !important;
  font-weight: 500;
  border-radius: 0 28px 28px 0;
  margin-right: 24px;
  box-shadow: 0 4px 12px rgba(100, 65, 165, 0.4);
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

/* Logout button - Red theme */
.logout-item {
  cursor: pointer;
  color: #ef4444 !important;
}

.logout-item .nav-icon {
  color: #ef4444 !important;
}

.logout-item span {
  color: #ef4444 !important;
}

.navbar-dark .logout-item {
  color: #f87171 !important;
}

.navbar-dark .logout-item .nav-icon {
  color: #f87171 !important;
}

.navbar-dark .logout-item span {
  color: #f87171 !important;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #dc2626 !important;
}

.logout-item:hover .nav-icon,
.logout-item:hover span {
  color: #dc2626 !important;
}

.navbar-dark .logout-item:hover {
  background: rgba(248, 113, 113, 0.15) !important;
  color: #fca5a5 !important;
}

.navbar-dark .logout-item:hover .nav-icon,
.navbar-dark .logout-item:hover span {
  color: #fca5a5 !important;
}

/* Mobile logout button */
.mobile-logout {
  color: #ef4444 !important;
}

.mobile-logout .nav-icon {
  color: #ef4444 !important;
}

.navbar-dark .mobile-logout {
  color: #f87171 !important;
}

.navbar-dark .mobile-logout .nav-icon {
  color: #f87171 !important;
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
  background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
}

/* Toggle cores tema dark */
.navbar-dark .toggle-label {
  background: #475569;
}

.navbar-dark input:checked + .toggle-label {
  background: linear-gradient(90deg, #6441a5 0%, #8b5fd9 100%);
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

  /* Esconder botão expandir no mobile */
  .expand-menu-btn {
    display: none;
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

  .mobile-bottom,
  .mobile-logout,
  .mobile-profile {
    display: none;
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

/* Transições suaves */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>