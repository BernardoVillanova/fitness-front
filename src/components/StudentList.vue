<template>
  <NotificationModal 
    v-model:visible="notification.visible"
    :type="notification.type"
    :title="notification.title"
    :message="notification.message"
  />
  
  <ConfirmationModal 
    :show="confirmationModal.visible"
    :title="confirmationModal.title"
    :message="confirmationModal.message"
    icon-type="warning"
    confirm-text="Sim, Desvincular"
    cancel-text="Cancelar"
    @confirm="handleConfirmationConfirm"
    @cancel="handleConfirmationCancel"
  />
  <div :class="['students-page', { 'dark-mode': isDarkMode }]">
    <DashboardNavBar />

    <main class="main-content">
      <!-- Header com título e ações -->
      <header class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">
              <i class="fas fa-users"></i>
              Meus Alunos
            </h1>
            <p class="page-subtitle">Gerencie e acompanhe o progresso de todos os seus alunos</p>
          </div>
          <div class="header-actions">
            <button @click="openAddStudentModal" class="btn-primary">
              <i class="fas fa-user-plus"></i>
              <span>Novo Aluno</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Stats Cards -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card stat-total">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ totalStudents }}</h3>
              <p class="stat-label">Total de Alunos</p>
            </div>
          </div>

          <div class="stat-card stat-active">
            <div class="stat-icon">
              <i class="fas fa-user-check"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ activeStudents }}</h3>
              <p class="stat-label">Ativos</p>
              <div class="stat-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (activeStudents / (totalStudents || 1) * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card stat-plans">
            <div class="stat-icon">
              <i class="fas fa-clipboard-check"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ studentsWithPlans }}</h3>
              <p class="stat-label">Com Plano de Treino</p>
              <div class="stat-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (studentsWithPlans / (totalStudents || 1) * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card stat-paused">
            <div class="stat-icon">
              <i class="fas fa-pause-circle"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-value">{{ pausedStudents }}</h3>
              <p class="stat-label">Pausados</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Filters and View Toggle -->
      <section class="controls-section">
        <div class="controls-container">
          <!-- Search -->
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              v-model="search"
              type="text" 
              class="search-input" 
              placeholder="Buscar aluno por nome, email..."
            />
          </div>

          <!-- Filters -->
          <div class="filters-group">
            <select v-model="statusFilter" class="filter-select">
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="paused">Pausados</option>
              <option value="inactive">Inativos</option>
            </select>

            <select v-model="planFilter" class="filter-select">
              <option value="all">Todos os planos</option>
              <option value="with-plan">Com plano</option>
              <option value="without-plan">Sem plano</option>
            </select>

            <select v-model="experienceFilter" class="filter-select">
              <option value="all">Todas experiências</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
              <option value="atleta">Atleta</option>
            </select>
          </div>

          <!-- View Toggle -->
          <div class="view-toggle">
            <button 
              @click="viewMode = 'grid'" 
              :class="['toggle-btn', { active: viewMode === 'grid' }]"
              title="Visualização em grade"
            >
              <i class="fas fa-th"></i>
            </button>
            <button 
              @click="viewMode = 'list'" 
              :class="['toggle-btn', { active: viewMode === 'list' }]"
              title="Visualização em lista"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Carregando alunos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredStudents.length === 0" class="empty-state">
        <div class="empty-icon">
          <i :class="hasFiltersActive ? 'fas fa-filter' : 'fas fa-users-slash'"></i>
        </div>
        <h3>{{ getEmptyStateTitle }}</h3>
        <p>{{ getEmptyStateMessage }}</p>
        <div class="empty-actions">
          <button v-if="hasFiltersActive" @click="clearFilters" class="btn-secondary">
            <i class="fas fa-times"></i>
            Limpar Filtros
          </button>
          <button v-else @click="openAddStudentModal" class="btn-primary">
            <i class="fas fa-user-plus"></i>
            Adicionar Primeiro Aluno
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="students-grid">
        <div 
          v-for="student in paginatedStudents" 
          :key="student._id"
          class="student-card"
        >
          <div class="card-header">
            <div class="student-avatar-wrapper">
              <img 
                :src="student.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Student')}&background=3b82f6&color=fff`" 
                :alt="student.name"
                class="student-avatar"
              />
              <span :class="['status-indicator', student.status]"></span>
            </div>
          </div>

          <div class="card-body">
            <h3 class="student-name">{{ student.name || 'Sem nome' }}</h3>
            <p class="student-email">{{ student.email }}</p>

            <div class="student-badges">
              <span :class="['badge', 'badge-' + student.status]">
                <span class="badge-dot"></span>
                {{ formatStatus(student.status) }}
              </span>
              <span :class="['badge', 'badge-experience', 'badge-' + (student.personalInfo?.trainingExperience || 'iniciante')]">
                <i class="fas fa-dumbbell"></i>
                {{ formatExperience(student.personalInfo?.trainingExperience) }}
              </span>
            </div>

            <div class="student-stats">
              <div class="stat-item">
                <div class="stat-icon-wrapper">
                  <i class="fas fa-dumbbell"></i>
                </div>
                <div class="stat-details">
                  <span class="stat-value">{{ student.totalWorkouts || 0 }}</span>
                  <span class="stat-label">Treinos Realizados</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon-wrapper time">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="stat-details">
                  <span class="stat-value">{{ formatLastWorkout(student.lastWorkout) }}</span>
                  <span class="stat-label">Último Treino</span>
                </div>
              </div>
            </div>

            <div v-if="student.hasActivePlan" class="plan-info">
              <i class="fas fa-clipboard-list"></i>
              <span v-if="student.planInfo?.source === 'assigned' && student.planInfo?.count">
                {{ student.planInfo.count }} plano(s) ativo(s)
              </span>
              <span v-else-if="student.planInfo?.latestPlan">
                Último: {{ student.planInfo.latestPlan }}
              </span>
              <span v-else>
                Com plano ativo
              </span>
            </div>
            <div v-else class="plan-info no-plan">
              <i class="fas fa-exclamation-circle"></i>
              <span>Sem plano de treino</span>
            </div>
          </div>

          <div class="card-footer">
            <div class="card-footer-actions">
              <button @click.stop="confirmUnlinkStudent(student)" class="btn-unlink" title="Desvincular aluno">
                <i class="fas fa-unlink"></i>
                Desvincular
              </button>
              <button @click.stop="viewStudentProfile(student._id)" class="btn-view">
                <i class="fas fa-chart-line"></i>
                Desempenho
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="students-list-view">
        <div class="table-container">
          <table class="students-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Status</th>
                <th>Experiência</th>
                <th>Plano Atual</th>
                <th>Treinos</th>
                <th>Sequência</th>
                <th class="actions-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="student in paginatedStudents" 
                :key="student._id"
                class="student-row"
              >
                <td class="student-cell">
                  <div class="student-info">
                    <div class="avatar-container">
                      <img 
                        :src="student.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Student')}&background=3b82f6&color=fff`" 
                        :alt="student.name"
                        class="avatar"
                      />
                      <span :class="['status-dot', student.status]"></span>
                    </div>
                    <div class="student-details">
                      <p class="student-name">{{ student.name || 'Sem nome' }}</p>
                      <p class="student-email">{{ student.email }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span :class="['status-badge', student.status]">
                    {{ formatStatus(student.status) }}
                  </span>
                </td>
                <td>
                  <span :class="['experience-badge', student.personalInfo?.trainingExperience || 'iniciante']">
                    {{ formatExperience(student.personalInfo?.trainingExperience) }}
                  </span>
                </td>
                <td>
                  <div v-if="student.hasActivePlan" class="plan-status active">
                    <i class="fas fa-check-circle"></i>
                    <span v-if="student.planInfo?.count">{{ student.planInfo.count }} plano(s)</span>
                    <span v-else>Ativo</span>
                  </div>
                  <div v-else class="plan-status inactive">
                    <i class="fas fa-times-circle"></i>
                    <span>Sem plano</span>
                  </div>
                </td>
                <td class="stat-cell">
                  <strong>{{ student.totalWorkouts || 0 }}</strong>
                </td>
                <td class="stat-cell">
                  <div class="streak-info">
                    <i class="fas fa-fire"></i>
                    <strong>{{ student.currentStreak || 0 }}</strong>
                  </div>
                </td>
                <td class="actions-cell" @click.stop>
                  <div class="action-buttons">
                    <button @click="viewStudentProfile(student._id)" class="action-btn view" title="Ver perfil">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      v-if="student.hasActivePlan"
                      @click="openViewPlan(student)" 
                      class="action-btn plan" 
                      title="Ver plano"
                    >
                      <i class="fas fa-clipboard-list"></i>
                    </button>
                    <button @click="confirmUnlinkStudent(student)" class="action-btn unlink" title="Desvincular">
                      <i class="fas fa-unlink"></i>
                    </button>
                    <button @click="confirmDeleteStudent(student)" class="action-btn delete" title="Excluir">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="changePage(page)"
          :class="['page-btn', { active: page === currentPage }]"
        >
          {{ page }}
        </button>

        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </main>

    <!-- Modals -->
    <LinkStudentModal 
      v-if="showAddStudentModal"
      @close="closeStudentForm"
      @linked="handleStudentLinked"
    />

    <ViewPlanModal 
      v-if="showViewPlan"
      :student="selectedStudent"
      @close="showViewPlan = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useThemeStore } from '@/store/theme'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import DashboardNavBar from '@/components/DashboardNavBar.vue'
import LinkStudentModal from '@/components/LinkStudentModal.vue'
import ViewPlanModal from '@/components/ViewPlanModal.vue'
import NotificationModal from '@/components/NotificationModal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import api, { unlinkStudent } from '@/api'

const router = useRouter()
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

// Notification state
const notification = ref({
  visible: false,
  type: 'info',
  title: '',
  message: ''
})

// Confirmation state
const confirmationModal = ref({
  visible: false,
  title: '',
  message: '',
  onConfirm: null,
  onCancel: null
})

const showNotification = (type, title, message) => {
  notification.value = {
    visible: true,
    type,
    title,
    message
  }
}

const showConfirmation = (title, message, onConfirm, onCancel = null) => {
  confirmationModal.value = {
    visible: true,
    title,
    message,
    onConfirm,
    onCancel
  }
}

const handleConfirmationConfirm = () => {
  if (confirmationModal.value.onConfirm) {
    confirmationModal.value.onConfirm()
  }
  confirmationModal.value.visible = false
}

const handleConfirmationCancel = () => {
  if (confirmationModal.value.onCancel) {
    confirmationModal.value.onCancel()
  }
  confirmationModal.value.visible = false
}

// Estado
const students = ref([])
const search = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 12
const statusFilter = ref('all')
const planFilter = ref('all')
const experienceFilter = ref('all')
const viewMode = ref('grid')
const showAddStudentModal = ref(false)
const showViewPlan = ref(false)
const loading = ref(false)
const selectedStudent = ref(null)

// Computed Properties
const totalStudents = computed(() => students.value.length)
const activeStudents = computed(() => students.value.filter(s => s.status === 'active').length)
const pausedStudents = computed(() => students.value.filter(s => s.status === 'paused').length)
const studentsWithPlans = computed(() => students.value.filter(s => s.hasActivePlan).length)

const filteredStudents = computed(() => {
  let filtered = students.value

  // Filtro de busca
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(s => {
      const userName = (s.name || '').toLowerCase()
      const userEmail = (s.email || '').toLowerCase()
      return userName.includes(searchLower) || userEmail.includes(searchLower)
    })
  }

  // Filtro de status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(s => s.status === statusFilter.value)
  }

  // Filtro de plano
  if (planFilter.value === 'with-plan') {
    filtered = filtered.filter(s => s.hasActivePlan)
  } else if (planFilter.value === 'without-plan') {
    filtered = filtered.filter(s => !s.hasActivePlan)
  }

  // Filtro de experiência
  if (experienceFilter.value !== 'all') {
    filtered = filtered.filter(s => s.personalInfo?.trainingExperience === experienceFilter.value)
  }

  return filtered
})

