<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div :class="['student-profile', { 'dark-mode': isDarkMode }]">
    <StudentNavBar />
    
    <NotificationModal 
      v-model:visible="notification.visible"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
    />
    
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
            <p class="page-subtitle">Gerencie suas informações e acompanhe seu progresso</p>
          </div>
        </div>

        <!-- Banner de alerta -->
        <div v-if="isProfileIncomplete" class="alert-banner">
          <i class="fas fa-exclamation-circle"></i>
          <div class="alert-content">
            <strong>Complete seu perfil</strong>
            <p>Adicione suas informações físicas para uma experiência personalizada</p>
          </div>
        </div>

        <form @submit.prevent="saveProfile" id="profile-form" class="profile-grid">
          
          <!-- Card de Perfil Principal -->
          <div class="card card-profile-main">
            <div class="card-body profile-header-body">
              <div class="avatar-wrapper">
                <img :src="studentData.avatar" :alt="studentData.name" class="avatar" />
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
                <h2>{{ studentData.name || 'Usuário' }}</h2>
                <p class="profile-email">{{ studentData.email }}</p>
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
                    <input v-model="studentData.name" type="text" required placeholder="Digite seu nome">
                  </div>
                </div>
                <div class="input-group">
                  <label>Email *</label>
                  <div class="input-with-icon">
                    <i class="fas fa-envelope"></i>
                    <input v-model="studentData.email" type="email" required placeholder="seu@email.com">
                  </div>
                </div>
                <div class="input-group">
                  <label>Telefone</label>
                  <div class="input-with-icon">
                    <i class="fas fa-phone"></i>
                    <input v-model="studentData.phone" type="tel" placeholder="(00) 00000-0000">
                  </div>
                </div>
                <div class="input-group">
                  <label>Data de Nascimento</label>
                  <div class="input-with-icon">
                    <i class="fas fa-calendar"></i>
                    <input v-model="studentData.birthDate" type="date">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Dados Físicos -->
          <div class="card">
            <div class="card-header">
              <i class="fas fa-weight"></i>
              <h3>Dados Físicos</h3>
            </div>
            <div class="card-body">
              <div class="stats-display">
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-ruler-vertical"></i>
                  </div>
                  <div class="stat-details">
                    <label>Altura (cm)</label>
                    <input v-model="studentData.height" type="number" class="stat-input" placeholder="0">
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-weight-scale"></i>
                  </div>
                  <div class="stat-details">
                    <label>Peso (kg)</label>
                    <input v-model="studentData.weight" type="number" step="0.1" class="stat-input" placeholder="0.0">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Objetivos -->
          <div class="card">
            <div class="card-header">
              <i class="fas fa-bullseye"></i>
              <h3>Seus Objetivos</h3>
            </div>
            <div class="card-body">
              <div class="input-group">
                <label>Objetivo Principal</label>
                <div class="select-wrapper">
                  <select v-model="studentData.goal">
                    <option value="">Selecione seu objetivo</option>
                    <option value="hipertrofia">Ganhar Massa Muscular (Hipertrofia)</option>
                    <option value="emagrecimento">Perder Peso / Emagrecer</option>
                    <option value="condicionamento">Melhorar Condicionamento Físico</option>
                    <option value="forca">Aumentar Força</option>
                    <option value="saude">Saúde e Bem-Estar</option>
                    <option value="performance">Performance Esportiva</option>
                  </select>
                </div>
              </div>
              <div class="input-group">
                <label>Experiência em Treino</label>
                <div class="select-wrapper">
                  <select v-model="studentData.activityLevel">
                    <option value="">Selecione sua experiência</option>
                    <option value="iniciante">Iniciante (Menos de 6 meses)</option>
                    <option value="intermediario">Intermediário (6 meses a 2 anos)</option>
                    <option value="avancado">Avançado (Mais de 2 anos)</option>
                    <option value="atleta">Atleta / Competidor</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Saúde -->
          <div class="card card-span-2">
            <div class="card-header">
              <i class="fas fa-heartbeat"></i>
              <h3>Informações de Saúde</h3>
            </div>
            <div class="card-body">
              <div class="health-info-grid">
                <div class="input-group">
                  <label>Condições Médicas</label>
                  <textarea v-model="studentData.medicalConditions" rows="3" 
                    placeholder="Descreva condições médicas relevantes para o treino..."></textarea>
                </div>
                <div class="input-group">
                  <label>Medicamentos em Uso</label>
                  <textarea v-model="studentData.medications" rows="3"
                    placeholder="Liste os medicamentos que você toma regularmente..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Metas Pessoais -->
          <div class="card card-span-full">
            <div class="card-header">
              <div class="card-header-left">
                <i class="fas fa-trophy"></i>
                <h3>Minhas Metas Pessoais</h3>
              </div>
              <button type="button" @click="addGoal" class="btn-icon-add">
                <i class="fas fa-plus"></i>
                Nova Meta
              </button>
            </div>
            <div class="card-body">
              <div v-if="goals.length === 0" class="empty-state">
                <div class="empty-icon">🎯</div>
                <h4>Nenhuma meta definida</h4>
                <p>Adicione metas para acompanhar seu progresso e manter-se motivado</p>
              </div>

              <div v-else class="goals-list">
                <div v-for="(goal, index) in goals" :key="index" class="goal-item">
                  <div class="goal-number-badge">
                    Meta {{ index + 1 }}
                  </div>
                  
                  <div class="goal-content">
                    <div class="goal-main-info">
                      <div class="input-group">
                        <label>Descrição da Meta *</label>
                        <textarea 
                          v-model="goal.description" 
                          rows="2"
                          placeholder="Ex: Ter shape em V, Conseguir fazer 10 flexões, Melhorar postura..."
                        ></textarea>
                      </div>
                    </div>
                    
                    <div class="goal-metadata">
                      <div class="input-group">
                        <label>Categoria</label>
                        <select v-model="goal.category">
                          <option value="">Selecione...</option>
                          <option value="estetica">Estética</option>
                          <option value="saude">Saúde</option>
                          <option value="desempenho">Desempenho</option>
                          <option value="habito">Hábito</option>
                          <option value="geral">Geral</option>
                        </select>
                      </div>
                      
                      <div class="input-group">
                        <label>Prioridade</label>
                        <select v-model="goal.priority">
                          <option value="">Selecione...</option>
                          <option value="alta">Alta</option>
                          <option value="media">Média</option>
                          <option value="baixa">Baixa</option>
                        </select>
                      </div>
                      
                      <div class="input-group">
                        <label>Status</label>
                        <select v-model="goal.status">
                          <option value="active">Ativa</option>
                          <option value="completed">Concluída</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button type="button" @click="removeGoal(index)" class="btn-remove-goal">
                    <i class="fas fa-trash-alt"></i>
                    Remover
                  </button>
                </div>
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import StudentNavBar from '@/components/StudentNavBar.vue';
import NotificationModal from '@/components/NotificationModal.vue';
import api from '@/api';

