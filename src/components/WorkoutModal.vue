<template>
  <!-- Modal de Execução do Treino -->
  <Transition name="modal">
    <div v-if="show" class="modal-overlay workout-modal-overlay" @click="handleOverlayClick">
      <NotificationModal 
        v-model:visible="notification.visible"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
      />
      
      <ConfirmationModal
        :show="showConfirmation"
        :title="confirmationConfig.title"
        :message="confirmationConfig.message"
        :icon-type="confirmationConfig.iconType"
        :confirm-text="confirmationConfig.confirmText"
        :cancel-text="confirmationConfig.cancelText"
        :button-class="confirmationConfig.buttonClass"
        @confirm="confirmationConfig.onConfirm"
        @close="showConfirmation = false"
      />
      
      <div v-if="workoutSession" class="modal-content workout-modal-new" @click.stop>
        
        <!-- Header Compacto -->
        <div class="workout-header-compact" v-if="currentExercise">
          <div class="header-left">
            <!-- Botão para mostrar sidebar quando escondida -->
            <button v-if="!showSidebar" @click="showSidebar = true" class="btn-show-sidebar-header">
              <i class="fas fa-list"></i>
            </button>
            
            <div class="header-info">
              <h2>{{ workoutSession.workoutName }}</h2>
              <p>{{ workoutSession.divisionName }}</p>
              <div class="exercise-info-compact">
                <span class="exercise-name">{{ currentExercise.exerciseName }}</span>
                <div class="exercise-badges">
                  <span 
                    v-if="exerciseDetails[currentExercise.exerciseName]?.category"
                    class="category-badge"
                    :style="{ backgroundColor: getCategoryColor(exerciseDetails[currentExercise.exerciseName]?.category) }"
                  >
                    {{ exerciseDetails[currentExercise.exerciseName]?.category }}
                  </span>
                  <span 
                    v-if="exerciseDetails[currentExercise.exerciseName]?.difficulty"
                    class="difficulty-badge"
                    :style="{ backgroundColor: getDifficultyColor(exerciseDetails[currentExercise.exerciseName]?.difficulty) }"
                  >
                    {{ exerciseDetails[currentExercise.exerciseName]?.difficulty }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="header-right">
            <div class="timer-badge">
              <i class="fas fa-clock"></i>
              {{ formatWorkoutTime() }}
            </div>
            <div class="series-progress-badge">
              <i class="fas fa-list-ol"></i>
              Série {{ currentSetIndex + 1 }}/{{ totalSetsInExercise }}
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
        <div class="workout-progress-container">
          <!-- Progress geral do treino -->
          <div class="workout-progress-bar main-progress">
            <div 
              class="workout-progress-fill" 
              :style="{ width: `${(workoutSession.completedExercises / workoutSession.totalExercises) * 100}%` }"
            ></div>
          </div>
          <!-- Progress das séries do exercício atual -->
          <div v-if="currentExercise" class="workout-progress-bar exercise-progress">
            <div 
              class="workout-progress-fill exercise-fill" 
              :style="{ width: `${exerciseProgress}%` }"
            ></div>
          </div>
        </div>

        <!-- Body - Exercício Atual em Destaque -->
        <div class="workout-body-new" :class="{ 'sidebar-hidden': !showSidebar }">
          
          <!-- Lista de Exercícios (Sidebar) -->
          <div v-if="showSidebar" class="exercises-sidebar">
            <div class="sidebar-header">
              <h3><i class="fas fa-list"></i> Exercícios</h3>
              <button @click="showSidebar = false" class="btn-hide-sidebar" title="Esconder lista de exercícios">
                <i class="fas fa-times"></i>
              </button>
            </div>
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
                <!-- Imagem do exercício (se já carregou) -->
                <img 
                  v-if="workoutSession.exercises && workoutSession.exercises[currentExerciseIndex] && exerciseDetails[workoutSession.exercises[currentExerciseIndex].exerciseName]?.image"
                  :src="getImageUrl(exerciseDetails[workoutSession.exercises[currentExerciseIndex].exerciseName]?.image)" 
                  :alt="workoutSession.exercises[currentExerciseIndex].exerciseName"
                  class="exercise-image"
                  :key="exerciseDetails[workoutSession.exercises[currentExerciseIndex].exerciseName]?.image"
                />
                
                <!-- Placeholder padrão (sempre mostra imediatamente enquanto carrega em background) -->
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

              <!-- Série Atual (Sistema de Etapas) -->
              <div class="current-set-container">
                <div class="set-progress-header">
                  <div class="set-header-title">
                    <i class="fas fa-dumbbell"></i>
                    <h3>Série {{ currentSetIndex + 1 }} de {{ totalSetsInExercise }}</h3>
                  </div>
                  <div class="set-progress-visual">
                    <div 
                      v-for="(set, index) in currentExercise.sets" 
                      :key="index"
                      :class="['progress-dot', {
                        completed: set.completed,
                        active: index === currentSetIndex,
                        pending: index > currentSetIndex
                      }]"
                      :title="`Série ${index + 1}`"
                    >
                      <i v-if="set.completed" class="fas fa-check"></i>
                      <span v-else>{{ index + 1 }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="currentSet" class="current-set-card">
                  <!-- Status Badge -->
                  <div v-if="currentSet.completed && !isEditingCompletedSet" class="set-status-banner completed">
                    <div class="status-icon">
                      <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="status-info">
                      <span class="status-label">Série Concluída</span>
                      <span class="status-time">{{ new Date(currentSet.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }}</span>
                    </div>
                    <button @click="editCompletedSet" class="btn-edit-compact">
                      <i class="fas fa-edit"></i>
                      Editar
                    </button>
                  </div>
                  
                  <div v-else-if="isEditingCompletedSet" class="set-status-banner editing">
                    <div class="status-icon">
                      <i class="fas fa-pen"></i>
                    </div>
                    <div class="status-info">
                      <span class="status-label">Editando Série</span>
                      <span class="status-time">Faça suas alterações abaixo</span>
                    </div>
                  </div>

                  <!-- Inputs Grid -->
                  <div class="set-inputs-grid">
                    <div class="input-card">
                      <div class="input-header">
                        <i class="fas fa-redo"></i>
                        <label>Repetições</label>
                      </div>
                      <input 
                        type="number" 
                        v-model.number="currentSet.reps"
                        :disabled="currentSet.completed && !isEditingCompletedSet"
                        placeholder="12"
                        min="1"
                        class="input-field"
                      />
                      <div class="input-helper">Número de repetições</div>
                    </div>

                    <div class="input-card">
                      <div class="input-header">
                        <i class="fas fa-weight-hanging"></i>
                        <label>Peso (kg)</label>
                        <span v-if="isBodyWeightExercise" class="body-weight-tag">
                          <i class="fas fa-user"></i> Corporal
                        </span>
                      </div>
                      <div class="weight-input-wrapper">
                        <input 
                          v-if="!isBodyWeightExercise"
                          type="number" 
                          v-model.number="currentSet.weight"
                          step="0.5"
                          :disabled="currentSet.completed && !isEditingCompletedSet"
                          placeholder="25.0"
                          min="0"
                          class="input-field"
                        />
                        <div v-else-if="userWeight" class="body-weight-display-modern">
                          <span class="weight-value">{{ userWeight }} kg</span>
                          <button @click="showWeightInput = true" class="btn-edit-weight-mini">
                            <i class="fas fa-edit"></i>
                          </button>
                        </div>
                        <button v-else @click="showWeightInput = true" class="btn-set-weight-modern">
                          <i class="fas fa-plus-circle"></i>
                          Definir peso
                        </button>
                      </div>
                      <div class="input-helper">
                        <span v-if="isBodyWeightExercise">Peso corporal do aluno</span>
                        <span v-else>Carga utilizada</span>
                      </div>
                    </div>
                  </div>

                  <!-- Difficulty Feedback (se série completa) -->
                  <div v-if="currentSet.completed && currentSet.difficulty" class="difficulty-indicator">
                    <span class="difficulty-icon">
                      <i v-if="currentSet.difficulty === 'easy'" class="fas fa-smile"></i>
                      <i v-else-if="currentSet.difficulty === 'medium'" class="fas fa-meh"></i>
                      <i v-else class="fas fa-tired"></i>
                    </span>
                    <span class="difficulty-label">Dificuldade:</span>
                    <span class="difficulty-value" :class="`difficulty-${currentSet.difficulty}`">
                      {{ getDifficultyText(currentSet.difficulty) }}
                    </span>
                  </div>

                  <!-- Actions -->
                  <div class="set-actions-modern">
                    <button v-if="!currentSet.completed" @click="completeCurrentSet" class="btn-complete-modern">
                      <i class="fas fa-check-circle"></i>
                      <span>Concluir Série</span>
                    </button>
                    <div v-else-if="isEditingCompletedSet" class="edit-actions-modern">
                      <button @click="cancelEditSet" class="btn-cancel-modern">
                        <i class="fas fa-times"></i>
                        <span>Cancelar</span>
                      </button>
                      <button @click="saveEditedSet" class="btn-save-modern">
                        <i class="fas fa-check"></i>
                        <span>Salvar Alterações</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Navegação entre Séries -->
                <div class="set-navigation">
                  <button 
                    @click="currentSetIndex > 0 ? currentSetIndex-- : null"
                    :disabled="currentSetIndex === 0"
                    class="btn-nav-set"
                  >
                    <i class="fas fa-chevron-left"></i>
                    Anterior
                  </button>
                  
                  <div class="set-counter">
                    {{ currentSetIndex + 1 }} / {{ totalSetsInExercise }}
                  </div>
                  
                  <button 
                    @click="currentSetIndex < totalSetsInExercise - 1 ? currentSetIndex++ : null"
                    :disabled="currentSetIndex === totalSetsInExercise - 1"
                    class="btn-nav-set"
                  >
                    Próxima
                    <i class="fas fa-chevron-right"></i>
                  </button>
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

              <!-- Navegação entre Exercícios (só quando sidebar escondida) -->
              <div v-if="!showSidebar" class="exercise-navigation">
                <button 
                  @click="previousExercise"
                  :disabled="currentExerciseIndex === 0"
                  class="btn-nav"
                >
                  <i class="fas fa-chevron-left"></i>
                  Exercício Anterior
                </button>
                
                <!-- Botão de Pular Exercício -->
                <button 
                  v-if="!currentExercise.completed && !currentExercise.skipped"
                  @click="showSkipModal = true"
                  class="btn-skip-exercise"
                >
                  <i class="fas fa-forward"></i>
                  Pular Exercício
                </button>
                
                <!-- Só mostrar botão de concluir exercício na última série -->
                <button 
                  v-if="currentSetIndex === totalSetsInExercise - 1 && !currentExercise.completed && !currentExercise.skipped"
                  @click="markExerciseComplete(currentExerciseIndex)"
                  class="btn-complete-current"
                >
                  <i class="fas fa-check"></i>
                  Concluir Exercício
                </button>
                <div v-else-if="currentExercise.completed" class="completed-indicator">
                  <i class="fas fa-check-circle"></i>
                  Exercício Concluído
                </div>
                <div v-else-if="currentExercise.skipped" class="skipped-indicator">
                  <i class="fas fa-forward"></i>
                  Exercício Pulado: {{ currentExercise.skipReason }}
                </div>

                <button 
                  @click="nextExercise"
                  :disabled="currentExerciseIndex === workoutSession.exercises.length - 1"
                  class="btn-nav"
                >
                  Próximo Exercício
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
            
            <div v-if="currentEquipment" class="equipment-info-grid">
              <div class="equipment-image-section">
                <img 
                  v-if="currentEquipment.image"
                  :src="getImageUrl(currentEquipment.image)" 
                  :alt="currentEquipment.name"
                  class="equipment-detail-image"
                />
                <div v-else class="image-placeholder">
                  <i class="fas fa-cogs"></i>
                  <p>Sem imagem disponível</p>
                </div>
              </div>
              <div class="equipment-text-section">
                <h4>{{ currentEquipment.name }}</h4>
                <p v-if="currentEquipment.description">
                  {{ currentEquipment.description }}
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

  <!-- Modal de Feedback de Dificuldade -->
  <Transition name="modal">
    <div v-if="showDifficultyFeedback" class="modal-overlay difficulty-modal-overlay">
      <div class="modal-content difficulty-modal" @click.stop>
        <div class="difficulty-modal-header">
          <h2><i class="fas fa-star"></i> Como foi esta série?</h2>
          <p>Avalie a dificuldade que você sentiu</p>
        </div>
        <div class="difficulty-modal-body">
          <div class="difficulty-options">
            <button 
              @click="submitDifficultyFeedback('easy')"
              class="difficulty-option easy"
            >
              <div class="difficulty-icon">
                <i class="fas fa-smile"></i>
              </div>
              <div class="difficulty-info">
                <h3>Fácil</h3>
                <p>Consegui fazer sem dificuldade</p>
              </div>
            </button>
            
            <button 
              @click="submitDifficultyFeedback('medium')"
              class="difficulty-option medium"
            >
              <div class="difficulty-icon">
                <i class="fas fa-meh"></i>
              </div>
              <div class="difficulty-info">
                <h3>Médio</h3>
                <p>Senti um pouco de dificuldade</p>
              </div>
            </button>
            
            <button 
              @click="submitDifficultyFeedback('hard')"
              class="difficulty-option hard"
            >
              <div class="difficulty-icon">
                <i class="fas fa-tired"></i>
              </div>
              <div class="difficulty-info">
                <h3>Difícil</h3>
                <p>Foi bem desafiador</p>
              </div>
            </button>
            
            <button 
              @click="submitDifficultyFeedback(null)"
              class="difficulty-option neutral"
            >
              <div class="difficulty-icon">
                <i class="fas fa-times"></i>
              </div>
              <div class="difficulty-info">
                <h3>Não informar</h3>
                <p>Prefiro não avaliar agora</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de Entrada de Peso Corporal -->
  <Transition name="modal">
    <div v-if="showWeightInput" class="modal-overlay weight-modal-overlay" @click="showWeightInput = false">
      <div class="modal-content weight-modal" @click.stop>
        <div class="weight-modal-header">
          <h2><i class="fas fa-weight"></i> Peso Corporal</h2>
          <p>Este exercício utiliza o peso do seu corpo</p>
        </div>
        <div class="weight-modal-body">
          <div class="weight-input-section">
            <label>Qual é o seu peso atual?</label>
            <div class="weight-input-group">
              <input 
                type="number" 
                v-model.number="userWeight"
                step="0.1"
                min="30"
                max="200"
                placeholder="70.0"
                class="weight-input-field"
              />
              <span class="weight-unit">kg</span>
            </div>
          </div>
          <div class="weight-modal-actions">
            <button @click="showWeightInput = false" class="btn-cancel">
              Cancelar
            </button>
            <button 
              @click="setUserWeight(userWeight)"
              :disabled="!userWeight || userWeight < 30 || userWeight > 200"
              class="btn-confirm"
            >
              <i class="fas fa-check"></i>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de Pular Exercício -->
  <Transition name="modal">
    <div v-if="showSkipModal" class="modal-overlay skip-modal-overlay">
      <div class="modal-content skip-modal" @click.stop>
        <div class="skip-modal-header">
          <h3>Pular Exercício</h3>
          <button @click="showSkipModal = false" class="btn-close-modal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="skip-modal-body">
          <p>Tem certeza que deseja pular o exercício <strong>{{ currentExercise.exerciseName }}</strong>?</p>
          <div class="skip-reason-container">
            <label for="skipReason">Motivo (opcional):</label>
            <select v-model="skipReason" id="skipReason" class="skip-reason-select">
              <option value="">Selecione um motivo...</option>
              <option value="Lesão/Dor">Lesão ou dor</option>
              <option value="Equipamento indisponível">Equipamento indisponível</option>
              <option value="Muito difícil">Muito difícil para mim</option>
              <option value="Falta de tempo">Falta de tempo</option>
              <option value="Outro">Outro motivo</option>
            </select>
            <textarea 
              v-if="skipReason === 'Outro'"
              v-model="customSkipReason"
              placeholder="Descreva o motivo..."
              class="custom-reason-textarea"
            ></textarea>
          </div>
        </div>
        <div class="skip-modal-actions">
          <button @click="showSkipModal = false" class="btn-cancel">
            Cancelar
          </button>
          <button @click="confirmSkipExercise" class="btn-skip-confirm">
            <i class="fas fa-forward"></i>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import api from '@/api'
import { getImageUrl as getImageUrlHelper } from '@/config'
import NotificationModal from '@/components/NotificationModal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'


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


const emit = defineEmits([
  'close',
  'workout-finished',
  'progress-saved',
  'session-updated'
])


const currentExerciseIndex = ref(0)
const currentSetIndex = ref(0)
const showExerciseInfo = ref(false)
const selectedExerciseInfo = ref(null)
const loading = ref(false)
const currentTime = ref(Date.now())
const timerInterval = ref(null)
const showRestModal = ref(false)


const notification = ref({
  visible: false,
  type: 'info',
  title: '',
  message: ''
})

const showNotification = (type, title, message) => {
  notification.value = {
    visible: true,
    type,
    title,
    message
  }
}


const showConfirmation = ref(false)
const confirmationConfig = ref({
  title: '',
  message: '',
  iconType: 'warning',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  buttonClass: 'btn-danger',
  onConfirm: () => {}
})
const restTimeRemaining = ref(0)
const restInterval = ref(null)
const exerciseDetails = ref({})
const equipmentDetails = ref({})
const showVideoModal = ref(false)
const currentVideoUrl = ref('')
const userWeight = ref(null)
const showWeightInput = ref(false)
const showDifficultyFeedback = ref(false)
const currentSetDifficulty = ref(null)
const showSidebar = ref(true)
const showSkipModal = ref(false)
const skipReason = ref('')
const customSkipReason = ref('')
const isEditingCompletedSet = ref(false)
const isLoadingExercises = ref(false)
const exercisesLoadAttempted = ref({})


const allExercisesCompleted = computed(() => {
  if (!props.workoutSession) return false
  return props.workoutSession.exercises.every(ex => ex.completed)
})

const currentExercise = computed(() => {
  return props.workoutSession?.exercises[currentExerciseIndex.value]
})

const currentSet = computed(() => {
  return currentExercise.value?.sets[currentSetIndex.value]
})

const isBodyWeightExercise = computed(() => {
  const exerciseName = currentExercise.value?.exerciseName
  if (!exerciseName) return false
  
  const bodyWeightKeywords = ['flexão', 'flexao', 'abdominal', 'prancha', 'burpee', 'agachamento livre', 'barra fixa', 'mergulho', 'mountain climber']
  return bodyWeightKeywords.some(keyword => 
    exerciseName.toLowerCase().includes(keyword.toLowerCase())
  )
})

const totalSetsInExercise = computed(() => {
  return currentExercise.value?.sets.length || 0
})

const exerciseProgress = computed(() => {
  return Math.round((currentSetIndex.value / totalSetsInExercise.value) * 100)
})

const currentEquipment = computed(() => {  
  const exerciseName = currentExercise.value?.exerciseName
  
  if (!exerciseName) {
    return null
  }
  
  const exercise = exerciseDetails.value[exerciseName]
  
  if (!exercise) {
    return null
  }
  
  if (!exercise.equipmentId) {
    return null
  }

 
  const equipmentIdStr = typeof exercise.equipmentId === 'object' 
    ? exercise.equipmentId._id || exercise.equipmentId.toString()
    : exercise.equipmentId;
  
  const equipment = equipmentDetails.value[equipmentIdStr]
  
  if (!equipment) {
    return null
  }
  
  return equipment
})


watch(() => props.show, (newValue) => {
  if (newValue) {
   
    currentExerciseIndex.value = 0
    currentSetIndex.value = 0
    
   
    const firstIncomplete = props.workoutSession?.exercises.findIndex(ex => !ex.completed)
    
    if (firstIncomplete !== -1) {
      currentExerciseIndex.value = firstIncomplete
     
      const exercise = props.workoutSession.exercises[firstIncomplete]
      const firstIncompleteSet = exercise.sets.findIndex(set => !set.completed)
      if (firstIncompleteSet !== -1) {
        currentSetIndex.value = firstIncompleteSet
      }
    }
    
   
    checkBodyWeightRequirement()
    
   
    startTimer()
    
   
    if (props.workoutSession?.exercises && props.workoutSession.exercises.length > 0) {
     
      props.workoutSession.exercises.forEach(ex => {
        exercisesLoadAttempted.value[ex.exerciseName] = true
      })
      
     
      const promises = props.workoutSession.exercises.map(ex => {
        return fetchExerciseDetails(ex.exerciseName)
      })
      
      Promise.all(promises).catch(error => {
        console.error('Erro ao carregar detalhes dos exercícios:', error)
      })
    }
  } else {
   
    stopTimer()
   
    isLoadingExercises.value = false
    exercisesLoadAttempted.value = {}
  }
})

watch(() => currentExerciseIndex.value, () => {
 
  const exercise = currentExercise.value
  
  if (exercise) {
    const firstIncompleteSet = exercise.sets.findIndex(set => !set.completed)
    currentSetIndex.value = firstIncompleteSet !== -1 ? firstIncompleteSet : 0
    checkBodyWeightRequirement()
    
   
    applyBodyWeightToAllSets()
    
   
    if (!exerciseDetails.value[exercise.exerciseName]) {
      fetchExerciseDetails(exercise.exerciseName)
    }
  }
})


watch(() => [userWeight.value, currentSet.value, isBodyWeightExercise.value], ([newUserWeight, newCurrentSet, isBodyWeight]) => {
  if (isBodyWeight && newUserWeight && newCurrentSet && !newCurrentSet.completed && !newCurrentSet.weight) {
    newCurrentSet.weight = newUserWeight
  }
}, { immediate: true })


onMounted(() => {
  if (props.show) {
    startTimer()
    
   
    if (props.workoutSession?.exercises && props.workoutSession.exercises.length > 0) {
     
      props.workoutSession.exercises.forEach(ex => {
        exercisesLoadAttempted.value[ex.exerciseName] = true
      })
      
     
      const promises = props.workoutSession.exercises.map(ex => {
        return fetchExerciseDetails(ex.exerciseName)
      })
      
      Promise.all(promises).catch(error => {
        console.error('Erro ao carregar exercícios:', error)
      })
    }
  }
  
 
  const savedWeight = localStorage.getItem('userWeight')
  if (savedWeight) {
    userWeight.value = parseFloat(savedWeight)
  }
})

onUnmounted(() => {
  stopTimer()
  if (restInterval.value) {
    clearInterval(restInterval.value)
  }
})


const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '';
  }
  
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return getImageUrlHelper(`/${cleanPath}`);
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

const checkBodyWeightRequirement = () => {
  if (isBodyWeightExercise.value && !userWeight.value) {
    showWeightInput.value = true
  }
}

const setUserWeight = (weight) => {
  userWeight.value = weight
  showWeightInput.value = false
 
  localStorage.setItem('userWeight', weight.toString())
  
 
  if (isBodyWeightExercise.value && currentSet.value && !currentSet.value.completed) {
    currentSet.value.weight = weight
  }
}


const applyBodyWeightToAllSets = () => {
  if (!isBodyWeightExercise.value || !userWeight.value) return
  
  const exercise = currentExercise.value
  if (exercise) {
    exercise.sets.forEach(set => {
      if (!set.completed && !set.weight) {
        set.weight = userWeight.value
      }
    })
  }
}

const fetchExerciseDetails = async (exerciseName) => {
  try {
   
    if (exerciseDetails.value[exerciseName]) {
      return
    }
    
   
    let studentData
    try {
      const rawData = sessionStorage.getItem('user')
      studentData = JSON.parse(rawData)
    } catch (e) {
      console.error('Erro ao parsear dados do usuário:', e)
      return
    }
    
   
    if (studentData && studentData.id) {
      try {
        const studentResponse = await api.get(`/students/user/${studentData.id}`)
        
        const studentInfo = studentResponse.data
        const instructorId = studentInfo?.instructorId?._id || studentInfo?.instructorId || studentInfo?.assignedInstructor
        
        if (instructorId) {
          const response = await api.get(`/exercises/instructor/${instructorId}`)
          
          if (response.data.exercises && response.data.exercises.length > 0) {
            const exercise = response.data.exercises.find(ex => ex.name === exerciseName)
            
            if (exercise) {
             
              exerciseDetails.value[exerciseName] = {
                name: exercise.name,
                description: exercise.description,
                category: exercise.category,
                difficulty: exercise.difficulty,
                image: exercise.image,
                videoUrl: exercise.videoUrl,
                howToPerform: exercise.howToPerform,
                safetyTips: exercise.safetyTips,
                equipmentId: exercise.equipmentId
              }
              
             
              if (exercise.equipmentId) {
               
                const equipmentIdStr = typeof exercise.equipmentId === 'object' 
                  ? exercise.equipmentId._id || exercise.equipmentId.toString()
                  : exercise.equipmentId;
                await loadEquipmentDetails(equipmentIdStr);
              }
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error)
      }
    }
    
  } catch (error) {
    console.error('Erro ao buscar detalhes do exercício:', error)
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

const loadEquipmentDetails = async (equipmentId) => {
  try {
    
   
    let equipmentIdStr = equipmentId;
    if (typeof equipmentId === 'object' && equipmentId !== null) {
      equipmentIdStr = equipmentId._id || equipmentId.toString();
    }
    
   
    if (equipmentDetails.value[equipmentIdStr]) {
      return equipmentDetails.value[equipmentIdStr];
    }

   
    try {
      const response = await api.get(`/equipments/${equipmentIdStr}`);
      
      if (response.data) {
        let equipment = response.data;
        
       
        if (response.data.equipment) {
          equipment = response.data.equipment;
        }
        
        if (equipment && (equipment._id || equipment.id)) {
          equipmentDetails.value[equipmentIdStr] = equipment;
          return equipment;
        }
      }
    } catch (error) {
     
      try {
        const allResponse = await api.get('/equipments');
        
        if (allResponse.data && allResponse.data.equipments) {
          const equipment = allResponse.data.equipments.find(eq => eq._id === equipmentIdStr);
          if (equipment) {
            equipmentDetails.value[equipmentIdStr] = equipment;
            return equipment;
          }
        }
      } catch (fallbackError) {
        console.error('Erro ao carregar equipamento:', fallbackError);
      }
    }

    return null;
  } catch (error) {
    console.error('Erro ao carregar equipamento:', error);
    return null;
  }
}

const getExerciseCompletedSets = (exercise) => {
  return exercise.sets.filter(set => set.completed).length
}

const completeCurrentSet = () => {
  if (!currentSet.value || currentSet.value.completed) return
  
 
  if (isBodyWeightExercise.value && userWeight.value && !currentSet.value.weight) {
    currentSet.value.weight = userWeight.value
  }
  
 
  showDifficultyFeedback.value = true
}

const submitDifficultyFeedback = (difficulty) => {
  currentSetDifficulty.value = difficulty
  
 
  const updatedSession = { ...props.workoutSession }
  const set = updatedSession.exercises[currentExerciseIndex.value].sets[currentSetIndex.value]
  set.completed = true
  set.completedAt = new Date()
  set.difficulty = difficulty
  
 
  emit('session-updated', updatedSession)
  
  showDifficultyFeedback.value = false
  currentSetDifficulty.value = null
  
 
  const isLastSet = currentSetIndex.value === totalSetsInExercise.value - 1
  if (!isLastSet) {
   
    const restTime = currentExercise.value?.restTime || 60
    setTimeout(() => {
      startRestTimer(restTime)
    }, 500)
  } else {
   
    markExerciseComplete(currentExerciseIndex.value)
  }
  
 
  if (!isLastSet) {
    currentSetIndex.value++
  }
}

const updateExerciseNotes = (notes) => {
 
  const updatedSession = { ...props.workoutSession }
  updatedSession.exercises[currentExerciseIndex.value].notes = notes
  
 
  emit('session-updated', updatedSession)
}

const markExerciseComplete = (exIndex) => {
 
  const updatedSession = { ...props.workoutSession }
  const exercise = updatedSession.exercises[exIndex]
  exercise.completed = true
  exercise.sets.forEach(set => {
    set.completed = true
    if (!set.completedAt) {
      set.completedAt = new Date()
    }
  })
  
 
  updatedSession.completedExercises = updatedSession.exercises.filter(ex => ex.completed).length
  
 
  if (exIndex < updatedSession.exercises.length - 1) {
    currentExerciseIndex.value = exIndex + 1
  }
  
 
  emit('session-updated', updatedSession)
}

const saveProgress = async () => {
  try {
    loading.value = true
    await api.put(`/workout-sessions/sessions/${props.workoutSession._id}`, {
      exercises: props.workoutSession.exercises,
      notes: props.workoutSession.notes
    })
    
    emit('progress-saved')
    showNotification('success', 'Progresso Salvo', 'Progresso salvo com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    showNotification('error', 'Erro!', 'Erro ao salvar progresso')
  } finally {
    loading.value = false
  }
}

const finishWorkout = () => {
  if (!allExercisesCompleted.value) {
    showNotification('warning', 'Treino Incompleto', 'Complete todos os exercícios antes de finalizar')
    return
  }
  
  confirmationConfig.value = {
    title: 'Finalizar Treino',
    message: 'Deseja finalizar este treino? Esta ação não pode ser desfeita.',
    iconType: 'success',
    confirmText: 'Sim, Finalizar',
    cancelText: 'Cancelar',
    buttonClass: 'btn-success',
    onConfirm: async () => {
      try {
        loading.value = true
        
        await api.post(`/workout-sessions/sessions/${props.workoutSession._id}/complete`, {
          exercises: props.workoutSession.exercises,
          notes: props.workoutSession.notes
        })
        
        showNotification('success', 'Treino Finalizado', 'Treino finalizado com sucesso! 🎉')
        emit('workout-finished')
        showConfirmation.value = false
      } catch (error) {
        console.error('Erro ao finalizar treino:', error)
        showNotification('error', 'Erro!', 'Erro ao finalizar treino')
      } finally {
        loading.value = false
      }
    }
  }
  showConfirmation.value = true
}

const handleOverlayClick = () => {
 
}

const confirmCloseWorkout = () => {
  confirmationConfig.value = {
    title: 'Sair do Treino',
    message: 'Deseja sair? O progresso não salvo será perdido.',
    iconType: 'warning',
    confirmText: 'Sim, Sair',
    cancelText: 'Cancelar',
    buttonClass: 'btn-danger',
    onConfirm: () => {
      emit('close')
      showConfirmation.value = false
    }
  }
  showConfirmation.value = true
}

const showExerciseDetails = async (exercise) => {  
  selectedExerciseInfo.value = exercise
  
 
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

const confirmSkipExercise = async () => {
  try {
    loading.value = true
    
    const reason = skipReason.value === 'Outro' ? customSkipReason.value : skipReason.value
    
    await api.post(`/workout-sessions/sessions/${props.workoutSession._id}/skip-exercise`, {
      exerciseIndex: currentExerciseIndex.value,
      reason: reason || 'Não informado'
    })
    
   
    emit('session-updated')
    
   
    showSkipModal.value = false
    skipReason.value = ''
    customSkipReason.value = ''
    
   
    if (currentExerciseIndex.value < props.workoutSession.exercises.length - 1) {
      currentExerciseIndex.value++
      currentSetIndex.value = 0
    }
    
    showNotification('success', 'Exercício Pulado', 'Exercício pulado com sucesso!')
    
  } catch (error) {
    console.error('Erro ao pular exercício:', error)
    showNotification('error', 'Erro!', 'Erro ao pular exercício')
  } finally {
    loading.value = false
  }
}


const editCompletedSet = () => {
  isEditingCompletedSet.value = true
}

const saveEditedSet = async () => {
  try {
    loading.value = true
    
   
    if (isBodyWeightExercise.value && userWeight.value) {
      currentSet.value.weight = userWeight.value
    }
    
   
    await saveProgress()
    
   
    isEditingCompletedSet.value = false
    showDifficultyFeedback.value = true
    currentSetDifficulty.value = currentSet.value
    
  } catch (error) {
    console.error('Erro ao salvar edição:', error)
    showNotification('error', 'Erro!', 'Erro ao salvar alterações')
  } finally {
    loading.value = false
  }
}

const cancelEditSet = () => {
  isEditingCompletedSet.value = false
 
}

const getYouTubeEmbedUrl = (url) => {
  if (!url) return ''
  
 
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
  
 
  let videoId = ''
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('youtube.com/watch?v=')[1].split('&')[0]
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0]
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1].split('?')[0]
  }
  
 
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
}

const handleThumbnailError = (event) => {
 
  const img = event.target
  const currentSrc = img.src
  
  if (currentSrc.includes('maxresdefault.jpg')) {
   
    const videoId = currentSrc.split('/vi/')[1].split('/')[0]
    img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  } else if (currentSrc.includes('hqdefault.jpg')) {
   
    img.src = 'https://via.placeholder.com/480x360/3b82f6/ffffff?text=Vídeo+Indisponível'
  }
}

const getCategoryColor = (category) => {
  const colors = {
    'cardio': '#ef4444',
    'força': '#3b82f6',
    'flexibilidade': '#10b981',
    'funcional': '#f59e0b',
    'resistência': '#8b5cf6',
    'aquecimento': '#06b6d4',
    'alongamento': '#84cc16'
  }
  return colors[category?.toLowerCase()] || '#6b7280'
}

const getDifficultyColor = (difficulty) => {
  const colors = {
    'iniciante': '#10b981',
    'intermediário': '#f59e0b',
    'intermediario': '#f59e0b',
    'avançado': '#ef4444',
    'avancado': '#ef4444'
  }
  return colors[difficulty?.toLowerCase()] || '#6b7280'
}

const getDifficultyText = (difficulty) => {
  const texts = {
    'easy': 'Fácil',
    'facil': 'Fácil', 
    'medium': 'Médio',
    'medio': 'Médio',
    'hard': 'Difícil',
    'dificil': 'Difícil'
  }
  return texts[difficulty?.toLowerCase()] || 'Médio'
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

/* Estilos para modo de edição pós-conclusão */
.progress-header-edit {
  background: linear-gradient(135deg, #f8d7da 0%, #ffe6e6 100%);
  border: 2px dashed #dc3545;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.1);
  animation: editPulse 2s infinite;
}

@keyframes editPulse {
  0%, 100% { 
    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.1);
  }
  50% { 
    box-shadow: 0 6px 12px rgba(220, 53, 69, 0.2);
  }
}

.edit-mode-container {
  background: #fff5f5;
  border: 2px solid #ff6b6b;
  border-radius: 10px;
  position: relative;
  padding: 15px;
}

.edit-mode-container::before {
  content: '✏️ MODO EDIÇÃO';
  position: absolute;
  top: -10px;
  left: 10px;
  background: #ff6b6b;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: center;
}

.edit-actions button {
  min-width: 120px;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-save-edit {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
}

.btn-save-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-cancel-edit {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  border: none;
  color: white;
}

.btn-cancel-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-edit-completed {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.btn-edit-completed:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
}

.btn-edit-completed i {
  font-size: 0.75rem;
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

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-info {
  flex: 1;
}

.btn-show-sidebar-header {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--bg-secondary);
  color: var(--primary-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 12px;
  border: 2px solid var(--border-color);
}

.btn-show-sidebar-header:hover {
  background: var(--primary-color);
  color: white;
  transform: scale(1.05);
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-show-sidebar-header i {
  font-size: 1.1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-info {
  flex: 1;
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
  margin: 0 0 0.5rem 0;
}

.exercise-info-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.exercise-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-color);
}

.exercise-badges {
  display: flex;
  gap: 0.5rem;
}

.category-badge,
.difficulty-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
}

.series-progress-badge {
  padding: 0.5rem 1rem;
  background: var(--success-color);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  margin: 0;
}

.btn-close-new:hover {
  background: var(--border-color);
  color: var(--text-color);
}

/* Progress Bar */
.workout-progress-container {
  display: flex;
  flex-direction: column;
}

.workout-progress-bar {
  height: 4px;
  background: var(--border-color);
  position: relative;
}

.workout-progress-bar.main-progress {
  height: 6px;
}

.workout-progress-bar.exercise-progress {
  height: 3px;
  background: rgba(59, 130, 246, 0.2);
}

.workout-progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.5s ease;
}

.workout-progress-fill.exercise-fill {
  background: var(--success-color);
}

/* Body - Layout com Sidebar */
.workout-body-new {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.workout-body-new.sidebar-hidden {
  flex-direction: row;
}

.workout-body-new.sidebar-hidden .exercise-main-content {
  width: 100%;
  position: relative;
}

.sidebar-toggle-container {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 50px;
  display: flex;
  align-items: center;
  z-index: 10;
}

.btn-show-sidebar {
  padding: 1rem 0.5rem;
  background: var(--primary-color);
  border: none;
  border-radius: 0 12px 12px 0;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.btn-show-sidebar:hover {
  background: var(--primary-hover);
  transform: translateX(4px);
}

.btn-show-sidebar span {
  font-size: 0.75rem;
  letter-spacing: 1px;
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

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-header h3 {
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
}

.btn-hide-sidebar {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-hide-sidebar:hover {
  background: var(--danger-color);
  color: white;
  transform: scale(1.1);
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
  position: relative;
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
  font-family: "Inter", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 163px;
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
  height: 380px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
  background: var(--bg-secondary);
}

.exercise-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Loading state para imagens */
.exercise-image-loading {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--card-bg) 100%);
  color: var(--text-muted);
  gap: 1rem;
}

.loading-spinner-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  }
}

.exercise-image-loading p {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-muted);
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

/* Séries - Layout Moderno */
.current-set-container {
  background: linear-gradient(145deg, var(--card-bg) 0%, var(--bg-secondary) 100%);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 1.75rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.set-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 2px solid var(--border-color);
}

.set-header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.set-header-title i {
  color: var(--primary-color);
  font-size: 1.25rem;
}

.set-header-title h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.set-progress-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.set-progress-header h3 i {
  color: var(--primary-color);
}

.set-progress-visual {
  display: flex;
  gap: 0.625rem;
  align-items: center;
}

.progress-dot {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.progress-dot::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.progress-dot:hover::before {
  opacity: 1;
}

.progress-dot.pending {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-muted);
}

.progress-dot.pending:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.progress-dot.active {
  background: linear-gradient(135deg, var(--primary-color) 0%, #2563eb 100%);
  border: 2px solid var(--primary-color);
  color: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(59, 130, 246, 0.3);
  transform: scale(1.15);
}

.progress-dot.active::before {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
}

.progress-dot.completed {
  background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
  border: 2px solid var(--success-color);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.progress-dot.completed:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.current-set-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

/* Status Banner */
.set-status-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.set-status-banner.completed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border-bottom-color: rgba(16, 185, 129, 0.2);
}

.set-status-banner.editing {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-bottom-color: rgba(59, 130, 246, 0.2);
}

.status-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.set-status-banner.completed .status-icon {
  background: var(--success-color);
  color: white;
}

.set-status-banner.editing .status-icon {
  background: var(--primary-color);
  color: white;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-color);
}

.status-time {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.btn-edit-compact {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-edit-compact:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.set-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.set-number {
  width: 45px;
  height: 45px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.set-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.completed-badge {
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--success-color);
  border-radius: 20px;
  color: var(--success-color);
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.set-inputs-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  padding: 1.5rem 1.25rem;
  align-items: start;
}

/* Inputs Grid Moderno */
.set-inputs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  padding: 1.5rem 1.25rem;
  align-items: start;
}

.input-card {
  display: grid;
  grid-template-rows: 32px 48px auto;
  gap: 0.75rem;
  align-items: stretch;
}

.input-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0;
  min-height: 32px;
  height: 32px;
  max-height: 32px;
}

.input-header i {
  color: var(--primary-color);
  font-size: 1.1rem;
}

.input-header label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-color);
  flex: 1;
}

.body-weight-tag {
  padding: 0.25rem 0.625rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  color: var(--primary-color);
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.input-field {
  padding: 0.875rem 1.125rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 1.125rem;
  font-weight: 700;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  height: 48px;
  margin: 0;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--card-bg);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.input-field:disabled {
  background: var(--bg-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.input-helper {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  font-weight: 500;
  min-height: 18px;
  line-height: 18px;
}

.weight-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  height: 48px;
  justify-content: center;
}

.weight-input-wrapper .input-field,
.body-weight-display-modern,
.btn-set-weight-modern {
  margin: 0;
  height: 48px;
}

.body-weight-display-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.125rem;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--card-bg) 100%);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  gap: 0.75rem;
  height: 48px;
  box-sizing: border-box;
}

.body-weight-display-modern .weight-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
  flex: 1;
  text-align: center;
}

.btn-edit-weight-mini {
  width: 32px;
  height: 32px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-edit-weight-mini:hover {
  background: var(--primary-hover);
  transform: scale(1.1);
}

.btn-set-weight-modern {
  padding: 0.875rem 1.125rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 48px;
  box-sizing: border-box;
}

.btn-set-weight-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.input-group {
  display: grid;
  grid-template-rows: 24px 1fr;
  gap: 0.75rem;
  align-items: start;
  align-self: start;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
  display: block;
  flex-shrink: 0;
  height: 24px;
  line-height: 24px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.input-group label i {
  color: var(--primary-color);
  margin-right: 0.5rem;
}

.body-weight-indicator {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 400;
  margin-left: 0.25rem;
}

.weight-input-container {
  position: relative;
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
}

.reps-input,
.weight-input,
.weight-input-field {
  padding: 0.875rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  display: block;
  height: 48px;
  margin: 0;
}

.reps-input:focus,
.weight-input:focus,
.weight-input-field:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--card-bg);
}

.reps-input:disabled,
.weight-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.body-weight-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid var(--success-color);
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
  height: 48px;
  margin: 0;
}

