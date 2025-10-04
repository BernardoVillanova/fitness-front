<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dashboard-container" :class="{ 'dark-mode': isDarkMode }">
    <StudentNavBar />
    
    <main class="dashboard-main">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">
              Olá, {{ getUserName() }}! 👋
            </h1>
            <p class="page-subtitle">
              {{ getWelcomeMessage() }}
            </p>
          </div>
          
          <div class="header-actions">
            <button @click="startWorkout" class="btn-primary">
              <i class="fas fa-play"></i>
              <span>Iniciar Treino</span>
            </button>
            <button @click="viewProgress" class="btn-outline">
              <i class="fas fa-chart-line"></i>
              <span>Ver Progresso</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <i class="fas fa-dumbbell"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ dashboardData.totalWorkouts }}</h3>
            <p class="stat-label">Treinos Realizados</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon orange">
            <i class="fas fa-fire"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ dashboardData.currentStreak }}</h3>
            <p class="stat-label">Dias Consecutivos</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon blue">
            <i class="fas fa-calendar-check"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ dashboardData.completedThisWeek }}/{{ dashboardData.weeklyGoal }}</h3>
            <p class="stat-label">Meta Semanal</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon blue">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ dashboardData.totalHours }}h</h3>
            <p class="stat-label">Total de Horas</p>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Próximo Treino -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-dumbbell"></i>
              Próximo Treino
            </h2>
            <span v-if="nextWorkout" class="badge-success">Agendado</span>
          </div>
          
          <div v-if="loading" class="card-loading">
            <div class="spinner"></div>
            <p>Carregando...</p>
          </div>

          <div v-else-if="nextWorkout" class="workout-preview">
            <h3 class="workout-name">
              {{ nextWorkout.name }}
              <span v-if="nextWorkout.divisionName"> - {{ nextWorkout.divisionName }}</span>
            </h3>
            
            <div class="workout-info">
              <div class="info-item">
                <i class="fas fa-list"></i>
                <span>{{ getTotalExercises(nextWorkout) }} exercícios</span>
              </div>
              <div class="info-item">
                <i class="fas fa-clock"></i>
                <span>{{ nextWorkout.estimatedTime || 45 }} min</span>
              </div>
              <div class="info-item">
                <i class="fas fa-fire"></i>
                <span>~{{ nextWorkout.estimatedCalories || 0 }} cal</span>
              </div>
            </div>

            <div class="workout-exercises">
              <h4 class="exercises-title">Exercícios Preview</h4>
              <div 
                v-for="(exercise, index) in getPreviewExercises(nextWorkout)" 
                :key="index"
                class="exercise-item"
              >
                <span class="exercise-name">{{ exercise.name }}</span>
                <span class="exercise-details">{{ exercise.sets }}x{{ exercise.reps }}</span>
              </div>
              <p v-if="getTotalExercises(nextWorkout) > 3" class="more-exercises">
                +{{ getTotalExercises(nextWorkout) - 3 }} exercícios
              </p>
            </div>

            <button @click="startWorkout" class="btn-start-workout">
              <i class="fas fa-play"></i>
              Iniciar Treino
            </button>
          </div>

          <div v-else class="empty-state">
            <i class="fas fa-calendar-times"></i>
            <h3>Nenhum treino agendado</h3>
            <p>Consulte seus treinos disponíveis</p>
            <button @click="viewWorkouts" class="btn-secondary">
              Ver Treinos
            </button>
          </div>
        </div>

        <!-- Progresso Semanal -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-chart-bar"></i>
              Progresso Semanal
            </h2>
            <router-link to="/student/progress" class="link-view-all">Ver Tudo</router-link>
          </div>

          <div class="week-progress">
            <div class="progress-stats">
              <div class="progress-stat">
                <span class="progress-number">{{ dashboardData.completedThisWeek }}</span>
                <span class="progress-text">Concluídos</span>
              </div>
              <div class="progress-stat">
                <span class="progress-number">{{ dashboardData.weeklyGoal }}</span>
                <span class="progress-text">Meta</span>
              </div>
              <div class="progress-stat">
                <span class="progress-number">{{ getWeekProgress() }}%</span>
                <span class="progress-text">Progresso</span>
              </div>
            </div>

            <div class="progress-bar-container">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: getWeekProgress() + '%' }"
                ></div>
              </div>
            </div>

            <div class="week-calendar">
              <div 
                v-for="day in weekDays" 
                :key="day.name"
                :class="['day-item', { 
                  completed: day.completed, 
                  today: day.isToday 
                }]"
              >
                <span class="day-name">{{ day.name }}</span>
                <div class="day-indicator">
                  <i v-if="day.completed" class="fas fa-check"></i>
                  <i v-else-if="day.isToday" class="fas fa-circle"></i>
                  <span v-else>-</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Atividade Recente -->
        <div class="content-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="fas fa-history"></i>
              Atividade Recente
            </h2>
            <router-link to="/student/history" class="link-view-all">Ver Tudo</router-link>
          </div>

          <div v-if="recentActivities.length > 0" class="activity-list">
            <div 
              v-for="activity in recentActivities.slice(0, 5)" 
              :key="activity.id"
              class="activity-item"
            >
              <div :class="['activity-icon', activity.type]">
                <i :class="getActivityIcon(activity.type)"></i>
              </div>
              <div class="activity-content">
                <p class="activity-title">{{ activity.title }}</p>
                <p class="activity-time">
                  {{ formatDate(activity.date) }}
                  <span v-if="activity.duration" class="activity-detail"> • {{ activity.duration }}min</span>
                  <span v-if="activity.exercises" class="activity-detail"> • {{ activity.exercises }} exercícios</span>
                </p>
              </div>
            </div>
          </div>

          <div v-else class="empty-state-small">
            <i class="fas fa-inbox"></i>
            <p>Nenhuma atividade recente</p>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/theme'
