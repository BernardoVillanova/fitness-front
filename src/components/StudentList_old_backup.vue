<template>
  <div :class="['student-dashboard', { 'dark-mode': isDarkMode }]">
    <DashboardNavBar />

    <main class="content">
      <div class="page-header">
        <h1 class="page-title">Gerenciamento de Alunos</h1>
        <button @click="openAddStudentModal" class="btn btn-primary">
          <i class="fas fa-plus"></i>
          <span>Novo Aluno</span>
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-info">
            <h3>{{ totalStudents || 0 }}</h3>
            <p>Total de Alunos</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon active">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="stat-info">
            <h3>{{ activeStudents || 0 }}</h3>
            <p>Alunos Ativos</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon with-plan">
            <i class="fas fa-dumbbell"></i>
          </div>
          <div class="stat-info">
            <h3>{{ studentsWithPlans || 0 }}</h3>
            <p>Com Plano de Treino</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon paused">
            <i class="fas fa-pause-circle"></i>
          </div>
          <div class="stat-info">
            <h3>{{ pausedStudents || 0 }}</h3>
            <p>Em Pausa</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-container">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="search" 
            placeholder="Buscar por nome ou email..."
            class="search-input"
          />
        </div>
        
        <div class="filter-group">
          <select v-model="statusFilter" class="filter-select">
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="paused">Em Pausa</option>
            <option value="inactive">Inativos</option>
          </select>

          <select v-model="assignmentFilter" class="filter-select">
            <option value="all">Todos os Alunos</option>
            <option value="assigned">Com Instrutor</option>
            <option value="unassigned">Sem Instrutor</option>
          </select>
        </div>
      </div>

      <!-- Students Table -->
      <div class="table-card">
        <div class="table-wrapper">
          <table class="students-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Status</th>
                <th>Experiência</th>
                <th>Localização</th>
                <th>Plano Atual</th>
                <th>Última Atualização</th>
                <th class="actions-header">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="loading-row">
                <td colspan="7" class="loading-cell">
                  <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Carregando alunos...</span>
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredStudents.length === 0" class="empty-row">
                <td colspan="7" class="empty-cell">
                  <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Nenhum aluno encontrado</h3>
                    <p>Tente ajustar os filtros ou adicione um novo aluno</p>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="student in filteredStudents" :key="student._id" class="student-row">
                <td class="student-cell">
                  <div class="student-info">
                    <div class="avatar-container">
                      <img :src="student.user?.avatar || '/default-avatar.png'" class="avatar" />
                    </div>
                    <div class="student-details">
                      <div class="student-name">{{ student.user?.name || 'Nome não informado' }}</div>
                      <div class="student-email">{{ student.user?.email || 'Email não informado' }}</div>
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
                <td class="location-cell">
                  <div v-if="student.personalInfo?.location?.city">
                    <div class="city">{{ student.personalInfo.location.city }}</div>
                    <div class="neighborhood">{{ student.personalInfo.location.neighborhood || '' }}</div>
                  </div>
                  <span v-else class="no-data">Não informado</span>
                </td>
                <td>
                  <div v-if="student.currentWorkoutPlanId" class="plan-status active">
                    <i class="fas fa-dumbbell"></i>
                    <span>Plano Ativo</span>
                  </div>
                  <span v-else class="plan-status inactive">
                    <i class="fas fa-times-circle"></i>
                    <span>Sem Plano</span>
                  </span>
                </td>
                <td class="date-cell">
                  {{ formatDate(student.updatedAt) }}
                </td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button @click="viewProfile(student._id)" class="action-btn view" title="Ver Perfil">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="editStudent(student._id)" class="action-btn edit" title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="openViewPlan(student)" class="action-btn plan" title="Ver Plano">
                      <i class="fas fa-dumbbell"></i>
                    </button>
                    <button 
                      v-if="student.instructorId"
                      @click="unassignStudent(student._id)"
                      class="action-btn unassign"
                      title="Remover Instrutor"
                    >
                      <i class="fas fa-user-slash"></i>
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

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            :disabled="currentPage === 1" 
            @click="changePage(currentPage - 1)" 
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="pageNum in visiblePages" 
              :key="pageNum"
              @click="changePage(pageNum)"
              :class="['page-btn', { active: pageNum === currentPage }]"
            >
              {{ pageNum }}
            </button>
          </div>
          
          <button 
            :disabled="currentPage === totalPages" 
            @click="changePage(currentPage + 1)" 
            class="pagination-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </main>

    <StudentForm 
      v-if="showAddStudentModal"
      :student="selectedStudent"
      @close="closeStudentForm"
      @save="handleStudentSaved"
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
import StudentForm from '@/components/StudentForm.vue'
import ViewPlanModal from '@/components/ViewPlanModal.vue'
import { getStudents, deleteStudent, unassignInstructor } from '@/api'

