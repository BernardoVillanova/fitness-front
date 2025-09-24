<template>
  <div class="student-history">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-history"></i>
        Histórico de Treinos
      </h1>
      <p class="page-subtitle">Visualize todos os seus treinos realizados</p>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label for="dateRange">Período:</label>
        <select v-model="selectedPeriod" @change="filterWorkouts" id="dateRange" class="filter-select">
          <option value="week">Última semana</option>
          <option value="month">Último mês</option>
          <option value="3months">Últimos 3 meses</option>
          <option value="6months">Últimos 6 meses</option>
          <option value="year">Último ano</option>
          <option value="all">Todo o período</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="workoutType">Tipo de Treino:</label>
        <select v-model="selectedType" @change="filterWorkouts" id="workoutType" class="filter-select">
          <option value="all">Todos os tipos</option>
          <option value="chest">Peito</option>
          <option value="back">Costas</option>
          <option value="legs">Pernas</option>
          <option value="arms">Braços</option>
          <option value="shoulders">Ombros</option>
          <option value="cardio">Cardio</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="sortBy">Ordenar por:</label>
        <select v-model="sortBy" @change="sortWorkouts" id="sortBy" class="filter-select">
          <option value="date-desc">Data (mais recente)</option>
          <option value="date-asc">Data (mais antigo)</option>
          <option value="duration-desc">Duração (maior)</option>
          <option value="duration-asc">Duração (menor)</option>
          <option value="difficulty-desc">Dificuldade (maior)</option>
          <option value="difficulty-asc">Dificuldade (menor)</option>
        </select>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="summary-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-dumbbell"></i>
        </div>
        <div class="stat-info">
          <h3>{{ filteredWorkouts.length }}</h3>
          <p>Treinos Realizados</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-info">
          <h3>{{ totalDuration }}h</h3>
          <p>Tempo Total</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-weight-hanging"></i>
        </div>
        <div class="stat-info">
          <h3>{{ totalVolume }}kg</h3>
          <p>Volume Total</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-fire"></i>
        </div>
        <div class="stat-info">
          <h3>{{ averageIntensity }}%</h3>
          <p>Intensidade Média</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando histórico...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredWorkouts.length === 0" class="empty-state">
      <i class="fas fa-calendar-times"></i>
      <h3>Nenhum treino encontrado</h3>
      <p>Não há treinos no período selecionado. Altere os filtros ou realize mais treinos!</p>
    </div>

    <!-- Workout History List -->
    <div v-else class="history-list">
      <div class="list-header">
        <h2>Histórico Detalhado</h2>
        <button @click="exportHistory" class="btn-secondary">
          <i class="fas fa-download"></i>
          Exportar
        </button>
      </div>

      <div class="workout-timeline">
        <div 
          v-for="workout in paginatedWorkouts" 
          :key="workout.id"
          class="workout-entry"
          :class="{ 'completed': workout.status === 'completed' }"
        >
          <div class="workout-date">
            <div class="date-circle">
              <span class="day">{{ getDay(workout.completedAt) }}</span>
              <span class="month">{{ getMonth(workout.completedAt) }}</span>
            </div>
          </div>
          
          <div class="workout-details">
            <div class="workout-header">
              <h3 class="workout-name">{{ workout.name }}</h3>
              <div class="workout-meta">
                <span class="duration">
                  <i class="fas fa-clock"></i>
                  {{ workout.actualDuration }}min
                </span>
                <span class="difficulty">
                  <i class="fas fa-fire"></i>
                  {{ workout.difficulty }}
                </span>
                <span class="status">
                  <i class="fas fa-check-circle"></i>
                  Concluído
                </span>
              </div>
            </div>
            
            <div class="workout-stats">
              <div class="stat-item">
                <span class="stat-label">Exercícios:</span>
                <span class="stat-value">{{ workout.exercises?.length || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Volume:</span>
                <span class="stat-value">{{ workout.totalVolume }}kg</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Intensidade:</span>
                <span class="stat-value">{{ workout.intensity }}%</span>
              </div>
            </div>

            <div class="workout-exercises" v-if="workout.showDetails">
              <h4>Exercícios Realizados:</h4>
              <div class="exercises-grid">
                <div 
                  v-for="exercise in workout.exercises" 
                  :key="exercise.id"
                  class="exercise-item"
                >
                  <div class="exercise-name">{{ exercise.name }}</div>
                  <div class="exercise-sets">
                    {{ exercise.completedSets }}x{{ exercise.reps }}
                    <span v-if="exercise.weight"> - {{ exercise.weight }}kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="workout-actions">
              <button 
                @click="toggleDetails(workout)"
                class="btn-text"
              >
                <i :class="workout.showDetails ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                {{ workout.showDetails ? 'Menos detalhes' : 'Mais detalhes' }}
              </button>
              <button @click="repeatWorkout(workout)" class="btn-primary">
                <i class="fas fa-redo"></i>
                Repetir Treino
              </button>
            </div>

            <div v-if="workout.notes" class="workout-notes">
              <i class="fas fa-sticky-note"></i>
              <span>{{ workout.notes }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <span class="pagination-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        
        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'StudentHistory',
  
  setup() {
    // Reactive data
    const loading = ref(true);
    const selectedPeriod = ref('month');
    const selectedType = ref('all');
    const sortBy = ref('date-desc');
    const currentPage = ref(1);
    const itemsPerPage = 10;
    
    // Mock workout history data
    const workoutHistory = ref([
      {
        id: 1,
        name: 'Treino A - Peito e Tríceps',
        type: 'chest',
        difficulty: 'Intermediário',
        completedAt: '2024-02-15',
        actualDuration: 65,
        totalVolume: 1250,
        intensity: 85,
        status: 'completed',
        notes: 'Ótimo treino! Consegui aumentar a carga no supino.',
        showDetails: false,
        exercises: [
          { id: 1, name: 'Supino Reto', completedSets: 4, reps: 12, weight: 60 },
          { id: 2, name: 'Supino Inclinado', completedSets: 3, reps: 10, weight: 50 },
          { id: 3, name: 'Crucifixo', completedSets: 3, reps: 12, weight: 20 },
          { id: 4, name: 'Tríceps Pulley', completedSets: 4, reps: 15, weight: 30 }
        ]
      },
      {
        id: 2,
        name: 'Treino B - Costas e Bíceps',
        type: 'back',
        difficulty: 'Intermediário',
        completedAt: '2024-02-13',
        actualDuration: 70,
        totalVolume: 1180,
        intensity: 80,
        status: 'completed',
        notes: '',
        showDetails: false,
        exercises: [
          { id: 5, name: 'Puxada Frente', completedSets: 4, reps: 12, weight: 45 },
          { id: 6, name: 'Remada Baixa', completedSets: 4, reps: 10, weight: 50 },
          { id: 7, name: 'Rosca Direta', completedSets: 3, reps: 12, weight: 15 },
          { id: 8, name: 'Rosca Martelo', completedSets: 3, reps: 10, weight: 12 }
        ]
      },
      {
        id: 3,
        name: 'Treino C - Pernas',
        type: 'legs',
        difficulty: 'Avançado',
        completedAt: '2024-02-11',
        actualDuration: 75,
        totalVolume: 1450,
        intensity: 90,
        status: 'completed',
        notes: 'Treino intenso, senti bastante as pernas trabalharem.',
        showDetails: false,
        exercises: [
          { id: 9, name: 'Agachamento', completedSets: 4, reps: 15, weight: 80 },
          { id: 10, name: 'Leg Press', completedSets: 4, reps: 12, weight: 120 },
          { id: 11, name: 'Cadeira Extensora', completedSets: 3, reps: 15, weight: 40 },
          { id: 12, name: 'Mesa Flexora', completedSets: 3, reps: 12, weight: 35 }
        ]
      }
    ]);
    
    // Computed properties
    const filteredWorkouts = computed(() => {
      let filtered = [...workoutHistory.value];
      
      // Filter by type
      if (selectedType.value !== 'all') {
        filtered = filtered.filter(workout => workout.type === selectedType.value);
      }
      
      // Filter by period (simplified for demo)
      // In a real app, you'd filter by actual dates
      
      return filtered;
    });
    
    const sortedWorkouts = computed(() => {
      const sorted = [...filteredWorkouts.value];
      
      switch (sortBy.value) {
        case 'date-desc':
          return sorted.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        case 'date-asc':
          return sorted.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
        case 'duration-desc':
          return sorted.sort((a, b) => b.actualDuration - a.actualDuration);
        case 'duration-asc':
          return sorted.sort((a, b) => a.actualDuration - b.actualDuration);
        default:
          return sorted;
      }
    });
    
    const totalPages = computed(() => {
      return Math.ceil(sortedWorkouts.value.length / itemsPerPage);
    });
    
    const paginatedWorkouts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return sortedWorkouts.value.slice(start, end);
    });
    
    const totalDuration = computed(() => {
      return Math.round(filteredWorkouts.value.reduce((total, workout) => total + workout.actualDuration, 0) / 60);
    });
    
    const totalVolume = computed(() => {
      return filteredWorkouts.value.reduce((total, workout) => total + workout.totalVolume, 0);
    });
    
    const averageIntensity = computed(() => {
      const total = filteredWorkouts.value.reduce((sum, workout) => sum + workout.intensity, 0);
      return filteredWorkouts.value.length > 0 ? Math.round(total / filteredWorkouts.value.length) : 0;
    });
    
    // Methods
    const filterWorkouts = () => {
      currentPage.value = 1; // Reset to first page when filtering
    };
    
    const sortWorkouts = () => {
      currentPage.value = 1; // Reset to first page when sorting
    };
    
    const toggleDetails = (workout) => {
      workout.showDetails = !workout.showDetails;
    };
    
    const repeatWorkout = (workout) => {
      console.log('Repeating workout:', workout.name);
      // In a real app, navigate to workout execution with this template
    };
    
    const exportHistory = () => {
      console.log('Exporting workout history...');
      // In a real app, generate and download CSV/PDF
    };
    
    const getDay = (dateStr) => {
      return new Date(dateStr).getDate().toString().padStart(2, '0');
    };
    
    const getMonth = (dateStr) => {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                     'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return months[new Date(dateStr).getMonth()];
    };
    
    // Lifecycle
    onMounted(() => {
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    });
    
    return {
      loading,
      selectedPeriod,
      selectedType,
      sortBy,
      currentPage,
      filteredWorkouts,
      paginatedWorkouts,
      totalPages,
      totalDuration,
      totalVolume,
      averageIntensity,
      filterWorkouts,
      sortWorkouts,
      toggleDetails,
      repeatWorkout,
      exportHistory,
      getDay,
      getMonth
    };
  }
};
</script>

