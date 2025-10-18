<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div :class="['instructor-profile', { 'dark-mode': isDarkMode }]">
    <DashboardNavBar />
    
    <div class="main-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Carregando perfil...</p>
      </div>

      <!-- Content -->
      <div v-else class="profile-content">
        <!-- Page Title -->
        <div class="page-title-section">
          <div>
            <h1 class="page-title">Meu Perfil</h1>
            <p class="page-subtitle">Gerencie suas informações profissionais</p>
          </div>
        </div>

        <!-- Card de Perfil Principal -->
        <div class="card-profile-main">
          <div class="profile-header">
            <div class="header-content">
              <div class="avatar-wrapper">
                <div class="avatar">
                  <img :src="instructorData.avatar" :alt="instructorData.name" />
                </div>
                <label for="avatar-upload" class="avatar-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  @change="handleAvatarUpload"
                  style="display: none;"
                />
              </label>
            </div>

            <div class="header-info">
              <div class="name-section">
                <h1>{{ instructorData.name || 'Instrutor' }}</h1>
                <span class="badge">Personal Trainer</span>
              </div>
              <p class="email">{{ instructorData.email }}</p>
              <p class="subtitle">Gerencie suas informações profissionais</p>
            </div>
          </div>
        </div>
        </div>

        <form @submit.prevent="saveProfile" class="sections">
          
          <!-- Card Informações Pessoais -->
          <div class="card">
            <div class="card-header">
              <h3>
                <i class="fas fa-user-circle"></i>
                Informações Pessoais
              </h3>
            </div>
            <div class="card-content">
              <div class="form-grid">
                <div class="form-group">
                  <label for="name">Nome Completo <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <i class="fas fa-user"></i>
                    <input id="name" v-model="instructorData.name" type="text" required placeholder="Digite seu nome">
                  </div>
                </div>
                <div class="form-group">
                  <label for="email">Email <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <i class="fas fa-envelope"></i>
                    <input id="email" v-model="instructorData.email" type="email" required placeholder="seu@email.com">
                  </div>
                </div>
                <div class="form-group">
                  <label for="phone">Telefone</label>
                  <div class="input-wrapper">
                    <i class="fas fa-phone"></i>
                    <input id="phone" v-model="instructorData.phone" type="tel" placeholder="(00) 00000-0000">
                  </div>
                </div>
                <div class="form-group">
                  <label for="birthdate">Data de Nascimento</label>
                  <div class="input-wrapper">
                    <i class="fas fa-calendar"></i>
                    <input id="birthdate" v-model="instructorData.birthDate" type="date">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Informações Profissionais -->
          <div class="card">
            <div class="card-header">
              <h3>
                <i class="fas fa-briefcase"></i>
                Informações Profissionais
              </h3>
            </div>
            <div class="card-content">
              <div class="form-grid">
                <div class="form-group">
                  <label for="cref">CREF (Registro Profissional)</label>
                  <div class="input-wrapper">
                    <i class="fas fa-id-card"></i>
                    <input id="cref" v-model="instructorData.cref" type="text" placeholder="000000-G/UF">
                  </div>
                </div>
                <div class="form-group">
                  <label for="specialization">Especialização</label>
                  <div class="input-wrapper">
                    <i class="fas fa-graduation-cap"></i>
                    <input id="specialization" v-model="instructorData.specialization" type="text" placeholder="Ex: Musculação, Funcional, etc.">
                  </div>
                </div>
                <div class="form-group">
                  <label for="experience">Anos de Experiência</label>
                  <div class="input-wrapper">
                    <i class="fas fa-award"></i>
                    <input id="experience" v-model="instructorData.yearsOfExperience" type="number" min="0" placeholder="0">
                  </div>
                </div>
                <div class="form-group">
                  <label for="gym">Academia Atual</label>
                  <div class="input-wrapper">
                    <i class="fas fa-building"></i>
                    <input id="gym" v-model="instructorData.currentGym" type="text" placeholder="Nome da academia" readonly>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Sobre Mim -->
          <div class="card">
            <div class="card-header">
              <h3>
                <i class="fas fa-info-circle"></i>
                Sobre Mim
              </h3>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label for="bio">Descrição Profissional</label>
                <textarea 
                  id="bio"
                  v-model="instructorData.bio" 
                  rows="6"
                  placeholder="Conte um pouco sobre sua experiência, metodologia de treino e especializações..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="save-section">
            <button type="button" class="btn-cancel" @click="cancelEdit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Cancelar
            </button>
            <button type="submit" class="btn-save" :disabled="saving">
              <div v-if="saving" class="spinner-small"></div>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>

        </form>
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

<script setup>
import { ref, reactive, onMounted } from 'vue';
import NotificationModal from '@/components/NotificationModal.vue';
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import DashboardNavBar from '@/components/DashboardNavBar.vue';
import api from '@/api';

const themeStore = useThemeStore();
const { isDarkMode } = storeToRefs(themeStore);