import StudentNavBar from '@/components/StudentNavBar.vue'
import api from '@/api'

const router = useRouter()
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

// Reactive data
const loading = ref(false)
const dashboardData = ref({
  totalWorkouts: 0,
  currentStreak: 0,
  weeklyGoal: 4,
  completedThisWeek: 0,
  totalHours: 0
})
const nextWorkout = ref(null)
const recentActivities = ref([])
const goals = ref([])
const weekDays = ref([])

// Reactive data for user
const userName = ref('Atleta')

// Computed
const getUserName = () => {
  return userName.value
}

const getWelcomeMessage = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia! Que tal um treino?'
  if (hour < 18) return 'Boa tarde! Hora de treinar!'
  return 'Boa noite! Vamos treinar?'
}

const getWeekProgress = () => {
  if (dashboardData.value.weeklyGoal === 0) return 0
  return Math.round((dashboardData.value.completedThisWeek / dashboardData.value.weeklyGoal) * 100)
}

const getPreviewExercises = (workout) => {
  if (!workout?.divisions?.length) return []
  const firstDivision = workout.divisions[0]
  if (!firstDivision?.exercises?.length) return []
  return firstDivision.exercises.slice(0, 3)
}

const getTotalExercises = (workout) => {
  if (!workout?.divisions?.length) return 0
  return workout.divisions.reduce((total, div) => {
    return total + (div.exercises?.length || 0)
  }, 0)
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - d)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `Há ${diffDays} dias`
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const getActivityIcon = (type) => {
  const icons = {
    workout: 'fas fa-dumbbell',
    progress: 'fas fa-chart-line',
    goal: 'fas fa-bullseye',
    achievement: 'fas fa-trophy'
  }
  return icons[type] || 'fas fa-check'
}

