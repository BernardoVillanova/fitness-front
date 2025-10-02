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
      <!-- Info Banner se perfil incompleto -->
      <div v-if="isProfileIncomplete" class="info-banner">
        <i class="fas fa-info-circle"></i>
        <div>
          <strong>Complete seu perfil!</strong>
          <p>Preencha suas informações físicas e médicas para uma experiência personalizada.</p>
        </div>
      </div>

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
import { ref, reactive, onMounted, computed } from 'vue';
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

// Computed para verificar se perfil está incompleto
const isProfileIncomplete = computed(() => {
  return !studentData.height || !studentData.weight;
});

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
    
    // Buscar dados do User primeiro (tem name, email, phone, birthDate, cpf)
    const userId = userData.id || userData._id;
    
    if (!userId) {
      console.error('Nenhum ID encontrado no userData');
      useFallbackData();
      loading.value = false;
      return;
    }

    console.log('Buscando dados do usuário com ID:', userId);
    
    // Buscar Student pelo userId usando a rota correta
    const studentResponse = await api.get(`/students/user/${userId}`);
    const studentData_API = studentResponse.data;
    
    console.log('Dados do Student recebidos:', studentData_API);
    
    if (!studentData_API) {
      console.error('Student não encontrado para este userId');
      useFallbackData();
      loading.value = false;
      return;
    }
    
    studentId.value = studentData_API._id;
    
    // Buscar também os dados atualizados do User via userId do Student
    let userName = userData.name || '';
    let userEmail = userData.email || '';
    let userPhone = userData.phone || '';
    let userBirthDate = userData.birthDate || '';
    
    // Se o Student tem userId populado com dados do User, usar esses dados
    if (studentData_API.userId && typeof studentData_API.userId === 'object') {
      userName = studentData_API.userId.name || userName;
      userEmail = studentData_API.userId.email || userEmail;
      userPhone = studentData_API.userId.phone || userPhone;
      userBirthDate = studentData_API.userId.birthDate || userBirthDate;
    }
    
    // Extrair dados físicos (suporta estrutura antiga e nova)
    const height = studentData_API.personalInfo?.currentHeight || 
                   studentData_API.personalInfo?.height || 
                   '';
    const weight = studentData_API.personalInfo?.currentWeight || 
                   studentData_API.personalInfo?.weight || 
                   '';
    
    // Extrair goal (suporta estrutura antiga e nova)
    const goalType = studentData_API.goals?.primary?.type || 
                     studentData_API.goals?.[0]?.type || 
                     studentData_API.goals?.[0]?.description || 
                     '';
    
    // Extrair condições médicas
    const medicalNotes = studentData_API.healthRestrictions?.generalNotes ||
                         studentData_API.healthRestrictions?.notes || 
                         '';
    const chronicConditions = studentData_API.healthRestrictions?.chronicConditions || [];
    
    // Extrair medicamentos
    const meds = studentData_API.healthRestrictions?.medications || [];
    
    // Preencher com dados do User e Student
    // Suporta estrutura antiga e nova do banco
    Object.assign(studentData, {
      // Dados do User
      name: userName,
      email: userEmail,
      phone: userPhone,
      birthDate: userBirthDate ? new Date(userBirthDate).toISOString().split('T')[0] : '',
      
      // Dados físicos do Student (personalInfo)
      height: height || '',
      weight: weight || '',
      
      // Objetivo dos goals do Student
      goal: mapGoalFromAPI(goalType) || 'maintain',
      
      // Nível de atividade do personalInfo (mapear de trainingExperience)
      activityLevel: mapActivityLevelFromAPI(studentData_API.personalInfo?.trainingExperience),
      
      // Restrições de saúde
      medicalConditions: medicalNotes || 
                         (chronicConditions.length > 0 
                           ? chronicConditions.map(c => c.name || c).join(', ') 
                           : ''),
      medications: meds.length > 0
                   ? meds.map(m => {
                       if (typeof m === 'string') return m;
                       return m.name || '';
                     }).filter(m => m).join(', ')
                   : '',
      
      // Avatar
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=667eea&color=fff&size=120`
    });

    originalData.value = { ...studentData };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    console.error('Detalhes do erro:', error.response?.data);
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
  if (goal.includes('perder') || goal.includes('peso') || goal.includes('emagrecimento')) return 'lose-weight';
  if (goal.includes('ganhar') || goal.includes('massa') || goal.includes('hipertrofia')) return 'gain-muscle';
  if (goal.includes('força') || goal.includes('forca')) return 'strength';
  if (goal.includes('condicionamento')) return 'maintain';
  return 'maintain';
};

const mapActivityLevelFromAPI = (trainingExperience) => {
  if (!trainingExperience) return 'moderate';
  const level = trainingExperience.toLowerCase();
  if (level === 'iniciante') return 'light';
  if (level === 'intermediario' || level === 'intermediário') return 'moderate';
  if (level === 'avancado' || level === 'avançado' || level === 'atleta') return 'active';
  return 'moderate';
};

const mapGoalToDescription = (goalType) => {
  const goalMap = {
    'lose-weight': 'Perder peso / Emagrecer',
    'gain-muscle': 'Ganhar massa muscular (Hipertrofia)',
    'maintain': 'Manter forma física / Condicionamento',
    'strength': 'Aumentar força'
  };
  return goalMap[goalType] || 'Manter forma física';
};

const mapActivityLevelToAPI = (activityLevel) => {
  const levelMap = {
    'sedentary': 'iniciante',
    'light': 'iniciante',
    'moderate': 'intermediario',
    'active': 'avancado'
  };
  return levelMap[activityLevel] || 'intermediario';
};

const saveProfile = async () => {
  if (!studentId.value) {
    alert('Erro: ID do aluno não encontrado');
    return;
  }

  saving.value = true;
  try {
    const storedUser = sessionStorage.getItem('user');
    const userData = JSON.parse(storedUser);
    const userId = userData.id || userData._id;
    
    // Atualizar dados do User (name, email, phone, birthDate)
    if (userId) {
      const userUpdateData = {
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        birthDate: studentData.birthDate
      };
      
      console.log('Atualizando User com:', userUpdateData);
      await api.put(`/auth/user/${userId}`, userUpdateData);
      
      // Atualizar sessionStorage com novos dados
      const updatedUser = { ...userData, ...userUpdateData };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    // Atualizar dados do Student (personalInfo, healthRestrictions, goals)
    // Usa a estrutura nova do modelo Student
    const studentUpdateData = {
      personalInfo: {
        currentHeight: studentData.height ? Number(studentData.height) : null,
        currentWeight: studentData.weight ? Number(studentData.weight) : null,
        trainingExperience: mapActivityLevelToAPI(studentData.activityLevel)
      },
      healthRestrictions: {
        generalNotes: studentData.medicalConditions || '',
        medications: studentData.medications 
          ? studentData.medications.split(',').map(m => ({ name: m.trim() })).filter(m => m.name) 
          : []
      },
      goals: {
        primary: {
          type: studentData.goal,
          description: mapGoalToDescription(studentData.goal)
        },
        weight: {
          initial: studentData.weight ? Number(studentData.weight) : null,
          target: studentData.weight ? Number(studentData.weight) : null // Pode ajustar depois
        }
      }
    };

    console.log('Atualizando Student com:', studentUpdateData);
    const response = await api.put(`/students/${studentId.value}`, studentUpdateData);
    console.log('Student atualizado:', response.data);
    
    // Atualizar dados originais
    originalData.value = { ...studentData };
    
    alert('✅ Perfil atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    console.error('Detalhes do erro:', error.response?.data);
    alert(`❌ Erro ao salvar perfil: ${error.response?.data?.message || 'Tente novamente.'}`);
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

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.info-banner i {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.info-banner strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.info-banner p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.95;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
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
  background: var(--card-bg) !important;
  border-color: var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark-mode .profile-card * {
  background-color: transparent;
}

.dark-mode .profile-card .form-input,
.dark-mode .profile-card .form-textarea,
.dark-mode .profile-card .form-select {
  background: var(--bg-secondary) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
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
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: 600;
}

.dark-mode .form-section h3,
.dark-mode .form-group label,
.dark-mode .page-title,
.dark-mode .page-subtitle {
  color: var(--text-color);
}

.dark-mode .page-subtitle {
  color: var(--text-muted);
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
  color: var(--text-color);
  font-size: 0.875rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.dark-mode .form-input,
.dark-mode .form-textarea,
.dark-mode .form-select {
  background: var(--bg-secondary) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;
}

.dark-mode .form-input::placeholder,
.dark-mode .form-textarea::placeholder {
  color: var(--text-muted) !important;
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
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .form-input:focus,
.dark-mode .form-textarea:focus,
.dark-mode .form-select:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
}

.dark-mode .btn-secondary {
  color: var(--text-color);
  border-color: var(--border-color);
}

.dark-mode .btn-secondary:hover {
  background: var(--bg-secondary);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.loading-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.loading-state p {
  font-size: 1.1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .student-profile {
    padding: 1rem;
    margin-left: 0;
  }

  .form-card {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .page-title {
    font-size: 2rem;
  }

  .info-banner {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .avatar-image {
    width: 100px;
    height: 100px;
  }

  .page-title {
    font-size: 1.75rem;
  }
}
</style>