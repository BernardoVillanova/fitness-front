<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div :class="['student-profile', { 'dark-mode': isDarkMode }]">
    <StudentNavBar />
    
    <div class="main-content">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-user"></i>
          Meu Perfil
        </h1>
        <p class="page-subtitle">Gerencie suas informações pessoais</p>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando perfil...</p>
      </div>

      <div v-else class="profile-content">
      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar-container">
            <img :src="studentData.avatar" :alt="studentData.name" class="avatar-image" />
            <button class="avatar-edit-btn">
              <i class="fas fa-camera"></i>
            </button>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-section">
            <h3>Informações Pessoais</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Nome Completo</label>
                <input v-model="studentData.name" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="studentData.email" type="email" class="form-input" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Telefone</label>
                <input v-model="studentData.phone" type="tel" class="form-input">
              </div>
              <div class="form-group">
                <label>Data de Nascimento</label>
                <input v-model="studentData.birthDate" type="date" class="form-input">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Informações Físicas</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Altura (cm)</label>
                <input v-model="studentData.height" type="number" class="form-input">
              </div>
              <div class="form-group">
                <label>Peso Atual (kg)</label>
                <input v-model="studentData.weight" type="number" step="0.1" class="form-input">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Objetivo</label>
                <select v-model="studentData.goal" class="form-select">
                  <option value="lose-weight">Perder peso</option>
                  <option value="gain-muscle">Ganhar massa muscular</option>
                  <option value="maintain">Manter forma física</option>
                  <option value="strength">Aumentar força</option>
                </select>
              </div>
              <div class="form-group">
                <label>Nível de Atividade</label>
                <select v-model="studentData.activityLevel" class="form-select">
                  <option value="sedentary">Sedentário</option>
                  <option value="light">Levemente ativo</option>
                  <option value="moderate">Moderadamente ativo</option>
                  <option value="active">Muito ativo</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Informações Médicas</h3>
            <div class="form-group">
              <label>Condições Médicas</label>
              <textarea v-model="studentData.medicalConditions" class="form-textarea" 
                        placeholder="Descreva qualquer condição médica relevante..."></textarea>
            </div>
            <div class="form-group">
              <label>Medicamentos</label>
              <textarea v-model="studentData.medications" class="form-textarea"
                        placeholder="Liste medicamentos em uso..."></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="resetForm" class="btn-secondary">
              <i class="fas fa-undo"></i>
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-save'"></i>
              {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import StudentNavBar from '@/components/StudentNavBar.vue';
import api from '@/api';

const themeStore = useThemeStore();
const { isDarkMode } = storeToRefs(themeStore);

const loading = ref(false);
const saving = ref(false);
const studentId = ref(null);

const studentData = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  height: null,
  weight: null,
  goal: 'maintain',
  activityLevel: 'moderate',
  medicalConditions: '',
  medications: '',
  avatar: ''
});

const originalData = ref({});

const fetchProfile = async () => {
  loading.value = true;
  try {
    const storedUser = sessionStorage.getItem('user');
    
    if (!storedUser) {
      console.error('Nenhum usuario no sessionStorage');
      useFallbackData();
      loading.value = false;
      return;
    }

    const userData = JSON.parse(storedUser);
    console.log('UserData parseado:', userData);
    
    const studentIdToFetch = userData.studentId || userData.id;
    
    if (!studentIdToFetch) {
      console.error('Nenhum ID encontrado no userData');
      useFallbackData();
      loading.value = false;
      return;
    }

    console.log('Buscando perfil com ID:', studentIdToFetch);
    const response = await api.get(`/students/${studentIdToFetch}`);
    const data = response.data;
    console.log('Dados recebidos:', data);
    
    studentId.value = data._id || studentIdToFetch;
    
    Object.assign(studentData, {
      name: data.name || userData.name || '',
      email: data.email || userData.email || '',
      phone: data.phone || '',
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
      height: data.personalInfo?.height || data.height || null,
      weight: data.personalInfo?.weight || data.weight || null,
      goal: mapGoalFromAPI(data.goals?.[0]?.description) || 'maintain',
      activityLevel: data.personalInfo?.trainingExperience || 'moderate',
      medicalConditions: data.healthRestrictions?.notes || '',
      medications: data.healthRestrictions?.medications?.join(', ') || '',
      avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=667eea&color=fff&size=120`
    });

    originalData.value = { ...studentData };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    useFallbackData();
  } finally {
    loading.value = false;
  }
};

const useFallbackData = () => {
  const storedUser = sessionStorage.getItem('user');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    Object.assign(studentData, {
      name: userData.name || 'Usuário',
      email: userData.email || '',
      phone: '',
      birthDate: '',
      height: null,
      weight: null,
      goal: 'maintain',
      activityLevel: 'moderate',
      medicalConditions: '',
      medications: '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=667eea&color=fff&size=120`
    });
    originalData.value = { ...studentData };
  }
};

