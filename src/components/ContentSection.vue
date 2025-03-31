<template>
  <div :class="isDarkMode ? 'dark' : 'light'">
    
    <section class="hero">
      <div class="hero-content">
        <h1>Acompanhe o desempenho dos seus alunos ou o seu próprio progresso</h1>
        <p>Se você é um personal trainer, tenha uma visão clara do desenvolvimento de seus alunos. Se você é um aluno, monitore sua evolução e conquistas.</p>
        <button class="cta-button"><router-link to="/register">Criar Conta</router-link></button>
      </div>
      <div class="hero-image">
        <img src="https://via.placeholder.com/500x300" alt="Treinamento Fitness" />
      </div>
    </section>

    <section class="features">
      <div class="feature-card" v-for="feature in features" :key="feature.title">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
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

    const toggleTheme = () => {
      themeStore.toggleDarkMode();
    };

    return { isDarkMode, toggleTheme, features: [
      { title: 'Gestão de Alunos', description: 'Monitore e acompanhe o desempenho de cada aluno, ajustando treinos conforme necessário.' },
      { title: 'Seu Progresso', description: 'Registre e visualize seu desempenho diário, estabeleça metas e veja sua evolução.' },
      { title: 'Planos Personalizados', description: 'Receba ou crie treinos e dietas personalizados para alcançar seus objetivos.' }
    ] };
  }
};
</script>

<style scoped>
.light {
  --nav-bg: #f0f0f0;
  --text-color: #333;
  --hero-bg: linear-gradient(135deg, #ffffff, #87CEFA);
  --card-bg: #ffffff;
  background-color: var(--nav-bg);
  color: var(--text-color);
}

.dark {
  --nav-bg: #1a1a2e;
  --text-color: white;
  --hero-bg: linear-gradient(135deg, #2a0845, #6441a5);
  --card-bg: #222;
  background-color: var(--nav-bg);
  color: var(--text-color);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: var(--nav-bg);
}

.navbar .toggle-mode {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-color);
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80px 20px;
  background: var(--hero-bg);
}

.hero-content {
  max-width: 50%;
}

.cta-button {
  background-color: #ff5e99;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
}

.cta-button:hover {
  background-color: #d93d78;
}

.features {
  display: flex;
  justify-content: space-around;
  padding: 50px 20px;
}

.feature-card {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 10px;
  width: 30%;
  text-align: center;
  transition: 0.3s;
}

.feature-card h3 {
  font-size: 22px;
}

.feature-card p {
  margin: 10px 0;
}

.read-more {
  background: none;
  color: #ff5e99;
  border: 1px solid #ff5e99;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 5px;
}

.read-more:hover {
  background: #ff5e99;
  color: white;
}
</style>
