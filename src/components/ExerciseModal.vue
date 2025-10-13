<template>
  <div 
    class="modal-overlay" 
    :class="[isDarkMode ? 'dashboard-dark' : 'dashboard-light']" 
    @click.self="closeModal"
  >
    <div class="modal-container-large">
      <div class="modal-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <i class="fas fa-dumbbell" style="font-size: 28px;"></i>
          </div>
          
          <div class="header-text-section">
            <h2 class="modal-title">Novo Exercício</h2>
            <p class="modal-subtitle">Preencha as informações do exercício</p>
          </div>
        </div>

        <button class="modal-close" @click="closeModal">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Steps Indicator -->
        <div class="steps-indicator">
          <div 
            class="step-item" 
            :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }"
          >
            <div class="step-number">
              <i v-if="currentStep > 1" class="fas fa-check"></i>
              <span v-else>1</span>
            </div>
            <div class="step-label">Informações do Exercício</div>
          </div>
          
          <div class="step-divider"></div>
          
          <div 
            class="step-item" 
            :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }"
          >
            <div class="step-number">
              <i v-if="currentStep > 2" class="fas fa-check"></i>
              <span v-else>2</span>
            </div>
            <div class="step-label">Equipamento (Opcional)</div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="exercise-form">
          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <!-- STEP 1: Informações do Exercício -->
          <div v-show="currentStep === 1" class="step-content">

          <div class="form-grid">
            <!-- Coluna Esquerda -->
            <div class="form-column">
              <!-- Informações Básicas -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-tag"></i>
                  Nome do Exercício *
                </label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: Supino Reto"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-folder"></i>
                  Categoria *
                </label>
                <select v-model="formData.category" class="form-input" required>
                  <option value="forca">Força</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibilidade">Flexibilidade</option>
                  <option value="resistencia">Resistência</option>
                  <option value="potencia">Potência</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-signal"></i>
                  Dificuldade *
                </label>
                <select v-model="formData.difficulty" class="form-input" required>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-clipboard-list"></i>
                  Como Executar *
                </label>
                <textarea 
                  v-model="formData.howToPerform" 
                  class="form-textarea"
                  placeholder="Descreva passo a passo como realizar o exercício..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-align-left"></i>
                  Descrição
                </label>
                <textarea 
                  v-model="formData.description" 
                  class="form-textarea"
                  placeholder="Descrição geral do exercício, benefícios, etc..."
                  rows="3"
                ></textarea>
              </div>


            </div>

            <!-- Coluna Direita -->
            <div class="form-column">
              <!-- Imagem -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-image"></i>
                  Imagem do Exercício
                </label>
                <div 
                  class="image-upload-area"
                  @click="$refs.fileInput.click()"
                  @dragover.prevent
                  @drop.prevent="handleDrop"
                >
                  <input 
                    type="file" 
                    ref="fileInput" 
                    accept="image/*" 
                    @change="handleImageSelect"
                    style="display: none"
                  />
                  
                  <div v-if="!imagePreview" class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt" style="font-size: 48px;"></i>
                    <p>Clique ou arraste uma imagem</p>
                    <span class="upload-hint">PNG, JPG ou GIF • Máximo 10MB</span>
                  </div>

                  <div v-else class="image-preview">
                    <img :src="imagePreview" :key="imagePreview" alt="Preview" class="preview-image" />
                    <button type="button" class="remove-image-btn" @click.stop="removeImage">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Grupos Musculares -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-running"></i>
                  Grupos Musculares *
                </label>
                <div class="muscle-groups-grid">
                  <label 
                    v-for="muscle in muscleGroupOptions" 
                    :key="muscle.value" 
                    class="checkbox-label"
                  >
                    <input
                      type="checkbox"
                      :value="muscle.value"
                      v-model="formData.muscleGroups"
                      class="checkbox-input"
                    />
                    <i :class="muscle.icon" class="muscle-icon"></i>
                    <span class="checkbox-text">{{ muscle.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Dicas de Segurança -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-shield-alt"></i>
                  Dicas de Segurança
                </label>
                <textarea 
                  v-model="formData.safetyTips" 
                  class="form-textarea"
                  placeholder="Dicas importantes sobre postura, respiração e técnica..."
                  rows="3"
                ></textarea>
              </div>

              <!-- URL do Vídeo -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-video"></i>
                  URL do Vídeo (Opcional)
                </label>
                <input 
                  v-model="formData.videoUrl" 
                  type="url" 
                  class="form-input"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
          </div>

          <!-- STEP 2: Seleção de Equipamento -->
          <div v-show="currentStep === 2" class="step-content">
            <div class="equipment-selection-section">
              <div class="equipment-info-banner">
                <i class="fas fa-info-circle"></i>
                <div>
                  <h3>Equipamento Opcional</h3>
                  <p>Selecione um equipamento se este exercício utilizar algum aparelho específico. Caso contrário, deixe sem seleção (exercício de peso corporal).</p>
                </div>
              </div>

              <!-- Search Bar -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-search"></i>
                  Pesquisar Equipamento
                </label>
                <input 
                  v-model="equipmentSearch" 
                  type="text" 
                  class="form-input search-input"
                  placeholder="Digite o nome do equipamento..."
                  @input="handleSearchChange"
                />
              </div>

              <!-- Equipment Grid -->
              <div class="equipment-grid">
                <div 
                  v-for="equipment in paginatedEquipments" 
                  :key="equipment._id"
                  class="equipment-card"
                  :class="{ 'selected': formData.equipmentId === equipment._id }"
                  @click="selectEquipment(equipment._id)"
                >
                  <div class="equipment-card-image">
                    <img v-if="getEquipmentImageUrl(equipment)" :src="getEquipmentImageUrl(equipment)" :alt="equipment.name" />
                    <div v-else class="no-image-placeholder">
                      <i class="fas fa-dumbbell"></i>
                    </div>
                  </div>
                  <div class="equipment-card-content">
                    <h4>{{ equipment.name }}</h4>
                    <p v-if="equipment.description">{{ equipment.description }}</p>
                  </div>
                  <div v-if="formData.equipmentId === equipment._id" class="selected-badge">
                    <i class="fas fa-check-circle"></i>
                  </div>
                </div>

                <!-- No Results -->
                <div v-if="filteredEquipments.length === 0" class="no-results">
                  <i class="fas fa-search"></i>
                  <p>Nenhum equipamento encontrado</p>
                  <span>Tente pesquisar com outro termo</span>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="pagination">
                <button 
                  class="pagination-btn" 
                  :disabled="currentPage === 1"
                  @click="changePage(currentPage - 1)"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                
                <div class="pagination-info">
                  <span>Página {{ currentPage }} de {{ totalPages }}</span>
                  <span class="results-count">{{ filteredEquipments.length }} equipamento(s)</span>
                </div>
                
                <button 
                  class="pagination-btn" 
                  :disabled="currentPage === totalPages"
                  @click="changePage(currentPage + 1)"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>

              <!-- Clear Selection Button -->
              <div v-if="formData.equipmentId" class="clear-selection-wrapper">
                <button type="button" class="clear-selection-btn" @click="clearEquipmentSelection">
                  <i class="fas fa-times"></i>
                  Remover Seleção (Peso Corporal)
                </button>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="modal-actions">
            <button 
              v-if="currentStep > 1" 
              type="button" 
              class="btn-cancel" 
              @click="previousStep"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
              </svg>
              Voltar
            </button>

            <button 
              v-if="currentStep === 1" 
              type="button" 
              class="btn-cancel" 
              @click="closeModal"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancelar
            </button>

            <button 
              v-if="currentStep < 2" 
              type="button" 
              class="btn-save" 
              @click="nextStep"
            >
              Próxima Etapa
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>

            <button 
              v-if="currentStep === 2" 
              type="submit" 
              class="btn-save" 
              :disabled="isSubmitting"
            >
              <svg v-if="!isSubmitting" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <i v-else class="fas fa-spinner fa-spin"></i>
              {{ isSubmitting ? 'Salvando...' : 'Criar Exercício' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';

export default {
  name: 'ExerciseModal',
  props: {
    equipments: {
      type: Array,
      default: () => []
    },
    muscleGroupOptions: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    return { isDarkMode };
  },
  data() {
    return {
      currentStep: 1,
      formData: {
        name: '',
        description: '',
        howToPerform: '',
        category: 'forca',
        muscleGroups: [],
        equipmentId: null,
        difficulty: 'intermediario',
        safetyTips: '',
        videoUrl: '',
        imageBase64: null
      },
      imagePreview: null,
      isSubmitting: false,
      errorMessage: '',
      equipmentSearch: '',
      currentPage: 1,
      itemsPerPage: 3
    };
  },
  computed: {
    selectedEquipment() {
      if (!this.formData.equipmentId) return null;
      return this.equipments.find(eq => eq._id === this.formData.equipmentId);
    },
    filteredEquipments() {
      
      if (!this.equipmentSearch.trim()) {
        return this.equipments;
      }
      const search = this.equipmentSearch.toLowerCase().trim();
      const filtered = this.equipments.filter(equipment => 
        equipment.name.toLowerCase().includes(search)
      );
      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredEquipments.length / this.itemsPerPage);
    },
    paginatedEquipments() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginated = this.filteredEquipments.slice(start, end);
      return paginated;
    }
  },
  watch: {
    equipments: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          console.log('🖼️ Image URL would be:', this.getEquipmentImageUrl(newVal[0]));
        }
      },
      immediate: true
    },
    currentStep(newVal) {
      if (newVal === 2) {
        console.log('📦 Available equipments:', this.equipments.length);
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleImageSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processImage(file);
      }
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.processImage(file);
      }
    },
    processImage(file) {
      // Para GIFs, manter o formato original sem processamento
      if (file.type === 'image/gif') {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.imageBase64 = e.target.result;
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
        return;
      }

      // Para outros formatos, comprimir mantendo o tipo original
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const maxSize = 1200;
          if (width > height && width > maxSize) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width / height) * maxSize;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Manter o formato original (png, jpeg, webp)
          const mimeType = file.type || 'image/jpeg';
          const quality = mimeType === 'image/png' ? 1.0 : 0.85;
          const base64 = canvas.toDataURL(mimeType, quality);
          this.formData.imageBase64 = base64;
          this.imagePreview = base64;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage() {
      this.imagePreview = null;
      this.formData.imageBase64 = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    nextStep() {
      if (this.currentStep === 1) {
        if (!this.formData.name || !this.formData.howToPerform) {
          this.errorMessage = 'Nome e instruções de execução são obrigatórios';
          return;
        }
        if (this.formData.muscleGroups.length === 0) {
          this.errorMessage = 'Selecione pelo menos um grupo muscular';
          return;
        }
        this.errorMessage = '';
      }
      this.currentStep++;
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.errorMessage = '';
      }
    },
    async handleSubmit() {
      if (!this.formData.name || !this.formData.howToPerform) {
        this.errorMessage = 'Nome e instruções de execução são obrigatórios';
        return;
      }

      if (this.formData.muscleGroups.length === 0) {
        this.errorMessage = 'Selecione pelo menos um grupo muscular';
        return;
      }

      this.isSubmitting = true;
      this.errorMessage = '';

      try {
        this.$emit('save', this.formData);
      } catch (error) {
        console.error('❌ Erro ao salvar exercício:', error);
        this.errorMessage = 'Erro ao salvar exercício. Tente novamente.';
      } finally {
        this.isSubmitting = false;
      }
    },
    selectEquipment(equipmentId) {
      if (this.formData.equipmentId === equipmentId) {
        this.formData.equipmentId = null;
      } else {
        this.formData.equipmentId = equipmentId;
      }
    },
    clearEquipmentSelection() {
      this.formData.equipmentId = null;
    },
    handleSearchChange() {
      this.currentPage = 1;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    getEquipmentImageUrl(equipment) {
      if (!equipment.image) return null;
      
      // Se já for uma URL completa (http:// ou data:)
      if (equipment.image.startsWith('http') || equipment.image.startsWith('data:')) {
        return equipment.image;
      }
      
      // Se for um caminho relativo, construir URL completa
      return `http://localhost:3000${equipment.image}`;
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

* {
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
}

/* CRITICAL: Force FontAwesome to render */
i.fas,
i.far,
i.fal,
i.fab,
i[class^="fa-"],
i[class*=" fa-"] {
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
  display: inline-block !important;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
  overflow-y: auto;
}

.modal-container-large {
  background: var(--bg-primary);
  border-radius: 24px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
}

/* HEADER */
.modal-header {
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  z-index: 10;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.header-text-section {
  flex: 1;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
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

.dashboard-dark .modal-close {
  background: #334155;
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

.dashboard-dark .modal-close:hover {
  background: #475569;
}

.modal-close:hover svg {
  transform: scale(1.1);
}

/* BODY */
.modal-body {
  padding: 2rem;
}

/* STEPS INDICATOR */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  border-color: var(--primary-color);
  color: white;
}

.step-item.completed .step-number {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.step-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.step-item.active .step-label {
  color: var(--text-color);
  font-weight: 600;
}

.step-divider {
  width: 60px;
  height: 2px;
  background: var(--border-color);
  margin-top: -1.5rem;
}

/* FORM */
.exercise-form {
  width: 100%;
}

.step-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 968px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
}

.form-label svg {
  color: var(--primary-color);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-color);
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-secondary);
}

select.form-input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: "Inter", sans-serif;
}

.form-hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* PARAMS GRID */
.params-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.param-item label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* MUSCLE GROUPS */
.muscle-groups-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-label:hover {
  border-color: var(--primary-color);
  background: var(--bg-primary);
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary-color);
  flex-shrink: 0;
}