.weight-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--success-color);
  flex-grow: 1;
}

.btn-edit-weight {
  padding: 0.25rem;
  background: transparent;
  border: 1px solid var(--success-color);
  border-radius: 4px;
  color: var(--success-color);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 0.75rem;
}

.btn-edit-weight:hover {
  background: var(--success-color);
  color: white;
}

.btn-set-weight {
  padding: 0.875rem 1rem;
  background: var(--primary-color);
  border: 2px solid transparent;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 0.90rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  margin: 0;
}

.btn-set-weight:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.set-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-complete-set {
  padding: 0.875rem 1.75rem;
  background: var(--success-color);
  border: none;
  border-radius: 10px;
  color: white;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-complete-set:hover {
  transform: translateY(-1px);
  background: #059669;
}

.set-completed-info {
  text-align: center;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 12px;
}

.completion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0;
}

.completion-time {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0;
}

.completion-time i {
  color: var(--success-color);
}

/* Difficulty Indicator */
.difficulty-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.difficulty-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.difficulty-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
}

.difficulty-value {
  padding: 0.375rem 0.875rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 700;
}

.difficulty-value.difficulty-easy,
.difficulty-value.difficulty-facil {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success-color);
}

.difficulty-value.difficulty-medium,
.difficulty-value.difficulty-medio {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.difficulty-value.difficulty-hard,
.difficulty-value.difficulty-dificil {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

/* Actions Modernas */
.set-actions-modern {
  padding: 1.25rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.btn-complete-modern {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.btn-complete-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.btn-complete-modern:active {
  transform: translateY(0);
}

.edit-actions-modern {
  display: flex;
  gap: 1rem;
}

.btn-cancel-modern,
.btn-save-modern {
  flex: 1;
  padding: 0.875rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel-modern {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.btn-cancel-modern:hover {
  background: var(--border-color);
  transform: translateY(-1px);
}

.btn-save-modern {
  background: linear-gradient(135deg, var(--primary-color) 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.btn-save-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.difficulty-feedback {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.difficulty-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.difficulty-text {
  font-weight: 700;
  font-size: 0.9rem;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.difficulty-text.difficulty-easy,
.difficulty-text.difficulty-facil {
  color: #007bff;
  background: rgba(0, 123, 255, 0.1);
}

.difficulty-text.difficulty-medium,
.difficulty-text.difficulty-medio {
  color: #ffc107;
  background: rgba(255, 193, 7, 0.1);
}

.difficulty-text.difficulty-hard,
.difficulty-text.difficulty-dificil {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
}

.set-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  gap: 1rem;
}

.btn-nav-set {
  padding: 0.625rem 2rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 180px;
}

.btn-nav-set:hover:not(:disabled) {
  background: var(--border-color);
  transform: translateY(-1px);
}

.btn-nav-set:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.set-counter {
  padding: 0.5rem 1rem;
  color: #0f172a;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.85rem;
  min-width: 70px;
  text-align: center;
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
  gap: 16px;
  padding: 2rem;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 1px solid var(--border-color);
}

.btn-save-new,
.btn-finish-new {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  max-width: 280px;
  min-height: 56px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  font-family: inherit;
}

.btn-save-new {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.btn-save-new:hover {
  background: var(--bg-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-finish-new {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  margin-left: auto;
}

.btn-finish-new::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  transition: left 0.5s ease;
}

.btn-finish-new:hover::before {
  left: 100%;
}

.btn-finish-new:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.btn-finish-new:active {
  transform: translateY(0);
}

.btn-finish-new:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-finish-new:disabled::before {
  display: none;
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

/* Modal de Feedback de Entrada de Peso */
.weight-modal-overlay {
  background: rgba(0, 0, 0, 0.8);
  z-index: 1200;
}

.weight-modal {
  max-width: 400px;
  background: var(--card-bg);
  border: 2px solid var(--primary-color);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.weight-modal-header {
  text-align: center;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.weight-modal-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.weight-modal-header h2 i {
  color: var(--primary-color);
}

.weight-modal-header p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.weight-modal-body {
  padding: 2rem;
}

.weight-input-section {
  margin-bottom: 2rem;
}

.weight-input-section label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
  text-align: center;
}

.weight-input-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 0.5rem;
  transition: all 0.2s ease;
}

.weight-input-group:focus-within {
  border-color: var(--primary-color);
  background: var(--card-bg);
}

.weight-input-group .weight-input-field {
  border: none;
  background: transparent;
  padding: 0.75rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.weight-unit {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding-right: 0.5rem;
}

.weight-modal-actions {
  display: flex;
  gap: 1rem;
}

.btn-cancel,
.btn-confirm {
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

.btn-cancel {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.btn-cancel:hover {
  background: var(--border-color);
}

.btn-confirm {
  background: var(--primary-color);
  border: none;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal de Dificuldade */
.difficulty-modal-overlay {
  background: rgba(0, 0, 0, 0.8);
  z-index: 1150;
}

.difficulty-modal {
  max-width: 500px;
  background: var(--card-bg);
  border: 2px solid var(--primary-color);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.difficulty-modal-header {
  text-align: center;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.difficulty-modal-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.difficulty-modal-header h2 i {
  color: #fbbf24;
}

.difficulty-modal-header p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.95rem;
}

.difficulty-modal-body {
  padding: 2rem;
}

.difficulty-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.difficulty-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.difficulty-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.difficulty-option.easy {
  border-color: #10b981;
}

.difficulty-option.easy:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
}

.difficulty-option.medium {
  border-color: #f59e0b;
}

.difficulty-option.medium:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}

.difficulty-option.hard {
  border-color: #ef4444;
}

.difficulty-option.hard:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.difficulty-option.neutral {
  border-color: #6b7280;
}

.difficulty-option.neutral:hover {
  background: rgba(107, 114, 128, 0.1);
  border-color: #6b7280;
}

.difficulty-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.difficulty-option.easy .difficulty-icon {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.difficulty-option.medium .difficulty-icon {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.difficulty-option.hard .difficulty-icon {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.difficulty-option.neutral .difficulty-icon {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
}

.difficulty-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.difficulty-info p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}
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
  height: 380px;
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
  /* Header Responsivo */
  .workout-header-compact {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-left,
  .header-right {
    text-align: center;
  }
  
  .header-right {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .exercise-info-compact {
    align-items: center;
  }
  
  .exercise-badges {
    justify-content: center;
  }
  
  /* Progress Responsivo */
  .set-progress-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .progress-dot {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
  
  /* Série Atual Responsivo */
  .set-inputs-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .set-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .set-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-nav-set {
    width: 100%;
    justify-content: center;
  }
  
  /* Modal de Dificuldade Responsivo */
  .difficulty-modal {
    max-width: 95vw;
    margin: 1rem;
  }
  
  .difficulty-option {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .difficulty-icon {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  }
  
  /* Modal de Peso Responsivo */
  .weight-modal {
    max-width: 95vw;
    margin: 1rem;
  }
  
  .weight-modal-actions {
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
    padding: 1rem;
  }

  .workout-footer-new {
    flex-direction: column;
    gap: 12px;
  }

  .btn-save-new,
  .btn-finish-new {
    padding: 12px 20px;
    font-size: 0.9rem;
    min-height: 48px;
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

/* Modal de Pular Exercício */
.skip-modal-overlay {
  background: rgba(0, 0, 0, 0.8);
  z-index: 1300;
}

.skip-modal {
  max-width: 450px;
  background: var(--card-bg);
  border: 2px solid #ff6b35;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.skip-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.skip-modal-header h3 {
  margin: 0;
  color: #ff6b35;
  font-size: 1.3rem;
  font-weight: 600;
}

.skip-modal-body {
  padding: 1.5rem;
}

.skip-modal-body p {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  line-height: 1.6;
}

.skip-reason-container {
  margin-top: 1rem;
}

.skip-reason-container label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.skip-reason-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--input-bg);
  font-size: 1rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.custom-reason-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--input-bg);
  font-size: 1rem;
  color: var(--text-color);
  min-height: 80px;
  resize: vertical;
}

.skip-modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-skip-confirm {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-skip-confirm:hover {
  background: #e55a2b;
  transform: translateY(-2px);
}

/* Botão de Pular Exercício */
.btn-skip-exercise {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.btn-skip-exercise:hover {
  background: linear-gradient(135deg, #e55a2b, #d17b1a);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

/* Indicador de exercício pulado */
.skipped-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 107, 53, 0.1);
  border: 2px solid rgba(255, 107, 53, 0.3);
  border-radius: 12px;
  color: #ff6b35;
  font-weight: 600;
}

.skipped-indicator i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .skip-modal {
    max-width: 95vw;
    margin: 1rem;
  }
  
  .skip-modal-actions {
    flex-direction: column;
  }
}
</style>