const hasFiltersActive = computed(() => {
  return search.value !== '' || 
         statusFilter.value !== 'all' || 
         planFilter.value !== 'all' || 
         experienceFilter.value !== 'all'
})

const getEmptyStateTitle = computed(() => {
  if (search.value) return 'Nenhum aluno encontrado'
  if (hasFiltersActive.value) return 'Nenhum resultado para os filtros selecionados'
  return 'Nenhum aluno cadastrado'
})

const getEmptyStateMessage = computed(() => {
  if (search.value) return `Nenhum aluno corresponde à busca por "${search.value}"`
  if (hasFiltersActive.value) return 'Tente ajustar os filtros para encontrar alunos'
  return 'Comece adicionando seu primeiro aluno para começar a gerenciar treinos'
})

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * limit
  const end = start + limit
  return filteredStudents.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Formatadores
const formatExperience = (exp) => {
  const map = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
    atleta: 'Atleta'
  }
  return map[exp] || 'Iniciante'
}

const formatStatus = (status) => {
  const map = {
    active: 'Ativo',
    paused: 'Pausado',
    inactive: 'Inativo'
  }
  return map[status] || status
}

// Formatar última atividade
const formatLastWorkout = (lastWorkout) => {
  if (!lastWorkout) return 'Nunca';
  
  const workoutDate = new Date(lastWorkout.endTime || lastWorkout.startTime);
  const now = new Date();
  const diffTime = Math.abs(now - workoutDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays}d atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem atrás`;
  return `${Math.floor(diffDays / 30)}m atrás`;
}

// Helper function to calculate workout streak
const calculateWorkoutStreak = (sessions) => {
  if (!sessions || sessions.length === 0) return 0;
  
  const completedSessions = sessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.endTime || b.startTime) - new Date(a.endTime || a.startTime));
  
  if (completedSessions.length === 0) return 0;
  
  // Agrupar sessões por dia (ignorar hora)
  const sessionsByDay = {};
  completedSessions.forEach(session => {
    const sessionDate = new Date(session.endTime || session.startTime);
    const dayKey = sessionDate.toDateString(); // Apenas a data, sem hora
    sessionsByDay[dayKey] = true;
  });
  
  // Converter para array de datas únicas ordenadas
  const uniqueDays = Object.keys(sessionsByDay)
    .map(dayStr => new Date(dayStr))
    .sort((a, b) => b - a); // Mais recente primeiro
  
  if (uniqueDays.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Começar do dia mais recente e verificar consecutividade
  for (let i = 0; i < uniqueDays.length; i++) {
    const currentDay = new Date(uniqueDays[i]);
    currentDay.setHours(0, 0, 0, 0);
    
    const expectedDay = new Date(today);
    expectedDay.setDate(today.getDate() - i);
    
    // Se o dia atual corresponde ao esperado (hoje - i dias)
    if (currentDay.getTime() === expectedDay.getTime()) {
      streak++;
    } else {
      // Se não é consecutivo, parar a contagem
      break;
    }
  }
  
  return streak;
};

// Função para buscar workout sessions de um aluno
const getStudentWorkoutSessions = async (studentId) => {
  try {
    const response = await api.get(`/workout-sessions/sessions/student/${studentId}`);
    return response.data?.sessions || [];
  } catch (error) {
    console.error('❌ [StudentList] Erro ao buscar sessions para student', studentId, ':', error);
    return [];
  }
};

// Ações
const fetchStudents = async () => {
  try {
    loading.value = true
    
    // Pegar dados do usuário logado
    const userData = JSON.parse(sessionStorage.getItem('user'))
    const userId = userData.id
        
    // Buscar o instrutor pelo userId usando a lista de instrutores
    const instructorsResponse = await api.get('/instructors')
    const allInstructors = instructorsResponse.data
    
    // Encontrar o instrutor que corresponde ao userId
    const currentInstructor = allInstructors.find(inst => inst.userId === userId || inst.userId?._id === userId)
    
    if (!currentInstructor) {
      console.error('Instrutor não encontrado para o userId:', userId)
      students.value = []
      loading.value = false
      return
    }
    
    const instructorId = currentInstructor._id
    
    // Buscar apenas alunos deste instrutor usando a rota específica
    const response = await api.get(`/students/instructor/${instructorId}`)
        
    if (response.data) {
      // A resposta pode vir diretamente como array ou dentro de um objeto
      let studentsData = Array.isArray(response.data) ? response.data : (response.data.students || [])
            
      const studentsWithStats = await Promise.all(
        studentsData.map(async (student) => {
          const sessions = await getStudentWorkoutSessions(student._id);
          const completedSessions = sessions.filter(s => s.status === 'completed');
          
          // Calcular treinos da última semana (últimos 7 dias)
          const now = new Date();
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          
          const workoutsThisWeek = completedSessions.filter(session => {
            const sessionDate = new Date(session.endTime || session.startTime);
            return sessionDate >= sevenDaysAgo && sessionDate <= now;
          }).length;
          
          // Detectar se tem plano ativo baseado APENAS no instrutor atual
          let hasActivePlan = false;
          let planInfo = null;
          
          // 1. Verificar se tem workoutPlans atribuídos pelo instrutor atual
          if (student.workoutPlans && student.workoutPlans.length > 0) {
            
            // Filtrar apenas planos criados pelo instrutor atual
            const instructorPlans = student.workoutPlans.filter(plan => {
              const planInstructorId = plan.instructorId?._id || plan.instructorId;
              const match = planInstructorId === instructorId;
              return match;
            });
                        
            if (instructorPlans.length > 0) {
              hasActivePlan = true;
              planInfo = {
                source: 'assigned',
                count: instructorPlans.length,
                latestPlan: instructorPlans[0].name,
                plans: instructorPlans
              };
            }
          }
          
          // 2. Se não encontrou planos atribuídos, verificar sessões com planos do instrutor
          if (!hasActivePlan && sessions.length > 0) {            
            const instructorSessions = sessions.filter(s => {
              const hasWorkoutPlan = s.workoutPlanId && s.workoutName;
              const sessionInstructorId = s.instructorId?._id || s.instructorId;
              const match = sessionInstructorId === instructorId;
              
              return hasWorkoutPlan && match;
            });
                        
            if (instructorSessions.length > 0) {
              hasActivePlan = true;
              const latestSessionWithPlan = instructorSessions
                .sort((a, b) => new Date(b.endTime || b.startTime) - new Date(a.endTime || a.startTime))[0];
              planInfo = {
                source: 'session',
                latestPlan: latestSessionWithPlan.workoutName,
                lastUsed: latestSessionWithPlan.endTime || latestSessionWithPlan.startTime
              };
            }
          }
          
          return {
            ...student,
            totalWorkouts: completedSessions.length,
            currentStreak: calculateWorkoutStreak(sessions),
            workoutsThisWeek: workoutsThisWeek,
            lastWorkout: completedSessions.length > 0 ? 
              completedSessions.sort((a, b) => new Date(b.endTime || b.startTime) - new Date(a.endTime || a.startTime))[0] : null,
            // Adicionar informações de plano DO INSTRUTOR ATUAL
            hasActivePlan,
            planInfo,
            // Manter compatibilidade com currentWorkoutPlanId
            currentWorkoutPlanId: hasActivePlan ? (student.currentWorkoutPlanId || 'detected') : null
          };
        })
      );
      
      students.value = studentsWithStats;
      totalPages.value = Math.ceil(filteredStudents.value.length / limit)
    } else {
      students.value = []
    }
  } catch (error) {
    console.error('Erro ao carregar alunos:', error)
    console.error('Detalhes do erro:', error.response?.data)
    students.value = []
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const viewStudentProfile = (id) => {
  router.push(`/student/${id}/profile`)
}

const openAddStudentModal = () => {
  selectedStudent.value = null
  showAddStudentModal.value = true
}

const confirmUnlinkStudent = async (student) => {
  const studentName = student.name || 'este aluno'
  
  showConfirmation(
    'Confirmar Desvinculação',
    `Tem certeza que deseja desvincular ${studentName}? O aluno ficará sem instrutor.`,
    async () => {
      // Função executada quando confirmar
      try {    
        // Usar a função específica da API
        await unlinkStudent(student._id)
        
        // Atualizar a lista de alunos
        await fetchStudents()
        
        // Notificar sucesso
        showNotification('success', 'Sucesso', `${studentName} foi desvinculado com sucesso!`)
      } catch (error) {
        console.error('Erro ao desvincular aluno:', error)
        
        // Mostrar mensagem de erro específica
        const errorMessage = error.response?.data?.message || 'Erro ao desvincular aluno'
        showNotification('error', 'Erro ao Desvincular', errorMessage)
      }
    },
    () => {
      showNotification('info', 'Operação Cancelada', 'A desvinculação foi cancelada.')
    }
  )
}

const closeStudentForm = () => {
  selectedStudent.value = null
  showAddStudentModal.value = false
}

const handleStudentLinked = async () => {
  await fetchStudents()
  closeStudentForm()
}

const openViewPlan = (student) => {
  selectedStudent.value = student
  showViewPlan.value = true
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'all'
  planFilter.value = 'all'
  experienceFilter.value = 'all'
  currentPage.value = 1
}

const confirmDeleteStudent = async (student) => {
  const studentName = student.name || 'este aluno'
  if (!confirm(`Tem certeza que deseja excluir ${studentName}? Esta ação não pode ser desfeita.`)) return
  
  try {
    await api.delete(`/students/${student._id}`)
    await fetchStudents()
  } catch (error) {
    console.error('Erro ao excluir aluno:', error)
    showNotification('error', 'Erro ao Excluir', 'Erro ao excluir aluno')
  }
}

// Watchers
watch([statusFilter, planFilter, experienceFilter], () => {
  currentPage.value = 1
  totalPages.value = Math.ceil(filteredStudents.value.length / limit)
})

watch(search, () => {
  currentPage.value = 1
  totalPages.value = Math.ceil(filteredStudents.value.length / limit)
})

watch(filteredStudents, () => {
  totalPages.value = Math.ceil(filteredStudents.value.length / limit)
})

onMounted(() => {
  fetchStudents()
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

/* ========== VARIABLES ========== */
.students-page {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  
  /* Light Mode */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --card-bg: #ffffff;
  --text-color: #0f172a;
  --text-muted: #64748b;
  --text-secondary: #475569;
  --border-color: #e2e8f0;
  
  font-family: "Inter", sans-serif;
  min-height: 100vh;
  background: var(--bg-secondary);
  transition: all 0.3s ease;
}

.students-page.dark-mode {
  --primary-color: #667eea;
  --primary-hover: #5a67d8;
  
  --bg-primary: #171723;
  --bg-secondary: #16213e;
  --card-bg: #1e1e2d;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --text-secondary: #6b7280;
  --border-color: #2d2d3f;
}

/* ========== LAYOUT ========== */
.main-content {
  margin-left: 280px;
  padding: 2rem;
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body:has(.navbar-collapsed) .main-content,
.students-page:has(.navbar-collapsed) .main-content {
  margin-left: 0 !important;
}

/* ========== HEADER ========== */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-left {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.page-title i {
  color: var(--primary-color);
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* ========== STATS SECTION ========== */
.stats-section {
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, currentColor 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: currentColor;
}

.stat-card:hover::before {
  opacity: 0.03;
}

.dark-mode .stat-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark-mode .stat-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card:hover .stat-icon {
  transform: scale(1.05) rotate(5deg);
}

.stat-total .stat-icon { 
  background: linear-gradient(135deg, var(--primary-color), #667eea);
}

.stat-active .stat-icon { 
  background: linear-gradient(135deg, var(--success-color), #059669);
}

.stat-plans .stat-icon { 
  background: linear-gradient(135deg, var(--warning-color), #d97706);
}

.stat-paused .stat-icon { 
  background: linear-gradient(135deg, var(--danger-color), #dc2626);
}

.stat-total { color: var(--primary-color); }
.stat-active { color: var(--success-color); }
.stat-plans { color: var(--warning-color); }
.stat-paused { color: var(--danger-color); }

.stats-grid .stat-content {
  flex: 1;
}

.stats-grid .stat-value {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.stats-grid .stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.stat-trend.positive {
  color: var(--success-color);
}

.stat-trend.negative {
  color: var(--danger-color);
}

.stat-progress {
  margin-top: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), #667eea);
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-active .progress-fill {
  background: linear-gradient(90deg, var(--success-color), #059669);
}

.stat-plans .progress-fill {
  background: linear-gradient(90deg, var(--warning-color), #d97706);
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== CONTROLS SECTION ========== */
.controls-section {
  margin-bottom: 2rem;
}

.controls-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filters-group {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.25rem;
  border-radius: 10px;
}

.toggle-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  color: var(--text-color);
}

.toggle-btn.active {
  background: var(--primary-color);
  color: white;
}

/* ========== LOADING & EMPTY STATES ========== */
.loading-container,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
  color: var(--primary-color);
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  margin: 0 0 2rem 0;
  color: var(--text-muted);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.empty-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.empty-actions .btn-primary,
.empty-actions .btn-secondary {
  padding: 0.75rem 1.5rem;
  width: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s;
}

/* ========== GRID VIEW ========== */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.75rem;
  margin-bottom: 2rem;
}

.student-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  max-width: 435px;
  max-width: 435px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.student-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--primary-color), #667eea);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.student-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, var(--primary-color) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 0;
}

.student-card:hover::before {
  opacity: 1;
}

.student-card:hover::after {
  opacity: 0.05;
}

.student-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.dark-mode .student-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dark-mode .student-card:hover {
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.35);
  border-color: rgba(102, 126, 234, 0.4);
}

.card-header {
  padding: 2rem 2rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  background: linear-gradient(180deg, var(--bg-secondary) 0%, transparent 100%);
}

.student-avatar-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.student-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--card-bg);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
  transition: all 0.3s ease;
}

.student-card:hover .student-avatar {
  transform: scale(1.08);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.25);
}

.status-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 4px solid var(--card-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: pulse-status 2s ease-in-out infinite;
}

@keyframes pulse-status {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.status-indicator.active { 
  background: var(--success-color);
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
}

.status-indicator.paused { 
  background: var(--warning-color);
  box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
}

.status-indicator.inactive { 
  background: var(--danger-color);
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  animation: none;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: scale(1.1);
}

.card-body {
  padding: 0 2rem 1.5rem;
  position: relative;
  z-index: 1;
}

.student-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  text-align: center;
  letter-spacing: -0.02em;
}

.student-email {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  text-align: center;
  font-weight: 500;
}

.student-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: capitalize;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.badge-active { 
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%);
  color: #10b981; 
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.dark-mode .badge-active {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.12) 100%);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.3);
}

.badge-paused { 
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.dark-mode .badge-paused {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.12) 100%);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.3);
}

.badge-inactive { 
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.dark-mode .badge-inactive {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.12) 100%);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
}

.badge-experience {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.badge-iniciante { 
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.2);
}

.dark-mode .badge-iniciante {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.12) 100%);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.3);
}

.badge-intermediario { 
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.dark-mode .badge-intermediario {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.12) 100%);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.3);
}

.badge-avancado { 
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.08) 100%);
  color: #ec4899;
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.dark-mode .badge-avancado {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.12) 100%);
  color: #f9a8d4;
  border-color: rgba(236, 72, 153, 0.3);
}

.badge-atleta { 
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%);
  color: #7c3aed;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.dark-mode .badge-atleta {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0.12) 100%);
  color: #a78bfa;
  border-color: rgba(124, 58, 237, 0.3);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

.student-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
  padding: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.875rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2.5px;
  background: linear-gradient(180deg, var(--primary-color), #667eea);
  opacity: 0;
  transform: scaleY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.stat-item:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.dark-mode .stat-item:hover {
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.18);
  border-color: rgba(102, 126, 234, 0.4);
}

.stat-item:hover::before {
  opacity: 1;
  transform: scaleY(1);
}

.stat-icon-wrapper {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 9px;
  transition: all 0.3s ease;
  position: relative;
}

.stat-icon-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-item:hover .stat-icon-wrapper::after {
  opacity: 1;
}

.stat-icon-wrapper i {
  font-size: 0.9375rem;
  color: var(--primary-color);
  transition: all 0.3s ease;
  z-index: 1;
}

.stat-item:hover .stat-icon-wrapper i {
  transform: scale(1.08);
}

/* Variações de cores por tipo de stat */
.stat-icon-wrapper.streak {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.08));
  border-color: rgba(245, 158, 11, 0.2);
}

.stat-icon-wrapper.streak i {
  color: #f59e0b;
}

.stat-icon-wrapper.progress {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08));
  border-color: rgba(16, 185, 129, 0.2);
}

.stat-icon-wrapper.progress i {
  color: #10b981;
}

.stat-icon-wrapper.time {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08));
  border-color: rgba(59, 130, 246, 0.2);
}

.stat-icon-wrapper.time i {
  color: var(--primary-color);
}

.dark-mode .stat-icon-wrapper {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
  border-color: rgba(59, 130, 246, 0.3);
}

.dark-mode .stat-icon-wrapper.streak {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
  border-color: rgba(245, 158, 11, 0.3);
}

.dark-mode .stat-icon-wrapper.streak i {
  color: #fbbf24;
}

.dark-mode .stat-icon-wrapper.progress {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
  border-color: rgba(16, 185, 129, 0.3);
}

.dark-mode .stat-icon-wrapper.progress i {
  color: #34d399;
}

.dark-mode .stat-icon-wrapper.time {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
  border-color: rgba(59, 130, 246, 0.3);
}

.dark-mode .stat-icon-wrapper.time i {
  color: var(--primary-color);
}

.stat-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-width: 0;
}

.stat-details .stat-value {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.stat-details .stat-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.plan-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%);
  color: var(--success-color);
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.25);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.plan-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.plan-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.plan-info:hover::before {
  opacity: 1;
}

.dark-mode .plan-info {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%);
  border-color: rgba(16, 185, 129, 0.3);
}

.plan-info i {
  font-size: 1rem;
  filter: drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3));
  transition: transform 0.3s ease;
  z-index: 1;
}

.plan-info:hover i {
  transform: scale(1.1);
}

.plan-info span {
  z-index: 1;
}

/* No Plan - Estilo mais discreto e compacto */
.plan-info.no-plan {
  background: var(--bg-secondary);
  color: var(--text-muted);
  border: 1px dashed var(--border-color);
  box-shadow: none;
  padding: 0.75rem 1rem;
}

.plan-info.no-plan::before {
  display: none;
}

.plan-info.no-plan i {
  font-size: 0.875rem;
  color: var(--text-muted);
  filter: none;
  opacity: 0.6;
}

.plan-info.no-plan:hover {
  background: var(--bg-secondary);
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
  transform: translateY(-1px);
}

.plan-info.no-plan:hover i {
  color: var(--danger-color);
  opacity: 1;
}

.dark-mode .plan-info.no-plan {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.06);
}

.dark-mode .plan-info.no-plan:hover {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.05);
}

.card-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
  background: linear-gradient(180deg, transparent 0%, var(--bg-secondary) 100%);
  position: relative;
  z-index: 1;
}

.card-footer-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

/* Primary Action Button (View/Desempenho) */
.btn-view {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.btn-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-view:hover::before {
  opacity: 1;
}

.btn-view:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
}

.btn-view:active {
  transform: translateY(0) scale(0.98);
}

.dark-mode .btn-view {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
}

.dark-mode .btn-view:hover {
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
}

.btn-view i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.btn-view:hover i {
  transform: scale(1.1);
}

/* Secondary Action Button (Unlink) */
.btn-unlink {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.875rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  min-width: 140px;
}

.btn-unlink::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-unlink:hover::before {
  opacity: 1;
}

.btn-unlink:hover {
  border-color: var(--danger-color);
  color: var(--danger-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.btn-unlink:active {
  transform: translateY(0) scale(0.98);
}

.dark-mode .btn-unlink {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .btn-unlink:hover {
  border-color: var(--danger-color);
  background: rgba(239, 68, 68, 0.1);
}

.btn-unlink i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.btn-unlink:hover i {
  transform: scale(1.1);
}

/* ========== LIST VIEW ========== */
.students-list-view {
  margin-bottom: 2rem;
}

.table-container {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
}

.students-table thead {
  background: var(--bg-secondary);
}

.students-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
}

.students-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.student-row {
  cursor: pointer;
  transition: all 0.2s;
}

.student-row:hover {
  background: var(--bg-secondary);
}

.student-cell {
  min-width: 250px;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--card-bg);
}

.status-dot.active { background: var(--success-color); }
.status-dot.paused { background: var(--warning-color); }
.status-dot.inactive { background: var(--danger-color); }

.student-details {
  flex: 1;
}

.student-details .student-name {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9375rem;
  margin: 0 0 0.25rem 0;
}

.student-details .student-email {
  color: var(--text-muted);
  font-size: 0.8125rem;
  margin: 0;
}

.status-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.experience-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.plan-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.plan-status.active {
  color: var(--success-color);
}

.plan-status.inactive {
  color: var(--text-muted);
}

.stat-cell {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-color);
}

.streak-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.streak-info i {
  color: var(--warning-color);
}

.date-cell {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.actions-cell {
  width: 200px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.action-btn.view { background: #eff6ff; color: #2563eb; }
.action-btn.edit { background: #f0fdf4; color: #16a34a; }
.action-btn.plan { background: #fefbef; color: #d97706; }
.action-btn.unlink { background: #fef3c7; color: #d97706; }
.action-btn.delete { background: #fef2f2; color: #dc2626; }

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* ========== PAGINATION ========== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 0;
}

.pagination-btn,
.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-color);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover,
.page-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.page-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 1.5rem 1rem;
  }
  
  .students-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
  
  .controls-container {
    flex-direction: column;
  }
  
  .search-box,
  .filters-group {
    width: 100%;
  }
  
  .filters-group {
    flex-direction: column;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .students-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .student-card {
    max-width: 100%;
  }
  
  .card-footer-actions {
    flex-direction: column;
  }
  
  .btn-view,
  .btn-unlink {
    width: 100%;
    min-width: auto;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .students-table {
    min-width: 800px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1rem 0.75rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .stats-section {
    margin-bottom: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-icon {
    width: 52px;
    height: 52px;
    font-size: 1.375rem;
  }
  
  .stat-value {
    font-size: 1.75rem;
  }
  
  .card-body {
    padding: 0 1.5rem 1.25rem;
  }
  
  .card-footer {
    padding: 1.25rem 1.5rem;
  }
  
  .card-footer-actions {
    gap: 0.625rem;
  }
  
  .btn-view,
  .btn-unlink {
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
  }
}
</style>