// Methods
const fetchDashboardData = async () => {
  loading.value = true
  try {
    // Buscar dados do estudante do sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('user'))
    const userIdFromSession = userData.id || userData.userId
    const token = sessionStorage.getItem('token')
    
    console.log('👤 Dados do usuário:', userData)
    console.log('🆔 UserId do sessionStorage:', userIdFromSession)
    console.log('🔑 Token no sessionStorage:', token ? 'Presente' : 'Ausente')
    
    if (!token) {
      console.error('❌ Token não encontrado no sessionStorage!')
      throw new Error('Token de autenticação não encontrado')
    }
    
    // Definir nome do usuário
    userName.value = userData.name ? userData.name.split(' ')[0] : 'Atleta'
    
    // IMPORTANTE: Buscar o studentId real do banco de dados
    console.log('🔍 Buscando studentId real no banco...')
    let realStudentId = null
    let currentStudent = null
    
    try {
      // Como o aluno não pode acessar /students (só instrutores), 
      // vamos usar a API específica /students/user/{userId}
      console.log('📞 Chamando API /students/user/' + userIdFromSession)
      const studentResponse = await api.get(`/students/user/${userIdFromSession}`)
      currentStudent = studentResponse.data
      
      console.log('📊 Estudante encontrado:', currentStudent)
      
      if (currentStudent) {
        realStudentId = currentStudent._id
        console.log('✅ StudentId real encontrado:', realStudentId)
        
        // Atualizar nome se disponível
        if (currentStudent.name) {
          userName.value = currentStudent.name.split(' ')[0]
        }
      } else {
        console.error('❌ Estudante não encontrado para userId:', userIdFromSession)
        throw new Error('Estudante não encontrado')
      }
    } catch (error) {
      console.error('❌ Erro ao buscar estudante:', error)
      throw error
    }
    
    // 1. Buscar TODAS as sessões de treino usando o studentId real
    console.log('🔍 Buscando sessões para studentId:', realStudentId)
    
    let allSessions = []
    
    try {
      // Primeira tentativa: API de histórico existente
      const historyResponse = await api.get('/student/sessions/history', {
        params: { limit: 1000 }
      })
      
      console.log('📊 Resposta da API de histórico:', historyResponse.data)
      allSessions = historyResponse.data?.sessions || []
      
      // Filtrar sessões pelo studentId correto
      allSessions = allSessions.filter(session => {
        const sessionStudentId = session.studentId?._id || session.studentId
        const match = sessionStudentId === realStudentId
        if (match) {
          console.log('✅ Sessão encontrada para o estudante:', {
            sessionId: session._id,
            workoutName: session.workoutName,
            studentId: sessionStudentId
          })
        }
        return match
      })
      
      if (allSessions.length === 0) {
        console.log('⚠️ Nenhuma sessão encontrada na API de histórico, tentando API alternativa...')
        
        // Segunda tentativa: Nova API que busca todas as sessões
        try {
          const allSessionsResponse = await api.get('/student/sessions/all')
          console.log('📊 Resposta da API alternativa:', allSessionsResponse.data)
          const alternativeSessions = allSessionsResponse.data?.sessions || []
          
          // Filtrar pelo studentId correto
          allSessions = alternativeSessions.filter(session => {
            const sessionStudentId = session.studentId?._id || session.studentId
            return sessionStudentId === realStudentId
          })
        } catch (altError) {
          console.error('❌ API alternativa também falhou:', altError)
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar histórico:', error)
      allSessions = []
    }
    
    console.log('📈 Total de sessões encontradas para o estudante:', allSessions.length)
    
    // Filtrar apenas sessões completadas e adicionar logs detalhados
    const completedSessions = allSessions.filter(s => {
      const isCompleted = s.status === 'completed'
      if (isCompleted) {
        console.log(`✅ Sessão completada encontrada:`, {
          id: s._id,
          name: s.workoutName,
          division: s.divisionName,
          startTime: s.startTime,
          endTime: s.endTime,
          duration: s.duration,
          studentId: s.studentId
        })
      }
      return isCompleted
    })
    
    console.log('🏆 Total de sessões completadas:', completedSessions.length)
    
    if (completedSessions.length === 0) {
      console.warn('⚠️ Nenhuma sessão completada encontrada!')
      console.log('🔍 Verificando se o realStudentId está correto...')
      console.log('🔍 RealStudentId encontrado:', realStudentId)
      console.log('🔍 Sessions raw:', allSessions.map(s => ({ 
        id: s._id, 
        studentId: s.studentId, 
        status: s.status 
      })))
    }
    
    // Calcular estatísticas baseadas em dados reais
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    // Filtrar sessões da semana usando startTime ou endTime
    const sessionsThisWeek = completedSessions.filter(s => {
      const sessionDate = new Date(s.endTime || s.startTime)
      const isThisWeek = sessionDate >= weekAgo
      if (isThisWeek) {
        console.log(`📅 Sessão desta semana: ${s.workoutName} em ${sessionDate.toLocaleDateString()}`)
      }
      return isThisWeek
    })
    
    console.log('📊 Sessões desta semana:', sessionsThisWeek.length)
    
    // Calcular total de horas (duration está em minutos)
    const totalMinutes = completedSessions.reduce((sum, s) => {
      const minutes = s.duration || 0
      console.log(`⏱️ Sessão ${s.workoutName}: ${minutes} minutos`)
      return sum + minutes
    }, 0)
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10 // Arredondar para 1 casa decimal
    
    console.log('📊 Cálculos de tempo:', {
      totalMinutes,
      totalHours,
      totalSessions: completedSessions.length
    })
    
    // Calcular streak
    const streak = calculateStreak(completedSessions)
    
    // Meta semanal do aluno (padrão 4 ou do perfil)
    const weeklyGoal = (currentStudent?.weeklyGoal || currentStudent?.goals?.weeklyWorkouts) || 4
    
    dashboardData.value = {
      totalWorkouts: completedSessions.length,
      currentStreak: streak,
      weeklyGoal: weeklyGoal,
      completedThisWeek: sessionsThisWeek.length,
      totalHours: totalHours
    }
    
    console.log('📈 Dashboard stats calculadas:', dashboardData.value)
    
    // 2. Buscar próximo treino (plano de treino ativo)
    try {
      const workoutsResponse = await api.get('/student/workouts')
      const workouts = workoutsResponse.data || []
      
      console.log('🏋️ Planos de treino encontrados:', workouts.length)
      
      if (workouts.length > 0) {
        // Pegar o primeiro plano ativo ou o primeiro disponível
        const activePlan = workouts.find(w => w.isActive !== false) || workouts[0]
        console.log('🎯 Plano ativo selecionado:', activePlan.name)
        
        // Calcular qual divisão fazer baseado no histórico
        const planSessions = completedSessions.filter(s => 
          s.workoutPlanId?._id === activePlan._id || 
          s.workoutPlanId === activePlan._id
        )
        
        console.log('📈 Sessões do plano encontradas:', planSessions.length)
        
        // Determinar próxima divisão baseada no número de treinos completados
        const nextDivisionIndex = planSessions.length % (activePlan.divisions?.length || 1)
        const nextDivision = activePlan.divisions?.[nextDivisionIndex]
        
        if (nextDivision) {
          nextWorkout.value = {
            _id: activePlan._id,
            name: activePlan.name,
            divisionName: nextDivision.name,
            description: nextDivision.description || activePlan.description,
            divisionIndex: nextDivisionIndex,
            estimatedTime: calculateEstimatedTime(nextDivision),
            estimatedCalories: calculateEstimatedCalories(nextDivision),
            divisions: [nextDivision] // Para compatibilidade com o template
          }
          
          console.log('✅ Próximo treino definido:', {
            planName: nextWorkout.value.name,
            divisionName: nextWorkout.value.divisionName,
            exercises: nextDivision.exercises?.length || 0
          })
        } else {
          console.log('❌ Nenhuma divisão encontrada no plano')
          nextWorkout.value = null
        }
      } else {
        console.log('❌ Nenhum plano de treino encontrado')
        nextWorkout.value = null
      }
    } catch (err) {
      console.error('Erro ao buscar treinos:', err)
      nextWorkout.value = null
    }
    
    // 3. Processar atividades recentes (apenas sessões realmente completadas)
    recentActivities.value = []
    
    console.log('📝 Processando atividades recentes...')
    console.log('📊 Total de sessões completadas:', completedSessions.length)
    
    // Adicionar últimas sessões completadas (ordenar por data mais recente)
    const recentCompletedSessions = completedSessions
      .filter(s => s.status === 'completed')
      .sort((a, b) => new Date(b.endTime || b.startTime) - new Date(a.endTime || a.startTime))
      .slice(0, 5)
    
    console.log('🏋️ Sessões recentes encontradas:', recentCompletedSessions.length)
    
    recentCompletedSessions.forEach((session, index) => {
      const sessionDate = new Date(session.endTime || session.startTime)
      const title = session.divisionName 
        ? `${session.workoutName} - ${session.divisionName} concluído`
        : `${session.workoutName} concluído`
        
      recentActivities.value.push({
        id: `workout-${session._id}-${index}`,
        type: 'workout',
        title: title,
        date: sessionDate,
        duration: session.duration || 0,
        exercises: session.totalExercises || 0
      })
      
      console.log(`  ✅ Atividade ${index + 1}: ${title} - ${sessionDate.toLocaleDateString()}`)
    })
    console.log('✅ Atividades recentes processadas:', recentActivities.value.length)
    
    // 4. Remover metas conforme solicitado pelo usuário
    goals.value = []
    console.log('🎯 Metas removidas conforme solicitado')
    
    // 5. Configurar calendário semanal (apenas sessões completadas)
    const weekCompletions = Array(7).fill(0)
    
    console.log('📅 Configurando calendário semanal...')
    console.log('📊 Sessões desta semana:', sessionsThisWeek.length)
    
    sessionsThisWeek
      .filter(s => s.status === 'completed')
      .forEach(session => {
        // Usar endTime se disponível, senão startTime
        const sessionDate = new Date(session.endTime || session.startTime)
        const sessionDay = sessionDate.getDay()
        weekCompletions[sessionDay] = 1
        
        console.log(`  📅 Treino em ${sessionDate.toLocaleDateString()} (${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][sessionDay]})`)
      })
    
    console.log('📅 Dias com treino:', weekCompletions.map((day, i) => day ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i] : null).filter(Boolean))
    generateWeekCalendar(weekCompletions)
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    // Em caso de erro, usar estrutura vazia ao invés de dados mock
    dashboardData.value = {
      totalWorkouts: 0,
      currentStreak: 0,
      weeklyGoal: 4,
      completedThisWeek: 0,
      totalHours: 0
    }
    nextWorkout.value = null
    recentActivities.value = []
    goals.value = []
    generateWeekCalendar([0, 0, 0, 0, 0, 0, 0])
  } finally {
    loading.value = false
  }
}

const calculateStreak = (sessions) => {
  if (!sessions || sessions.length === 0) {
    console.log('🔥 Nenhuma sessão para calcular streak')
    return 0
  }
  
  console.log('🔥 Calculando streak com', sessions.length, 'sessões')
  
  // Ordenar por data mais recente (usar endTime se disponível, senão startTime)
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.endTime || a.startTime)
    const dateB = new Date(b.endTime || b.startTime)
    return dateB - dateA
  })
  
  console.log('📅 Primeira sessão:', new Date(sortedSessions[0].endTime || sortedSessions[0].startTime).toLocaleDateString())
  console.log('📅 Última sessão:', new Date(sortedSessions[sortedSessions.length - 1].endTime || sortedSessions[sortedSessions.length - 1].startTime).toLocaleDateString())
  
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  // Agrupar sessões por dia para evitar múltiplas contagens no mesmo dia
  const sessionsByDay = new Set()
  
  for (const session of sortedSessions) {
    const sessionDate = new Date(session.endTime || session.startTime)
    sessionDate.setHours(0, 0, 0, 0)
    const dayKey = sessionDate.getTime()
    
    if (sessionsByDay.has(dayKey)) {
      continue // Pular se já contamos este dia
    }
    sessionsByDay.add(dayKey)
    
    const daysDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24))
    
    console.log(`📅 Verificando dia: ${sessionDate.toLocaleDateString()}, diferença: ${daysDiff} dias`)
    
    if (daysDiff === streak) {
      streak++
      currentDate = sessionDate
      console.log(`🔥 Streak aumentou para: ${streak}`)
    } else if (daysDiff === streak + 1) {
      // Dia consecutivo
      streak++
      currentDate = sessionDate
      console.log(`🔥 Dia consecutivo, streak: ${streak}`)
    } else if (daysDiff > streak + 1) {
      // Gap maior que 1 dia, quebra a sequência
      console.log('💔 Sequência quebrada por gap de', daysDiff, 'dias')
      break
    }
  }
  
  console.log('🔥 Streak final calculado:', streak)
  return streak
}

