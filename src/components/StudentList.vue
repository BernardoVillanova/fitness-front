<template>
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
                {{ formatStatus(student.status) }}
              </span>
              <span :class="['badge', 'badge-experience', 'badge-' + (student.personalInfo?.trainingExperience || 'iniciante')]">
                {{ formatExperience(student.personalInfo?.trainingExperience) }}
              </span>
            </div>

            <div class="student-stats">
              <div class="stat-item">
                <i class="fas fa-dumbbell"></i>
                <span>{{ student.totalWorkouts || 0 }} treinos</span>
              </div>
              <div class="stat-item">
                <i class="fas fa-fire"></i>
                <span>{{ student.currentStreak || 0 }} dias</span>
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
                Ver Desempenho
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
import api, { unlinkStudent } from '@/api'

const router = useRouter()
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

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
  if (!confirm(`Tem certeza que deseja desvincular ${studentName}? O aluno ficará sem instrutor.`)) return
  
  try {    
    // Usar a função específica da API
    await unlinkStudent(student._id)
    
    // Atualizar a lista de alunos
    await fetchStudents()
    
    // Notificar sucesso
    alert(`${studentName} foi desvinculado com sucesso!`)
  } catch (error) {
    console.error('Erro ao desvincular aluno:', error)
    
    // Mostrar mensagem de erro específica
    const errorMessage = error.response?.data?.message || 'Erro ao desvincular aluno'
    alert(`Erro: ${errorMessage}`)
  }
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
    alert('Erro ao excluir aluno')
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
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.stat-total .stat-icon { background: var(--primary-color); }
.stat-active .stat-icon { background: var(--success-color); }
.stat-plans .stat-icon { background: var(--warning-color); }
.stat-paused .stat-icon { background: var(--danger-color); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem 0;
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
  background: var(--primary-color);
  border-radius: 3px;
  transition: width 0.5s ease;
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.student-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.student-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-color);
}

.card-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-color);
}

.student-avatar-wrapper {
  position: relative;
}

.student-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--border-color);
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid var(--card-bg);
}

.status-indicator.active { background: var(--success-color); }
.status-indicator.paused { background: var(--warning-color); }
.status-indicator.inactive { background: var(--danger-color); }

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
  padding: 1.5rem;
}

.student-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.student-email {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 1rem 0;
}

.student-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-active { background: #dcfce7; color: #166534; }
.badge-paused { background: #fef3c7; color: #92400e; }
.badge-inactive { background: #fee2e2; color: #991b1b; }

.badge-experience {
  background: var(--bg-secondary);
  color: var(--text-color);
}

.badge-iniciante { background: #dbeafe; color: #1e40af; }
.badge-intermediario { background: #fef3c7; color: #92400e; }
.badge-avancado { background: #fce7f3; color: #be185d; }
.badge-atleta { background: #f3e8ff; color: #7c3aed; }

.student-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.stat-item i {
  color: var(--primary-color);
  font-size: 1rem;
}

.plan-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
}

.plan-info.no-plan {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
}

.card-footer-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

.btn-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-view:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

.btn-unlink {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f87171;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  min-width: 110px;
}

.btn-unlink:hover {
  background: #f87171 ;
  transform: translateY(-2px);
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
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
