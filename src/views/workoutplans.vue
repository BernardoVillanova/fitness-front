<template>
  <div :class="isDarkMode ? 'dashboard-dark' : 'dashboard-light'" class="dashboard-container">
    <DashboardNavBar />
    
    <NotificationModal 
      v-model:visible="notification.visible"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
    />
    
    <main class="dashboard-main">
      <!-- Floating Header -->
      <div class="floating-header">
        <div class="header-content">
          <div class="header-left">
            <div class="title-section">
              <h1 class="main-title">
                <span class="title-gradient">Planos de Exercícios</span>
              </h1>
              <p class="subtitle">Gerencie e organize todos os treinos dos seus alunos com elegância</p>
            </div>
          </div>
          
          <div class="header-right">
            <button @click="openCreateModal" class="create-button">
              <div class="button-glow"></div>
              <div class="button-content">
                <svg class="button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                <span>Criar Plano</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <!-- Enhanced Stats Cards -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card stat-primary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <div class="stat-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <div class="stat-trend">
                    <span class="trend-value">+12%</span>
                  </div>
                </div>
                <div class="stat-body">
                  <div class="stat-number">{{ workoutPlans.length }}</div>
                  <div class="stat-label">Total de Planos</div>
                </div>
              </div>
            </div>

            <div class="stat-card stat-secondary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <div class="stat-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div class="stat-trend">
                    <span class="trend-value">{{ students.length > 0 ? Math.round((totalStudentsWithPlans / students.length) * 100) : 0 }}%</span>
                  </div>
                </div>
                <div class="stat-body">
                  <div class="stat-number">{{ totalStudentsWithPlans }}</div>
                  <div class="stat-label">Alunos com Planos</div>
                </div>
              </div>
            </div>

            <div class="stat-card stat-tertiary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <div class="stat-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div class="stat-trend">
                    <span class="trend-value">{{ workoutPlans.length > 0 ? Math.round(totalExercisesCount / workoutPlans.length) : 0 }}/plano</span>
                  </div>
                </div>
                <div class="stat-body">
                  <div class="stat-number">{{ totalExercisesCount }}</div>
                  <div class="stat-label">Total Exercícios</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Filter Section -->
        <div class="filter-section">
          <div class="filter-card">
            <div class="search-area">
              <div class="search-wrapper">
                <div class="search-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                </div>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Pesquisar planos de exercício..."
                  class="search-input"
                >
                <div class="search-bg"></div>
              </div>
            </div>
            
            <div class="filter-tabs">
              <button 
                v-for="filter in filters"
                :key="filter.key"
                @click="filterBy = filter.key"
                :class="{ active: filterBy === filter.key }"
                class="filter-tab"
              >
                <span class="tab-text">{{ filter.label }}</span>
                <span v-if="filter.count" class="tab-count">{{ filter.count }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Enhanced Plans Grid - LAYOUT MELHORADO -->
        <div class="plans-section">
          <div class="plans-grid">
            <div 
              v-for="(plan, index) in paginatedPlans" 
              :key="plan._id || plan.id" 
              class="plan-card"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="card-background"></div>
              
              <!-- Header com melhor organização -->
              <div class="plan-header">
                <div class="plan-title-section">
                  <h3 class="plan-name">{{ plan.name }}</h3>
                  <div class="plan-meta">
                    <span class="plan-date">{{ formatDate(plan.createdAt) }}</span>
                  </div>
                </div>
                
                <div class="plan-actions-header">
                  <button @click="manageStudents(plan)" class="action-btn manage-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span v-if="plan.studentsCount > 0">{{ plan.studentsCount }} Alunos</span>
                    <span v-else>Vincular Alunos</span>
                  </button>
                  
                  <button @click="confirmDeletePlan(plan)" class="action-btn delete-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Excluir
                  </button>
                </div>
              </div>

              <!-- Estatísticas principais reorganizadas -->
              <div class="plan-stats-main">
                <div class="stat-item-main">
                  <div class="stat-icon-main students-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div class="stat-details">
                    <div class="stat-number-main">{{ plan.studentsCount || plan.assignedStudents?.length || 0 }}</div>
                    <div class="stat-label-main">Alunos</div>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="stat-item-main">
                  <div class="stat-icon-main divisions-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </div>
                  <div class="stat-details">
                    <div class="stat-number-main">{{ plan.divisions?.length || 0 }}</div>
                    <div class="stat-label-main">Divisões</div>
                  </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="stat-item-main">
                  <div class="stat-icon-main exercises-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div class="stat-details">
                    <div class="stat-number-main">{{ getTotalExercises(plan) }}</div>
                    <div class="stat-label-main">Exercícios</div>
                  </div>
                </div>
              </div>

              <!-- Divisões com layout melhorado -->
              <div class="divisions-section" v-if="plan.divisions && plan.divisions.length > 0">
                <h4 class="divisions-title">Divisões do Treino</h4>
                <div class="divisions-container">
                  <div 
                    v-for="(division, idx) in plan.divisions.slice(0, 3)" 
                    :key="division._id || idx"
                    class="division-item"
                    :style="{ animationDelay: `${idx * 50}ms` }"
                  >
                    <div class="division-info">
                      <span class="division-name">{{ division.name }}</span>
                      <span class="exercise-count-badge">{{ division.exercises?.length || 0 }} exercícios</span>
                    </div>
                  </div>
                  
                  <div v-if="plan.divisions.length > 3" class="more-divisions-indicator">
                    <div class="more-divisions-content">
                      <span class="more-text">+{{ plan.divisions.length - 3 }}</span>
                      <span class="more-label">mais divisões</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ações principais simplificadas -->
              <div class="plan-actions">
                <button @click="viewPlan(plan)" class="action-button primary-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>Visualizar</span>
                </button>
                
                <button @click="editPlan(plan)" class="action-button secondary-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span>Editar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Pagination -->
        <div class="pagination-section" v-if="totalPages > 1">
          <div class="pagination-card">
            <div class="pagination-info">
              <span class="info-text">
                Mostrando <strong>{{ (currentPage - 1) * plansPerPage + 1 }}</strong> - 
                <strong>{{ Math.min(currentPage * plansPerPage, filteredPlans.length) }}</strong> 
                de <strong>{{ filteredPlans.length }}</strong> planos
              </span>
            </div>
            
            <div class="pagination-controls">
              <button 
                @click="currentPage--" 
                :disabled="currentPage === 1"
                class="pagination-btn prev-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15,18 9,12 15,6"/>
                </svg>
                Anterior
              </button>
              
              <div class="page-numbers">
                <button
                  v-for="page in visiblePages" 
                  :key="page"
                  @click="currentPage = page"
                  :class="{ active: currentPage === page, dots: page === '...' }"
                  :disabled="page === '...'"
                  class="page-number"
                >
                  {{ page }}
                </button>
              </div>
              
              <button 
                @click="currentPage++" 
                :disabled="currentPage === totalPages"
                class="pagination-btn next-btn"
              >
                Próximo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <WorkoutPlanModalWizard
      ref="workoutPlanModal"
      v-if="showModal"
      :show="showModal"
      :isEditing="isEditing"
      :planData="selectedPlan"
      @close="closeModal"
      @save="savePlan"
    />

    <AssignPlanModal
      v-if="showAssignModal"
      :show="showAssignModal"
      :plan="selectedPlan"
      @close="closeAssignModal"
      @assign="assignPlanToStudent"
    />

    <ViewPlanModal
      v-if="showViewModal"
      :show="showViewModal"
      :plan="selectedPlan"
      @close="closeViewModal"
      @edit="onEditFromView"
    />

    <ManageStudentsModal
      v-if="showManageStudentsModal"
      :show="showManageStudentsModal"
      :plan="selectedPlan"
      @close="closeManageStudentsModal"
      @updated="onStudentsUpdated"
    />
    
    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show="showConfirmation"
      :title="confirmationConfig.title"
      :message="confirmationConfig.message"
      :icon-type="confirmationConfig.iconType"
      :require-text-confirmation="confirmationConfig.requireTextConfirmation"
      :confirmation-text="confirmationConfig.confirmationText"
      :details="confirmationConfig.details"
      button-class="btn-danger"
      @close="closeConfirmation"
      @confirm="handleConfirmAction"
    />
  </div>
</template>

<script>
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import WorkoutPlanModalWizard from "@/components/WorkoutPlanModalWizard.vue";
import AssignPlanModal from "@/components/AssignPlanModal.vue";
import ViewPlanModal from "@/components/ViewPlanModal.vue";
import ManageStudentsModal from "@/components/ManageStudentsModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import NotificationModal from "@/components/NotificationModal.vue";
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export default {
  name: "WorkoutPlans",
  components: { 
    DashboardNavBar, 
    WorkoutPlanModalWizard,
    AssignPlanModal,
    ViewPlanModal,
    ManageStudentsModal,
    ConfirmationModal,
    NotificationModal
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    
    const notification = ref({
      visible: false,
      type: 'info',
      title: '',
      message: ''
    });

    const showNotification = (type, title, message) => {
      notification.value = {
        visible: true,
        type,
        title,
        message
      };
    };

    return { isDarkMode, notification, showNotification };
  },
  data() {
    return {
      searchQuery: '',
      filterBy: 'all',
      currentPage: 1,
      plansPerPage: 6,
      showModal: false,
      showAssignModal: false,
      showViewModal: false,
      showManageStudentsModal: false,
      isEditing: false,
      selectedPlan: null,
      workoutPlans: [],
      students: [],
      totalExercises: 0,
      loading: false,
      error: null,
      // Confirmation modal
      showConfirmation: false,
      confirmationConfig: {
        title: '',
        message: '',
        iconType: 'warning',
        requireTextConfirmation: false,
        confirmationText: 'EXCLUIR',
        details: [],
        onConfirm: null
      },
      filters: [
        { key: 'all', label: 'Todos', count: null },
        { key: 'recent', label: 'Recentes', count: null },
        { key: 'assigned', label: 'Atribuídos', count: null }
      ]
    }
  },
  computed: {
    filteredPlans() {
      let filtered = this.workoutPlans.filter(plan => {
        const matchesSearch = plan.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        if (this.filterBy === 'recent') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return matchesSearch && new Date(plan.createdAt) > oneWeekAgo;
        }
        
        if (this.filterBy === 'assigned') {
          return matchesSearch && plan.studentsCount > 0;
        }
        
        return matchesSearch;
      });
      return filtered;
    },
    paginatedPlans() {
      const start = (this.currentPage - 1) * this.plansPerPage;
      const end = start + this.plansPerPage;
      return this.filteredPlans.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredPlans.length / this.plansPerPage);
    },
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) pages.push(i);
          pages.push('...');
          pages.push(total);
        } else if (current >= total - 3) {
          pages.push(1);
          pages.push('...');
          for (let i = total - 4; i <= total; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = current - 1; i <= current + 1; i++) pages.push(i);
          pages.push('...');
          pages.push(total);
        }
      }
      return pages;
    },
    totalStudentsWithPlans() {
      return this.students.filter(s => s.workoutPlanId).length;
    },
    totalExercisesCount() {
      return this.workoutPlans.reduce((total, plan) => {
        return total + this.getTotalExercises(plan);
      }, 0);
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    filterBy() {
      this.currentPage = 1;
    }
  },
  async mounted() {
    await this.fetchWorkoutPlans();
    await this.fetchStudents();
  },
  methods: {
    async fetchWorkoutPlans() {
      this.loading = true;
      this.error = null;
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/workout/workout-plans-detailed', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`Erro ao carregar planos: ${response.status}`);
        }
        this.workoutPlans = await response.json();
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
        this.error = error.message;
        this.workoutPlans = [];
      } finally {
        this.loading = false;
      }
    },

    async savePlan(planData) {
      try {
        const token = sessionStorage.getItem('token');
        const url = this.isEditing 
          ? `http://localhost:3000/api/workout/workout-plans/${planData._id}`
          : 'http://localhost:3000/api/workout/workout-plans';
        
        const method = this.isEditing ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(planData)
        });

        if (response.ok) {
          const savedPlan = await response.json();
          
          if (this.isEditing) {
            const index = this.workoutPlans.findIndex(p => p._id === savedPlan._id);
            if (index > -1) {
              this.workoutPlans[index] = savedPlan;
            }
          } else {
            this.workoutPlans.push(savedPlan);
          }
          
          this.showSuccessMessage('Plano de treino salvo com sucesso!');
          this.closeModal();
          // Resetar estado de salvamento no modal filho
          if (this.$refs.workoutPlanModal) {
            this.$refs.workoutPlanModal.isSaving = false;
          }
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
          console.error('❌ Erro do servidor:', errorData);
          // Resetar estado de salvamento em caso de erro
          if (this.$refs.workoutPlanModal) {
            this.$refs.workoutPlanModal.isSaving = false;
          }
          throw new Error(errorData.message || 'Erro ao salvar plano');
        }
      } catch (error) {
        console.error('❌ Erro ao salvar plano:', error);
        this.showErrorMessage('Erro ao salvar plano: ' + error.message);
        // Resetar estado de salvamento em caso de erro
        if (this.$refs.workoutPlanModal) {
          this.$refs.workoutPlanModal.isSaving = false;
        }
      }
    },

    async assignPlanToStudent(assignmentData) {
      try {
        const response = await fetch(`/api/students/${assignmentData.studentId}/assign-workout-plan`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ workoutPlanId: assignmentData.planId })
        });

        if (response.ok) {
          this.showNotification('success', 'Sucesso!', 'Plano atribuído com sucesso!');
          this.closeAssignModal();
        } else {
          throw new Error('Erro ao atribuir plano');
        }
      } catch (error) {
        console.error('Erro ao atribuir plano:', error);
        this.showNotification('error', 'Erro!', 'Erro ao atribuir plano: ' + error.message);
      }
    },

    async confirmDeletePlan(plan) {
      const studentsCount = plan.assignedStudents?.length || plan.studentsCount || 0;
      
      this.confirmationConfig = {
        title: 'Excluir Plano de Treino',
        message: studentsCount > 0 
          ? `<strong>⚠️ ATENÇÃO:</strong> O plano "<strong>${plan.name}</strong>" está atribuído a <strong>${studentsCount} aluno(s)</strong>.\n\nAo excluir este plano:\n• Ele será removido de todos os alunos\n• Histórico de treinos será mantido\n• Esta ação <strong>NÃO pode ser desfeita</strong>`
          : `Tem certeza que deseja excluir o plano "<strong>${plan.name}</strong>"?\n\nEsta ação <strong>NÃO pode ser desfeita</strong>.`,
        iconType: 'danger',
        requireTextConfirmation: true,
        confirmationText: 'EXCLUIR',
        details: [
          { label: '📋 Plano', value: plan.name },
          { label: '👥 Alunos afetados', value: studentsCount },
          { label: '🏋️ Total de exercícios', value: this.getTotalExercises(plan) },
          { label: '🗓️ Criado em', value: this.formatDate(plan.createdAt) }
        ],
        onConfirm: () => this.deletePlan(plan)
      };
      
      this.showConfirmation = true;
    },

    async deletePlan(plan) {
      try {
        const token = sessionStorage.getItem('token');
        
        const response = await fetch(`http://localhost:3000/api/workout/workout-plans/${plan._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const index = this.workoutPlans.findIndex(p => p._id === plan._id);
          if (index > -1) {
            this.workoutPlans.splice(index, 1);
          }
          this.showSuccessMessage('🎉 Plano de treino excluído com sucesso!');
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
          throw new Error(errorData.message || 'Erro ao excluir plano');
        }
      } catch (error) {
        console.error('❌ Erro ao excluir plano:', error);
        this.showErrorMessage('❌ Erro ao excluir plano: ' + error.message);
      }
    },
    
    showSuccessMessage(message) {
      this.confirmationConfig = {
        title: 'Sucesso!',
        message: message,
        iconType: 'success',
        requireTextConfirmation: false,
        details: [],
        onConfirm: () => this.closeConfirmation()
      };
      this.showConfirmation = true;
    },
    
    showErrorMessage(message) {
      this.confirmationConfig = {
        title: 'Erro!',
        message: message,
        iconType: 'danger',
        requireTextConfirmation: false,
        details: [],
        onConfirm: () => this.closeConfirmation()
      };
      this.showConfirmation = true;
    },
    
    closeConfirmation() {
      this.showConfirmation = false;
      this.confirmationConfig = {
        title: '',
        message: '',
        iconType: 'warning',
        requireTextConfirmation: false,
        confirmationText: 'EXCLUIR',
        details: [],
        onConfirm: null
      };
    },
    
    async handleConfirmAction() {
      if (this.confirmationConfig.onConfirm) {
        await this.confirmationConfig.onConfirm();
        this.closeConfirmation();
      }
    },

    getTotalExercises(plan) {
      if (!plan || !plan.divisions) return 0;
      return plan.divisions.reduce((total, division) => {
        return total + (division.exercises?.length || 0);
      }, 0);
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pt-BR');
    },

    openCreateModal() {
      this.isEditing = false;
      this.selectedPlan = null;
      this.showModal = true;
    },

    async editPlan(plan) {
      try {
        const token = sessionStorage.getItem('token');
        
        // Buscar dados completos do plano
        const response = await fetch(`http://localhost:3000/api/workout/workout-plans/${plan._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const fullPlan = await response.json();
          
          this.isEditing = true;
          this.selectedPlan = fullPlan;
          this.showModal = true;
        } else {
          throw new Error('Erro ao carregar plano para edição');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar plano:', error);
        this.showNotification('error', 'Erro!', 'Erro ao carregar plano: ' + error.message);
      }
    },

    viewPlan(plan) {
      this.selectedPlan = plan;
      this.showViewModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedPlan = null;
    },

    closeAssignModal() {
      this.showAssignModal = false;
      this.selectedPlan = null;
    },

    closeViewModal() {
      this.showViewModal = false;
      this.selectedPlan = null;
    },

    onEditFromView(plan) {
      this.closeViewModal();
      this.editPlan(plan);
    },



    async fetchStudents() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('/api/students', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          this.students = await response.json();
        } else {
          console.error('❌ Error fetching students:', response.status);
        }
      } catch (error) {
        console.error('❌ Error fetching students:', error);
      }
    },

    manageStudents(plan) {
      this.selectedPlan = plan;
      this.showManageStudentsModal = true;
    },

    closeManageStudentsModal() {
      this.showManageStudentsModal = false;
      this.selectedPlan = null;
    },

    async onStudentsUpdated() {
      await this.fetchWorkoutPlans();
      await this.fetchStudents();
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

* {
  box-sizing: border-box;
}

:root {
  --font-family: "Inter", sans-serif;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.dashboard-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-pattern);
  z-index: -1;
  opacity: 0.3;
}

