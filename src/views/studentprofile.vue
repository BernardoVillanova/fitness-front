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
          <div class="card-profile-main">
            <div class="profile-header">
              <div class="header-content">
                <div class="avatar-wrapper">
                  <div class="avatar">
                    <img :src="studentData.avatar" :alt="studentData.name" />
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
                    <h1>{{ studentData.name || 'Usuário' }}</h1>
                    <span class="badge">Aluno</span>
                  </div>
                  <p class="email">{{ studentData.email }}</p>
                  <p class="subtitle">Gerencie suas informações e acompanhe seu progresso</p>
                </div>
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
                    <IconRuler :size="20" :stroke-width="2.5" />
                  </div>
                  <div class="stat-details">
                    <label>Altura (cm)</label>
                    <input v-model="studentData.height" type="number" class="stat-input" placeholder="0">
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">
                    <IconWeight :size="20" :stroke-width="2.5" />
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

              <div v-else class="goals-carousel-container">
                <button 
                  type="button" 
                  @click="previousGoal" 
                  class="carousel-btn carousel-btn-prev"
                  :disabled="currentGoalIndex === 0"
                  v-if="goals.length > 1"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>

                <div class="goals-list">
                  <div class="goal-item" v-show="index === currentGoalIndex" v-for="(goal, index) in goals" :key="index" :class="{ 'slide-in': index === currentGoalIndex }">
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

                    <button type="button" @click="removeGoal(index)" class="action-button secondary-action btn-remove-goal">
                      <div class="button-shine"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      <span class="button-text">Remover</span>
                    </button>
                  </div>
                </div>

                <button 
                  type="button" 
                  @click="nextGoal" 
                  class="carousel-btn carousel-btn-next"
                  :disabled="currentGoalIndex === goals.length - 1"
                  v-if="goals.length > 1"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Botão Salvar -->
          <div class="save-section">
            <button type="submit" class="btn-save" :disabled="saving">
              <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-check-circle'"></i>
              {{ saving ? 'Salvando alterações...' : 'Salvar Alterações' }}
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
const currentGoalIndex = ref(0);

// Function to add a new goal to the form
const addGoal = () => {
  goals.value.push({
    description: '',
    category: '',
    priority: '',
    status: 'active'
  });
  // Navegar para a nova meta adicionada
  currentGoalIndex.value = goals.value.length - 1;
};

// Function to remove a goal from the form
const removeGoal = (index) => {
  goals.value.splice(index, 1);
  // Ajustar o índice atual se necessário
  if (currentGoalIndex.value >= goals.value.length && currentGoalIndex.value > 0) {
    currentGoalIndex.value = goals.value.length - 1;
  }
};

// Carousel navigation functions
const nextGoal = () => {
  if (currentGoalIndex.value < goals.value.length - 1) {
    currentGoalIndex.value++;
  }
};

