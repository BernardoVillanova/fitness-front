<template>
  <div class="dashboard-container" :class="{ 'dark-mode': isDarkMode }">
    <StudentNavBar />
    
    <div class="dashboard-main">
      <!-- Floating Header -->
      <div class="floating-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title gradient-text">
              Olá, {{ authStore.currentUser?.name?.split(' ')[0] }}! 👋
            </h1>
            <p class="page-subtitle">
              {{ getWelcomeMessage() }}
            </p>
          </div>
          
          <div class="header-actions">
            <button @click="startWorkout" class="action-btn primary">
              <i class="fas fa-play"></i>
              <span>Iniciar Treino</span>
            </button>
            <button @click="viewProgress" class="action-btn secondary">
              <i class="fas fa-chart-line"></i>
              <span>Ver Progresso</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-dumbbell"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ userData.stats.totalWorkouts }}</h3>
            <p class="stat-label">Treinos Realizados</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon streak">
            <i class="fas fa-fire"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ userData.stats.currentStreak }}</h3>
            <p class="stat-label">Dias Consecutivos</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-target"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ userData.stats.completedThisWeek }}/{{ userData.stats.weeklyGoal }}</h3>
            <p class="stat-label">Meta Semanal</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ calculateTotalHours() }}h</h3>
            <p class="stat-label">Total de Horas</p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Current Workout -->
        <div class="content-card workout-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-dumbbell"></i>
              Próximo Treino
            </h2>
            <span class="workout-status">Agendado</span>
          </div>
          
          <div class="workout-preview" v-if="userData.currentWorkout">
            <h3 class="workout-name">{{ userData.currentWorkout.name }}</h3>
            <div class="workout-exercises">
              <div 
                v-for="exercise in userData.currentWorkout.exercises.slice(0, 3)" 
                :key="exercise.id"
                class="exercise-preview"
              >
                <span class="exercise-name">{{ exercise.name }}</span>
                <span class="exercise-details">{{ exercise.sets }}x{{ exercise.reps }} - {{ exercise.weight }}kg</span>
              </div>
              <div v-if="userData.currentWorkout.exercises.length > 3" class="more-exercises">
                +{{ userData.currentWorkout.exercises.length - 3 }} mais exercícios
              </div>
            </div>
            
            <button @click="startWorkout" class="start-workout-btn">
              <i class="fas fa-play"></i>
              Iniciar Treino
            </button>
          </div>
          
          <div v-else class="no-workout">
            <i class="fas fa-calendar-times"></i>
            <p>Nenhum treino agendado</p>
            <button @click="$router.push('/student/workouts')" class="btn-outline">
              Ver Treinos Disponíveis
            </button>
          </div>
        </div>

        <!-- Weekly Progress -->
        <div class="content-card progress-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-chart-bar"></i>
              Progresso Semanal
            </h2>
          </div>
          
          <div class="week-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: (userData.stats.completedThisWeek / userData.stats.weeklyGoal) * 100 + '%' }"
              ></div>
            </div>
            <p class="progress-text">
              {{ userData.stats.completedThisWeek }} de {{ userData.stats.weeklyGoal }} treinos concluídos
            </p>
          </div>
          
          <div class="week-calendar">
            <div 
              v-for="(day, index) in getWeekDays()" 
              :key="index"
              class="day-item"
              :class="{ 'completed': day.completed, 'today': day.isToday }"
            >
              <span class="day-name">{{ day.name }}</span>
              <div class="day-indicator">
                <i v-if="day.completed" class="fas fa-check"></i>
                <i v-else-if="day.isToday" class="fas fa-dot-circle"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="content-card activity-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-history"></i>
              Atividade Recente
            </h2>
            <router-link to="/student/history" class="view-all">Ver Tudo</router-link>
          </div>
          
          <div class="activity-list">
            <div v-for="activity in getRecentActivities()" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <i :class="activity.icon"></i>
              </div>
              <div class="activity-content">
                <p class="activity-title">{{ activity.title }}</p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Goals -->
        <div class="content-card goals-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-bullseye"></i>
              Metas
            </h2>
            <router-link to="/student/goals" class="view-all">Gerenciar</router-link>
          </div>
          
          <div class="goals-list">
            <div v-for="goal in userData.personalInfo.goals" :key="goal" class="goal-item">
              <div class="goal-progress">
                <div class="goal-progress-bar">
                  <div class="goal-progress-fill" :style="{ width: Math.random() * 100 + '%' }"></div>
                </div>
              </div>
              <p class="goal-text">{{ goal }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Source Toggle (Development) -->
      <div class="data-toggle" v-if="showDataToggle">
        <button @click="authStore.toggleMockData()" class="toggle-btn">
          <i class="fas fa-database"></i>
          {{ authStore.useMockData ? 'Usando Dados Demo' : 'Usando Dados Reais' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { useRouter } from 'vue-router';
import StudentNavBar from '@/components/StudentNavBar.vue';

export default {
  name: 'DashboardStudent',
  components: {
    StudentNavBar
  },
  setup() {
    const authStore = useAuthStore();
    const themeStore = useThemeStore();
    const router = useRouter();
    
    const isDarkMode = computed(() => themeStore.isDarkMode);
    
    const userData = computed(() => authStore.currentUser || {
      stats: { totalWorkouts: 0, currentStreak: 0, weeklyGoal: 4, completedThisWeek: 0 },
      personalInfo: { goals: [] },
      currentWorkout: null
    });
    
    const showDataToggle = computed(() => {
      return process.env.NODE_ENV === 'development';
    });
    
    const getWelcomeMessage = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Bom dia! Pronto para treinar?';
      if (hour < 18) return 'Boa tarde! Que tal um treino?';
      return 'Boa noite! Ainda dá tempo de treinar!';
    };
    
    const calculateTotalHours = () => {
      return Math.round(userData.value.stats.totalWorkouts * 1.2);
    };
    
    const getWeekDays = () => {
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const today = new Date().getDay();
      const completedDays = userData.value.stats.completedThisWeek;
      
      return days.map((name, index) => ({
        name,
        completed: index < completedDays && index <= today,
        isToday: index === today
      }));
    };
    
    const getRecentActivities = () => {
      return [
        {
          id: 1,
          type: 'workout',
          icon: 'fas fa-dumbbell',
          title: 'Treino A - Peito e Tríceps concluído',
          time: 'Há 2 dias'
        },
        {
          id: 2,
          type: 'progress',
          icon: 'fas fa-chart-line',
          title: 'Peso atualizado para 78.5kg',
          time: 'Há 3 dias'
        },
        {
          id: 3,
          type: 'goal',
          icon: 'fas fa-target',
          title: 'Meta semanal de 3 treinos atingida',
          time: 'Há 5 dias'
        }
      ];
    };
    
    const startWorkout = () => {
      router.push('/student/workouts');
    };
    
    const viewProgress = () => {
      router.push('/student/progress');
    };
    
    return {
      authStore,
      userData,
      isDarkMode,
      showDataToggle,
      getWelcomeMessage,
      calculateTotalHours,
      getWeekDays,
      getRecentActivities,
      startWorkout,
      viewProgress
    };
  }
};
</script>

<style scoped>
/* Layout principal */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dashboard-container.dark-mode {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
}

.dashboard-main {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  overflow-y: auto;
}

/* Floating Header */
.floating-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark-mode .floating-header {
  background: rgba(30, 30, 46, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark-mode .gradient-text {
  background: linear-gradient(135deg, #6441a5 0%, #8b5fd9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

.dark-mode .page-subtitle {
  color: #94a3b8;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.action-btn.primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.4);
}

.action-btn.secondary {
  background: white;
  color: #007bff;
  border: 2px solid #007bff;
}

.dark-mode .action-btn.secondary {
  background: rgba(100, 65, 165, 0.1);
  color: #8b5fd9;
  border-color: #6441a5;
}

.action-btn.secondary:hover {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
}

.dark-mode .action-btn.secondary:hover {
  background: #6441a5;
  color: white;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-mode .stat-card {
  background: rgba(30, 30, 46, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.3);
}

.dark-mode .stat-icon {
  background: linear-gradient(135deg, #6441a5 0%, #8b5fd9 100%);
  box-shadow: 0 4px 16px rgba(100, 65, 165, 0.3);
}

.stat-icon.streak {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.dark-mode .stat-value {
  color: #f1f5f9;
}

.stat-label {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
}

.dark-mode .stat-label {
  color: #94a3b8;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-mode .content-card {
  background: rgba(30, 30, 46, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.dark-mode .card-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.dark-mode .card-title {
  color: #f1f5f9;
}

.card-title i {
  color: #007bff;
}

.dark-mode .card-title i {
  color: #6441a5;
}

.view-all {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.dark-mode .view-all {
  color: #8b5fd9;
}

.view-all:hover {
  color: #0056b3;
  text-decoration: underline;
}

.dark-mode .view-all:hover {
  color: #6441a5;
}

/* Workout Card */
.workout-status {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 24px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.workout-preview {
  padding: 0.5rem 0;
}

.workout-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1.25rem 0;
}

.dark-mode .workout-name {
  color: #f1f5f9;
}

.workout-exercises {
  margin-bottom: 1.5rem;
}

.exercise-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.dark-mode .exercise-preview {
  background: rgba(255, 255, 255, 0.05);
}

.exercise-preview:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateX(4px);
}

.dark-mode .exercise-preview:hover {
  background: rgba(255, 255, 255, 0.08);
}

.exercise-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.dark-mode .exercise-name {
  color: #f1f5f9;
}

.exercise-details {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.dark-mode .exercise-details {
  color: #94a3b8;
}

.more-exercises {
  text-align: center;
  color: #64748b;
  font-style: italic;
  padding: 0.75rem 0;
  font-size: 0.9rem;
}

.dark-mode .more-exercises {
  color: #94a3b8;
}

.start-workout-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.start-workout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.no-workout {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
}

.dark-mode .no-workout {
  color: #94a3b8;
}

.no-workout i {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.3;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-outline {
  background: transparent;
  color: #007bff;
  border: 2px solid #007bff;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1rem;
}

.dark-mode .btn-outline {
  color: #8b5fd9;
  border-color: #6441a5;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.dark-mode .btn-outline:hover {
  background: #6441a5;
  border-color: #6441a5;
}

/* Progress Card */
.week-progress {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 16px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
}

.dark-mode .progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
  border-radius: 12px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.dark-mode .progress-fill {
  background: linear-gradient(90deg, #6441a5 0%, #8b5fd9 100%);
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  text-align: center;
  color: #475569;
  margin: 0 0 2rem 0;
  font-weight: 600;
  font-size: 0.95rem;
}

.dark-mode .progress-text {
  color: #cbd5e1;
}

.week-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
}

.day-item {
  text-align: center;
  padding: 1rem 0.75rem;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.dark-mode .day-item {
  background: rgba(255, 255, 255, 0.05);
}

.day-item.completed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.day-item.today {
  background: rgba(0, 123, 255, 0.1);
  border-color: #007bff;
  color: #007bff;
  font-weight: 700;
}

.dark-mode .day-item.today {
  background: rgba(100, 65, 165, 0.15);
  border-color: #6441a5;
  color: #8b5fd9;
}

.day-item:hover:not(.completed) {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
}

.dark-mode .day-item:hover:not(.completed) {
  background: rgba(255, 255, 255, 0.08);
}

.day-name {
  font-size: 0.85rem;
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day-indicator {
  font-size: 1.4rem;
}

.day-item.completed .day-indicator i {
  animation: checkPop 0.3s ease-out;
}

@keyframes checkPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Activity Card */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.dark-mode .activity-item {
  background: rgba(255, 255, 255, 0.05);
}

.activity-item:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateX(4px);
}

.dark-mode .activity-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.activity-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.activity-icon.workout {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.activity-icon.progress {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.activity-icon.goal {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
}

.dark-mode .activity-title {
  color: #f1f5f9;
}

.activity-time {
  color: #64748b;
  font-size: 0.85rem;
}

.dark-mode .activity-time {
  color: #94a3b8;
}

/* Goals Card */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.goal-item {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.dark-mode .goal-item {
  background: rgba(255, 255, 255, 0.05);
}

.goal-item:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateX(4px);
}

.dark-mode .goal-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.goal-progress {
  margin-bottom: 0.75rem;
}

.goal-progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.dark-mode .goal-progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.goal-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
  border-radius: 8px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.goal-text {
  color: #475569;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.dark-mode .goal-text {
  color: #cbd5e1;
}

/* Data Toggle */
.data-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.toggle-btn {
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 0.875rem 1.25rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  backdrop-filter: blur(16px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.toggle-btn:hover {
  background: rgba(0, 0, 0, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.toggle-btn i {
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-main {
    margin-left: 0;
    margin-bottom: 70px;
    padding: 1rem;
  }
  
  .floating-header {
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
    padding: 1rem 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.25rem;
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.75rem;
  }
  
  .stat-label {
    font-size: 0.85rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .content-card {
    border-radius: 16px;
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.2rem;
  }
  
  .week-calendar {
    gap: 0.5rem;
  }
  
  .day-item {
    padding: 0.75rem 0.5rem;
  }
  
  .day-name {
    font-size: 0.75rem;
  }
  
  .day-indicator {
    font-size: 1.2rem;
  }
  
  .data-toggle {
    bottom: 5rem;
    right: 1rem;
  }
  
  .toggle-btn {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .dashboard-main {
    padding: 0.75rem;
  }
  
  .floating-header {
    padding: 1.25rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: row;
    text-align: left;
  }
  
  .week-calendar {
    gap: 0.35rem;
  }
  
  .day-item {
    padding: 0.6rem 0.25rem;
  }
  
  .day-name {
    font-size: 0.65rem;
  }
  
  .day-indicator {
    font-size: 1rem;
  }
  
  .activity-icon {
    width: 42px;
    height: 42px;
    font-size: 1rem;
  }
  
  .activity-title {
    font-size: 0.9rem;
  }
}
</style>