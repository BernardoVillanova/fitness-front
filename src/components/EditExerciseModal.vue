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
            <i class="fas fa-edit" style="font-size: 28px;"></i>
          </div>
          
          <div class="header-text-section">
            <h2 class="modal-title">Editar Exercício</h2>
            <p class="modal-subtitle">Atualize as informações do exercício</p>
          </div>
        </div>

        <button class="modal-close" @click="closeModal">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
                <!-- Nome -->
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-dumbbell"></i>
                    Nome do Exercício
                  </label>
                  <input 
                    v-model="formData.name" 
                    type="text" 
                    class="form-input"
                    placeholder="Digite o nome do exercício"
                    required
                  />
                </div>

                <!-- Categoria e Dificuldade -->
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">
                      <i class="fas fa-tag"></i>
                      Categoria
                    </label>
                    <select v-model="formData.category" class="form-input" required>
                      <option value="">Selecione</option>
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
                      <i class="fas fa-chart-line"></i>
                      Dificuldade
                    </label>
                    <select v-model="formData.difficulty" class="form-input" required>
                      <option value="">Selecione</option>
                      <option value="iniciante">Iniciante</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="avancado">Avançado</option>
                    </select>
                  </div>
                </div>

                <!-- Descrição -->
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-align-left"></i>
                    Descrição
                  </label>
                  <textarea 
                    v-model="formData.description" 
                    class="form-textarea"
                    placeholder="Descreva o exercício, seus benefícios..."
                    rows="3"
                  ></textarea>
                </div>

                <!-- Como Executar -->
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-list-ol"></i>
                    Como Executar
                  </label>
                  <textarea 
                    v-model="formData.howToPerform" 
                    class="form-textarea"
                    placeholder="Instruções detalhadas de execução..."
                    rows="4"
                    required
                  ></textarea>
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
                    placeholder="Cuidados e precauções..."
                    rows="2"
                  ></textarea>
                </div>

                <!-- URL do Vídeo -->
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-video"></i>
                    URL do Vídeo
                  </label>
                  <input 
                    v-model="formData.videoUrl" 
                    type="url" 
                    class="form-input"
                    placeholder="https://youtube.com/..."
                  />
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
                  
                  <div v-if="imagePreview" class="image-preview">
                    <img :src="imagePreview" :key="imagePreview" alt="Preview" class="preview-image" />
                    <button type="button" class="remove-image-btn" @click.stop="removeImage">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>

                  <div v-else class="upload-area" @click="triggerFileInput">
                    <input 
                      ref="fileInput"
                      type="file" 
                      accept="image/*"
                      class="file-input"
                      @change="handleImageSelect"
                      style="display: none;"
                    />
                    <div class="upload-placeholder">
                      <i class="fas fa-cloud-upload-alt"></i>
                      <p>Clique para selecionar imagem</p>
                      <span class="upload-hint">PNG, JPG ou GIF • Máximo 10MB</span>
                    </div>
                  </div>
                </div>

                <!-- Grupos Musculares -->
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-running"></i>
                    Grupos Musculares
                  </label>
                  <div class="muscle-groups-grid">
                    <label 
                      v-for="option in muscleGroupOptions" 
                      :key="option.value"
                      class="checkbox-label"
                    >
                      <input 
                        type="checkbox" 
                        :value="option.value"
                        v-model="formData.muscleGroups"
                        class="checkbox-input"
                      />
                      <i :class="option.icon" class="muscle-icon"></i>
                      <span class="checkbox-text">{{ option.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 2: Seleção de Equipamento -->
          <div v-show="currentStep === 2" class="step-content">
            <div class="equipment-selection-section">
              <div class="equipment-info-banner">
                <i class="fas fa-dumbbell"></i>
                <div>
                  <h3>Trocar Equipamento (Opcional)</h3>
                  <p>Escolha um equipamento diferente ou deixe sem equipamento para este exercício.</p>
                </div>
              </div>

              <!-- Search Bar -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-search"></i>
                  Buscar Equipamento
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
                    <img 
                      v-if="equipment.image"
                      :src="getEquipmentImageUrl(equipment)" 
                      :alt="equipment.name"
                    />
                    <div v-else class="no-image-placeholder">
                      <i class="fas fa-dumbbell"></i>
                    </div>
                  </div>
                  <div class="equipment-card-content">
                    <h4>{{ equipment.name }}</h4>
                    <p>{{ equipment.description || 'Sem descrição' }}</p>
                  </div>
                  <div v-if="formData.equipmentId === equipment._id" class="selected-badge">
                    <i class="fas fa-check"></i>
                  </div>
                </div>

                <div v-if="paginatedEquipments.length === 0" class="no-results">
                  <i class="fas fa-search"></i>
                  <p>Nenhum equipamento encontrado</p>
                  <span>Tente buscar com outro termo</span>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="pagination">
                <button 
                  type="button"
                  class="pagination-btn" 
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                
                <div class="pagination-info">
                  <span>Página {{ currentPage }} de {{ totalPages }}</span>
                  <span class="results-count">{{ filteredEquipments.length }} equipamento(s)</span>
                </div>
                
                <button 
                  type="button"
                  class="pagination-btn" 
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>

              <!-- Clear Selection Button -->
              <div v-if="formData.equipmentId" class="clear-selection-wrapper">
                <button type="button" class="clear-selection-btn" @click="clearEquipmentSelection">
                  <i class="fas fa-times"></i>
                  Remover Equipamento
                </button>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="modal-footer">
            <button 
              v-if="currentStep > 1" 
              type="button" 
              class="nav-button secondary" 
              @click="previousStep"
            >
              <i class="fas fa-arrow-left"></i>
              Voltar
            </button>

            <button 
              v-if="currentStep < 2" 
              type="button" 
              class="nav-button primary" 
              @click="nextStep"
            >
              Próximo
              <i class="fas fa-arrow-right"></i>
            </button>

            <button 
              v-if="currentStep === 2" 
              type="submit" 
              class="submit-button"
              :disabled="isSubmitting"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ isSubmitting ? 'Salvando...' : 'Salvar Alterações' }}
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
  name: 'EditExerciseModal',
  props: {
    exercise: {
      type: Object,
      required: true
    },
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
    filteredEquipments() {
      if (!this.equipmentSearch.trim()) {
        return this.equipments;
      }
      const search = this.equipmentSearch.toLowerCase().trim();
      return this.equipments.filter(equipment => 
        equipment.name.toLowerCase().includes(search)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredEquipments.length / this.itemsPerPage);
    },
    paginatedEquipments() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredEquipments.slice(start, end);
    }
  },
  mounted() {
    this.loadExerciseData();
  },
  methods: {
    loadExerciseData() {
      // Carregar dados do exercício existente
      this.formData = {
        name: this.exercise.name || '',
        description: this.exercise.description || '',
        howToPerform: this.exercise.howToPerform || '',
        category: this.exercise.category || 'forca',
        muscleGroups: Array.isArray(this.exercise.muscleGroups) ? [...this.exercise.muscleGroups] : [],
        equipmentId: this.exercise.equipmentId?._id || this.exercise.equipmentId || null,
        difficulty: this.exercise.difficulty || 'intermediario',
        safetyTips: this.exercise.safetyTips || '',
        videoUrl: this.exercise.videoUrl || '',
        imageBase64: null
      };

      // Carregar imagem existente
      if (this.exercise.image) {
        this.imagePreview = this.getImageUrl(this.exercise.image);
      }

      console.log('✅ Dados carregados no EditExerciseModal:', this.formData);
    },
    closeModal() {
      this.$emit('close');
    },
    handleImageSelect(event) {
      const file = event.target.files[0];
      if (file) {
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
          
          // Manter o formato original
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
    triggerFileInput() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.click();
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
        // Preparar dados para envio
        const updateData = {
          ...this.formData,
          _id: this.exercise._id
        };

        this.$emit('save', updateData);
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
      if (equipment.image.startsWith('http') || equipment.image.startsWith('data:')) {
        return equipment.image;
      }
      return `http://localhost:3000${equipment.image}`;
    },
    getImageUrl(imagePath) {
      if (!imagePath) return null;
      if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        return imagePath;
      }
      return `http://localhost:3000${imagePath}`;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modal-close:hover {
  background: var(--border-color);
  transform: rotate(90deg);
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
  background: #10b981;
  border-color: #10b981;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 968px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-row {
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
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
}

.form-label i {
  color: var(--primary-color);
  font-size: 18px;
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
  font-family: inherit;
}

/* MUSCLE GROUPS */
.muscle-groups-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

/* IMAGE UPLOAD */
.upload-area {
  width: 100%;
  min-height: 200px;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
}

.upload-area:hover {
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
  font-size: 48px;
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

.file-input {
  display: none;
}

.image-preview {
  width: 100%;
  height: 300px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--bg-secondary);
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

/* EQUIPMENT SELECTION */
.equipment-selection-section {
  max-width: 900px;
  margin: 0 auto;
}

.equipment-info-banner {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(var(--primary-color-rgb), 0.1);
  border: 1px solid rgba(var(--primary-color-rgb), 0.2);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.equipment-info-banner i {
  font-size: 24px;
  color: var(--primary-color);
  flex-shrink: 0;
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
}

.search-input {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}

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
  background: rgba(var(--primary-color-rgb), 0.1);
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
}

.equipment-card-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.equipment-card-content p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
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

.no-results {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
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

/* PAGINATION */
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

.results-count {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-secondary);
}

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

/* FOOTER */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  margin-top: 2rem;
}

.nav-button {
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.nav-button.secondary {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.nav-button.secondary:hover {
  background: var(--border-color);
}

.nav-button.primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: white;
  margin-left: auto;
}

.nav-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(var(--primary-color-rgb), 0.5);
}

.submit-button {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-left: auto;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.5);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

  .muscle-groups-grid {
    grid-template-columns: 1fr;
  }

  .equipment-grid {
    grid-template-columns: 1fr;
  }
}
</style>
