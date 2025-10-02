<template>
  <div 
    class="modal-overlay" 
    :class="[isDarkMode ? 'dark' : 'light', { 'is-mounted': isMounted }]" 
    @click.self="resetForm"
  >
    <div class="modal-container">
      <button class="modal-close" @click="resetForm" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      
      <div class="modal-header">
        <div class="header-icon">
          <div class="icon-wrapper">
            <span v-if="editMode">✏️</span>
            <span v-else>🏢</span>
          </div>
        </div>
        <h2 class="modal-title">
          {{ editMode ? 'Editar Academia' : 'Nova Academia' }}
        </h2>
        <p class="modal-subtitle">
          {{ editMode ? 'Atualize as informações da academia' : 'Preencha os dados para cadastrar uma nova academia' }}
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-form">
        <!-- Image Upload Section -->
        <div class="image-upload-section">
          <div class="section-header">
            <h3 class="section-title">
              <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Imagem da Academia
            </h3>
            <p class="section-description">Adicione uma foto de capa para sua academia</p>
          </div>
          
          <div class="image-upload-wrapper">
            <div class="image-preview" @click="triggerFileInput">
              <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="preview-img"/>
              <div v-else class="upload-placeholder">
                <div class="placeholder-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <span class="placeholder-text">Clique para adicionar imagem</span>
                <span class="placeholder-hint">PNG, JPG até 5MB</span>
              </div>
              <div class="image-overlay" v-if="imagePreview">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              class="hidden"
              @change="handleImageChange"
            />
          </div>
        </div>

        <!-- Basic Information Section -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">
              <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Informações Básicas
            </h3>
            <p class="section-description">Dados principais da academia</p>
          </div>
            
          <div class="form-group">
            <label for="name" class="form-label">
              <span class="label-text">Nome da Academia</span>
              <span class="label-required">*</span>
            </label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                required
                class="form-input"
                placeholder="Ex: Academia Fitness Plus"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="description" class="form-label">
              <span class="label-text">Descrição</span>
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              class="form-textarea"
              rows="4"
              placeholder="Conte um pouco sobre sua academia, diferenciais, horários..."
            ></textarea>
          </div>
        </div>

        <!-- Location Section -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">
              <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Localização
            </h3>
            <p class="section-description">Endereço completo da academia</p>
          </div>
          
          <div class="form-row">
            <div class="form-group full-width">
              <label for="address" class="form-label">
                <span class="label-text">Endereço</span>
                <span class="label-required">*</span>
              </label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                <input
                  type="text"
                  id="address"
                  v-model="formData.location.address"
                  required
                  class="form-input"
                  placeholder="Rua, avenida, número"
                />
              </div>
            </div>

            <div class="form-group half-width">
              <label for="city" class="form-label">
                <span class="label-text">Cidade</span>
                <span class="label-required">*</span>
              </label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <path d="M9 22V12h6v10"/>
                </svg>
                <input
                  type="text"
                  id="city"
                  v-model="formData.location.city"
                  required
                  class="form-input"
                  placeholder="Cidade"
                />
              </div>
            </div>

            <div class="form-group quarter-width">
              <label for="state" class="form-label">
                <span class="label-text">Estado</span>
                <span class="label-required">*</span>
              </label>
              <input
                type="text"
                id="state"
                v-model="formData.location.state"
                required
                class="form-input"
                placeholder="UF"
                maxlength="2"
                style="text-transform: uppercase;"
              />
            </div>

            <div class="form-group quarter-width">
              <label for="zipCode" class="form-label">
                <span class="label-text">CEP</span>
                <span class="label-required">*</span>
              </label>
              <input
                type="text"
                id="zipCode"
                v-model="formData.location.zipCode"
                required
                class="form-input"
                placeholder="00000-000"
                v-mask="'#####-###'"
              />
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">
              <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Contato
            </h3>
            <p class="section-description">Informações para contato</p>
          </div>
          
          <div class="form-row">
            <div class="form-group half-width">
              <label for="phone" class="form-label">
                <span class="label-text">Telefone</span>
                <span class="label-required">*</span>
              </label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  required
                  class="form-input"
                  placeholder="(00) 0000-0000"
                  v-mask="'(##) ####-####'"
                />
              </div>
            </div>
            
            <div class="form-group half-width">
              <label for="email" class="form-label">
                <span class="label-text">E-mail</span>
              </label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  class="form-input"
                  placeholder="contato@academia.com"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" @click="resetForm" class="btn btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            <span>Cancelar</span>
          </button>
          <button type="submit" class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>{{ editMode ? 'Atualizar Academia' : 'Cadastrar Academia' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { mask } from 'vue-the-mask';
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';

export default {
  name: 'GymForm',
  directives: { mask },
  props: {
    gym: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    
    const fileInput = ref(null);
    const imagePreview = ref(null);
    const isMounted = ref(false);

    const defaultFormData = {
      name: '',
      description: '',
      image: null,
      location: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      phone: '',
      email: '',
    };

    const formData = ref({ ...defaultFormData });

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        formData.value.image = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const editMode = computed(() => !!props.gym);

    return {
      isDarkMode,
      fileInput,
      imagePreview,
      formData,
      isMounted,
      triggerFileInput,
      handleImageChange,
      editMode,
    };
  },
  mounted() {
    // Bloquear scroll do body
    document.body.style.overflow = 'hidden';
    
    // Garantir que o CSS seja aplicado antes de mostrar o conteúdo
    this.$nextTick(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.isMounted = true;
        }, 50);
      });
    });
  },
  beforeUnmount() {
    // Restaurar scroll do body
    document.body.style.overflow = '';
  },
  watch: {
    gym: {
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };
          this.imagePreview = newVal.imageUrl;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async handleSubmit() {
      try {
        console.log('=== Início do handleSubmit ===');
        
        // Validações básicas
        if (!this.formData.name || !this.formData.phone || 
            !this.formData.location.address || !this.formData.location.city || 
            !this.formData.location.state || !this.formData.location.zipCode) {
          throw new Error('Por favor, preencha todos os campos obrigatórios.');
        }
        
        // Criamos o objeto de dados com validações extras
        const gymData = {
          name: this.formData.name.trim() || null,
          description: (this.formData.description || '').trim(),
          phone: this.formData.phone.trim() || null,
          email: (this.formData.email || '').trim(),
          location: {
            address: this.formData.location.address.trim() || null,
            city: this.formData.location.city.trim() || null,
            state: this.formData.location.state.trim().toUpperCase() || null,
            zipCode: this.formData.location.zipCode.trim() || null
          }
        };
        
        // Validação final antes de enviar
        const requiredFields = ['name', 'phone'];
        const requiredLocationFields = ['address', 'city', 'state', 'zipCode'];
        
        const missingFields = requiredFields.filter(field => !gymData[field]);
        const missingLocationFields = requiredLocationFields.filter(field => !gymData.location[field]);
        
        if (missingFields.length > 0 || missingLocationFields.length > 0) {
          throw new Error(`Campos obrigatórios faltando: ${[...missingFields, ...missingLocationFields.map(f => 'location.' + f)].join(', ')}`);
        }
        
        console.log('Enviando dados validados:', gymData);
        this.$emit('submit', { data: gymData });
      } catch (error) {
        console.error('Erro ao preparar dados do formulário:', error);
      }
    },
    resetForm() {
      this.formData = { ...this.defaultFormData };
      this.imagePreview = null;
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

/* Theme Variables */
.light {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-gradient: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  --secondary-gradient: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  --background: #f8fafc;
  --surface: #ffffff;
  --overlay: rgba(15, 23, 42, 0.5);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --border: #e2e8f0;
  --border-hover: #cbd5e1;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
}

.dark {
  --primary-color: #8b5cf6;
  --primary-hover: #7c3aed;
  --primary-gradient: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  --secondary-gradient: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  --background: #0f172a;
  --surface: #1e293b;
  --overlay: rgba(0, 0, 0, 0.7);
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-tertiary: #64748b;
  --border: #334155;
  --border-hover: #475569;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  font-family: 'Inter', sans-serif;
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.modal-overlay.is-mounted {
  opacity: 1;
  animation: fadeIn 0.3s ease-out forwards;
}

.modal-container {
  background: var(--surface);
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  position: relative;
  border: 1px solid var(--border);
  transform: translateY(40px);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out;
  will-change: transform, opacity;
}

.modal-overlay.is-mounted .modal-container {
  transform: translateY(0);
  opacity: 1;
  will-change: auto;
}

/* Custom Scrollbar */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: var(--background);
  border-radius: 0 24px 24px 0;
}

.modal-container::-webkit-scrollbar-thumb {
  background: var(--border-hover);
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* Close Button */
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--background);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  opacity: 0;
  transform: scale(0.8);
}

.modal-overlay.is-mounted .modal-close {
  opacity: 1;
  transform: scale(1);
  transition: all 0.3s ease 0.2s, transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.modal-close:hover {
  background: var(--error);
  border-color: var(--error);
  transform: scale(1) rotate(90deg);
}

.modal-close:hover svg {
  stroke: white;
}

.modal-close svg {
  width: 20px;
  height: 20px;
  stroke: var(--text-secondary);
  transition: stroke 0.2s ease;
}

/* Modal Header */
.modal-header {
  text-align: center;
  padding: 48px 48px 32px;
  border-bottom: 1px solid var(--border);
  background: var(--background);
  opacity: 0;
  transition: opacity 0.3s ease-out 0.1s;
}

.modal-overlay.is-mounted .modal-header {
  opacity: 1;
}

.header-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: var(--shadow-lg);
  animation: float 3s ease-in-out infinite;
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}

.modal-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* Modal Form */
.modal-form {
  padding: 32px 48px 48px;
  opacity: 0;
  transition: opacity 0.3s ease-out 0.2s;
}

.modal-overlay.is-mounted .modal-form {
  opacity: 1;
}

/* Image Upload Section */
.image-upload-section {
  margin-bottom: 32px;
  text-align: center;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease-out 0.3s, transform 0.4s ease-out 0.3s;
}

.modal-overlay.is-mounted .image-upload-section {
  opacity: 1;
  transform: translateY(0);
}

.image-upload-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.image-upload-section .section-title {
  justify-content: center;
}

.form-section .section-title {
  justify-content: flex-start;
}

.title-icon {
  width: 20px;
  height: 20px;
  stroke: var(--primary-color);
  stroke-width: 2;
}

.section-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.image-preview {
  width: 300px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  background: var(--background);
  border: 2px dashed var(--border);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 300px;
  min-height: 300px;
}

.image-preview:hover {
  border-color: var(--primary-color);
  border-style: solid;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.image-overlay svg {
  width: 40px;
  height: 40px;
  stroke: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px;
  text-align: center;
  width: 100%;
  height: 100%;
  justify-content: center;
  box-sizing: border-box;
}

.placeholder-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.placeholder-icon svg {
  width: 30px;
  height: 30px;
  stroke: white;
  flex-shrink: 0;
}

.placeholder-text {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  flex-shrink: 0;
}

.placeholder-hint {
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Form Sections */
.form-section {
  background: var(--background);
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 24px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.form-section:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow);
}

/* Form Groups */
.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.full-width {
  flex: 1 1 100%;
}

.half-width {
  flex: 1 1 calc(50% - 10px);
}

.quarter-width {
  flex: 1 1 calc(25% - 15px);
}

/* Form Labels */
.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.label-text {
  color: var(--text-primary);
}

.label-required {
  color: var(--error);
  font-weight: 600;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  stroke: var(--text-tertiary);
  pointer-events: none;
  transition: stroke 0.2s ease;
}

.input-wrapper:focus-within .input-icon {
  stroke: var(--primary-color);
}

/* Form Inputs */
.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  outline: none;
}

.input-wrapper .form-input {
  padding-left: 42px;
}

.form-input:hover,
.form-textarea:hover {
  border-color: var(--border-hover);
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.dark .form-input:focus,
.dark .form-textarea:focus {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-tertiary);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
}

.btn svg {
  width: 18px;
  height: 18px;
  stroke-width: 2.5;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: var(--background);
  color: var(--text-primary);
  border: 1.5px solid var(--border);
}

.btn-secondary:hover {
  background: var(--surface);
  border-color: var(--border-hover);
}

/* Hidden Input */
.hidden {
  display: none;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  .modal-header {
    padding: 32px 24px 24px;
  }

  .modal-form {
    padding: 24px;
  }

  .image-preview {
    width: 250px;
    height: 250px;
  }

  .half-width,
  .quarter-width {
    flex: 1 1 100%;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 20px;
  }

  .image-preview {
    width: 200px;
    height: 200px;
  }

  .section-title {
    font-size: 1rem;
  }
}
</style>