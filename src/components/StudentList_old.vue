<template>
  <div :class="['student-dashboard', isDarkMode ? 'dark' : 'light']">
    <DashboardNavBar />

    <main class="content">
      <!-- Stats Section -->
      <div class="stats-section">
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
          <div class="stat-icon">
            <i class="fas fa-dumbbell"></i>
          </div>
          <div class="stat-info">
            <h3>{{ activeStudents || 0 }}</h3>
            <p>Alunos Ativos</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <div class="stat-info">
            <h3>{{ studentsWithPlans || 0 }}</h3>
            <p>Com Plano</p>
          </div>
        </div>
      </div>

      <!-- Controls Bar -->
      <div class="controls-bar">
        <div class="search-field">
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
            <option value="assigned">Meus Alunos</option>
            <option value="unassigned">Sem Instrutor</option>
          </select>
        </div>

        <button @click="openAddStudentModal" class="btn-primary">
          <i class="fas fa-plus"></i>
          <span>Novo Aluno</span>
        </button>
      </div>

      <!-- Tabela de Alunos -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Experiência</th>
              <th>Plano Atual</th>
              <th>Status</th>
              <th>Última Atualização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student._id">
              <td class="student-info">
                <img :src="student.avatar || '/default-avatar.png'" class="avatar" />
                <div>
                  <strong>{{ student.name }}</strong>
                  <small>{{ student.email }}</small>
                </div>
              </td>
              <td>
                <span :class="['experience-badge', student.personalInfo?.trainingExperience || 'iniciante']">
                  {{ formatExperience(student.personalInfo?.trainingExperience) }}
                </span>
              </td>
              <td>
                <div v-if="student.currentWorkoutPlanId" class="plan-info">
                  <i class="fas fa-dumbbell"></i>
                  <span>Plano Ativo</span>
                </div>
                <span v-else class="no-plan">Sem plano</span>
              </td>
              <td>
                <span :class="['status-badge', student.status]">
                  {{ formatStatus(student.status) }}
                </span>
              </td>
              <td>
                <small>{{ formatDate(student.updatedAt) }}</small>
              </td>
              <td class="actions-cell">
                <button @click="viewProfile(student._id)" class="icon-btn view" title="Ver Perfil">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editStudent(student._id)" class="icon-btn edit" title="Editar">
                  <i class="fas fa-pen"></i>
                </button>
                <button 
                  v-if="student.instructorId && assignmentFilter === 'assigned'"
                  @click="unassignStudent(student._id)"
                  class="icon-btn unassign"
                  title="Remover do instrutor"
                >
                  <i class="fas fa-user-slash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="6" class="empty-row">
                <div class="empty-state">
                  <i class="fas fa-users"></i>
                  <p>Nenhum aluno encontrado</p>
                  <small>Tente ajustar os filtros ou adicione um novo aluno</small>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginação -->
        <div class="pagination">
          <button 
            :disabled="page === 1" 
            @click="page--" 
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="page-info">Página {{ page }} de {{ maxPage }}</span>
          <button 
            :disabled="page >= maxPage" 
            @click="page++" 
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
  </div>
</template>

<script setup>
import DashboardNavBar from '@/components/DashboardNavBar.vue'
import StudentForm from '@/components/StudentForm.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useThemeStore } from '@/store/theme'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { getStudents, unassignInstructor } from '@/api'
import { useToast } from 'vue-toastification'

const router = useRouter()
const themeStore = useThemeStore()
const toast = useToast()
const { isDarkMode } = storeToRefs(themeStore)

// Estado
const students = ref([])
const search = ref('')
const page = ref(1)
const limit = 10
const statusFilter = ref('all')
const assignmentFilter = ref('all')
const showAddStudentModal = ref(false)
const loading = ref(false)
const selectedStudent = ref(null)

// Computed Properties
const totalStudents = computed(() => students.value.length)
const activeStudents = computed(() => students.value.filter(s => s.status === 'active').length)
const studentsWithPlans = computed(() => students.value.filter(s => s.currentWorkoutPlanId).length)

