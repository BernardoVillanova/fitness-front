<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="student-workout-plans" :class="{ 'dark-mode': isDarkMode }">
    <StudentNavBar />
    
    <main class="main-content">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Meus Treinos</h1>
          <p class="page-subtitle">Escolha seu treino e comece a treinar</p>
        </div>
      </div>

      <!-- Active Session Alert -->
      <div v-if="activeSession" class="active-session-alert">
        <div class="alert-content">
          <div class="alert-icon">
            <i class="fas fa-dumbbell"></i>
          </div>
          <div class="alert-info">
            <h3>Treino em Andamento</h3>
            <p>{{ activeSession.workoutName }} - {{ activeSession.divisionName }}</p>
            <span class="alert-progress">{{ activeSession.completedExercises }}/{{ activeSession.totalExercises }} exercícios</span>
          </div>
          <div class="alert-actions">
            <button @click="continueWorkout" class="btn-continue">
              <i class="fas fa-play"></i>
              Continuar
            </button>
            <button @click="cancelWorkout" class="btn-cancel">
              <i class="fas fa-times"></i>
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
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
            <span v-if="filter.count !== undefined" class="tab-count">{{ filter.count }}</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando treinos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredWorkouts.length === 0" class="empty-state">
        <i class="fas fa-calendar-times"></i>
        <h3>Nenhum treino encontrado</h3>
        <p>Não há treinos disponíveis para o filtro selecionado.</p>
      </div>

      <!-- Plans Grid -->
      <div v-else class="plans-section">
        <div class="plans-grid">
          <div 
            v-for="plan in filteredWorkouts" 
            :key="plan._id" 
            :class="['plan-card', { 
              disabled: activeSession && activeSession.workoutPlanId !== plan._id,
              active: activeSession && activeSession.workoutPlanId === plan._id
            }]"
            @click="!activeSession || activeSession.workoutPlanId === plan._id ? openWorkoutModal(plan) : null"
          >
            <!-- Active Badge -->
            <div v-if="activeSession && activeSession.workoutPlanId === plan._id" class="active-badge">
              <i class="fas fa-circle"></i>
              Em Andamento
            </div>

            <!-- Header -->
            <div class="plan-header">
              <div class="plan-title-section">
                <h3 class="plan-name">{{ plan.name }}</h3>
                <div class="plan-meta">
                  <span class="plan-date">
                    <i class="fas fa-calendar"></i>
                    {{ formatDate(plan.createdAt) }}
                  </span>
                </div>
              </div>
              
              <div class="plan-badge" :class="getDifficultyClass(plan.difficulty)">
                {{ plan.difficulty || 'Médio' }}
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="plan-stats">
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-layer-group"></i>
                </div>
                <div class="stat-details">
                  <div class="stat-number">{{ plan.divisions?.length || 0 }}</div>
                  <div class="stat-label">Divisões</div>
                </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="stat-details">
                  <div class="stat-number">{{ plan.estimatedTime || 45 }}min</div>
                  <div class="stat-label">Duração</div>
                </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon">
                  <i class="fas fa-fire"></i>
                </div>
                <div class="stat-details">
                  <div class="stat-number">{{ plan.estimatedCalories || 0 }}</div>
                  <div class="stat-label">Calorias</div>
                </div>
              </div>
            </div>

            <!-- Progress Section -->
            <div class="progress-section">
              <div class="progress-header">
                <span class="progress-label">Progresso</span>
                <span class="progress-percentage">{{ calculateProgress(plan) }}%</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: calculateProgress(plan) + '%' }"
                ></div>
              </div>
              <div class="progress-info">
                <span>{{ plan.completedSessions || 0 }}/{{ plan.totalSessions || 12 }} sessões</span>
              </div>
            </div>

            <!-- Action Button -->
            <div class="card-actions">
              <button 
                class="action-btn primary" 
                @click.stop="activeSession && activeSession.workoutPlanId === plan._id ? continueWorkout() : selectDivision(plan)"
                :disabled="activeSession && activeSession.workoutPlanId !== plan._id"
              >
                <i :class="activeSession && activeSession.workoutPlanId === plan._id ? 'fas fa-play' : 'fas fa-dumbbell'"></i>
                {{ activeSession && activeSession.workoutPlanId === plan._id ? 'Continuar Treino' : 'Selecionar Divisão' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Seleção de Divisão -->
    <Transition name="modal">
      <div v-if="showDivisionModal && selectedWorkout" class="modal-overlay" @click="closeDivisionModal">
        <div class="modal-content division-modal" @click.stop>
          <div class="modal-header">
            <div>
              <h2>{{ selectedWorkout.name }}</h2>
              <p class="modal-subtitle">Escolha uma divisão para treinar</p>
            </div>
            <button @click="closeDivisionModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="divisions-grid">
              <div 
                v-for="(division, index) in selectedWorkout.divisions" 
                :key="index"
                class="division-card-select"
                @click="startWorkoutWithDivision(index)"
              >
                <div class="division-number-badge">{{ String(index + 1).padStart(2, '0') }}</div>
                <div class="division-content">
                  <h3>{{ division.name }}</h3>
                  <div class="division-info">
                    <span class="info-item">
                      <i class="fas fa-dumbbell"></i>
                      {{ division.exercises?.length || 0 }} exercícios
                    </span>
                    <span class="info-item">
                      <i class="fas fa-clock"></i>
                      ~{{ calculateDivisionTime(division) }}min
                    </span>
                  </div>
                </div>
                <i class="fas fa-chevron-right division-arrow"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Execução do Treino - Redesenhado -->
    <Transition name="modal">
      <div v-if="showWorkoutModal && workoutSession" class="modal-overlay workout-modal-overlay" @click="closeWorkoutModal">
        <div class="modal-content workout-modal-new" @click.stop>
          
          <!-- Header Compacto -->
          <div class="workout-header-compact">
            <div class="header-left">
              <h2>{{ workoutSession.workoutName }}</h2>
              <p>{{ workoutSession.divisionName }}</p>
            </div>
            <div class="header-right">
              <div class="timer-badge">
                <i class="fas fa-clock"></i>
                {{ formatWorkoutTime() }}
              </div>
              <div class="progress-badge">
                {{ workoutSession.completedExercises }}/{{ workoutSession.totalExercises }}
              </div>
              <button @click="confirmCloseWorkout" class="btn-close-new">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="workout-progress-bar">
            <div 
              class="workout-progress-fill" 
              :style="{ width: `${(workoutSession.completedExercises / workoutSession.totalExercises) * 100}%` }"
            ></div>
          </div>

          <!-- Body - Exercício Atual em Destaque -->
          <div class="workout-body-new">
            
            <!-- Lista de Exercícios (Sidebar) -->
            <div class="exercises-sidebar">
              <h3>Exercícios</h3>
              <div class="exercises-list">
                <div 
                  v-for="(exercise, index) in workoutSession.exercises"
                  :key="index"
                  :class="['exercise-item-mini', { 
                    active: currentExerciseIndex === index,
                    completed: exercise.completed 
                  }]"
                  @click="currentExerciseIndex = index"
                >
                  <div class="mini-number">{{ index + 1 }}</div>
                  <div class="mini-info">
                    <div class="mini-name">{{ exercise.exerciseName }}</div>
                    <div class="mini-sets">{{ getExerciseCompletedSets(exercise) }}/{{ exercise.sets.length }}</div>
                  </div>
                  <i v-if="exercise.completed" class="fas fa-check-circle mini-check"></i>
                </div>
              </div>
            </div>

            <!-- Exercício Atual (Main Content) -->
            <div class="exercise-main-content">
              <div v-if="workoutSession.exercises[currentExerciseIndex]" class="current-exercise">
                
                <!-- Header do Exercício -->
                <div class="current-exercise-header">
                  <div class="exercise-header-top">
                    <h2>{{ workoutSession.exercises[currentExerciseIndex].exerciseName }}</h2>
                    <button 
                      @click="showExerciseDetails(workoutSession.exercises[currentExerciseIndex])"
                      class="btn-info"
                    >
                      <i class="fas fa-info-circle"></i>
                      Como fazer
                    </button>
                  </div>
                  <div class="exercise-meta">
                    <span class="meta-item">
                      <i class="fas fa-list"></i>
                      {{ workoutSession.exercises[currentExerciseIndex].sets.length }} séries
                    </span>
                    <span class="meta-item">
                      <i class="fas fa-check-circle"></i>
                      {{ getExerciseCompletedSets(workoutSession.exercises[currentExerciseIndex]) }} concluídas
                    </span>
                  </div>
                </div>

                <!-- Imagem Placeholder do Exercício -->
                <div class="exercise-image-container">
                  <img 
                    :src="`https://via.placeholder.com/400x300/3b82f6/ffffff?text=${encodeURIComponent(workoutSession.exercises[currentExerciseIndex].exerciseName)}`" 
                    :alt="workoutSession.exercises[currentExerciseIndex].exerciseName"
                    class="exercise-image"
                  />
                  <div class="image-overlay">
                    <i class="fas fa-play-circle"></i>
                    Ver demonstração
                  </div>
                </div>

                <!-- Séries do Exercício -->
                <div class="sets-container">
                  <h3>Registrar Séries</h3>
                  <div class="sets-grid-new">
                    <div 
                      v-for="(set, setIndex) in workoutSession.exercises[currentExerciseIndex].sets"
                      :key="setIndex"
                      :class="['set-card', { completed: set.completed }]"
                    >
                      <div class="set-card-header">
                        <span class="set-label">Série {{ set.setNumber }}</span>
                        <button 
                          @click="toggleSetComplete(currentExerciseIndex, setIndex)"
                          :class="['btn-check-new', { checked: set.completed }]"
                        >
                          <i :class="set.completed ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                        </button>
                      </div>
                      <div class="set-card-body">
                        <div class="input-field-new">
                          <label>Repetições</label>
                          <input 
                            type="number" 
                            v-model.number="set.reps"
                            :disabled="set.completed"
                            placeholder="10"
                          />
                        </div>
                        <div class="input-field-new">
                          <label>Peso (kg)</label>
                          <input 
                            type="number" 
                            v-model.number="set.weight"
                            step="0.5"
                            :disabled="set.completed"
                            placeholder="20.0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Observações -->
                <div class="exercise-notes-new">
                  <label>
                    <i class="fas fa-sticky-note"></i>
                    Observações
                  </label>
                  <textarea 
                    v-model="workoutSession.exercises[currentExerciseIndex].notes"
                    placeholder="Como foi este exercício? Alguma dificuldade?"
                    rows="3"
                  ></textarea>
                </div>

                <!-- Navegação entre Exercícios -->
                <div class="exercise-navigation">
                  <button 
                    @click="previousExercise"
                    :disabled="currentExerciseIndex === 0"
                    class="btn-nav"
                  >
                    <i class="fas fa-chevron-left"></i>
                    Anterior
                  </button>
                  
                  <button 
                    v-if="!workoutSession.exercises[currentExerciseIndex].completed"
                    @click="markExerciseComplete(currentExerciseIndex)"
                    class="btn-complete-current"
                  >
                    <i class="fas fa-check"></i>
                    Concluir Exercício
                  </button>
                  <div v-else class="completed-indicator">
                    <i class="fas fa-check-circle"></i>
                    Exercício Concluído
                  </div>

                  <button 
                    @click="nextExercise"
                    :disabled="currentExerciseIndex === workoutSession.exercises.length - 1"
                    class="btn-nav"
                  >
                    Próximo
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer com Ações -->
          <div class="workout-footer-new">
            <button @click="saveProgress" class="btn-save-new">
              <i class="fas fa-save"></i>
              Salvar Progresso
            </button>
            <button 
              @click="finishWorkout"
              :disabled="!allExercisesCompleted"
              class="btn-finish-new"
            >
              <i class="fas fa-flag-checkered"></i>
              Finalizar Treino
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Informações do Exercício -->
    <Transition name="modal">
      <div v-if="showExerciseInfo" class="modal-overlay" @click="closeExerciseInfo">
        <div class="modal-content info-modal" @click.stop>
          <div class="info-modal-header">
            <h2>{{ selectedExerciseInfo?.exerciseName || 'Exercício' }}</h2>
            <button @click="closeExerciseInfo" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="info-modal-body">
            <div class="info-section">
              <h3><i class="fas fa-video"></i> Demonstração</h3>
              <div class="video-placeholder">
                <i class="fas fa-play-circle"></i>
                <p>Vídeo demonstrativo do exercício</p>
              </div>
            </div>
            <div class="info-section">
              <h3><i class="fas fa-list-ul"></i> Instruções</h3>
              <ol>
                <li>Posicione-se corretamente no equipamento</li>
                <li>Mantenha a postura adequada</li>
                <li>Execute o movimento de forma controlada</li>
                <li>Respire adequadamente durante o exercício</li>
              </ol>
            </div>
            <div class="info-section">
              <h3><i class="fas fa-exclamation-triangle"></i> Dicas Importantes</h3>
              <ul>
                <li>Não tranque os cotovelos</li>
                <li>Mantenha o core ativado</li>
                <li>Evite movimentos bruscos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/theme'
