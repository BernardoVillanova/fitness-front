<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div :class="isDarkMode ? 'modal-dark' : 'modal-light'" class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="header-text">
            <h2 class="modal-title">Gerenciar Alunos</h2>
            <p class="modal-subtitle">{{ plan.name }}</p>
          </div>
        </div>
        <button @click="close" class="close-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-icon-small">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <span class="stat-label">{{ assignedStudents.length }} alunos usando</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon-small">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
            </svg>
          </div>
          <span class="stat-label">{{ plan.divisions?.length || 0 }} divisões</span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-wrapper">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar alunos para adicionar..."
            class="search-input"
          >
        </div>
      </div>

      <!-- Content Area -->
      <div class="modal-content">
        <!-- Assigned Students -->
        <div class="section">
          <div class="section-header">
            <h3 class="section-title">Alunos com este plano</h3>
            <span class="count-badge">{{ assignedStudents.length }}</span>
          </div>
          
          <div v-if="assignedStudents.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <p class="empty-text">Nenhum aluno usando este plano</p>
            <p class="empty-hint">Busque e adicione alunos abaixo</p>
          </div>

          <div v-else class="students-list">
            <div 
              v-for="student in assignedStudents" 
              :key="student._id"
              class="student-card assigned"
            >
              <div class="student-info">
                <div class="student-avatar">
                  <img v-if="student.profileImage" :src="student.profileImage" :alt="student.name">
                  <div v-else class="avatar-placeholder">
                    {{ getInitials(student.name) }}
                  </div>
                </div>
                <div class="student-details">
                  <h4 class="student-name">{{ student.name }}</h4>
                  <p class="student-email">{{ student.email }}</p>
                </div>
              </div>
              <button @click="removeStudent(student._id)" class="action-button remove-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Remover
              </button>
            </div>
          </div>
        </div>

        <!-- Available Students -->
        <div class="section">
          <div class="section-header">
            <h3 class="section-title">Adicionar alunos</h3>
            <span class="count-badge">{{ filteredAvailableStudents.length }}</span>
          </div>

          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Carregando alunos...</p>
          </div>

          <div v-else-if="filteredAvailableStudents.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <p class="empty-text">Nenhum aluno disponível</p>
            <p class="empty-hint">{{ searchQuery ? 'Tente outra busca' : 'Todos os alunos já estão usando este plano' }}</p>
          </div>

          <div v-else class="students-list">
            <div 
              v-for="student in filteredAvailableStudents" 
              :key="student._id"
              class="student-card available"
            >
              <div class="student-info">
                <div class="student-avatar">
                  <img v-if="student.profileImage" :src="student.profileImage" :alt="student.name">
                  <div v-else class="avatar-placeholder">
                    {{ getInitials(student.name) }}
                  </div>
                </div>
                <div class="student-details">
                  <h4 class="student-name">{{ student.name }}</h4>
                  <p class="student-email">{{ student.email }}</p>
                  <span v-if="student.workoutPlanId" class="has-plan-badge">Tem plano</span>
                </div>
              </div>
              <button @click="addStudent(student._id)" class="action-button add-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";

