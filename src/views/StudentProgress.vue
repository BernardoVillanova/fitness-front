<template>
  <div class="student-progress" :class="{ 'dark-mode': isDarkMode }">
    <StudentNavBar />
    
    <main class="main-content">
      <!-- Header -->
      <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">Meu Progresso</h1>
        <p class="page-subtitle">Acompanhe sua evolução e conquistas</p>
      </div>
    </div>

    <!-- Progress Overview -->
    <div class="progress-overview">
      <div class="overview-card main">
        <div class="card-header">
          <h3>Progresso Geral</h3>
          <span class="period">Últimos 30 dias</span>
        </div>
        <div class="main-progress">
          <div class="progress-circle">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e2e8f0"
                stroke-width="8"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#progressGradient)"
                stroke-width="8"
                stroke-dasharray="314"
                :stroke-dashoffset="314 - (314 * overallProgress / 100)"
                stroke-linecap="round"
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#667eea"/>
                  <stop offset="100%" style="stop-color:#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="progress-text">
              <div class="progress-percentage">{{ overallProgress }}%</div>
              <div class="progress-label">Completo</div>
            </div>
          </div>
          <div class="progress-details">
            <div class="detail-item">
              <span class="detail-number">{{ completedWorkouts }}</span>
              <span class="detail-label">Treinos Concluídos</span>
            </div>
            <div class="detail-item">
              <span class="detail-number">{{ totalGoals }}</span>
              <span class="detail-label">Metas Atingidas</span>
            </div>
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <i class="fas fa-fire"></i>
        </div>
        <div class="card-content">
          <div class="card-number">{{ totalCalories }}</div>
          <div class="card-label">Calorias Queimadas</div>
          <div class="card-change positive">
            <i class="fas fa-arrow-up"></i>
            +12% vs mês anterior
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="card-content">
          <div class="card-number">{{ totalTime }}h</div>
          <div class="card-label">Tempo de Treino</div>
          <div class="card-change positive">
            <i class="fas fa-arrow-up"></i>
            +8% vs mês anterior
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <i class="fas fa-dumbbell"></i>
        </div>
        <div class="card-content">
          <div class="card-number">{{ currentStreak }}</div>
          <div class="card-label">Sequência Atual</div>
          <div class="card-change">
            <i class="fas fa-calendar"></i>
            dias consecutivos
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Progress Chart -->
    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>Atividade Semanal</h3>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color primary"></div>
              <span>Treinos</span>
            </div>
            <div class="legend-item">
              <div class="legend-color secondary"></div>
              <span>Calorias (x100)</span>
            </div>
          </div>
        </div>
        <div class="chart-container">
          <div class="chart-bars">
            <div 
              v-for="(day, index) in weeklyData" 
              :key="index"
              class="bar-group"
            >
              <div class="bar-container">
                <div 
                  class="bar primary" 
                  :style="{ height: (day.workouts / 3 * 100) + '%' }"
                ></div>
                <div 
                  class="bar secondary" 
                  :style="{ height: (day.calories / 500 * 100) + '%' }"
                ></div>
              </div>
              <div class="bar-label">{{ day.day }}</div>
            </div>
          </div>
          <div class="chart-grid">
            <div class="grid-line" v-for="i in 5" :key="i"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Goals Section -->
    <div class="goals-section">
      <div class="section-header">
        <h3>Metas do Mês</h3>
        <button class="add-goal-btn" @click="showAddGoal = true">
          <i class="fas fa-plus"></i>
          Nova Meta
        </button>
      </div>

      <div class="goals-grid">
        <div 
          v-for="goal in monthlyGoals" 
          :key="goal.id"
          class="goal-card"
          :class="{ completed: goal.progress >= 100 }"
        >
          <div class="goal-header">
            <div class="goal-icon">
              <i :class="goal.icon"></i>
            </div>
            <div class="goal-info">
              <h4>{{ goal.title }}</h4>
              <p>{{ goal.description }}</p>
            </div>
          </div>
          
          <div class="goal-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: Math.min(goal.progress, 100) + '%' }"
              ></div>
            </div>
            <div class="progress-text">
              <span class="current">{{ goal.current }}</span> / 
              <span class="target">{{ goal.target }}</span>
              <span class="unit">{{ goal.unit }}</span>
            </div>
          </div>

          <div class="goal-status">
            <span v-if="goal.progress >= 100" class="status-badge completed">
              <i class="fas fa-check"></i>
              Concluído
            </span>
            <span v-else class="status-badge in-progress">
              {{ Math.round(goal.progress) }}% completo
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Goal Modal -->
    <div v-if="showAddGoal" class="modal-overlay" @click="showAddGoal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Nova Meta</h3>
          <button @click="showAddGoal = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Tipo de Meta:</label>
            <select v-model="newGoal.type" class="form-select">
              <option value="workouts">Quantidade de Treinos</option>
              <option value="calories">Calorias Queimadas</option>
              <option value="time">Tempo de Exercício</option>
              <option value="weight">Perda de Peso</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Meta:</label>
            <input 
              v-model="newGoal.target" 
              type="number" 
              class="form-input"
              placeholder="Ex: 20"
            >
          </div>
          
          <div class="form-group">
            <label>Descrição:</label>
            <input 
              v-model="newGoal.description" 
              type="text" 
              class="form-input"
              placeholder="Descreva sua meta"
            >
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showAddGoal = false" class="btn secondary">
            Cancelar
          </button>
          <button @click="addGoal" class="btn primary">
            Criar Meta
          </button>
        </div>
      </div>
    </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/theme'
