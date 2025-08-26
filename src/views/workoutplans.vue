<template>
  <div :class="isDarkMode ? 'dashboard-dark' : 'dashboard-light'" class="dashboard-container">
    <DashboardNavBar />
    <main class="dashboard-main">
      <section class="dashboard-content">
        <!-- Header Card -->
        <div class="card header-card extra-large">
          <div class="header-content">
            <div class="header-info">
              <h1 class="page-title">Planos de Exercícios</h1>
              <p class="page-subtitle">Gerencie e organize todos os treinos dos seus alunos</p>
            </div>
            <button @click="openCreateModal" class="create-btn">
              <i class="icon-plus">+</i>
              Criar Novo Plano
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="card stats-card small">
          <h3>Total de Planos</h3>
          <div class="stat-number">{{ workoutPlans.length }}</div>
        </div>

        <div class="card stats-card small">
          <h3>Alunos Ativos</h3>
          <div class="stat-number">{{ totalStudents }}</div>
        </div>

        <div class="card stats-card small">
          <h3>Planos este Mês</h3>
          <div class="stat-number">{{ newPlansThisMonth }}</div>
        </div>

        <!-- Filters Card -->
        <div class="card filters-card extra-large">
          <div class="filters-container">
            <div class="search-container">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Buscar planos..."
                class="search-input"
              >
            </div>
            <div class="filter-buttons">
              <button 
                @click="filterBy = 'all'"
                :class="{ active: filterBy === 'all' }"
                class="filter-btn"
              >
                Todos
              </button>
              <button 
                @click="filterBy = 'recent'"
                :class="{ active: filterBy === 'recent' }"
                class="filter-btn"
              >
                Recentes
              </button>
              <button 
                @click="filterBy = 'assigned'"
                :class="{ active: filterBy === 'assigned' }"
                class="filter-btn"
              >
                Atribuídos
              </button>
            </div>
          </div>
        </div>

        <!-- Workout Plans Grid -->
        <div 
          v-for="plan in paginatedPlans" 
          :key="plan._id || plan.id" 
          class="card plan-card large"
        >
          <div class="plan-header">
            <h3 class="plan-title">{{ plan.name }}</h3>
            <div class="plan-meta">
              <span class="creation-date">{{ formatDate(plan.createdAt) }}</span>
            </div>
          </div>
          
          <div class="plan-divisions">
            <div 
              v-for="division in plan.divisions" 
              :key="division._id"
              class="division-tag"
            >
              {{ division.name }} ({{ division.exercises.length }} ex.)
            </div>
          </div>

          <div class="plan-stats">
            <div class="stat-item">
              <span class="stat-label">Divisões:</span>
              <span class="stat-value">{{ plan.divisions.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Total de Exercícios:</span>
              <span class="stat-value">{{ getTotalExercises(plan) }}</span>
            </div>
          </div>

          <div class="plan-actions">
            <button @click="viewPlan(plan)" class="action-btn view-btn">
              👁️ Visualizar
            </button>
            <button @click="editPlan(plan)" class="action-btn edit-btn">
              ✏️ Editar
            </button>
            <button @click="assignPlan(plan)" class="action-btn assign-btn">
              👥 Atribuir
            </button>
            <button @click="duplicatePlan(plan)" class="action-btn duplicate-btn">
              📋 Duplicar
            </button>
            <button @click="deletePlan(plan)" class="action-btn delete-btn">
              🗑️ Excluir
            </button>
          </div>
        </div>

        <!-- Pagination Card -->
        <div class="card pagination-card extra-large" v-if="totalPages > 1">
          <div class="pagination">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              Anterior
            </button>
            
            <span 
              v-for="page in totalPages" 
              :key="page"
              @click="currentPage = page"
              :class="{ active: currentPage === page }"
              class="page-number"
            >
              {{ page }}
            </span>
            
            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Próximo
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal de Criação/Edição -->
    <WorkoutPlanModal
      v-if="showModal"
      :show="showModal"
      :isEditing="isEditing"
      :planData="selectedPlan"
      @close="closeModal"
      @save="savePlan"
    />

    <!-- Modal de Atribuição -->
    <AssignPlanModal
      v-if="showAssignModal"
      :show="showAssignModal"
      :plan="selectedPlan"
      @close="closeAssignModal"
      @assign="assignPlanToStudent"
    />

    <!-- Modal de Visualização -->
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
      error: null
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
    totalStudents() {
      // Esta informação viria da API
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
                name: 'Treino A',
                exercises: [
                  { name: 'Agachamento', sets: 3, reps: 12, idealWeight: 20 },
                  { name: 'Flexão', sets: 3, reps: 10, idealWeight: 0 }
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
                _id: 'd2',
                name: 'Treino A - Peito/Tríceps',
                exercises: [
                  { name: 'Supino Reto', sets: 4, reps: 8, idealWeight: 60 },
                  { name: 'Inclinado Halteres', sets: 3, reps: 10, idealWeight: 30 }
                ]
              },
              {
                _id: 'd3',
                name: 'Treino B - Costas/Bíceps',
                exercises: [
                  { name: 'Puxada Frontal', sets: 4, reps: 8, idealWeight: 50 },
                  { name: 'Remada Curvada', sets: 3, reps: 10, idealWeight: 40 }
                ]
              }
            ],
            createdAt: new Date(Date.now() - 86400000).toISOString()
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
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow-x: hidden;
  margin-left: 80px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dashboard-main {
  flex: 1;
  padding: 24px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  background-color: var(--card-bg);
  color: var(--text-color);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.dashboard-light {
  --card-bg: #ffffff;
  --text-color: #1a1a1a;
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --border-color: #e9ecef;
  background-color: #f4f4f8;
}

.dashboard-dark {
  --card-bg: #2b2b3d;
  --text-color: #f1f1f1;
  --primary-color: #6441a5;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  --border-color: #404040;
  background-color: #1a1a2e;
}

/* Grid Sizes */
.small { grid-column: span 1; }
.medium { grid-column: span 2; }
.large { grid-column: span 2; }
.extra-large { grid-column: span 3; }

/* Header Card */
.header-card {
  background: linear-gradient(135deg, var(--card-bg), var(--primary-color));
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.page-title {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.page-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

.create-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.create-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.icon-plus {
  font-size: 18px;
  font-weight: bold;
}

/* Stats Cards */
.stats-card h3 {
  margin: 0 0 15px 0;
  font-size: 1rem;
  opacity: 0.8;
  font-weight: 500;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

/* Filters Card */
.filters-container {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid var(--primary-color);
  background: transparent;
  color: var(--primary-color);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--primary-color);
  color: white;
}

/* Plan Cards */
.plan-card {
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.plan-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.plan-title {
  font-size: 1.4rem;
  margin: 0;
  font-weight: 600;
  color: var(--text-color);
}

.plan-meta {
  text-align: right;
}

.creation-date {
  font-size: 0.9rem;
  opacity: 0.7;
}

.plan-divisions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.division-tag {
  background: var(--primary-color);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.plan-stats {
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  opacity: 0.7;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: 600;
  color: var(--primary-color);
}

.plan-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 90px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.view-btn { background: #17a2b8; color: white; }
.edit-btn { background: #ffc107; color: #212529; }
.assign-btn { background: #28a745; color: white; }
.duplicate-btn { background: #6c757d; color: white; }
.delete-btn { background: #dc3545; color: white; }

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Pagination */
.pagination-card {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-btn {
  padding: 10px 16px;
  border: 2px solid var(--primary-color);
  background: transparent;
  color: var(--primary-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number {
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.page-number:hover,
.page-number.active {
  background: var(--primary-color);
  color: white;
}

/* Responsividade */
@media (max-width: 1024px) {
  .large,
  .extra-large {
    grid-column: span 1;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    margin-left: 0px;
  }

  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container {
    min-width: auto;
  }
  
  .filter-buttons {
    justify-content: center;
  }
  
  .plan-actions {
    flex-direction: column;
  }
  
  .action-btn {
    min-width: auto;
  }
}
</style>