export default {
  name: "ManageStudentsModal",
  props: {
    show: Boolean,
    plan: {
      type: Object,
      required: true
    }
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    return { isDarkMode };
  },
  data() {
    return {
      searchQuery: '',
      assignedStudents: [],
      availableStudents: [],
      loading: false
    }
  },
  computed: {
    filteredAvailableStudents() {
      const assignedIds = this.assignedStudents.map(s => s._id);
      const available = this.availableStudents.filter(s => !assignedIds.includes(s._id));
      
      if (!this.searchQuery) return available;
      
      const query = this.searchQuery.toLowerCase();
      return available.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.fetchStudents();
      }
    }
  },
  methods: {
    async fetchStudents() {
      this.loading = true;
      try {
        // Buscar alunos do plano
        const assignedResponse = await fetch(`/api/workout/workout-plans/${this.plan._id}/students`);
        if (assignedResponse.ok) {
          this.assignedStudents = await assignedResponse.json();
        }

        // Buscar todos os alunos disponíveis
        const allStudentsResponse = await fetch('/api/students');
        if (allStudentsResponse.ok) {
          this.availableStudents = await allStudentsResponse.json();
        }
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      } finally {
        this.loading = false;
      }
    },

    async addStudent(studentId) {
      try {
        const response = await fetch(`/api/students/${studentId}/assign-workout-plan`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ workoutPlanId: this.plan._id })
        });

        if (response.ok) {
          await this.fetchStudents();
          this.$emit('updated');
        } else {
          throw new Error('Erro ao adicionar aluno');
        }
      } catch (error) {
        console.error('Erro ao adicionar aluno:', error);
        alert('Erro ao adicionar aluno: ' + error.message);
      }
    },

    async removeStudent(studentId) {
      if (!confirm('Deseja remover este aluno do plano?')) return;

      try {
        const response = await fetch(`/api/workout/workout-plans/${this.plan._id}/students/${studentId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await this.fetchStudents();
          this.$emit('updated');
        } else {
          throw new Error('Erro ao remover aluno');
        }
      } catch (error) {
        console.error('Erro ao remover aluno:', error);
        alert('Erro ao remover aluno: ' + error.message);
      }
    },

    getInitials(name) {
      return name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    },

    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal-container {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: var(--bg-primary);
  border-radius: 24px;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-primary);
}

/* Theme Variables */
.modal-light {
  --bg-primary: #ffffff;
  --bg-secondary: rgba(248, 250, 252, 0.9);
  --bg-tertiary: rgba(255, 255, 255, 0.95);
  
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  
  --border-primary: rgba(226, 232, 240, 0.8);
  --border-accent: rgba(37, 99, 235, 0.3);
  
  --gradient-primary: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-danger: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 20px 25px -5px rgba(37, 99, 235, 0.15);
}

.modal-dark {
  --bg-primary: #1a1a1a;
  --bg-secondary: rgba(15, 16, 23, 0.8);
  --bg-tertiary: rgba(26, 32, 44, 0.9);
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  
  --border-primary: rgba(51, 65, 85, 0.6);
  --border-accent: rgba(139, 92, 246, 0.3);
  
  --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-danger: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px -5px rgba(139, 92, 246, 0.3);
}

/* Header */
.modal-header {
  padding: 32px;
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.close-button {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.close-button:hover {
  background: var(--gradient-danger);
  border-color: transparent;
  color: white;
  transform: scale(1.05);
}

/* Stats Bar */
.stats-bar {
  padding: 16px 32px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: var(--border-primary);
}

/* Search Section */
.search-section {
  padding: 20px 32px;
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: var(--text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-input:focus {
  outline: none;
  border-color: var(--border-accent);
  background: var(--bg-primary);
}

/* Content */
.modal-content {
  padding: 24px 32px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.count-badge {
  background: var(--gradient-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Students List */
.students-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.student-card:hover {
  transform: translateX(4px);
  border-color: var(--border-accent);
  box-shadow: var(--shadow-md);
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.student-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.student-email {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.has-plan-badge {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(251, 146, 60, 0.1);
  border: 1px solid rgba(251, 146, 60, 0.3);
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #f59e0b;
  margin-top: 4px;
}

.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-button {
  background: var(--gradient-success);
  color: white;
}

.add-button:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.remove-button {
  background: var(--gradient-danger);
  color: white;
}

.remove-button:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

/* Empty State */
.empty-state {
  padding: 48px 24px;
  text-align: center;
  color: var(--text-tertiary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-text {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.empty-hint {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

/* Loading State */
.loading-state {
  padding: 48px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-primary);
  border-top-color: var(--text-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header,
  .search-section,
  .modal-content {
    padding: 20px;
  }

  .stats-bar {
    padding: 12px 20px;
  }

  .student-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
