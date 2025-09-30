<template>
  <div class="student-workouts">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-dumbbell"></i>
        Meus Treinos
      </h1>
      <p class="page-subtitle">Acompanhe e execute seus treinos personalizados</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando seus treinos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Erro ao carregar treinos</h3>
      <p>{{ error }}</p>
      <button @click="fetchWorkouts" class="btn-retry">
        <i class="fas fa-refresh"></i>
        Tentar Novamente
      </button>
    </div>

    <!-- Content -->
    <div v-else class="workouts-content">
      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stat-info">
            <h3>{{ completedWorkoutsThisWeek }}</h3>
            <p>Treinos esta semana</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-fire"></i>
          </div>
          <div class="stat-info">
            <h3>{{ currentStreak }}</h3>
            <p>Dias consecutivos</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="stat-info">
            <h3>{{ totalWorkouts }}</h3>
            <p>Total de treinos</p>
          </div>
        </div>
      </div>

      <!-- Today's Workout -->
      <div v-if="todaysWorkout" class="today-workout-section">
        <h2 class="section-title">
          <i class="fas fa-star"></i>
          Treino de Hoje
        </h2>
        <div class="workout-card featured">
          <div class="workout-header">
            <div class="workout-info">
              <h3>{{ todaysWorkout.name }}</h3>
              <p class="workout-meta">
                <span><i class="fas fa-clock"></i> {{ todaysWorkout.estimatedTime }} min</span>
                <span><i class="fas fa-fire"></i> {{ todaysWorkout.difficulty }}</span>
                <span><i class="fas fa-list"></i> {{ todaysWorkout.exercises?.length || 0 }} exercícios</span>
              </p>
            </div>
            <div class="workout-actions">
              <button @click="startWorkout(todaysWorkout)" class="btn-primary">
                <i class="fas fa-play"></i>
                Iniciar Treino
              </button>
            </div>
          </div>
          <div class="workout-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${todaysWorkout.progress || 0}%` }"></div>
            </div>
            <span class="progress-text">{{ todaysWorkout.progress || 0 }}% concluído</span>
          </div>
        </div>
      </div>

      <!-- Workout Plans -->
      <div class="workout-plans-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-clipboard-list"></i>
            Meus Planos de Treino
          </h2>
          <div class="filter-controls">
            <select v-model="selectedFilter" @change="filterWorkouts" class="filter-select">
              <option value="all">Todos os treinos</option>
              <option value="active">Ativos</option>
              <option value="completed">Concluídos</option>
              <option value="paused">Pausados</option>
            </select>
          </div>
        </div>

        <div v-if="filteredWorkouts.length === 0" class="empty-state">
          <i class="fas fa-clipboard"></i>
          <h3>Nenhum treino encontrado</h3>
          <p>Não há treinos disponíveis no momento. Entre em contato com seu instrutor.</p>
        </div>

        <div v-else class="workouts-grid">
          <div 
            v-for="workout in filteredWorkouts" 
            :key="workout.id"
            class="workout-card"
            :class="{ 'completed': workout.status === 'completed' }"
          >
            <div class="workout-header">
              <div class="workout-info">
                <h3>{{ workout.name }}</h3>
                <p class="workout-description">{{ workout.description }}</p>
                <div class="workout-meta">
                  <span><i class="fas fa-clock"></i> {{ workout.estimatedTime }} min</span>
                  <span><i class="fas fa-fire"></i> {{ workout.difficulty }}</span>
                  <span><i class="fas fa-list"></i> {{ workout.exercises?.length || 0 }} exercícios</span>
                </div>
              </div>
              <div class="workout-status">
                <span :class="['status-badge', workout.status]">
                  {{ getStatusText(workout.status) }}
                </span>
              </div>
            </div>

            <div class="workout-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${workout.progress || 0}%` }"></div>
              </div>
              <span class="progress-text">{{ workout.progress || 0 }}% concluído</span>
            </div>

            <div class="workout-actions">
              <button 
                v-if="workout.status === 'active'" 
                @click="startWorkout(workout)"
                class="btn-primary"
              >
                <i class="fas fa-play"></i>
                {{ workout.progress > 0 ? 'Continuar' : 'Iniciar' }}
              </button>
              <button 
                v-else-if="workout.status === 'completed'"
                @click="viewWorkoutDetails(workout)"
                class="btn-secondary"
              >
                <i class="fas fa-eye"></i>
                Ver Detalhes
              </button>
              <button 
                v-else
                @click="viewWorkoutDetails(workout)"
                class="btn-secondary"
              >
                <i class="fas fa-info-circle"></i>
                Detalhes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workout Modal -->
    <div v-if="showWorkoutModal" class="modal-overlay" @click="closeWorkoutModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedWorkout?.name }}</h2>
          <button @click="closeWorkoutModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="workout-details">
            <div class="detail-item">
              <strong>Duração:</strong> {{ selectedWorkout?.estimatedTime }} minutos
            </div>
            <div class="detail-item">
              <strong>Dificuldade:</strong> {{ selectedWorkout?.difficulty }}
            </div>
            <div class="detail-item">
              <strong>Descrição:</strong> {{ selectedWorkout?.description }}
            </div>
          </div>
          <div class="exercises-list">
            <h3>Exercícios ({{ selectedWorkout?.exercises?.length || 0 }})</h3>
            <div v-for="exercise in selectedWorkout?.exercises" :key="exercise.id" class="exercise-item">
              <div class="exercise-info">
                <h4>{{ exercise.name }}</h4>
                <p>{{ exercise.sets }}x{{ exercise.reps }} {{ exercise.weight ? `- ${exercise.weight}kg` : '' }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeWorkoutModal" class="btn-secondary">Fechar</button>
          <button v-if="selectedWorkout?.status === 'active'" @click="startWorkoutFromModal" class="btn-primary">
            <i class="fas fa-play"></i>
            Iniciar Treino
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
// import { useAuthStore } from '@/store/auth';
// import api from '@/api';

export default {
  name: 'StudentWorkouts',
  
  setup() {
    // const authStore = useAuthStore();
    
    // Reactive data
    const loading = ref(true);
    const error = ref(null);
    const workouts = ref([]);
    const selectedFilter = ref('all');
    const showWorkoutModal = ref(false);
    const selectedWorkout = ref(null);
    
    // Mock data for development
    const mockWorkouts = [
      {
        id: 1,
        name: 'Treino A - Peito e Tríceps',
        description: 'Foco no desenvolvimento do peitoral e tríceps',
        estimatedTime: 60,
        difficulty: 'Intermediário',
        status: 'active',
        progress: 75,
        exercises: [
          { id: 1, name: 'Supino Reto', sets: 4, reps: 12, weight: 60 },
          { id: 2, name: 'Supino Inclinado', sets: 3, reps: 10, weight: 50 },
          { id: 3, name: 'Crucifixo', sets: 3, reps: 12, weight: 20 },
          { id: 4, name: 'Tríceps Pulley', sets: 4, reps: 15, weight: 30 }
        ]
      },
      {
        id: 2,
        name: 'Treino B - Costas e Bíceps',
        description: 'Desenvolvimento da musculatura das costas e bíceps',
        estimatedTime: 65,
        difficulty: 'Intermediário',
        status: 'active',
        progress: 0,
        exercises: [
          { id: 5, name: 'Puxada Frente', sets: 4, reps: 12, weight: 45 },
          { id: 6, name: 'Remada Baixa', sets: 4, reps: 10, weight: 50 },
          { id: 7, name: 'Rosca Direta', sets: 3, reps: 12, weight: 15 },
          { id: 8, name: 'Rosca Martelo', sets: 3, reps: 10, weight: 12 }
        ]
      },
      {
        id: 3,
        name: 'Treino C - Pernas',
        description: 'Treino completo para membros inferiores',
        estimatedTime: 70,
        difficulty: 'Avançado',
        status: 'completed',
        progress: 100,
        exercises: [
          { id: 9, name: 'Agachamento', sets: 4, reps: 15, weight: 80 },
          { id: 10, name: 'Leg Press', sets: 4, reps: 12, weight: 120 },
          { id: 11, name: 'Cadeira Extensora', sets: 3, reps: 15, weight: 40 },
          { id: 12, name: 'Mesa Flexora', sets: 3, reps: 12, weight: 35 }
        ]
      }
    ];

    // Computed properties
    const filteredWorkouts = computed(() => {
      if (selectedFilter.value === 'all') return workouts.value;
      return workouts.value.filter(workout => workout.status === selectedFilter.value);
    });

    const todaysWorkout = computed(() => {
      return workouts.value.find(workout => 
        workout.status === 'active' && workout.progress < 100
      );
    });

    const completedWorkoutsThisWeek = computed(() => {
      return workouts.value.filter(workout => workout.status === 'completed').length;
    });

    const currentStreak = computed(() => {
      return 5; // Mock value
    });

    const totalWorkouts = computed(() => {
      return workouts.value.length;
    });

    // Methods
    const fetchWorkouts = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // In a real app, this would be an API call
        // const response = await api.get(`/students/${authStore.user.id}/workouts`);
        // workouts.value = response.data;
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        workouts.value = mockWorkouts;
        
      } catch (err) {
        error.value = 'Erro ao carregar treinos. Tente novamente.';
        console.error('Error fetching workouts:', err);
      } finally {
        loading.value = false;
      }
    };

    const filterWorkouts = () => {
      // Filter logic is handled by computed property
    };

    const startWorkout = (workout) => {
      // In a real app, navigate to workout execution page
      console.log('Starting workout:', workout.name);
      // this.$router.push(`/student/workout/${workout.id}/execute`);
    };

    const viewWorkoutDetails = (workout) => {
      selectedWorkout.value = workout;
      showWorkoutModal.value = true;
    };

    const closeWorkoutModal = () => {
      showWorkoutModal.value = false;
      selectedWorkout.value = null;
    };

    const startWorkoutFromModal = () => {
      startWorkout(selectedWorkout.value);
      closeWorkoutModal();
    };

    const getStatusText = (status) => {
      const statusMap = {
        'active': 'Ativo',
        'completed': 'Concluído',
        'paused': 'Pausado'
      };
      return statusMap[status] || 'Desconhecido';
    };

    // Lifecycle
    onMounted(() => {
      fetchWorkouts();
    });

    return {
      loading,
      error,
      workouts,
      selectedFilter,
      showWorkoutModal,
      selectedWorkout,
      filteredWorkouts,
      todaysWorkout,
      completedWorkoutsThisWeek,
      currentStreak,
      totalWorkouts,
      fetchWorkouts,
      filterWorkouts,
      startWorkout,
      viewWorkoutDetails,
      closeWorkoutModal,
      startWorkoutFromModal,
      getStatusText
    };
  }
};
</script>

