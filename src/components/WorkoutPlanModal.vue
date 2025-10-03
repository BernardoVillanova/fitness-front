<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container-large">
      <div class="modal-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <div>
            <h2 class="modal-title">{{ isEditing ? 'Editar Plano' : 'Novo Plano' }}</h2>
            <p class="modal-subtitle">{{ isEditing ? 'Modifique seu plano de exercícios' : 'Crie um plano personalizado de treino' }}</p>
          </div>
        </div>
        <button class="modal-close" @click="closeModal">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="savePlan">
          <div class="form-grid">
            <!-- Coluna Esquerda -->
            <div class="form-column">
              <!-- Informações Básicas -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Nome do Plano
                </label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: Hipertrofia Avançada"
                  required
                />
              </div>

              <!-- Divisão -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  Nome da Divisão
                </label>
                <input 
                  v-model="formData.divisions[0].name" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: Treino A – Peito/Tríceps"
                  required
                />
              </div>

              <!-- Exercício -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                  Nome do Exercício
                </label>
                <input 
                  v-model="formData.divisions[0].exercises[0].name" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: Supino Reto"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Descrição do Exercício
                </label>
                <textarea 
                  v-model="formData.divisions[0].exercises[0].description" 
                  class="form-textarea"
                  placeholder="Descreva a execução do exercício..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <!-- Séries, Reps, Peso -->
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    Séries
                  </label>
                  <input 
                    v-model.number="formData.divisions[0].exercises[0].sets" 
                    type="number" 
                    class="form-input"
                    placeholder="3"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Repetições
                  </label>
                  <input 
                    v-model.number="formData.divisions[0].exercises[0].reps" 
                    type="number" 
                    class="form-input"
                    placeholder="12"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                    </svg>
                    Peso Ideal (kg)
                  </label>
                  <input 
                    v-model.number="formData.divisions[0].exercises[0].idealWeight" 
                    type="number" 
                    class="form-input"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <!-- Séries e Repetições Sugeridas -->
              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    Séries Sugeridas
                  </label>
                  <input 
                    v-model="formData.divisions[0].exercises[0].suggestedSets" 
                    type="text" 
                    class="form-input"
                    placeholder="Ex: 3-4"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Repetições Sugeridas
                  </label>
                  <input 
                    v-model="formData.divisions[0].exercises[0].suggestedReps" 
                    type="text" 
                    class="form-input"
                    placeholder="Ex: 8-12"
                  />
                </div>
              </div>

              <!-- Tempo de Descanso -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Tempo de Descanso
                </label>
                <input 
                  v-model="formData.divisions[0].exercises[0].restTime" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: 60-90 segundos"
                />
              </div>
            </div>

            <!-- Coluna Direita - Upload de Imagem -->
            <div class="form-column">
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Imagem do Exercício
                </label>
                
                <!-- Preview da Imagem -->
                <div v-if="imagePreview" class="image-preview-container">
                  <img :src="imagePreview" alt="Preview" class="image-preview" />
                  <button type="button" class="remove-image-btn" @click="removeImage">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 1L11 11M11 1L1 11" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>

                <!-- Área de Upload Moderna com Borda Tracejada -->
                <div 
                  v-else
                  class="upload-area-modern upload-dashed"
                  :class="{ 'drag-over': isDragging }"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="triggerFileInput"
                >
                  <div class="upload-gradient-bg"></div>
                  <div class="upload-grid-pattern"></div>
                  
                  <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*"
                    class="file-input"
                    @change="handleFileSelect"
                  />
                  
                  <div class="upload-content-modern">
                    <!-- Icon Container with Animations -->
                    <div class="upload-icon-container">
                      <div class="icon-circle-outer">
                        <div class="icon-circle-inner">
                          <svg class="upload-icon-svg" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                        </div>
                      </div>
                      <!-- Floating Particles -->
                      <div class="particle particle-1"></div>
                      <div class="particle particle-2"></div>
                      <div class="particle particle-3"></div>
                    </div>

                    <!-- Text Content -->
                    <div class="upload-text-modern">
                      <h3 class="upload-title-modern">
                        <span class="title-gradient-text">Adicionar Imagem</span>
                      </h3>
                      <p class="upload-subtitle-modern">Arraste e solte aqui ou clique para selecionar</p>
                    </div>

                    <!-- Modern Upload Button -->
                    <button type="button" class="upload-button-modern" @click.stop="triggerFileInput">
                      <div class="button-bg-gradient"></div>
                      <div class="button-shine-effect"></div>
                      <div class="button-content-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                        <span>Selecionar Arquivo</span>
                      </div>
                    </button>

                    <!-- Format Badges -->
                    <div class="upload-formats-modern">
                      <span class="format-badge">PNG</span>
                      <span class="format-badge">JPG</span>
                      <span class="format-badge">GIF</span>
                      <span class="format-badge">WEBP</span>
                    </div>
                  </div>
                </div>

                <!-- Informação Adicional -->
                <div class="upload-info-modern">
                  <div class="info-icon-wrapper">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div class="info-content">
                    <span class="info-primary"><strong>Formatos:</strong> PNG, JPG, GIF ou WEBP</span>
                    <span class="info-divider">•</span>
                    <span class="info-secondary"><strong>Tamanho máximo:</strong> 10MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn-cancel" @click="closeModal">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Cancelar
        </button>
        <button type="button" class="btn-save" @click="savePlan" :disabled="!isFormValid">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          {{ isEditing ? 'Salvar Plano' : 'Criar Plano' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkoutPlanModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    planData: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      formData: {
        name: '',
        divisions: [{
          name: '',
          exercises: [{
            name: '',
            description: '',
            image: '',
            sets: 3,
            reps: 12,
            idealWeight: 0,
            suggestedSets: '',
            suggestedReps: '',
            restTime: ''
          }]
        }]
      },
      imagePreview: null,
      isDragging: false
    }
  },
  computed: {
    isFormValid() {
      const division = this.formData.divisions[0];
      const exercise = division.exercises[0];
      
      return this.formData.name.trim() !== '' &&
             division.name.trim() !== '' &&
             exercise.name.trim() !== '' &&
             exercise.sets > 0 &&
             exercise.reps > 0 &&
             exercise.idealWeight >= 0;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.initializeForm();
      }
    },
    planData: {
      handler() {
        if (this.show) {
          this.initializeForm();
        }
      },
      deep: true
    }
  },
  methods: {
    initializeForm() {
      if (this.planData && this.isEditing) {
        this.formData = JSON.parse(JSON.stringify(this.planData));
        this.imagePreview = this.formData.divisions[0].exercises[0].image || null;
      } else if (this.planData && !this.isEditing) {
        const duplicatedPlan = JSON.parse(JSON.stringify(this.planData));
        delete duplicatedPlan._id;
        duplicatedPlan.divisions.forEach(division => {
          delete division._id;
          division.exercises.forEach(exercise => {
            delete exercise._id;
          });
        });
        this.formData = duplicatedPlan;
        this.imagePreview = this.formData.divisions[0].exercises[0].image || null;
      } else {
        this.formData = {
          name: '',
          divisions: [{
            name: '',
            exercises: [{
              name: '',
              description: '',
              image: '',
              sets: 3,
              reps: 12,
              idealWeight: 0,
              suggestedSets: '',
              suggestedReps: '',
              restTime: ''
            }]
          }]
        };
        this.imagePreview = null;
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processImageFile(file);
      }
    },

    handleDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.processImageFile(file);
      }
    },

    processImageFile(file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande! O tamanho máximo é 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
        this.formData.divisions[0].exercises[0].image = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    removeImage() {
      this.imagePreview = null;
      this.formData.divisions[0].exercises[0].image = '';
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    savePlan() {
      if (this.isFormValid) {
        this.$emit('save', { ...this.formData });
      }
    },

    closeModal() {
      this.imagePreview = null;
      this.isDragging = false;
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* ========== MODAL DE CRIAÇÃO/EDIÇÃO ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container-large {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 1200px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.modal-container-large::-webkit-scrollbar {
  width: 8px;
}

.modal-container-large::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.modal-container-large::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-container-large::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 48px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.modal-icon svg {
  width: 28px;
  height: 28px;
}

.modal-title {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: #1e293b;
}

.modal-subtitle {
  margin: 6px 0 0 0;
  font-size: 14px;
  color: #64748b;
}

.modal-close {
  background: white;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-close svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-close:hover svg {
  transform: scale(1.1);
}

.modal-body {
  padding: 48px;
  overflow-y: auto;
  flex: 1;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.form-row-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-label svg {
  width: 18px;
  height: 18px;
  color: #3b82f6;
  stroke: #3b82f6;
}

.form-input,
.form-textarea {
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  background: #ffffff;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  background: #ffffff;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* ========== ÁREA DE UPLOAD MELHORADA ========== */
.upload-area-modern {
  position: relative;
  padding: 60px 32px;
  border: 3px dashed #cbd5e1;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  background: #f8fafc;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Variante com borda tracejada visível */
.upload-area-modern.upload-dashed {
  border: 3px dashed #cbd5e1;
}

.upload-area-modern.upload-dashed:hover {
  border-color: #3b82f6;
}

.upload-area-modern.upload-dashed.drag-over {
  border-color: #2563eb;
}

/* Desabilita o ::before (borda gradiente) quando usar borda tracejada */
.upload-area-modern.upload-dashed::before {
  display: none;
}

.upload-gradient-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(37, 99, 235, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.upload-grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.upload-area-modern::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 3px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.4),
    rgba(37, 99, 235, 0.4),
    rgba(59, 130, 246, 0.4)
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.upload-area-modern:hover::before {
  opacity: 1;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.6),
    rgba(37, 99, 235, 0.6)
  );
}

.upload-area-modern:hover {
  background: rgba(239, 246, 255, 0.8);
  transform: translateY(-2px);
}

.upload-area-modern:hover .upload-gradient-bg,
.upload-area-modern:hover .upload-grid-pattern {
  opacity: 1;
}

.upload-area-modern.drag-over {
  background: rgba(219, 234, 254, 0.6);
  border-color: #3b82f6;
  transform: scale(1.02);
}

.upload-area-modern.drag-over::before {
  opacity: 1;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.8),
    rgba(37, 99, 235, 0.8)
  );
}

.upload-area-modern.drag-over .upload-gradient-bg,
.upload-area-modern.drag-over .upload-grid-pattern {
  opacity: 1;
}

.upload-area-modern.drag-over .icon-circle-outer {
  transform: scale(1.1) rotate(10deg);
}

.upload-content-modern {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  pointer-events: none;
}

/* Icon Container with Animations */
.upload-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
}

.icon-circle-outer {
  position: relative;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.2);
}

.icon-circle-inner {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
  transition: all 0.3s ease;
}

.upload-area-modern:hover .icon-circle-inner {
  transform: scale(1.05);
  box-shadow: 0 6px 30px rgba(37, 99, 235, 0.5);
}

.upload-icon-svg {
  color: white;
  width: 32px;
  height: 32px;
}

.upload-area-modern:hover .upload-icon-svg {
  animation: floatUpDown 2s ease-in-out infinite;
}

/* Floating Particles */
.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-area-modern:hover .particle {
  animation: particleFloat 3s ease-in-out infinite;
}

.particle-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.particle-2 {
  top: 60%;
  right: 20%;
  width: 6px;
  height: 6px;
  animation-delay: 1s;
}

.particle-3 {
  bottom: 20%;
  left: 30%;
  width: 10px;
  height: 10px;
  animation-delay: 2s;
}

@keyframes floatUpDown {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes particleFloat {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-20px) scale(1);
  }
}

/* Text Content */
.upload-text-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.upload-title-modern {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.title-gradient-text {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.upload-subtitle-modern {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

/* Upload Button Modern */
.upload-button-modern {
  position: relative;
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  pointer-events: auto;
}

.button-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  transition: opacity 0.3s ease;
}

.upload-button-modern:hover .button-bg-gradient {
  opacity: 0.9;
}

.button-content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-shine-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.upload-button-modern:hover .button-shine-effect {
  left: 100%;
}

.upload-button-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(59, 130, 246, 0.4);
}

.upload-button-modern:active {
  transform: translateY(0);
}

/* Format Badges */
.upload-formats-modern {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.format-badge {
  padding: 6px 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.format-badge:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

/* Upload Info Modern */
.upload-info-modern {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.05));
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 12px;
  margin-top: 16px;
  transition: all 0.3s ease;
}

.upload-info-modern:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.info-icon-wrapper {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.info-content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

.info-primary {
  color: #334155;
}

.info-primary strong,
.info-secondary strong {
  font-weight: 600;
  color: #1e293b;
}

.info-divider {
  color: #cbd5e1;
}

.file-input {
  display: none;
}

/* Image Preview Container - Melhorado */
.image-preview-container {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #f1f5f9;
  transition: all 0.3s ease;
}

.image-preview-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.image-preview {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.image-preview-container:hover .image-preview {
  transform: scale(1.05);
}

.remove-image-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(239, 68, 68, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
  transform: scale(0.8);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
}

.remove-image-btn svg {
  width: 14px;
  height: 14px;
}

.remove-image-btn:hover {
  background: #dc2626;
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 6px 25px rgba(220, 38, 38, 0.5);
}

.remove-image-btn:active {
  transform: scale(0.95);
}

.image-preview-container:hover .remove-image-btn {
  opacity: 1;
  transform: scale(1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 24px 48px;
  border-top: 1px solid #e2e8f0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.btn-cancel,
.btn-save {
  flex: 1;
  max-width: 280px;
  min-height: 56px;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.btn-cancel {
  background: #f1f5f9;
  color: #1e293b;
  border: 2px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #e2e8f0;
  color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-save {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-save:hover {
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  transform: translateY(-2px);
}

.btn-save:disabled {
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-save:disabled:hover {
  transform: none;
}

.btn-save svg,
.btn-cancel svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .modal-container-large {
    width: 100%;
    max-width: 100%;
    margin: 10px;
    border-radius: 16px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-row-2 {
    grid-template-columns: 1fr;
  }
  
  .modal-header {
    padding: 24px;
  }
  
  .modal-body {
    padding: 24px;
  }
  
  .modal-actions {
    padding: 16px 24px;
    flex-direction: column-reverse;
  }
  
  .btn-cancel,
  .btn-save {
    width: 100%;
    max-width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-title {
    font-size: 20px;
  }
  
  .modal-icon {
    width: 48px;
    height: 48px;
  }
  
  .modal-icon svg {
    width: 24px;
    height: 24px;
  }
}
</style>