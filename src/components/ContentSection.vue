<template>
  <div :class="isDarkMode ? 'dark' : 'light'">
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-text">✨ Revolucionando o fitness</span>
        </div>
        <h1 class="hero-title">
          Simplifique seu acompanhamento <br />e evolua de forma
          <span class="gradient-text">inteligente</span>
        </h1>
        <p class="hero-subtitle">
          Personal trainers podem gerenciar facilmente seus alunos. Alunos podem
          monitorar seu próprio progresso de forma intuitiva.
        </p>
        <div class="cta-container">
          <router-link to="/register" class="cta-button primary">
            <span>Criar Conta</span>
            <svg
              class="arrow-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
        <div class="stats-container">
          <div class="stat-item">
            <span class="stat-number">1.2K+</span>
            <span class="stat-label">Alunos Ativos</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">45+</span>
            <span class="stat-label">Instrutores Parceiros</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">94%</span>
            <span class="stat-label">Taxa de Satisfação</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">15+</span>
            <span class="stat-label">Academias Parceiras</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="floating-cards">
          <div class="card card-1">
            <div class="card-icon">💪</div>
            <div class="card-content">
              <div class="card-title">Progresso Diário</div>
              <div class="card-value">+15%</div>
            </div>
          </div>
          <div class="card card-2">
            <div class="card-icon">📊</div>
            <div class="card-content">
              <div class="card-title">Meta Atingida</div>
              <div class="card-value">87/100</div>
            </div>
          </div>
          <div class="card card-3">
            <div class="card-icon">🔥</div>
            <div class="card-content">
              <div class="card-title">Constância</div>
              <div class="card-value">12 dias</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="benefits">
      <div
        class="benefit-card"
        v-for="benefit in benefits"
        :key="benefit.title"
      >
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
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);

    return {
      isDarkMode,
      benefits: [
        {
          title: "Controle de Alunos",
          description:
            "Visualize o desempenho de cada aluno e ajuste planos de treino de forma rápida.",
          icon: "https://img.icons8.com/ios-filled/50/000000/user-group-man-man.png",
        },
        {
          title: "Seu Próprio Progresso",
          description:
            "Registre suas atividades, veja gráficos e acompanhe sua evolução diária.",
          icon: "https://img.icons8.com/ios-filled/50/000000/combo-chart.png",
        },
        {
          title: "Planos Personalizados",
          description:
            "Crie ou receba treinos e dietas feitas sob medida para seus objetivos.",
          icon: "https://img.icons8.com/ios-filled/50/000000/task.png",
        },
      ],
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

.light {
  --primary-color: #2563eb;
  --primary-gradient: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --secondary-gradient: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  --accent-gradient: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  --background-color: #ffffff;
  --surface-color: #f8fafc;
  --card-background: rgba(255, 255, 255, 0.9);
  --text-color: #1e293b;
  --text-secondary: #64748b;
  --border-color: rgba(226, 232, 240, 0.8);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.15);
  --mockup-bg: rgba(255, 255, 255, 0.95);
  --mockup-border: rgba(226, 232, 240, 0.6);
}

.dark {
  --primary-color: #8b5cf6;
  --primary-gradient: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --secondary-gradient: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  --accent-gradient: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
  --background-color: #0a0a0a;
  --surface-color: #1a1a1a;
  --card-background: rgba(42, 42, 42, 0.8);
  --text-color: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.7);
  --mockup-bg: rgba(30, 30, 30, 0.95);
  --mockup-border: rgba(255, 255, 255, 0.1);
}

.light,
.dark {
  background-color: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow-x: hidden;
}

.light::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(37, 99, 235, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(59, 130, 246, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 40%,
      rgba(14, 165, 233, 0.2) 0%,
      transparent 50%
    );
  z-index: -1;
  animation: spinFloat 20s ease-in-out infinite;
  opacity: 0.3;
}

.dark::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(139, 92, 246, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(168, 85, 247, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 40%,
      rgba(192, 132, 252, 0.2) 0%,
      transparent 50%
    );
  z-index: -1;
  animation: spinFloat 20s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes spinFloat {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 80px;
  padding: 140px 40px 100px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  min-height: 80vh;
}

.hero-content {
  animation: slideInLeft 1s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  margin-bottom: 30px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.badge-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 30px;
  color: var(--text-color);
}

.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin-bottom: 50px;
  font-weight: 400;
  line-height: 1.7;
  max-width: 90%;
}

.cta-container {
  display: flex;
  gap: 20px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 18px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow);
  cursor: pointer;
  border: none;
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