const calculateEstimatedTime = (division) => {
  if (!division?.exercises) return 45
  // ~2min por exercício + 1min descanso por série
  const totalSets = division.exercises.reduce((sum, ex) => sum + (ex.sets || 3), 0)
  return Math.round((division.exercises.length * 2) + (totalSets * 1))
}

const calculateEstimatedCalories = (division) => {
  if (!division?.exercises) return 250
  // ~10 calorias por exercício * número de séries
  const totalSets = division.exercises.reduce((sum, ex) => sum + (ex.sets || 3), 0)
  return Math.round(totalSets * 10)
}

const generateWeekCalendar = (completions = []) => {
  const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
  const today = new Date().getDay()
  
  weekDays.value = days.map((name, index) => ({
    name,
    completed: completions[index] === 1,
    isToday: index === today
  }))
}

const startWorkout = () => {
  if (nextWorkout.value) {
    router.push('/student/workout-session')
  } else {
    router.push('/student/workouts')
  }
}

const viewProgress = () => {
  router.push('/student/progress')
}

const viewWorkouts = () => {
  router.push('/student/workouts')
}

// Lifecycle
onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

/* Layout Principal */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  background: var(--bg-secondary);
}

.dark-mode.dashboard-container {
  background: #16213e;
}

.dashboard-main {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  background: var(--bg-secondary);
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-mode .dashboard-main {
  background: #16213e;
}

/* Detecta quando o navbar está colapsado globalmente */
.dashboard-main {
  margin-left: 280px;
}

body:has(.navbar-collapsed) .dashboard-main,
.dashboard-container:has(.navbar-collapsed) .dashboard-main {
  margin-left: 0 !important;
}

/* Header */
.page-header {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  padding-top: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.dark-mode .page-header {
  background: #2d2d3d;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-outline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .btn-primary:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-outline {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.dark-mode .stat-card {
  background: #2d2d3d;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
}

.dark-mode .stat-card:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-icon.blue {
  background: var(--primary-color);
}

.stat-icon.orange {
  background: var(--warning-color);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.stat-label {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.9rem;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

.content-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .content-card {
  background: #2d2d3d;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.card-title i {
  color: var(--primary-color);
}

.badge-success {
  background: var(--success-color);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.link-view-all {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.link-view-all:hover {
  color: var(--primary-hover);
}

/* Loading */
.card-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-muted);
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

/* Workout Preview */
.workout-preview {
  padding: 0.5rem 0;
}

.workout-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.workout-info {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.info-item i {
  color: var(--primary-color);
}

.workout-exercises {
  margin-bottom: 1.5rem;
}

.exercises-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
}

.exercise-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.dark-mode .exercise-item {
  background: #1a1a2e;
  border-color: rgba(255, 255, 255, 0.1);
}

.exercise-name {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
}

.exercise-details {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.more-exercises {
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  margin: 0;
}

.btn-start-workout {
  width: 100%;
  padding: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-start-workout:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .btn-start-workout:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.3;
  color: var(--primary-color);
}

.empty-state h3 {
  font-size: 1.2rem;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
}

.empty-state-small {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-muted);
}

.empty-state-small i {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  opacity: 0.3;
  color: var(--primary-color);
}

.empty-state-small p {
  margin: 0 0 1rem 0;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--primary-color);
  color: white;
}

/* Week Progress */
.week-progress {
  padding: 0.5rem 0;
}

.progress-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.progress-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
}

.progress-text {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.progress-bar-container {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.week-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
}

.day-item {
  text-align: center;
  padding: 1rem 0.5rem;
  border-radius: 12px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.day-item.completed {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.day-item.today {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.dark-mode .day-item.today {
  background: rgba(102, 126, 234, 0.1);
}

.day-name {
  font-size: 0.75rem;
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.day-indicator {
  font-size: 1.2rem;
}

/* Activity List */
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
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: var(--border-color);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
}

.activity-icon.workout {
  background: var(--primary-color);
}

.activity-icon.progress {
  background: var(--success-color);
}

.activity-icon.goal {
  background: var(--warning-color);
}

.activity-icon.achievement {
  background: #8b5cf6;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
}

.activity-time {
  color: var(--text-muted);
  font-size: 0.8rem;
  margin: 0;
}

.activity-detail {
  color: var(--primary-color);
  font-weight: 500;
}

/* Goals */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-item {
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.goal-text {
  color: var(--text-color);
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.goal-percentage {
  color: var(--primary-color);
  font-weight: 700;
  font-size: 0.9rem;
}

.goal-progress-bar {
  width: 100%;
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.goal-progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-main {
    margin-left: 0;
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-outline {
    width: 100%;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .week-calendar {
    gap: 0.5rem;
  }
  
  .day-item {
    padding: 0.75rem 0.25rem;
  }
  
  .day-name {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .dashboard-main {
    padding: 1rem 0.75rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
