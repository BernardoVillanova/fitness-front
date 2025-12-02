<template>
  <div :class="isDarkMode ? 'dark' : 'light'" class="student-management-modal">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-users"></i>
            Gerenciar Alunos - {{ gym?.name }}
          </h2>
          <button class="close-button" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Tabs -->
          <div class="tabs">
            <button 
              :class="['tab-button', { active: activeTab === 'current' }]"
              @click="activeTab = 'current'"
            >
              <i class="fas fa-users"></i>
              Alunos Vinculados ({{ currentStudents.length }})
            </button>
            <button 
              :class="['tab-button', { active: activeTab === 'add' }]"
              @click="activeTab = 'add'"
            >
              <i class="fas fa-user-plus"></i>
              Adicionar Alunos
            </button>
          </div>

          <!-- Tab: Alunos Atuais -->
          <div v-if="activeTab === 'current'" class="tab-content">
            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>Carregando alunos...</p>
            </div>

            <div v-else-if="currentStudents.length === 0" class="empty-state">
              <i class="fas fa-users icon"></i>
              <h3>Nenhum aluno vinculado</h3>
              <p>Esta academia ainda não possui alunos cadastrados.</p>
              <button class="add-first-button" @click="activeTab = 'add'">
                <i class="fas fa-user-plus"></i>
                Adicionar Primeiro Aluno
              </button>
            </div>

            <div v-else class="students-list">
              <div v-for="student in currentStudents" :key="student._id" class="student-card">
                <div class="student-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div class="student-info">
                  <h4 class="student-name">
                    {{ student.name }}
                  </h4>
                  <p class="student-email">{{ student.email }}</p>
                  <p class="student-phone" v-if="student.phone">
                    {{ student.phone }}
                  </p>
                  <div class="student-instructor" v-if="student.instructorId">
                    <i class="fas fa-user-tie"></i>
                    Instrutor Responsável
                  </div>
                </div>
                <div class="student-actions">
                  <button 
                    class="remove-button"
                    @click="confirmRemoveStudent(student)"
                    title="Remover aluno"
                  >
                    <i class="fas fa-user-minus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Adicionar Alunos -->
          <div v-if="activeTab === 'add'" class="tab-content">
            <div class="search-section">
              <div class="search-wrapper">
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Buscar alunos por nome ou email..."
                  class="search-input"
                  @input="searchStudents"
                >
                <i class="fas fa-search search-icon"></i>
              </div>
            </div>

            <div v-if="loadingSearch" class="loading-state">
              <div class="spinner"></div>
              <p>Buscando alunos...</p>
            </div>

            <div v-else-if="availableStudents.length === 0" class="empty-state">
              <i class="fas fa-search icon"></i>
              <h3>Nenhum aluno encontrado</h3>
              <p>Não foram encontrados alunos disponíveis para vinculação.</p>
            </div>

            <div v-else class="students-list">
              <div v-for="student in availableStudents" :key="student._id" class="student-card add-card">
                <div class="student-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div class="student-info">
                  <h4 class="student-name">
                    {{ student.name }}
                  </h4>
                  <p class="student-email">{{ student.email }}</p>
                  <p class="student-phone" v-if="student.phone">
                    {{ student.phone }}
                  </p>
                </div>
                <div class="student-actions">
                  <button 
                    class="add-button"
                    @click="addStudent(student)"
                    title="Adicionar aluno"
                  >
                    <i class="fas fa-user-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-button" @click="$emit('close')">
            Fechar
          </button>
          <button class="refresh-button" @click="$emit('close')">
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="confirm-overlay" @click="showConfirmModal = false">
      <div class="confirm-modal" @click.stop>
        <div class="confirm-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Confirmar Remoção</h3>
        <p>Tem certeza que deseja remover <strong>{{ studentToRemove?.name }}</strong> desta academia?</p>
        <div class="confirm-actions">
          <button class="cancel-button" @click="showConfirmModal = false">
            Cancelar
          </button>
          <button class="confirm-button" @click="removeStudent">
            <i class="fas fa-user-minus"></i>
            Remover
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useThemeStore } from '@/store/theme';
import { useAuthStore } from '@/store/auth';
import { storeToRefs } from 'pinia';
import { 
  getGymStudents, 
  addStudentToGym, 
  removeStudentFromGym, 
  getStudentsByInstructor
} from '@/api';
import { jwtDecode } from 'jwt-decode';