const notification = ref({ visible: false, type: 'info', title: '', message: '' });
const loading = ref(false);
const saving = ref(false);
const instructorId = ref(null);
const originalAvatar = ref(''); // Armazena o avatar original
const pendingAvatarFile = ref(null); // Armazena o arquivo pendente

const instructorData = reactive({
  avatar: 'https://ui-avatars.com/api/?name=Instrutor&background=2563eb&color=fff&size=200',
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  cref: '',
  specialization: '',
  yearsOfExperience: 0,
  currentGym: '',
  bio: ''
});

// Fetch instructor profile
const fetchProfile = async () => {
  loading.value = true;
  try {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      showNotification('info', 'Informacao', 'Usuário não encontrado. Faça login novamente.');
      return;
    }

    const userData = JSON.parse(storedUser);
    const userId = userData.id || userData._id;
    
    // Fetch instructor data
    const response = await api.get(`/instructors/user/${userId}`);
    const instructor = response.data;
    
    instructorId.value = instructor._id;
    
    // Populate form - instructor.userId is populated with user data
    instructorData.name = instructor.userId?.name || instructor.name || userData.name || '';
    instructorData.email = instructor.userId?.email || instructor.email || userData.email || '';
    instructorData.phone = instructor.userId?.phone || instructor.phone || '';
    instructorData.birthDate = instructor.userId?.birthDate?.split('T')[0] || '';
    
    // Avatar: priorizar do userId, depois userData, depois default
    const avatarFromUser = instructor.userId?.avatar || userData.avatar;
    if (avatarFromUser) {
      // Se for base64, usar direto; se for URL antiga, construir path completo
      if (avatarFromUser.startsWith('data:image')) {
        // É base64, usar diretamente
        instructorData.avatar = avatarFromUser;
        originalAvatar.value = avatarFromUser;
      } else if (avatarFromUser.startsWith('http')) {
        // Já é URL completa
        instructorData.avatar = avatarFromUser;
        originalAvatar.value = avatarFromUser;
      } else {
        // É path relativo (sistema antigo)
        const avatarUrl = `http://localhost:3000${avatarFromUser}`;
        instructorData.avatar = avatarUrl;
        originalAvatar.value = avatarUrl;
      }
    } else {
      originalAvatar.value = instructorData.avatar; // Salvar avatar padrão
    }
    
    // Limpar arquivo pendente ao recarregar
    pendingAvatarFile.value = null;
    
    instructorData.cref = instructor.cref || '';
    instructorData.specialization = (instructor.specialties && instructor.specialties.length > 0) 
      ? instructor.specialties.join(', ') 
      : '';
    instructorData.yearsOfExperience = instructor.yearsOfExperience || 0;
    instructorData.currentGym = instructor.gymId?.name || 'Nenhuma academia vinculada';
    instructorData.bio = instructor.bio || '';
    
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    showNotification('error', 'Erro', 'Erro ao carregar perfil. Tente novamente.');
  } finally {
    loading.value = false;
  }
};

