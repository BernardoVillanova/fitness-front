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
              <span 
                v-if="comparisons.workouts.trend !== 'neutral'" 
                class="detail-comparison" 
                :class="comparisons.workouts.trend"
              >
                <i :class="comparisons.workouts.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ comparisons.workouts.value }}%
              </span>
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
          <i class="fas fa-dumbbell"></i>
        </div>
        <div class="card-content">
          <div class="card-number">{{ totalCalories }}</div>
          <div class="card-label">Calorias Queimadas</div>
          <div 
            v-if="comparisons.calories.trend !== 'neutral'" 
            class="card-change" 
            :class="comparisons.calories.trend === 'up' ? 'positive' : 'negative'"
          >
            <i :class="comparisons.calories.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ comparisons.calories.trend === 'up' ? '+' : '-' }}{{ comparisons.calories.value }}% vs mês anterior
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
          <div 
            v-if="comparisons.time.trend !== 'neutral'" 
            class="card-change" 
            :class="comparisons.time.trend === 'up' ? 'positive' : 'negative'"
          >
            <i :class="comparisons.time.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ comparisons.time.trend === 'up' ? '+' : '-' }}{{ comparisons.time.value }}% vs mês anterior
          </div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <i class="fas fa-fire"></i>
        </div>
        <div class="card-content">
          <div class="card-number">{{ currentStreak }}</div>
          <div class="card-label">Sequência Atual</div>
          <div class="card-change-group">
            <div class="card-change neutral">
              <i class="fas fa-calendar"></i>
              dias consecutivos
            </div>
            <div 
              v-if="comparisons.streak.trend !== 'neutral'" 
              class="card-change" 
              :class="comparisons.streak.trend === 'up' ? 'positive' : 'negative'"
            >
              <i :class="comparisons.streak.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ comparisons.streak.trend === 'up' ? '+' : '-' }}{{ comparisons.streak.value }}% vs mês anterior
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Progress Chart -->
    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-title-section">
            <h3>Atividade Semanal</h3>
            <div class="week-period">{{ currentWeekPeriod }}</div>
          </div>
          <div class="chart-controls">
            <div class="chart-navigation">
              <button 
                @click="previousWeek" 
                class="nav-btn"
                :disabled="!canGoPrevious"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <span class="week-indicator">{{ weekIndicator }}</span>
              <button 
                @click="nextWeek" 
                class="nav-btn"
                :disabled="!canGoNext"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
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

    <!-- Body Measurements -->
    <div class="measurements-section">
      <div class="section-header">
        <div>
          <h3>Medidas Corporais</h3>
          <p class="section-subtitle">Evolução das suas circunferências registradas pelo seu personal trainer</p>
        </div>
        <div v-if="hasAnyMeasurements && latestMeasurementDate" class="measurement-date">
          <i class="fas fa-calendar-check"></i>
          Última atualização: {{ latestMeasurementDate }}
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!hasAnyMeasurements" class="empty-measurements-state">
        <div class="empty-icon">
          <i class="fas fa-ruler-combined"></i>
        </div>
        <h3>Nenhuma medida registrada</h3>
        <p>As medições corporais aparecerão aqui quando forem registradas pelo seu personal trainer. Entre em contato com ele para agendar suas avaliações físicas regulares.</p>
      </div>

      <!-- Measurements Grid -->
      <div v-else class="measurements-grid">
        <div 
          v-for="measurement in measurementsSummary" 
          :key="measurement.key"
          class="measurement-card"
          :class="{ 'no-data': !measurement.current }"
        >
          <div class="card-header">
            <div class="icon-wrapper" :style="{ background: measurement.color }">
              <i :class="measurement.icon"></i>
            </div>
            <div class="header-info">
              <h4>{{ measurement.label }}</h4>
              <span class="measurement-type">Circunferência</span>
            </div>
          </div>

          <div class="card-body">
            <div class="current-value">
              <span class="value">{{ measurement.current || '-' }}</span>
              <span v-if="measurement.current" class="unit">cm</span>
            </div>

            <div v-if="measurement.current && hasInitialMeasurement" class="progress-info">
              <div class="progress-bar-container">
                <div 
                  class="progress-bar" 
                  :class="{ 
                    positive: measurement.changePercent > 0, 
                    negative: measurement.changePercent < 0,
                    neutral: measurement.changePercent === 0 
                  }"
                  :style="{ width: Math.min(Math.abs(measurement.changePercent || 0), 100) + '%' }"
                ></div>
              </div>
              
              <div class="change-details">
                <div class="initial-value">
                  <span class="label">Inicial:</span>
                  <span class="value">{{ measurement.initial || '-' }} cm</span>
                </div>
                
                <div 
                  v-if="measurement.change !== null && measurement.change !== 0"
                  class="change-indicator"
                  :class="{ 
                    positive: measurement.change > 0, 
                    negative: measurement.change < 0 
                  }"
                >
                  <i :class="measurement.change > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                  <span class="change-value">{{ measurement.change > 0 ? '+' : '' }}{{ measurement.change }} cm</span>
                  <span class="change-percent">({{ measurement.changePercent > 0 ? '+' : '' }}{{ measurement.changePercent }}%)</span>
                </div>
              </div>
            </div>

            <div v-else-if="!hasInitialMeasurement && measurement.current" class="single-measurement-info">
              <i class="fas fa-info-circle"></i>
              <span>Primeira medição</span>
            </div>
          </div>
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
const loading = ref(true)