<style scoped>
.student-workouts {
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

/* Loading and Error States */
.loading-container,
.error-container {
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

.error-container i {
  font-size: 3rem;
  color: var(--error-color);
  margin-bottom: 1rem;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Quick Stats */
.quick-stats {
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

/* Today's Workout */
.today-workout-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: var(--primary-color);
}

/* Workout Cards */
.workout-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.workout-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.workout-card.featured {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
}

.workout-card.completed {
  opacity: 0.8;
  border-color: var(--success-color);
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.workout-info h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.workout-description {
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
}

.workout-card.featured .workout-description {
  color: rgba(255,255,255,0.9);
}

.workout-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.workout-card.featured .workout-meta {
  color: rgba(255,255,255,0.9);
}

.workout-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: var(--success-bg);
  color: var(--success-color);
}

.status-badge.completed {
  background: var(--info-bg);
  color: var(--info-color);
}

.status-badge.paused {
  background: var(--warning-bg);
  color: var(--warning-color);
}

/* Progress Bar */
.workout-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.workout-card.featured .progress-bar {
  background: rgba(255,255,255,0.3);
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.workout-card.featured .progress-fill {
  background: white;
}

.progress-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 80px;
}

.workout-card.featured .progress-text {
  color: rgba(255,255,255,0.9);
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
}

/* Workouts Grid */
.workouts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

/* Empty State */
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

/* Workout Actions */
.workout-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
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
  padding: 2rem;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
}

.modal-close:hover {
  background: var(--bg-secondary);
}

.modal-body {
  padding: 1.5rem;
}

.workout-details {
  margin-bottom: 2rem;
}

.detail-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.exercises-list h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.exercise-item {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.exercise-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.exercise-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Responsive */
@media (max-width: 768px) {
  .student-workouts {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .quick-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .workouts-grid {
    grid-template-columns: 1fr;
  }

  .workout-header {
    flex-direction: column;
    gap: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .modal-overlay {
    padding: 1rem;
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
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
</style>