export default {
  name: 'StudentManagementModal',
  props: {
    gym: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'updated'],
  setup(props, { emit }) {
    const themeStore = useThemeStore();
    const authStore = useAuthStore();
    const { isDarkMode } = storeToRefs(themeStore);
    const { instructorId } = storeToRefs(authStore);

    const activeTab = ref('current');
    const loading = ref(false);
    const loadingSearch = ref(false);
    const currentStudents = ref([]);
    const availableStudents = ref([]);
    const availableInstructors = ref([]);
    const searchQuery = ref('');
    const showConfirmModal = ref(false);
    const studentToRemove = ref(null);

   
    const getInstructorId = () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          return decodedToken.instructorId || decodedToken.userId;
        }
        return null;
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
      }
    };

    const fetchCurrentStudents = async () => {
      if (!props.gym?._id) return;
      
      loading.value = true;
      try {
        const response = await getGymStudents(props.gym._id);
        currentStudents.value = response.data.students || [];
      } catch (error) {
        console.error('Erro ao buscar alunos da academia:', error);
        emit('notification', 'error', 'Erro', 'Erro ao carregar alunos da academia');
      } finally {
        loading.value = false;
      }
    };

    const fetchAvailableStudents = async () => {
      loadingSearch.value = true;
      try {
        const instructorId = getInstructorId();
        if (!instructorId) {
          console.warn('ID do instrutor não encontrado');
          availableStudents.value = [];
          return;
        }

       
        const response = await getStudentsByInstructor(instructorId);
        
       
        const currentStudentIds = currentStudents.value.map(s => s._id);
        const studentsData = response.data.students || response.data || [];
        
        availableStudents.value = studentsData
          .filter(student => {
            const matchesSearch = !searchQuery.value || 
              student.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
              student.email?.toLowerCase().includes(searchQuery.value.toLowerCase());
            
            return !currentStudentIds.includes(student._id) && matchesSearch;
          });
      } catch (error) {
        console.error('Erro ao buscar alunos do instrutor:', error);
        availableStudents.value = [];
        emit('notification', 'error', 'Erro', 'Erro ao buscar alunos disponíveis');
      } finally {
        loadingSearch.value = false;
      }
    };

    const searchStudents = () => {
      if (activeTab.value === 'add') {
        fetchAvailableStudents();
      }
    };

    const addStudent = async (student) => {
      try {
        const payload = {
          studentId: student._id,
          instructorId: instructorId.value
        };

        await addStudentToGym(props.gym._id, payload);
        
       
        await fetchCurrentStudents();
        await fetchAvailableStudents();
        
        const studentName = student.name || 'Aluno';
        emit('notification', 'success', 'Sucesso', `Aluno ${studentName} vinculado com sucesso!`);
        emit('updated');
      } catch (error) {
        console.error('Erro ao vincular aluno:', error);
        const message = error.response?.data?.message || 'Erro ao vincular aluno';
        emit('notification', 'error', 'Erro', message);
      }
    };

    const confirmRemoveStudent = (student) => {
      studentToRemove.value = student;
      showConfirmModal.value = true;
    };

    const removeStudent = async () => {
      if (!studentToRemove.value) return;

      try {
        await removeStudentFromGym(props.gym._id, studentToRemove.value._id);
        
       
        await fetchCurrentStudents();
        await fetchAvailableStudents();
        
        emit('notification', 'success', 'Sucesso', `Aluno ${studentToRemove.value.name} removido com sucesso!`);
        emit('updated');
        
        showConfirmModal.value = false;
        studentToRemove.value = null;
      } catch (error) {
        console.error('Erro ao remover aluno:', error);
        const message = error.response?.data?.message || 'Erro ao remover aluno';
        emit('notification', 'error', 'Erro', message);
      }
    };

    const updateInstructor = () => {
     
    };

   
    watch(() => props.gym, (newGym) => {
      if (newGym?.instructors) {
        availableInstructors.value = newGym.instructors;
      }
    }, { immediate: true });

   
    watch(activeTab, (newTab) => {
      if (newTab === 'add' && availableStudents.value.length === 0) {
        fetchAvailableStudents();
      }
    });

    onMounted(() => {
      if (props.show && props.gym?._id) {
        fetchCurrentStudents();
      }
    });

    return {
      isDarkMode,
      activeTab,
      loading,
      loadingSearch,
      currentStudents,
      availableStudents,
      availableInstructors,
      searchQuery,
      showConfirmModal,
      studentToRemove,
      addStudent,
      confirmRemoveStudent,
      removeStudent,
      updateInstructor,
      searchStudents,
    };
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

