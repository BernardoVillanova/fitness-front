<template>
  <div class="student-history" :class="{ 'dark-mode': isDarkMode }">
    <StudentNavBar />
    <main class="main-content">
      <!-- Header -->
      <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">Histórico de Treinos</h1>
        <p class="page-subtitle">Veja todo seu progresso e treinos realizados</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Período:</label>
        <select v-model="selectedPeriod" class="filter-select">
          <option value="all">Todo o período</option>
          <option value="week">Última semana</option>
          <option value="month">Último mês</option>
          <option value="3months">Últimos 3 meses</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Tipo de Treino:</label>
        <select v-model="selectedType" class="filter-select">
          <option value="all">Todos os tipos</option>
          <option value="Força">Força</option>
          <option value="Cardio">Cardio</option>
          <option value="Flexibilidade">Flexibilidade</option>
        </select>
      </div>

      <button @click="clearFilters" class="clear-filters-btn">
        <i class="fas fa-times"></i>
        Limpar Filtros
      </button>
    </div>

    <!-- Stats Summary -->
    <div class="stats-summary">
      <div class="summary-card">
        <div class="summary-icon">
          <i class="fas fa-dumbbell"></i>
        </div>
        <div class="summary-details">
          <div class="summary-number">{{ filteredHistory.length }}</div>
          <div class="summary-label">Treinos Realizados</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="summary-details">
          <div class="summary-number">{{ totalTimeFormatted }}</div>
          <div class="summary-label">Tempo Total</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon">
          <i class="fas fa-fire"></i>
        </div>
        <div class="summary-details">
          <div class="summary-number">{{ totalCalories }}</div>
          <div class="summary-label">Calorias Queimadas</div>
        </div>
      </div>
    </div>

    <!-- History List -->
    <div v-if="filteredHistory.length === 0" class="empty-state">
      <i class="fas fa-history"></i>
      <h3>Nenhum treino encontrado</h3>
      <p>Não há treinos no período selecionado.</p>
    </div>

    <div v-else class="history-list">
      <div 
        v-for="workout in filteredHistory" 
        :key="workout.id"
        class="history-item"
        @click="selectWorkout(workout)"
      >
        <div class="workout-date">
          <div class="date-day">{{ formatDay(workout.date) }}</div>
          <div class="date-month">{{ formatMonth(workout.date) }}</div>
        </div>

        <div class="workout-info">
          <h3 class="workout-name">{{ workout.name }}</h3>
          <div class="workout-details">
            <span class="detail-item">
              <i class="fas fa-clock"></i>
              {{ workout.duration }}min
            </span>
            <span class="detail-item">
              <i class="fas fa-fire"></i>
              {{ workout.calories }}kcal
            </span>
            <span class="detail-item">
              <i class="fas fa-dumbbell"></i>
              {{ workout.exercises || 0 }} exercícios
            </span>
          </div>
        </div>

        <div class="workout-status">
          <div class="completion-badge" :class="workout.completion >= 100 ? 'completed' : 'partial'">
            {{ workout.completion }}%
          </div>
          <div class="workout-type">{{ workout.type }}</div>
        </div>
      </div>
    </div>

    <!-- Workout Details Modal -->
    <div v-if="selectedWorkout" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedWorkout.name }}</h2>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="workout-summary">
            <div class="summary-row">
              <span class="label">Data:</span>
              <span class="value">{{ formatFullDate(selectedWorkout.date) }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Duração:</span>
              <span class="value">{{ selectedWorkout.duration }} minutos</span>
            </div>
            <div class="summary-row">
              <span class="label">Calorias:</span>
              <span class="value">{{ selectedWorkout.calories }} kcal</span>
            </div>
            <div class="summary-row">
              <span class="label">Conclusão:</span>
              <span class="value">{{ selectedWorkout.completion }}%</span>
            </div>
          </div>

          <div v-if="selectedWorkout.exerciseDetails" class="exercise-details">
            <h4>Exercícios Realizados</h4>
            <div class="exercises-list">
              <div 
                v-for="exercise in selectedWorkout.exerciseDetails" 
                :key="exercise.id"
                class="exercise-item"
              >
                <div class="exercise-name">{{ exercise.name }}</div>
                <div class="exercise-stats">
                  <span v-if="exercise.sets">{{ exercise.sets }} séries</span>
                  <span v-if="exercise.reps">{{ exercise.reps }} reps</span>
                  <span v-if="exercise.weight">{{ exercise.weight }}kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn secondary">Fechar</button>
        </div>
      </div>
    </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/theme'
import StudentNavBar from '@/components/StudentNavBar.vue'
import api from '@/api'

// Theme
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

// Reactive data
const selectedPeriod = ref('all')
const selectedType = ref('all')
const selectedWorkout = ref(null)
const loading = ref(false)

// History data from API
const workoutHistory = ref([])

// Fetch workout history from API
const fetchWorkoutHistory = async () => {
  try {
    loading.value = true
    const response = await api.get('/student/sessions/history')
    
    if (response.data && Array.isArray(response.data)) {
      workoutHistory.value = response.data.map(session => ({
        id: session._id || session.id,
        name: session.workoutPlan?.name || session.name || 'Treino',
        type: session.workoutPlan?.type || session.type || 'Força',
        date: new Date(session.startTime || session.date),
        duration: session.duration || Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000) || 0,
        calories: session.caloriesBurned || 0,
        completion: session.completionPercentage || 
                   (session.completedExercises && session.totalExercises 
                     ? Math.round((session.completedExercises / session.totalExercises) * 100) 
                     : 0),
        exercises: session.exercises?.length || session.totalExercises || 0,
        exerciseDetails: session.exercises?.map(ex => ({
          id: ex._id || ex.id,
          name: ex.name || ex.exerciseName,
          sets: ex.sets || ex.completedSets,
          reps: ex.reps || ex.targetReps,
          weight: ex.weight || ex.targetWeight
        })) || []
      }))
    }
  } catch (error) {
    console.error('Erro ao buscar histórico de treinos:', error)
    // Keep empty array on error
    workoutHistory.value = []
  } finally {
    loading.value = false
  }
}