const themeStore = useThemeStore();
const { isDarkMode } = storeToRefs(themeStore);

// Notification system
const notification = ref({
  visible: false,
  type: 'info',
  title: '',
  message: ''
});

const showNotification = (type, title, message) => {
  notification.value = {
    visible: true,
    type,
    title,
    message
  };
};

const loading = ref(false);
const saving = ref(false);
const studentId = ref(null);

// Goals state
const goals = ref([]);

// Function to add a new goal to the form
const addGoal = () => {
  goals.value.push({
    description: '',
    category: '',
    priority: '',
    status: 'active'
  });
};

// Function to remove a goal from the form
const removeGoal = (index) => {
  goals.value.splice(index, 1);
};

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
    
    // Buscar dados do User primeiro (tem name, email, phone, birthDate, cpf)
    const userId = userData.id || userData._id;
    
    if (!userId) {
      console.error('Nenhum ID encontrado no userData');
      useFallbackData();
      loading.value = false;
      return;
    }

    // Buscar Student pelo userId usando a rota correta
    const studentResponse = await api.get(`/students/user/${userId}`);
    const studentData_API = studentResponse.data;
    
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
    
    // Extrair goal da estrutura correta
    const goalType = studentData_API.personalInfo?.preferences?.trainingGoalType || 
                     studentData_API.goals?.primary?.type || 
                     '';
    
    // Extrair experiência de treino
    const trainingExp = studentData_API.personalInfo?.trainingExperience || 'intermediario';
    
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
      goal: goalType || '',
      
      // Nível de atividade do personalInfo (trainingExperience)
      activityLevel: trainingExp || 'intermediario',
      
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



