<template>
  <div :class="isDarkMode ? 'dashboard-dark' : 'dashboard-light'" class="dashboard-container">
    <DashboardNavBar />
    <main class="dashboard-main">
      <!-- Floating Header -->
      <header class="floating-header">
        <div class="header-content">
          <div class="header-left">
            <div class="title-section">
              <h1 class="main-title">
                <span class="title-gradient">Exercícios</span>
              </h1>
              <p class="subtitle">Gerencie todos os exercícios disponíveis para seus planos de treino</p>
            </div>
          </div>
          <div class="header-right">
            <button class="create-button" @click="openCreateExerciseModal">
              <div class="button-glow"></div>
              <div class="button-content">
                <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                </svg>
                Novo Exercício
              </div>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="dashboard-content">
        <!-- Stats Section -->
        <section class="stats-section">
          <div class="stats-grid">
            <div class="stat-card stat-primary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <div class="stat-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="stat-trend">
                    <span class="trend-value">+12%</span>
                  </div>
                </div>
                <div class="stat-body">
                  <span class="stat-number">{{ exercisesStats.total }}</span>
                  <span class="stat-label">Total de Exercícios</span>
                </div>
              </div>
            </div>

            <div class="stat-card stat-secondary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <div class="stat-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                    </svg>
                  </div>
                  <div class="stat-trend">
                    <span class="trend-value">{{ exercisesStats.categories }}</span>
                  </div>
                </div>
                <div class="stat-body">
                  <span class="stat-number">{{ exercisesStats.categories }}</span>
                  <span class="stat-label">Categorias</span>
                </div>
              </div>
            </div>

            <div class="stat-card stat-tertiary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <div class="stat-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                    </svg>
                  </div>
                  <div class="stat-trend">
                    <span class="trend-value">Ativo</span>
                  </div>
                </div>
                <div class="stat-body">
                  <span class="stat-number">{{ exercisesStats.mostUsed }}</span>
                  <span class="stat-label">Mais Utilizados</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Filter Section -->
        <section class="filter-section">
          <div class="filter-card">
            <div class="search-area">
              <div class="search-wrapper">
                <div class="search-bg"></div>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  class="search-input" 
                  placeholder="Buscar exercícios..."
                  @input="filterExercises"
                />
                <div class="search-icon-wrapper">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="filter-tabs">
              <button 
                v-for="category in categories" 
                :key="category.id"
                :class="['filter-tab', { active: activeCategory === category.id }]"
                @click="filterByCategory(category.id)"
              >
                {{ category.name }}
                <span class="tab-count">{{ category.count }}</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Exercises Grid -->
        <section class="exercises-section">
          <div class="exercises-grid">
            <div 
              v-for="exercise in filteredExercises" 
              :key="exercise.id" 
              class="exercise-card"
            >
              <div class="card-background"></div>
              
              <!-- Exercise Header -->
              <div class="exercise-header">
                <div class="exercise-image">
                  <img :src="exercise.image || '/default-exercise.jpg'" :alt="exercise.name" />
                  <div class="image-overlay">
                    <button class="preview-btn" @click="previewExercise(exercise)">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="exercise-menu-wrapper">
                  <button 
                    class="menu-trigger" 
                    @click="toggleExerciseMenu(exercise.id)"
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </button>
                  
                  <div v-if="exercise.showMenu" class="dropdown-menu">
                    <button class="dropdown-option" @click="editExercise(exercise)">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                      </svg>
                      Editar
                    </button>
                    <button class="dropdown-option" @click="duplicateExercise(exercise)">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 7a1 1 0 000 2h6a1 1 0 100-2H7zM7 11a1 1 0 100 2h6a1 1 0 100-2H7zM7 15a1 1 0 100 2h6a1 1 0 100-2H7z"></path>
                      </svg>
                      Duplicar
                    </button>
                    <div class="dropdown-separator"></div>
                    <button class="dropdown-option danger" @click="deleteExercise(exercise)">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              </div>

              <!-- Exercise Info -->
              <div class="exercise-info">
                <h3 class="exercise-name">{{ exercise.name }}</h3>
                <p class="exercise-category">{{ exercise.category }}</p>
                <p class="exercise-description">{{ exercise.description }}</p>
              </div>

              <!-- Exercise Stats -->
              <div class="exercise-stats">
                <div class="stat-item">
                  <svg class="stat-icon" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="stat-value">{{ exercise.difficulty }}</span>
                </div>
                <div class="stat-item">
                  <svg class="stat-icon" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="stat-value">{{ exercise.duration || 'Variável' }}</span>
                </div>
                <div class="stat-item">
                  <svg class="stat-icon" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                  </svg>
                  <span class="stat-value">{{ exercise.usageCount || 0 }} planos</span>
                </div>
              </div>

              <!-- Exercise Actions -->
              <div class="exercise-actions">
                <button class="action-button secondary-action" @click="viewExerciseDetails(exercise)">
                  Ver Detalhes
                </button>
                <button class="action-button primary-action" @click="addToWorkout(exercise)">
                  Adicionar ao Treino
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredExercises.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="empty-title">Nenhum exercício encontrado</h3>
            <p class="empty-description">Não encontramos exercícios com os filtros aplicados.</p>
            <button class="create-first-button" @click="openCreateExerciseModal">
              Criar Primeiro Exercício
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";

