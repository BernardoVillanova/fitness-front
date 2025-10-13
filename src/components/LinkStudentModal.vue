<template>
  <NotificationModal 
    v-model:visible="notification.visible"
    :type="notification.type"
    :title="notification.title"
    :message="notification.message"
  />
  <div class="modal-overlay" @click.self="close">
    <div :class="['modal-container', { 'dark-mode': isDarkMode }]">
      <div class="modal-header">
        <div class="header-content">
          <div class="header-icon">
            <font-awesome-icon icon="user-plus" />
          </div>
          <div class="header-text">
            <h2>Vincular Novo Aluno</h2>
            <p>Busque e vincule usuários que ainda não possuem instrutor</p>
          </div>
        </div>
        <button class="close-btn" @click="close">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="modal-body">
        <!-- Search Section -->
        <div class="search-section">
          <div class="search-box">
            <font-awesome-icon icon="search" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              class="search-input"
              @input="handleSearch"
            />
            <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
              <font-awesome-icon icon="times" />
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <font-awesome-icon icon="spinner" spin class="loading-icon" />
          <p>Buscando usuários...</p>
        </div>

        <!-- Empty State - No Search -->
        <div v-else-if="!searchQuery && availableUsers.length === 0" class="empty-state">
          <div class="empty-icon">
            <font-awesome-icon icon="search" />
          </div>
          <h3>Busque um usuário</h3>
          <p>Digite o nome, email ou CPF de um usuário para começar a busca</p>
        </div>

        <!-- Empty State - No Results -->
        <div v-else-if="searchQuery && availableUsers.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">
            <font-awesome-icon icon="user-slash" />
          </div>
          <h3>Nenhum usuário encontrado</h3>
          <p>Não foram encontrados usuários sem instrutor com o termo "{{ searchQuery }}"</p>
        </div>

        <!-- Users List -->
        <div v-else class="users-list">
          <div class="results-header">
            <span class="results-count">
              {{ availableUsers.length }} {{ availableUsers.length === 1 ? 'usuário encontrado' : 'usuários encontrados' }}
            </span>
          </div>
          
          <div class="user-cards">
            <div
              v-for="user in availableUsers"
              :key="user._id"
              class="user-card"
              @click="selectUser(user)"
            >
              <div class="user-avatar">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                <div v-else class="avatar-placeholder">
                  <font-awesome-icon icon="user" />
                </div>
              </div>
              
              <div class="user-info">
                <h4 class="user-name">{{ user.name }}</h4>
                <p class="user-email">
                  <font-awesome-icon icon="envelope" />
                  {{ user.email }}
                </p>
                <p v-if="user.cpf" class="user-cpf">
                  <font-awesome-icon icon="id-card" />
                  {{ formatCPF(user.cpf) }}
                </p>
              </div>

              <div class="user-action">
                <button class="link-btn" @click.stop="confirmLink(user)">
                  <font-awesome-icon icon="user-check" />
                  Vincular
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div v-if="showConfirmation" class="confirmation-overlay" @click.self="cancelConfirmation">
        <div class="confirmation-modal">
          <div class="confirmation-icon">
            <font-awesome-icon icon="triangle-exclamation" />
          </div>
          <h3>Confirmar vinculação</h3>
          <p>
            Deseja vincular <strong>{{ selectedUser?.name }}</strong> como seu aluno?
          </p>
          <div class="confirmation-actions">
            <button class="btn-cancel" @click="cancelConfirmation">
              Cancelar
            </button>
            <button class="btn-confirm" @click="linkStudent" :disabled="isLinking">
              <font-awesome-icon v-if="isLinking" icon="spinner" spin />
              <font-awesome-icon v-else icon="check" />
              {{ isLinking ? 'Vinculando...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'
import api from '@/api'
import NotificationModal from './NotificationModal.vue'

const emit = defineEmits(['close', 'linked'])

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

// Notification state
const notification = ref({
  visible: false,
  type: 'info',
  title: '',
  message: ''
})

const showNotification = (type, title, message) => {
  notification.value = {
    visible: true,
    type,
    title,
    message
  }
}

// State
const searchQuery = ref('')
const availableUsers = ref([])
const loading = ref(false)
const selectedUser = ref(null)
const showConfirmation = ref(false)
const isLinking = ref(false)

// Search debounce timeout
let searchTimeout = null

// Methods
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.trim().length > 0) {
      await fetchAvailableUsers()
    } else {
      availableUsers.value = []
    }
  }, 500)
}

