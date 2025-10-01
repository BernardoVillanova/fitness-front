<template>
  <div class="student-layout">
    <!-- Navigation Bar -->
    <nav class="student-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <img src="@/assets/logo.png" alt="FitTrack" class="logo">
          <span class="brand-text">FitTrack</span>
        </div>
        
        <div class="nav-menu" :class="{ 'active': showMobileMenu }">
          <router-link to="/student-dashboard" class="nav-link" active-class="active">
            <i class="fas fa-tachometer-alt"></i>
            Dashboard
          </router-link>
          <router-link to="/student/workouts" class="nav-link" active-class="active">
            <i class="fas fa-dumbbell"></i>
            Treinos
          </router-link>
          <router-link to="/student/progress" class="nav-link" active-class="active">
            <i class="fas fa-chart-line"></i>
            Progresso
          </router-link>
          <router-link to="/student/history" class="nav-link" active-class="active">
            <i class="fas fa-history"></i>
            Histórico
          </router-link>
          <router-link to="/student/instructor" class="nav-link" active-class="active">
            <i class="fas fa-user-tie"></i>
            Instrutor
          </router-link>
        </div>
        
        <div class="nav-user">
          <div class="user-avatar" @click="toggleUserMenu">
            <img :src="authStore.currentUser?.avatar" :alt="authStore.currentUser?.name">
            <span class="user-name">{{ authStore.currentUser?.name }}</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          
          <div class="user-dropdown" v-show="showUserMenu">
            <router-link to="/student/profile" class="dropdown-item">
              <i class="fas fa-user"></i>
              Meu Perfil
            </router-link>
            <router-link to="/student/settings" class="dropdown-item">
              <i class="fas fa-cog"></i>
              Configurações
            </router-link>
            <div class="dropdown-divider"></div>
            <button @click="toggleMockData" class="dropdown-item">
              <i class="fas fa-database"></i>
              {{ authStore.useMockData ? 'Dados Reais' : 'Dados Demo' }}
            </button>
            <div class="dropdown-divider"></div>
            <button @click="logout" class="dropdown-item text-red">
              <i class="fas fa-sign-out-alt"></i>
              Sair
            </button>
          </div>
        </div>
        
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main class="main-content">
      <slot></slot>
    </main>
    
    <!-- Bottom Navigation for Mobile -->
    <nav class="bottom-nav">
      <router-link to="/student-dashboard" class="bottom-nav-item" active-class="active">
        <i class="fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/student/workouts" class="bottom-nav-item" active-class="active">
        <i class="fas fa-dumbbell"></i>
        <span>Treinos</span>
      </router-link>
      <router-link to="/student/progress" class="bottom-nav-item" active-class="active">
        <i class="fas fa-chart-line"></i>
        <span>Progresso</span>
      </router-link>
      <router-link to="/student/history" class="bottom-nav-item" active-class="active">
        <i class="fas fa-history"></i>
        <span>Histórico</span>
      </router-link>
      <router-link to="/student/profile" class="bottom-nav-item" active-class="active">
        <i class="fas fa-user"></i>
        <span>Perfil</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'StudentLayout',
  setup() {
    const authStore = useAuthStore();
    const showMobileMenu = ref(false);
    const showUserMenu = ref(false);
    
    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value;
    };
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
    };
    
    const toggleMockData = () => {
      authStore.toggleMockData();
      showUserMenu.value = false;
    };
    
    const logout = () => {
      authStore.logout();
      window.location.href = '/login';
    };
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-user')) {
        showUserMenu.value = false;
      }
      if (!event.target.closest('.nav-menu') && !event.target.closest('.mobile-menu-btn')) {
        showMobileMenu.value = false;
      }
    };
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      authStore,
      showMobileMenu,
      showUserMenu,
      toggleMobileMenu,
      toggleUserMenu,
      toggleMockData,
      logout
    };
  }
};
</script>

<style scoped>
.student-layout {
  min-height: 100vh;
  background: #f8fafc;
}

/* Navigation */
.student-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: #1a202c;
}

.logo {
  height: 32px;
  width: 32px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: #edf2f7;
  color: #2d3748;
}

.nav-link.active {
  background: #667eea;
  color: white;
}

.nav-user {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.user-avatar:hover {
  background: #edf2f7;
}

.user-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: #2d3748;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #4a5568;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #edf2f7;
}

.dropdown-item.text-red {
  color: #e53e3e;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #4a5568;
  cursor: pointer;
  padding: 0.5rem;
}

/* Main Content */
.main-content {
  min-height: calc(100vh - 64px);
  padding-bottom: 80px; /* Space for bottom nav on mobile */
}

/* Bottom Navigation */
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 0.5rem 0;
  z-index: 50;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  text-decoration: none;
  color: #718096;
  font-size: 0.75rem;
  flex: 1;
  transition: color 0.2s ease;
}

.bottom-nav-item i {
  font-size: 1.25rem;
}

.bottom-nav-item.active {
  color: #667eea;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .user-name {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .bottom-nav {
    display: flex;
  }
  
  .main-content {
    padding-bottom: 80px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 0.5rem;
  }
  
  .brand-text {
    display: none;
  }
}
</style>