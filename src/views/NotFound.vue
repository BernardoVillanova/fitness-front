<template>
  <div class="not-found">
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

<script>
export default {
  name: 'NotFound',
  methods: {
    goHome() {
      this.$router.push('/');
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  padding: 2rem;
}

.not-found-container {
  text-align: center;
  max-width: 600px;
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.error-animation {
  margin-bottom: 2rem;
  position: relative;
}

.error-number {
  font-size: 8rem;
  font-weight: 900;
  color: #007bff;
  line-height: 1;
  margin-bottom: 1rem;
  text-shadow: 0 10px 30px rgba(0, 123, 255, 0.3);
}

.error-icon {
  font-size: 3rem;
  color: #0056b3;
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
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-message {
  font-size: 1.2rem;
  color: #718096;
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
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 123, 255, 0.3);
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.helpful-links {
  text-align: left;
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 2rem;
}

.helpful-links h3 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.1rem;
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
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.helpful-links a:hover {
  color: #0056b3;
}

@media (max-width: 768px) {
  .not-found-container {
    padding: 2rem;
    margin: 1rem;
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
}
</style>