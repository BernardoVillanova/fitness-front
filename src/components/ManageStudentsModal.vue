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

    // State
    const searchQuery = ref('');
    const assignedStudents = ref([]);
    const availableStudents = ref([]);
    const loadingAssigned = ref(false);
    const loadingAvailable = ref(false);
    const processingStudents = ref([]);
    const currentPage = ref(1);
    const studentsPerPage = 5;

    // Computed
    const filteredAvailableStudents = computed(() => {
      console.log('\n🔍 Computing filteredAvailableStudents...');
      console.log('🔍 Search query:', searchQuery.value || '<EMPTY>');
      console.log('🔍 Available students:', availableStudents.value);
      console.log('🔍 Available students length:', availableStudents.value.length);
      console.log('🔍 Available students type:', typeof availableStudents.value);
      console.log('🔍 Is available students array?', Array.isArray(availableStudents.value));
      
      if (!Array.isArray(availableStudents.value)) {
        console.log('🔍 ⚠️ Available students is not an array!');
        return [];
      }
      
      if (availableStudents.value.length === 0) {
        console.log('🔍 ⚠️ Available students array is empty!');
        return [];
      }
      
      if (!searchQuery.value || searchQuery.value.trim() === '') {
        console.log('No search query, returning all', availableStudents.value.length, 'available students');
        console.log('Students being returned:', availableStudents.value.map(s => s.userId?.name || 'Unnamed'));
        return availableStudents.value;
      }
      
      const query = searchQuery.value.toLowerCase();
      console.log('🔍 Filtering with query:', query);
      
      const filtered = availableStudents.value.filter(student => {
        const matchesName = (student.userId?.name || '').toLowerCase().includes(query);
        const matchesEmail = (student.userId?.email || '').toLowerCase().includes(query);
        const matches = matchesName || matchesEmail;
        console.log(`Student ${student.userId?.name}: name match=${matchesName}, email match=${matchesEmail}, final=${matches}`);
        return matches;
      });
      
      console.log('🔍 Filtered students:', filtered);
      console.log('🔍 Filtered count:', filtered.length);
      console.log('=== END filteredAvailableStudents ===\n');
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

    // Watch
    watch(() => props.show, async (isOpen) => {
      console.log('\n=== MODAL SHOW STATE CHANGED ===');
      console.log('📺 Modal show state:', isOpen);
      console.log('📍 Plan object:', props.plan);
      console.log('📍 Plan ID:', props.plan?._id);
      console.log('📍 Plan name:', props.plan?.name);
      
      if (isOpen && props.plan && props.plan._id) {
        console.log('\n🚀 MODAL OPENED - STARTING DATA LOAD');
        console.log('📈 Available students BEFORE load:', availableStudents.value.length);
        console.log('📈 Assigned students BEFORE load:', assignedStudents.value.length);
        
        // Aguardar o carregamento de dados
        console.log('🔄 Awaiting loadStudentData...');
        await loadStudentData();
        console.log('🏁 loadStudentData completed!');
        
        console.log('\n📈 FINAL RESULTS AFTER LOAD:');
        console.log('📈 Available students AFTER load:', availableStudents.value.length);
        console.log('📈 Assigned students AFTER load:', assignedStudents.value.length);
        console.log('📈 Available students names:', availableStudents.value.map(s => s.userId?.name || 'Unnamed'));
        console.log('📈 Assigned students names:', assignedStudents.value.map(s => s.userId?.name || 'Unnamed'));
      } else {
        console.log('\n📴 MODAL CLOSED OR NO PLAN - RESETTING');
        if (!isOpen) {
          console.log('🔄 Resetting modal state...');
          searchQuery.value = '';
          currentPage.value = 1;
          processingStudents.value = [];
          availableStudents.value = [];
          assignedStudents.value = [];
          console.log('🔄 State reset completed');
        } else {
          console.log('⚠️ Modal opened but no plan or plan ID!');
        }
      }
      console.log('=== END MODAL STATE CHANGE ===\n');
    });

    watch(searchQuery, () => {
      console.log('🔍 Search query changed to:', searchQuery.value);
      currentPage.value = 1;
      console.log('🔍 Reset currentPage to 1');
    });

    // Methods
    const getInitials = (name) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const onSearchInput = () => {
      console.log('🔍 Search input changed:', searchQuery.value);
      console.log('🔍 Available students count:', availableStudents.value.length);
      console.log('🔍 Filtered students count:', filteredAvailableStudents.value.length);
    };

    const loadStudentData = async () => {
      console.log('=== LOADING STUDENT DATA ===');
      console.log('Plan object:', props.plan);
      console.log('Plan ID:', props.plan._id);
      console.log('Plan name:', props.plan.name);
      
      try {
        // Load assigned students first, then available students
        // This ensures proper filtering
        console.log('🔄 Step 1: Loading assigned students...');
        await loadAssignedStudents();
        
        console.log('🔄 Step 2: Loading available students...');
        await loadAvailableStudents();
        
        console.log('=== STUDENT DATA LOADED SUCCESSFULLY ===');
        console.log('📊 Final summary:');
        console.log(`📊 Assigned students: ${assignedStudents.value.length}`);
        console.log(`📊 Available students: ${availableStudents.value.length}`);
      } catch (error) {
        console.error('=== ERROR LOADING STUDENT DATA ===', error);
      }
    };

    const loadAssignedStudents = async () => {
      try {
        loadingAssigned.value = true;
        console.log('🔍 Fetching assigned students for plan:', props.plan._id);
        
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:3000/api/workout-plans/${props.plan._id}/students`;
        console.log('📡 Making request to:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Assigned students response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Assigned students response data:', data);
          console.log('✅ Type of response data:', typeof data);
          console.log('✅ Is array?', Array.isArray(data));
          
          // A resposta vem diretamente como array de alunos
          assignedStudents.value = data || [];
          console.log('✅ Final assignedStudents array:', assignedStudents.value);
          console.log('✅ assignedStudents length:', assignedStudents.value.length);
        } else if (response.status === 404) {
          console.log('⚠️ 404 - No students found for this plan');
          assignedStudents.value = [];
        } else {
          console.error('❌ Failed to fetch assigned students:', response.status);
          assignedStudents.value = [];
        }
        
      } catch (error) {
        console.error('❌ Error loading assigned students:', error);
        console.log('⚠️ Setting empty array due to error');
        assignedStudents.value = [];
      } finally {
        loadingAssigned.value = false;
        console.log('🏁 loadingAssigned set to false');
      }
    };

    const loadAvailableStudents = async () => {
      try {
        console.log('\n=== 🚀 STARTING LOAD AVAILABLE STUDENTS ===');
        loadingAvailable.value = true;
        
        // Pegar dados do usuário logado
        const userData = JSON.parse(sessionStorage.getItem('user'));
        console.log('DEBUG 1: UserData from session:', userData);
        
        if (!userData || !userData.instructorId) {
          console.error('DEBUG ERROR: Dados do instrutor não encontrados no token');
          availableStudents.value = [];
          return;
        }
        
        const userId = userData.id;
        console.log('� User ID:', userId);
        
        // Buscar o instrutor pelo userId usando a lista de instrutores
        console.log('🔍 Fetching instructors...');
        const instructorsResponse = await fetch('http://localhost:3000/api/instructors', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!instructorsResponse.ok) {
          throw new Error('Erro ao buscar instrutores');
        }
        
        const allInstructors = await instructorsResponse.json();
        console.log('� All instructors:', allInstructors);
        
        // Encontrar o instrutor que corresponde ao userId
        const currentInstructor = allInstructors.find(
          inst => inst.userId === userId || inst.userId?._id === userId
        );
        
        console.log('DEBUG 2: Looking for instructor with userId:', userId);
        console.log('DEBUG 3: Available instructors:', allInstructors.map(i => ({ id: i._id, userId: i.userId })));
        console.log('DEBUG 4: Found instructor:', currentInstructor);
        
        if (!currentInstructor) {
          console.log('DEBUG ERROR: Instrutor não encontrado para o userId:', userId);
          availableStudents.value = [];
          return;
        }
        
        const instructorId = currentInstructor._id;
        console.log('🔍 Instructor ID encontrado:', instructorId);
        
        // Buscar apenas alunos deste instrutor usando a rota específica
        const url = `http://localhost:3000/api/students/instructor/${instructorId}`;
        console.log('📡 Making fetch request to:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('\n📬 RESPONSE RECEIVED!');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
          console.log('DEBUG 5: Parsing JSON response...');
          const allStudents = await response.json();
          
          console.log('DEBUG 6: Raw response data:', allStudents);
          console.log('DEBUG 7: Response type:', typeof allStudents);
          console.log('DEBUG 8: Is response an array:', Array.isArray(allStudents));
          console.log('DEBUG 9: Response length:', allStudents?.length || 'NO LENGTH PROPERTY');
          
          if (Array.isArray(allStudents) && allStudents.length > 0) {
            console.log('DEBUG 10: First student sample:', allStudents[0]);
          }
          
          console.log('DEBUG 11: Current assigned students for filtering:', assignedStudents.value);
          console.log('DEBUG 12: Assigned students count:', assignedStudents.value.length);
          
          // Filter out students already assigned to this plan
          const filtered = allStudents.filter(student => {
            const isAssigned = assignedStudents.value.some(assigned => assigned._id === student._id);
            console.log(`DEBUG FILTER: Student ${student.userId?.name || student.name} (${student._id}) - Already assigned: ${isAssigned ? 'YES' : 'NO'}`);
            return !isAssigned;
          });
          
          console.log('DEBUG 13: Filtered students:', filtered);
          console.log('DEBUG 14: Filtered count:', filtered.length);
          
          availableStudents.value = filtered;
          
          console.log('DEBUG 15: availableStudents.value set to:', availableStudents.value);
          console.log('DEBUG 16: availableStudents.value length:', availableStudents.value.length);
          
        } else if (response.status === 404) {
          console.log('DEBUG ERROR: 404 - No students found for this instructor');
          availableStudents.value = [];
        } else {
          console.error('DEBUG ERROR: HTTP ERROR!');
          console.error('Status:', response.status);
          console.error('Status text:', response.statusText);
          availableStudents.value = [];
        }
        
      } catch (error) {
        console.error('DEBUG FATAL ERROR IN loadAvailableStudents:');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Full error object:', error);
        availableStudents.value = [];
      } finally {
        loadingAvailable.value = false;
        console.log('loadingAvailable set to false');
        console.log('=== END LOAD AVAILABLE STUDENTS ===');
      }
    };

    const addStudent = async (studentId) => {
      try {
        console.log('➕ Adding student to plan:', { studentId, planId: props.plan._id });
        
        processingStudents.value.push(studentId);
        console.log('⏳ Added to processing:', processingStudents.value);
        
        const payload = { workoutPlanId: props.plan._id };
        const url = `http://localhost:3000/api/students/${studentId}/assign-workout-plan`;
        console.log('📡 POST request to:', url);
        console.log('📡 Payload:', payload);
        
        const token = sessionStorage.getItem('token');
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        console.log('✅ Student assignment response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Student assignment response data:', data);
          
          console.log('🔄 Reloading student data after assignment...');
          await loadStudentData();
          
          console.log('📢 Emitting update event to parent');
          emit('updated');
        } else {
          console.error('❌ Failed to assign student:', response.status);
        }
        
      } catch (error) {
        console.error('❌ Error adding student to plan:', error);
        console.error('❌ Error response:', error.response);
        console.error('❌ Error status:', error.response?.status);
        console.error('❌ Error data:', error.response?.data);
      } finally {
        processingStudents.value = processingStudents.value.filter(id => id !== studentId);
        console.log('🏁 Removed from processing:', processingStudents.value);
      }
    };

    const removeStudent = async (studentId) => {
      try {
        console.log('➖ Removing student from plan:', { studentId, planId: props.plan._id });
        
        processingStudents.value.push(studentId);
        console.log('⏳ Added to processing:', processingStudents.value);
        
        const payload = { workoutPlanId: null };
        const url = `http://localhost:3000/api/students/${studentId}/assign-workout-plan`;
        console.log('📡 POST request to:', url);
        console.log('📡 Payload:', payload);
        
        const token = sessionStorage.getItem('token');
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        console.log('✅ Student removal response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Student removal response data:', data);
          
          console.log('🔄 Reloading student data after removal...');
          await loadStudentData();
          
          console.log('📢 Emitting update event to parent');
          emit('updated');
        } else {
          console.error('❌ Failed to remove student:', response.status);
        }
        
      } catch (error) {
        console.error('❌ Error removing student from plan:', error);
        console.error('❌ Error response:', error.response);
        console.error('❌ Error status:', error.response?.status);
        console.error('❌ Error data:', error.response?.data);
      } finally {
        processingStudents.value = processingStudents.value.filter(id => id !== studentId);
        console.log('🏁 Removed from processing:', processingStudents.value);
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