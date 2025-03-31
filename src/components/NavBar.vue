<template>
  <nav class="navbar" :class="{ dark: isDarkMode, light: !isDarkMode }">
    <div class="logo">Winx Fitness</div>
    <ul class="nav-links">
      
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/about">Sobre Nós</router-link></li>
      <li><router-link to="/login">Login</router-link></li>
    </ul>

    <!-- Switch de modo escuro/claro -->
    <label class="switch">
      <input type="checkbox" :checked="isDarkMode" @change="toggleDarkMode">
      <span class="slider">
        <span class="icon" :class="{ 'moon': isDarkMode, 'sun': !isDarkMode }"></span>
      </span>
    </label>
  </nav>
</template>

<script>
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    const { toggleDarkMode } = themeStore;

    return { isDarkMode, toggleDarkMode };
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  transition: background-color 0.3s ease;
}

.light {
  background-color: #f0f0f0;
  color: #333;
}

.dark {
  background-color: #1a1a2e;
  color: white;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
}

.nav-links li a {
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s ease;
}

.light .nav-links li a {
  color: #333;
}

.dark .nav-links li a {
  color: white;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 24px;
  width: 24px;
  left: 2px;
  bottom: 1px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.icon {
  position: absolute;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.275s ease-in-out;
  left: 3px;
  top: 50%;
  transform: translateY(-50%);
}

.sun::before {
  content: "🌞";
}

.moon::before {
  content: "🌙";
}

input:checked + .slider {
  background-color: #ccc;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

input:checked + .slider .icon {
  transform: translateX(24px) translateY(-50%);
}
</style>