import StudentNavBar from '@/components/StudentNavBar.vue'
import api from '@/api'

// Stores
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

// Reactive data
const showAddGoal = ref(false)
const loading = ref(true)
const newGoal = ref({
  type: 'workouts',
  target: '',
  description: ''
})

// Data from API
const progressData = ref({
  completedWorkouts: 0,
  totalWorkouts: 0,
  totalCalories: 0,
  totalTime: 0,
  currentStreak: 0,
  totalGoals: 0
})

const weeklyData = ref([
  { day: 'Dom', workouts: 0, calories: 0 },
  { day: 'Seg', workouts: 0, calories: 0 },
  { day: 'Ter', workouts: 0, calories: 0 },
  { day: 'Qua', workouts: 0, calories: 0 },
  { day: 'Qui', workouts: 0, calories: 0 },
  { day: 'Sex', workouts: 0, calories: 0 },
  { day: 'Sáb', workouts: 0, calories: 0 }
])

const monthlyGoals = ref([])

// Computed
const overallProgress = computed(() => {
  if (progressData.value.totalWorkouts === 0) return 0
  return Math.round((progressData.value.completedWorkouts / progressData.value.totalWorkouts) * 100)
})

const completedWorkouts = computed(() => progressData.value.completedWorkouts)
const totalGoals = computed(() => progressData.value.totalGoals)
const totalCalories = computed(() => progressData.value.totalCalories)
const totalTime = computed(() => progressData.value.totalTime)
const currentStreak = computed(() => progressData.value.currentStreak)

// Methods
const fetchProgressData = async () => {
  try {
    loading.value = true
    
    // Buscar histórico de treinos
    const historyResponse = await api.get('/student/sessions/history')
    const sessions = historyResponse.data
    
    // Calcular dados de progresso
    const completedSessions = sessions.filter(s => s.status === 'completed')
    progressData.value.completedWorkouts = completedSessions.length
    
    // Calcular total de treinos disponíveis
    const workoutsResponse = await api.get('/student/workouts')
    const workouts = workoutsResponse.data
    progressData.value.totalWorkouts = workouts.reduce((total, plan) => {
      return total + (plan.divisions?.length || 0) * 4 // 4 sessões por divisão/mês
    }, 0) || 24
    
    // Calcular calorias e tempo total
    progressData.value.totalCalories = completedSessions.reduce((total, session) => {
      return total + (session.caloriesBurned || 0)
    }, 0)
    
    progressData.value.totalTime = completedSessions.reduce((total, session) => {
      const duration = session.endTime && session.startTime 
        ? (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60 * 60)
        : 0
      return total + duration
    }, 0)
    
    progressData.value.totalTime = Math.round(progressData.value.totalTime)
    
    // Calcular sequência
    calculateStreak(sessions)
    
    // Processar dados semanais
    processWeeklyData(sessions)
    
    // Buscar metas
    await fetchGoals()
    
  } catch (error) {
    console.error('Erro ao buscar dados de progresso:', error)
  } finally {
    loading.value = false
  }
}

