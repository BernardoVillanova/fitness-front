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
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 640 512">
              <path d="M96 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V224v64V448c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V384H64c-17.7 0-32-14.3-32-32V288c-17.7 0-32-14.3-32-32s14.3-32 32-32V160c0-17.7 14.3-32 32-32H96V64zm448 0v64h32c17.7 0 32 14.3 32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32v64c0 17.7-14.3 32-32 32H544v64c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32V288 224 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32zM416 224v64H224V224H416z"/>
            </svg>
          </div>
          <div class="header-text-section">
            <h2 class="modal-title">Cadastrar Aparelho</h2>
            <p class="modal-subtitle">
              Cadastre um novo aparelho com detalhes e instruções de uso
            </p>
          </div>
        </div>

        <!-- Indicador removido - modal direto de cadastro -->

        <button class="modal-close" @click="closeModal">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- FORMULÁRIO DE CADASTRO -->
        <form @submit.prevent="handleSubmit" class="equipment-form">
          <div class="form-grid">
            <!-- Coluna Esquerda -->
            <div class="form-column">
              <!-- Nome do Aparelho -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  Nome do Aparelho
                </label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="form-input"
                  placeholder="Ex: Leg Press 45°"
                  required
                />
              </div>

              <!-- Categoria -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  Categoria
                </label>
                <select v-model="formData.category" class="form-input" required>
                  <option value="" disabled>Selecione a categoria</option>
                  <option value="cardio">Cardio</option>
                  <option value="musculacao">Musculação</option>
                  <option value="funcional">Funcional</option>
                  <option value="crossfit">CrossFit</option>
                  <option value="livre">Peso Livre</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <!-- Dificuldade -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Nível de Dificuldade
                </label>
                <select v-model="formData.difficulty" class="form-input" required>
                  <option value="" disabled>Selecione o nível</option>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>

              <!-- Grupos Musculares -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Grupos Musculares
                </label>
                <div class="muscle-groups-grid">
                  <label v-for="muscle in muscleGroupOptions" :key="muscle.value" class="checkbox-label">
                    <input
                      type="checkbox"
                      :value="muscle.value"
                      :checked="formData.muscleGroups.includes(muscle.value)"
                      @change="toggleMuscleGroup(muscle.value)"
                      class="checkbox-input"
                    />
                    <span class="checkbox-text">{{ muscle.label }}</span>
                  </label>
                </div>
                
                <!-- DEBUG: Mostrar grupos selecionados -->
                <div v-if="formData.muscleGroups.length > 0" style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-secondary);">
                  Selecionados: {{ formData.muscleGroups.join(', ') }}
                </div>
              </div>
            </div>

            <!-- Coluna Direita -->
            <div class="form-column">
              <!-- Upload de Imagem -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Foto do Aparelho
                </label>
                <div 
                  class="image-upload-area"
                  :class="{ 'has-image': imagePreview }"
                  @click="$refs.fileInput.click()"
                  @dragover.prevent
                  @drop.prevent="handleDrop"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageSelect"
                    style="display: none"
                  />
                  <div v-if="!imagePreview" class="upload-placeholder">
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p>Arraste uma imagem ou clique para selecionar</p>
                    <span class="upload-hint">PNG, JPG até 5MB</span>
                  </div>
                  <div v-else class="image-preview">
                    <img :src="imagePreview" alt="Preview" />
                    <button type="button" @click.stop="removeImage" class="remove-image-btn" title="Remover imagem">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Descrição -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Descrição
                </label>
                <textarea
                  v-model="formData.description"
                  class="form-textarea"
                  placeholder="Descreva o aparelho, para que serve e seus benefícios..."
                  rows="3"
                  required
                ></textarea>
              </div>

              <!-- Como Usar -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  Instruções de Uso
                </label>
                <textarea
                  v-model="formData.howToUse"
                  class="form-textarea"
                  placeholder="Explique passo a passo como utilizar o aparelho corretamente..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <!-- Dicas de Segurança -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  Dicas de Segurança (opcional)
                </label>
                <input
                  v-model="safetyTipsInput"
                  type="text"
                  class="form-input"
                  placeholder="Separe as dicas por ponto e vírgula (;)"
                />
                <small class="form-hint">
                  Ex: Mantenha as costas retas; Não trave os joelhos; Respire corretamente
                </small>
              </div>
            </div>
          </div>

          <!-- Mensagem de Erro -->
          <div v-if="errorMessage" class="error-message">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- Ações do Modal -->
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancelar
            </button>
            <button type="submit" class="btn-save" :disabled="isSubmitting">
              {{ isSubmitting ? 'Cadastrando...' : 'Cadastrar Aparelho' }}
              <svg v-if="!isSubmitting" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <!-- Modal de Detalhes (mantido para caso o usuário abra de outra tela) -->
      <div v-if="selectedEquipment" class="detail-modal-overlay" @click.self="selectedEquipment = null">
        <div class="detail-modal">
          <div class="detail-modal-header">
            <h3>{{ selectedEquipment.name }}</h3>
            <button @click="selectedEquipment = null" class="modal-close">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <div class="detail-modal-body">
            <div v-if="selectedEquipment.image" class="detail-image">
              <img :src="getImageUrl(selectedEquipment.image)" :alt="selectedEquipment.name" />
            </div>

            <div class="detail-section">
              <h4 class="detail-section-title">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Descrição
              </h4>
              <p>{{ selectedEquipment.description }}</p>
            </div>

            <div v-if="selectedEquipment.howToUse" class="detail-section">
              <h4 class="detail-section-title">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Como Usar
              </h4>
              <p class="pre-wrap">{{ selectedEquipment.howToUse }}</p>
            </div>

            <div class="detail-section">
              <h4 class="detail-section-title">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                Dicas de Segurança
              </h4>
              <p class="pre-wrap">{{ selectedEquipment.safetyTips || 'Não informado' }}</p>
            </div>

            <div v-if="selectedEquipment.muscleGroups && selectedEquipment.muscleGroups.length > 0" class="detail-section">
              <h4 class="detail-section-title">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Grupos Musculares
              </h4>
              <div class="muscle-tags">
                <span v-for="muscle in selectedEquipment.muscleGroups" :key="muscle" class="muscle-tag">
                  {{ getMuscleLabel(muscle) }}
                </span>
              </div>
            </div>
          </div>
        </div>
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
import { useThemeStore } from '@/store/theme';
import NotificationModal from '@/components/NotificationModal.vue';
import { storeToRefs } from 'pinia';
import api from '@/api';