export default {
  name: "ExercisesPage",
  components: { 
    DashboardNavBar
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    return { isDarkMode };
  },
  data() {
    return {
      searchQuery: '',
      activeCategory: 'all',
      exercisesStats: {
        total: 45,
        categories: 8,
        mostUsed: 12
      },
      categories: [
        { id: 'all', name: 'Todos', count: 45 },
        { id: 'chest', name: 'Peito', count: 8 },
        { id: 'back', name: 'Costas', count: 7 },
        { id: 'legs', name: 'Pernas', count: 12 },
        { id: 'arms', name: 'Braços', count: 6 },
        { id: 'shoulders', name: 'Ombros', count: 5 },
        { id: 'core', name: 'Core', count: 7 }
      ],
      exercises: [
        {
          id: 1,
          name: 'Supino Reto com Barra',
          category: 'Peito',
          description: 'Exercício fundamental para desenvolvimento do peitoral maior.',
          difficulty: 'Intermediário',
          duration: '45-60 seg',
          usageCount: 23,
          image: '/exercises/supino-reto.jpg',
          showMenu: false
        },
        {
          id: 2,
          name: 'Agachamento Livre',
          category: 'Pernas',
          description: 'Movimento composto para fortalecimento de quadríceps e glúteos.',
          difficulty: 'Intermediário',
          duration: '60-90 seg',
          usageCount: 31,
          image: '/exercises/agachamento.jpg',
          showMenu: false
        },
        {
          id: 3,
          name: 'Puxada Frontal',
          category: 'Costas',
          description: 'Exercício para desenvolvimento do latíssimo do dorso.',
          difficulty: 'Iniciante',
          duration: '45 seg',
          usageCount: 18,
          image: '/exercises/puxada-frontal.jpg',
          showMenu: false
        },
        {
          id: 4,
          name: 'Desenvolvimento com Halteres',
          category: 'Ombros',
          description: 'Fortalecimento dos deltoides anterior e medial.',
          difficulty: 'Intermediário',
          duration: '50 seg',
          usageCount: 15,
          image: '/exercises/desenvolvimento-halteres.jpg',
          showMenu: false
        }
      ],
      filteredExercises: []
    }
  },
  mounted() {
    this.filteredExercises = [...this.exercises];
  },
  methods: {
    openCreateExerciseModal() {
      console.log('Abrir modal de criação de exercício');
    },
    filterExercises() {
      this.applyFilters();
    },
    filterByCategory(categoryId) {
      this.activeCategory = categoryId;
      this.applyFilters();
    },
    applyFilters() {
      let filtered = [...this.exercises];
      
      // Filtrar por categoria
      if (this.activeCategory !== 'all') {
        const categoryMap = {
          'chest': 'Peito',
          'back': 'Costas', 
          'legs': 'Pernas',
          'arms': 'Braços',
          'shoulders': 'Ombros',
          'core': 'Core'
        };
        filtered = filtered.filter(exercise => 
          exercise.category === categoryMap[this.activeCategory]
        );
      }
      
      // Filtrar por busca
      if (this.searchQuery.trim()) {
        filtered = filtered.filter(exercise =>
          exercise.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          exercise.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          exercise.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      this.filteredExercises = filtered;
    },
    toggleExerciseMenu(exerciseId) {
      this.exercises.forEach(exercise => {
        exercise.showMenu = exercise.id === exerciseId ? !exercise.showMenu : false;
      });
    },
    previewExercise(exercise) {
      console.log('Visualizar exercício:', exercise);
    },
    editExercise(exercise) {
      console.log('Editar exercício:', exercise);
      exercise.showMenu = false;
    },
    duplicateExercise(exercise) {
      console.log('Duplicar exercício:', exercise);
      exercise.showMenu = false;
    },
    deleteExercise(exercise) {
      console.log('Excluir exercício:', exercise);
      exercise.showMenu = false;
    },
    viewExerciseDetails(exercise) {
      console.log('Ver detalhes do exercício:', exercise);
    },
    addToWorkout(exercise) {
      console.log('Adicionar ao treino:', exercise);
    }
  }
}
</script>

<style scoped>
/* Reusing the same base styles from workoutplans.vue */
* {
  box-sizing: border-box;
}

:root {
  --font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  margin-left: 80px;
  font-family: var(--font-family);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.dashboard-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-pattern);
  z-index: -1;
  opacity: 0.3;
}

.dashboard-main {
  flex: 1;
  padding: 0;
  background: var(--bg-primary);
  position: relative;
}

.dashboard-content {
  padding: 140px 40px 40px;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Theme Variables */
.dashboard-light {
  --bg-primary: #ffffff;
  --bg-secondary: rgba(248, 250, 252, 0.9);
  --bg-tertiary: rgba(255, 255, 255, 0.95);
  --bg-pattern: radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.1) 0%, transparent 50%);
  
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --text-accent: #475569;
  
  --border-primary: rgba(226, 232, 240, 0.8);
  --border-secondary: rgba(241, 245, 249, 0.6);
  --border-accent: rgba(37, 99, 235, 0.3);
  
  --gradient-primary: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --gradient-secondary: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  --gradient-tertiary: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  --gradient-accent: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(37, 99, 235, 0.15), 0 10px 10px -5px rgba(37, 99, 235, 0.1);
  
  --glass-bg: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.3);
  --glass-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
}