import StudentNavBar from '@/components/StudentNavBar.vue'
import api from '@/api'

// Stores
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

// Reactive data
const activeFilter = ref('all')
const selectedWorkout = ref(null)
const workoutSession = ref(null)
const activeSession = ref(null)
const workouts = ref([])
const loading = ref(false)
const showDivisionModal = ref(false)
const showWorkoutModal = ref(false)
const currentExerciseIndex = ref(0)
const workoutStartTime = ref(null)
const showExerciseInfo = ref(false)
const selectedExerciseInfo = ref(null)

// Computed
const filters = computed(() => [
  { value: 'all', label: 'Todos', icon: 'fas fa-list', count: workouts.value.length },
  { value: 'Força', label: 'Força', icon: 'fas fa-dumbbell', count: workouts.value.filter(w => w.type === 'Força').length },
  { value: 'Cardio', label: 'Cardio', icon: 'fas fa-heartbeat', count: workouts.value.filter(w => w.type === 'Cardio').length },
  { value: 'recent', label: 'Recentes', icon: 'fas fa-clock', count: workouts.value.filter(w => isRecent(w.createdAt)).length }
])

const filteredWorkouts = computed(() => {
  if (activeFilter.value === 'all') return workouts.value
  if (activeFilter.value === 'recent') {
    return workouts.value.filter(workout => isRecent(workout.createdAt))
  }
  return workouts.value.filter(workout => workout.type === activeFilter.value)
})

