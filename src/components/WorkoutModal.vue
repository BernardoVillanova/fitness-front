<template>
  <!-- Modal de Execução do Treino -->
  <Transition name="modal">
    <div v-if="show" class="modal-overlay workout-modal-overlay" @click="handleOverlayClick">
      <div v-if="workoutSession" class="modal-content workout-modal-new" @click.stop>
        
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
            <div v-if="workoutSession.exercises && workoutSession.exercises[currentExerciseIndex]" class="current-exercise">
              
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

              <!-- Imagem do Exercício -->
              <div class="exercise-image-container">
                <!-- Imagem do exercício -->
                <img 
                  v-if="workoutSession.exercises && workoutSession.exercises[currentExerciseIndex] && exerciseDetails[workoutSession.exercises[currentExerciseIndex].exerciseName]?.image"
                  :src="getImageUrl(exerciseDetails[workoutSession.exercises[currentExerciseIndex].exerciseName]?.image)" 
                  :alt="workoutSession.exercises[currentExerciseIndex].exerciseName"
                  class="exercise-image"
                />
                <!-- Placeholder -->
                <img 
                  v-else-if="workoutSession.exercises && workoutSession.exercises[currentExerciseIndex]"
                  :src="`https://via.placeholder.com/400x300/3b82f6/ffffff?text=${encodeURIComponent(workoutSession.exercises[currentExerciseIndex].exerciseName)}`" 
                  :alt="workoutSession.exercises[currentExerciseIndex].exerciseName"
                  class="exercise-image"
                />
                <div v-if="workoutSession.exercises && workoutSession.exercises[currentExerciseIndex]" class="image-overlay" @click="showExerciseDetails(workoutSession.exercises[currentExerciseIndex])">
                  <i class="fas fa-info-circle"></i>
                  Ver detalhes
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
      
      <!-- Fallback quando não há workout session -->
      <div v-else class="modal-content workout-modal-new" @click.stop>
        <div class="workout-header-compact">
          <div class="header-left">
            <h2>Carregando treino...</h2>
            <!-- Debug info (hidden) -->
            <div style="display: none;">{{ debugInfo }}</div>
          </div>
          <div class="header-right">
            <button @click="confirmCloseWorkout" class="btn-close-new">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="workout-body-new" style="padding: 2rem; text-align: center;">
          <p>Aguarde enquanto o treino é carregado...</p>
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
          
          <!-- Seção do Exercício -->
          <div class="info-section">
            <h3><i class="fas fa-dumbbell"></i> Sobre o Exercício</h3>
            <div v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]" class="exercise-info-grid">
              <div class="exercise-image-section">
                <img 
                  v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.image"
                  :src="getImageUrl(exerciseDetails[selectedExerciseInfo?.exerciseName]?.image)" 
                  :alt="selectedExerciseInfo?.exerciseName"
                  class="exercise-detail-image"
                />
                <div v-else class="image-placeholder">
                  <i class="fas fa-dumbbell"></i>
                  <p>Sem imagem disponível</p>
                </div>
              </div>
              <div class="exercise-text-section">
                <div class="exercise-meta-info">
                  <span v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.category" class="meta-badge">
                    {{ exerciseDetails[selectedExerciseInfo?.exerciseName]?.category }}
                  </span>
                  <span v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.difficulty" class="meta-badge difficulty">
                    {{ exerciseDetails[selectedExerciseInfo?.exerciseName]?.difficulty }}
                  </span>
                </div>
                <p v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.description">
                  {{ exerciseDetails[selectedExerciseInfo?.exerciseName]?.description }}
                </p>
                <p v-else-if="!exerciseDetails[selectedExerciseInfo?.exerciseName]?.description">
                  <em>Nenhuma descrição disponível para este exercício.</em>
                </p>
              </div>
            </div>
            <div v-else class="loading-message">
              <p>Carregando informações do exercício...</p>
            </div>
          </div>

          <!-- Seção do Equipamento -->
          <div class="info-section">
            <h3><i class="fas fa-cogs"></i> Equipamento</h3>
            <div v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId && equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]" class="equipment-info-grid">
              <div class="equipment-image-section">
                <img 
                  v-if="equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.image"
                  :src="getImageUrl(equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.image)" 
                  :alt="equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.name"
                  class="equipment-detail-image"
                />
                <div v-else class="image-placeholder">
                  <i class="fas fa-cogs"></i>
                  <p>Sem imagem disponível</p>
                </div>
              </div>
              <div class="equipment-text-section">
                <h4>{{ equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.name }}</h4>
                <p v-if="equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.description">
                  {{ equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.description }}
                </p>
                <p v-else>
                  <em>Nenhuma descrição disponível para este equipamento.</em>
                </p>
              </div>
            </div>
            <div v-else-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId">
              <p>Carregando informações do equipamento...</p>
            </div>
            <div v-else>
              <p><em>Este exercício não requer equipamento específico.</em></p>
            </div>
          </div>


          
          <!-- Vídeo Demonstrativo -->
          <div class="info-section" v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.videoUrl">
            <h3><i class="fas fa-play-circle"></i> Vídeo Demonstrativo</h3>
            <div class="video-demo-container">
              <div class="video-preview" @click="openVideoModal(exerciseDetails[selectedExerciseInfo?.exerciseName]?.videoUrl)">
                <div class="video-thumbnail">
                  <img 
                    :src="getYouTubeThumbnail(exerciseDetails[selectedExerciseInfo?.exerciseName]?.videoUrl)"
                    :alt="selectedExerciseInfo?.exerciseName"
                    class="video-thumb-image"
                    @error="handleThumbnailError"
                  />
                  <div class="video-play-overlay">
                    <i class="fas fa-play"></i>
                  </div>
                </div>
                <p class="video-description">Clique para assistir a demonstração em vídeo</p>
              </div>
            </div>
          </div>

          <!-- Instruções -->
          <div class="info-section" v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.howToPerform">
            <h3><i class="fas fa-list-ul"></i> Como Executar</h3>
            <div class="instructions-content">
              <p>{{ exerciseDetails[selectedExerciseInfo?.exerciseName]?.howToPerform }}</p>
            </div>
          </div>

          <!-- Como Usar o Equipamento -->
          <div class="info-section" v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId && equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.howToUse">
            <h3><i class="fas fa-tools"></i> Como Usar o Equipamento</h3>
            <div class="equipment-usage">
              <p>{{ equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.howToUse }}</p>
            </div>
          </div>
          
          <!-- Dicas de Segurança -->
          <div class="info-section" v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.safetyTips || equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.safetyTips">
            <h3><i class="fas fa-exclamation-triangle"></i> Dicas de Segurança</h3>
            <div class="safety-tips">
              <div v-if="exerciseDetails[selectedExerciseInfo?.exerciseName]?.safetyTips" class="safety-section">
                <h4>Exercício:</h4>
                <p>{{ exerciseDetails[selectedExerciseInfo?.exerciseName]?.safetyTips }}</p>
              </div>
              <div v-if="equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.safetyTips" class="safety-section">
                <h4>Equipamento:</h4>
                <p>{{ equipmentDetails[exerciseDetails[selectedExerciseInfo?.exerciseName]?.equipmentId]?.safetyTips }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de Vídeo -->
  <Transition name="modal">
    <div v-if="showVideoModal" class="modal-overlay video-modal-overlay" @click="closeVideoModal">
      <div class="modal-content video-modal" @click.stop>
        <div class="video-modal-header">
          <h2><i class="fas fa-play-circle"></i> Demonstração em Vídeo</h2>
          <button @click="closeVideoModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="video-modal-body">
          <div class="video-container" v-if="currentVideoUrl">
            <iframe 
              :src="getYouTubeEmbedUrl(currentVideoUrl)"
              frameborder="0"
              allowfullscreen
              class="video-iframe"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de Descanso -->
  <Transition name="modal">
    <div v-if="showRestModal" class="modal-overlay rest-modal-overlay">
      <div class="modal-content rest-modal" @click.stop>
        <div class="rest-modal-header">
          <h2><i class="fas fa-clock"></i> Tempo de Descanso</h2>
        </div>
        <div class="rest-modal-body">
          <div class="rest-timer-display">
            <div class="timer-circle">
              <div class="timer-number">{{ formatRestTime(restTimeRemaining) }}</div>
            </div>
          </div>
          <p class="rest-message">Descanse e prepare-se para a próxima série</p>
          <div class="rest-actions">
            <button @click="skipRest" class="btn-skip-rest">
              <i class="fas fa-forward"></i>
              Pular Descanso
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
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
const currentTime = ref(Date.now())
const timerInterval = ref(null)
const showRestModal = ref(false)
const restTimeRemaining = ref(0)
const restInterval = ref(null)
const exerciseDetails = ref({})
const equipmentDetails = ref({})
const showVideoModal = ref(false)
const currentVideoUrl = ref('')

// Computed
const allExercisesCompleted = computed(() => {
  if (!props.workoutSession) return false
  return props.workoutSession.exercises.every(ex => ex.completed)
})

const debugInfo = computed(() => {
  return {
    show: props.show,
    hasSession: !!props.workoutSession,
    session: props.workoutSession
  }
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
    
    // Iniciar timer
    startTimer()
    
    // Buscar detalhes dos exercícios
    if (props.workoutSession?.exercises) {
      props.workoutSession.exercises.forEach(ex => {
        fetchExerciseDetails(ex.exerciseName)
      })
    }
  } else {
    // Parar timer quando fechar modal
    stopTimer()
  }
})