const saveProfile = async () => {
  if (!studentId.value) {
    showNotification('error', 'Erro!', 'ID do aluno não encontrado');
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
      
      await api.put(`/auth/user/${userId}`, userUpdateData);
      
      // Atualizar sessionStorage com novos dados
      const updatedUser = { ...userData, ...userUpdateData };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    // Atualizar dados do Student (personalInfo, healthRestrictions, goals)
    // Usa a estrutura correta do modelo Student
    const studentUpdateData = {
      personalInfo: {
        currentHeight: studentData.height ? Number(studentData.height) : null,
        currentWeight: studentData.weight ? Number(studentData.weight) : null,
        trainingExperience: studentData.activityLevel || 'intermediario',
        preferences: {
          trainingGoalType: studentData.goal || ''
        }
      },
      healthRestrictions: {
        generalNotes: studentData.medicalConditions || '',
        medications: studentData.medications 
          ? studentData.medications.split(',').map(m => ({ name: m.trim() })).filter(m => m.name) 
          : []
      },
      goals: {
        primary: {
          type: studentData.goal || '',
          description: studentData.goal || ''
        },
        weight: {
          initial: studentData.weight ? Number(studentData.weight) : null,
          target: studentData.weight ? Number(studentData.weight) : null
        },
        personal: goals.value
          .filter(g => g.description && g.category && g.priority)
          .map(g => ({
            description: g.description,
            category: g.category,
            priority: g.priority,
            achieved: g.status === 'completed'
          }))
      }
    };

    const { data } = await api.put(`/students/${studentId.value}`, studentUpdateData);
    console.log('Student atualizado:', data);
    
    // Atualizar dados originais
    originalData.value = { ...studentData };
    
    showNotification('success', 'Sucesso!', 'Perfil atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    console.error('Detalhes do erro:', error.response?.data);
    showNotification('error', 'Erro ao Salvar', `Erro ao salvar perfil: ${error.response?.data?.message || 'Tente novamente.'}`);
  } finally {
    saving.value = false;
  }
};

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    showNotification('error', 'Arquivo Inválido', 'Por favor, selecione uma imagem válida.');
    return;
  }

  // Validar tamanho (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showNotification('error', 'Arquivo Muito Grande', 'A imagem deve ter no máximo 5MB.');
    return;
  }

  try {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      showNotification('error', 'Erro!', 'Usuário não encontrado.');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    const userId = userData.id || userData._id;
    
    // Criar FormData para upload
    const formData = new FormData();
    formData.append('avatar', file);

    // Upload da imagem
    const response = await api.post(`/auth/user/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Atualizar avatar localmente
    if (response.data.avatarUrl) {
      studentData.avatar = response.data.avatarUrl;
      userData.avatar = response.data.avatarUrl;
      sessionStorage.setItem('user', JSON.stringify(userData));
      showNotification('success', 'Sucesso!', 'Foto de perfil atualizada com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    showNotification('error', 'Erro ao Atualizar Foto', `Erro ao atualizar foto: ${error.response?.data?.message || 'Tente novamente.'}`);
  }
};

onMounted(() => {
  fetchProfile();
  fetchGoals();
});

// Goals functions
const fetchGoals = async () => {
  try {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return;
    
    const userData = JSON.parse(storedUser);
    const userId = userData.id || userData._id;
    
    const studentResponse = await api.get(`/students/user/${userId}`);
    const studentData_API = studentResponse.data;
    
    // Buscar metas de goals.personal (estrutura do banco)
    const personalGoals = studentData_API.goals?.personal || [];
    
    goals.value = personalGoals.map(goal => ({
      id: goal._id,
      description: goal.description || '',
      category: goal.category || 'geral',
      priority: goal.priority || 'media',
      status: goal.achieved ? 'completed' : 'active'
    }));
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    goals.value = [];
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

/* === LAYOUT PRINCIPAL === */
.student-profile {
  margin-left: 280px;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  background: var(--bg-secondary);
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-mode.student-profile {
  background: var(--bg-secondary);
}

body:has(.navbar-collapsed) .student-profile {
  margin-left: 0 !important;
}

.main-content {
  padding: 0;
}

.profile-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
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

/* === ALERT BANNER === */
.alert-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #3b82f6;
  border-radius: 12px;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  animation: slideDown 0.5s ease;
}

.dark-mode .alert-banner {
  background: #7c3aed;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-banner i {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.alert-content strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  font-weight: 700;
}

.alert-content p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.95;
}

/* === LOADING STATE === */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  color: var(--text-muted);
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1rem;
  margin: 0;
}

/* === GRID DE CARDS === */
.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
  border-color: #3b82f6;
}

.dark-mode .card:hover {
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  border-color: #7c3aed;
}

.card-span-2 {
  grid-column: span 2;
}

.card-span-full {
  grid-column: 1 / -1;
}

/* === CARD HEADER === */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.card-header i {
  font-size: 1.25rem;
  color: #3b82f6;
}

.dark-mode .card-header i {
  color: #7c3aed;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.card-body {
  padding: 1.5rem;
}

/* === CARD DE PERFIL PRINCIPAL === */
.card-profile-main {
  grid-column: span 2;
}

.profile-header-body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem !important;
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
  border: 4px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.dark-mode .avatar {
  border-color: #7c3aed;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.avatar-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 36px;
  height: 36px;
  background: #3b82f6;
  color: white;
  border: 3px solid var(--card-bg);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.dark-mode .avatar-badge {
  background: #7c3aed;
}

.avatar-badge:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  margin: 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* === INPUTS === */
.input-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.health-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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

.input-with-icon input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-with-icon input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .input-with-icon input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.input-group textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.95rem;
  resize: vertical;
  font-family: "Inter", sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .input-group textarea:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.95rem;
  cursor: pointer;
  appearance: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.select-wrapper select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .select-wrapper select:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.select-wrapper::after {
  content: '\f107';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-muted);
}

/* === STATS DISPLAY === */
.stats-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 2px solid var(--border-color);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.dark-mode .stat-icon {
  background: #7c3aed;
}

.stat-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-details label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0;
}

.stat-input {
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0;
  width: 100%;
}

.stat-input:focus {
  outline: none;
}

@media (max-width: 480px) {
  .avatar {
    width: 80px;
    height: 80px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.875rem;
  }

  .goal-item {
    padding: 1rem;
  }
}

/* === BOTÕES === */
.btn-icon-add {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
  white-space: nowrap;
}

.dark-mode .btn-icon-add {
  background: #7c3aed;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
}

.btn-icon-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
}

.dark-mode .btn-icon-add:hover {
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
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
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

.save-section {
  grid-column: 1 / -1;
  margin-top: 1rem;
}

/* === EMPTY STATE === */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-state h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
}

.empty-state p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* === GOALS LIST === */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.goal-item {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.goal-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.dark-mode .goal-item:hover {
  border-color: #7c3aed;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
}

.goal-number-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: #3b82f6;
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.dark-mode .goal-number-badge {
  background: #7c3aed;
}

.goal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-main-info {
  width: 100%;
}

.goal-main-info .input-group {
  margin-bottom: 0;
}

.goal-main-info textarea {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.95rem;
  font-family: "Inter", sans-serif;
  resize: vertical;
  transition: all 0.3s ease;
}

.goal-main-info textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .goal-main-info textarea:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.goal-metadata {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.goal-metadata .input-group {
  margin-bottom: 0;
}

.goal-metadata select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  transition: all 0.3s ease;
}

.goal-metadata select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .goal-metadata select:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.btn-remove-goal {
  margin-top: 1rem;
  padding: 0.625rem 1rem;
  background: transparent;
  border: 2px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.btn-remove-goal:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
  transform: translateX(4px);
}

/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .card-span-2 {
    grid-column: span 1;
  }

  .input-grid {
    grid-template-columns: 1fr;
  }

  .health-info-grid {
    grid-template-columns: 1fr;
  }

  .goals-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .student-profile {
    margin-left: 0;
    padding: 0;
  }

  .profile-content {
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

  .card-header {
    padding: 1rem;
  }

  .alert-banner {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
  }

  .goal-metadata {
    grid-template-columns: 1fr;
  }
}
</style>

