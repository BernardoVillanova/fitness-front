<template>
  <div v-if="show && !showDivisionModal" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="header-info">
            <h2 class="plan-title">{{ plan?.name || 'Ficha de Treino' }}</h2>
            <p class="plan-subtitle">{{ plan?.description || 'Visualização completa do plano de exercícios' }}</p>
          </div>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- Quick Overview -->
        <div class="quick-overview">
          <h3 class="section-title">
            <i class="fas fa-chart-line"></i>
            Resumo do Plano
          </h3>
          <div class="overview-grid">
            <div class="overview-card">
              <div class="overview-header">
                <i class="fas fa-muscle"></i>
                <span>Grupos Musculares</span>
              </div>
              <div class="muscle-groups">
                <span 
                  v-for="group in getAllMuscleGroups()" 
                  :key="group"
                  class="muscle-tag"
                >
                  {{ group }}
                </span>
              </div>
            </div>
            
            <div class="overview-card">
              <div class="overview-header">
                <i class="fas fa-weight-hanging"></i>
                <span>Equipamentos</span>
              </div>
              <div class="equipment-list">
                <span 
                  v-for="equipment in getUniqueEquipments()" 
                  :key="equipment"
                  class="equipment-tag"
                >
                  {{ equipment }}
                </span>
                <span v-if="getUniqueEquipments().length === 0" class="no-data">
                  Nenhum equipamento específico
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Divisions List -->
        <div class="divisions-section">
          <h3 class="section-title">
            <i class="fas fa-th-large"></i>
            Divisões de Treino ({{ plan?.divisions?.length || 0 }})
          </h3>
          
          <div class="divisions-grid">
            <div 
              v-for="(division, index) in plan?.divisions" 
              :key="division._id || index"
              class="division-card"
              @click="openDivisionModal(division, index)"
            >
              <!-- Division Header -->
              <div class="division-header">
                <div class="division-indicator">
                  <span class="division-letter">{{ String.fromCharCode(65 + index) }}</span>
                </div>
                <div class="division-info">
                  <h4 class="division-name">{{ division.name }}</h4>
                  <p class="division-description">{{ division.description || 'Sem descrição' }}</p>
                </div>
                <div class="division-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
              
              <!-- Division Preview -->
              <div class="division-preview">
                <div class="preview-stats">
                  <div class="preview-stat">
                    <i class="fas fa-dumbbell"></i>
                    <span>{{ division.exercises?.length || 0 }} exercícios</span>
                  </div>
                  <div class="preview-stat">
                    <i class="fas fa-clock"></i>
                    <span>~{{ getDivisionDuration(division) }} min</span>
                  </div>
                  <div class="preview-stat">
                    <i class="fas fa-repeat"></i>
                    <span>{{ getDivisionSets(division) }} séries</span>
                  </div>
                </div>
                
                <!-- Muscle Groups Preview -->
                <div v-if="division.muscleGroups && division.muscleGroups.length > 0" class="muscle-preview">
                  <span 
                    v-for="muscle in division.muscleGroups.slice(0, 3)" 
                    :key="muscle"
                    class="muscle-chip"
                  >
                    {{ muscle }}
                  </span>
                  <span v-if="division.muscleGroups.length > 3" class="muscle-chip more">
                    +{{ division.muscleGroups.length - 3 }}
                  </span>
                </div>
                
                <!-- Exercise Preview -->
                <div class="exercises-preview">
                  <div class="preview-exercises">
                    <div 
                      v-for="(exercise, exerciseIndex) in division.exercises?.slice(0, 3)" 
                      :key="`preview-${exerciseIndex}`"
                      class="preview-exercise"
                    >
                      <div class="exercise-thumb">
                        <img 
                          v-if="exercise.image" 
                          :src="getImageUrl(exercise.image)" 
                          :alt="exercise.name"
                          @error="onImageError"
                          @load="onImageLoad"
                          style="display: block;"
                        />
                        <div class="exercise-placeholder" :style="{ display: exercise.image ? 'none' : 'flex' }">
                          <i class="fas fa-dumbbell"></i>
                        </div>
                      </div>
                      <span class="exercise-preview-name">{{ exercise.name }}</span>
                    </div>
                  </div>
                  
                  <div v-if="division.exercises && division.exercises.length > 3" class="more-exercises">
                    <div class="more-indicator">
                      <i class="fas fa-plus"></i>
                      <span>{{ division.exercises.length - 3 }} mais</span>
                    </div>
                  </div>
                </div>
              </div>
              

            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <div class="footer-info">
          <div class="info-item">
            <i class="fas fa-info-circle"></i>
            <span>Clique em uma divisão para visualizar os detalhes dos exercícios</span>
          </div>
        </div>
        
        <div class="footer-actions">
          <button @click="closeModal" class="action-btn primary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Division Detail Modal -->
  <ViewDivisionModal
    :show="showDivisionModal"
    :division="selectedDivision"
    @close="closeDivisionModal"
    @back="closeDivisionModal"
  />

  <!-- Notification Modal -->
  <NotificationModal
    v-model:visible="notification.visible"
    :type="notification.type"
    :title="notification.title"
    :message="notification.message"
  />
