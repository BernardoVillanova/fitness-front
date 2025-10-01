<template>
  <div class="workout-session" :class="{ 'dark-mode': isDarkMode }">
    <StudentNavBar />
    
    <div class="session-main">
      <!-- Header with Progress -->
      <div class="session-header">
        <div class="header-left">
          <button @click="pauseOrContinue" class="control-btn" :class="{ paused: isPaused }">
            <i :class="isPaused ? 'fas fa-play' : 'fas fa-pause'"></i>
          </button>
          <div class="workout-info">
            <h1 class="workout-name gradient-text">{{ workout?.name }}</h1>
          <div class="session-stats">
            <span class="timer">{{ formatTime(elapsedTime) }}</span>
            <span class="progress">{{ currentExerciseIndex + 1 }}/{{ workout?.exercises?.length || 0 }}</span>
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <button @click="showExerciseList = !showExerciseList" class="list-btn">
          <i class="fas fa-list"></i>
        </button>
        <button @click="confirmFinish" class="finish-btn">
          <i class="fas fa-stop"></i>
          Finalizar
        </button>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: ((currentExerciseIndex + 1) / (workout?.exercises?.length || 1)) * 100 + '%' }"
      ></div>
    </div>

    <!-- Exercise List Sidebar -->
    <div class="exercise-sidebar" :class="{ active: showExerciseList }">
      <div class="sidebar-header">
        <h3>Lista de Exercícios</h3>
        <button @click="showExerciseList = false" class="close-sidebar">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="exercise-list">
        <div 
          v-for="(exercise, index) in workout?.exercises" 
          :key="exercise.id"
          class="exercise-item"
          :class="{ 
            current: index === currentExerciseIndex,
            completed: completedExercises.includes(index),
            upcoming: index > currentExerciseIndex
          }"
          @click="jumpToExercise(index)"
        >
          <div class="exercise-number">{{ index + 1 }}</div>
          <div class="exercise-details">
            <span class="exercise-name">{{ exercise.name }}</span>
            <span class="exercise-sets">{{ exercise.sets }}x{{ exercise.reps }}</span>
          </div>
          <div class="exercise-status">
            <i v-if="completedExercises.includes(index)" class="fas fa-check"></i>
            <i v-else-if="index === currentExerciseIndex" class="fas fa-play"></i>
            <i v-else class="fas fa-clock"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="session-content" :class="{ 'sidebar-open': showExerciseList }">
      <div v-if="currentExercise" class="exercise-container">
        <!-- Exercise Header -->
        <div class="exercise-header">
          <h2 class="exercise-title">{{ currentExercise.name }}</h2>
          <div class="exercise-meta">
            <span class="sets-info">
              <i class="fas fa-repeat"></i>
              {{ currentSet }}/{{ currentExercise.sets }} séries
            </span>
            <span class="reps-info">
              <i class="fas fa-hashtag"></i>
              {{ currentExercise.reps }} repetições
            </span>
            <span v-if="currentExercise.weight" class="weight-info">
              <i class="fas fa-weight-hanging"></i>
              {{ currentExercise.weight }}kg
            </span>
          </div>
        </div>

        <!-- Exercise Instructions -->
        <div v-if="currentExercise.instructions" class="exercise-instructions">
          <h3>Como Executar:</h3>
          <p>{{ currentExercise.instructions }}</p>
        </div>

        <!-- Set Tracking -->
        <div class="set-tracking">
          <h3>Registrar Série {{ currentSet }}</h3>
          
          <div class="input-group">
            <label>Repetições Realizadas:</label>
            <div class="counter">
              <button @click="adjustReps(-1)" class="counter-btn">
                <i class="fas fa-minus"></i>
              </button>
              <input 
                v-model.number="currentReps" 
                type="number" 
                class="counter-input"
                :min="0"
              />
              <button @click="adjustReps(1)" class="counter-btn">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <div v-if="currentExercise.weight" class="input-group">
            <label>Peso Utilizado (kg):</label>
            <div class="counter">
              <button @click="adjustWeight(-2.5)" class="counter-btn">
                <i class="fas fa-minus"></i>
              </button>
              <input 
                v-model.number="currentWeight" 
                type="number" 
                class="counter-input"
                :min="0"
                step="2.5"
              />
              <button @click="adjustWeight(2.5)" class="counter-btn">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <div class="input-group">
            <label>Nível de Dificuldade:</label>
            <div class="difficulty-selector">
              <button 
                v-for="level in difficultyLevels"
                :key="level.value"
                @click="currentDifficulty = level.value"
                class="difficulty-btn"
                :class="{ active: currentDifficulty === level.value }"
              >
                <i :class="level.icon"></i>
                {{ level.label }}
              </button>
            </div>
          </div>

          <div class="input-group">
            <label>Observações (opcional):</label>
            <textarea 
              v-model="currentNotes" 
              class="notes-input"
              placeholder="Como foi a série? Alguma observação?"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="completeSet" class="complete-set-btn" :disabled="currentReps <= 0">
            <i class="fas fa-check"></i>
            Concluir Série
          </button>
          
          <div class="secondary-actions">
            <button @click="skipSet" class="skip-btn">
              <i class="fas fa-forward"></i>
              Pular Série
            </button>
            <button @click="previousExercise" class="nav-btn" :disabled="currentExerciseIndex === 0">
              <i class="fas fa-arrow-left"></i>
              Anterior
            </button>
            <button @click="nextExercise" class="nav-btn" :disabled="isLastExercise && currentSet >= currentExercise.sets">
              <i class="fas fa-arrow-right"></i>
              Próximo
            </button>
          </div>
        </div>

        <!-- Rest Timer -->
        <div v-if="isResting" class="rest-timer">
          <div class="rest-content">
            <h3>Tempo de Descanso</h3>
            <div class="rest-time">{{ formatTime(restTimeRemaining) }}</div>
            <div class="rest-controls">
              <button @click="skipRest" class="skip-rest-btn">
                <i class="fas fa-forward"></i>
                Pular Descanso
              </button>
              <button @click="addRestTime" class="add-time-btn">
                <i class="fas fa-plus"></i>
                +30s
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Workout Complete -->
      <div v-else-if="isWorkoutComplete" class="workout-complete">
        <div class="completion-content">
          <div class="completion-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <h2>Parabéns! Treino Concluído!</h2>
          <div class="completion-stats">
            <div class="stat">
              <span class="stat-value">{{ formatTime(totalWorkoutTime) }}</span>
              <span class="stat-label">Tempo Total</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ completedSets }}</span>
              <span class="stat-label">Séries Realizadas</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ estimatedCalories }}</span>
              <span class="stat-label">Calorias Queimadas</span>
            </div>
          </div>
          
          <div class="completion-actions">
            <button @click="saveWorkout" class="save-btn">
              <i class="fas fa-save"></i>
              Salvar Treino
            </button>
            <button @click="goToDashboard" class="dashboard-btn">
              <i class="fas fa-home"></i>
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Finish Confirmation Modal -->
    <div v-if="showFinishModal" class="modal-overlay" @click="showFinishModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Finalizar Treino</h3>
          <button @click="showFinishModal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <p>Tem certeza que deseja finalizar o treino?</p>
          <p class="modal-warning">Você realizou {{ completedSets }} de {{ totalSets }} séries.</p>
        </div>
        
        <div class="modal-footer">
          <button @click="showFinishModal = false" class="btn-secondary">Cancelar</button>
          <button @click="finishWorkout" class="btn-primary">Finalizar</button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/store/theme';