.dashboard-dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: rgba(15, 16, 23, 0.8);
  --bg-tertiary: rgba(26, 32, 44, 0.9);
  --bg-pattern: radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(192, 132, 252, 0.1) 0%, transparent 50%);
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-accent: #e2e8f0;
  
  --border-primary: rgba(51, 65, 85, 0.6);
  --border-secondary: rgba(30, 41, 59, 0.4);
  --border-accent: rgba(139, 92, 246, 0.3);
  
  --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --gradient-secondary: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  --gradient-tertiary: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
  --gradient-accent: linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(139, 92, 246, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.2);
  
  --glass-bg: rgba(15, 16, 23, 0.4);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
}

/* Floating Header */
.floating-header {
  position: fixed;
  top: 0;
  left: 80px;
  right: 0;
  z-index: 100;
  padding: 24px 40px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1600px;
  margin: 0 auto;
  gap: 32px;
}

.header-left {
  flex: 1;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.main-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.title-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  opacity: 0.9;
}

.header-right {
  display: flex;
  align-items: center;
}

.create-button {
  position: relative;
  padding: 16px 28px;
  border: none;
  border-radius: 16px;
  background: var(--gradient-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-lg);
}

.create-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.create-button:hover .button-glow {
  opacity: 1;
}

.button-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;
}

.button-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
}

