<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="workout-plans">
    <!-- Enhanced Header with better typography -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">Meus Treinos</h1>
        <p class="page-subtitle">Escolha seu treino e comece a treinar</p>
      </div>
    </div>

    <!-- Enhanced Filter System -->
    <div class="filter-section">
      <div class="filter-tabs">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          :class="['filter-tab', { active: activeFilter === filter.value }]"
          @click="setFilter(filter.value)"
        >
          <i :class="filter.icon"></i>
          <span class="tab-text">{{ filter.label }}</span>
          <span v-if="filter.count" class="tab-count">{{ filter.count }}</span>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredWorkouts.length === 0" class="empty-state">
      <i class="fas fa-calendar-times"></i>
      <h3>Nenhum treino encontrado</h3>
      <p>Não há treinos disponíveis para o filtro selecionado.</p>
    </div>

    <!-- Enhanced Plans Grid -->
    <div v-else class="plans-section">
      <div class="plans-grid">
        <div 
          v-for="plan in filteredWorkouts" 
          :key="plan._id" 
          class="plan-card"
          @click="openWorkoutModal(plan)"
        >
          <div class="card-background"></div>
          
          <!-- Header com melhor organização -->
          <div class="plan-header">
            <div class="plan-title-section">
              <h3 class="plan-name">{{ plan.name }}</h3>
              <div class="plan-meta">
                <span class="plan-date">{{ formatDate(plan.createdAt) }}</span>
              </div>
            </div>
            
            <div class="plan-menu-wrapper" @click.stop>
              <button class="menu-trigger" @click="togglePlanMenu(plan._id)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="1"/>
                  <circle cx="12" cy="5" r="1"/>
                  <circle cx="12" cy="19" r="1"/>
                </svg>
              </button>
              
              <div v-if="openMenuId === plan._id" class="dropdown-menu">
                <button class="dropdown-item" @click="duplicatePlan(plan)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                  </svg>
                  Duplicar
                </button>
                
                <div class="dropdown-separator"></div>
                
                <button class="dropdown-item danger" @click="deletePlan(plan._id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                  Excluir
                </button>
              </div>
            </div>
          </div>

          <!-- Stats Grid Melhorado -->
          <div class="plan-stats">
            <div class="stat-item">
              <div class="stat-icon">
                <i class="fas fa-dumbbell"></i>
              </div>
              <div class="stat-details">
                <div class="stat-number-main">{{ plan.divisions.length }}</div>
                <div class="stat-label-main">Divisões</div>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div class="stat-details">
                <div class="stat-number-main">{{ plan.estimatedTime || 45 }}min</div>
                <div class="stat-label-main">Duração</div>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="stat-item">
              <div class="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 12l10 5 10-5"/>
                  <path d="M22 7l-10 5L2 7"/>
                </svg>
              </div>
              <div class="stat-details">
                <div class="stat-number-main">{{ plan.difficulty || 'Médio' }}</div>
                <div class="stat-label-main">Nível</div>
              </div>
            </div>
          </div>

          <!-- Progress bar melhorada -->
          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-label">Progresso</span>
              <span class="progress-percentage">{{ Math.round((plan.completedSessions || 0) / (plan.totalSessions || 12) * 100) }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: Math.round((plan.completedSessions || 0) / (plan.totalSessions || 12) * 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Action buttons melhorados -->
          <div class="card-actions">
            <button 
              class="action-btn primary" 
              @click.stop="startWorkout(plan)"
              :disabled="!!activeWorkoutSession"
            >
              <i class="fas fa-play"></i>
              {{ activeWorkoutSession ? 'Treino ativo' : 'Iniciar Treino' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Treino -->
    <div v-if="selectedWorkout" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedWorkout.name }}</h2>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="workout-overview">
            <div class="overview-stats">
              <div class="overview-stat">
                <i class="fas fa-clock"></i>
                <div>
                  <span class="stat-value">{{ selectedWorkout.estimatedTime }}</span>
                  <span class="stat-label">minutos</span>
                </div>
              </div>
              
              <div class="overview-stat">
                <i class="fas fa-fire"></i>
                <div>
                  <span class="stat-value">{{ selectedWorkout.estimatedCalories }}</span>
                  <span class="stat-label">calorias</span>
                </div>
              </div>
              
              <div class="overview-stat">
                <i class="fas fa-chart-line"></i>
                <div>
                  <span class="stat-value">{{ selectedWorkout.difficulty }}</span>
                  <span class="stat-label">dificuldade</span>
                </div>
              </div>
            </div>
            
            <div class="workout-description">
              <h4>Descrição</h4>
              <p>{{ selectedWorkout.fullDescription || selectedWorkout.description }}</p>
            </div>
          </div>

          <!-- Divisões com layout melhorado -->
          <div class="divisions-section">
            <h4 class="divisions-title">Divisões do Treino</h4>
            
            <div class="divisions-list">
              <div 
                v-for="(division, index) in selectedWorkout.divisions" 
                :key="index"
                class="division-card"
              >
                <div class="division-header">
                  <h5>{{ division.name }}</h5>
                  <span class="exercises-count">{{ division.exercises.length }} exercícios</span>
                </div>
                
                <div class="exercises-preview">
                  <div 
                    v-for="exercise in division.exercises.slice(0, 3)" 
                    :key="exercise.id"
                    class="exercise-preview"
                  >
                    <span class="exercise-name">{{ exercise.name }}</span>
                    <div class="exercise-specs">
                      <span v-if="exercise.sets" class="spec">{{ exercise.sets }}x{{ exercise.reps || exercise.duration }}</span>
                      <span v-if="exercise.weight" class="spec">{{ exercise.weight }}kg</span>
                      <span v-if="exercise.restTime" class="spec">{{ exercise.restTime }}s descanso</span>
                    </div>
                  </div>
                  
                  <div v-if="division.exercises.length > 3" class="more-exercises">
                    +{{ division.exercises.length - 3 }} exercícios
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn secondary">
            Fechar
          </button>
          <button 
            @click="startWorkout(selectedWorkout)" 
            class="btn primary"
            :disabled="!!activeWorkoutSession"
          >
            <i class="fas fa-play"></i>
            {{ activeWorkoutSession ? 'Treino ativo' : 'Iniciar Treino' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive data
const activeFilter = ref('all')
const selectedWorkout = ref(null)
const activeWorkoutSession = ref(null)
const openMenuId = ref(null)

// Mock data para desenvolvimento
const mockWorkouts = ref([
  {
    _id: 1,
    name: "Treino A - Peito e Tríceps",
    type: "Força",
    difficulty: "Intermediário",
    description: "Desenvolvimento do peitoral e tríceps",
    fullDescription: "Treino focado no desenvolvimento da musculatura do peitoral maior e menor, juntamente com o fortalecimento dos tríceps. Ideal para quem busca ganho de massa muscular na parte superior do corpo.",
    estimatedTime: 45,
    estimatedCalories: 280,
    lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    bestTime: 38,
    completedSessions: 8,
    totalSessions: 12,
    createdAt: new Date(),
    divisions: [
      {
        name: "Divisão A1 - Peito",
        exercises: [
          { id: 1, name: "Supino Reto", sets: 4, reps: 12, weight: 80, restTime: 90 },
          { id: 2, name: "Supino Inclinado", sets: 3, reps: 10, weight: 70, restTime: 90 },
          { id: 3, name: "Fly Máquina", sets: 3, reps: 15, weight: 50, restTime: 60 },
          { id: 4, name: "Cross Over", sets: 3, reps: 12, weight: 25, restTime: 60 }
        ]
      },
      {
        name: "Divisão A2 - Tríceps",
        exercises: [
          { id: 5, name: "Tríceps Pulley", sets: 4, reps: 12, weight: 40, restTime: 60 },
          { id: 6, name: "Tríceps Francês", sets: 3, reps: 10, weight: 30, restTime: 90 },
          { id: 7, name: "Mergulho", sets: 3, reps: 15, restTime: 60 }
        ]
      }
    ]
  },
  {
    _id: 2,
    name: "Treino B - Costas e Bíceps",
    type: "Força",
    difficulty: "Intermediário",
    description: "Desenvolvimento das costas e bíceps",
    fullDescription: "Treino completo para o desenvolvimento da musculatura das costas (latíssimo do dorso, romboides, trapézio) e bíceps. Foco em movimentos de puxada e rosca para ganho de força e massa muscular.",
    estimatedTime: 50,
    estimatedCalories: 320,
    lastCompleted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    bestTime: 45,
    completedSessions: 5,
    totalSessions: 12,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    divisions: [
      {
        name: "Divisão B1 - Costas",
        exercises: [
          { id: 8, name: "Puxada Frontal", sets: 4, reps: 12, weight: 60, restTime: 90 },
          { id: 9, name: "Remada Curvada", sets: 4, reps: 10, weight: 70, restTime: 90 },
          { id: 10, name: "Remada Sentado", sets: 3, reps: 12, weight: 50, restTime: 60 },
          { id: 11, name: "Pulley Costas", sets: 3, reps: 15, weight: 45, restTime: 60 }
        ]
      },
      {
        name: "Divisão B2 - Bíceps",
        exercises: [
          { id: 12, name: "Rosca Direta", sets: 3, reps: 12, weight: 20, restTime: 60 },
          { id: 13, name: "Rosca Martelo", sets: 3, reps: 10, weight: 18, restTime: 60 },
          { id: 14, name: "Rosca Concentrada", sets: 3, reps: 12, weight: 15, restTime: 45 }
        ]
      }
    ]
  },
  {
    _id: 3,
    name: "Treino C - Pernas",
    type: "Força",
    difficulty: "Avançado",
    description: "Treino completo de membros inferiores",
    fullDescription: "Treino intenso focado no desenvolvimento completo dos membros inferiores. Inclui exercícios para quadríceps, posteriores de coxa, glúteos e panturrilhas. Ideal para ganho de força e massa muscular nas pernas.",
    estimatedTime: 60,
    estimatedCalories: 400,
    lastCompleted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    bestTime: 55,
    completedSessions: 10,
    totalSessions: 12,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    divisions: [
      {
        name: "Divisão C1 - Quadríceps e Glúteos",
        exercises: [
          { id: 15, name: "Agachamento Livre", sets: 4, reps: 12, weight: 100, restTime: 120 },
          { id: 16, name: "Leg Press", sets: 4, reps: 15, weight: 200, restTime: 90 },
          { id: 17, name: "Extensão de Pernas", sets: 3, reps: 15, weight: 60, restTime: 60 },
          { id: 18, name: "Afundo", sets: 3, reps: 12, weight: 20, restTime: 60 }
        ]
      },
      {
        name: "Divisão C2 - Posteriores e Panturrilha",
        exercises: [
          { id: 19, name: "Mesa Flexora", sets: 4, reps: 12, weight: 50, restTime: 90 },
          { id: 20, name: "Stiff", sets: 3, reps: 10, weight: 60, restTime: 90 },
          { id: 21, name: "Panturrilha Sentado", sets: 4, reps: 20, weight: 40, restTime: 45 },
          { id: 22, name: "Panturrilha em Pé", sets: 4, reps: 15, weight: 80, restTime: 60 }
        ]
      }
    ]
  }
])

// Computed
const filters = computed(() => [
  { value: 'all', label: 'Todos', icon: 'fas fa-list', count: mockWorkouts.value.length },
  { value: 'Força', label: 'Força', icon: 'fas fa-dumbbell', count: mockWorkouts.value.filter(w => w.type === 'Força').length },
  { value: 'Cardio', label: 'Cardio', icon: 'fas fa-heartbeat', count: mockWorkouts.value.filter(w => w.type === 'Cardio').length },
  { value: 'recent', label: 'Recentes', icon: 'fas fa-clock', count: mockWorkouts.value.filter(w => isRecent(w.createdAt)).length }
])

const filteredWorkouts = computed(() => {
  if (activeFilter.value === 'all') return mockWorkouts.value
  if (activeFilter.value === 'recent') {
    return mockWorkouts.value.filter(workout => isRecent(workout.createdAt))
  }
  return mockWorkouts.value.filter(workout => workout.type === activeFilter.value)
})

// Methods
const setFilter = (filter) => {
  activeFilter.value = filter
  openMenuId.value = null
}

const isRecent = (date) => {
  const now = new Date()
  const workoutDate = new Date(date)
  const diffTime = Math.abs(now - workoutDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const togglePlanMenu = (planId) => {
  openMenuId.value = openMenuId.value === planId ? null : planId
}

const openWorkoutModal = (workout) => {
  selectedWorkout.value = workout
  openMenuId.value = null
}

const closeModal = () => {
  selectedWorkout.value = null
}

const startWorkout = (workout) => {
  if (activeWorkoutSession.value) return
  
  // Salvar dados da sessão no sessionStorage
  const workoutSession = {
    workoutId: workout._id,
    workoutName: workout.name,
    startTime: new Date().toISOString(),
    currentDivision: 0,
    currentExercise: 0,
    divisions: workout.divisions,
    completedExercises: []
  }
  
  sessionStorage.setItem('activeWorkoutSession', JSON.stringify(workoutSession))
  activeWorkoutSession.value = workoutSession
  
  // Fechar modal se estiver aberto
  closeModal()
  
  // Navegar para a página de sessão de treino
  router.push('/student/workout-session')
}

const duplicatePlan = (plan) => {
  console.log('Duplicating plan:', plan.name)
  openMenuId.value = null
  // Implementar lógica de duplicação
}

const deletePlan = (planId) => {
  if (confirm('Tem certeza que deseja excluir este treino?')) {
    const index = mockWorkouts.value.findIndex(w => w._id === planId)
    if (index > -1) {
      mockWorkouts.value.splice(index, 1)
    }
  }
  openMenuId.value = null
}

// Lifecycle
onMounted(() => {
  // Verificar se há sessão ativa
  const savedSession = sessionStorage.getItem('activeWorkoutSession')
  if (savedSession) {
    activeWorkoutSession.value = JSON.parse(savedSession)
  }
  
  // Fechar menus ao clicar fora
  document.addEventListener('click', () => {
    openMenuId.value = null
  })
})
</script>

<style scoped>
/* Estilos principais */
.workout-plans {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.header-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.9);
  margin: 0;
}

/* Filter System */
.filter-section {
  max-width: 800px;
  margin: 0 auto 2rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  background: rgba(255,255,255,0.1);
  padding: 0.5rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  overflow-x: auto;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.8);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: fit-content;
}

.filter-tab:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.filter-tab.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.tab-text {
  font-weight: 600;
}

.tab-count {
  background: rgba(102,126,234,0.2);
  color: inherit;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.filter-tab.active .tab-count {
  background: rgba(102,126,234,0.1);
}

/* Plans Grid */
.plans-section {
  max-width: 1200px;
  margin: 0 auto;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.plan-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  overflow: hidden;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.plan-title-section {
  flex: 1;
}

.plan-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.plan-meta {
  display: flex;
  gap: 1rem;
}

.plan-date {
  color: #718096;
  font-size: 0.9rem;
}

.plan-menu-wrapper {
  position: relative;
}

.menu-trigger {
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: #718096;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.menu-trigger:hover {
  background: #f7fafc;
  color: #4a5568;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border: 1px solid #e2e8f0;
  min-width: 160px;
  z-index: 10;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #4a5568;
}

.dropdown-item:hover {
  background: #f7fafc;
}

.dropdown-item.danger {
  color: #e53e3e;
}

.dropdown-item.danger:hover {
  background: #fed7d7;
}

.dropdown-separator {
  height: 1px;
  background: #e2e8f0;
  margin: 0.25rem 0;
}

/* Stats Grid */
.plan-stats {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 1rem;
}

.stat-details {
  flex: 1;
}

.stat-number-main {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
}

.stat-label-main {
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.25rem;
}

.divider {
  width: 1px;
  height: 30px;
  background: #e2e8f0;
  margin: 0 1rem;
}

/* Progress Section */
.progress-section {
  margin-bottom: 1.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.progress-percentage {
  font-weight: 700;
  color: #667eea;
  font-size: 0.9rem;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Action Buttons */
.card-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102,126,234,0.3);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255,255,255,0.9);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 1rem;
  opacity: 0.8;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.close-btn {
  padding: 0.5rem;
  border: none;
  background: #f7fafc;
  color: #718096;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #edf2f7;
  color: #4a5568;
}

.modal-body {
  padding: 2rem;
}

.workout-overview {
  margin-bottom: 2rem;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.overview-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.overview-stat i {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.stat-value {
  display: block;
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
}

.workout-description h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.workout-description p {
  color: #4a5568;
  line-height: 1.6;
}

/* Divisions Section */
.divisions-section {
  margin-top: 2rem;
}

.divisions-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.divisions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.division-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  background: #f8fafc;
}

.division-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.division-header h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.exercises-count {
  font-size: 0.9rem;
  color: #718096;
  background: white;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
}

.exercises-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exercise-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
}

.exercise-name {
  font-weight: 500;
  color: #2d3748;
}

.exercise-specs {
  display: flex;
  gap: 0.5rem;
}

.spec {
  font-size: 0.8rem;
  color: #718096;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.more-exercises {
  text-align: center;
  padding: 1rem;
  color: #718096;
  font-style: italic;
  background: white;
  border-radius: 8px;
  border: 2px dashed #e2e8f0;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn.secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn.secondary:hover {
  background: #edf2f7;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102,126,234,0.3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .workout-plans {
    padding: 1rem 0.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .plan-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-item {
    justify-content: center;
    text-align: center;
  }
  
  .divider {
    width: 100%;
    height: 1px;
    margin: 0;
  }
  
  .filter-tabs {
    padding: 0.25rem;
  }
  
  .filter-tab {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.5rem 1rem;
  }
  
  .overview-stats {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .plan-card {
    padding: 1rem;
  }
  
  .plan-name {
    font-size: 1.1rem;
  }
  
  .filter-tab {
    padding: 0.5rem;
  }
  
  .tab-text {
    display: none;
  }
  
  .filter-tab.active .tab-text {
    display: inline;
  }
}
</style>