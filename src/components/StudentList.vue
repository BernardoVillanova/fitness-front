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
              <td class="actions-cell">
                <button @click="goToProfile(student.id)" title="Ver perfil" class="icon-btn view">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editStudent(student.id)" title="Editar" class="icon-btn edit">
                  <i class="fas fa-pen"></i>
                </button>
                <button @click="deleteStudent(student.id)" title="Excluir" class="icon-btn delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="5" class="empty-row">Nenhum aluno encontrado.</td>
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

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

const students = ref([])

const search = ref('')
const page = ref(1)
const limit = 10

const sampleStudents = [
  { id: 1, name: 'Ana Clara Lima', email: 'ana.lima@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Bruno Souza', email: 'bruno.souza@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Carlos Eduardo', email: 'carlos.edu@example.com', status: 'inativo', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Daniela Rocha', email: 'daniela.rocha@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'Eduardo Freitas', email: 'edu.freitas@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, name: 'Fernanda Costa', email: 'fernanda.costa@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, name: 'Gustavo Martins', email: 'gustavo.m@example.com', status: 'inativo', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 8, name: 'Helena Barbosa', email: 'helena.b@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: 9, name: 'Igor Fernandes', email: 'igor.f@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 10, name: 'Juliana Gomes', email: 'juliana.g@example.com', status: 'inativo', avatar: 'https://i.pravatar.cc/150?img=10' },
  { id: 11, name: 'Kleber Dias', email: 'kleber.d@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 12, name: 'Larissa Mota', email: 'larissa.m@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 13, name: 'Marcos Paulo', email: 'marcos.p@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: 14, name: 'Natália Ribeiro', email: 'natalia.r@example.com', status: 'inativo', avatar: 'https://i.pravatar.cc/150?img=14' },
  { id: 15, name: 'Otávio Silva', email: 'otavio.s@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: 16, name: 'Patrícia Almeida', email: 'patricia.a@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=16' },
  { id: 17, name: 'Ricardo Leal', email: 'ricardo.l@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=17' },
  { id: 18, name: 'Sabrina Lopes', email: 'sabrina.l@example.com', status: 'inativo', avatar: 'https://i.pravatar.cc/150?img=18' },
  { id: 19, name: 'Thiago Pinto', email: 'thiago.p@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=19' },
  { id: 20, name: 'Vanessa Cardoso', email: 'vanessa.c@example.com', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=20' }
]

const fetchStudents = async () => {
  students.value = sampleStudents
}

const filteredStudents = computed(() => {
  const start = (page.value - 1) * limit
  const end = page.value * limit
  return students.value
    .filter(s => s.name.toLowerCase().includes(search.value.toLowerCase()))
    .slice(start, end)
})

const maxPage = computed(() => Math.ceil(
  students.value.filter(s =>
    s.name.toLowerCase().includes(search.value.toLowerCase())
  ).length / limit
))

const goToProfile = (id) => {
  window.location.href = `/student/${id}`
}

const editStudent = (id) => {
  alert('Editar aluno: ' + id)
}

const deleteStudent = async (id) => {
  if (confirm('Deseja realmente excluir este aluno?')) {
    students.value = students.value.filter(s => s.id !== id)
  }
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}

onMounted(fetchStudents)
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.student-dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.student-dashboard.light {
  background: #f8f9fa;
  color: #333;
}

.student-dashboard.dark {
  background: #1c1c2e;
  color: white;
}

.content {
  flex: 1;
  padding: 40px;
  margin-left: 4%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
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
  cursor: pointer;
  transition: background 0.3s ease;
}

.student-dashboard.dark .btn-primary {
  background-color: #6441a5;
}

.table-container {
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  vertical-align: middle;
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

.actions-cell {
  display: flex;
  gap: 8px;
}

.icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  font-size: 1rem;
  transition: background 0.2s ease;
  color: inherit;
}

.icon-btn.view:hover {
  background-color: rgba(100, 65, 165, 0.2);
}

.icon-btn.edit:hover {
  background-color: rgba(0, 123, 255, 0.2);
}

.icon-btn.delete:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

.empty-row {
  text-align: center;
  padding: 20px;
  color: #999;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background 0.3s ease;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  color: #666;
}

.student-dashboard.dark .pagination button {
  background-color: #6441a5;
}

.student-dashboard.dark .pagination button:disabled {
  background-color: #444;
  color: #999;
}
</style>
