<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <div class="header-info">
          <h2 class="modal-title">{{ plan?.name || 'Ficha de Treino' }}</h2>
          <p class="modal-subtitle">Visualização completa do plano de exercícios</p>
        </div>
        <button @click="closeModal" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Informações gerais do plano -->
        <div class="plan-overview">
          <div class="overview-grid">
            <div class="overview-item">
              <div class="overview-icon">📊</div>
              <div>
                <h4>Total de Divisões</h4>
                <p>{{ plan?.divisions?.length || 0 }}</p>
              </div>
            </div>
            <div class="overview-item">
              <div class="overview-icon">💪</div>
              <div>
                <h4>Total de Exercícios</h4>
                <p>{{ getTotalExercises() }}</p>
              </div>
            </div>
            <div class="overview-item">
              <div class="overview-icon">📅</div>
              <div>
                <h4>Data de Criação</h4>
                <p>{{ formatDate(plan?.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de divisões -->
        <div class="divisions-container">
          <h3 class="section-title">Divisões do Treino</h3>
          <div class="divisions-list">
            <div 
              v-for="(division, index) in plan?.divisions" 
              :key="division._id || index"
              class="division-card"
            >
              <div class="division-header">
                <h4 class="division-title">{{ division.name }}</h4>
                <div class="division-badge">{{ division.exercises?.length || 0 }} exercícios</div>
              </div>
              
              <div class="exercises-list">
                <div 
                  v-for="(exercise, exerciseIndex) in division.exercises" 
                  :key="`${division._id}-${exerciseIndex}`"
                  class="exercise-card"
                >
                  <div class="exercise-main">
                    <div class="exercise-info">
                      <h5 class="exercise-name">{{ exercise.name }}</h5>
                      <p v-if="exercise.description" class="exercise-description">
                        {{ exercise.description }}
                      </p>
                    </div>
                    <div class="exercise-image" v-if="exercise.image">
                      <img :src="exercise.image" :alt="exercise.name" />
                    </div>
                  </div>
                  
                  <div class="exercise-details">
                    <div class="detail-item">
                      <span class="detail-label">Séries:</span>
                      <span class="detail-value">{{ exercise.sets || '-' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Repetições:</span>
                      <span class="detail-value">{{ exercise.reps || '-' }}</span>
                    </div>
                    <div class="detail-item" v-if="exercise.idealWeight">
                      <span class="detail-label">Peso Ideal:</span>
                      <span class="detail-value">{{ exercise.idealWeight }}kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="printPlan" class="action-btn print-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 6,2 18,2 18,9"></polyline>
            <path d="M6,18L4,18a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"></path>
            <polyline points="6,14 18,14"></polyline>
          </svg>
          Imprimir
        </button>
        
        <button @click="exportPDF" class="action-btn export-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8Z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
          Exportar PDF
        </button>
        
        <button @click="closeModal" class="action-btn close-btn-footer">
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
</template>

<script>
export default {
  name: 'ViewPlanModal',
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
      this.$emit('close');
    },
    
    getTotalExercises() {
      if (!this.plan?.divisions) return 0;
      return this.plan.divisions.reduce((total, division) => {
        return total + (division.exercises?.length || 0);
      }, 0);
    },
    
    formatDate(dateString) {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    printPlan() {
      window.print();
    },
    
    exportPDF() {
      // Implementar funcionalidade de exportar PDF
      this.showNotification('info', 'Informacao', 'Funcionalidade de exportar PDF será implementada em breve!');
    }
  },
  mounted() {
    // Prevenir scroll do body quando modal estiver aberto
    if (this.show) {
      document.body.style.overflow = 'hidden';
    }
  },
  
  beforeUnmount() {
    // Restaurar scroll do body
    document.body.style.overflow = '';
  },
  
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container {
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s ease-out;
  overflow: hidden;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-info {
  flex: 1;
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.modal-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

/* Plan Overview */
.plan-overview {
  margin-bottom: 32px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  transition: transform 0.2s ease;
}

.overview-item:hover {
  transform: translateY(-2px);
}

.overview-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.overview-item h4 {
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 600;
}

.overview-item p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #495057;
}

/* Sections */
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #495057;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #e9ecef;
}

/* Divisions */
.divisions-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.division-card {
  background: #ffffff;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.division-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.division-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.division-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #495057;
  margin: 0;
}

.division-badge {
  background: #667eea;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Exercises */
.exercises-list {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exercise-card {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.2s ease;
}

.exercise-card:hover {
  background: #e9ecef;
  transform: translateX(8px);
}

.exercise-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.exercise-info {
  flex: 1;
}

.exercise-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #495057;
  margin: 0 0 8px 0;
}

.exercise-description {
  font-size: 0.95rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
}

.exercise-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
}

.exercise-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exercise-details {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  min-width: 120px;
}

.detail-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 600;
}

.detail-value {
  font-size: 0.95rem;
  color: #495057;
  font-weight: 700;
}

/* Modal Footer */
.modal-footer {
  background: #f8f9fa;
  padding: 24px 32px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
  border-top: 1px solid #e9ecef;
}

.action-btn {
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;
}

.print-btn {
  background: #28a745;
  color: white;
}

.print-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

.export-btn {
  background: #17a2b8;
  color: white;
}

.export-btn:hover {
  background: #138496;
  transform: translateY(-2px);
}

.close-btn-footer {
  background: #6c757d;
  color: white;
}

.close-btn-footer:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 24px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .modal-body {
    padding: 24px;
  }
  
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .exercise-main {
    flex-direction: column;
    gap: 12px;
  }
  
  .exercise-image {
    margin-left: 0;
    align-self: flex-start;
  }
  
  .exercise-details {
    justify-content: space-between;
  }
  
  .detail-item {
    flex: 1;
    min-width: auto;
    justify-content: space-between;
  }
  
  .modal-footer {
    padding: 20px;
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .division-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .exercise-details {
    flex-direction: column;
    gap: 8px;
  }
}

/* Print styles */
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
  .modal-footer {
    display: none;
  }
}
</style>
