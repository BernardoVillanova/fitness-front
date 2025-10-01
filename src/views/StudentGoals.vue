<template>
  <div :class="['student-goals', { 'dark-mode': isDarkMode }]">
    <StudentNavBar />
    <main class="main-content">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-bullseye"></i>
          Minhas Metas
        </h1>
        <p class="page-subtitle">Defina e acompanhe seus objetivos fitness</p>
      </div>

    <div class="goals-content">
      <!-- Quick Actions -->
      <div class="quick-actions">
        <button @click="showCreateModal = true" class="btn-primary">
          <i class="fas fa-plus"></i>
          Nova Meta
        </button>
        <button @click="showTemplates = true" class="btn-secondary">
          <i class="fas fa-list"></i>
          Usar Template
        </button>
      </div>

      <!-- Goals List -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando metas...</p>
      </div>

      <div v-else-if="goals.length === 0" class="empty-state">
        <i class="fas fa-bullseye"></i>
        <h3>Nenhuma meta definida</h3>
        <p>Crie sua primeira meta para começar a acompanhar seu progresso</p>
        <button @click="showCreateModal = true" class="btn-primary">
          <i class="fas fa-plus"></i>
          Criar Primeira Meta
        </button>
      </div>

      <div v-else class="goals-list">
        <div v-for="goal in goals" :key="goal.id" class="goal-card">
          <div class="goal-header">
            <div class="goal-title-section">
              <i class="fas fa-bullseye goal-icon"></i>
              <h3>{{ goal.title }}</h3>
            </div>
            <div class="goal-actions">
              <span :class="['status-badge', goal.status]">{{ getStatusText(goal.status) }}</span>
              <button @click="deleteGoal(goal.id)" class="btn-icon btn-danger" title="Excluir">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <p class="goal-description">{{ goal.description }}</p>
          <div class="goal-progress">
            <div class="progress-info">
              <span class="progress-label">Progresso</span>
              <span class="progress-text">{{ goal.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${goal.progress}%` }"></div>
            </div>
          </div>
          <div class="goal-meta">
            <div class="meta-item">
              <i class="fas fa-calendar-alt"></i>
              <span>{{ formatDate(goal.deadline) }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-chart-line"></i>
              <span>{{ goal.current }}/{{ goal.target }} {{ goal.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Goal Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Nova Meta</h2>
          <button @click="closeModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createGoal">
            <div class="form-group">
              <label>Título</label>
              <input v-model="newGoal.title" type="text" required class="form-input">
            </div>
            <div class="form-group">
              <label>Descrição</label>
              <textarea v-model="newGoal.description" class="form-textarea"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Valor Atual</label>
                <input v-model="newGoal.current" type="number" required class="form-input">
              </div>
              <div class="form-group">
                <label>Meta</label>
                <input v-model="newGoal.target" type="number" required class="form-input">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Unidade</label>
                <select v-model="newGoal.unit" class="form-select">
                  <option value="kg">kg</option>
                  <option value="reps">repetições</option>
                  <option value="min">minutos</option>
                </select>
              </div>
              <div class="form-group">
                <label>Prazo</label>
                <input v-model="newGoal.deadline" type="date" required class="form-input">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">Cancelar</button>
          <button @click="createGoal" class="btn-primary">Criar</button>
        </div>
      </div>
    </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/store/theme';
import StudentNavBar from '@/components/StudentNavBar.vue';
import api from '@/api';

const themeStore = useThemeStore();
const { isDarkMode } = storeToRefs(themeStore);

const showCreateModal = ref(false);
const showTemplates = ref(false);
const loading = ref(false);
const goals = ref([]);

const newGoal = reactive({
  title: '',
  description: '',
  current: 0,
  target: 0,
  unit: 'kg',
  deadline: ''
});

    const fetchGoals = async () => {
  loading.value = true;
  try {
    const response = await api.get('/student/goals');
    goals.value = response.data.map(goal => ({
      ...goal,
      progress: goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0
    }));
  } catch (error) {
    console.error('Erro ao buscar metas:', error);
    // No goals available
    goals.value = [];
  } finally {
    loading.value = false;
  }
};

const getStatusText = (status) => {
  const map = { 'active': 'Ativa', 'completed': 'Concluída', 'paused': 'Pausada' };
  return map[status] || 'Desconhecida';
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('pt-BR');
};

const closeModal = () => {
  showCreateModal.value = false;
  Object.assign(newGoal, {
    title: '',
    description: '',
    current: 0,
    target: 0,
    unit: 'kg',
    deadline: ''
  });
};

const createGoal = async () => {
  try {
    const goalData = {
      ...newGoal,
      progress: newGoal.target > 0 ? (newGoal.current / newGoal.target) * 100 : 0,
      status: 'active'
    };
    
    const response = await api.post('/student/goals', goalData);
    goals.value.push(response.data);
    closeModal();
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    // Fallback local
    goals.value.push({
      id: Date.now(),
      ...newGoal,
      progress: newGoal.target > 0 ? Math.round((newGoal.current / newGoal.target) * 100) : 0,
      status: 'active'
    });
    closeModal();
  }
};

// Função para uso futuro - editar metas
// eslint-disable-next-line no-unused-vars
const updateGoal = async (goalId, updates) => {
  try {
    await api.put(`/student/goals/${goalId}`, updates);
    await fetchGoals();
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
  }
};

const deleteGoal = async (goalId) => {
  if (!confirm('Deseja realmente excluir esta meta?')) return;
  
  try {
    await api.delete(`/student/goals/${goalId}`);
    goals.value = goals.value.filter(g => g.id !== goalId);
  } catch (error) {
    console.error('Erro ao excluir meta:', error);
  }
};

onMounted(() => {
  fetchGoals();
});
</script>

<style scoped>
.student-goals {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  max-width: 100%;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Detecta quando o navbar está colapsado globalmente */
body:has(.navbar-collapsed) .main-content {
  margin-left: 0 !important;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title i {
  color: var(--primary-color);
  font-size: 1.75rem;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .loading-state,
.dark-mode .empty-state {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.loading-state i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.loading-state p {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin: 0;
}

.empty-state i {
  font-size: 4rem;
  color: var(--text-muted);
  opacity: 0.3;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.empty-state p {
  color: var(--text-muted);
  margin: 0 0 2rem 0;
  font-size: 1rem;
}

.goals-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.goal-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .goal-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.goal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-color);
}

.dark-mode .goal-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.goal-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.goal-icon {
  color: var(--primary-color);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.goal-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.25rem;
  font-weight: 600;
}

.goal-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status-badge.completed {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
}

.status-badge.paused {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.btn-icon {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-muted);
}

.btn-icon:hover {
  background: var(--bg-secondary);
}

.btn-icon.btn-danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.goal-description {
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.goal-progress {
  margin-bottom: 1.25rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

.progress-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary-color);
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: var(--bg-secondary);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark-mode .progress-bar {
  background: rgba(255, 255, 255, 0.05);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-hover));
  transition: width 0.6s ease;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.goal-meta {
  display: flex;
  gap: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.meta-item i {
  color: var(--primary-color);
  font-size: 0.85rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.dark-mode .btn-primary {
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.dark-mode .btn-primary:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--card-bg);
  border-radius: 16px;
  max-width: 540px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-close {
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--bg-secondary);
  color: var(--text-color);
}

.modal-body {
  padding: 1.75rem;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem 1.75rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 0 0 16px 16px;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.625rem;
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-primary);
  color: var(--text-color);
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.dark-mode .form-input:focus,
.dark-mode .form-textarea:focus,
.dark-mode .form-select:focus {
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-title i {
    font-size: 1.4rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .quick-actions {
    flex-direction: column;
  }

  .quick-actions button {
    width: 100%;
  }

  .goals-list {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .goal-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .goal-actions {
    width: 100%;
    justify-content: space-between;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    max-width: 100%;
  }
}
</style>