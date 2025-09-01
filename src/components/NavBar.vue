<template>
  <nav class="navbar" :class="{ dark: isDarkMode, light: !isDarkMode }">
    <div class="logo">Winx Fitness</div>

    <!-- Menu Desktop -->
    <div class="middle-container">
      <ul class="nav-links">
        <li><router-link to="/" class="nav-link">Home</router-link></li>
        <li>
          <router-link to="/about" class="nav-link">Sobre Nós</router-link>
        </li>
        <li><router-link to="/login" class="nav-link">Login</router-link></li>
      </ul>
    </div>

    <!-- Botão Hambúrguer -->
    <button
      class="hamburger-menu"
      @click="toggleMobileMenu"
      :class="{ active: isMobileMenuOpen }"
      aria-label="Menu"
    >
      <svg
        class="hamburger-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path v-if="!isMobileMenuOpen" d="M3 12h18M3 6h18M3 18h18" />
        <path v-else d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>

    <label class="theme-switch">
      <input type="checkbox" :checked="isDarkMode" @change="toggleDarkMode" />
      <span class="switch-track">
        <span class="switch-thumb">
          <span class="switch-icon"></span>
        </span>
      </span>
    </label>

    <!-- Menu Mobile (Overlay) -->
    <div
      class="mobile-menu-overlay"
      :class="{ active: isMobileMenuOpen }"
      @click="closeMobileMenu"
    >
      <div class="mobile-menu" @click.stop>
        <div class="mobile-menu-header">
          <div class="logo">Winx Fitness</div>
        </div>
        <ul class="mobile-nav-links">
          <li>
            <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu"
              >Home</router-link
            >
          </li>
          <li>
            <router-link
              to="/about"
              class="mobile-nav-link"
              @click="closeMobileMenu"
              >Sobre Nós</router-link
            >
          </li>
          <li>
            <router-link
              to="/login"
              class="mobile-nav-link"
              @click="closeMobileMenu"
              >Login</router-link
            >
          </li>
        </ul>
        <div class="mobile-theme-switch">
          <span class="theme-label">Tema</span>
          <label class="theme-switch mobile">
            <input
              type="checkbox"
              :checked="isDarkMode"
              @change="toggleDarkMode"
            />
            <span class="switch-track">
              <span class="switch-thumb">
                <span class="switch-icon"></span>
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export default {
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    const { toggleDarkMode } = themeStore;

    const isMobileMenuOpen = ref(false);

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
      document.body.style.overflow = isMobileMenuOpen.value ? "hidden" : "auto";
    };

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
      document.body.style.overflow = "auto";
    };

    return {
      isDarkMode,
      toggleDarkMode,
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
    };
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
  font-family: var(--font-family);
  position: relative;
  z-index: 100;
}

.light {
  background-color: #ffffff;
  color: #0f172a;
  --border-color: #e2e8f0;
  --logo-color: #2563eb;
  --nav-color: #64748b;
  --nav-hover-color: #2563eb;
  --underline-color: #2563eb;
}

.dark {
  background-color: #1a1a2e;
  color: #f1f5f9;
  --border-color: #334155;
  --logo-color: #8b5cf6;
  --nav-color: #cbd5e1;
  --nav-hover-color: #8b5cf6;
  --underline-color: #8b5cf6;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--logo-color);
  letter-spacing: -0.025em;
}

.middle-container {
  display: flex;
  margin-left: -7rem;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 30px;
  padding: 0;
  margin: 0;
}

