<template>
    <div :class="{ dark: isDarkMode, light: !isDarkMode }">
        <section class="hero">
        <div class="hero-content">
            <h1>Acompanhe o desempenho dos seus alunos ou o seu próprio progresso</h1>
            <p>Se você é um personal trainer, tenha uma visão clara do desenvolvimento de seus alunos. Se você é um aluno, monitore sua evolução e conquistas.</p>
            <button class="cta-button">Criar Conta</button>
        </div>
        <div class="hero-image">
            <img src="https://via.placeholder.com/500x300" alt="Treinamento Fitness" />
        </div>
        </section>

        <section class="features">
        <div class="feature-card">
            <h3>Gestão de Alunos</h3>
            <p>Monitore e acompanhe o desempenho de cada aluno, ajustando treinos conforme necessário.</p>
            <button class="read-more">Saiba mais</button>
        </div>
        <div class="feature-card">
            <h3>Seu Progresso</h3>
            <p>Registre e visualize seu desempenho diário, estabeleça metas e veja sua evolução.</p>
            <button class="read-more">Saiba mais</button>
        </div>
        <div class="feature-card">
            <h3>Planos Personalizados</h3>
            <p>Receba ou crie treinos e dietas personalizados para alcançar seus objetivos.</p>
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

            return { isDarkMode };
        }
    };
</script>

<style scoped>
/* Modo Claro/Escuro */
.light {
  background-color: #f0f0f0;
  color: #333;
}

.dark {
  background-color: #1a1a2e;
  color: white;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: #2c2c54;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
}

.nav-links li a {
  text-decoration: none;
  color: white;
  font-size: 16px;
}

.toggle-mode {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: white;
}

/* Hero Section */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #2a0845, #6441a5);
}

.hero-content {
  max-width: 50%;
}

.hero h1 {
  font-size: 36px;
  font-weight: bold;
}

.hero p {
  font-size: 18px;
  margin: 10px 0;
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

/* Imagem */
.hero-image img {
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
}

/* Features Section */
.features {
  display: flex;
  justify-content: space-around;
  padding: 50px 20px;
}

.feature-card {
  background: #222;
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