.light {
  --primary-color: #2563eb;
  --primary-gradient: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --background-color: #ffffff;
  --surface-color: #f8fafc;
  --card-background: rgba(255, 255, 255, 0.95);
  --text-color: #1e293b;
  --text-secondary: #64748b;
  --border-color: rgba(226, 232, 240, 0.8);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.15);
}

.dark {
  --primary-color: #8b5cf6;
  --primary-gradient: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --background-color: #0a0a0a;
  --surface-color: #1a1a1a;
  --card-background: rgba(42, 42, 42, 0.95);
  --text-color: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.7);
}

.student-management-modal {
  font-family: "Inter", sans-serif;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--surface-color);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.modal-title i {
  color: var(--primary-color);
}

.close-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: var(--surface-color);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: var(--danger-color);
  color: white;
  transform: scale(1.05);
}

.modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background: var(--surface-color);
}

.tab-button {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
}

.tab-button:hover {
  color: var(--text-color);
  background: rgba(var(--primary-color), 0.05);
}

.tab-button.active {
  color: var(--primary-color);
  background: var(--background-color);
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-gradient);
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--surface-color);
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color), 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-state .icon {
  font-size: 3rem;
  color: var(--text-secondary);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
}

.add-first-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.dark .add-first-button {
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.add-first-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.dark .add-first-button:hover {
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.5);
}

.add-first-button:active {
  transform: translateY(0);
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.student-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.student-card:hover {
  background: var(--card-background);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.student-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.student-email {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
}

.student-phone {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
}

.student-instructor {
  font-size: 0.75rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
}

.student-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.instructor-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--background-color);
  color: var(--text-color);
  font-size: 0.875rem;
  min-width: 150px;
}

.instructor-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.add-button,
.remove-button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.add-button {
  background: var(--success-color);
  color: white;
}

.add-button:hover {
  background: #059669;
  transform: scale(1.05);
}

.remove-button {
  background: var(--danger-color);
  color: white;
}

.remove-button:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-top: 1px solid var(--border-color);
  background: var(--surface-color);
}

.cancel-button,
.refresh-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cancel-button {
  background: var(--surface-color);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.cancel-button:hover {
  background: var(--card-background);
  color: var(--text-color);
}

.refresh-button {
  background: var(--primary-gradient);
  color: white;
}

.refresh-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

/* Confirm Modal */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.confirm-modal {
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow);
}

.confirm-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  color: var(--danger-color);
  font-size: 1.5rem;
}

.confirm-modal h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.confirm-modal p {
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.confirm-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--danger-color);
  color: white;
}

.confirm-button:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    max-height: 90vh;
  }

  .modal-header,
  .tab-content,
  .modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .student-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .student-actions {
    width: 100%;
    justify-content: space-between;
  }

  .instructor-select {
    flex: 1;
    min-width: auto;
  }
}
</style>