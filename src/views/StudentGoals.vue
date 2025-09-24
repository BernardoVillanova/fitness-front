<template>
  <div class="student-goals">
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
      <div class="goals-list">
        <div v-for="goal in goals" :key="goal.id" class="goal-card">
          <div class="goal-header">
            <h3>{{ goal.title }}</h3>
            <span :class="['status-badge', goal.status]">{{ getStatusText(goal.status) }}</span>
          </div>
          <p class="goal-description">{{ goal.description }}</p>
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${goal.progress}%` }"></div>
            </div>
            <span class="progress-text">{{ goal.progress }}%</span>
          </div>
          <div class="goal-meta">
            <span><i class="fas fa-calendar"></i> {{ formatDate(goal.deadline) }}</span>
            <span><i class="fas fa-target"></i> {{ goal.current }}/{{ goal.target }} {{ goal.unit }}</span>
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
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'StudentGoals',
  setup() {
    const showCreateModal = ref(false);
    const showTemplates = ref(false);
    
    const goals = ref([
      {
        id: 1,
        title: 'Supino 100kg',
        description: 'Conseguir fazer supino reto com 100kg',
        current: 85,
        target: 100,
        unit: 'kg',
        progress: 85,
        status: 'active',
        deadline: '2024-03-15'
      }
    ]);

    const newGoal = reactive({
      title: '',
      description: '',
      current: 0,
      target: 0,
      unit: 'kg',
      deadline: ''
    });

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

    const createGoal = () => {
      goals.value.push({
        id: goals.value.length + 1,
        ...newGoal,
        progress: (newGoal.current / newGoal.target) * 100,
        status: 'active'
      });
      closeModal();
    };

    return {
      showCreateModal,
      showTemplates,
      goals,
      newGoal,
      getStatusText,
      formatDate,
      closeModal,
      createGoal
    };
  }
};
</script>

<style scoped>
.student-goals {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title i {
  color: var(--primary-color);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.goals-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.goal-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.goal-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: var(--success-bg);
  color: var(--success-color);
}

.goal-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-color);
}

.goal-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.goal-meta span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* CSS Variables */
:root {
  --primary-color: #6366f1;
  --success-color: #10b981;
  --success-bg: #d1fae5;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
</style>