const calculateStreak = (sessions) => {
  if (!sessions || sessions.length === 0) {
    progressData.value.currentStreak = 0
    return
  }
  
  const completedSessions = sessions
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
  
  if (completedSessions.length === 0) {
    progressData.value.currentStreak = 0
    return
  }
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < completedSessions.length; i++) {
    const sessionDate = new Date(completedSessions[i].endTime)
    sessionDate.setHours(0, 0, 0, 0)
    
    const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === streak) {
      streak++
    } else if (daysDiff > streak) {
      break
    }
  }
  
  progressData.value.currentStreak = streak
}

const processWeeklyData = (sessions) => {
  const completedSessions = sessions.filter(s => s.status === 'completed')
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)
  
  // Reset weekly data
  weeklyData.value = [
    { day: 'Dom', workouts: 0, calories: 0 },
    { day: 'Seg', workouts: 0, calories: 0 },
    { day: 'Ter', workouts: 0, calories: 0 },
    { day: 'Qua', workouts: 0, calories: 0 },
    { day: 'Qui', workouts: 0, calories: 0 },
    { day: 'Sex', workouts: 0, calories: 0 },
    { day: 'Sáb', workouts: 0, calories: 0 }
  ]
  
  completedSessions.forEach(session => {
    const sessionDate = new Date(session.endTime)
    if (sessionDate >= weekStart) {
      const dayOfWeek = sessionDate.getDay()
      weeklyData.value[dayOfWeek].workouts++
      weeklyData.value[dayOfWeek].calories += session.caloriesBurned || 0
    }
  })
}

const fetchGoals = async () => {
  try {
    // Por enquanto, criar metas baseadas nos dados reais
    const goals = []
    
    // Meta de treinos
    const workoutsGoal = {
      id: 1,
      title: 'Treinos no Mês',
      description: 'Completar 20 treinos este mês',
      icon: 'fas fa-dumbbell',
      current: progressData.value.completedWorkouts,
      target: 20,
      unit: 'treinos',
      progress: Math.min(100, (progressData.value.completedWorkouts / 20) * 100)
    }
    goals.push(workoutsGoal)
    
    // Meta de calorias
    const caloriesGoal = {
      id: 2,
      title: 'Queimar Calorias',
      description: 'Queimar 5000 calorias no mês',
      icon: 'fas fa-fire',
      current: progressData.value.totalCalories,
      target: 5000,
      unit: 'kcal',
      progress: Math.min(100, (progressData.value.totalCalories / 5000) * 100)
    }
    goals.push(caloriesGoal)
    
    // Meta de tempo
    const timeGoal = {
      id: 3,
      title: 'Tempo de Exercício',
      description: 'Exercitar por 40 horas no mês',
      icon: 'fas fa-clock',
      current: progressData.value.totalTime,
      target: 40,
      unit: 'horas',
      progress: Math.min(100, (progressData.value.totalTime / 40) * 100)
    }
    goals.push(timeGoal)
    
    monthlyGoals.value = goals
    progressData.value.totalGoals = goals.filter(g => g.progress >= 100).length
    
  } catch (error) {
    console.error('Erro ao buscar metas:', error)
  }
}

const addGoal = () => {
  if (!newGoal.value.target || !newGoal.value.description) return
  
  const goalIcons = {
    workouts: 'fas fa-dumbbell',
    calories: 'fas fa-fire',
    time: 'fas fa-clock',
    weight: 'fas fa-weight'
  }
  
  const goalUnits = {
    workouts: 'treinos',
    calories: 'kcal',
    time: 'horas',
    weight: 'kg'
  }
  
  const newGoalData = {
    id: monthlyGoals.value.length + 1,
    title: newGoal.value.description,
    description: `Meta: ${newGoal.value.target} ${goalUnits[newGoal.value.type]}`,
    icon: goalIcons[newGoal.value.type],
    current: 0,
    target: parseInt(newGoal.value.target),
    unit: goalUnits[newGoal.value.type],
    progress: 0
  }
  
  monthlyGoals.value.push(newGoalData)
  
  // Reset form
  newGoal.value = {
    type: 'workouts',
    target: '',
    description: ''
  }
  
  showAddGoal.value = false
}