const router = useRouter()
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

// Estado
const students = ref([])
const search = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 10
const statusFilter = ref('all')
const assignmentFilter = ref('all')
const showAddStudentModal = ref(false)
const showViewPlan = ref(false)
const loading = ref(false)
const selectedStudent = ref(null)

// Computed Properties
const totalStudents = computed(() => students.value.length)
const activeStudents = computed(() => students.value.filter(s => s.status === 'active').length)
const pausedStudents = computed(() => students.value.filter(s => s.status === 'paused').length)
const studentsWithPlans = computed(() => students.value.filter(s => s.currentWorkoutPlanId).length)

const filteredStudents = computed(() => {
  let filtered = students.value

  // Filtro de busca
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(s => {
      const userName = s.user?.name?.toLowerCase() || ''
      const userEmail = s.user?.email?.toLowerCase() || ''
      return userName.includes(searchLower) || userEmail.includes(searchLower)
    })
  }

  // Filtro de status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(s => s.status === statusFilter.value)
  }

  // Filtro de atribuição
  if (assignmentFilter.value === 'assigned') {
    filtered = filtered.filter(s => s.instructorId)
  } else if (assignmentFilter.value === 'unassigned') {
    filtered = filtered.filter(s => !s.instructorId)
  }

  return filtered
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

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Ações
const fetchStudents = async (page = 1, searchQuery = '') => {
  try {
    loading.value = true
    const params = {
      page,
      limit,
      ...(searchQuery && { search: searchQuery }),
      ...(statusFilter.value !== 'all' && { status: statusFilter.value }),
      ...(assignmentFilter.value !== 'all' && { hasInstructor: assignmentFilter.value === 'assigned' })
    }

    const response = await getStudents(params)
    
    if (response.data && response.data.students) {
      students.value = response.data.students
      totalPages.value = Math.ceil(response.data.total / limit)
    } else {
      students.value = response.data || []
      totalPages.value = 1
    }
    
    currentPage.value = page
  } catch (error) {
    console.error('Erro ao carregar alunos:', error)
    students.value = []
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchStudents(page, search.value)
  }
}

const viewProfile = (id) => {
  router.push(`/student/${id}/profile`)
}

const editStudent = (id) => {
  selectedStudent.value = students.value.find(s => s._id === id)
  showAddStudentModal.value = true
}

const openAddStudentModal = () => {
  selectedStudent.value = null
  showAddStudentModal.value = true
}

const closeStudentForm = () => {
  selectedStudent.value = null
  showAddStudentModal.value = false
}

const handleStudentSaved = async () => {
  await fetchStudents(currentPage.value, search.value)
  closeStudentForm()
}

const openViewPlan = (student) => {
  selectedStudent.value = student
  showViewPlan.value = true
}

const unassignStudent = async (studentId) => {
  if (!confirm('Tem certeza que deseja remover o instrutor deste aluno?')) return
  
  try {
    await unassignInstructor(studentId)
    console.log('Instrutor removido com sucesso')
    await fetchStudents(currentPage.value, search.value)
  } catch (error) {
    console.error('Erro ao remover instrutor:', error)
  }
}

const confirmDeleteStudent = async (student) => {
  const studentName = student.user?.name || 'este aluno'
  if (!confirm(`Tem certeza que deseja excluir ${studentName}? Esta ação não pode ser desfeita.`)) return
  
  try {
    await deleteStudent(student._id)
    console.log('Aluno excluído com sucesso')
    await fetchStudents(currentPage.value, search.value)
  } catch (error) {
    console.error('Erro ao excluir aluno:', error)
  }
}

// Watchers
watch([statusFilter, assignmentFilter], () => {
  currentPage.value = 1
  fetchStudents(1, search.value)
})

watch(search, () => {
  currentPage.value = 1
  fetchStudents(1, search.value)
})