.dashboard-main {
  flex: 1;
  padding: 0;
  margin-left: 280px;
  background: var(--bg-primary);
  position: relative;
  z-index: 1;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Detecta quando o navbar está colapsado */
body:has(.navbar-collapsed) .dashboard-main,
.dashboard-container:has(.navbar-collapsed) .dashboard-main {
  margin-left: 0 !important;
}

.dashboard-content {
  padding: 100px 40px 40px;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Theme Variables */
.dashboard-light {
  --bg-primary: #ffffff;
  --bg-secondary: rgba(248, 250, 252, 0.9);
  --bg-tertiary: rgba(255, 255, 255, 0.95);
  --bg-pattern: radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.2) 0%, transparent 50%);
  
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --text-accent: #475569;
  
  --border-primary: rgba(226, 232, 240, 0.8);
  --border-secondary: rgba(241, 245, 249, 0.6);
  --border-accent: rgba(37, 99, 235, 0.3);
  
  --gradient-primary: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --gradient-secondary: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  --gradient-tertiary: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  --gradient-accent: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(37, 99, 235, 0.15), 0 10px 10px -5px rgba(37, 99, 235, 0.1);
  
  --glass-bg: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.3);
  --glass-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
}

.dashboard-dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: rgba(15, 16, 23, 0.8);
  --bg-tertiary: rgba(26, 32, 44, 0.9);
  --bg-pattern: radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(192, 132, 252, 0.2) 0%, transparent 50%);
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-accent: #e2e8f0;
  
  --border-primary: rgba(51, 65, 85, 0.6);
  --border-secondary: rgba(30, 41, 59, 0.4);
  --border-accent: rgba(139, 92, 246, 0.3);
  
  --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --gradient-secondary: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  --gradient-tertiary: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
  --gradient-accent: linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(139, 92, 246, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.2);
  
  --glass-bg: rgba(15, 16, 23, 0.4);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
}