/* Stats Section - Reusing from workoutplans */
.stats-section {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.stat-card {
  position: relative;
  background: var(--bg-secondary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  padding: 32px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border-color: var(--border-accent);
}

.stat-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 24px;
}

.stat-card.stat-primary .stat-background {
  background: var(--gradient-primary);
}

.stat-card.stat-secondary .stat-background {
  background: var(--gradient-secondary);
}

.stat-card.stat-tertiary .stat-background {
  background: var(--gradient-tertiary);
}

.stat-card:hover .stat-background {
  opacity: 0.05;
}

.stat-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.stat-card.stat-primary .stat-icon {
  background: var(--gradient-primary);
}

.stat-card.stat-secondary .stat-icon {
  background: var(--gradient-secondary);
}

.stat-card.stat-tertiary .stat-icon {
  background: var(--gradient-tertiary);
}

.stat-card:hover .stat-icon {
  transform: rotate(5deg) scale(1.1);
}

.stat-trend {
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
}

.trend-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
}

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Filter Section - Reusing from workoutplans */
.filter-section {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.filter-card {
  background: var(--bg-secondary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  gap: 32px;
  align-items: center;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  flex-wrap: wrap;
}

.search-area {
  flex: 1;
  min-width: 320px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-tertiary);
  border-radius: 16px;
  transition: all 0.3s ease;
  z-index: -1;
}

.search-input {
  width: 100%;
  padding: 18px 20px 18px 56px;
  border: 2px solid var(--border-primary);
  border-radius: 16px;
  background: transparent;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.search-input::placeholder {
  color: var(--text-tertiary);
  opacity: 0.8;
}

.search-input:focus {
  outline: none;
  border-color: var(--border-accent);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  transform: scale(1.02);
}

.dashboard-dark .search-input:focus {
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.search-input:focus + .search-bg {
  transform: scale(1.02);
  background: var(--glass-bg);
}

.search-icon-wrapper {
  position: absolute;
  left: 18px;
  z-index: 2;
  color: var(--text-tertiary);
  transition: all 0.3s ease;
}

.search-input:focus ~ .search-icon-wrapper {
  color: var(--text-accent);
}

.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tab {
  position: relative;
  padding: 14px 24px;
  border: 2px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.filter-tab:hover {
  transform: translateY(-2px);
  border-color: var(--border-accent);
  box-shadow: var(--shadow-lg);
}

.filter-tab.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Exercises Grid */
.exercises-section {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 28px;
  justify-content: center;
  align-items: stretch;
}

.exercise-card {
  position: relative;
  background: var(--bg-secondary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.exercise-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border-color: var(--border-accent);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-accent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.exercise-card:hover .card-background {
  opacity: 0.03;
}

.exercise-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0;
}

.exercise-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.exercise-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.exercise-card:hover .exercise-image img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.exercise-card:hover .image-overlay {
  opacity: 1;
}

.preview-btn {
  padding: 12px;
  border: 2px solid white;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.preview-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.exercise-menu-wrapper {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.menu-trigger {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.menu-trigger:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--bg-tertiary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  min-width: 160px;
  padding: 8px;
  animation: dropdownFade 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-option {
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dropdown-option:hover {
  background: var(--bg-primary);
  transform: translateX(2px);
}

.dropdown-option.danger {
  color: #ef4444;
}

.dropdown-option.danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.dropdown-separator {
  height: 1px;
  background: var(--border-primary);
  margin: 6px 0;
}

.exercise-info {
  position: relative;
  z-index: 1;
  padding: 20px 24px 16px;
  flex: 1;
}

.exercise-name {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.exercise-category {
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.exercise-description {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.exercise-stats {
  position: relative;
  z-index: 1;
  padding: 16px 24px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.stat-item .stat-icon {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.stat-value {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.exercise-actions {
  position: relative;
  z-index: 1;
  padding: 20px 24px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-primary);
  display: flex;
  gap: 12px;
}

.action-button {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

.primary-action {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

.secondary-action {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.action-button:hover {
  transform: translateY(-2px);
}

.primary-action:hover {
  box-shadow: var(--shadow-lg);
}

.secondary-action:hover {
  border-color: var(--border-accent);
  background: var(--bg-secondary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  color: var(--text-secondary);
}

.empty-icon {
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-title {
  margin: 0 0 12px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-description {
  margin: 0 0 32px 0;
  font-size: 1rem;
  line-height: 1.6;
}

.create-first-button {
  padding: 16px 32px;
  border: none;
  border-radius: 16px;
  background: var(--gradient-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.create-first-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Animations */
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 1200px) {
  .dashboard-container {
    margin-left: 0;
  }
  
  .floating-header {
    left: 0;
  }
  
  .exercises-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 140px 20px 20px;
    gap: 24px;
  }
  
  .floating-header {
    padding: 16px 20px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .filter-card {
    flex-direction: column;
    align-items: stretch;
    padding: 24px;
    gap: 24px;
  }
  
  .exercises-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.75rem;
  }
  
  .exercise-card {
    margin: 0 -4px;
  }
  
  .exercise-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>