.muscle-icon {
  font-size: 16px;
  color: var(--primary-color);
  flex-shrink: 0;
}

.checkbox-text {
  font-size: 0.875rem;
  color: var(--text-color);
  flex: 1;
}

/* FontAwesome Icons - Global Fix */
i[class*="fa-"],
i.fas,
i.far,
i.fal,
i.fab {
  display: inline-block !important;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
  font-variant: normal !important;
  text-rendering: auto !important;
  line-height: 1 !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}

/* FontAwesome Icons in Labels */
.form-label i {
  color: var(--primary-color) !important;
  font-size: 18px !important;
  width: 18px;
  margin-right: 0.5rem;
}

.modal-icon i {
  font-size: 28px !important;
  color: white !important;
}

.step-number i {
  font-size: 16px !important;
}

.equipment-info-banner i {
  font-size: 24px !important;
  color: var(--primary-color) !important;
}

.upload-placeholder i {
  font-size: 48px !important;
  color: var(--text-secondary) !important;
}

.muscle-icon {
  font-size: 16px !important;
  color: var(--primary-color) !important;
  margin-right: 0.5rem;
}

.btn-cancel svg,
.btn-save svg,
.btn-cancel i,
.btn-save i {
  font-size: 16px !important;
  flex-shrink: 0;
}