<style scoped>
.student-history {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title i {
  color: var(--primary-color);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Filters */
.filters-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Summary Stats */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.stat-info p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

/* Loading and Empty States */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* History List */
.history-list {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.list-header h2 {
  margin: 0;
  color: var(--text-primary);
}

/* Workout Timeline */
.workout-timeline {
  position: relative;
}

.workout-timeline::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.workout-entry {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
}

.workout-date {
  flex-shrink: 0;
}

.date-circle {
  width: 60px;
  height: 60px;
  background: var(--bg-primary);
  border: 3px solid var(--primary-color);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.day {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.month {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
}

.workout-details {
  flex: 1;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.workout-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.workout-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.workout-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.workout-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.workout-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
}

/* Workout Exercises */
.workout-exercises {
  margin: 1rem 0;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.workout-exercises h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.exercise-item {
  padding: 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.exercise-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.exercise-sets {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Workout Actions */
.workout-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-text {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-text:hover {
  background: var(--bg-secondary);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

/* Workout Notes */
.workout-notes {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--info-bg);
  border: 1px solid var(--info-color);
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--info-color);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.pagination-btn {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-secondary);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .student-history {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .filters-section {
    grid-template-columns: 1fr;
  }

  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .list-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .workout-timeline::before {
    left: 15px;
  }

  .workout-entry {
    gap: 1rem;
  }

  .date-circle {
    width: 30px;
    height: 30px;
    font-size: 0.7rem;
  }

  .workout-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .workout-meta {
    flex-wrap: wrap;
  }

  .workout-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .exercises-grid {
    grid-template-columns: 1fr;
  }

  .workout-actions {
    flex-direction: column;
  }
}

/* CSS Variables */
:root {
  --primary-color: #6366f1;
  --primary-hover: #5856eb;
  --secondary-color: #8b5cf6;
  --success-color: #10b981;
  --success-bg: #d1fae5;
  --info-color: #3b82f6;
  --info-bg: #dbeafe;
  --warning-color: #f59e0b;
  --warning-bg: #fef3c7;
  --error-color: #ef4444;
  --error-bg: #fef2f2;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
</style>