</template>

<script>
import NotificationModal from './NotificationModal.vue';
import ViewDivisionModal from './ViewDivisionModal.vue';
import { API_URL } from '@/config';

export default {
  name: 'ViewPlanModal',
  components: {
    NotificationModal,
    ViewDivisionModal
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    plan: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showDivisionModal: false,
      selectedDivision: null,
      selectedDivisionIndex: null,
      notification: {
        visible: false,
        type: '',
        title: '',
        message: ''
      }
    };
  },
  emits: ['close'],
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
      this.showDivisionModal = false;
      this.selectedDivision = null;
      this.selectedDivisionIndex = null;
      this.$emit('close');
    },
    
    openDivisionModal(division, index) {
      this.selectedDivision = division;
      this.selectedDivisionIndex = index;
      this.showDivisionModal = true;
    },
    
    closeDivisionModal() {
      this.showDivisionModal = false;
      this.selectedDivision = null;
      this.selectedDivisionIndex = null;
    },
    
    viewDivisionDetails(division, index) {
      this.openDivisionModal(division, index);
    },
    

    
    getTotalExercises() {
      if (!this.plan?.divisions) return 0;
      return this.plan.divisions.reduce((total, division) => {
        return total + (division.exercises?.length || 0);
      }, 0);
    },
    
    getTotalSets() {
      if (!this.plan?.divisions) return 0;
      return this.plan.divisions.reduce((total, division) => {
        const divisionSets = division.exercises?.reduce((divTotal, exercise) => {
          return divTotal + (exercise.sets || 0);
        }, 0) || 0;
        return total + divisionSets;
      }, 0);
    },
    
    getEstimatedTotalDuration() {
      if (!this.plan?.divisions) return 0;
      
      let totalTime = 0;
      this.plan.divisions.forEach(division => {
        division.exercises?.forEach(exercise => {
          const executionTime = (exercise.sets || 0) * 30; // 30s por série
          const restTime = (exercise.sets || 0) * (exercise.restTime || 60); // tempo de descanso
          totalTime += executionTime + restTime;
        });
      });
      
      return Math.round(totalTime / 60); // converter para minutos
    },
    
    getDivisionDuration(division) {
      if (!division?.exercises) return 0;
      
      let totalTime = 0;
      division.exercises.forEach(exercise => {
        const executionTime = (exercise.sets || 0) * 30;
        const restTime = (exercise.sets || 0) * (exercise.restTime || 60);
        totalTime += executionTime + restTime;
      });
      
      return Math.round(totalTime / 60);
    },
    
    getDivisionSets(division) {
      if (!division?.exercises) return 0;
      return division.exercises.reduce((total, exercise) => {
        return total + (exercise.sets || 0);
      }, 0);
    },
    
    getAllMuscleGroups() {
      if (!this.plan?.divisions) return [];
      
      const allGroups = new Set();
      this.plan.divisions.forEach(division => {
        if (division.muscleGroups) {
          division.muscleGroups.forEach(group => allGroups.add(group));
        }
      });
      
      return Array.from(allGroups).slice(0, 8); // Limitar a 8 grupos
    },
    
    getUniqueEquipments() {
      if (!this.plan?.divisions) return [];
      const equipments = new Set();
      this.plan.divisions.forEach(division => {
        division.exercises?.forEach(exercise => {
          // Tenta pegar o nome do equipamento de diferentes formas
          let equipmentName = '';
          if (exercise.equipment && typeof exercise.equipment === 'object') {
            equipmentName = exercise.equipment.name || exercise.equipment.label || 'Equipamento';
          } else if (typeof exercise.equipment === 'string') {
            equipmentName = exercise.equipment;
          } else if (exercise.equipmentName) {
            equipmentName = exercise.equipmentName;
          } else {
            equipmentName = 'Equipamento';
          }
          // Só adiciona se não for vazio
          if (equipmentName && equipmentName !== 'undefined') {
            equipments.add(equipmentName);
          }
        });
      });
      return Array.from(equipments).slice(0, 6); // Limitar a 6 equipamentos
    },
    
    getImageUrl(imagePath) {
      if (!imagePath) return null;
      if (typeof imagePath !== 'string') return null;
      if (imagePath.startsWith('http')) return imagePath;
      // Se o caminho não começar com /uploads, adicionar
      let path = imagePath;
      if (!imagePath.startsWith('/uploads')) {
        path = `/uploads/${imagePath.replace(/^\/*/, '')}`;
      }
      return `${API_URL}${path}`;
    },

    onImageError(event) {
      // Esconde a imagem e mostra o placeholder
      event.target.style.display = 'none';
      const placeholder = event.target.parentElement.querySelector('.exercise-placeholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    },

    onImageLoad(event) {
      // Esconde o placeholder se a imagem carregar
      const placeholder = event.target.parentElement.querySelector('.exercise-placeholder');
      if (placeholder) {
        placeholder.style.display = 'none';
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    

  },
  
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        this.closeDivisionModal();
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

/* Base Modal Styles */
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
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    backdrop-filter: blur(0px);
  }
  to { 
    opacity: 1; 
    backdrop-filter: blur(12px);
  }
}

.modal-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 28px;
  width: 100%;
  max-width: 1200px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--border-color);
  animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.92);
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
  padding: 32px 40px;
  position: relative;
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.header-info {
  flex: 1;
}