import StudentNavBar from '@/components/StudentNavBar.vue';

export default {
  name: 'WorkoutSession',
  components: {
    StudentNavBar
  },
  setup() {
    const router = useRouter();
    const themeStore = useThemeStore();
    
    const isDarkMode = computed(() => themeStore.isDarkMode);
    
    // State
    const workout = ref(null);
    const currentExerciseIndex = ref(0);
    const currentSet = ref(1);
    const currentReps = ref(0);
    const currentWeight = ref(0);
    const currentDifficulty = ref('medium');
    const currentNotes = ref('');
    const completedExercises = ref([]);
    const completedSets = ref(0);
    const totalSets = ref(0);
    
    // Session state
    const elapsedTime = ref(0);
    const isPaused = ref(false);
    const isResting = ref(false);
    const restTimeRemaining = ref(0);
    const isWorkoutComplete = ref(false);
    const showExerciseList = ref(false);
    const showFinishModal = ref(false);
    
    // Timers
    let sessionTimer = null;
    let restTimer = null;
    
    const difficultyLevels = [
      { value: 'easy', label: 'Fácil', icon: 'fas fa-smile' },
      { value: 'medium', label: 'Médio', icon: 'fas fa-meh' },
      { value: 'hard', label: 'Difícil', icon: 'fas fa-frown' }
    ];
    
    const currentExercise = computed(() => {
      return workout.value?.exercises?.[currentExerciseIndex.value] || null;
    });
    
    const isLastExercise = computed(() => {
      return currentExerciseIndex.value === (workout.value?.exercises?.length || 0) - 1;
    });
    
    const totalWorkoutTime = computed(() => {
      return elapsedTime.value;
    });
    
    const estimatedCalories = computed(() => {
      const baseCalories = workout.value?.estimatedCalories || 0;
      const completionRatio = completedSets.value / totalSets.value;
      return Math.round(baseCalories * completionRatio);
    });
    
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    const startSessionTimer = () => {
      if (sessionTimer) clearInterval(sessionTimer);
      sessionTimer = setInterval(() => {
        if (!isPaused.value) {
          elapsedTime.value++;
        }
      }, 1000);
    };
    
    const startRestTimer = (duration) => {
      isResting.value = true;
      restTimeRemaining.value = duration;
      
      if (restTimer) clearInterval(restTimer);
      restTimer = setInterval(() => {
        if (restTimeRemaining.value > 0) {
          restTimeRemaining.value--;
        } else {
          skipRest();
        }
      }, 1000);
    };
    
    const pauseOrContinue = () => {
      isPaused.value = !isPaused.value;
    };
    
    const adjustReps = (delta) => {
      currentReps.value = Math.max(0, currentReps.value + delta);
    };
    
    const adjustWeight = (delta) => {
      currentWeight.value = Math.max(0, currentWeight.value + delta);
    };
    
    const completeSet = () => {
      if (currentReps.value <= 0) return;
      
      // Save set data
      const setData = {
        exercise: currentExercise.value.name,
        set: currentSet.value,
        reps: currentReps.value,
        weight: currentWeight.value,
        difficulty: currentDifficulty.value,
        notes: currentNotes.value,
        timestamp: new Date()
      };
      
      // Store in session for recovery
      const progress = JSON.parse(sessionStorage.getItem('workoutProgress') || '{}');
      if (!progress.completedSets) progress.completedSets = [];
      progress.completedSets.push(setData);
      progress.elapsedTime = elapsedTime.value;
      sessionStorage.setItem('workoutProgress', JSON.stringify(progress));
      
      completedSets.value++;
      
      // Check if all sets of current exercise are done
      if (currentSet.value >= currentExercise.value.sets) {
        completedExercises.value.push(currentExerciseIndex.value);
        
        // Check if workout is complete
        if (isLastExercise.value) {
          completeWorkout();
          return;
        }
        
        // Move to next exercise
        nextExercise();
      } else {
        // Move to next set
        currentSet.value++;
        resetSetInputs();
        
        // Start rest timer if specified
        if (currentExercise.value.restTime) {
          startRestTimer(currentExercise.value.restTime);
        }
      }
    };
    
    const skipSet = () => {
      if (currentSet.value >= currentExercise.value.sets) {
        completedExercises.value.push(currentExerciseIndex.value);
        if (isLastExercise.value) {
          completeWorkout();
          return;
        }
        nextExercise();
      } else {
        currentSet.value++;
        resetSetInputs();
      }
    };
    
    const nextExercise = () => {
      if (currentExerciseIndex.value < (workout.value?.exercises?.length || 0) - 1) {
        currentExerciseIndex.value++;
        currentSet.value = 1;
        resetSetInputs();
      }
    };
    
    const previousExercise = () => {
      if (currentExerciseIndex.value > 0) {
        currentExerciseIndex.value--;
        currentSet.value = 1;
        resetSetInputs();
      }
    };
    
    const jumpToExercise = (index) => {
      currentExerciseIndex.value = index;
      currentSet.value = 1;
      resetSetInputs();
      showExerciseList.value = false;
    };
    
    const resetSetInputs = () => {
      currentReps.value = currentExercise.value?.reps || 0;
      currentWeight.value = currentExercise.value?.weight || 0;
      currentDifficulty.value = 'medium';
      currentNotes.value = '';
    };
    
    const skipRest = () => {
      isResting.value = false;
      if (restTimer) clearInterval(restTimer);
    };
    
    const addRestTime = () => {
      restTimeRemaining.value += 30;
    };
    
    const completeWorkout = () => {
      isWorkoutComplete.value = true;
      if (sessionTimer) clearInterval(sessionTimer);
      if (restTimer) clearInterval(restTimer);
    };
    
    const confirmFinish = () => {
      showFinishModal.value = true;
    };
    
    const finishWorkout = () => {
      completeWorkout();
      showFinishModal.value = false;
    };
    
    const saveWorkout = () => {
      // Save workout to history
      const workoutRecord = {
        id: Date.now(),
        workoutId: workout.value.id,
        name: workout.value.name,
        date: new Date(),
        duration: totalWorkoutTime.value,
        completedSets: completedSets.value,
        totalSets: totalSets.value,
        estimatedCalories: estimatedCalories.value,
        exercises: JSON.parse(sessionStorage.getItem('workoutProgress') || '{}').completedSets || []
      };
      
      // Store in localStorage for now (would be API call in real app)
      const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
      history.unshift(workoutRecord);
      localStorage.setItem('workoutHistory', JSON.stringify(history));
      
      // Clean up session storage
      sessionStorage.removeItem('activeWorkout');
      sessionStorage.removeItem('workoutProgress');
      
      goToDashboard();
    };
    
    const goToDashboard = () => {
      router.push('/student/dashboard');
    };
    
    onMounted(() => {
      // Load workout from session storage
      const storedWorkout = sessionStorage.getItem('activeWorkout');
      if (storedWorkout) {
        workout.value = JSON.parse(storedWorkout);
        totalSets.value = workout.value.exercises.reduce((sum, ex) => sum + ex.sets, 0);
        resetSetInputs();
        
        // Load progress if exists
        const progress = JSON.parse(sessionStorage.getItem('workoutProgress') || '{}');
        if (progress.elapsedTime) {
          elapsedTime.value = progress.elapsedTime;
        }
        if (progress.completedSets) {
          completedSets.value = progress.completedSets.length;
        }
        
        startSessionTimer();
      } else {
        // No active workout, redirect to workouts page
        router.push('/student/workouts');
      }
    });
    
    onUnmounted(() => {
      if (sessionTimer) clearInterval(sessionTimer);
      if (restTimer) clearInterval(restTimer);
    });
    
    return {
      workout,
      isDarkMode,
      currentExerciseIndex,
      currentExercise,
      currentSet,
      currentReps,
      currentWeight,
      currentDifficulty,
      currentNotes,
      difficultyLevels,
      completedExercises,
      completedSets,
      totalSets,
      elapsedTime,
      isPaused,
      isResting,
      restTimeRemaining,
      isWorkoutComplete,
      showExerciseList,
      showFinishModal,
      isLastExercise,
      totalWorkoutTime,
      estimatedCalories,
      formatTime,
      pauseOrContinue,
      adjustReps,
      adjustWeight,
      completeSet,
      skipSet,
      nextExercise,
      previousExercise,
      jumpToExercise,
      skipRest,
      addRestTime,
      confirmFinish,
      finishWorkout,
      saveWorkout,
      goToDashboard
    };
  }
};
</script>