onMounted(() => {
  fetchStudents()
})
</script>

<style scoped>
.student-dashboard {
  min-height: 100vh;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #333);
  transition: all 0.3s ease;
}

.content {
  padding: 2rem;
  margin-left: 280px;
  max-width: calc(100% - 280px);
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Detecta quando o navbar está colapsado */
body:has(.navbar-collapsed) .content,
.student-dashboard:has(.navbar-collapsed) .content {
  margin-left: 0 !important;
  max-width: 100% !important;
}

@media (max-width: 768px) {
  .content {
    margin-left: 0;
    max-width: 100%;
    padding: 1rem;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--highlight-color, #007bff);
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background: var(--button-color, #007bff);
  color: white;
}

.btn-primary:hover {
  background: var(--button-hover-color, #0056b3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-color, #ffffff);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: var(--highlight-color, #007bff);
  color: white;
}

.stat-icon.active { background: #10b981; }
.stat-icon.with-plan { background: #f59e0b; }
.stat-icon.paused { background: #ef4444; }

.stat-info h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: var(--text-color, #333);
}

.stat-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Filters */
.filters-container {
  background: var(--bg-color, #ffffff);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #333);
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--highlight-color, #007bff);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #333);
  font-size: 0.875rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
}

/* Table */
.table-card {
  background: var(--bg-color, #ffffff);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.table-wrapper {
  overflow-x: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
}

.students-table th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  white-space: nowrap;
}

.students-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.student-row:hover {
  background: #f8fafc;
}

.student-cell {
  min-width: 250px;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.student-details {
  flex: 1;
}

.student-name {
  font-weight: 600;
  color: var(--text-color, #333);
  font-size: 0.875rem;
}

.student-email {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Badges */
.status-badge, .experience-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active { background: #dcfce7; color: #166534; }
.status-badge.paused { background: #fef3c7; color: #92400e; }
.status-badge.inactive { background: #fee2e2; color: #991b1b; }

.experience-badge.iniciante { background: #dbeafe; color: #1e40af; }
.experience-badge.intermediario { background: #fef3c7; color: #92400e; }
.experience-badge.avancado { background: #fce7f3; color: #be185d; }
.experience-badge.atleta { background: #f3e8ff; color: #7c3aed; }

.location-cell .city {
  font-weight: 500;
  color: var(--text-color, #333);
  font-size: 0.875rem;
}

.location-cell .neighborhood {
  color: #6b7280;
  font-size: 0.75rem;
}

.no-data {
  color: #9ca3af;
  font-size: 0.875rem;
}

.plan-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.plan-status.active {
  color: #059669;
}

.plan-status.inactive {
  color: #6b7280;
}

.date-cell {
  color: #6b7280;
  font-size: 0.75rem;
  white-space: nowrap;
}

/* Actions */
.actions-header {
  text-align: center;
}

.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
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
.action-btn.unassign { background: #fef2f2; color: #dc2626; }
.action-btn.delete { background: #fef2f2; color: #dc2626; }

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Loading and Empty States */
.loading-cell, .empty-cell {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6b7280;
}

.empty-state {
  color: #6b7280;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.pagination-btn, .page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #333);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover,
.page-btn:hover {
  border-color: var(--highlight-color, #007bff);
  color: var(--highlight-color, #007bff);
}

.page-btn.active {
  background: var(--highlight-color, #007bff);
  border-color: var(--highlight-color, #007bff);
  color: white;
}

/* Dark Mode */
.dark-mode {
  background: var(--bg-color, #1a1a1a);
}

.dark-mode .stat-card,
.dark-mode .filters-container,
.dark-mode .table-card {
  background: var(--bg-color, #1a1a1a);
  border-color: #374151;
}

.dark-mode .students-table th {
  background: #111827;
  color: #f9fafb;
  border-color: #374151;
}

.dark-mode .students-table td {
  border-color: #374151;
}

.dark-mode .student-row:hover {
  background: #111827;
}

.dark-mode .search-input,
.dark-mode .filter-select,
.dark-mode .pagination-btn,
.dark-mode .page-btn {
  background: var(--bg-color, #1a1a1a);
  border-color: #374151;
  color: var(--text-color, #f4f4f4);
}

.dark-mode .pagination {
  background: #111827;
  border-color: #374151;
}
</style>