export default {
  name: 'EquipmentModal',
  components: {
    NotificationModal
  },
  props: {
    equipmentList: {
      type: Array,
      default: () => []
    },
    instructorId: {
      type: String,
      required: true
    }
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    return { isDarkMode };
  },
  mounted() {
    if (!this.instructorId) {
      console.error('❌ [EquipmentModal] CRÍTICO: instructorId está null/undefined!');
    }
    console.log('EquipmentModal mounted:', {
      muscleGroupOptions: this.muscleGroupOptions,
      formDataMuscleGroups: this.formData.muscleGroups
    });
  },
  data() {
    return {
      notification: { visible: false, type: 'info', title: '', message: '' },
      formData: {
        name: '',
        category: '',
        difficulty: '',
        description: '',
        howToUse: '',
        muscleGroups: [],
        imageBase64: ''
      },
      safetyTipsInput: '',
      imagePreview: null,
      isSubmitting: false,
      errorMessage: '',
      selectedEquipment: null,
      muscleGroupOptions: [
        { value: 'peito', label: 'Peito' },
        { value: 'costas', label: 'Costas' },
        { value: 'ombros', label: 'Ombros' },
        { value: 'biceps', label: 'Bíceps' },
        { value: 'triceps', label: 'Tríceps' },
        { value: 'pernas', label: 'Pernas' },
        { value: 'gluteos', label: 'Glúteos' },
        { value: 'abdomen', label: 'Abdômen' },
        { value: 'panturrilha', label: 'Panturrilha' },
        { value: 'antebraco', label: 'Antebraço' },
        { value: 'corpo-todo', label: 'Corpo Todo' }
      ]
    };
  },
  computed: {
    getImageUrl() {
      return (imagePath) => {
        if (!imagePath) return null;
        // Se já for uma URL completa, retornar como está
        if (imagePath.startsWith('http')) return imagePath;
        // Caso contrário, construir URL do backend (sem /api pois as imagens são servidas direto)
        return `http://localhost:3000${imagePath}`;
      };
    }
  },
  methods: {
    toggleMuscleGroup(muscleValue) {
      console.log('Toggling muscle group:', muscleValue);
      console.log('Current groups before:', [...this.formData.muscleGroups]);
      
      // Criar uma nova cópia do array para forçar reatividade
      const currentGroups = [...this.formData.muscleGroups];
      const index = currentGroups.indexOf(muscleValue);
      
      if (index > -1) {
        // Remove se já existe
        currentGroups.splice(index, 1);
      } else {
        // Adiciona se não existe
        currentGroups.push(muscleValue);
      }
      
      // Atualizar o array inteiro para garantir reatividade no Vue 3
      this.formData.muscleGroups = currentGroups;
      
      console.log('Current groups after:', [...this.formData.muscleGroups]);
    },
    handleMuscleGroupChange(event) {
      console.log('Checkbox event:', {
        value: event.target.value,
        checked: event.target.checked,
        currentGroups: [...this.formData.muscleGroups]
      });
      
      // Force reactivity update
      this.$forceUpdate();
    },
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
      // Comprimir a imagem antes de converter para base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Criar canvas para redimensionar
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar se for muito grande (máximo 1200px)
          const maxSize = 1200;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Converter para base64 com qualidade reduzida
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          
          // Verificar tamanho após compressão
          const sizeInBytes = (compressedBase64.length * 3) / 4;
          if (sizeInBytes > 10 * 1024 * 1024) { // 10MB após compressão
            this.errorMessage = 'A imagem ainda está muito grande. Tente uma imagem menor.';
            return;
          }
          
          this.imagePreview = compressedBase64;
          this.formData.imageBase64 = compressedBase64;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage() {
      this.imagePreview = null;
      this.formData.imageBase64 = '';
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    async handleSubmit() {
      // Validar instructorId
      if (!this.instructorId) {
        this.errorMessage = 'ID do instrutor não encontrado. Por favor, recarregue a página.';
        return;
      }

      if (!this.formData.name || !this.formData.category || !this.formData.difficulty || 
          !this.formData.description || !this.formData.howToUse) {
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
        return;
      }

      if (this.formData.muscleGroups.length === 0) {
        this.errorMessage = 'Selecione pelo menos um grupo muscular';
        return;
      }

      this.isSubmitting = true;
      this.errorMessage = '';

      try {
        const equipmentData = {
          ...this.formData,
          safetyTips: this.safetyTipsInput || ''
        };

        await api.post(`/equipments/instructor/${this.instructorId}`, equipmentData);
        
        this.$emit('equipment-added');
        this.resetForm();
        this.closeModal();
      } catch (error) {
        console.error('Erro ao cadastrar equipamento:', error);
        this.errorMessage = error.response?.data?.message || 'Erro ao cadastrar equipamento. Tente com uma imagem menor.';
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        category: '',
        difficulty: '',
        description: '',
        howToUse: '',
        muscleGroups: [],
        imageBase64: ''
      };
      this.safetyTipsInput = '';
      this.imagePreview = null;
      this.errorMessage = '';
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    async removeEquipment(equipment) {
      if (!confirm(`Deseja realmente remover "${equipment.name}"?`)) {
        return;
      }

      try {
        await api.delete(`/equipments/${equipment._id}`);
        this.$emit('equipment-removed');
      } catch (error) {
        console.error('Erro ao remover equipamento:', error);
        this.showNotification('error', 'Erro', 'Erro ao remover equipamento');
      }
    },
    viewEquipment(equipment) {
      this.selectedEquipment = equipment;
    },
    getDifficultyLabel(difficulty) {
      const labels = {
        iniciante: 'Iniciante',
        intermediario: 'Intermediário',
        avancado: 'Avançado'
      };
      return labels[difficulty] || difficulty;
    },
    getCategoryLabel(category) {
      const labels = {
        cardio: 'Cardio',
        musculacao: 'Musculação',
        funcional: 'Funcional',
        crossfit: 'CrossFit',
        livre: 'Peso Livre',
        outros: 'Outros'
      };
      return labels[category] || category;
    },
    getMuscleLabel(muscle) {
      const option = this.muscleGroupOptions.find(m => m.value === muscle);
      return option ? option.label : muscle;
    },
    truncate(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
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

/* STEPS INDICATOR */
.steps-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.step-item:hover .step-circle {
  transform: scale(1.05);
}

.step-circle {
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

.step-item.active .step-circle {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  border-color: var(--primary-color);
  color: white;
  transform: scale(1.1);
}

.step-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.step-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.step-title {
  font-size: 0.875rem;
  color: var(--text-color);
  font-weight: 600;
}

.step-connector {
  width: 32px;
  height: 2px;
  background: var(--border-color);
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

/* FORM */
.equipment-form {
  width: 100%;
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
  font-size: 0.875rem;
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
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.dashboard-dark .checkbox-label {
  background: #334155;
  border-color: #475569;
}

.checkbox-label:hover {
  border-color: #3b82f6;
  background: #ffffff;
}

.dashboard-dark .checkbox-label:hover {
  background: #475569;
  border-color: #3b82f6;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
  margin: 0;
  flex-shrink: 0;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #1f2937;
  cursor: pointer;
  user-select: none;
}

.dashboard-dark .checkbox-text {
  color: #f1f5f9;
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
  border-color: #3b82f6;
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
  object-fit: cover;
  border-radius: 10px;
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
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.remove-image-btn i {
  font-size: 14px;
  pointer-events: none;
}

.remove-image-btn:hover {
  background: rgb(239, 68, 68);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
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

.error-message svg {
  flex-shrink: 0;
}

/* EQUIPMENT LIST */
.equipment-list {
  min-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  color: var(--text-secondary);
  opacity: 0.3;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.empty-subtext {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* EQUIPMENT GRID */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.equipment-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.equipment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.3);
  border-color: var(--primary-color);
}

.equipment-image,
.equipment-image-placeholder {
  width: 100%;
  height: 200px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.equipment-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.equipment-image-placeholder svg {
  color: var(--text-secondary);
  opacity: 0.2;
}

.equipment-content {
  padding: 1.25rem;
}

.equipment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.equipment-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  flex: 1;
}

.difficulty-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.difficulty-badge.iniciante {
  background: rgba(34, 197, 94, 0.15);
  color: rgb(34, 197, 94);
}

.difficulty-badge.intermediario {
  background: rgba(234, 179, 8, 0.15);
  color: rgb(234, 179, 8);
}

.difficulty-badge.avancado {
  background: rgba(239, 68, 68, 0.15);
  color: rgb(239, 68, 68);
}

.equipment-category {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
}

.muscle-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.muscle-tag {
  padding: 0.25rem 0.625rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.75rem;
  color: var(--text-color);
  font-weight: 500;
}

.equipment-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.equipment-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
}

.view-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.view-btn:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.delete-btn {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: rgb(239, 68, 68);
}

.delete-btn:hover {
  background: rgb(239, 68, 68);
  border-color: rgb(239, 68, 68);
  color: white;
  transform: translateY(-2px);
}

/* DETAIL MODAL */
.detail-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
}

.detail-modal {
  background: var(--bg-primary);
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  border: 1px solid var(--border-color);
}

.detail-modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  z-index: 10;
}

.detail-modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.detail-modal-body {
  padding: 2rem;
}

.detail-image {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.75rem 0;
}

.detail-section-title svg {
  color: var(--primary-color);
}

.detail-section p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.pre-wrap {
  white-space: pre-wrap;
}

.safety-tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.safety-tips-list li {
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.safety-tips-list li:before {
  content: '⚠️';
  flex-shrink: 0;
}

.safety-tips-list li:last-child {
  margin-bottom: 0;
}

/* SCROLLBAR */
.modal-container-large::-webkit-scrollbar,
.detail-modal::-webkit-scrollbar {
  width: 8px;
}

.modal-container-large::-webkit-scrollbar-track,
.detail-modal::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 10px;
}

.modal-container-large::-webkit-scrollbar-thumb,
.detail-modal::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 10px;
}

.modal-container-large::-webkit-scrollbar-thumb:hover,
.detail-modal::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }

  .steps-indicator {
    width: 100%;
    justify-content: space-between;
  }

  .step-info {
    display: none;
  }

  .equipment-grid {
    grid-template-columns: 1fr;
  }

  .muscle-groups-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Modal Actions */
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
  flex: 1;
}

.btn-cancel {
  background: var(--bg-secondary);
  color: var(--text-primary);
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

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.btn-save:active {
  transform: translateY(0);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-save:disabled:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.btn-save:disabled::before {
  display: none;
}

@media (max-width: 768px) {
  .modal-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn-cancel,
  .btn-save {
    max-width: none;
    width: 100%;
  }
}
</style>