<style scoped>
/* Layout principal */
.workout-session {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.workout-session.dark-mode {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
}

.session-main {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
}

/* Header */
.session-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.75rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dark-mode .session-header {
  background: rgba(30, 30, 46, 0.95);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.control-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.control-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 28px rgba(16, 185, 129, 0.5);
}

.control-btn.paused {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.control-btn.paused:hover {
  box-shadow: 0 8px 28px rgba(245, 158, 11, 0.5);
}

.workout-info {
  flex: 1;
}

.workout-name {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.gradient-text {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark-mode .gradient-text {
  background: linear-gradient(135deg, #6441a5 0%, #8b5fd9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.session-stats {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.timer {
  font-weight: 600;
  font-size: 1.1rem;
}

.header-right {
  display: flex;
  gap: 1rem;
}

.list-btn, .finish-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.list-btn {
  background: #f7fafc;
  color: #4a5568;
}

.list-btn:hover {
  background: #edf2f7;
}

.finish-btn {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
}

.finish-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
}

/* Progress Bar */
.progress-bar {
  height: 4px;
  background: #e2e8f0;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
  transition: width 0.5s ease;
}

/* Exercise Sidebar */
.exercise-sidebar {
  position: fixed;
  top: 0;
  right: -350px;
  width: 350px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 200;
  overflow-y: auto;
}

.exercise-sidebar.active {
  right: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-header h3 {
  margin: 0;
  color: #1a202c;
}

.close-sidebar {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-sidebar:hover {
  background: #f7fafc;
  color: #2d3748;
}

.exercise-list {
  padding: 1rem;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.exercise-item:hover {
  background: #f7fafc;
}

.exercise-item.current {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.exercise-item.completed {
  background: #f0fff4;
  border-color: #48bb78;
}

.exercise-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: inherit;
}

.exercise-item:not(.current) .exercise-number {
  background: #e2e8f0;
  color: #4a5568;
}

.exercise-item.completed .exercise-number {
  background: #48bb78;
  color: white;
}

.exercise-details {
  flex: 1;
}

.exercise-name {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.exercise-sets {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Main Content */
.session-content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  transition: margin-right 0.3s ease;
}

.session-content.sidebar-open {
  margin-right: 350px;
}

.exercise-header {
  text-align: center;
  margin-bottom: 2rem;
}

.exercise-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 1rem 0;
}

.exercise-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.sets-info, .reps-info, .weight-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-weight: 600;
}

.exercise-instructions {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #667eea;
}

.exercise-instructions h3 {
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.exercise-instructions p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

/* Set Tracking */
.set-tracking {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.set-tracking h3 {
  color: #1a202c;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.counter-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.counter-input {
  width: 100px;
  height: 48px;
  text-align: center;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  background: #f8fafc;
  color: #1a202c;
}

.counter-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
}

.difficulty-selector {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.difficulty-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5568;
}

.difficulty-btn:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.difficulty-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.notes-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1rem;
  background: #f8fafc;
  color: #1a202c;
  resize: vertical;
}

.notes-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
}

/* Action Buttons */
.action-buttons {
  text-align: center;
}

.complete-set-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 16px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}

.complete-set-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
}

.complete-set-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.skip-btn, .nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.skip-btn:hover, .nav-btn:hover:not(:disabled) {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Rest Timer */
.rest-timer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.rest-content {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.rest-content h3 {
  color: #1a202c;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.rest-time {
  font-size: 4rem;
  font-weight: 700;
  color: #667eea;
  margin: 1rem 0;
}

.rest-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.skip-rest-btn, .add-time-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skip-rest-btn {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
}

.add-time-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

/* Workout Complete */
.workout-complete {
  text-align: center;
  padding: 4rem 2rem;
}

.completion-content {
  max-width: 500px;
  margin: 0 auto;
}

.completion-icon {
  font-size: 5rem;
  color: #ed8936;
  margin-bottom: 2rem;
}

.workout-complete h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 2rem 0;
}

.completion-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
}

.completion-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.save-btn, .dashboard-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.dashboard-btn {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1a202c;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f7fafc;
  color: #2d3748;
}

.modal-body {
  padding: 1.5rem;
}

.modal-warning {
  color: #e53e3e;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
}

.btn-secondary {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

/* Responsive */
@media (max-width: 768px) {
  .session-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-left {
    flex-direction: column;
    text-align: center;
  }
  
  .session-content {
    padding: 1rem;
  }
  
  .session-content.sidebar-open {
    margin-right: 0;
  }
  
  .exercise-sidebar {
    width: 100%;
    right: -100%;
  }
  
  .exercise-title {
    font-size: 2rem;
  }
  
  .exercise-meta {
    flex-direction: column;
    gap: 1rem;
  }
  
  .counter {
    justify-content: stretch;
  }
  
  .counter-input {
    flex: 1;
  }
  
  .difficulty-selector {
    flex-direction: column;
  }
  
  .secondary-actions {
    flex-direction: column;
  }
  
  .completion-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .completion-actions {
    flex-direction: column;
  }
}
</style>