/* Floating Header */
.floating-header {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  z-index: 50;
  padding: 24px 40px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ajusta header quando navbar está colapsado */
body:has(.navbar-collapsed) .floating-header,
.dashboard-container:has(.navbar-collapsed) .floating-header {
  left: 0 !important;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1600px;
  margin: 0 auto;
  gap: 32px;
}

.header-left {
  flex: 1;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.main-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.title-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  opacity: 0.9;
}

.header-right {
  display: flex;
  align-items: center;
}

.create-button {
  position: relative;
  padding: 16px 28px;
  border: none;
  border-radius: 16px;
  background: var(--gradient-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-lg);
}

.create-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.create-button:active {
  transform: translateY(0) scale(0.98);
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.create-button:hover .button-glow {
  opacity: 1;
}

.button-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;
}

.button-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
}

/* Enhanced Stats Section */
.stats-section {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.stat-card {
  position: relative;
  background: var(--bg-secondary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  padding: 32px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border-color: var(--border-accent);
}

.stat-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 24px;
}

.stat-card.stat-primary .stat-background {
  background: var(--gradient-primary);
}

.stat-card.stat-secondary .stat-background {
  background: var(--gradient-secondary);
}

.stat-card.stat-tertiary .stat-background {
  background: var(--gradient-tertiary);
}

.stat-card:hover .stat-background {
  opacity: 0.05;
}

.stat-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.stat-card.stat-primary .stat-icon {
  background: var(--gradient-primary);
}

.stat-card.stat-secondary .stat-icon {
  background: var(--gradient-secondary);
}

.stat-card.stat-tertiary .stat-icon {
  background: var(--gradient-tertiary);
}

.stat-card:hover .stat-icon {
  transform: rotate(5deg) scale(1.1);
}

.stat-trend {
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
}

.trend-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
}

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Enhanced Filter Section */
.filter-section {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.filter-card {
  background: var(--bg-secondary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  gap: 32px;
  align-items: center;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  flex-wrap: wrap;
}

.search-area {
  flex: 1;
  min-width: 320px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-tertiary);
  border-radius: 16px;
  transition: all 0.3s ease;
  z-index: -1;
}

.search-input {
  width: 100%;
  padding: 18px 20px 18px 56px;
  border: 2px solid var(--border-primary);
  border-radius: 16px;
  background: transparent;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.search-input::placeholder {
  color: var(--text-tertiary);
  opacity: 0.8;
}

.search-input:focus {
  outline: none;
  border-color: var(--border-accent);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  transform: scale(1.02);
}

.dashboard-dark .search-input:focus {
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.search-input:focus + .search-bg {
  transform: scale(1.02);
  background: var(--glass-bg);
}

.search-icon-wrapper {
  position: absolute;
  left: 18px;
  z-index: 2;
  color: var(--text-tertiary);
  transition: all 0.3s ease;
}

.search-input:focus ~ .search-icon-wrapper {
  color: var(--text-accent);
}

.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tab {
  position: relative;
  padding: 14px 24px;
  border: 2px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.filter-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  right: 0;
  bottom: 0;
  background: var(--gradient-primary);
  transition: left 0.3s ease;
  z-index: -1;
}

.filter-tab:hover {
  transform: translateY(-2px);
  border-color: var(--border-accent);
  box-shadow: var(--shadow-lg);
}

.filter-tab.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.filter-tab.active::before {
  left: 0;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Enhanced Plans Section - LAYOUT MELHORADO */
.plans-section {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 28px;
  justify-content: center;
  align-items: stretch;
}

.plan-card {
  position: relative;
  background: var(--bg-secondary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 480px;
}

.plan-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border-color: var(--border-accent);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-accent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.plan-card:hover .card-background {
  opacity: 0.03;
}

/* Header melhorado com novos botões */
.plan-header {
  position: relative;
  z-index: 1;
  padding: 24px 24px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--border-primary);
}

.plan-title-section {
  flex: 1;
  padding-right: 16px;
}

.plan-name {
  margin: 0 0 8px 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  letter-spacing: -0.01em;
  word-wrap: break-word;
}

.plan-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.plan-date {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  font-weight: 500;
  padding: 4px 12px;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-secondary);
}

.plan-actions-header {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn {
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.manage-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  min-width: 140px;
  justify-content: center;
}

.manage-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.delete-btn {
  background: #dc2626;
  color: white;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}

.action-btn:active {
  transform: translateY(0) scale(0.95);
}

/* Estatísticas principais melhoradas */
.plan-stats-main {
  position: relative;
  z-index: 1;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
}

.stat-item-main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.stat-icon-main {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.plan-card:hover .stat-icon-main {
  transform: scale(1.1) rotate(5deg);
}

.students-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.divisions-icon {
  background: var(--gradient-secondary);
}

.exercises-icon {
  background: var(--gradient-tertiary);
}

.stat-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-number-main {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label-main {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.divider {
  width: 1px;
  height: 40px;
  background: var(--border-primary);
  margin: 0 16px;
}

/* Seção de divisões melhorada */
.divisions-section {
  position: relative;
  z-index: 1;
  padding: 20px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.divisions-title {
  margin: 0 0 16px 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  flex-shrink: 0;
}

.divisions-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 160px;
  overflow-y: auto;
}

.division-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.division-item:hover {
  transform: translateX(4px);
  border-color: var(--border-accent);
  box-shadow: var(--shadow-sm);
}

.division-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.division-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
  flex: 1;
}

.exercise-count-badge {
  background: var(--gradient-primary);
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.more-divisions-indicator {
  background: var(--bg-primary);
  border: 2px dashed var(--border-primary);
  border-radius: 12px;
  padding: 12px 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.more-divisions-indicator:hover {
  border-color: var(--border-accent);
  background: var(--glass-bg);
}

.more-divisions-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.more-text {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.more-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

/* Ações melhoradas - SEMPRE NA PARTE INFERIOR */
.plan-actions {
  position: relative;
  z-index: 1;
  padding: 20px 24px;
  display: flex;
  gap: 12px;
  border-top: 1px solid var(--border-primary);
  background: var(--bg-primary);
  margin-top: auto;
  flex-shrink: 0;
}

.action-button {
  flex: 1;
  padding: 14px 18px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
 font-family: "Inter", sans-serif;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.primary-action {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.secondary-action {
  background: transparent;
  border: 2px solid var(--border-primary);
  color: var(--text-primary);
}

.action-button:hover {
  transform: translateY(-2px) scale(1.02);
}

.primary-action:hover {
  box-shadow: var(--shadow-xl);
}

.secondary-action:hover {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-lg);
}

/* Enhanced Pagination */
.pagination-section {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.pagination-card {
  background: var(--bg-secondary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-md);
  flex-wrap: wrap;
  gap: 24px;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.info-text strong {
  color: var(--text-primary);
  font-weight: 700;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-btn {
  padding: 12px 20px;
  border: 2px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number {
  width: 44px;
  height: 44px;
  border: 2px solid var(--border-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number:hover:not(:disabled) {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  transform: translateY(-2px) scale(1.1);
  box-shadow: var(--shadow-md);
}

.page-number.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-lg);
  transform: scale(1.1);
}

.page-number.dots {
  cursor: default;
  border: none;
  background: transparent;
}

.page-number.dots:hover {
  transform: none;
  box-shadow: none;
  background: transparent;
  color: var(--text-primary);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsividade */
@media (max-width: 1200px) {
  .plans-grid {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 24px;
  }
  
  .dashboard-content {
    padding: 140px 24px 24px;
    gap: 32px;
  }
  
  .floating-header {
    padding: 20px 24px;
  }
}

@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .plan-card {
    border-radius: 16px;
  }
  
  .plan-header {
    padding: 20px 20px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .plan-title-section {
    padding-right: 0;
    width: 100%;
  }
  
  .plan-actions-header {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
    padding: 12px 16px;
  
  }
  
  .plan-stats-main {
    padding: 16px 20px;
    flex-direction: column;
    gap: 16px;
  }
  
  .stat-item-main {
    justify-content: center;
  }
  
  .divider {
    width: 100%;
    height: 1px;
    margin: 0;
  }
  
  .divisions-section {
    padding: 16px 20px;
  }
  
  .plan-actions {
    padding: 16px 20px;
    flex-direction: column;
    gap: 8px;
  }
  
  .action-button {
    padding: 16px;
    
  }
  
  .dashboard-content {
    padding: 140px 16px 16px;
    gap: 24px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .filter-card {
    padding: 24px;
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }
  
  .search-area {
    min-width: auto;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .pagination-card {
    padding: 20px 16px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    margin-left: 0;
  }
  
  .floating-header {
    left: 0;
  }
  
  .create-button {
    padding: 12px 20px;
    font-size: 14px;
  }
  
  .button-content span {
    display: none;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 24px;
  }
  
  .page-numbers {
    display: none;
  }
}
</style>