.error-message i {
  font-size: 20px !important;
  color: rgb(239, 68, 68) !important;
}

.no-image-placeholder i {
  font-size: 32px !important;
  color: var(--text-secondary) !important;
}

.remove-image-btn i {
  font-size: 16px !important;
  color: white !important;
}

/* IMAGE UPLOAD */
.image-upload-area {
  width: 100%;
  min-height: 200px;
  border: 3px dashed var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

.image-upload-area:hover {
  border-color: var(--primary-color);
  background: var(--bg-primary);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
}

.upload-placeholder i {
  color: var(--text-secondary);
  opacity: 0.5;
}

.upload-placeholder svg {
  color: var(--text-secondary);
  opacity: 0.5;
}

.upload-placeholder p {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-color);
  margin: 0;
}

.upload-hint {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
  background: var(--modal-bg);
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  background: rgb(239, 68, 68);
  transform: scale(1.1);
}

/* ERROR MESSAGE */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: rgb(239, 68, 68);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.error-message i {
  flex-shrink: 0;
  font-size: 20px;
}

/* EQUIPMENT SELECTION SECTION */
.equipment-selection-section {
  max-width: 900px;
  margin: 0 auto;
}

.equipment-info-banner {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.1) 0%, rgba(var(--primary-color-rgb), 0.05) 100%);
  border: 1px solid rgba(var(--primary-color-rgb), 0.2);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.equipment-info-banner i {
  font-size: 24px;
  color: var(--primary-color);
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.equipment-info-banner h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.equipment-info-banner p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* Search Input */
.search-input {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}

/* Equipment Grid */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
}

