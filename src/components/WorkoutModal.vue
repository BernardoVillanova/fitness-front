<template>
  <!-- Modal de Execução do Treino -->
  <Transition name="modal">
    <div v-if="show && workoutSession" class="modal-overlay workout-modal-overlay" @click="handleOverlayClick">
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
                  :value="workoutSession.exercises[currentExerciseIndex].notes"
                  @input="updateExerciseNotes($event.target.value)"
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
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import api from '@/api'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  workoutSession: {
    type: Object,
    default: null
  },
  workoutStartTime: {
    type: Number,
    default: null
  }
})

// Emits
const emit = defineEmits([
  'close',
  'workout-finished',
  'progress-saved',
  'session-updated'
])

// Reactive data
const currentExerciseIndex = ref(0)
const showExerciseInfo = ref(false)
const selectedExerciseInfo = ref(null)
const loading = ref(false)

// Computed
const allExercisesCompleted = computed(() => {
  if (!props.workoutSession) return false
  return props.workoutSession.exercises.every(ex => ex.completed)
})

// Watchers
watch(() => props.show, (newValue) => {
  if (newValue) {
    // Reset para o primeiro exercício quando o modal abrir
    currentExerciseIndex.value = 0
    // Encontrar o primeiro exercício não completo
    const firstIncomplete = props.workoutSession?.exercises.findIndex(ex => !ex.completed)
    if (firstIncomplete !== -1) {
      currentExerciseIndex.value = firstIncomplete
    }
  }
})

// Methods
const formatWorkoutTime = () => {
  if (!props.workoutStartTime) return '00:00'
  const now = Date.now()
  const diff = now - props.workoutStartTime
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const getExerciseCompletedSets = (exercise) => {
  return exercise.sets.filter(set => set.completed).length
}

const toggleSetComplete = (exIndex, setIndex) => {
  // Criar uma cópia do workoutSession para não mutar props
  const updatedSession = { ...props.workoutSession }
  const set = updatedSession.exercises[exIndex].sets[setIndex]
  set.completed = !set.completed
  if (set.completed) {
    set.completedAt = new Date()
  } else {
    set.completedAt = null
  }
  
  // Emitir atualização da sessão
  emit('session-updated', updatedSession)
}

const updateExerciseNotes = (notes) => {
  // Criar uma cópia do workoutSession para não mutar props
  const updatedSession = { ...props.workoutSession }
  updatedSession.exercises[currentExerciseIndex.value].notes = notes
  
  // Emitir atualização da sessão
  emit('session-updated', updatedSession)
}

const markExerciseComplete = (exIndex) => {
  // Criar uma cópia do workoutSession para não mutar props
  const updatedSession = { ...props.workoutSession }
  const exercise = updatedSession.exercises[exIndex]
  exercise.completed = true
  exercise.sets.forEach(set => {
    set.completed = true
    if (!set.completedAt) {
      set.completedAt = new Date()
    }
  })
  
  // Atualizar contador
  updatedSession.completedExercises = updatedSession.exercises.filter(ex => ex.completed).length
  
  // Mover para próximo exercício
  if (exIndex < updatedSession.exercises.length - 1) {
    currentExerciseIndex.value = exIndex + 1
  }
  
  // Emitir atualização da sessão
  emit('session-updated', updatedSession)
}

const saveProgress = async () => {
  try {
    loading.value = true
    await api.put(`/student/sessions/${props.workoutSession._id}`, {
      exercises: props.workoutSession.exercises,
      notes: props.workoutSession.notes
    })
    
    emit('progress-saved')
    alert('Progresso salvo com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    alert('Erro ao salvar progresso')
  } finally {
    loading.value = false
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
    await api.post(`/student/sessions/${props.workoutSession._id}/complete`, {
      exercises: props.workoutSession.exercises,
      notes: props.workoutSession.notes
    })
    
    alert('Treino finalizado com sucesso! 🎉')
    emit('workout-finished')
  } catch (error) {
    console.error('Erro ao finalizar treino:', error)
    alert('Erro ao finalizar treino')
  } finally {
    loading.value = false
  }
}

const handleOverlayClick = () => {
  // Não fechar clicando fora durante treino
}

const confirmCloseWorkout = () => {
  if (confirm('Deseja sair? O progresso não salvo será perdido.')) {
    emit('close')
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
  if (currentExerciseIndex.value < props.workoutSession.exercises.length - 1) {
    currentExerciseIndex.value++
  }
}

const previousExercise = () => {
  if (currentExerciseIndex.value > 0) {
    currentExerciseIndex.value--
  }
}
</script>

<style scoped>
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

/* Workout Modal */
.workout-modal-overlay {
  background: rgba(0, 0, 0, 0.8);
}

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
@media (max-width: 768px) {
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

  .workout-footer-new {
    flex-direction: column;
  }
}
</style>