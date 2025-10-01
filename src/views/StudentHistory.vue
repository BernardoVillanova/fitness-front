<template>
  <div class="student-history">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const selectedPeriod = ref('all')
const selectedType = ref('all')
const selectedWorkout = ref(null)

// Mock history data
const workoutHistory = ref([
  {
    id: 1,
    name: "Treino A - Peito e Tríceps",
    type: "Força",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 45,
    calories: 280,
    completion: 100,
    exercises: 7,
    exerciseDetails: [
      { id: 1, name: "Supino Reto", sets: 4, reps: 12, weight: 80 },
      { id: 2, name: "Supino Inclinado", sets: 3, reps: 10, weight: 70 },
      { id: 3, name: "Fly Máquina", sets: 3, reps: 15, weight: 50 },
      { id: 4, name: "Cross Over", sets: 3, reps: 12, weight: 25 },
      { id: 5, name: "Tríceps Pulley", sets: 4, reps: 12, weight: 40 },
      { id: 6, name: "Tríceps Francês", sets: 3, reps: 10, weight: 30 },
      { id: 7, name: "Mergulho", sets: 3, reps: 15 }
    ]
  },
  {
    id: 2,
    name: "Treino C - Pernas",
    type: "Força",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 55,
    calories: 380,
    completion: 90,
    exercises: 8,
    exerciseDetails: [
      { id: 1, name: "Agachamento Livre", sets: 4, reps: 12, weight: 100 },
      { id: 2, name: "Leg Press", sets: 4, reps: 15, weight: 200 },
      { id: 3, name: "Extensão de Pernas", sets: 3, reps: 15, weight: 60 },
      { id: 4, name: "Mesa Flexora", sets: 4, reps: 12, weight: 50 }
    ]
  },
  {
    id: 3,
    name: "Treino B - Costas e Bíceps",
    type: "Força",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: 50,
    calories: 320,
    completion: 100,
    exercises: 6,
    exerciseDetails: [
      { id: 1, name: "Puxada Frontal", sets: 4, reps: 12, weight: 60 },
      { id: 2, name: "Remada Curvada", sets: 4, reps: 10, weight: 70 },
      { id: 3, name: "Rosca Direta", sets: 3, reps: 12, weight: 20 }
    ]
  },
  {
    id: 4,
    name: "Cardio Intenso",
    type: "Cardio",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 30,
    calories: 250,
    completion: 100,
    exercises: 5
  },
  {
    id: 5,
    name: "Treino A - Peito e Tríceps",
    type: "Força",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    duration: 42,
    calories: 260,
    completion: 85,
    exercises: 7
  }
])

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
  // Initialize component
})
</script>

<style scoped>
.student-history {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
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

/* Filters */
.filters-section {
  max-width: 800px;
  margin: 0 auto 2rem;
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
  background: rgba(255,255,255,0.1);
  padding: 1.5rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  background: white;
  color: #2d3748;
  font-weight: 500;
  cursor: pointer;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.3);
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  background: rgba(255,255,255,0.2);
  color: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.clear-filters-btn:hover {
  background: rgba(255,255,255,0.3);
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
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.summary-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
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
  color: #2d3748;
  line-height: 1;
}

.summary-label {
  font-size: 0.9rem;
  color: #718096;
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
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.workout-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
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
  color: #2d3748;
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
  color: #718096;
}

.detail-item i {
  width: 14px;
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
  background: #c6f6d5;
  color: #22543d;
}

.completion-badge.partial {
  background: #fed7d7;
  color: #c53030;
}

.workout-type {
  font-size: 0.8rem;
  color: #718096;
  background: #f7fafc;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255,255,255,0.9);
  max-width: 400px;
  margin: 0 auto;
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

/* Modal */
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
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.close-btn {
  padding: 0.5rem;
  border: none;
  background: #f7fafc;
  color: #718096;
  border-radius: 8px;
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

.workout-summary {
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f7fafc;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row .label {
  font-weight: 600;
  color: #4a5568;
}

.summary-row .value {
  color: #2d3748;
}

.exercise-details h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
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
  background: #f8fafc;
  border-radius: 12px;
}

.exercise-name {
  font-weight: 500;
  color: #2d3748;
}

.exercise-stats {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #718096;
}

.exercise-stats span {
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e2e8f0;
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
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn.secondary:hover {
  background: #edf2f7;
}

/* Responsive */
@media (max-width: 768px) {
  .student-history {
    padding: 1rem 0.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .stats-summary {
    grid-template-columns: 1fr;
  }
  
  .history-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
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
    padding: 1rem;
  }
}
</style>