// Lifecycle hooks
onMounted(() => {
  if (props.show) {
    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
  if (restInterval.value) {
    clearInterval(restInterval.value)
  }
})

// Methods
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `http://localhost:3000/${cleanPath}`;
}

const startTimer = () => {
  timerInterval.value = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const formatWorkoutTime = () => {
  if (!props.workoutStartTime) return '00:00'
  const diff = currentTime.value - props.workoutStartTime
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const fetchExerciseDetails = async (exerciseName) => {
  try {
    console.log('🔍 fetchExerciseDetails iniciado para:', exerciseName);
    
    // Buscar dados do usuário no sessionStorage
    let studentData
    try {
      studentData = JSON.parse(sessionStorage.getItem('user'))
      console.log('📋 Dados do usuário do sessionStorage:', studentData);
    } catch (e) {
      console.error('💥 Erro ao parsear dados do usuário:', e)
      return
    }
    
    // Buscar apenas dados reais da API
    if (studentData && studentData.id) {
      try {
        console.log('🔍 Buscando dados da API para exercício:', exerciseName);
        console.log('👤 Usando userId:', studentData.id);
        
        const studentResponse = await api.get(`/students/user/${studentData.id}`)
        console.log('✅ Resposta do /students/user:', studentResponse.data);
        
        const studentInfo = studentResponse.data
        const instructorId = studentInfo?.instructorId?._id || studentInfo?.instructorId || studentInfo?.assignedInstructor
        
        console.log('👨‍💼 InstructorId encontrado:', instructorId);
        
        if (instructorId) {
          console.log('🏋️‍♂️ Buscando exercícios do instrutor:', instructorId);
          const response = await api.get(`/exercises/instructor/${instructorId}`)
          console.log('📋 Resposta dos exercícios:', response.data);
          
          if (response.data.exercises && response.data.exercises.length > 0) {
            const exercise = response.data.exercises.find(ex => ex.name === exerciseName)
            console.log('🎯 Exercício encontrado:', exercise ? exercise.name : 'Não encontrado');
            
            if (exercise) {
              exerciseDetails.value[exerciseName] = exercise
              console.log('💾 Exercício salvo nos detalhes:', exerciseName);
              console.log('🎥 VideoUrl do exercício:', exercise.videoUrl || 'Nenhum');
              
              // Buscar equipamento se existir
              if (exercise.equipmentId) {
                try {
                  console.log('🔧 Buscando equipamento:', exercise.equipmentId);
                  const equipResponse = await api.get(`/equipments/${exercise.equipmentId}`);
                  console.log('✅ Resposta completa do equipamento:', equipResponse.data);
                  
                  // Verificar diferentes estruturas de resposta da API
                  let equipment = null;
                  if (equipResponse.data && equipResponse.data.equipment) {
                    equipment = equipResponse.data.equipment;
                    console.log('📦 Equipamento extraído da propriedade equipment');
                  } else if (equipResponse.data && equipResponse.data._id) {
                    equipment = equipResponse.data;
                    console.log('📦 Equipamento está diretamente na data');
                  } else if (equipResponse.data && typeof equipResponse.data === 'object') {
                    equipment = equipResponse.data;
                    console.log('📦 Equipamento como objeto direto');
                  }
                  
                  if (equipment && (equipment._id || equipment.id)) {
                    equipmentDetails.value[exercise.equipmentId] = equipment;
                    console.log('💾 Equipamento salvo nos detalhes:', equipment.name || 'Nome não disponível');
                    console.log('🔧 Dados do equipamento salvos:', {
                      id: equipment._id || equipment.id,
                      name: equipment.name,
                      description: equipment.description,
                      image: equipment.image
                    });
                  } else {
                    console.log('⚠️ Estrutura de equipamento não reconhecida:', equipResponse.data);
                  }
                } catch (equipError) {
                  console.error('💥 Erro ao buscar equipamento:', equipError.response?.status, equipError.message);
                }
              } else {
                console.log('ℹ️ Exercício não possui equipamento');
              }
            }
          } else {
            console.log('⚠️ Nenhum exercício encontrado para o instrutor');
          }
        } else {
          console.log('⚠️ Instrutor não encontrado para o aluno');
        }
      } catch (error) {
        console.error('💥 Erro ao buscar dados da API:', error)
        console.error('📝 Detalhes do erro:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
      }
    } else {
      console.log('⚠️ Dados do usuário não encontrados no sessionStorage');
    }
    
  } catch (error) {
    console.error('💥 Erro geral ao buscar detalhes do exercício:', error)
  }
}

const startRestTimer = (restTime) => {
  restTimeRemaining.value = restTime
  showRestModal.value = true
  
  restInterval.value = setInterval(() => {
    restTimeRemaining.value--
    if (restTimeRemaining.value <= 0) {
      clearInterval(restInterval.value)
      showRestModal.value = false
    }
  }, 1000)
}

const skipRest = () => {
  if (restInterval.value) {
    clearInterval(restInterval.value)
  }
  restTimeRemaining.value = 0
  showRestModal.value = false
}

const formatRestTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const getExerciseCompletedSets = (exercise) => {
  return exercise.sets.filter(set => set.completed).length
}

const toggleSetComplete = (exIndex, setIndex) => {
  // Criar uma cópia do workoutSession para não mutar props
  const updatedSession = { ...props.workoutSession }
  const set = updatedSession.exercises[exIndex].sets[setIndex]
  const wasCompleted = set.completed
  
  set.completed = !set.completed
  if (set.completed) {
    set.completedAt = new Date()
    
    // Se não era completado antes e agora é, iniciar timer de descanso
    if (!wasCompleted) {
      const exercise = updatedSession.exercises[exIndex]
      
      // Só mostrar timer de descanso se não for a última série do exercício
      const isLastSet = setIndex === exercise.sets.length - 1
      if (!isLastSet) {
        // Usar restTime do exercício ou padrão de 60 segundos
        const restTime = 60 // Você pode ajustar isso conforme necessário
        setTimeout(() => {
          startRestTimer(restTime)
        }, 500) // pequeno delay para a animação
      }
    }
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

const showExerciseDetails = async (exercise) => {
  selectedExerciseInfo.value = exercise
  
  // Buscar detalhes do exercício se ainda não temos
  if (!exerciseDetails.value[exercise.exerciseName]) {
    await fetchExerciseDetails(exercise.exerciseName)
  }
  
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

const openVideoModal = (videoUrl) => {
  currentVideoUrl.value = videoUrl
  showVideoModal.value = true
}

const closeVideoModal = () => {
  showVideoModal.value = false
  currentVideoUrl.value = ''
}

const getYouTubeEmbedUrl = (url) => {
  if (!url) return ''
  
  // Extrair ID do YouTube de diferentes formatos de URL
  let videoId = ''
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('youtube.com/watch?v=')[1].split('&')[0]
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0]
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1].split('?')[0]
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

const getYouTubeThumbnail = (url) => {
  if (!url) return ''
  
  // Extrair ID do YouTube de diferentes formatos de URL
  let videoId = ''
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('youtube.com/watch?v=')[1].split('&')[0]
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0]
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1].split('?')[0]
  }
  
  // Retornar thumbnail em alta qualidade do YouTube
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
}

const handleThumbnailError = (event) => {
  // Se a thumbnail em alta qualidade falhar, tentar a versão padrão
  const img = event.target
  const currentSrc = img.src
  
  if (currentSrc.includes('maxresdefault.jpg')) {
    // Tentar thumbnail padrão
    const videoId = currentSrc.split('/vi/')[1].split('/')[0]
    img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  } else if (currentSrc.includes('hqdefault.jpg')) {
    // Se até a padrão falhar, usar placeholder
    img.src = 'https://via.placeholder.com/480x360/3b82f6/ffffff?text=Vídeo+Indisponível'
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

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
  height: 200px;
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
  font-family: "Inter", sans-serif;
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
  max-width: 900px;
  max-height: 90vh;
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

/* Exercício Info Grid */
.exercise-info-grid,
.equipment-info-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.exercise-detail-image,
.equipment-detail-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.image-placeholder {
  width: 100%;
  height: 150px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-muted);
}

.image-placeholder i {
  font-size: 2rem;
  color: var(--primary-color);
}

.exercise-meta-info {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-badge {
  padding: 0.25rem 0.75rem;
  background: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.meta-badge.difficulty {
  background: var(--success-color);
}

.equipment-text-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.75rem 0;
}



/* Instructions and Safety */
.instructions-content,
.equipment-usage {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.safety-tips {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.safety-section {
  margin-bottom: 1rem;
}

.safety-section:last-child {
  margin-bottom: 0;
}

.safety-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.loading-message {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-style: italic;
}

/* Modal de Descanso */
.rest-modal-overlay {
  background: rgba(0, 0, 0, 0.9);
  z-index: 1100;
}

.rest-modal {
  max-width: 400px;
  background: var(--card-bg);
  border: 2px solid var(--primary-color);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

/* Modal de Vídeo */
.video-modal-overlay {
  background: rgba(0, 0, 0, 0.9);
  z-index: 1200;
}

.video-modal {
  max-width: 800px;
  width: 90vw;
  background: var(--card-bg);
  border: 2px solid var(--primary-color);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.video-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.video-modal-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.video-modal-header i {
  color: var(--primary-color);
}

.video-modal-body {
  padding: 0;
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  background: #000;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Preview de Vídeo */
.video-demo-container {
  width: 100%;
}

.video-preview {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.video-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.video-thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.video-thumb-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border-radius: 8px;
}

.video-thumb-placeholder i {
  font-size: 3rem;
  color: var(--primary-color);
}

.video-play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(59, 130, 246, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.video-preview:hover .video-play-overlay {
  background: var(--primary-color);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-description {
  padding: 1rem;
  text-align: center;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.rest-modal-header {
  text-align: center;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.rest-modal-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.rest-modal-header i {
  color: var(--primary-color);
}

.rest-modal-body {
  padding: 2rem;
  text-align: center;
}

.rest-timer-display {
  margin-bottom: 1.5rem;
}

.timer-circle {
  width: 120px;
  height: 120px;
  border: 4px solid var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: var(--bg-secondary);
  position: relative;
}

.timer-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
}

.rest-message {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.rest-actions {
  display: flex;
  justify-content: center;
}

.btn-skip-rest {
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

.btn-skip-rest:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
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

  /* Info Modal Responsive */
  .exercise-info-grid,
  .equipment-info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .exercise-detail-image,
  .equipment-detail-image {
    height: 200px;
  }

  .info-modal {
    max-width: 95vw;
    margin: 1rem;
  }

  .info-modal-body {
    padding: 1rem;
  }

  /* Rest Modal Responsive */
  .rest-modal {
    max-width: 90vw;
    margin: 1rem;
  }

  .timer-circle {
    width: 100px;
    height: 100px;
  }

  .timer-number {
    font-size: 1.5rem;
  }

  /* Video Modal Responsive */
  .video-modal {
    max-width: 95vw;
    margin: 1rem;
  }

  .video-modal-header {
    padding: 1rem;
  }

  .video-modal-header h2 {
    font-size: 1.1rem;
  }

  .video-thumbnail {
    height: 150px;
  }
}
</style>