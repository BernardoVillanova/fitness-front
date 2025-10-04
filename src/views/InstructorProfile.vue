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

        <form @submit.prevent="saveProfile" id="profile-form" class="profile-grid">
          
          <!-- Card de Perfil Principal -->
          <div class="card card-profile-main">
            <div class="card-body profile-header-body">
              <div class="avatar-wrapper">
                <img :src="instructorData.avatar" :alt="instructorData.name" class="avatar" />
                <label for="avatar-upload" class="avatar-badge">
                  <i class="fas fa-camera"></i>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    accept="image/*" 
                    @change="handleAvatarUpload" 
                    style="display: none;"
                  />
                </label>
              </div>
              <div class="profile-info">
                <h2>{{ instructorData.name || 'Instrutor' }}</h2>
                <p class="profile-email">{{ instructorData.email }}</p>
                <span class="profile-badge">Personal Trainer</span>
              </div>
            </div>
          </div>

          <!-- Card Informações Pessoais -->
          <div class="card card-span-2">
            <div class="card-header">
              <i class="fas fa-user-circle"></i>
              <h3>Informações Pessoais</h3>
            </div>
            <div class="card-body">
              <div class="input-grid">
                <div class="input-group">
                  <label>Nome Completo *</label>
                  <div class="input-with-icon">
                    <i class="fas fa-user"></i>
                    <input v-model="instructorData.name" type="text" required placeholder="Digite seu nome">
                  </div>
                </div>
                <div class="input-group">
                  <label>Email *</label>
                  <div class="input-with-icon">
                    <i class="fas fa-envelope"></i>
                    <input v-model="instructorData.email" type="email" required placeholder="seu@email.com">
                  </div>
                </div>
                <div class="input-group">
                  <label>Telefone</label>
                  <div class="input-with-icon">
                    <i class="fas fa-phone"></i>
                    <input v-model="instructorData.phone" type="tel" placeholder="(00) 00000-0000">
                  </div>
                </div>
                <div class="input-group">
                  <label>Data de Nascimento</label>
                  <div class="input-with-icon">
                    <i class="fas fa-calendar"></i>
                    <input v-model="instructorData.birthDate" type="date">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Informações Profissionais -->
          <div class="card card-span-2">
            <div class="card-header">
              <i class="fas fa-briefcase"></i>
              <h3>Informações Profissionais</h3>
            </div>
            <div class="card-body">
              <div class="input-grid">
                <div class="input-group">
                  <label>CREF (Registro Profissional)</label>
                  <div class="input-with-icon">
                    <i class="fas fa-id-card"></i>
                    <input v-model="instructorData.cref" type="text" placeholder="000000-G/UF">
                  </div>
                </div>
                <div class="input-group">
                  <label>Especialização</label>
                  <div class="input-with-icon">
                    <i class="fas fa-graduation-cap"></i>
                    <input v-model="instructorData.specialization" type="text" placeholder="Ex: Musculação, Funcional, etc.">
                  </div>
                </div>
                <div class="input-group">
                  <label>Anos de Experiência</label>
                  <div class="input-with-icon">
                    <i class="fas fa-award"></i>
                    <input v-model="instructorData.yearsOfExperience" type="number" min="0" placeholder="0">
                  </div>
                </div>
                <div class="input-group">
                  <label>Academia Atual</label>
                  <div class="input-with-icon">
                    <i class="fas fa-building"></i>
                    <input v-model="instructorData.currentGym" type="text" placeholder="Nome da academia" readonly>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Sobre Mim -->
          <div class="card card-span-full">
            <div class="card-header">
              <i class="fas fa-info-circle"></i>
              <h3>Sobre Mim</h3>
            </div>
            <div class="card-body">
              <div class="input-group">
                <label>Descrição Profissional</label>
                <textarea 
                  v-model="instructorData.bio" 
                  rows="4"
                  placeholder="Conte um pouco sobre sua experiência, metodologia de treino e especializações..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Botão Salvar -->
          <div class="save-section">
            <button type="submit" class="btn-save" :disabled="saving">
              <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-check-circle'"></i>
              {{ saving ? 'Salvando alterações...' : 'Salvar Todas as Alterações' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import DashboardNavBar from '@/components/DashboardNavBar.vue';
import api from '@/api';

const themeStore = useThemeStore();
const { isDarkMode } = storeToRefs(themeStore);

const loading = ref(false);
const saving = ref(false);
const instructorId = ref(null);

const instructorData = reactive({
  avatar: 'https://ui-avatars.com/api/?name=Instrutor&background=3b82f6&color=fff&size=200',
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
      alert('Usuário não encontrado. Faça login novamente.');
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
    instructorData.avatar = instructor.userId?.avatar || userData.avatar || instructorData.avatar;
    instructorData.cref = instructor.cref || '';
    instructorData.specialization = (instructor.specialties && instructor.specialties.length > 0) 
      ? instructor.specialties.join(', ') 
      : '';
    instructorData.yearsOfExperience = instructor.yearsOfExperience || 0;
    instructorData.currentGym = instructor.gymId?.name || 'Nenhuma academia vinculada';
    instructorData.bio = instructor.bio || '';
    
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    alert('Erro ao carregar perfil. Tente novamente.');
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

    alert('✅ Perfil atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    alert('❌ Erro ao salvar perfil. Tente novamente.');
  } finally {
    saving.value = false;
  }
};

// Handle avatar upload
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validação
  if (file.size > 5 * 1024 * 1024) {
    alert('❌ Arquivo muito grande! Tamanho máximo: 5MB');
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('❌ Por favor, selecione uma imagem válida');
    return;
  }

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return;

    const userData = JSON.parse(storedUser);
    const userId = userData.id || userData._id;

    const response = await api.post(`/auth/user/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Atualizar avatar localmente
    if (response.data.avatarUrl) {
      instructorData.avatar = response.data.avatarUrl;
      userData.avatar = response.data.avatarUrl;
      sessionStorage.setItem('user', JSON.stringify(userData));
      alert('✅ Foto de perfil atualizada com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    alert(`❌ Erro ao atualizar foto: ${error.response?.data?.message || 'Tente novamente.'}`);
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

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
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --border-color: #e2e8f0;
  --text-color: #1e293b;
  --text-muted: #64748b;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Dark mode colors */
.instructor-profile.dark-mode {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  --bg-primary: #1e1e2d;
  --bg-secondary: #171723;
  --border-color: #2d2d3f;
  --text-color: #f1f5f9;
  --text-muted: #94a3b8;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.main-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
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
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dark-mode .loader {
  border-top-color: #7c3aed;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
}

.page-subtitle {
  margin: 0;
  color: var(--text-muted);
  font-size: 1rem;
}

/* === PROFILE GRID === */
.profile-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.card {
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-profile-main {
  grid-column: span 1;
  border: 2px solid;
  border-color: #3b82f6;
}

.dark-mode .card-profile-main {
  border-color: #7c3aed;
}

.card-span-2 {
  grid-column: span 2;
}

.card-span-full {
  grid-column: span 3;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.card-header i {
  color: #3b82f6;
  font-size: 1.25rem;
}

.dark-mode .card-header i {
  color: #7c3aed;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.card-body {
  padding: 1.5rem;
}

/* === PROFILE HEADER === */
.profile-header-body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 1.5rem !important;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #3b82f6;
}

.dark-mode .avatar {
  border-color: #7c3aed;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid var(--bg-primary);
}

.dark-mode .avatar-badge {
  background: #7c3aed;
}

.avatar-badge:hover {
  transform: scale(1.1);
}

.avatar-badge i {
  color: white;
  font-size: 0.875rem;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.profile-email {
  margin: 0 0 0.5rem 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.profile-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.dark-mode .profile-badge {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
}

/* === INPUTS === */
.input-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon i {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="date"],
input[type="number"],
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.75rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.95rem;
  color: var(--text-color);
  background: var(--bg-secondary);
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
}

input[readonly] {
  background: var(--border-color);
  cursor: not-allowed;
  opacity: 0.7;
}

textarea {
  padding-left: 1rem;
  resize: vertical;
  min-height: 100px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode input:focus,
.dark-mode textarea:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

/* === SAVE BUTTON === */
.save-section {
  grid-column: span 3;
  margin-top: 1rem;
}

.btn-save {
  width: 100%;
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .btn-save {
  background: #7c3aed;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.dark-mode .btn-save:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .instructor-profile {
    margin-left: 0;
    padding-bottom: 80px;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .card-span-2,
  .card-span-full {
    grid-column: span 1;
  }

  .input-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .profile-header-body {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem !important;
  }

  .card-body {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
