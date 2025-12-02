<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div :class="isDarkMode ? 'modal-dark' : 'modal-light'" class="modal-container">
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
        <button @click="close" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-content">
        <!-- Search Section -->
        <div class="search-section">
          <div class="search-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar alunos para adicionar..."
              class="search-input"
              @input="onSearchInput"
            >
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="stats-bar">
          <div class="stat-item">
            <div class="stat-icon-small">
              <i class="fas fa-users"></i>
            </div>
            <span class="stat-label">{{ assignedStudents.length }} alunos usando este plano</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-icon-small">
              <i class="fas fa-user-plus"></i>
            </div>
            <span class="stat-label">{{ filteredAvailableStudents.length }} disponíveis</span>
          </div>
        </div>

        <!-- Content Sections -->
        <div class="content-sections">
          <!-- Assigned Students -->
          <div class="section">
            <div class="section-header">
              <h3 class="section-title">Alunos com este plano</h3>
              <span class="count-badge">{{ assignedStudents.length }}</span>
            </div>
            
            <div v-if="loadingAssigned" class="loading-state">
              <div class="spinner"></div>
              <p>Carregando alunos...</p>
            </div>

            <div v-else-if="assignedStudents.length === 0" class="empty-state">
              <i class="fas fa-users fa-3x empty-icon"></i>
              <p class="empty-text">Nenhum aluno usando este plano</p>
              <p class="empty-hint">Busque e adicione alunos disponíveis abaixo</p>
            </div>

            <div v-else class="students-list">
              <div 
                v-for="student in assignedStudents" 
                :key="student._id"
                class="student-card assigned"
              >
                <div class="student-info">
                  <div class="student-avatar">
                    <img v-if="student.userId?.avatar" :src="student.userId.avatar" :alt="student.userId?.name">
                    <div v-else class="avatar-placeholder">
                      {{ getInitials(student.userId?.name || 'User') }}
                    </div>
                  </div>
                  <div class="student-details">
                    <h4 class="student-name">{{ student.userId?.name || 'Sem nome' }}</h4>
                    <p class="student-email">{{ student.userId?.email || 'Sem email' }}</p>
                    <span v-if="student.personalInfo?.weight" class="student-info-badge">
                      {{ student.personalInfo.weight }}kg
                    </span>
                  </div>
                </div>
                <button @click="removeStudent(student._id)" class="action-button remove-button" :disabled="processingStudents.includes(student._id)">
                  <div v-if="processingStudents.includes(student._id)" class="button-spinner"></div>
                  <i v-else class="fas fa-times"></i>
                  {{ processingStudents.includes(student._id) ? 'Removendo...' : 'Remover' }}
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

            <div v-if="loadingAvailable" class="loading-state">
              <div class="spinner"></div>
              <p>Carregando alunos disponíveis...</p>
            </div>

            <div v-else-if="filteredAvailableStudents.length === 0" class="empty-state">
              <i class="fas fa-search fa-3x empty-icon"></i>
              <p class="empty-text">
                {{ searchQuery ? 'Nenhum aluno encontrado' : 'Nenhum aluno disponível' }}
              </p>
              <p class="empty-hint">
                {{ searchQuery ? 'Tente buscar com outros termos' : 'Todos os alunos já estão usando planos' }}
              </p>
            </div>

            <div v-else class="students-list">
              <div 
                v-for="student in paginatedAvailableStudents" 
                :key="student._id"
                class="student-card available"
              >
                <div class="student-info">
                  <div class="student-avatar">
                    <img v-if="student.userId?.avatar" :src="student.userId.avatar" :alt="student.userId?.name">
                    <div v-else class="avatar-placeholder">
                      {{ getInitials(student.userId?.name || 'User') }}
                    </div>
                  </div>
                  <div class="student-details">
                    <h4 class="student-name">{{ student.userId?.name || 'Sem nome' }}</h4>
                    <p class="student-email">{{ student.userId?.email || 'Sem email' }}</p>
                    <span v-if="student.workoutPlanId" class="has-plan-badge">Tem outro plano</span>
                    <span v-if="student.personalInfo?.weight" class="student-info-badge">
                      {{ student.personalInfo.weight }}kg
                    </span>
                  </div>
                </div>
                <button @click="addStudent(student._id)" class="action-button add-button" :disabled="processingStudents.includes(student._id)">
                  <div v-if="processingStudents.includes(student._id)" class="button-spinner"></div>
                  <i v-else class="fas fa-plus"></i>
                  {{ processingStudents.includes(student._id) ? 'Adicionando...' : 'Adicionar' }}
                </button>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="filteredAvailableStudents.length > studentsPerPage" class="pagination">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="pagination-btn"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <span class="pagination-info">
                {{ currentPage }} de {{ totalPages }}
              </span>
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="pagination-btn"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";
import { API_URL } from '@/config';