// Lifecycle
onMounted(async () => {
  await fetchProgressData()
})
</script>

<style scoped>
.student-progress {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Detecta quando o navbar está colapsado globalmente */
body:has(.navbar-collapsed) .main-content {
  margin-left: 0 !important;
}

.header-section {
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin: 0;
}

/* Progress Overview */
.progress-overview {
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1.5rem;
}

.overview-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.dark-mode .overview-card {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.overview-card.main {
  grid-row: span 2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.period {
  font-size: 0.9rem;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.main-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.progress-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-text {
  position: absolute;
  text-align: center;
}

.progress-percentage {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.progress-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.progress-details {
  display: flex;
  gap: 2rem;
  width: 100%;
  justify-content: center;
}

.detail-item {
  text-align: center;
}

.detail-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.detail-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.card-content {
  text-align: left;
}

.card-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.card-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.card-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-change.positive {
  color: var(--success-color);
}

.card-change i {
  font-size: 0.7rem;
}

/* Chart Section */
.chart-section {
  max-width: 1200px;
  margin: 0 auto 2rem;
}

.chart-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.dark-mode .chart-card {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.chart-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.primary {
  background: var(--primary-color);
}

.legend-color.secondary {
  background: var(--warning-color);
}

.chart-container {
  position: relative;
  height: 200px;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-line {
  height: 1px;
  background: var(--border-color);
}

.chart-bars {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  height: 150px;
  display: flex;
  align-items: end;
  justify-content: space-around;
  gap: 1rem;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-container {
  display: flex;
  gap: 4px;
  align-items: end;
  height: 150px;
  margin-bottom: 0.5rem;
}

.bar {
  width: 20px;
  border-radius: 4px;
  min-height: 4px;
  transition: all 0.3s ease;
}

.bar.primary {
  background: var(--primary-color);
}

.bar.secondary {
  background: var(--warning-color);
}

.bar-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* Goals Section */
.goals-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.add-goal-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.add-goal-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.goal-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.dark-mode .goal-card {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.goal-card.completed {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--success-color);
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.dark-mode .goal-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.goal-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.goal-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.goal-card.completed .goal-icon {
  background: var(--success-color);
}

.goal-info {
  flex: 1;
}

.goal-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.goal-card.completed .goal-info h4 {
  color: var(--success-color);
}

.goal-info p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.goal-card.completed .goal-info p {
  color: var(--text-secondary);
}

.goal-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.goal-card.completed .progress-bar {
  background: rgba(16, 185, 129, 0.2);
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.goal-card.completed .progress-fill {
  background: var(--success-color);
}

.progress-text {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.goal-card.completed .progress-text {
  color: var(--success-color);
}

.current {
  font-weight: 600;
}

.goal-status {
  text-align: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.completed {
  background: var(--success-color);
  color: white;
}

.status-badge.in-progress {
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.close-btn {
  padding: 0.5rem;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--border-color);
  color: var(--text-color);
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.form-select,
.form-input {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .form-select:focus,
.dark-mode .form-input:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  border-top: 1px solid var(--border-color);
}

.btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn.secondary:hover {
  background: var(--border-color);
}

.btn.primary {
  background: var(--primary-color);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  background: var(--primary-hover);
}

.dark-mode .btn.primary:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 1.5rem;
  }
  
  .progress-overview {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .overview-card.main {
    grid-column: span 2;
    grid-row: span 1;
  }
  
  .main-progress {
    flex-direction: row;
    justify-content: space-around;
  }
  
  .progress-details {
    flex-direction: column;
    gap: 1rem;
  }
  
  .chart-container {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .student-progress {
    padding: 1rem 0.5rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .progress-overview {
    grid-template-columns: 1fr;
  }
  
  .overview-card {
    padding: 1.5rem;
  }
  
  .overview-card.main {
    grid-column: span 1;
  }
  
  .main-progress {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .chart-card {
    padding: 1.5rem 1rem;
  }
  
  .chart-container {
    padding: 1rem;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .goals-section {
    padding: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .modal-content {
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    flex-direction: column;
    padding: 1rem 1.5rem 1.5rem;
  }
  
  .btn {
    width: 100%;
  }
  
  .goals-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 0.5rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}
</style>