// Computed properties para filtragem
const filteredStudents = computed(() => {
  let filtered = students.value

  // Filtro de busca
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(s => {
      const userName = s.userId?.name?.toLowerCase() || ''
      const userEmail = s.userId?.email?.toLowerCase() || ''
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

  // Paginação
  const start = (page.value - 1) * limit
  const end = page.value * limit
  return filtered.slice(start, end)
})

const maxPage = computed(() => {
  return Math.ceil(students.value.length / limit) || 1
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
    year: '2-digit'
  })
}

// Ações
const fetchStudents = async () => {
  try {
    loading.value = true
    const params = {}
    
    if (statusFilter.value !== 'all') params.status = statusFilter.value
    if (assignmentFilter.value !== 'all') params.hasInstructor = assignmentFilter.value === 'assigned'
    if (search.value) params.search = search.value

    const response = await getStudents(params)
    students.value = response.data
  } catch (error) {
    console.error('Erro ao carregar alunos:', error)
    toast.error('Erro ao carregar lista de alunos')
  } finally {
    loading.value = false
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
  await fetchStudents()
  closeStudentForm()
}

const unassignStudent = async (studentId) => {
  try {
    await unassignInstructor(studentId)
    toast.success('Aluno removido do seu acompanhamento')
    await fetchStudents()
  } catch (error) {
    console.error('Erro ao remover aluno:', error)
    toast.error('Erro ao remover aluno do acompanhamento')
  }
}

// Watchers
watch([statusFilter, assignmentFilter, search], () => {
  page.value = 1
})

watch(page, (newPage) => {
  if (newPage < 1) page.value = 1
  else if (newPage > maxPage.value) page.value = maxPage.value
})

onMounted(fetchStudents)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.student-dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  color: var(--text-color);
}

.student-dashboard.light {
  --bg-color: #f8fafc;
  --text-color: #1e293b;
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --text-secondary: #64748b;
}

.student-dashboard.dark {
  --bg-color: #1e1b2e;
  --text-color: #f8fafc;
  --primary-color: #8b5cf6;
  --primary-hover: #7c3aed;
  --card-bg: #2d2a3d;
  --border-color: #3f3a5a;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --text-secondary: #94a3b8;
}

.content {
  flex: 1;
  padding: 2rem;
  margin-left: 4%;
  max-width: 1600px;
  margin: 0 auto;
  width: 95%;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 6px var(--shadow-color);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  font-size: 1.5rem;
  background: var(--primary-color);
  color: white;
}

.stat-info h3 {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: var(--primary-color);
}

.stat-info p {
  color: var(--text-secondary);
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
}

/* Controls Bar */
.controls-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.search-field {
  position: relative;
  flex: 1;
  min-width: 280px;
  max-width: 400px;
}

.search-field i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-color, #3b82f6);
}

.filter-group {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

/* Tabela */
.table-container {
  background: var(--card-bg, #ffffff);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.dark .table-container {
  background: #242444;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: var(--primary, #6441a5);
  color: #ffffff;
  font-weight: 500;
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e1e1e1);
  font-size: 0.875rem;
}

.dark td {
  border-color: #3d3d5c;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.student-info div {
  display: flex;
  flex-direction: column;
}

.student-info small {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

/* Badges */
.experience-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.experience-badge.iniciante { background: #4834d4; color: white; }
.experience-badge.intermediario { background: #6c5ce7; color: white; }
.experience-badge.avancado { background: #a55eea; color: white; }
.experience-badge.atleta { background: #8854d0; color: white; }

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active { background: #00b894; color: white; }
.status-badge.paused { background: #fdcb6e; color: #2d3436; }
.status-badge.inactive { background: #d63031; color: white; }

.plan-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.no-plan {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

/* Ações */
.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn.view { background: #6441a510; color: #6441a5; }
.icon-btn.edit { background: #0984e310; color: #0984e3; }
.icon-btn.unassign { background: #d6303110; color: #d63031; }

.dark .icon-btn.view { background: #6441a520; color: #9b59b6; }
.dark .icon-btn.edit { background: #0984e320; color: #74b9ff; }
.dark .icon-btn.unassign { background: #d6303120; color: #ff7675; }

.icon-btn:hover {
  transform: scale(1.05);
}

/* Estado vazio */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.empty-state small {
  font-size: 0.875rem;
}

/* Paginação */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--border-color, #e1e1e1);
}

.dark .pagination {
  border-color: #3d3d5c;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border-color, #e1e1e1);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.dark .pagination-btn {
  border-color: #3d3d5c;
  color: #ffffff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  background: var(--primary, #6441a5);
  border-color: var(--primary, #6441a5);
  color: white;
}

.page-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Layout para modais */
:deep(.modal-overlay) {
  z-index: 1000;
}

:deep(.modal-content) {
  max-height: 90vh;
  max-width: 1200px;
}

:deep(.form-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

:deep(.form-section) {
  background: var(--bg-color);
  padding: 1.5rem;
  border-radius: 0.5rem;
}
</style>