const fetchAvailableUsers = async () => {
  try {
    loading.value = true
    const response = await api.get('/auth/users/without-instructor', {
      params: { search: searchQuery.value }
    })
    availableUsers.value = response.data
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    availableUsers.value = []
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  availableUsers.value = []
}

const selectUser = (user) => {
  selectedUser.value = user
  showConfirmation.value = true
}

const confirmLink = (user) => {
  selectedUser.value = user
  showConfirmation.value = true
}

const cancelConfirmation = () => {
  showConfirmation.value = false
  selectedUser.value = null
}

const linkStudent = async () => {
  if (!selectedUser.value) return

  try {
    isLinking.value = true
    
    // Pegar dados do instrutor logado
    const userData = JSON.parse(sessionStorage.getItem('user'))
    const userId = userData.id
    
    // Buscar o instrutor pelo userId
    const instructorsResponse = await api.get('/instructors')
    const allInstructors = instructorsResponse.data
    const currentInstructor = allInstructors.find(
      inst => inst.userId === userId || inst.userId?._id === userId
    )
    
    if (!currentInstructor) {
      showNotification('error', 'Erro', 'Instrutor não encontrado')
      return
    }

    // Criar o registro de aluno vinculado
    await api.post('/students/link', {
      userId: selectedUser.value._id,
      instructorId: currentInstructor._id
    })

    // Emitir evento de sucesso
    emit('linked')
    
    // Fechar modal
    close()
  } catch (error) {
    console.error('Erro ao vincular aluno:', error)
    showNotification('error', 'Erro ao Vincular', error.response?.data?.message || 'Erro ao vincular aluno')
  } finally {
    isLinking.value = false
  }
}

const formatCPF = (cpf) => {
  if (!cpf) return ''
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const close = () => {
  emit('close')
}

onMounted(() => {
  // Não carrega nada inicialmente, apenas quando o usuário buscar
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.3s ease-out;
  --primary-color: #3b82f6;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --text-color: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  --bg-secondary: #f8fafc;
}

.modal-container.dark-mode {
  background: #1e1e2d;
  --primary-color: #667eea;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --border-color: #2d2d3f;
  --bg-secondary: #16213e;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary-color), #667eea);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.header-text h2 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.header-text p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--danger-color);
  color: white;
  transform: scale(1.05);
}

/* Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Search Section */
.search-section {
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--bg-secondary);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--text-muted);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: var(--danger-color);
  transform: scale(1.05);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-icon {
  font-size: 3rem;
  color: var(--primary-color);
}

.loading-state p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.empty-state p {
  margin: 0;
  color: var(--text-muted);
  max-width: 400px;
}

/* Users List */
.users-list {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.results-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.results-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
}

.user-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.user-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--border-color);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.user-email,
.user-cpf {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-action {
  flex-shrink: 0;
}

.link-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: var(--primary-color);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.link-btn:hover {
  background: #2563eb;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Confirmation Modal */
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.confirmation-modal {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: modalSlideUp 0.3s ease-out;
}

.modal-container.dark-mode .confirmation-modal {
  background: #1e1e2d;
}

.confirmation-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--warning-color);
  font-size: 2rem;
}

.confirmation-modal h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
}

.confirmation-modal p {
  margin: 0 0 2rem 0;
  color: var(--text-muted);
}

.confirmation-modal p strong {
  color: var(--text-color);
  font-weight: 600;
}

.confirmation-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: var(--bg-secondary);
  color: var(--text-color);
}

.btn-cancel:hover {
  background: var(--border-color);
}

.btn-confirm {
  background: var(--success-color);
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background: #059669;
  transform: scale(1.02);
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header {
    padding: 1.5rem;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .header-text h2 {
    font-size: 1.25rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .user-card {
    flex-direction: column;
    text-align: center;
  }

  .user-action {
    width: 100%;
  }

  .link-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
