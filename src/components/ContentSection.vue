<template>
  <div :class="isDarkMode ? 'dark' : 'light'">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Simplifique seu acompanhamento <br />e evolua de forma inteligente</h1>
        <p class="hero-subtitle">
          Personal trainers podem gerenciar facilmente seus alunos. Alunos podem monitorar seu próprio progresso de forma intuitiva.
        </p>
        <router-link to="/register" class="cta-button">Criar Conta</router-link>
      </div>
      <div class="hero-image">
        <img src="https://via.placeholder.com/500x300" alt="Dashboard Fitness" />
      </div>
    </section>

    <section class="benefits">
      <div class="benefit-card" v-for="benefit in benefits" :key="benefit.title">
        <div class="icon-container">
          <img :src="benefit.icon" alt="Ícone" class="icon" />
        </div>
        <h3>{{ benefit.title }}</h3>
        <p>{{ benefit.description }}</p>
        <button class="read-more">Saiba mais</button>
      </div>
    </section>
  </div>
</template>

<script>
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);

    return {
      isDarkMode,
      benefits: [
        { 
          title: 'Controle de Alunos', 
          description: 'Visualize o desempenho de cada aluno e ajuste planos de treino de forma rápida.', 
          icon: 'https://img.icons8.com/ios-filled/50/000000/user-group-man-man.png' 
        },
        { 
          title: 'Seu Próprio Progresso', 
          description: 'Registre suas atividades, veja gráficos e acompanhe sua evolução diária.', 
          icon: 'https://img.icons8.com/ios-filled/50/000000/combo-chart.png' 
        },
        { 
          title: 'Planos Personalizados', 
          description: 'Crie ou receba treinos e dietas feitas sob medida para seus objetivos.', 
          icon: 'https://img.icons8.com/ios-filled/50/000000/task.png' 
        },
        { 
          title: 'Acesso em Qualquer Lugar', 
          description: 'Use nosso site responsivo de qualquer dispositivo, onde estiver.', 
          icon: 'https://img.icons8.com/ios-filled/50/000000/cloud.png' 
        }
      ]
    };
  }
};
</script>

<style scoped>
/* Modo Light */
.light {
  --primary-color: #007bff;
  --background-color: #f9f9f9;
  --text-color: #333;
  --card-background: #fff;
}

/* Modo Dark */
.dark {
  --primary-color: #6441a5;
  --background-color: #121212;
  --text-color: #eee;
  --card-background: #1e1e1e;
}

.light, .dark {
  background-color: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
}

.hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  padding: 60px 20px;
  background: linear-gradient(135deg, var(--background-color), var(--primary-color));
  border-radius: 20px;
  margin: 20px;
}

.hero-content {
  max-width: 500px;
  text-align: left;
}

.hero-title {
  font-size: 40px;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 18px;
  margin-bottom: 30px;
}

.cta-button {
  background-color: var(--primary-color);
  color: #fff;
  padding: 12px 24px;
  font-size: 18px;
  border-radius: 10px;
  text-decoration: none;
  transition: 0.3s;
}

.cta-button:hover {
  opacity: 0.85;
}

.hero-image img {
  max-width: 500px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.benefits {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  padding: 50px 20px;
}

.benefit-card {
  background: var(--card-background);
  width: 280px;
  padding: 30px 20px;
  border-radius: 15px;
  text-align: center;
  transition: 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.icon-container {
  margin-bottom: 20px;
}

.icon {
  width: 50px;
  height: 50px;
  filter: brightness(0) saturate(100%) invert(30%) sepia(20%) saturate(500%) hue-rotate(180deg) brightness(90%) contrast(90%);
}

.benefit-card h3 {
  margin-bottom: 10px;
  font-size: 22px;
}

.benefit-card p {
  font-size: 16px;
  margin-bottom: 20px;
}

.read-more {
  background: none;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.read-more:hover {
  background: var(--primary-color);
  color: white;
}
</style>