.equipment-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.equipment-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -5px rgba(var(--primary-color-rgb), 0.3);
}

.equipment-card.selected {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.1) 0%, rgba(var(--primary-color-rgb), 0.05) 100%);
}

.equipment-card-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: var(--bg-primary);
}

.equipment-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.equipment-card-content {
  padding: 1rem;
  flex: 1;
}

.equipment-card-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.equipment-card-content p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.selected-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--border-color);
}

.no-image-placeholder i {
  font-size: 48px;
  color: var(--text-secondary);
  opacity: 0.3;
}

/* No Results */
.no-results {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.no-results i {
  font-size: 48px;
  color: var(--text-secondary);
  opacity: 0.3;
  margin-bottom: 1rem;
}

.no-results p {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.no-results span {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-color);
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.pagination-info span {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
}

.pagination-info .results-count {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-secondary);
}

/* Clear Selection Button */
.clear-selection-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.clear-selection-btn {
  padding: 0.75rem 1.25rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.clear-selection-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: rgb(239, 68, 68);
}

.clear-selection-btn i {
  font-size: 16px;
}

/* MODAL FOOTER */
.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 1px solid var(--border-color);
}

.btn-cancel,
.btn-save {
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

.btn-cancel {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.btn-cancel:hover {
  background: var(--bg-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-save {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  margin-left: auto;
}

.btn-save::before {
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

.btn-save:hover::before {
  left: 100%;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.btn-save:active {
  transform: translateY(0);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-save:disabled::before {
  display: none;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* SCROLLBAR */
.modal-container-large::-webkit-scrollbar {
  width: 8px;
}

.modal-container-large::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 10px;
}

.modal-container-large::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 10px;
}

.modal-container-large::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* Dark Mode Support */
.dashboard-dark {
  --bg-primary: #1e1e2d;
  --bg-secondary: #171723;
  --text-color: #f9fafb;
  --text-secondary: #9ca3af;
  --border-color: #2d2d3f;
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
  --primary-color-rgb: 99, 102, 241;
}

.dashboard-light {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-color: #0f172a;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --primary-color-rgb: 59, 130, 246;
}

/* RESPONSIVE */
@media (max-width: 968px) {
  .equipment-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-header {
    padding: 1.5rem;
  }

  .params-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .muscle-groups-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .equipment-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-info {
    order: -1;
  }

  .modal-actions {
    flex-direction: column;
    gap: 12px;
  }

  .btn-cancel,
  .btn-save {
    padding: 12px 20px;
    font-size: 0.9rem;
    min-height: 48px;
  }
}
</style>