// Data from API
const progressData = ref({
  completedWorkouts: 0,
  totalWorkouts: 0,
  totalCalories: 0,
  totalTime: 0,
  currentStreak: 0,
  totalGoals: 0
})

// Measurements evolution data
const measurementsHistory = ref([])

const availableMeasurements = [
  { key: 'shoulder', label: 'Ombro', icon: 'fas fa-arrows-up-down', color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
  { key: 'chest', label: 'Peito', icon: 'fas fa-square', color: 'linear-gradient(135deg, #a855f7, #9333ea)' },
  { key: 'arm', label: 'Braço', icon: 'fas fa-hand-fist', color: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  { key: 'forearm', label: 'Antebraço', icon: 'fas fa-hand', color: 'linear-gradient(135deg, #10b981, #059669)' },
  { key: 'waist', label: 'Cintura', icon: 'fas fa-circle', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { key: 'hip', label: 'Quadril', icon: 'fas fa-circle-notch', color: 'linear-gradient(135deg, #ec4899, #db2777)' },
  { key: 'thigh', label: 'Coxa', icon: 'fas fa-grip-lines', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  { key: 'calf', label: 'Panturrilha', icon: 'fas fa-shoe-prints', color: 'linear-gradient(135deg, #6366f1, #4f46e5)' }
]

// Comparação com mês anterior
const lastMonthData = ref({
  completedWorkouts: 0,
  totalCalories: 0,
  totalTime: 0,
  currentStreak: 0
})

const comparisons = ref({
  workouts: { value: 0, trend: 'neutral' },
  calories: { value: 0, trend: 'neutral' },
  time: { value: 0, trend: 'neutral' },
  streak: { value: 0, trend: 'neutral' }
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

// Estado para navegação de semanas
const currentWeekOffset = ref(0) // 0 = semana atual, -1 = semana anterior, etc.
const allSessions = ref([]) // Guardar todas as sessões para processamento

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

// Computed para navegação de semanas
const currentWeekStart = computed(() => {
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay() + (currentWeekOffset.value * 7))
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
})

const currentWeekEnd = computed(() => {
  const weekEnd = new Date(currentWeekStart.value)
  weekEnd.setDate(weekEnd.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)
  return weekEnd
})

const currentWeekPeriod = computed(() => {
  const start = currentWeekStart.value
  const end = currentWeekEnd.value
  
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`
})

const weekIndicator = computed(() => {
  if (currentWeekOffset.value === 0) return 'Esta semana'
  if (currentWeekOffset.value === -1) return 'Semana passada'
  if (currentWeekOffset.value > 0) return `${currentWeekOffset.value} semanas à frente`
  return `${Math.abs(currentWeekOffset.value)} semanas atrás`
})

const canGoPrevious = computed(() => {
  // Permitir voltar até onde há dados de sessões
  if (allSessions.value.length === 0) return false
  
  const oldestSession = allSessions.value.reduce((oldest, session) => {
    const sessionDate = new Date(session.endTime || session.startTime)
    const oldestDate = new Date(oldest.endTime || oldest.startTime)
    return sessionDate < oldestDate ? session : oldest
  })
  
  const oldestWeekStart = new Date(oldestSession.endTime || oldestSession.startTime)
  oldestWeekStart.setDate(oldestWeekStart.getDate() - oldestWeekStart.getDay())
  oldestWeekStart.setHours(0, 0, 0, 0)
  
  return currentWeekStart.value > oldestWeekStart
})

const canGoNext = computed(() => {
  // Não permitir ir além da semana atual
  return currentWeekOffset.value < 0
})

// Computed for measurements chart
const hasAnyMeasurements = computed(() => {
  const result = measurementsHistory.value.length > 0
  return result
})

const hasInitialMeasurement = computed(() => {
  const result = measurementsHistory.value.some(m => m.isInitial === true)
  return result
})

const latestMeasurementDate = computed(() => {
  if (measurementsHistory.value.length === 0) return null
  const latestDate = new Date(measurementsHistory.value[measurementsHistory.value.length - 1].date)
  return latestDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
})

const measurementsSummary = computed(() => {
  return availableMeasurements.map(m => {
    const data = measurementsHistory.value
    
    // Pegar a última medição (mais recente)
    let current = null
    if (data.length > 0) {
      const lastMeasurement = data[data.length - 1]
      current = lastMeasurement[m.key]
    }
    
    // Pegar a medição inicial
    let initial = null
    if (hasInitialMeasurement.value) {
      const initialMeasurement = data.find(d => d.isInitial === true)
      if (initialMeasurement) {
        initial = initialMeasurement[m.key]
      }
    }
    
    // Calcular mudança e percentual apenas se tiver inicial e atual
    let change = null
    let changePercent = null
    if (initial != null && current != null && initial !== 0) {
      change = Math.round((current - initial) * 10) / 10
      changePercent = Math.round((change / initial) * 100)
    }
    
    return {
      ...m,
      current,
      initial,
      change,
      changePercent
    }
  })
})

// Methods
const fetchProgressData = async () => {
  try {
    loading.value = true
    
    // Buscar histórico de treinos completo
    const historyResponse = await api.get('/workout-sessions/sessions/history', {
      params: { limit: 1000 }
    })
    
    const sessions = historyResponse.data?.sessions || []
    allSessions.value = sessions // Guardar para navegação de semanas
    const completedSessions = sessions.filter(s => s.status === 'completed')
    
    // Calcular dados de progresso
    progressData.value.completedWorkouts = completedSessions.length
    
    // Calcular total de treinos disponíveis (estimativa)
    try {
      const workoutsResponse = await api.get('/workout-sessions/workouts')
      const workouts = workoutsResponse.data || []
      
      // Cada divisão pode ser feita 4x por mês
      progressData.value.totalWorkouts = workouts.reduce((total, plan) => {
        return total + (plan.divisions?.length || 0) * 4
      }, 0) || 24
    } catch (err) {
      progressData.value.totalWorkouts = 24 // Valor padrão
    }
    
    // Calcular calorias totais (com estimativa se não houver dados)
    progressData.value.totalCalories = completedSessions.reduce((total, session) => {
      // Estimar 5 cal/min se não tiver valor registrado
      let calories = session.caloriesBurned || 0
      if (!calories && session.duration) {
        calories = session.duration * 5
      }
      return total + calories
    }, 0)
    
    // Calcular tempo total em HORAS
    progressData.value.totalTime = completedSessions.reduce((total, session) => {
      let duration = session.duration // já em minutos
      if (!duration && session.endTime && session.startTime) {
        duration = Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)
      }
      return total + (duration || 0)
    }, 0)
    
    // Converter minutos para horas
    progressData.value.totalTime = Math.round(progressData.value.totalTime / 60)
    
    // Calcular sequência
    calculateStreak(completedSessions)
    
    // Processar dados semanais
    processWeeklyData(sessions)
    
    // Calcular comparações com mês anterior
    calculateMonthComparisons(completedSessions)
    
    // Buscar histórico de medidas corporais
    await fetchMeasurementsHistory()
    
  } catch (error) {
    console.error('Erro ao buscar dados de progresso:', error)
  } finally {
    loading.value = false
  }
}

const calculateMonthComparisons = (sessions) => {
  const now = new Date()
  
  // Mês anterior
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  lastMonthEnd.setHours(23, 59, 59, 999)
  
  // Filtrar sessões do mês anterior
  const lastMonthSessions = sessions.filter(s => {
    const sessionDate = new Date(s.endTime)
    return sessionDate >= lastMonthStart && sessionDate <= lastMonthEnd
  })
  
  // Calcular métricas do mês anterior
  lastMonthData.value.completedWorkouts = lastMonthSessions.length
  
  lastMonthData.value.totalCalories = lastMonthSessions.reduce((total, session) => {
    let calories = session.caloriesBurned || 0
    if (!calories && session.duration) {
      calories = session.duration * 5
    }
    return total + calories
  }, 0)
  
  lastMonthData.value.totalTime = lastMonthSessions.reduce((total, session) => {
    let duration = session.duration
    if (!duration && session.endTime && session.startTime) {
      duration = Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)
    }
    return total + (duration || 0)
  }, 0)
  lastMonthData.value.totalTime = Math.round(lastMonthData.value.totalTime / 60)
  
  // Calcular streak do mês anterior (último dia do mês anterior)
  const lastMonthStreakSessions = sessions.filter(s => {
    const sessionDate = new Date(s.endTime)
    return sessionDate <= lastMonthEnd
  }).sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
  
  let lastStreak = 0
  if (lastMonthStreakSessions.length > 0) {
    const lastMonthDate = new Date(lastMonthEnd)
    lastMonthDate.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < lastMonthStreakSessions.length; i++) {
      const sessionDate = new Date(lastMonthStreakSessions[i].endTime)
      sessionDate.setHours(0, 0, 0, 0)
      const daysDiff = Math.floor((lastMonthDate - sessionDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === lastStreak) {
        lastStreak++
      } else if (daysDiff > lastStreak) {
        break
      }
    }
  }
  lastMonthData.value.currentStreak = lastStreak
  
  // Calcular comparações percentuais
  // Treinos
  if (lastMonthData.value.completedWorkouts > 0) {
    const workoutsDiff = progressData.value.completedWorkouts - lastMonthData.value.completedWorkouts
    const workoutsPercent = Math.round((workoutsDiff / lastMonthData.value.completedWorkouts) * 100)
    comparisons.value.workouts = {
      value: Math.abs(workoutsPercent),
      trend: workoutsDiff > 0 ? 'up' : workoutsDiff < 0 ? 'down' : 'neutral'
    }
  }
  
  // Calorias
  if (lastMonthData.value.totalCalories > 0) {
    const caloriesDiff = progressData.value.totalCalories - lastMonthData.value.totalCalories
    const caloriesPercent = Math.round((caloriesDiff / lastMonthData.value.totalCalories) * 100)
    comparisons.value.calories = {
      value: Math.abs(caloriesPercent),
      trend: caloriesDiff > 0 ? 'up' : caloriesDiff < 0 ? 'down' : 'neutral'
    }
  }
  
  // Tempo
  if (lastMonthData.value.totalTime > 0) {
    const timeDiff = progressData.value.totalTime - lastMonthData.value.totalTime
    const timePercent = Math.round((timeDiff / lastMonthData.value.totalTime) * 100)
    comparisons.value.time = {
      value: Math.abs(timePercent),
      trend: timeDiff > 0 ? 'up' : timeDiff < 0 ? 'down' : 'neutral'
    }
  }
  
  // Streak
  if (lastMonthData.value.currentStreak > 0) {
    const streakDiff = progressData.value.currentStreak - lastMonthData.value.currentStreak
    const streakPercent = Math.round((streakDiff / lastMonthData.value.currentStreak) * 100)
    comparisons.value.streak = {
      value: Math.abs(streakPercent),
      trend: streakDiff > 0 ? 'up' : streakDiff < 0 ? 'down' : 'neutral'
    }
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

const processWeeklyData = (sessions, weekStart = null, weekEnd = null) => {
  const completedSessions = sessions.filter(s => s.status === 'completed')
  
  // Se não fornecidas, usar as datas da semana atual baseada no offset
  const start = weekStart || currentWeekStart.value
  const end = weekEnd || currentWeekEnd.value
  
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
    if (sessionDate >= start && sessionDate <= end) {
      const dayOfWeek = sessionDate.getDay()
      weeklyData.value[dayOfWeek].workouts++
      
      // Calcular calorias (estimar se não houver dados)
      let calories = session.caloriesBurned || 0
      if (!calories && session.duration) {
        calories = session.duration * 5 // ~5 cal/min
      }
      weeklyData.value[dayOfWeek].calories += calories
    }
  })
}

// Funções de navegação de semanas
const previousWeek = () => {
  if (canGoPrevious.value) {
    currentWeekOffset.value--
    processWeeklyData(allSessions.value)
  }
}

const nextWeek = () => {
  if (canGoNext.value) {
    currentWeekOffset.value++
    processWeeklyData(allSessions.value)
  }
}

const fetchMeasurementsHistory = async () => {
  try {
    const userData = JSON.parse(sessionStorage.getItem('user'))
    
    const userId = userData.id
    
    const studentResponse = await api.get(`/students/user/${userId}`)
    const studentData = studentResponse.data
    
    const initialMeasurements = studentData?.personalInfo?.initialMeasurements
    const progressHistory = studentData?.progressHistory || []
    
    const history = []
    
    // Adicionar medida inicial se existir e tiver pelo menos uma medida não-null
    if (initialMeasurements) {
      const measurementValues = {
        shoulder: initialMeasurements.shoulder,
        chest: initialMeasurements.chest,
        arm: initialMeasurements.arm,
        forearm: initialMeasurements.forearm,
        waist: initialMeasurements.waist,
        hip: initialMeasurements.hip,
        thigh: initialMeasurements.thigh,
        calf: initialMeasurements.calf
      }
      
      const hasAnyInitialMeasurement = Object.values(measurementValues).some(v => {
        return v !== null && v !== undefined && v !== '' && !isNaN(v)
      })
      
      if (hasAnyInitialMeasurement && studentData?.createdAt) {
        const initialEntry = {
          date: studentData.createdAt,
          isInitial: true,
          shoulder: initialMeasurements.shoulder,
          chest: initialMeasurements.chest,
          arm: initialMeasurements.arm,
          forearm: initialMeasurements.forearm,
          waist: initialMeasurements.waist,
          hip: initialMeasurements.hip,
          thigh: initialMeasurements.thigh,
          calf: initialMeasurements.calf
        }
        
        history.push(initialEntry)
      }
    } else {
      console.log('⚠️ Nenhuma medida inicial encontrada')
    }
    
    progressHistory.forEach((p) => {
      
      if (p.measurements) {
        const progressEntry = {
          date: p.date,
          isInitial: false,
          shoulder: p.measurements.shoulder,
          chest: p.measurements.chest,
          arm: p.measurements.arm,
          forearm: p.measurements.forearm,
          waist: p.measurements.waist,
          hip: p.measurements.hip,
          thigh: p.measurements.thigh,
          calf: p.measurements.calf,
          weight: p.weight
        }
        
        history.push(progressEntry)
      } else {
        console.log('⚠️ Entrada sem measurements, pulando...')
      }
    })
    
    // Ordenar por data
    history.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    measurementsHistory.value = history
    
    availableMeasurements.forEach(m => {
      const count = history.filter(h => h[m.key] != null && h[m.key] !== '').length
      console.log(`  ${m.label} (${m.key}): ${count} medições`)
    })
    
  } catch (error) {
    console.error('❌ Erro ao buscar histórico de medidas:', error)
    console.error('Stack:', error.stack)
    measurementsHistory.value = []
  }
}



// Lifecycle
onMounted(async () => {
  await fetchProgressData()
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

.student-progress {
  display: flex;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
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

.card-change.positive {
  color: var(--success-color);
}

.card-change.negative {
  color: var(--danger-color);
}

.card-change.neutral {
  color: var(--text-muted);
}

.card-change-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-comparison {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
}

.detail-comparison.up {
  color: var(--success-color);
  background: rgba(16, 185, 129, 0.1);
}

.detail-comparison.down {
  color: var(--danger-color);
  background: rgba(239, 68, 68, 0.1);
}

.detail-comparison i {
  font-size: 0.65rem;
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

.chart-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chart-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.week-period {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.chart-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.nav-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.nav-btn:not(:disabled):hover {
  background: var(--primary-color);
  color: white;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.week-indicator {
  font-size: 0.85rem;
  color: var(--text-color);
  font-weight: 500;
  min-width: 120px;
  text-align: center;
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

/* Measurements Section */
.measurements-section {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.section-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
}

.measurement-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 12px;
}

.measurement-date i {
  color: var(--primary-color);
}

/* Empty State */
.empty-measurements-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: var(--card-bg);
  border: 2px dashed var(--border-color);
  border-radius: 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.empty-icon i {
  font-size: 2.5rem;
  color: #667eea;
}

.dark-mode .empty-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
}

.dark-mode .empty-icon i {
  color: #8b9aff;
}

.empty-measurements-state h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.empty-measurements-state p {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
  max-width: 500px;
}

/* Measurements Grid */
.measurements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.measurement-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  overflow: hidden;
}

.measurement-card:hover:not(.no-data) {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.dark-mode .measurement-card:hover:not(.no-data) {
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.measurement-card.no-data {
  opacity: 0.5;
  background: var(--bg-secondary);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.header-info {
  flex: 1;
}

.header-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.measurement-type {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.current-value {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.current-value .value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.current-value .unit {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-muted);
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.progress-bar-container {
  width: 100%;
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.progress-bar.positive {
  background: linear-gradient(90deg, var(--success-color), #059669);
}

.progress-bar.negative {
  background: linear-gradient(90deg, var(--danger-color), #dc2626);
}

.progress-bar.neutral {
  background: linear-gradient(90deg, var(--text-muted), #94a3b8);
}

.change-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.initial-value {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.initial-value .label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.initial-value .value {
  font-size: 0.9rem;
  color: var(--text-color);
  font-weight: 600;
}

.change-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
}

.change-indicator.positive {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.change-indicator.negative {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.change-indicator i {
  font-size: 0.75rem;
}

.change-value {
  font-weight: 700;
}

.change-percent {
  opacity: 0.8;
  font-size: 0.8rem;
}

.single-measurement-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.dark-mode .single-measurement-info {
  background: rgba(102, 126, 234, 0.1);
}

.single-measurement-info i {
  color: #667eea;
  font-size: 0.9rem;
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
  
  .chart-controls {
    width: 100%;
    flex-direction: column;
    gap: 1rem;
  }
  
  .chart-navigation {
    align-self: center;
  }
  
  .week-indicator {
    min-width: 100px;
    font-size: 0.8rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .measurement-date {
    width: 100%;
  }
  
  .measurements-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .current-value .value {
    font-size: 2rem;
  }
}
</style>