// Save profile
const saveProfile = async () => {
  saving.value = true;
  try {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return;

    const userData = JSON.parse(storedUser);
    const userId = userData.id || userData._id;

    // Se houver um arquivo de avatar pendente, fazer upload primeiro
    if (pendingAvatarFile.value) {
      const formData = new FormData();
      formData.append('avatar', pendingAvatarFile.value);

      try {
        const avatarResponse = await api.post(`/auth/user/${userId}/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (avatarResponse.data.avatarUrl) {
          // Avatar retorna em base64, usar diretamente
          const avatarBase64 = avatarResponse.data.avatarUrl;
          
          // Atualizar avatar no sessionStorage
          userData.avatar = avatarBase64;
          
          // Atualizar avatar original e atual
          originalAvatar.value = avatarBase64;
          instructorData.avatar = avatarBase64;
        }
      } catch (avatarError) {
        console.error('Erro ao fazer upload do avatar:', avatarError);
        showNotification('info', 'Informacao', '❌ Erro ao salvar a foto de perfil. Outras alterações serão salvas.');
      }
      
      // Limpar arquivo pendente após upload
      pendingAvatarFile.value = null;
    }

    // Update user data
    await api.put(`/auth/user/${userId}`, {
      name: instructorData.name,
      email: instructorData.email,
      phone: instructorData.phone,
      birthDate: instructorData.birthDate
    });

    // Update instructor data
    await api.put(`/instructors/${instructorId.value}`, {
      cref: instructorData.cref,
      specialization: instructorData.specialization,
      yearsOfExperience: instructorData.yearsOfExperience,
      bio: instructorData.bio
    });

    // Update session
    userData.name = instructorData.name;
    userData.email = instructorData.email;
    sessionStorage.setItem('user', JSON.stringify(userData));

    showNotification('success', 'Sucesso', '✅ Perfil atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    showNotification('info', 'Informacao', '❌ Erro ao salvar perfil. Tente novamente.');
  } finally {
    saving.value = false;
  }
};

// Função para mostrar notificações
const showNotification = (type, title, message) => {
  notification.value = {
    visible: true,
    type: type,
    title: title,
    message: message
  };
};

// Handle avatar upload - apenas preview, não salva ainda
const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validação
  if (file.size > 5 * 1024 * 1024) {
    showNotification('info', 'Informacao', '❌ Arquivo muito grande! Tamanho máximo: 5MB');
    event.target.value = '';
    return;
  }

  if (!file.type.startsWith('image/')) {
    showNotification('warning', 'Atencao', '❌ Por favor, selecione uma imagem válida');
    event.target.value = '';
    return;
  }

  // Armazenar o arquivo para upload posterior
  pendingAvatarFile.value = file;

  // Criar preview local da imagem
  const reader = new FileReader();
  reader.onload = (e) => {
    instructorData.avatar = e.target.result;
  };
  reader.readAsDataURL(file);

  // Limpar input
  event.target.value = '';
};

// Cancel edit and reload
const cancelEdit = async () => {
  if (confirm('⚠️ Deseja descartar as alterações não salvas?')) {
    // Restaurar avatar original
    instructorData.avatar = originalAvatar.value;
    // Limpar arquivo pendente
    pendingAvatarFile.value = null;
    // Recarregar dados do perfil
    await fetchProfile();
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}


/* === LAYOUT PRINCIPAL === */
.instructor-profile {
  margin-left: 280px;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Detecta quando o navbar está colapsado */
body:has(.navbar-collapsed) .instructor-profile {
  margin-left: 0 !important;
}

/* Light mode colors */
.instructor-profile {
  background-color: #f9fafb;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --border-color: #e5e7eb;
  --text-color: #111827;
  --text-muted: #6b7280;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
}

/* Dark mode colors */
.instructor-profile.dark-mode {
  background-color: #111827;
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --border-color: #374151;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
}

.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 16px;
}

/* === LOADING STATE === */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1.5rem;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-muted);
  font-size: 1rem;
}

/* === PAGE TITLE === */
.page-title-section {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
}

/* === CARD DE PERFIL PRINCIPAL === */
.card-profile-main {
  margin-bottom: 32px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-profile-main:hover {
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.dark-mode .card-profile-main:hover {
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.4);
}

/* === PROFILE HEADER === */
.profile-header {
  margin-bottom: 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 2rem;
}

@media (min-width: 640px) {
  .header-content {
    flex-direction: row;
    align-items: center;
  }
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  position: relative;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  border: 4px solid var(--bg-primary);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Overlay de loading no avatar */
.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.avatar-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.avatar-button {
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #111827;
  border: 3px solid var(--bg-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-mode .avatar-button {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  color: #f9fafb;
  border-color: var(--bg-primary);
}

.avatar-button:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.avatar-button.uploading {
  pointer-events: none;
  opacity: 0.8;
}

.dark-mode .avatar-button:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

/* Spinner branco pequeno */
.spinner-small-white {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.header-info {
  flex: 1;
}

.name-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.header-info h1 {
  font-size: 30px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: white;
  font-size: 13px;
  font-weight: 600;
  border-radius: 20px;
  border: none;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.email {
  font-size: 16px;
  color: var(--text-muted);
  margin: 8px 0;
}

.subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin: 4px 0;
}

/* === SECTIONS === */
.sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* === CARD === */
.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.dark-mode .card:hover {
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.4);
}

.card-header {
  padding: 20px 28px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  position: relative;
}

.card-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  border-radius: 0 4px 4px 0;
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  letter-spacing: -0.02em;
}

.card-header i {
  color: var(--primary-color);
  font-size: 22px;
  min-width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  padding: 28px;
  background-color: var(--bg-primary);
}

/* === FORM === */
.form-grid {
  display: grid;
  gap: 28px;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #ef4444;
  font-weight: 700;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  font-size: 16px;
  transition: color 0.2s;
  z-index: 10;
}

.input-wrapper:focus-within i {
  color: var(--primary-color);
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="date"],
input[type="number"] {
  width: 100%;
  height: 46px;
  padding: 12px 14px 12px 44px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 15px;
  color: var(--text-color);
  background: var(--bg-secondary);
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

input[readonly] {
  background-color: var(--bg-secondary);
  cursor: not-allowed;
  opacity: 0.65;
  border-style: dashed;
}

textarea {
  width: 100%;
  min-height: 140px;
  padding: 14px 16px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 15px;
  color: var(--text-color);
  background-color: var(--bg-primary);
  font-family: inherit;
  font-weight: 500;
  resize: vertical;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.6;
}

input:hover:not([readonly]),
textarea:hover {
  border-color: var(--primary-color);
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  transform: translateY(-1px);
}

.dark-mode input:focus,
.dark-mode textarea:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

input::placeholder,
textarea::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

/* === SAVE SECTION === */
.save-section {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
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
  font-family: "Inter", sans-serif; 
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
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
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.6;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .instructor-profile {
    margin-left: 0;
    padding-bottom: 80px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .header-content {
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr !important;
  }

  .header-info h1 {
    font-size: 24px;
  }

  .save-section {
    justify-content: stretch;
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    max-width: 100%;
    justify-content: center;
  }
}
</style>