const allExercisesCompleted = computed(() => {
  if (!workoutSession.value) return false
  return workoutSession.value.exercises.every(ex => ex.completed)
})

// Methods
const setFilter = (filter) => {
  activeFilter.value = filter
}

const isRecent = (date) => {
  if (!date) return false
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
    month: 'short',
    year: 'numeric'
  })
}

const getDifficultyClass = (difficulty) => {
  const level = (difficulty || 'Médio').toLowerCase()
  if (level.includes('fácil') || level.includes('iniciante')) return 'easy'
  if (level.includes('médio') || level.includes('intermediário')) return 'medium'
  if (level.includes('difícil') || level.includes('avançado')) return 'hard'
  return 'medium'
}

const calculateProgress = (plan) => {
  const completed = plan.completedSessions || 0
  const total = plan.totalSessions || 12
  return Math.round((completed / total) * 100)
}

const calculateDivisionTime = (division) => {
  if (!division.exercises) return 30
  return Math.round(division.exercises.length * 5)
}

const formatWorkoutTime = () => {
  if (!workoutStartTime.value) return '00:00'
  const now = Date.now()
  const diff = now - workoutStartTime.value
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const getExerciseCompletedSets = (exercise) => {
  return exercise.sets.filter(set => set.completed).length
}

const fetchWorkouts = async () => {
  loading.value = true
  try {
    const response = await api.get('/student/workouts')
    workouts.value = response.data
  } catch (error) {
    console.error('Erro ao buscar treinos:', error)
    workouts.value = []
  } finally {
    loading.value = false
  }
}

const checkActiveSession = async () => {
  try {
    const response = await api.get('/student/sessions/active')
    if (response.data.hasActive) {
      activeSession.value = response.data.session
    }
  } catch (error) {
    console.error('Erro ao verificar sessão ativa:', error)
  }
}

const selectDivision = (workout) => {
  selectedWorkout.value = workout
  showDivisionModal.value = true
}

const closeDivisionModal = () => {
  showDivisionModal.value = false
  selectedWorkout.value = null
}

const startWorkoutWithDivision = async (divisionIndex) => {
  try {
    loading.value = true
    const response = await api.post('/student/sessions/start', {
      workoutPlanId: selectedWorkout.value._id,
      divisionIndex
    })
    
    workoutSession.value = response.data.session
    activeSession.value = response.data.session
    workoutStartTime.value = Date.now()
    currentExerciseIndex.value = 0 // Começar no primeiro exercício
    
    closeDivisionModal()
    showWorkoutModal.value = true
  } catch (error) {
    console.error('Erro ao iniciar treino:', error)
    alert(error.response?.data?.message || 'Erro ao iniciar treino')
  } finally {
    loading.value = false
  }
}

const continueWorkout = () => {
  workoutSession.value = activeSession.value
  workoutStartTime.value = new Date(activeSession.value.startTime).getTime()
  showWorkoutModal.value = true
}

const toggleSetComplete = (exIndex, setIndex) => {
  const set = workoutSession.value.exercises[exIndex].sets[setIndex]
  set.completed = !set.completed
  if (set.completed) {
    set.completedAt = new Date()
  } else {
    set.completedAt = null
  }
}

const markExerciseComplete = (exIndex) => {
  const exercise = workoutSession.value.exercises[exIndex]
  exercise.completed = true
  exercise.sets.forEach(set => {
    set.completed = true
    if (!set.completedAt) {
      set.completedAt = new Date()
    }
  })
  
  // Atualizar contador
  workoutSession.value.completedExercises = workoutSession.value.exercises.filter(ex => ex.completed).length
  
  // Mover para próximo exercício
  if (exIndex < workoutSession.value.exercises.length - 1) {
    currentExerciseIndex.value = exIndex + 1
  }
}

const saveProgress = async () => {
  try {
    await api.put(`/student/sessions/${workoutSession.value._id}`, {
      exercises: workoutSession.value.exercises,
      notes: workoutSession.value.notes
    })
    alert('Progresso salvo com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    alert('Erro ao salvar progresso')
  }
}

const finishWorkout = async () => {
  if (!allExercisesCompleted.value) {
    alert('Complete todos os exercícios antes de finalizar')
    return
  }
  
  if (!confirm('Deseja finalizar este treino?')) return
  
  try {
    loading.value = true
    await api.post(`/student/sessions/${workoutSession.value._id}/complete`, {
      exercises: workoutSession.value.exercises,
      notes: workoutSession.value.notes
    })
    
    alert('Treino finalizado com sucesso! 🎉')
    
    // Limpar estados
    workoutSession.value = null
    activeSession.value = null
    showWorkoutModal.value = false
    
    // Recarregar treinos
    await fetchWorkouts()
    await checkActiveSession()
  } catch (error) {
    console.error('Erro ao finalizar treino:', error)
    alert('Erro ao finalizar treino')
  } finally {
    loading.value = false
  }
}

const cancelWorkout = async () => {
  if (!confirm('Deseja cancelar este treino? O progresso será perdido.')) return
  
  try {
    loading.value = true
    await api.post(`/student/sessions/${activeSession.value._id}/cancel`)
    
    activeSession.value = null
    workoutSession.value = null
    showWorkoutModal.value = false
    
    await checkActiveSession()
  } catch (error) {
    console.error('Erro ao cancelar treino:', error)
    alert('Erro ao cancelar treino')
  } finally {
    loading.value = false
  }
}

const closeWorkoutModal = () => {
  // Não fechar clicando fora durante treino
}

const confirmCloseWorkout = () => {
  if (confirm('Deseja sair? O progresso não salvo será perdido.')) {
    showWorkoutModal.value = false
  }
}

const openWorkoutModal = (workout) => {
  if (activeSession.value && activeSession.value.workoutPlanId === workout._id) {
    continueWorkout()
  } else if (!activeSession.value) {
    selectDivision(workout)
  }
}

const showExerciseDetails = (exercise) => {
  selectedExerciseInfo.value = exercise
  showExerciseInfo.value = true
}

const closeExerciseInfo = () => {
  showExerciseInfo.value = false
  selectedExerciseInfo.value = null
}

const nextExercise = () => {
  if (currentExerciseIndex.value < workoutSession.value.exercises.length - 1) {
    currentExerciseIndex.value++
  }
}

const previousExercise = () => {
  if (currentExerciseIndex.value > 0) {
    currentExerciseIndex.value--
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchWorkouts(),
    checkActiveSession()
  ])
  
  // Atualizar timer a cada segundo
  setInterval(() => {
    if (showWorkoutModal.value && workoutStartTime.value) {
      // Force re-render para atualizar tempo
    }
  }, 1000)
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.student-workout-plans {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  transition: margin-left 0.3s ease;
}

/* Header */
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
}

/* Active Session Alert */
.active-session-alert {
  background: var(--primary-color);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .active-session-alert {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.alert-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.alert-info {
  flex: 1;
}

.alert-info h3 {
  color: white;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
}

.alert-info p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.25rem 0;
}

.alert-progress {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.alert-actions {
  display: flex;
  gap: 1rem;
}

.btn-continue,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-continue {
  background: white;
  color: var(--primary-color);
  border: none;
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.btn-cancel {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

/* Filter Section */
.filter-section {
  margin-bottom: 2rem;
}

.filter-tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 2px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-muted);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-tab:hover {
  border-color: var(--primary-color);
  color: var(--text-color);
  transform: translateY(-2px);
}

.filter-tab.active {
  background: var(--primary-color);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .filter-tab.active {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.plan-card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.plan-card:hover:not(.disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.plan-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.plan-card.active {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .plan-card.active {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.active-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #10b981;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.active-badge i {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.plan-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.plan-date {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.plan-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.plan-badge.easy {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.plan-badge.medium {
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
}

.plan-badge.hard {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.plan-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  font-size: 1rem;
}

.stat-number {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.progress-section {
  margin-bottom: 1.25rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.progress-percentage {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 0.85rem;
}

.progress-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.5s ease;
}

.progress-info {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.action-btn {
  width: 100%;
  padding: 0.875rem;
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
  background: var(--primary-color);
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  background: var(--primary-hover);
}

.dark-mode .action-btn.primary:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.division-modal {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.modal-subtitle {
  color: var(--text-muted);
  margin: 0.5rem 0 0 0;
}

.close-btn {
  padding: 0.5rem;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-muted);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--border-color);
  color: var(--text-color);
}

.modal-body {
  padding: 2rem;
}

.divisions-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.division-card-select {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.division-card-select:hover {
  border-color: var(--primary-color);
  transform: translateX(8px);
}

.division-number-badge {
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.division-content {
  flex: 1;
}

.division-content h3 {
  color: var(--text-color);
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.division-info {
  display: flex;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.division-arrow {
  color: var(--text-muted);
  font-size: 1.2rem;
}

/* Workout Modal */
.workout-modal-overlay {
  background: rgba(0, 0, 0, 0.8);
}

.workout-modal {
  max-width: 900px;
  max-height: 95vh;
}

.workout-modal-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: var(--primary-color);
  color: white;
  border-radius: 20px 20px 0 0;
}

.header-info {
  flex: 1;
}

.header-info h2 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
}

.header-info p {
  margin: 0;
  opacity: 0.9;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-pill {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.workout-modal-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.exercise-block {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.exercise-block.completed {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.exercise-block.current {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .exercise-block.current {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.exercise-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.exercise-number {
  width: 36px;
  height: 36px;
  background: var(--primary-color);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.exercise-title h3 {
  margin: 0 0 0.25rem 0;
  color: var(--text-color);
  font-size: 1.2rem;
}

.exercise-status {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.btn-complete-exercise {
  padding: 0.75rem 1.25rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-complete-exercise:hover {
  background: #059669;
  transform: translateY(-2px);
}

.completed-badge {
  background: #10b981;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sets-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

.set-item {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.set-item.completed {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.set-number {
  font-weight: 600;
  color: var(--text-color);
}

.btn-check-set {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--border-color);
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.btn-check-set:hover {
  color: var(--primary-color);
}

.btn-check-set.checked {
  color: var(--success-color);
}

.set-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.input-group input {
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
}

.input-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.exercise-notes textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-family: inherit;
  resize: vertical;
}

.workout-modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--border-color);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  background: var(--primary-hover);
}

.dark-mode .btn-primary:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .alert-content {
    flex-direction: column;
    text-align: center;
  }
  
  .alert-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .btn-continue,
  .btn-cancel {
    width: 100%;
    justify-content: center;
  }
  
  .plan-stats {
    grid-template-columns: 1fr;
  }
  
  .workout-modal-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-stats {
    width: 100%;
    flex-direction: column;
  }
  
  .set-inputs {
    grid-template-columns: 1fr;
  }
  
  .workout-modal-footer {
    flex-direction: column;
  }

  /* Novo Modal Responsivo */
  .workout-body-new {
    flex-direction: column;
  }

  .exercises-sidebar {
    width: 100%;
    max-height: 150px;
  }

  .exercises-list {
    flex-direction: row;
    overflow-x: auto;
  }

  .exercise-item-mini {
    min-width: 120px;
  }

  .exercise-main-content {
    width: 100%;
  }

  .sets-grid-new {
    grid-template-columns: 1fr;
  }

  .exercise-navigation {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-nav {
    width: 100%;
  }

  .btn-complete-current {
    width: 100%;
    order: -1;
  }
}

/* ============================================ */
/* NOVO DESIGN DO MODAL DE TREINO */
/* ============================================ */

.workout-modal-new {
  max-width: 1200px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
}

/* Header Compacto */
.workout-header-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.header-left h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.header-left p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.timer-badge,
.progress-badge {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timer-badge i {
  color: var(--primary-color);
}

.progress-badge {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-close-new {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close-new:hover {
  background: var(--border-color);
  color: var(--text-color);
}

/* Progress Bar */
.workout-progress-bar {
  height: 4px;
  background: var(--border-color);
  position: relative;
}

.workout-progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.5s ease;
}

/* Body - Layout com Sidebar */
.workout-body-new {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar de Exercícios */
.exercises-sidebar {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.exercises-sidebar h3 {
  padding: 1rem 1.25rem;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color);
}

.exercises-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.exercise-item-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  margin-bottom: 0.5rem;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.exercise-item-mini:hover {
  border-color: var(--primary-color);
  transform: translateX(4px);
}

.exercise-item-mini.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--primary-color);
}

.dark-mode .exercise-item-mini.active {
  background: rgba(102, 126, 234, 0.1);
}

.exercise-item-mini.completed {
  background: rgba(16, 185, 129, 0.05);
  border-color: var(--success-color);
}

.mini-number {
  width: 32px;
  height: 32px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.exercise-item-mini.completed .mini-number {
  background: var(--success-color);
}

.mini-info {
  flex: 1;
  min-width: 0;
}

.mini-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.mini-sets {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.mini-check {
  color: #10b981;
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* Main Content - Exercício Atual */
.exercise-main-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.current-exercise {
  max-width: 800px;
  margin: 0 auto;
}

/* Header do Exercício Atual */
.current-exercise-header {
  margin-bottom: 1.5rem;
}

.exercise-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.exercise-header-top h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.btn-info {
  padding: 0.625rem 1.25rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-color);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-info:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.exercise-meta {
  display: flex;
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.meta-item i {
  color: var(--primary-color);
}

/* Imagem do Exercício */
.exercise-image-container {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
  background: var(--bg-secondary);
}

.exercise-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-overlay:hover {
  background: linear-gradient(to top, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.7));
}

.image-overlay i {
  font-size: 2rem;
}

/* Séries */
.sets-container {
  margin-bottom: 2rem;
}

.sets-container h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.sets-grid-new {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.set-card {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.set-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.set-card.completed {
  background: rgba(16, 185, 129, 0.05);
  border-color: var(--success-color);
}

.set-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.875rem;
}

.set-label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.95rem;
}

.btn-check-new {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--border-color);
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-check-new:hover {
  color: var(--primary-color);
}

.btn-check-new.checked {
  color: var(--success-color);
}

.set-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-field-new {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-field-new label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.input-field-new input {
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.input-field-new input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--card-bg);
}

.input-field-new input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Observações */
.exercise-notes-new {
  margin-bottom: 2rem;
}

.exercise-notes-new label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.75rem;
}

.exercise-notes-new label i {
  color: var(--primary-color);
}

.exercise-notes-new textarea {
  width: 100%;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-color);
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  transition: all 0.2s ease;
}

.exercise-notes-new textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--card-bg);
}

.exercise-notes-new textarea::placeholder {
  color: var(--text-muted);
}

/* Navegação entre Exercícios */
.exercise-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-nav {
  padding: 0.875rem 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-color);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-nav:hover:not(:disabled) {
  background: var(--border-color);
  transform: translateX(0) translateY(-2px);
}

.btn-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-complete-current {
  padding: 0.875rem 2rem;
  background: var(--success-color);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-complete-current:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.completed-indicator {
  padding: 0.875rem 2rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid var(--success-color);
  border-radius: 12px;
  color: var(--success-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Footer com Ações */
.workout-footer-new {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
}

.btn-save-new,
.btn-finish-new {
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-save-new {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.btn-save-new:hover {
  background: var(--border-color);
}

.btn-finish-new {
  background: var(--primary-color);
  border: none;
  color: white;
}

.btn-finish-new:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
  background: var(--primary-hover);
}

.dark-mode .btn-finish-new:hover:not(:disabled) {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-finish-new:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal de Informações do Exercício */
.info-modal {
  max-width: 700px;
}

.info-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.info-modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.info-modal-body {
  padding: 2rem;
  max-height: 70vh;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 2rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.info-section h3 i {
  color: var(--primary-color);
}

.video-placeholder {
  width: 100%;
  height: 300px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--text-muted);
}

.video-placeholder i {
  font-size: 3rem;
  color: var(--primary-color);
}

.info-section ol,
.info-section ul {
  padding-left: 1.5rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.info-section li {
  margin-bottom: 0.75rem;
}
</style>