export default {
  name: "ManageStudentsModal",
  props: {
    show: Boolean,
    plan: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'updated'],
  setup(props, { emit }) {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);

   
    const searchQuery = ref('');
    const assignedStudents = ref([]);
    const availableStudents = ref([]);
    const loadingAssigned = ref(false);
    const loadingAvailable = ref(false);
    const processingStudents = ref([]);
    const currentPage = ref(1);
    const studentsPerPage = 5;

   
    const filteredAvailableStudents = computed(() => {      
      if (!Array.isArray(availableStudents.value)) {
        return [];
      }
      
      if (availableStudents.value.length === 0) {
        return [];
      }
      
      if (!searchQuery.value || searchQuery.value.trim() === '') {
        return availableStudents.value;
      }
      
      const query = searchQuery.value.toLowerCase();
      
      const filtered = availableStudents.value.filter(student => {
        const matchesName = (student.userId?.name || '').toLowerCase().includes(query);
        const matchesEmail = (student.userId?.email || '').toLowerCase().includes(query);
        const matches = matchesName || matchesEmail;
        return matches;
      });
      
      return filtered;
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredAvailableStudents.value.length / studentsPerPage);
    });

    const paginatedAvailableStudents = computed(() => {
      const start = (currentPage.value - 1) * studentsPerPage;
      const end = start + studentsPerPage;
      return filteredAvailableStudents.value.slice(start, end);
    });

   
    watch(() => props.show, async (isOpen) => {
      
      if (isOpen && props.plan && props.plan._id) {
        
        await loadStudentData();
      } else {
        if (!isOpen) {
          searchQuery.value = '';
          currentPage.value = 1;
          processingStudents.value = [];
          availableStudents.value = [];
          assignedStudents.value = [];
        }
      }
    });

    watch(searchQuery, () => {
      currentPage.value = 1;
    });

   
    const getInitials = (name) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const onSearchInput = () => {
      console.log('Busca:', filteredAvailableStudents.value.length);
    };

    const loadStudentData = async () => {
      
      try {
       
       
        await loadAssignedStudents();
        
        await loadAvailableStudents();
        
      } catch (error) {
        console.error('=== ERROR LOADING STUDENT DATA ===', error);
      }
    };

    const loadAssignedStudents = async () => {
      try {
        loadingAssigned.value = true;
        
        const token = sessionStorage.getItem('token');
        const url = `${API_URL}/api/workout-plans/${props.plan._id}/students`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        
        if (response.ok) {
          const data = await response.json();
          
         
          assignedStudents.value = data || [];
        } else if (response.status === 404) {
          assignedStudents.value = [];
        } else {
          assignedStudents.value = [];
        }
        
      } catch (error) {
        assignedStudents.value = [];
      } finally {
        loadingAssigned.value = false;
      }
    };

    const loadAvailableStudents = async () => {
      try {
        loadingAvailable.value = true;
        
       
        const userData = JSON.parse(sessionStorage.getItem('user'));
        
        if (!userData || !userData.instructorId) {
          availableStudents.value = [];
          return;
        }
        
        const userId = userData.id;
        
        const instructorsResponse = await fetch(`${API_URL}/api/instructors`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!instructorsResponse.ok) {
          throw new Error('Erro ao buscar instrutores');
        }
        
        const allInstructors = await instructorsResponse.json();
        
       
        const currentInstructor = allInstructors.find(
          inst => inst.userId === userId || inst.userId?._id === userId
        );
        
        
        if (!currentInstructor) {
          availableStudents.value = [];
          return;
        }
        
        const instructorId = currentInstructor._id;
        
       
        const url = `${API_URL}/api/students/instructor/${instructorId}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const allStudents = await response.json();
                    
         
          const filtered = allStudents.filter(student => {
            const isAssigned = assignedStudents.value.some(assigned => assigned._id === student._id);
            return !isAssigned;
          });
                    
          availableStudents.value = filtered;
                    
        } else if (response.status === 404) {
          availableStudents.value = [];
        } else {
          availableStudents.value = [];
        }
        
      } catch (error) {
        availableStudents.value = [];
      } finally {
        loadingAvailable.value = false;
      }
    };

    const addStudent = async (studentId) => {
      try {
        
        processingStudents.value.push(studentId);
        
        const payload = { workoutPlanId: props.plan._id };
        const url = `${API_URL}/api/students/${studentId}/assign-workout-plan`;
        
        const token = sessionStorage.getItem('token');
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
                
        if (response.ok) {
          const data = await response.json();
          console.log('data: ', data);
          
          await loadStudentData();
          
          emit('updated');
        } else {
          console.error('Falhou aqui:', response.status);
        }
        
      } catch (error) {
        console.log('error: ', error);
      } finally {
        processingStudents.value = processingStudents.value.filter(id => id !== studentId);
      }
    };

    const removeStudent = async (studentId) => {
      try {        
        processingStudents.value.push(studentId);
        
        const payload = { workoutPlanId: null };
        const url = `${API_URL}/api/students/${studentId}/assign-workout-plan`;
        
        const token = sessionStorage.getItem('token');
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
                
        if (response.ok) {
          const data = await response.json();
          console.log('Resposta ok', data);
          
          await loadStudentData();          
          emit('updated');
        } else {
          console.error('Falhou', response.status);
        }
        
      } catch (error) {
        console.log('error: ', error);
      } finally {
        processingStudents.value = processingStudents.value.filter(id => id !== studentId);
      }
    };

    const close = () => {
      emit('close');
    };

    return {
      isDarkMode,
      searchQuery,
      assignedStudents,
      availableStudents,
      filteredAvailableStudents,
      paginatedAvailableStudents,
      loadingAssigned,
      loadingAvailable,
      processingStudents,
      currentPage,
      studentsPerPage,
      totalPages,
      getInitials,
      onSearchInput,
      addStudent,
      removeStudent,
      close
    };
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
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

/* Theme Variables */
.modal-light {
  --card-bg: #ffffff;
  --text-color: #0f172a;
  --text-muted: #64748b;
  --text-secondary: #475569;
  --border-color: #e2e8f0;
  --bg-secondary: #f8fafc;
  --icon-bg: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  --close-btn-bg: #f3f4f6;
  --close-btn-hover: #e5e7eb;
  --close-btn-color: #6b7280;
  --notice-bg: #f0f9ff;
  --notice-border: #bae6fd;
  --notice-icon-bg: #0ea5e9;
  --search-bg: #f8fafc;
  --search-border: #e2e8f0;
  --stat-bg: #f1f5f9;
  --student-card-bg: #ffffff;
  --student-card-border: #e2e8f0;
  --button-add-bg: #10b981;
  --button-add-hover: #059669;
  --button-remove-bg: #ef4444;
  --button-remove-hover: #dc2626;
  --empty-icon-color: #cbd5e1;
  --pagination-btn-bg: #f8fafc;
  --pagination-btn-hover: #e2e8f0;
}

.modal-dark {
  --card-bg: #1e1e2d;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --text-secondary: #6b7280;
  --border-color: #2d2d3f;
  --bg-secondary: #171723;
  --icon-bg: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --close-btn-bg: #2d2d3f;
  --close-btn-hover: #3f3f54;
  --close-btn-color: #9ca3af;
  --notice-bg: #1e1b4b;
  --notice-border: #3730a3;
  --notice-icon-bg: #6366f1;
  --search-bg: #0f172a;
  --search-border: #334155;
  --stat-bg: #0f172a;
  --student-card-bg: #1e293b;
  --student-card-border: #334155;
  --button-add-bg: #10b981;
  --button-add-hover: #059669;
  --button-remove-bg: #ef4444;
  --button-remove-hover: #dc2626;
  --empty-icon-color: #475569;
  --pagination-btn-bg: #0f172a;
  --pagination-btn-hover: #334155;
}

.modal-header {
  padding: 32px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.2;
}

.modal-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: var(--close-btn-bg);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--close-btn-color);
  flex-shrink: 0;
  font-size: 16px;
}

.close-btn:hover {
  background: var(--close-btn-hover);
  transform: scale(1.05);
}

.modal-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Search Section */
.search-section {
  padding: 24px 32px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.search-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid var(--search-border);
  border-radius: 12px;
  background: var(--search-bg);
  color: var(--text-color);
  font-size: 16px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: var(--text-muted);
}

/* Stats Bar */
.stats-bar {
  padding: 20px 32px;
  background: var(--stat-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon-small {
  width: 36px;
  height: 36px;
  background: var(--icon-bg);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 14px;
}

.stat-divider {
  width: 1px;
  height: 20px;
  background: var(--border-color);
}

/* Content Sections */
.content-sections {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.count-badge {
  background: var(--icon-bg);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

/* Loading and Empty States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  color: var(--empty-icon-color);
  margin-bottom: 8px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.empty-hint {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

/* Student Cards */
.students-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.student-card {
  background: var(--student-card-bg);
  border: 1px solid var(--student-card-border);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.student-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
}

.student-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.student-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--icon-bg);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.student-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.student-email {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.student-info-badge,
.has-plan-badge {
  display: inline-block;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
  margin-top: 4px;
}

.student-info-badge {
  background: var(--stat-bg);
  color: var(--text-secondary);
}

.has-plan-badge {
  background: #fbbf24;
  color: #92400e;
}

/* Action Buttons */
.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-button {
  background: var(--button-add-bg);
  color: white;
}

.add-button:not(:disabled):hover {
  background: var(--button-add-hover);
  transform: translateY(-1px);
}

.remove-button {
  background: var(--button-remove-bg);
  color: white;
}

.remove-button:not(:disabled):hover {
  background: var(--button-remove-hover);
  transform: translateY(-1px);
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--pagination-btn-bg);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.pagination-btn:not(:disabled):hover {
  background: var(--pagination-btn-hover);
  border-color: #3b82f6;
  color: var(--text-color);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 14px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.development-notice {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: var(--notice-bg);
  border: 1px solid var(--notice-border);
  border-radius: 16px;
  align-items: flex-start;
}

.notice-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--notice-icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
}

.notice-title {
  margin: 0 0 8px 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
}

.notice-description {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-container {
    margin: 16px;
    max-height: calc(100vh - 32px);
  }
  
  .modal-header {
    padding: 24px 20px;
  }
  
  .content-sections {
    padding: 20px;
  }
  
  .search-section {
    padding: 20px;
  }
  
  .stats-bar {
    padding: 16px 20px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .stat-item {
    justify-content: center;
  }
  
  .stat-divider {
    display: none;
  }
  
  .header-content {
    gap: 12px;
  }
  
  .icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
  
  .student-card {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .action-button {
    min-width: auto;
  }
  
  .development-notice {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .notice-icon {
    align-self: center;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 12px;
  }
  
  .modal-header {
    padding: 20px 16px;
  }
  
  .content-sections {
    padding: 16px;
  }
  
  .search-section {
    padding: 16px;
  }
  
  .stats-bar {
    padding: 12px 16px;
  }
  
  .development-notice {
    padding: 20px;
  }
}
</style>