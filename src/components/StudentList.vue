<template>
  <div :class="['student-dashboard', isDarkMode ? 'dark' : 'light']">
    <DashboardNavBar @toggle-theme="toggleTheme" />
    
    <main class="content">
      <div class="header">
        <h1>Alunos</h1>
        <div class="actions">
          <button class="btn-primary" @click="fetchStudents">Atualizar</button>
          <input type="text" v-model="search" placeholder="Buscar por nome..." />
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id">
              <td><img :src="student.avatar || 'default-avatar.png'" class="avatar" /></td>
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
              <td>
                <span :class="['badge', student.status === 'ativo' ? 'active' : 'inactive']">
                  {{ student.status }}
                </span>
              </td>
              <td>
                <button @click="goToProfile(student.id)" title="Ver perfil">👁️</button>
                <button @click="editStudent(student.id)" title="Editar">✏️</button>
                <button @click="deleteStudent(student.id)" title="Excluir">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button :disabled="page === 1" @click="page--">Anterior</button>
          <span>Página {{ page }}</span>
          <button :disabled="page >= maxPage" @click="page++">Próxima</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import DashboardNavBar from '@/components/DashboardNavBar.vue'
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'
import axios from 'axios'

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

const students = ref([])
const search = ref('')
const page = ref(1)
const limit = 5

const fetchStudents = async () => {
  try {
    const response = await axios.get('/api/students') // ou com paginação no backend
    students.value = response.data
  } catch (err) {
    console.error('Erro ao buscar alunos:', err)
  }
}

const filteredStudents = computed(() => {
  const start = (page.value - 1) * limit
  const end = page.value * limit
  return students.value
    .filter(s => s.name.toLowerCase().includes(search.value.toLowerCase()))
    .slice(start, end)
})

const maxPage = computed(() => Math.ceil(students.value.length / limit))

const goToProfile = (id) => {
  // Exemplo: use router.push
  window.location.href = `/student/${id}`
}

const editStudent = (id) => {
  alert('Editar aluno: ' + id)
}

const deleteStudent = async (id) => {
  if (confirm('Deseja realmente excluir este aluno?')) {
    await axios.delete(`/api/students/${id}`)
    fetchStudents()
  }
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}

onMounted(fetchStudents)
</script>

<style scoped>
.student-dashboard.light {
  background: #f8f9fa;
  color: #333;
}

.student-dashboard.dark {
  background: #1c1c2e;
  color: white;
}

.content {
  padding: 40px;
  margin-left: 4%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
}

.student-dashboard.dark .btn-primary {
  background-color: #6441a5;
}

.table-container {
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow-x: auto;
}

.student-dashboard.dark .table-container {
  background: #2a2a40;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #007bff;
  color: white;
  padding: 12px;
  text-align: left;
}

.student-dashboard.dark th {
  background: #6441a5;
}

td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85em;
}

.active {
  background-color: #28a745;
  color: white;
}

.inactive {
  background-color: #dc3545;
  color: white;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