// Computed
const filteredHistory = computed(() => {
  let filtered = workoutHistory.value

  // Filter by period
  if (selectedPeriod.value !== 'all') {
    const now = new Date()
    const periodDays = {
      week: 7,
      month: 30,
      '3months': 90
    }
    const days = periodDays[selectedPeriod.value]
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
    filtered = filtered.filter(workout => workout.date >= cutoffDate)
  }

  // Filter by type
  if (selectedType.value !== 'all') {
    filtered = filtered.filter(workout => workout.type === selectedType.value)
  }

  return filtered.sort((a, b) => b.date - a.date)
})

const totalTimeFormatted = computed(() => {
  const totalMinutes = filteredHistory.value.reduce((sum, workout) => sum + workout.duration, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
})

const totalCalories = computed(() => {
  return filteredHistory.value.reduce((sum, workout) => sum + workout.calories, 0)
})

// Methods
const formatDay = (date) => {
  return new Date(date).getDate().toString().padStart(2, '0')
}

const formatMonth = (date) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return months[new Date(date).getMonth()]
}

const formatFullDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const selectWorkout = (workout) => {
  selectedWorkout.value = workout
}

const closeModal = () => {
  selectedWorkout.value = null
}

const clearFilters = () => {
  selectedPeriod.value = 'all'
  selectedType.value = 'all'
}

// Lifecycle
onMounted(() => {
  fetchWorkoutHistory()
})
</script>

<style scoped>
.student-history {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin: 0;
}

/* Filters */
.filters-section {
  max-width: 800px;
  margin: 0 auto 2rem;
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.dark-mode .filters-section {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  min-width: 150px;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .filter-select:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.clear-filters-btn:hover {
  background: var(--border-color);
}

/* Stats Summary */
.stats-summary {
  max-width: 800px;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.dark-mode .summary-card {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
}

.dark-mode .summary-card:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.summary-details {
  flex: 1;
}

.summary-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.summary-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

/* History List */
.history-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.dark-mode .history-item {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
  border-color: var(--primary-color);
}

.dark-mode .history-item:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.workout-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
}

.date-day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.workout-info {
  flex: 1;
}

.workout-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.workout-details {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.detail-item i {
  width: 14px;
  color: var(--primary-color);
}

.workout-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.completion-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.completion-badge.completed {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success-color);
}

.completion-badge.partial {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger-color);
}

.workout-type {
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--text-muted);
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.empty-state p {
  font-size: 1rem;
  color: var(--text-muted);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  max-width: 600px;
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
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.close-btn {
  padding: 0.5rem;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--border-color);
  color: var(--text-color);
}

.modal-body {
  padding: 2rem;
}

.workout-summary {
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row .label {
  font-weight: 600;
  color: var(--text-secondary);
}

.summary-row .value {
  color: var(--text-color);
}

.exercise-details h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exercise-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.exercise-name {
  font-weight: 500;
  color: var(--text-color);
}

.exercise-stats {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.exercise-stats span {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn.secondary:hover {
  background: var(--border-color);
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .student-history {
    flex-direction: column;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .clear-filters-btn {
    width: 100%;
    justify-content: center;
  }
  
  .stats-summary {
    grid-template-columns: 1fr;
  }
  
  .summary-card {
    padding: 1rem;
  }
  
  .history-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1rem;
  }
  
  .workout-date {
    min-width: auto;
  }
  
  .workout-info {
    order: 2;
  }
  
  .workout-status {
    order: 3;
    align-items: center;
  }
  
  .workout-details {
    justify-content: center;
  }
  
  .modal-content {
    margin: 0.5rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.5rem;
  }
  
  .exercise-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .exercise-stats {
    justify-content: center;
  }
}
</style>