const previousGoal = () => {
  if (currentGoalIndex.value > 0) {
    currentGoalIndex.value--;
  }
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
      
      // Avatar - construir URL completa do backend
      avatar: (() => {
        const avatarPath = studentData_API.userId?.avatar || userData.avatar;
        if (avatarPath && avatarPath.startsWith('/uploads/')) {
          // Se o avatar está salvo como caminho relativo, adicionar a URL do backend
          return `http://localhost:3000${avatarPath}`;
        } else if (avatarPath && (avatarPath.startsWith('http://') || avatarPath.startsWith('https://'))) {
          // Se já é uma URL completa, usar diretamente
          return avatarPath;
        } else {
          // Fallback para avatar gerado
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=2563eb&color=fff&size=120`;
        }
      })()
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
      avatar: (() => {
        const avatarPath = userData.avatar;
        if (avatarPath && avatarPath.startsWith('/uploads/')) {
          return `http://localhost:3000${avatarPath}`;
        } else if (avatarPath && (avatarPath.startsWith('http://') || avatarPath.startsWith('https://'))) {
          return avatarPath;
        } else {
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=2563eb&color=fff&size=120`;
        }
      })()
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
      // Construir URL completa do avatar
      const avatarUrl = response.data.avatarUrl.startsWith('/uploads/') 
        ? `http://localhost:3000${response.data.avatarUrl}`
        : response.data.avatarUrl;
      
      studentData.avatar = avatarUrl;
      userData.avatar = response.data.avatarUrl; // Salvar caminho relativo no sessionStorage
      sessionStorage.setItem('user', JSON.stringify(userData));
      
      // Forçar atualização da página para refletir mudanças na NavBar
      window.location.reload();
      
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
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
}

.dark-mode.student-profile {
  background: var(--bg-secondary);
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
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
  line-height: 1.5;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.card-header-left h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Alinhamento específico para o card de metas */
.card-span-full .card-header {
  align-items: flex-start;
}

.card-span-full .card-header .btn-icon-add {
  margin-top: 0;
}

.card-body {
  padding: 1.5rem;
}

/* === CARD DE PERFIL PRINCIPAL === */
.card-profile-main {
  grid-column: span 2;
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
  flex-shrink: 0;
  width: 112px;
  height: 112px;
}

.avatar {
  position: relative;
  width: 112px !important;
  height: 112px !important;
  min-width: 112px;
  min-height: 112px;
  max-width: 112px;
  max-height: 112px;
  border-radius: 50%;
  border: 4px solid var(--bg-primary);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: #f3f4f6;
}

.dark-mode .avatar {
  background: #374151;
}

.avatar img {
  width: 112px !important;
  height: 112px !important;
  object-fit: cover;
  object-position: center center;
  display: block;
  border-radius: 50%;
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

.dark-mode .avatar-button:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
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

/* === INPUTS === */
.input-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.health-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 2rem;
  row-gap: 1.5rem;
}

.health-info-grid .input-group {
  min-width: 0;
  max-width: 100%;
}

.health-info-grid textarea {
  box-sizing: border-box;
  max-width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-body > .input-group + .input-group {
  margin-top: 1.25rem;
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
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.dark-mode .stat-icon {
  background: rgba(124, 58, 237, 0.15);
  color: #7c3aed;
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
  padding: 0.625rem 1.125rem;
  background: #3b82f6;
  color: white !important;
  border: none;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
  white-space: nowrap;
  flex-shrink: 0;
  width: auto;
  margin-left: auto;
  line-height: 1;
}

.btn-icon-add i {
  color: white !important;
  font-size: 0.775rem !important;
  font-style: normal !important;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  line-height: 1 !important;
}

.btn-icon-add i::before {
  display: inline-block !important;
  vertical-align: middle;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  width: auto;
  max-width: none;
  min-height: 56px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  font-family: inherit;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
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
}

.dark-mode .btn-save {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.dark-mode .btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

.save-section {
  grid-column: 1 / -1;
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
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
.goals-carousel-container {
  position: relative;
  width: 100%;
}

.goals-list {
  width: 100%;
  min-height: 450px;
  position: relative;
}

.goal-item {
  background: linear-gradient(135deg, var(--card-bg) 0%, var(--bg-secondary) 100%);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.dark-mode .goal-item {
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(124, 58, 237, 0.05) 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* === CAROUSEL BUTTONS === */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: var(--card-bg);
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark-mode .carousel-btn {
  color: #7c3aed;
}

.carousel-btn:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .carousel-btn:hover:not(:disabled) {
  background: #7c3aed;
  border-color: #7c3aed;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background: var(--bg-secondary);
}

.carousel-btn-prev {
  left: -24px;
}

.carousel-btn-next {
  right: -24px;
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
  align-self: flex-start;
  width: auto;
}

.dark-mode .goal-number-badge {
  background: #7c3aed;
}

.goal-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

.goal-main-info {
  width: 100%;
}

.goal-main-info .input-group {
  margin-bottom: 0;
}

.goal-main-info textarea {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 1rem 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 1rem;
  font-family: "Inter", sans-serif;
  resize: vertical;
  line-height: 1.6;
  transition: all 0.3s ease;
  min-height: 80px;
}

.goal-main-info textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background: var(--card-bg);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 2px 8px rgba(59, 130, 246, 0.08);
  transform: translateY(-2px);
}

.dark-mode .goal-main-info textarea:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.15), 0 2px 8px rgba(124, 58, 237, 0.12);
}

.goal-metadata {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  padding-top: 1rem;
  border-top: 2px dashed var(--border-color);
}

.goal-metadata .input-group {
  margin-bottom: 0;
}

.goal-metadata select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  appearance: none;
  transition: all 0.3s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233b82f6' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.goal-metadata select:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: var(--card-bg);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 2px 8px rgba(59, 130, 246, 0.08);
  transform: translateY(-2px);
}

.dark-mode .goal-metadata select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237c3aed' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
}

.dark-mode .goal-metadata select:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.15), 0 2px 8px rgba(124, 58, 237, 0.12);
}

/* Action Button Base */
.action-button {
  position: relative;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
  letter-spacing: 0.01em;
  width: auto;
}

.action-button svg {
  width: 18px;
  height: 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.button-text {
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-family: "Inter", sans-serif;
}

.button-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.action-button:hover .button-shine {
  transform: translateX(100%);
}

/* Secondary Action - Glass Morphism for Delete Button */
.btn-remove-goal {
  margin-top: 1.5rem;
  align-self: flex-end;
  background: transparent;
  border: 1.5px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  box-shadow: 
    0 2px 10px rgba(239, 68, 68, 0.08),
    inset 0 1px 0 rgba(239, 68, 68, 0.1);
}

.dark-mode .btn-remove-goal {
  border-color: rgba(239, 68, 68, 0.4);
  color: #f87171;
}

.btn-remove-goal:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  box-shadow: 
    0 8px 25px rgba(239, 68, 68, 0.2),
    0 4px 15px rgba(239, 68, 68, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.dark-mode .btn-remove-goal:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  box-shadow: 
    0 8px 25px rgba(239, 68, 68, 0.3),
    0 4px 15px rgba(239, 68, 68, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-remove-goal:hover svg {
  transform: scale(1.15);
}

.btn-remove-goal:active {
  transform: translateY(-1px) scale(1.01);
}

.btn-remove-goal:hover .button-shine {
  transform: translateX(100%);
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

  .header-content {
    text-align: center;
    padding: 1.5rem;
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

  .carousel-btn {
    position: static;
    width: 100%;
    border-radius: 12px;
    height: 44px;
    transform: none;
    margin: 0;
  }

  .carousel-btn:hover:not(:disabled) {
    transform: none;
  }

  .carousel-btn-prev {
    margin-bottom: 1rem;
  }

  .carousel-btn-next {
    margin-top: 1rem;
  }

  .goals-carousel-container {
    display: flex;
    flex-direction: column;
  }
}
</style>

