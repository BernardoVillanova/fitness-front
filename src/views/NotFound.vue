<template>
  <div class="not-found" :class="{ 'dark-mode': isDarkMode }">
    <div class="not-found-container">
      <div class="error-animation">
        <div class="error-number">404</div>
        <div class="error-icon">
          <i class="fas fa-dumbbell"></i>
        </div>
      </div>
      
      <div class="error-content">
        <h1 class="error-title">Página não encontrada</h1>
        <p class="error-message">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>
        
        <div class="error-actions">
          <button @click="goHome" class="btn-primary">
            <i class="fas fa-home"></i>
            Voltar ao Início
          </button>
          <button @click="goBack" class="btn-secondary">
            <i class="fas fa-arrow-left"></i>
            Página Anterior
          </button>
        </div>
        
        <div class="helpful-links">
          <h3>Links úteis:</h3>
          <ul>
            <li><router-link to="/student-dashboard">Dashboard</router-link></li>
            <li><router-link to="/student/workouts">Meus Treinos</router-link></li>
            <li><router-link to="/student/progress">Meu Progresso</router-link></li>
            <li><router-link to="/student/profile">Meu Perfil</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/theme'
import { useRouter } from 'vue-router'

// Stores
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

// Router
const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  padding: 2rem;
  transition: background 0.3s ease;
}

.not-found-container {
  text-align: center;
  max-width: 600px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.dark-mode .not-found-container {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.error-animation {
  margin-bottom: 2rem;
  position: relative;
}

.error-number {
  font-size: 8rem;
  font-weight: 900;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 1rem;
  text-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.dark-mode .error-number {
  text-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.error-icon {
  font-size: 3rem;
  color: var(--primary-color);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.error-title {
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-message {
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  background: var(--primary-hover);
}

.dark-mode .btn-primary:hover {
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
  border-color: var(--text-muted);
}

.helpful-links {
  text-align: left;
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 2rem;
  border: 1px solid var(--border-color);
}

.helpful-links h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.helpful-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.helpful-links li {
  margin-bottom: 0.5rem;
}

.helpful-links a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.helpful-links a:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .not-found {
    padding: 1rem;
  }
  
  .not-found-container {
    padding: 2rem;
    margin: 0;
  }
  
  .error-number {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>