const mapGoalFromAPI = (goalDescription) => {
  if (!goalDescription) return 'maintain';
  const goal = goalDescription.toLowerCase();
  if (goal.includes('perder') || goal.includes('peso')) return 'lose-weight';
  if (goal.includes('ganhar') || goal.includes('massa')) return 'gain-muscle';
  if (goal.includes('força')) return 'strength';
  return 'maintain';
};

const saveProfile = async () => {
  if (!studentId.value) {
    alert('Erro: ID do aluno não encontrado');
    return;
  }

  saving.value = true;
  try {
    const updateData = {
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      birthDate: studentData.birthDate,
      personalInfo: {
        height: studentData.height,
        weight: studentData.weight,
        trainingExperience: studentData.activityLevel
      },
      healthRestrictions: {
        notes: studentData.medicalConditions,
        medications: studentData.medications ? studentData.medications.split(',').map(m => m.trim()) : []
      }
    };

    await api.put(`/students/${studentId.value}`, updateData);
    originalData.value = { ...studentData };
    alert('Perfil atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    alert('Erro ao salvar perfil. Tente novamente.');
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  Object.assign(studentData, originalData.value);
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.student-profile {
  margin-left: 280px;
  padding: 2rem;
  background: var(--bg-secondary);
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-mode.student-profile {
  background: #16213e;
}

/* Detecta quando o navbar está colapsado globalmente */
body:has(.navbar-collapsed) .student-profile {
  margin-left: 0 !important;
}

.profile-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title i {
  color: var(--primary-color);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

.profile-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2.5rem 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .profile-card {
  background: #2d2d3d !important;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark-mode .profile-card * {
  background-color: transparent;
}

.dark-mode .profile-card .form-input,
.dark-mode .profile-card .form-textarea,
.dark-mode .profile-card .form-select {
  background: #1a1a2e !important;
}

.avatar-section {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-color);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.avatar-edit-btn:hover {
  transform: scale(1.1);
}

.dark-mode .avatar-image {
  border-color: #667eea;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  background: transparent;
}

.form-section:last-of-type {
  border-bottom: none;
}

.dark-mode .form-section {
  border-bottom-color: rgba(255, 255, 255, 0.1);
  background: transparent;
}

.form-section h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.dark-mode .form-section h3,
.dark-mode .form-group label,
.dark-mode .page-title,
.dark-mode .page-subtitle {
  color: rgba(255, 255, 255, 0.9);
}

.dark-mode .page-subtitle {
  color: rgba(255, 255, 255, 0.6);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: transparent;
}

.form-group {
  margin-bottom: 1rem;
  background: transparent;
}

.dark-mode .form-row,
.dark-mode .form-group {
  background: transparent;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: white;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.dark-mode .form-input,
.dark-mode .form-textarea,
.dark-mode .form-select {
  background: #1a1a2e !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.dark-mode .form-input::placeholder,
.dark-mode .form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4) !important;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

.dark-mode .btn-secondary {
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

.dark-mode .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .student-profile {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}

:root {
  --primary-color: #6366f1;
  --primary-hover: #5856eb;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
</style>