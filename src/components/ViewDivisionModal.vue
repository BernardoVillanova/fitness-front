<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="header-main">
            <button @click="$emit('back')" class="back-btn">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="header-info">
              <h2 class="division-title">{{ division?.name || 'Divisão de Treino' }}</h2>
              <p class="division-subtitle">{{ division?.description || 'Visualização detalhada dos exercícios' }}</p>
            </div>
          </div>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Division Stats -->
        <div class="division-stats">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-dumbbell"></i>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ division?.exercises?.length || 0 }}</span>
              <span class="stat-label">Exercícios</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-muscle"></i>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ getMuscleGroups().length }}</span>
              <span class="stat-label">Grupos Musculares</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ getEstimatedDuration() }}</span>
              <span class="stat-label">min estimados</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-fire"></i>
            </div>
            <div class="stat-info">
              <span class="stat-number">{{ getTotalSets() }}</span>
              <span class="stat-label">Séries Totais</span>
            </div>
          </div>
        </div>
        
        <!-- Muscle Groups Tags -->
        <div v-if="getMuscleGroups().length > 0" class="muscle-groups">
          <span 
            v-for="group in getMuscleGroups()" 
            :key="group"
            class="muscle-tag"
          >
            {{ group }}
          </span>
        </div>
      </div>

      <!-- Body -->
      <div class="modal-body">        
        <!-- Exercise List -->
        <div class="exercises-container">
          <div 
            v-for="(exercise, index) in division?.exercises" 
            :key="`exercise-${index}`"
            class="exercise-card"
            :class="{ 'exercise-expanded': expandedExercise === index }"
          >
            <!-- Exercise Header -->
            <div class="exercise-header" @click="toggleExercise(index)">
              <div class="exercise-main-info">
                <div class="exercise-number">{{ index + 1 }}</div>
                <div class="exercise-details">
                  <h4 class="exercise-name">{{ exercise.name }}</h4>
                  <div class="exercise-meta">
                    <span class="meta-item">
                      <i class="fas fa-repeat"></i>
                      {{ exercise.sets }}x{{ exercise.reps }}
                    </span>
                    <span v-if="exercise.idealWeight" class="meta-item">
                      <i class="fas fa-weight-hanging"></i>
                      {{ exercise.idealWeight }}kg
                    </span>
                    <span v-if="exercise.restTime" class="meta-item">
                      <i class="fas fa-stopwatch"></i>
                      {{ formatRestTime(exercise.restTime) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="exercise-actions">
                <button class="expand-btn" :class="{ active: expandedExercise === index }">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>

            <!-- Exercise Expanded Content -->
            <div v-if="expandedExercise === index" class="exercise-content">
              <div class="exercise-grid">
                <!-- Image Section -->
                <div class="exercise-image-section">
                  <div class="exercise-image-container">
                    <img 
                      v-if="exercise.image" 
                      :src="getImageUrl(exercise.image)" 
                      :alt="exercise.name" 
                      class="exercise-image"
                      @error="onImageError"
                      @load="onImageLoad"
                    />
                    <div 
                      v-else
                      class="exercise-placeholder large"
                    >
                      <i class="fas fa-dumbbell"></i>
                      <span>Imagem não disponível</span>
                      <small>{{ exercise.name }}</small>
                    </div>
                  </div>
                </div>
                
                <!-- Details Section -->
                <div class="exercise-details-section">
                <!-- Description -->
                <div class="detail-block">
                  <h5 class="detail-title">
                    <i class="fas fa-info-circle"></i>
                    Descrição
                  </h5>
                  <p class="detail-text">
                    {{ getExerciseDescription(exercise) }}
                  </p>
                </div>                  <!-- Exercise Parameters -->
                  <div class="detail-block">
                    <h5 class="detail-title">
                      <i class="fas fa-cogs"></i>
                      Parâmetros
                    </h5>
                    <div class="parameters-grid">
                      <div class="parameter-item">
                        <span class="parameter-label">Séries:</span>
                        <span class="parameter-value">{{ exercise.sets }}</span>
                      </div>
                      <div class="parameter-item">
                        <span class="parameter-label">Repetições:</span>
                        <span class="parameter-value">{{ exercise.reps }}</span>
                      </div>
                      <div v-if="exercise.idealWeight" class="parameter-item">
                        <span class="parameter-label">Peso Ideal:</span>
                        <span class="parameter-value">{{ exercise.idealWeight }}kg</span>
                      </div>
                      <div class="parameter-item">
                        <span class="parameter-label">Descanso:</span>
                        <span class="parameter-value">{{ formatRestTime(exercise.restTime || 60) }}</span>
                      </div>
                      <div v-if="exercise.toFailure" class="parameter-item full-width">
                        <span class="parameter-label">
                          <i class="fas fa-fire text-orange-500"></i>
                          Ir até a falha
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Notes -->
                  <div v-if="exercise.notes" class="detail-block">
                    <h5 class="detail-title">
                      <i class="fas fa-sticky-note"></i>
                      Observações
                    </h5>
                    <p class="detail-text notes">{{ exercise.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <div class="footer-stats">
          <div class="footer-stat">
            <i class="fas fa-dumbbell"></i>
            <span>{{ division?.exercises?.length || 0 }} exercícios</span>
          </div>
          <div class="footer-stat">
            <i class="fas fa-clock"></i>
            <span>~{{ getEstimatedDuration() }} minutos</span>
          </div>
          <div class="footer-stat">
            <i class="fas fa-fire"></i>
            <span>{{ getTotalSets() }} séries totais</span>
          </div>
        </div>
        
        <div class="footer-actions">
          <button @click="closeModal" class="action-btn primary">
            Fechar
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <NotificationModal
      v-model:visible="notification.visible"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
    />
  </div>
</template>

<script>
import NotificationModal from './NotificationModal.vue';
import { API_URL } from '@/config';

export default {
  name: 'ViewDivisionModal',
  components: {
    NotificationModal
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    division: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      expandedExercise: null,
      notification: {
        visible: false,
        type: '',
        title: '',
        message: ''
      }
    };
  },
  emits: ['close', 'back'],
  methods: {
    showNotification(type, title, message) {
      this.notification = {
        visible: true,
        type: type,
        title: title,
        message: message
      };
    },
    
    closeModal() {
      this.$emit('close');
    },
    
    toggleExercise(index) {
      this.expandedExercise = this.expandedExercise === index ? null : index;
    },
    
    getMuscleGroups() {
      if (!this.division?.muscleGroups) return [];
      return this.division.muscleGroups;
    },
    
    // Dados padrão para exercícios comuns
    getExerciseDefaults(exerciseName) {
      const defaults = {
        'Flexão Padrão': {
          description: 'Exercício clássico para desenvolvimento do peitoral, tríceps e ombros. Mantenha o corpo reto e desça até o peito quase tocar o chão.',
          image: null, // Será usado placeholder
          muscleGroups: ['Peitoral', 'Tríceps', 'Ombros']
        },
        'Agachamento': {
          description: 'Exercício fundamental para desenvolvimento dos membros inferiores. Desça mantendo os joelhos alinhados com os pés.',
          image: null,
          muscleGroups: ['Quadríceps', 'Glúteos', 'Core']
        },
        'Abdominal': {
          description: 'Exercício para fortalecimento do core. Contraia o abdômen e evite puxar o pescoço.',
          image: null,
          muscleGroups: ['Abdômen', 'Core']
        },
        'Flexão de Braços': {
          description: 'Variação da flexão tradicional focada no desenvolvimento da força dos braços e peitoral.',
          image: null,
          muscleGroups: ['Peitoral', 'Tríceps', 'Ombros']
        }
      };
      
      return defaults[exerciseName] || {
        description: 'Exercício para desenvolvimento muscular. Execute com técnica adequada e cargas progressivas.',
        image: null,
        muscleGroups: []
      };
    },
    
    // Método melhorado para pegar descrição com fallback
    getExerciseDescription(exercise) {
      if (exercise.description) {
        return exercise.description;
      }
      
      const defaults = this.getExerciseDefaults(exercise.name);
      return defaults.description;
    },
    
    getTotalSets() {
      if (!this.division?.exercises) return 0;
      return this.division.exercises.reduce((total, exercise) => {
        return total + (exercise.sets || 0);
      }, 0);
    },
    
    getEstimatedDuration() {
      if (!this.division?.exercises) return 0;
      
      let totalTime = 0;
      this.division.exercises.forEach(exercise => {
        // Tempo estimado: (sets * 30s para execução) + (sets * tempo de descanso)
        const executionTime = (exercise.sets || 0) * 30; // 30s por série
        const restTime = (exercise.sets || 0) * (exercise.restTime || 60); // tempo de descanso
        totalTime += executionTime + restTime;
      });
      
      return Math.round(totalTime / 60); // converter para minutos
    },
    
    formatRestTime(seconds) {
      if (seconds < 60) return `${seconds}s`;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m${remainingSeconds}s` : `${minutes}m`;
    },
    
    getImageUrl(imagePath, stateKey = null) {
      if (!imagePath) {
        return null;
      }
      
      // Se temos uma URL que sabemos que funciona, usar ela
      if (stateKey && this.imageStates[stateKey]?.workingUrl) {
        const workingPath = this.imageStates[stateKey].workingUrl;
        if (workingPath.startsWith('http')) return workingPath;
        
        const baseUrl = `${API_URL}`;
        const path = workingPath.startsWith('/') ? workingPath : `/${workingPath}`;
        return `${baseUrl}${path}`;
      }
      
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      // Construir URL correta para as imagens
      const baseUrl = `${API_URL}`;
      let path = imagePath;
      
      // Se não começa com /uploads, adicionar
      if (!path.startsWith('/uploads')) {
        path = `/uploads/exercises/${path}`;
      }
      
      const finalUrl = `${baseUrl}${path}`;
      return finalUrl;
    },



    onImageError(event) {
      console.warn('Erro ao carregar imagem:', event.target.src);
      // Substituir a imagem por um placeholder
      event.target.style.display = 'none';
      const placeholder = event.target.nextElementSibling || event.target.parentElement.querySelector('.exercise-placeholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    },

    onImageLoad(event) {
      console.log('Imagem carregada com sucesso:', event.target.src);
      // Esconder placeholder se existir
      const placeholder = event.target.nextElementSibling || event.target.parentElement.querySelector('.exercise-placeholder');
      if (placeholder) {
        placeholder.style.display = 'none';
      }
    },


  },
  
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
        this.expandedExercise = null;
      } else {
        document.body.style.overflow = '';
      }
    }
  },
  


  beforeUnmount() {
    document.body.style.overflow = '';
  }
}
</script>

<style scoped>
/* CSS Variables */
:root {
  /* Light mode */
  --card-bg: #ffffff;
  --text-color: #0f172a;
  --text-muted: #64748b;
  --text-secondary: #475569;
  --border-color: #e2e8f0;
  --bg-secondary: #f8fafc;
}

[data-theme="dark"] {
  /* Dark mode */
  --card-bg: #1e1e2d;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --text-secondary: #6b7280;
  --border-color: #2d2d3f;
  --bg-secondary: #171723;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header Styles */
.modal-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-main {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
}

.back-btn {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-color);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.back-btn:hover {
  background: var(--card-bg);
  border-color: var(--text-muted);
  transform: translateX(-4px);
}

.header-info {
  flex: 1;
}

.division-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: 1.2;
  color: var(--text-color);
}

.division-subtitle {
  font-size: 1.1rem;
  margin: 0;
  color: var(--text-muted);
  font-weight: 400;
}

.close-btn {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-color);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.close-btn:hover {
  background: var(--card-bg);
  border-color: var(--text-muted);
  transform: scale(1.1);
}

/* Division Stats */
.division-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
  padding: 0;
  background: transparent;
  border-radius: 0;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.3s ease;
  border: 2px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.stat-card:hover::before {
  opacity: 0.05;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text-color);
  margin: 0;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 2px;
  color: var(--text-muted);
}

/* Muscle Groups */
.muscle-groups {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 2px solid var(--border-color);
  margin-bottom: 24px;
}

.muscle-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.muscle-tag:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Modal Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* Debug Info */
.debug-info {
  padding: 20px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  margin: 20px;
  color: #856404;
  text-align: center;
  font-weight: 600;
}

.exercises-container {
  padding: 24px;
}

/* Exercise Card */
.exercise-card {
  background: #ffffff;
  border: 2px solid #f0f2f5;
  border-radius: 20px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.exercise-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.exercise-expanded {
  border-color: #667eea;
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
}

.exercise-header {
  padding: 20px 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.exercise-header:hover {
  background: #f8f9fa;
}

.exercise-main-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.exercise-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.exercise-details {
  flex: 1;
}

.exercise-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.exercise-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.meta-item i {
  color: #667eea;
}

.exercise-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expand-btn {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  color: #6c757d;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.expand-btn:hover {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.expand-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: rotate(180deg);
}

/* Exercise Content */
.exercise-content {
  padding: 0 24px 24px 24px;
  border-top: 1px solid #f0f2f5;
}

.exercise-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  margin-top: 24px;
}

.exercise-image-section {
  display: flex;
  flex-direction: column;
}

.exercise-image-container {
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  background: #f8f9fa;
  margin-bottom: 16px;
}

.exercise-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exercise-placeholder {
  width: 100%;
  height: 200px;
  border-radius: 16px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  margin-bottom: 16px;
}

.exercise-placeholder.large {
  height: 300px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px dashed #dee2e6;
}

.exercise-placeholder i {
  font-size: 2.5rem;
  margin-bottom: 8px;
  opacity: 0.5;
}

.exercise-placeholder.large i {
  font-size: 3.5rem;
  margin-bottom: 12px;
  color: #adb5bd;
}

.exercise-placeholder span {
  font-weight: 600;
  font-size: 1rem;
}

.exercise-placeholder small {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-top: 4px;
  text-align: center;
}

.exercise-details-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-block {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
}

.detail-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.detail-title i {
  color: #667eea;
}

.detail-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4a5568;
  margin: 0;
}

.detail-text.notes {
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.parameters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.parameter-item {
  background: white;
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.parameter-item.full-width {
  grid-column: 1 / -1;
  justify-content: flex-start;
  gap: 8px;
}

.parameter-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 600;
}

.parameter-value {
  font-size: 0.95rem;
  color: #2d3748;
  font-weight: 700;
}

/* Modal Footer */
.modal-footer {
  background: #f8f9fa;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.footer-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 0.95rem;
  font-weight: 600;
}

.footer-stat i {
  color: #667eea;
}

.footer-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: #6c757d;
  color: white;
}

.action-btn.secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.action-btn.ghost {
  background: transparent;
  color: #6c757d;
  border: 2px solid #e9ecef;
}

.action-btn.ghost:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 24px;
  }
  
  .header-main {
    flex-direction: column;
    gap: 12px;
  }
  
  .division-title {
    font-size: 1.8rem;
  }
  
  .division-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 16px;
  }
  
  .stat-card {
    padding: 20px 16px;
    gap: 12px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
  }
  
  .stat-number {
    font-size: 1.6rem;
  }
  
  .muscle-groups {
    padding: 16px;
    gap: 10px;
  }
  
  .muscle-tag {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .exercise-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .exercise-image-container {
    height: 160px;
  }
  
  .parameters-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .footer-actions {
    justify-content: stretch;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .division-stats {
    grid-template-columns: 1fr;
    padding: 12px;
    gap: 12px;
  }
  
  .stat-card {
    padding: 18px 14px;
  }
  
  .stat-icon {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }
  
  .stat-number {
    font-size: 1.4rem;
  }
  
  .muscle-groups {
    padding: 14px;
    gap: 8px;
  }
  
  .muscle-tag {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
  
  .exercise-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .exercise-actions {
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }
}

/* Print Styles */
@media print {
  .modal-overlay {
    background: white;
    position: static;
  }
  
  .modal-container {
    box-shadow: none;
    max-height: none;
  }
  
  .modal-header {
    background: white;
    color: black;
  }
  
  .back-btn,
  .close-btn,
  .expand-btn,
  .modal-footer {
    display: none;
  }
  
  .exercise-content {
    display: block !important;
  }
}

.text-orange-500 {
  color: #f97316;
}

/* Loading States */
.exercise-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  z-index: 1;
}

.exercise-loading i {
  font-size: 1.2rem;
  color: #667eea;
}

.exercise-loading-full {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  z-index: 1;
  gap: 12px;
}

.exercise-loading-full i {
  font-size: 2rem;
  color: #667eea;
}

.exercise-loading-full span {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

/* Retry Button */
.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.retry-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.retry-btn i {
  font-size: 0.9rem;
}

/* Image States */
.exercise-image-container {
  position: relative;
}

/* Improved placeholder styles */
.exercise-placeholder {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #6c757d;
  text-align: center;
}

.exercise-placeholder i {
  opacity: 0.6;
}

.exercise-placeholder span {
  font-weight: 500;
}

/* Fade in animation for loaded images */
.exercise-image {
  transition: opacity 0.3s ease;
}

.exercise-image[style*="display: block"] {
  animation: fadeInImage 0.5s ease-out;
}

@keyframes fadeInImage {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Loading spinner animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fa-spin {
  animation: spin 1s linear infinite;
}

/* Dark mode adjustments for loading states */
[data-theme="dark"] .exercise-loading {
  background: rgba(30, 30, 45, 0.9);
}

[data-theme="dark"] .exercise-loading-full {
  background: rgba(30, 30, 45, 0.95);
}
</style>