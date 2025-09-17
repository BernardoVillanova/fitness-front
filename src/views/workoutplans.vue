<template>
  <div :class="isDarkMode ? 'dashboard-dark' : 'dashboard-light'" class="dashboard-container">
    <DashboardNavBar />
    
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
                    <span class="trend-value">+8%</span>
                  </div>
                </div>
                <div class="stat-body">
                  <div class="stat-number">{{ totalStudents }}</div>
                  <div class="stat-label">Alunos Ativos</div>
                </div>
              </div>
            </div>

            <div class="stat-card stat-tertiary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <div class="stat-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div class="stat-trend">
                    <span class="trend-value">+24%</span>
                  </div>
                </div>
                <div class="stat-body">
                  <div class="stat-number">{{ newPlansThisMonth }}</div>
                  <div class="stat-label">Planos este Mês</div>
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

        <!-- Enhanced Plans Grid -->
        <div class="plans-section">
          <div class="plans-grid">
            <div 
              v-for="(plan, index) in paginatedPlans" 
              :key="plan._id || plan.id" 
              class="plan-card"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="card-background"></div>
              
              <div class="plan-header">
                <div class="plan-title-area">
                  <h3 class="plan-name">{{ plan.name }}</h3>
                  <span class="plan-date">{{ formatDate(plan.createdAt) }}</span>
                </div>
                
                <div class="plan-menu-wrapper" @click.stop>
                  <button class="menu-trigger" @click="togglePlanMenu(plan._id)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                  
                  <div v-if="openMenuId === plan._id" class="dropdown-menu" @click.stop>
                    <button @click="assignPlan(plan)" class="dropdown-option">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                      </svg>
                      Atribuir
                    </button>
                    <button @click="duplicatePlan(plan)" class="dropdown-option">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      Duplicar
                    </button>
                    <div class="dropdown-separator"></div>
                    <button @click="deletePlan(plan)" class="dropdown-option danger">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              </div>

              <div class="divisions-area">
                <div 
                  v-for="division in plan.divisions.slice(0, 3)" 
                  :key="division._id"
                  class="division-badge"
                >
                  <span class="division-text">{{ division.name }}</span>
                  <span class="exercise-count">{{ division.exercises.length }}</span>
                </div>
                <div v-if="plan.divisions.length > 3" class="more-divisions">
                  +{{ plan.divisions.length - 3 }} mais
                </div>
              </div>

              <div class="plan-stats">
                <div class="stat-item">
                  <div class="stat-icon-small divisions-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ plan.divisions.length }}</span>
                    <span class="stat-text">Divisões</span>
                  </div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-icon-small exercises-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div class="stat-info">
                    <span class="stat-value">{{ getTotalExercises(plan) }}</span>
                    <span class="stat-text">Exercícios</span>
                  </div>
                </div>
              </div>

              <div class="plan-actions">
                <button @click="viewPlan(plan)" class="action-button view-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>Visualizar</span>
                </button>
                
                <button @click="editPlan(plan)" class="action-button edit-btn">
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
    <WorkoutPlanModal
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
    />
  </div>
</template>

<script>
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import WorkoutPlanModal from "@/components/WorkoutPlanModal.vue";
import AssignPlanModal from "@/components/AssignPlanModal.vue";
import ViewPlanModal from "@/components/ViewPlanModal.vue";
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";