.cta-button.primary {
  background: var(--primary-gradient);
  color: #ffffff;
}

.cta-button.secondary {
  background: var(--card-background);
  backdrop-filter: blur(20px);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.cta-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow-icon {
  transform: translateX(4px);
}

.stats-container {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Hero Visual */
.hero-visual {
  position: relative;
  height: 600px;
  animation: slideInRight 1s ease-out;
}

.floating-cards {
  position: relative;
  width: 100%;
  height: 100%;
}

.card {
  position: absolute;
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 240px;
  animation: floatCard 6s ease-in-out infinite;
}

.card-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.card-2 {
  top: 45%;
  right: 5%;
  animation-delay: 2s;
}

.card-3 {
  bottom: 15%;
  left: 20%;
  animation-delay: 4s;
}

.card-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--primary-gradient);
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 4px;
}

.card-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-color);
}

@keyframes floatCard {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Benefits Section */
.benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  padding: 100px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.benefit-card {
  background: var(--card-background);
  backdrop-filter: blur(20px);
  padding: 40px 30px;
  border-radius: 24px;
  text-align: center;
  font-family: "Inter", sans-serif;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.8s ease-out both;
}

.benefit-card:nth-child(1) {
  animation-delay: 0.1s;
}
.benefit-card:nth-child(2) {
  animation-delay: 0.2s;
}
.benefit-card:nth-child(3) {
  animation-delay: 0.3s;
}
.benefit-card:nth-child(4) {
  animation-delay: 0.4s;
}

.benefit-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.benefit-card:hover::before {
  transform: scaleX(1);
}

.benefit-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-color);
}

/* Sombras hover específicas por tema */
.light .benefit-card:nth-child(1):hover {
  background: var(--card-background);
  box-shadow: 0 35px 60px -12px rgba(37, 99, 235, 0.3);
}

.light .benefit-card:nth-child(2):hover {
  background: var(--card-background);
  box-shadow: 0 35px 60px -12px rgba(59, 130, 246, 0.3);
}

.light .benefit-card:nth-child(3):hover {
  background: var(--card-background);
  box-shadow: 0 35px 60px -12px rgba(14, 165, 233, 0.3);
}

.light .benefit-card:nth-child(4):hover {
  background: var(--card-background);
  box-shadow: 0 35px 60px -12px rgba(29, 78, 216, 0.3);
}

.dark .benefit-card:nth-child(1):hover {
  background: var(--card-background);
  box-shadow: 0 35px 60px -12px rgba(139, 92, 246, 0.3);
}

.dark .benefit-card:nth-child(2):hover {
  background: var(--card-background);
  box-shadow: 0 35px 60px -12px rgba(168, 85, 247, 0.3);
}

.dark .benefit-card:nth-child(3):hover {
  background: var(--card-background);
  box-shadow: 0 35px 60px -12px rgba(192, 132, 252, 0.3);
}

.dark .benefit-card:nth-child(4):hover {
  background: var(--card-background);
  box-shadow: 0 35px 60px -12px rgba(124, 58, 237, 0.3);
}

.icon-container {
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 18px;
  background: var(--primary-gradient);
  margin: 0 auto 25px;
  transition: all 0.3s ease;
}

.benefit-card:hover .icon-container {
  transform: scale(1.1) rotate(5deg);
}

.icon {
  width: 28px;
  height: 28px;
  filter: brightness(0) saturate(100%) invert(100%);
}

.benefit-card h3 {
  margin-bottom: 15px;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-color);
}

.benefit-card p {
  font-size: 0.95rem;
  margin-bottom: 25px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.read-more {
  background: transparent;
  border: 2px solid var(--border-color);
  color: var(--text-color);
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: inherit;
}

.read-more:hover {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

/* Animations originais */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 60px;
    text-align: center;
    padding: 120px 40px 80px;
  }

  .hero-visual {
    height: 400px;
  }

  .card {
    min-width: 200px;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 20px 60px;
    gap: 40px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    max-width: 100%;
  }

  .cta-container {
    flex-direction: column;
    align-items: center;
  }

  .cta-button {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .stats-container {
    justify-content: center;
    gap: 30px;
  }

  .hero-visual {
    height: 300px;
  }

  .card {
    min-width: 180px;
    padding: 16px;
  }

  .benefits {
    padding: 80px 20px;
    gap: 30px;
  }

  .benefit-card {
    padding: 30px 25px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .cta-button {
    padding: 16px 24px;
    font-size: 1rem;
  }

  .stats-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--surface-color);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-gradient);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}
</style>
