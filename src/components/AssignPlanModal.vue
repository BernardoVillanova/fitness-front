<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Atribuir Plano de Exercícios</h2>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="plan-info">
          <h3>{{ plan?.name }}</h3>
          <div class="plan-details">
            <div class="detail-item">
              <span class="label">Divisões:</span>
              <span class="value">{{ plan?.divisions?.length || 0 }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Total de Exercícios:</span>
              <span class="value">{{ getTotalExercises() }}</span>
            </div>
          </div>
        </div>

        <div class="student-selection">
          <h4>Selecionar Aluno</h4>
          
          <div class="search-container">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar aluno por nome..."
              class="search-input"
            >
          </div>

          <div class="students-list" v-if="filteredStudents.length > 0">
            <div 
              v-for="student in paginatedStudents" 
              :key="student.id"
              @click="selectStudent(student)"
              :class="{ selected: selectedStudent?.id === student.id }"
              class="student-item"
            >
              <div class="student-avatar">
                <img 
                  v-if="student.avatar" 
                  :src="student.avatar" 
                  :alt="student.name"
                  class="avatar-img"
                >
                <div v-else class="avatar-placeholder">
                  {{ getInitials(student.name) }}
                </div>
              </div>
              
              <div class="student-info">
                <div class="student-name">{{ student.name }}</div>
                <div class="student-details">
                  <span class="student-email">{{ student.email }}</span>
                  <span class="student-status" :class="student.status">
                    {{ getStatusText(student.status) }}
                  </span>
                </div>
                <div v-if="student.currentPlan" class="current-plan">
                  Plano atual: {{ student.currentPlan }}
                </div>
              </div>
              
              <div class="selection-indicator">
                <div v-if="selectedStudent?.id === student.id" class="checkmark">✓</div>
              </div>
            </div>
          </div>

          <div class="pagination" v-if="totalPages > 1">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              Anterior
            </button>
            
            <span class="page-info">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Próximo
            </button>
          </div>

          <div v-else class="empty-state">
            <p>{{ searchQuery ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado' }}</p>
          </div>
        </div>

        <div class="assignment-options" v-if="selectedStudent">
          <h4>Opções de Atribuição</h4>
          
          <div class="option-group">
            <label class="checkbox-label">
              <input 
                v-model="assignmentOptions.replaceExisting" 
                type="checkbox"
              >
              <span class="checkmark-custom"></span>
              Substituir plano atual (se existir)
            </label>
          </div>
          
          <div class="option-group">
            <label class="checkbox-label">
              <input 
                v-model="assignmentOptions.notifyStudent" 
                type="checkbox"
              >
              <span class="checkmark-custom"></span>
              Notificar aluno por email
            </label>
          </div>

          <div class="form-group">
            <label class="form-label">Data de Início</label>
            <input 
              v-model="assignmentOptions.startDate" 
              type="date" 
              class="form-input"
              :min="todayDate"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Observações (opcional)</label>
            <textarea 
              v-model="assignmentOptions.notes" 
              class="form-textarea"
              rows="3"
              placeholder="Observações especiais para este aluno..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" @click="closeModal" class="btn-cancel">
          Cancelar
        </button>
        <button 
          @click="assignPlan" 
          class="btn-assign" 
          :disabled="!selectedStudent"
        >
          Atribuir Plano
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssignPlanModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    plan: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'assign'],
  data() {
    return {
      searchQuery: '',
      selectedStudent: null,
      currentPage: 1,
      studentsPerPage: 5,
      assignmentOptions: {
        replaceExisting: false,
        notifyStudent: true,
        startDate: '',
        notes: ''
      },
      students: [
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@email.com',
          avatar: '',
          status: 'active',
          currentPlan: 'Treino Básico'
        },
        {
          id: 2,
          name: 'Maria Santos',
          email: 'maria@email.com',
          avatar: '',
          status: 'active',
          currentPlan: null
        },
        {
          id: 3,
          name: 'Pedro Oliveira',
          email: 'pedro@email.com',
          avatar: '',
          status: 'inactive',
          currentPlan: 'Hipertrofia'
        },
        {
          id: 4,
          name: 'Ana Costa',
          email: 'ana@email.com',
          avatar: '',
          status: 'active',
          currentPlan: null
        },
        {
          id: 5,
          name: 'Carlos Ferreira',
          email: 'carlos@email.com',
          avatar: '',
          status: 'active',
          currentPlan: 'Funcional'
        },
        {
          id: 6,
          name: 'Lucia Rodrigues',
          email: 'lucia@email.com',
          avatar: '',
          status: 'active',
          currentPlan: null
        }
      ]
    }
  },
  computed: {
    filteredStudents() {
      return this.students.filter(student => 
        student.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedStudents() {
      const start = (this.currentPage - 1) * this.studentsPerPage;
      const end = start + this.studentsPerPage;
      return this.filteredStudents.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredStudents.length / this.studentsPerPage);
    },
    todayDate() {
      return new Date().toISOString().split('T')[0];
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.resetForm();
      }
    },
    searchQuery() {
      this.currentPage = 1;
    }
  },
  methods: {
    resetForm() {
      this.searchQuery = '';
      this.selectedStudent = null;
      this.currentPage = 1;
      this.assignmentOptions = {
        replaceExisting: false,
        notifyStudent: true,
        startDate: this.todayDate,
        notes: ''
      };
    },

    getTotalExercises() {
      if (!this.plan?.divisions) return 0;
      return this.plan.divisions.reduce((total, division) => 
        total + (division.exercises?.length || 0), 0
      );
    },

    getInitials(name) {
      return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },

    getStatusText(status) {
      const statusMap = {
        active: 'Ativo',
        inactive: 'Inativo',
        pending: 'Pendente'
      };
      return statusMap[status] || status;
    },

    selectStudent(student) {
      this.selectedStudent = student;
    },

    assignPlan() {
      if (!this.selectedStudent) return;

      const assignmentData = {
        planId: this.plan._id || this.plan.id,
        studentId: this.selectedStudent.id,
        options: { ...this.assignmentOptions }
      };

      this.$emit('assign', assignmentData);
    },

    closeModal() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
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
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--card-bg, #ffffff);
  color: var(--text-color, #333);
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 2px solid var(--border-color, #e9ecef);
  background: linear-gradient(135deg, var(--success-color, #28a745), var(--success-color, #28a745)aa);
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.close-btn:hover {
  opacity: 1;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

/* Plan Info */
.plan-info {
  background: var(--card-bg, #f8f9fa);
  border: 2px solid var(--border-color, #e9ecef);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.plan-info h3 {
  margin: 0 0 15px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--primary-color, #007bff);
}

.plan-details {
  display: flex;
  gap: 30px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item .label {
  font-size: 0.9rem;
  opacity: 0.7;
  font-weight: 500;
}

.detail-item .value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color, #007bff);
}

/* Student Selection */
.student-selection {
  margin-bottom: 30px;
}

.student-selection h4 {
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color, #333);
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color, #e9ecef);
  border-radius: 8px;
  background: var(--card-bg, #ffffff);
  color: var(--text-color, #333);
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color, #007bff);
}

.students-list {
  max-height: 300px;
  overflow-y: auto;
  border: 2px solid var(--border-color, #e9ecef);
  border-radius: 10px;
  background: var(--card-bg, #ffffff);
}

.student-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color, #e9ecef);
  transition: all 0.3s ease;
  position: relative;
}

.student-item:last-child {
  border-bottom: none;
}

.student-item:hover {
  background: var(--primary-color, #007bff)10;
}

.student-item.selected {
  background: var(--primary-color, #007bff)20;
  border-left: 4px solid var(--primary-color, #007bff);
}

.student-avatar {
  flex-shrink: 0;
}

.avatar-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color, #e9ecef);
}

.avatar-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-color, #007bff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color, #333);
  margin-bottom: 5px;
}

.student-details {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 5px;
}

.student-email {
  font-size: 0.9rem;
  opacity: 0.7;
}

.student-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.student-status.active {
  background: #d4edda;
  color: #155724;
}

.student-status.inactive {
  background: #f8d7da;
  color: #721c24;
}

.student-status.pending {
  background: #fff3cd;
  color: #856404;
}

.current-plan {
  font-size: 0.85rem;
  opacity: 0.7;
  font-style: italic;
}

.selection-indicator {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkmark {
  width: 24px;
  height: 24px;
  background: var(--success-color, #28a745);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding: 15px 20px;
  background: var(--card-bg, #f8f9fa);
  border-radius: 8px;
}

.pagination-btn {
  background: var(--primary-color, #007bff);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  background: var(--secondary-color, #6c757d);
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color, #333);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--secondary-color, #6c757d);
  border: 2px dashed var(--border-color, #e9ecef);
  border-radius: 10px;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
  font-style: italic;
}

.assignment-options {
  background: var(--card-bg, #f8f9fa);
  border: 2px solid var(--border-color, #e9ecef);
  border-radius: 12px;
  padding: 20px;
}

.assignment-options h4 {
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color, #333);
}

.option-group {
  margin-bottom: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color, #e9ecef);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark-custom {
  background: var(--primary-color, #007bff);
  border-color: var(--primary-color, #007bff);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color, #333);
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color, #e9ecef);
  border-radius: 8px;
  background: var(--card-bg, #ffffff);
  color: var(--text-color, #333);
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color, #007bff);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding: 24px 32px;
  border-top: 2px solid var(--border-color, #e9ecef);
  background: var(--card-bg, #f8f9fa);
}

.btn-cancel,
.btn-assign {
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-cancel {
  background: transparent;
  color: var(--secondary-color, #6c757d);
  border: 2px solid var(--secondary-color, #6c757d);
}

.btn-cancel:hover {
  background: var(--secondary-color, #6c757d);
  color: white;
}

.btn-assign {
  background: var(--success-color, #28a745);
  color: white;
  border: 2px solid var(--success-color, #28a745);
}

.btn-assign:hover:not(:disabled) {
  background: #218838;
  border-color: #218838;
  transform: translateY(-1px);
}

.btn-assign:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95vw;
    margin: 10px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .plan-details {
    flex-direction: column;
    gap: 15px;
  }
  
  .student-item {
    padding: 12px 15px;
  }
  
  .student-details {
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
  }
  
  .modal-actions {
    flex-direction: column;
    padding: 20px;
  }
  
  .btn-cancel,
  .btn-assign {
    width: 100%;
  }
}
</style>