export default {
  name: "WorkoutPlans",
  components: { 
    DashboardNavBar, 
    WorkoutPlanModal,
    AssignPlanModal,
    ViewPlanModal
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    return { isDarkMode };
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
      isEditing: false,
      selectedPlan: null,
      workoutPlans: [],
      loading: false,
      error: null,
      openMenuId: null,
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
    totalStudents() {
      return 125;
    },
    newPlansThisMonth() {
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      return this.workoutPlans.filter(plan => {
        const planDate = new Date(plan.createdAt);
        return planDate.getMonth() === thisMonth && planDate.getFullYear() === thisYear;
      }).length;
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
  },
  methods: {
    async fetchWorkoutPlans() {
      this.loading = true;
      try {
        const response = await fetch('/api/workout/workout-plans');
        if (response.ok) {
          this.workoutPlans = await response.json();
        } else {
          throw new Error('Erro ao carregar planos');
        }
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
        this.error = error.message;
        // Dados de exemplo para desenvolvimento
        this.workoutPlans = [
          {
            _id: '1',
            name: 'Treino Funcional Básico',
            divisions: [
              {
                _id: 'd1',
                name: 'Treino A - Upper',
                exercises: [
                  { name: 'Agachamento', sets: 3, reps: 12, idealWeight: 20 },
                  { name: 'Flexão', sets: 3, reps: 10, idealWeight: 0 }
                ]
              },
              {
                _id: 'd2',
                name: 'Treino B - Lower',
                exercises: [
                  { name: 'Leg Press', sets: 4, reps: 15, idealWeight: 80 }
                ]
              }
            ],
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Hipertrofia Avançada',
            divisions: [
              {
                _id: 'd3',
                name: 'Treino A - Peito/Tríceps',
                exercises: [
                  { name: 'Supino Reto', sets: 4, reps: 8, idealWeight: 60 },
                  { name: 'Inclinado Halteres', sets: 3, reps: 10, idealWeight: 30 }
                ]
              },
              {
                _id: 'd4',
                name: 'Treino B - Costas/Bíceps',
                exercises: [
                  { name: 'Puxada Frontal', sets: 4, reps: 8, idealWeight: 50 },
                  { name: 'Remada Curvada', sets: 3, reps: 10, idealWeight: 40 }
                ]
              },
              {
                _id: 'd5',
                name: 'Treino C - Pernas',
                exercises: [
                  { name: 'Agachamento Livre', sets: 5, reps: 6, idealWeight: 100 },
                  { name: 'Leg Press', sets: 4, reps: 12, idealWeight: 120 }
                ]
              },
              {
                _id: 'd6',
                name: 'Treino D - Ombros',
                exercises: [
                  { name: 'Desenvolvimento', sets: 4, reps: 8, idealWeight: 40 }
                ]
              }
            ],
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            _id: '3',
            name: 'Condicionamento Físico',
            divisions: [
              {
                _id: 'd7',
                name: 'HIIT Cardio',
                exercises: [
                  { name: 'Burpees', sets: 5, reps: 15, idealWeight: 0 },
                  { name: 'Mountain Climbers', sets: 4, reps: 20, idealWeight: 0 }
                ]
              }
            ],
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ];
      } finally {
        this.loading = false;
      }
    },

    async savePlan(planData) {
      try {
        const url = this.isEditing 
          ? `/api/workout/workout-plans/${planData._id}`
          : '/api/workout/workout-plans';
        
        const method = this.isEditing ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: {
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
          
          this.closeModal();
        } else {
          throw new Error('Erro ao salvar plano');
        }
      } catch (error) {
        console.error('Erro ao salvar plano:', error);
        alert('Erro ao salvar plano: ' + error.message);
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
          alert('Plano atribuído com sucesso!');
          this.closeAssignModal();
        } else {
          throw new Error('Erro ao atribuir plano');
        }
      } catch (error) {
        console.error('Erro ao atribuir plano:', error);
        alert('Erro ao atribuir plano: ' + error.message);
      }
    },

    async deletePlan(plan) {
      if (confirm(`Tem certeza que deseja excluir o plano "${plan.name}"?`)) {
        try {
          const response = await fetch(`/api/workout/workout-plans/${plan._id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            const index = this.workoutPlans.findIndex(p => p._id === plan._id);
            if (index > -1) {
              this.workoutPlans.splice(index, 1);
            }
          } else {
            throw new Error('Erro ao excluir plano');
          }
        } catch (error) {
          console.error('Erro ao excluir plano:', error);
          alert('Erro ao excluir plano: ' + error.message);
        }
      }
    },

    getTotalExercises(plan) {
      return plan.divisions.reduce((total, division) => total + division.exercises.length, 0);
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pt-BR');
    },

    togglePlanMenu(planId) {
      this.openMenuId = this.openMenuId === planId ? null : planId;
    },

    openCreateModal() {
      this.isEditing = false;
      this.selectedPlan = null;
      this.showModal = true;
    },

    editPlan(plan) {
      this.isEditing = true;
      this.selectedPlan = { ...plan };
      this.showModal = true;
    },

    viewPlan(plan) {
      this.selectedPlan = plan;
      this.showViewModal = true;
    },

    assignPlan(plan) {
      this.selectedPlan = plan;
      this.showAssignModal = true;
    },

    duplicatePlan(plan) {
      const newPlan = {
        ...plan,
        _id: null,
        name: `${plan.name} (Cópia)`,
        createdAt: new Date().toISOString()
      };
      this.selectedPlan = newPlan;
      this.isEditing = false;
      this.showModal = true;
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
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

:root {
  --font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  margin-left: 80px;
  font-family: var(--font-family);
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
  opacity: 0.02;
}

.dashboard-main {
  flex: 1;
  padding: 0;
  background: var(--bg-primary);
  position: relative;
}

.dashboard-content {
  padding: 140px 40px 40px;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Theme Variables */
.dashboard-light {
  --bg-primary: #fafbfc;
  --bg-secondary: rgba(255, 255, 255, 0.8);
  --bg-tertiary: rgba(255, 255, 255, 0.95);
  --bg-pattern: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
  --text-primary: #1a1d29;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --text-accent: #475569;
  
  --border-primary: rgba(226, 232, 240, 0.8);
  --border-secondary: rgba(241, 245, 249, 0.6);
  --border-accent: rgba(99, 102, 241, 0.2);
  
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --gradient-tertiary: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --gradient-accent: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  --glass-bg: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.3);
  --glass-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

.dashboard-dark {
  --bg-primary: #0a0b0f;
  --bg-secondary: rgba(15, 16, 23, 0.8);
  --bg-tertiary: rgba(26, 32, 44, 0.9);
  --bg-pattern: radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-accent: #e2e8f0;
  
  --border-primary: rgba(51, 65, 85, 0.6);
  --border-secondary: rgba(30, 41, 59, 0.4);
  --border-accent: rgba(139, 92, 246, 0.3);
  
  --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --gradient-secondary: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
  --gradient-tertiary: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  --gradient-accent: linear-gradient(135deg, #10b981 0%, #059669 100%);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
  
  --glass-bg: rgba(15, 16, 23, 0.4);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Floating Header */
.floating-header {
  position: fixed;
  top: 0;
  left: 80px;
  right: 0;
  z-index: 100;
  padding: 24px 40px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: scale(1.02);
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

/* Enhanced Plans Section */
.plans-section {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 32px;
}

.plan-card {
  position: relative;
  background: var(--bg-secondary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 28px;
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.plan-card:hover {
  transform: translateY(-12px) scale(1.02);
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
  border-radius: 28px;
}

.plan-card:hover .card-background {
  opacity: 0.03;
}

.plan-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.plan-title-area {
  flex: 1;
}

.plan-name {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.plan-date {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.plan-menu-wrapper {
  position: relative;
}

.menu-trigger {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-trigger:hover {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--bg-tertiary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  min-width: 180px;
  padding: 8px;
  animation: dropdownFade 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-option {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.dropdown-option:hover {
  background: var(--bg-primary);
  transform: translateX(4px);
}

.dropdown-option.danger {
  color: #ef4444;
}

.dropdown-option.danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.dropdown-separator {
  height: 1px;
  background: var(--border-primary);
  margin: 8px 0;
}

.divisions-area {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.division-badge {
  background: var(--gradient-primary);
  color: white;
  padding: 10px 16px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.division-badge:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: var(--shadow-md);
}

.exercise-count {
  background: rgba(255, 255, 255, 0.25);
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.more-divisions {
  background: var(--bg-primary);
  border: 2px dashed var(--border-primary);
  color: var(--text-tertiary);
  padding: 10px 16px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.more-divisions:hover {
  border-color: var(--border-accent);
  color: var(--text-accent);
}

.plan-stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}

.stat-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-accent);
}

.stat-icon-small {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.divisions-icon {
  background: var(--gradient-secondary);
}

.exercises-icon {
  background: var(--gradient-tertiary);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-text {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.plan-actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12px;
}

.action-button {
  flex: 1;
  padding: 16px 20px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.view-btn {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.edit-btn {
  background: var(--bg-primary);
  border: 2px solid var(--border-primary);
  color: var(--text-primary);
}

.action-button:hover {
  transform: translateY(-3px) scale(1.02);
}

.view-btn:hover {
  box-shadow: var(--shadow-xl);
}

.edit-btn:hover {
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

.page-numbers {
  display: flex;
  gap: 6px;
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

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-container {
    margin-left: 0;
  }
  
  .floating-header {
    left: 0;
  }
  
  .plans-grid {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  }
}

@media (max-width: 968px) {
  .dashboard-content {
    padding: 140px 24px 40px;
  }
  
  .floating-header {
    padding: 20px 24px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  .filter-card {
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
  
  .plans-grid {
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 120px 16px 40px;
    gap: 32px;
  }
  
  .floating-header {
    padding: 16px 20px;
  }
  
  .main-title {
    font-size: 1.75rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
  
  .create-button {
    padding: 14px 24px;
    font-size: 15px;
  }
  
  .stat-card {
    padding: 24px;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .filter-card {
    padding: 24px;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .plan-card {
    padding: 24px;
  }
  
  .plan-actions {
    flex-direction: column;
  }
  
  .action-button {
    justify-content: flex-start;
  }
  
  .pagination-card {
    flex-direction: column;
    text-align: center;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .dashboard-content {
    padding: 110px 12px 40px;
  }
  
  .main-title {
    font-size: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .filter-card {
    padding: 20px;
  }
  
  .filter-tabs {
    gap: 8px;
  }
  
  .filter-tab {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .plan-card {
    padding: 20px;
    border-radius: 20px;
  }
  
  .plan-name {
    font-size: 1.25rem;
  }
  
  .divisions-area {
    gap: 8px;
  }
  
  .division-badge {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
  
  .plan-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-item {
    padding: 12px;
  }
  
  .stat-icon-small {
    width: 32px;
    height: 32px;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
  
  .action-button {
    padding: 14px 16px;
    font-size: 14px;
  }
  
  .pagination-card {
    padding: 20px;
  }
  
  .page-number {
    width: 40px;
    height: 40px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .floating-header {
    padding: 12px 16px;
  }
  
  .header-content {
    gap: 16px;
  }
  
  .main-title {
    font-size: 1.375rem;
  }
  
  .create-button {
    padding: 12px 20px;
    font-size: 14px;
  }
  
  .button-content {
    gap: 8px;
  }
  
  .button-icon {
    width: 18px;
    height: 18px;
  }
}

/* Dark mode specific animations */
.dashboard-dark .stat-card:hover .stat-background {
  opacity: 0.08;
}

.dashboard-dark .card-background {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
}

.dashboard-dark .plan-card:hover .card-background {
  opacity: 0.06;
}

/* Loading states */
.plan-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.plan-card.loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: shimmer 1.5s infinite;
  z-index: 1;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}

/* Accessibility improvements */
.create-button:focus,
.filter-tab:focus,
.action-button:focus,
.pagination-btn:focus,
.page-number:focus,
.menu-trigger:focus {
  outline: 2px solid var(--border-accent);
  outline-offset: 2px;
}

.search-input:focus {
  outline: 2px solid var(--border-accent);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .dashboard-light {
    --border-primary: #000000;
    --text-secondary: #000000;
    --text-tertiary: #333333;
  }
  
  .dashboard-dark {
    --border-primary: #ffffff;
    --text-secondary: #ffffff;
    --text-tertiary: #cccccc;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .plan-card {
    animation: none;
  }
  
  .stats-section,
  .filter-section,
  .plans-section,
  .pagination-section {
    animation: none;
  }
}

/* Print styles */
@media print {
  .floating-header,
  .filter-section,
  .pagination-section {
    display: none !important;
  }
  
  .dashboard-content {
    padding-top: 0;
  }
  
  .plan-card {
    break-inside: avoid;
    box-shadow: none;
    border: 2px solid #000;
    margin-bottom: 20px;
  }
  
  .plans-grid {
    display: block;
  }
}

/* Custom scrollbar */
.dashboard-container::-webkit-scrollbar {
  width: 6px;
}

.dashboard-container::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

.dashboard-container::-webkit-scrollbar-thumb {
  background: var(--border-primary);
  border-radius: 3px;
}

.dashboard-container::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* Selection styles */
::selection {
  background: rgba(99, 102, 241, 0.2);
  color: var(--text-primary);
}

.dashboard-dark ::selection {
  background: rgba(139, 92, 246, 0.3);
  color: var(--text-primary);
}

/* Focus visible improvements */
.create-button:focus-visible,
.filter-tab:focus-visible,
.action-button:focus-visible,
.menu-trigger:focus-visible {
  outline: 2px solid var(--border-accent);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* Enhanced glassmorphism effects */
.floating-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  backdrop-filter: inherit;
  z-index: -1;
}

/* Improved hover states for touch devices */
@media (hover: none) {
  .stat-card:hover,
  .plan-card:hover,
  .filter-tab:hover,
  .action-button:hover {
    transform: none;
  }
  
  .create-button:hover {
    transform: none;
  }
}

/* Enhanced loading animation */
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
  }
  50% {
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.4);
  }
}

.create-button.loading {
  animation: pulseGlow 2s infinite;
}

/* Enhanced micro-interactions */
.division-badge {
  position: relative;
  overflow: hidden;
}

.division-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.division-badge:hover::before {
  left: 100%;
}

/* Final responsive adjustments */
@media (min-width: 1600px) {
  .dashboard-content {
    padding: 140px 60px 40px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .plans-grid {
    grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
    gap: 36px;
  }
}
</style>