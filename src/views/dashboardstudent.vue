<template>
  <div :class="isDarkMode ? 'dashboard-dark' : 'dashboard-light'" class="dashboard-container">
    <StudentNavBar />
    
    <main class="dashboard-main">
      <!-- Mobile Header -->
      <header class="mobile-header">
        <div class="user-greeting">
          <div class="user-avatar">
            <img :src="userAvatar" :alt="studentData?.name" />
          </div>
          <div class="greeting-text">
            <h1 class="welcome-text">Olá, {{ studentData?.name || 'Aluno' }}!</h1>
            <p class="motivational-text">{{ getMotivationalMessage() }}</p>
          </div>
        </div>
        <button class="notification-btn" @click="toggleNotifications">
          <i class="fas fa-bell"></i>
          <span v-if="unreadNotifications > 0" class="notification-badge">{{ unreadNotifications }}</span>
        </button>
      </header>

      <div class="dashboard-content">
        <!-- Quick Stats Cards -->
        <section class="quick-stats">
          <div class="stat-card primary">
            <div class="stat-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ workoutStats.thisWeek }}</h3>
              <p class="stat-label">Treinos desta semana</p>
            </div>
          </div>
          
          <div class="stat-card secondary">
            <div class="stat-icon">
              <i class="fas fa-fire"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ workoutStats.streak }}</h3>
              <p class="stat-label">Sequência de dias</p>
            </div>
          </div>
          
          <div class="stat-card tertiary">
            <div class="stat-icon">
              <i class="fas fa-weight"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ progressData.currentWeight }}kg</h3>
              <p class="stat-label">Peso atual</p>
            </div>
          </div>
          
          <div class="stat-card quaternary">
            <div class="stat-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ goalsAchieved }}</h3>
              <p class="stat-label">Metas alcançadas</p>
            </div>
          </div>
        </section>

        <!-- Today's Workout Section -->
        <section class="todays-workout" v-if="todaysWorkout">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-dumbbell"></i>
              Treino de Hoje - {{ todaysWorkout.name }}
            </h2>
            <div class="workout-status" :class="todaysWorkout.status">
              <span>{{ getWorkoutStatusText(todaysWorkout.status) }}</span>
            </div>
          </div>
          
          <div class="workout-content">
            <div class="exercises-list">
              <div 
                v-for="(exercise, index) in todaysWorkout.exercises" 
                :key="index"
                class="exercise-item"
                :class="{ completed: exercise.completed }"
              >
                <div class="exercise-header">
                  <div class="exercise-info">
                    <h4 class="exercise-name">{{ exercise.name }}</h4>
                    <p class="exercise-target">{{ exercise.sets }}x{{ exercise.reps }} - {{ exercise.idealWeight }}kg</p>
                  </div>
                  <button 
                    class="complete-btn"
                    @click="toggleExerciseCompletion(index)"
                    :class="{ completed: exercise.completed }"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                </div>
                
                <div class="exercise-tracking" v-if="exercise.expanded">
                  <div class="sets-tracking">
                    <div 
                      v-for="setIndex in exercise.sets" 
                      :key="setIndex"
                      class="set-input"
                    >
                      <label>Série {{ setIndex }}</label>
                      <div class="input-group">
                        <input 
                          type="number" 
                          v-model="exercise.actualSets[setIndex - 1].weight"
                          placeholder="Peso"
                          class="weight-input"
                        />
                        <span class="input-suffix">kg</span>
                        <input 
                          type="number" 
                          v-model="exercise.actualSets[setIndex - 1].reps"
                          placeholder="Reps"
                          class="reps-input"
                        />
                        <span class="input-suffix">x</span>
                      </div>
                    </div>
                  </div>
                  <div class="exercise-actions">
                    <button class="btn-secondary" @click="exercise.expanded = false">Fechar</button>
                    <button class="btn-primary" @click="saveExerciseData(index)">Salvar</button>
                  </div>
                </div>
                
                <button 
                  v-else
                  class="expand-btn"
                  @click="expandExercise(index)"
                >
                  Registrar séries
                </button>
              </div>
            </div>
            
            <div class="workout-actions">
              <button 
                class="btn-outline"
                @click="skipWorkout"
                v-if="todaysWorkout.status === 'pending'"
              >
                Pular Treino
              </button>
              <button 
                class="btn-primary"
                @click="completeWorkout"
                v-if="todaysWorkout.status === 'in-progress'"
              >
                Finalizar Treino
              </button>
            </div>
          </div>
        </section>

        <!-- No Workout Today -->
        <section class="no-workout" v-else>
          <div class="empty-state">
            <i class="fas fa-calendar-times"></i>
            <h3>Nenhum treino programado para hoje</h3>
            <p>Aproveite para descansar ou conversar com seu personal trainer!</p>
          </div>
        </section>

        <!-- Progress Overview -->
        <section class="progress-overview">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-chart-line"></i>
              Meu Progresso
            </h2>
            <select v-model="progressPeriod" class="period-selector">
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
              <option value="3months">Últimos 3 meses</option>
            </select>
          </div>
          
          <div class="progress-content">
            <div class="progress-chart">
              <apexchart 
                type="line" 
                height="300" 
                :options="progressChartOptions" 
                :series="progressChartData" 
              />
            </div>
            
            <div class="progress-summary">
              <div class="progress-item">
                <h4>Evolução de Peso</h4>
                <div class="progress-value">
                  <span class="value">{{ progressData.weightChange }}kg</span>
                  <span :class="['change', progressData.weightChange >= 0 ? 'positive' : 'negative']">
                    <i :class="progressData.weightChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                    {{ Math.abs(progressData.weightChange) }}kg
                  </span>
                </div>
              </div>
              
              <div class="progress-item">
                <h4>Treinos Completados</h4>
                <div class="progress-value">
                  <span class="value">{{ workoutStats.totalCompleted }}</span>
                  <span class="change positive">
                    <i class="fas fa-arrow-up"></i>
                    {{ workoutStats.completionRate }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Goals Section -->
        <section class="goals-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-target"></i>
              Minhas Metas
            </h2>
            <button class="btn-outline" @click="showAddGoalModal = true">
              <i class="fas fa-plus"></i>
              Nova Meta
            </button>
          </div>
          
          <div class="goals-list">
            <div 
              v-for="goal in studentData?.goals || []" 
              :key="goal._id"
              class="goal-item"
              :class="goal.status"
            >
              <div class="goal-icon">
                <i :class="getGoalIcon(goal.description)"></i>
              </div>
              <div class="goal-content">
                <h4 class="goal-title">{{ goal.description }}</h4>
                <div class="goal-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: (goal.currentValue / goal.targetValue * 100) + '%' }"
                    ></div>
                  </div>
                  <span class="progress-text">
                    {{ goal.currentValue }} / {{ goal.targetValue }}
                  </span>
                </div>
                <p class="goal-deadline">
                  Meta: {{ formatDate(goal.endDate) }}
                </p>
              </div>
              <div class="goal-status">
                <span :class="['status-badge', goal.status]">
                  {{ getGoalStatusText(goal.status) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Workout History -->
        <section class="workout-history">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-history"></i>
              Histórico de Treinos
            </h2>
            <select v-model="historyFilter" class="period-selector">
              <option value="all">Todos</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mês</option>
            </select>
          </div>
          
          <div class="history-list">
            <div 
              v-for="workout in filteredWorkoutHistory" 
              :key="workout._id"
              class="history-item"
              @click="viewWorkoutDetails(workout)"
            >
              <div class="workout-date">
                <span class="day">{{ formatDay(workout.date) }}</span>
                <span class="month-year">{{ formatMonthYear(workout.date) }}</span>
              </div>
              <div class="workout-info">
                <h4 class="workout-name">{{ workout.workoutPlanName }}</h4>
                <p class="workout-summary">
                  {{ workout.exercisesCompleted?.length || 0 }} exercícios - 
                  {{ calculateWorkoutDuration(workout) }}min
                </p>
              </div>
              <div class="workout-status">
                <span :class="['status-badge', workout.status]">
                  {{ getWorkoutStatusText(workout.status) }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Add Goal Modal -->
    <div v-if="showAddGoalModal" class="modal-overlay" @click="showAddGoalModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Nova Meta</h3>
          <button class="close-btn" @click="showAddGoalModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addNewGoal">
            <div class="form-group">
              <label>Descrição da Meta</label>
              <input 
                type="text" 
                v-model="newGoal.description" 
                placeholder="Ex: Perder 5kg"
                required
              />
            </div>
            <div class="form-group">
              <label>Valor Atual</label>
              <input 
                type="number" 
                v-model="newGoal.currentValue" 
                placeholder="0"
                required
              />
            </div>
            <div class="form-group">
              <label>Valor Meta</label>
              <input 
                type="number" 
                v-model="newGoal.targetValue" 
                placeholder="100"
                required
              />
            </div>
            <div class="form-group">
              <label>Data Limite</label>
              <input 
                type="date" 
                v-model="newGoal.endDate" 
                required
              />
            </div>
            <div class="form-actions">
              <button type="button" class="btn-outline" @click="showAddGoalModal = false">
                Cancelar
              </button>
              <button type="submit" class="btn-primary">
                Criar Meta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StudentNavBar from "@/components/StudentNavBar.vue";
import { useThemeStore } from "@/store/theme";
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";
import VueApexCharts from "vue3-apexcharts";
import api from "@/api";

export default {
  name: "DashboardStudent",
  components: { 
    StudentNavBar, 
    apexchart: VueApexCharts 
  },
  
  setup() {
    const themeStore = useThemeStore();
    const authStore = useAuthStore();
    const { isDarkMode } = storeToRefs(themeStore);
    const { user } = storeToRefs(authStore);

    return { 
      isDarkMode,
      user
    };
  },

  data() {
    return {
      loading: true,
      studentData: null,
      todaysWorkout: null,
      workoutHistory: [],
      unreadNotifications: 3,
      showAddGoalModal: false,
      progressPeriod: 'month',
      historyFilter: 'week',
      
      // Stats
      workoutStats: {
        thisWeek: 3,
        streak: 7,
        totalCompleted: 45,
        completionRate: 85
      },
      
      progressData: {
        currentWeight: 75.5,
        weightChange: -2.3
      },
      
      // New Goal Form
      newGoal: {
        description: '',
        currentValue: 0,
        targetValue: 0,
        endDate: ''
      },

      // Chart data
      progressChartData: [
        {
          name: 'Peso (kg)',
          data: [78, 77.5, 77, 76.5, 76, 75.8, 75.5]
        }
      ],
      
      progressChartOptions: {
        chart: {
          type: 'line',
          toolbar: { show: false },
          fontFamily: 'Inter, sans-serif'
        },
        colors: ['#6366f1'],
        stroke: {
          curve: 'smooth',
          width: 3
        },
        xaxis: {
          categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
          labels: {
            style: {
              colors: '#6b7280'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: '#6b7280'
            }
          }
        },
        grid: {
          borderColor: '#e5e7eb',
          strokeDashArray: 5
        },
        markers: {
          size: 6,
          colors: ['#6366f1'],
          strokeColors: '#fff',
          strokeWidth: 2
        }
      }
    };
  },

  async mounted() {
    await this.loadStudentData();
    await this.loadTodaysWorkout();
    await this.loadWorkoutHistory();
    this.loading = false;
  },

  computed: {
    userAvatar() {
      return this.studentData?.avatar || '/default-avatar.jpg';
    },
    
    goalsAchieved() {
      return this.studentData?.goals?.filter(goal => goal.status === 'achieved').length || 0;
    },
    
    filteredWorkoutHistory() {
      if (!this.workoutHistory) return [];
      
      const now = new Date();
      const filterDate = new Date();
      
      switch (this.historyFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          return this.workoutHistory;
      }
      
      return this.workoutHistory.filter(workout => 
        new Date(workout.date) >= filterDate
      );
    }
  },

  methods: {
    async loadStudentData() {
      try {
        if (!this.user?.id) return;
        
        // Buscar dados do aluno usando o userId
        const response = await api.get(`/students/user/${this.user.id}`);
        this.studentData = response.data;
        
        // Atualizar dados de progresso
        if (this.studentData.progressHistory?.length > 0) {
          const latest = this.studentData.progressHistory[this.studentData.progressHistory.length - 1];
          this.progressData.currentWeight = latest.weight;
          
          if (this.studentData.progressHistory.length > 1) {
            const previous = this.studentData.progressHistory[this.studentData.progressHistory.length - 2];
            this.progressData.weightChange = latest.weight - previous.weight;
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do aluno:', error);
      }
    },

    async loadTodaysWorkout() {
      try {
        if (!this.studentData?.currentWorkoutPlanId) return;
        
        // Simular treino de hoje baseado no plano atual
        const today = new Date().getDay(); // 0 = domingo, 1 = segunda, etc.
        const workoutDays = ['A', 'B', 'C', 'A', 'B', 'C', 'Rest'];
        const todaysDivision = workoutDays[today];
        
        if (todaysDivision === 'Rest') {
          this.todaysWorkout = null;
          return;
        }
        
        // Mock data para demonstração
        this.todaysWorkout = {
          name: `Treino ${todaysDivision}`,
          status: 'pending', // pending, in-progress, completed
          exercises: [
            {
              name: 'Supino Reto',
              sets: 3,
              reps: 12,
              idealWeight: 60,
              completed: false,
              expanded: false,
              actualSets: [
                { weight: 0, reps: 0 },
                { weight: 0, reps: 0 },
                { weight: 0, reps: 0 }
              ]
            },
            {
              name: 'Agachamento',
              sets: 4,
              reps: 10,
              idealWeight: 80,
              completed: false,
              expanded: false,
              actualSets: [
                { weight: 0, reps: 0 },
                { weight: 0, reps: 0 },
                { weight: 0, reps: 0 },
                { weight: 0, reps: 0 }
              ]
            }
          ]
        };
      } catch (error) {
        console.error('Erro ao carregar treino de hoje:', error);
      }
    },

    async loadWorkoutHistory() {
      try {
        if (!this.studentData?._id) return;
        
        // Mock data para demonstração
        this.workoutHistory = [
          {
            _id: '1',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            workoutPlanName: 'Treino A',
            status: 'completed',
            exercisesCompleted: [1, 2, 3, 4],
            duration: 45
          },
          {
            _id: '2',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            workoutPlanName: 'Treino B',
            status: 'completed',
            exercisesCompleted: [1, 2, 3],
            duration: 38
          },
          {
            _id: '3',
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            workoutPlanName: 'Treino C',
            status: 'partial',
            exercisesCompleted: [1, 2],
            duration: 25
          }
        ];
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    },

    getMotivationalMessage() {
      const messages = [
        "Vamos conquistar mais um dia!",
        "Sua dedicação faz a diferença!",
        "Cada treino te deixa mais forte!",
        "Continue focado nos seus objetivos!",
        "Você está no caminho certo!"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },

    toggleNotifications() {
      // Implementar lógica de notificações
      console.log('Toggle notifications');
    },

    toggleExerciseCompletion(index) {
      this.todaysWorkout.exercises[index].completed = !this.todaysWorkout.exercises[index].completed;
      
      // Atualizar status do treino
      const completedCount = this.todaysWorkout.exercises.filter(ex => ex.completed).length;
      if (completedCount > 0 && this.todaysWorkout.status === 'pending') {
        this.todaysWorkout.status = 'in-progress';
      }
    },

    expandExercise(index) {
      this.todaysWorkout.exercises[index].expanded = true;
    },

    async saveExerciseData(index) {
      try {
        const exercise = this.todaysWorkout.exercises[index];
        
        // Salvar dados do exercício no backend
        const exerciseData = {
          exerciseId: exercise.id,
          sets: exercise.actualSets.filter(set => set.weight > 0 && set.reps > 0).length,
          reps: exercise.actualSets.map(set => set.reps),
          weightUsed: exercise.actualSets[0].weight, // Usar o peso da primeira série como referência
          notes: ''
        };
        
        // Mock - em produção faria chamada para API
        console.log('Salvando dados do exercício:', exerciseData);
        
        exercise.expanded = false;
        exercise.completed = true;
      } catch (error) {
        console.error('Erro ao salvar dados do exercício:', error);
      }
    },

    async completeWorkout() {
      try {
        const workoutData = {
          workoutPlanId: this.studentData.currentWorkoutPlanId,
          date: new Date(),
          exercisesCompleted: this.todaysWorkout.exercises.map(ex => ({
            exerciseId: ex.id,
            sets: ex.actualSets.filter(set => set.weight > 0 && set.reps > 0).length,
            reps: ex.actualSets.map(set => set.reps),
            weightUsed: ex.actualSets[0]?.weight || 0
          })),
          status: 'completed'
        };
        
        // Salvar treino no backend
        await api.post(`/students/${this.studentData._id}/workout-history`, workoutData);
        
        this.todaysWorkout.status = 'completed';
        this.workoutStats.thisWeek++;
        
        // Recarregar histórico
        await this.loadWorkoutHistory();
      } catch (error) {
        console.error('Erro ao finalizar treino:', error);
      }
    },

    async skipWorkout() {
      try {
        const workoutData = {
          workoutPlanId: this.studentData.currentWorkoutPlanId,
          date: new Date(),
          exercisesCompleted: [],
          status: 'missed'
        };
        
        await api.post(`/students/${this.studentData._id}/workout-history`, workoutData);
        this.todaysWorkout = null;
      } catch (error) {
        console.error('Erro ao pular treino:', error);
      }
    },

    async addNewGoal() {
      try {
        const goalData = {
          ...this.newGoal,
          startDate: new Date(),
          status: 'in-progress'
        };
        
        // Adicionar meta no backend
        await api.post(`/students/${this.studentData._id}/goals`, goalData);
        
        // Atualizar dados locais
        if (!this.studentData.goals) this.studentData.goals = [];
        this.studentData.goals.push({
          ...goalData,
          _id: Date.now().toString()
        });
        
        this.showAddGoalModal = false;
        this.newGoal = { description: '', currentValue: 0, targetValue: 0, endDate: '' };
      } catch (error) {
        console.error('Erro ao adicionar meta:', error);
      }
    },

    getWorkoutStatusText(status) {
      const statusMap = {
        pending: 'Pendente',
        'in-progress': 'Em Andamento',
        completed: 'Concluído',
        partial: 'Parcial',
        missed: 'Perdido'
      };
      return statusMap[status] || status;
    },

    getGoalStatusText(status) {
      const statusMap = {
        'in-progress': 'Em Progresso',
        achieved: 'Alcançada',
        canceled: 'Cancelada'
      };
      return statusMap[status] || status;
    },

    getGoalIcon(description) {
      const desc = description.toLowerCase();
      if (desc.includes('peso') || desc.includes('kg')) return 'fas fa-weight';
      if (desc.includes('força') || desc.includes('musculo')) return 'fas fa-dumbbell';
      if (desc.includes('corrida') || desc.includes('cardio')) return 'fas fa-running';
      return 'fas fa-target';
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR');
    },

    formatDay(date) {
      return new Date(date).getDate().toString().padStart(2, '0');
    },

    formatMonthYear(date) {
      return new Date(date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    },

    calculateWorkoutDuration(workout) {
      return workout.duration || 30;
    },

    viewWorkoutDetails(workout) {
      // Implementar visualização detalhada do treino
      console.log('Ver detalhes do treino:', workout);
    }
  }
};
</script>

<style scoped>
/* Font Awesome Import */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Main Container */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  margin-left: 280px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.dashboard-main {
  flex: 1;
  background: var(--bg-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

.dashboard-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Theme Variables */
.dashboard-light {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --border-primary: #e2e8f0;
  --border-secondary: #cbd5e1;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
  --primary-color: #6366f1;
  --primary-light: #818cf8;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-warning: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --gradient-danger: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.dashboard-dark {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border-primary: #334155;
  --border-secondary: #475569;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.4);
  --primary-color: #8b5cf6;
  --primary-light: #a78bfa;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
  --gradient-warning: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --gradient-danger: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Mobile Header */
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.user-greeting {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.greeting-text h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.motivational-text {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.notification-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: scale(1.05);
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--danger-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.stat-card.secondary::before { background: var(--gradient-success); }
.stat-card.tertiary::before { background: var(--gradient-warning); }
.stat-card.quaternary::before { background: var(--gradient-danger); }

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-card.secondary .stat-icon { background: var(--gradient-success); }
.stat-card.tertiary .stat-icon { background: var(--gradient-warning); }
.stat-card.quaternary .stat-icon { background: var(--gradient-danger); }

.stat-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: var(--primary-color);
}

/* Today's Workout */
.todays-workout, .no-workout {
  background: var(--bg-secondary);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-primary);
  overflow: hidden;
}

.workout-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.workout-status.pending {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.workout-status.in-progress {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.workout-status.completed {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.workout-content {
  padding: 2rem;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.exercise-item {
  background: var(--bg-tertiary);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.exercise-item.completed {
  border-color: var(--success-color);
  background: rgba(16, 185, 129, 0.05);
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.exercise-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.exercise-target {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.complete-btn {
  width: 32px;
  height: 32px;
  border: 2px solid var(--border-secondary);
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.complete-btn.completed {
  background: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.exercise-tracking {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-primary);
}

.sets-tracking {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.set-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.set-input label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.weight-input, .reps-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
}

.input-suffix {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  min-width: 20px;
}

.exercise-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.expand-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.expand-btn:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

.workout-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Buttons */
.btn-primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Progress Overview */
.progress-overview {
  background: var(--bg-secondary);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-primary);
  overflow: hidden;
}

.progress-content {
  padding: 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: center;
}

.progress-summary {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.progress-item h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.progress-value {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-value .value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
}

.change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.change.positive {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.change.negative {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.period-selector {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
}

/* Goals Section */
.goals-section {
  background: var(--bg-secondary);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-primary);
  overflow: hidden;
}

.goals-list {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.goal-item.achieved {
  border-color: var(--success-color);
  background: rgba(16, 185, 129, 0.05);
}

.goal-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.goal-content {
  flex: 1;
}

.goal-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 80px;
}

.goal-deadline {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.in-progress {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge.achieved {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status-badge.canceled {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

/* Workout History */
.workout-history {
  background: var(--bg-secondary);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-primary);
  overflow: hidden;
}

.history-list {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.workout-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  min-width: 60px;
  flex-shrink: 0;
}

.workout-date .day {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.workout-date .month-year {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.workout-info {
  flex: 1;
}

.workout-name {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.workout-summary {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-primary);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--bg-tertiary);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--danger-color);
  color: white;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-container {
    margin-left: 0;
  }
  
  .progress-content {
    grid-template-columns: 1fr;
  }
  
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .mobile-header {
    padding: 1rem;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
  }
  
  .greeting-text h1 {
    font-size: 1.25rem;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .workout-content {
    padding: 1.5rem;
  }
  
  .exercise-item {
    padding: 1rem;
  }
  
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sets-tracking {
    gap: 0.75rem;
  }
  
  .workout-actions,
  .exercise-actions {
    flex-direction: column;
  }
  
  .progress-content {
    padding: 1.5rem;
  }
  
  .goals-list {
    padding: 1.5rem;
  }
  
  .goal-item {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .goal-progress {
    width: 100%;
  }
  
  .history-list {
    padding: 1.5rem;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .workout-date {
    align-self: flex-start;
  }
  
  .modal-content {
    margin: 1rem;
    max-width: none;
  }
  
  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .dashboard-content {
    padding: 0.75rem;
  }
  
  .mobile-header {
    padding: 0.75rem;
  }
  
  .greeting-text h1 {
    font-size: 1.125rem;
  }
  
  .motivational-text {
    font-size: 0.8125rem;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .stat-content h3 {
    font-size: 1.75rem;
  }
  
  .workout-content,
  .progress-content,
  .goals-list,
  .history-list {
    padding: 1rem;
  }
  
  .modal-header,
  .modal-body {
    padding: 1rem;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card,
.todays-workout,
.progress-overview,
.goals-section,
.workout-history {
  animation: fadeInUp 0.6s ease-out;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }
</style>
