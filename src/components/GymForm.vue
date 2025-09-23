<template>
  <div class="gym-form" :class="isDarkMode ? 'dark' : 'light'">
    <div class="form-card">
      <div class="form-header">
        <div class="header-badge">
          <span class="badge-text">{{ editMode ? '✏️ Modo Edição' : '✨ Nova Academia' }}</span>
        </div>
        <h3 class="form-title">
          {{ editMode ? 'Atualizar Academia' : 'Cadastrar Nova Academia' }}
        </h3>
        <p class="form-subtitle">
          {{ editMode ? 'Atualize as informações da academia' : 'Preencha os dados para registrar uma nova academia' }}
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="image-upload-section">
          <div class="image-preview" @click="triggerFileInput">
            <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="preview-img"/>
            <div v-else class="upload-placeholder">
              <i class="fas fa-camera"></i>
              <span>Clique para adicionar uma imagem</span>
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

        <div class="form-section">
          <h4 class="section-title">Informações Básicas</h4>
          <div class="form-group">
            <label for="name">Nome da Academia*</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              required
              class="form-control"
              placeholder="Digite o nome da academia"
            />
          </div>

          <div class="form-group">
            <label for="description">Descrição</label>
            <textarea
              id="description"
              v-model="formData.description"
              class="form-control"
              rows="3"
              placeholder="Descreva sua academia"
            ></textarea>
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">Localização</h4>
          <div class="form-row">
            <div class="form-group col-12">
              <label for="address">Endereço*</label>
              <input
                type="text"
                id="address"
                v-model="formData.location.address"
                required
                class="form-control"
                placeholder="Rua, número"
              />
            </div>

            <div class="form-group col-md-6">
              <label for="city">Cidade*</label>
              <input
                type="text"
                id="city"
                v-model="formData.location.city"
                required
                class="form-control"
                placeholder="Cidade"
              />
            </div>

            <div class="form-group col-md-3">
              <label for="state">Estado*</label>
              <input
                type="text"
                id="state"
                v-model="formData.location.state"
                required
                class="form-control"
                placeholder="UF"
                maxlength="2"
              />
            </div>

            <div class="form-group col-md-3">
              <label for="zipCode">CEP*</label>
              <input
                type="text"
                id="zipCode"
                v-model="formData.location.zipCode"
                required
                class="form-control"
                placeholder="00000-000"
                v-mask="'#####-###'"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4 class="section-title">Contato</h4>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="phone">Telefone*</label>
              <input
                type="tel"
                id="phone"
                v-model="formData.phone"
                required
                class="form-control"
                placeholder="(00) 0000-0000"
                v-mask="'(##) ####-####'"
              />
            </div>
            <div class="form-group col-md-6">
              <label for="email">E-mail</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="form-control"
                placeholder="exemplo@email.com"
              />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetForm" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            {{ editMode ? 'Atualizar' : 'Cadastrar' }}
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
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
      triggerFileInput,
      handleImageChange,
      editMode,
    };
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

.light {
  --primary-color: #2563eb;
  --primary-gradient: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --secondary-gradient: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  --accent-gradient: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  --background-color: #ffffff;
  --surface-color: #f8fafc;
  --card-background: rgba(255, 255, 255, 0.9);
  --text-color: #1e293b;
  --text-secondary: #64748b;
  --border-color: rgba(226, 232, 240, 0.8);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.15);
}

.dark {
  --primary-color: #8b5cf6;
  --primary-gradient: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --secondary-gradient: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  --accent-gradient: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
  --background-color: #0a0a0a;
  --surface-color: #1a1a1a;
  --card-background: rgba(42, 42, 42, 0.8);
  --text-color: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.7);
}

.gym-form {
  font-family: 'Inter', sans-serif;
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.gym-form::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(37, 99, 235, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(59, 130, 246, 0.15) 0%,
      transparent 50%
    );
  z-index: -1;
  animation: spinFloat 20s ease-in-out infinite;
}

.dark .gym-form::before {
  background: radial-gradient(
      circle at 20% 80%,
      rgba(139, 92, 246, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(168, 85, 247, 0.15) 0%,
      transparent 50%
    );
}

.form-card {
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  animation: fadeInUp 0.8s ease-out;
  transition: all 0.3s ease;
}

.form-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  margin-bottom: 1.5rem;
}

.badge-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.form-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: var(--surface-color);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}

.form-section:nth-child(2) { animation-delay: 0.1s; }
.form-section:nth-child(3) { animation-delay: 0.2s; }
.form-section:nth-child(4) { animation-delay: 0.3s; }

.form-section:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  padding-left: 1rem;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 1.5em;
  background: var(--primary-gradient);
  border-radius: 2px;
}

.image-upload-section {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  display: flex;
  justify-content: center;
}

.image-preview {
  width: 220px;
  height: 220px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: var(--surface-color);
  border: 2px dashed var(--border-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.image-preview:hover::before {
  opacity: 0.1;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-preview:hover .preview-img {
  transform: scale(1.05);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
  padding: 2rem;
  background: var(--card-background);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.upload-placeholder i {
  font-size: 2.5rem;
  color: var(--primary-color);
  transition: transform 0.3s ease;
}

.image-preview:hover .upload-placeholder i {
  transform: scale(1.1);
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.col-12 {
  width: 100%;
}

.col-md-6 {
  width: calc(50% - 0.75rem);
}

.col-md-3 {
  width: calc(25% - 1.125rem);
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.85rem 1.2rem;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--surface-color);
  color: var(--text-color);
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color), 0.1);
  transform: translateY(-2px);
}

.form-control::placeholder {
  color: var(--text-secondary);
  opacity: 0.8;
}

.form-control:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.75rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
  transform: scale(0);
  opacity: 0;
  transition: transform 0.6s ease-out, opacity 0.6s ease-out;
}

.btn:hover::before {
  transform: scale(1);
  opacity: 1;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
}

.dark .btn-primary {
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
}

.btn-secondary {
  background: var(--card-background);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.btn:hover .arrow-icon {
  transform: translateX(4px);
}

.hidden {
  display: none;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .form-card {
    padding: 1.5rem;
  }
  
  .col-md-6,
  .col-md-3 {
    width: 100%;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>