.nav-link {
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  color: var(--nav-color);
  position: relative;
  transition: color 0.3s ease;
  letter-spacing: 0.01em;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--underline-color);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-link:hover {
  color: var(--nav-hover-color);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.router-link-active {
  color: var(--nav-hover-color);
  font-weight: 600;
}

.nav-link.router-link-active::after {
  width: 100%;
}

.hamburger-menu {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  position: relative;
  z-index: 1001;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.hamburger-menu:not(.active):hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark .hamburger-menu:not(.active):hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.hamburger-icon {
  width: 24px;
  height: 24px;
  color: var(--nav-color);
  transition: color 0.3s ease;
}

.hamburger-menu:hover .hamburger-icon {
  color: var(--nav-hover-color);
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  max-width: 85vw;
  height: 100%;
  background: var(--navbar-bg, #ffffff);
  border-left: 1px solid var(--border-color);
  padding: 0;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

.dark .mobile-menu {
  --navbar-bg: #1a1a2e;
}

.mobile-menu-overlay.active .mobile-menu {
  transform: translateX(0);
}

.mobile-menu-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid var(--border-color);
}

.mobile-nav-links {
  list-style: none;
  padding: 0;
  margin: 30px 0;
}

.mobile-nav-links li {
  margin: 0;
}

.mobile-nav-link {
  display: block;
  padding: 15px 25px;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  color: var(--nav-color);
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.mobile-nav-link:hover {
  color: var(--nav-hover-color);
  background: rgba(37, 99, 235, 0.05);
  border-left-color: var(--underline-color);
}

.dark .mobile-nav-link:hover {
  background: rgba(139, 92, 246, 0.1);
}

.mobile-nav-link.router-link-active {
  color: var(--nav-hover-color);
  font-weight: 600;
  border-left-color: var(--underline-color);
  background: rgba(37, 99, 235, 0.05);
}

.dark .mobile-nav-link.router-link-active {
  background: rgba(139, 92, 246, 0.1);
}

.mobile-theme-switch {
  position: absolute;
  bottom: 30px;
  left: 25px;
  right: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-top: 1px solid var(--border-color);
}

.theme-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--nav-color);
}

.theme-switch {
  position: relative;
  display: inline-block;
  width: 70px;
  height: 36px;
  cursor: pointer;
}

.theme-switch.mobile {
  width: 60px;
  height: 32px;
}

.theme-switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.switch-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-thumb {
  position: absolute;
  top: 2px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.theme-switch.mobile .switch-thumb {
  width: 28px;
  height: 28px;
}

.switch-icon {
  color: white;
  font-size: 18px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.theme-switch.mobile .switch-icon {
  font-size: 14px;
}

/* Modo Light (não checado) - Fundo amarelo, círculo laranja com sol */
input:not(:checked) + .switch-track {
  background: #fae9b1;
}

input:not(:checked) + .switch-track .switch-thumb {
  left: 2px;
  background: #f2c136;
}

input:not(:checked) + .switch-track .switch-icon::before {
  content: "☀";
  color: white;
  font-size: 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.theme-switch.mobile input:not(:checked) + .switch-track .switch-icon::before {
  font-size: 14px;
}

/* Modo Dark (checado) - Fundo escuro, círculo azul com lua */
input:checked + .switch-track {
  background: #1e293b;
}

input:checked + .switch-track .switch-thumb {
  left: 46px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.theme-switch.mobile input:checked + .switch-track .switch-thumb {
  left: 40px;
}

input:checked + .switch-track .switch-icon::before {
  content: "🌙";
  font-size: 14px;
  filter: brightness(0) invert(1);
}

.theme-switch.mobile input:checked + .switch-track .switch-icon::before {
  font-size: 12px;
}

.theme-switch:hover .switch-thumb {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Media Queries */
@media (max-width: 768px) {
  .navbar {
    padding: 16px 20px;
  }

  .logo {
    font-size: 22px;
  }

  .middle-container {
    display: none;
  }

  .theme-switch {
    display: none;
  }

  .hamburger-menu {
    display: flex;
  }
}

@media (max-width: 640px) {
  .navbar {
    padding: 16px 16px;
  }

  .mobile-menu {
    width: 280px;
  }

  .mobile-menu-header {
    padding: 16px 20px;
  }

  .mobile-nav-link {
    padding: 12px 20px;
    font-size: 16px;
  }

  .mobile-theme-switch {
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
}

/* Animações suaves */
@media (prefers-reduced-motion: no-preference) {
  .mobile-menu-overlay {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .mobile-menu {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hamburger-line {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
</style>