.plan-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 12px 0;
  line-height: 1.1;
  color: var(--text-color);
}

.plan-subtitle {
  font-size: 1.15rem;
  margin: 0 0 16px 0;
  color: var(--text-muted);
  font-weight: 400;
  line-height: 1.4;
}

.plan-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-chip {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.meta-chip:hover {
  background: var(--card-bg);
  transform: translateY(-2px);
}

.meta-chip.goal {
  background: #fbbf24;
  color: #ffffff;
  border-color: #f59e0b;
}

.close-btn {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-color);
  width: 52px;
  height: 52px;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1.3rem;
}

.close-btn:hover {
  background: var(--card-bg);
  border-color: var(--text-muted);
  transform: scale(1.08);
}

/* Plan Statistics */
.plan-stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  background: var(--bg-secondary);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  transition: all 0.3s ease;
}

.stat-icon.divisions { background: linear-gradient(135deg, #ff6b6b, #ee5a52); }
.stat-icon.exercises { background: linear-gradient(135deg, #4ecdc4, #44a08d); }
.stat-icon.sets { background: linear-gradient(135deg, #45b7d1, #96c93d); }
.stat-icon.time { background: linear-gradient(135deg, #f093fb, #f5576c); }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 2px;
}

/* Modal Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* Quick Overview */
.quick-overview {
  padding: 32px 40px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 24px 0;
}

.section-title i {
  color: #3b82f6;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.overview-card {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
}

.overview-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  font-weight: 700;
  color: var(--text-color);
}

.overview-header i {
  color: #3b82f6;
  font-size: 1.2rem;
}

.muscle-groups, .equipment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.muscle-tag, .equipment-tag {
  background: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.muscle-tag:hover, .equipment-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.no-data {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.9rem;
}

/* Divisions Section */
.divisions-section {
  padding: 32px 40px;
  background: var(--card-bg);
}

.divisions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.division-card {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.division-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.15);
  transform: translateY(-4px);
}

.division-card:hover .division-arrow {
  transform: translateX(4px);
}

/* Division Header */
.division-header {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--border-color);
}

.division-indicator {
  width: 50px;
  height: 50px;
  background: #3b82f6;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.division-letter {
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
}

.division-info {
  flex: 1;
}

.division-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 6px 0;
}

.division-description {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}

.division-arrow {
  color: var(--text-muted);
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

/* Division Preview */
.division-preview {
  padding: 20px 24px;
}

.preview-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.preview-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
}

.preview-stat i {
  color: #3b82f6;
}

.muscle-preview {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.muscle-chip {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.muscle-chip.more {
  background: var(--border-color);
  color: var(--text-muted);
}

/* Exercise Preview */
.exercises-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-exercises {
  display: flex;
  gap: 12px;
}

.preview-exercise {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 60px;
}

.exercise-thumb {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.exercise-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.exercise-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-color);
}

.exercise-placeholder i {
  color: var(--text-muted);
  font-size: 1.2rem;
}

.exercise-preview-name {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-align: center;
  font-weight: 600;
  line-height: 1.2;
}

.more-exercises {
  display: flex;
  align-items: center;
}

.more-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.more-indicator i {
  font-size: 1.2rem;
  color: #3b82f6;
}

/* Division Actions */
.division-actions {
  padding: 16px 24px;
  background: #f8f9fa;
  display: flex;
  gap: 12px;
  border-top: 1px solid #e9ecef;
}

.action-btn {
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.action-btn.small {
  padding: 8px 14px;
  font-size: 0.85rem;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--text-muted);
  color: white;
}

.action-btn.secondary:hover {
  background: var(--text-secondary);
  transform: translateY(-1px);
}

.action-btn.ghost {
  background: transparent;
  color: var(--text-muted);
  border: 2px solid var(--border-color);
}

.action-btn.ghost:hover {
  background: var(--bg-secondary);
  border-color: var(--text-muted);
}

/* Modal Footer */
.modal-footer {
  background: var(--bg-secondary);
  padding: 24px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 20px;
}

.footer-info {
  display: flex;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

.info-item i {
  color: #3b82f6;
}

.footer-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .divisions-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 12px;
  }
  
  .modal-container {
    max-height: 95vh;
    border-radius: 24px;
  }
  
  .modal-header {
    padding: 24px 28px;
  }
  
  .plan-title {
    font-size: 2rem;
  }
  
  .plan-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .quick-overview,
  .divisions-section {
    padding: 24px 28px;
  }
  
  .divisions-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .overview-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .modal-footer {
    padding: 20px 28px;
    flex-direction: column;
    align-items: stretch;
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
  .modal-container {
    border-radius: 20px;
  }
  
  .plan-stats {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .plan-meta {
    justify-content: center;
  }
  
  .preview-stats {
    justify-content: center;
  }
  
  .division-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
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
  
  .close-btn,
  .modal-footer,
  .division-actions {
    display: none;
  }
}

/* Scrollbar Styles */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
