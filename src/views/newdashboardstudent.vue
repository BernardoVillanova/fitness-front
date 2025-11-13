<template>
  <div class="dashboard-container">
    <StudentNavBar />
    
    <div class="main-content-wrapper">
      <div class="header">
        <div class="header-container">
          <div class="header-right">
            <div class="search-bar">
              <i class="fas fa-search search-icon"></i>
              <input type="text" placeholder="Procure aqui..." />
            </div>
            <div class="notification-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="user-profile" @click="toggleUserDropdown">
              <div class="user-avatar">
                <img
                  :src="userData.avatar"
                  :alt="userData.name"
                  @error="handleImageError"
                />
              </div>
              <div class="user-info">
                <div class="user-name">{{ userData.name }}</div>
                <div class="user-role">{{ userData.role }}</div>
              </div>
              <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotate': showUserDropdown }"></i>
              
              <!-- Dropdown Menu -->
              <div v-if="showUserDropdown" class="user-dropdown" @click.stop>
                <div class="dropdown-item" @click="navigateTo('/student/profile')">
                  <i class="fa-solid fa-user"></i>
                  <span>Meu Perfil</span>
                </div>
                <div class="dropdown-item" @click="navigateTo('/student/workouts')">
                  <i class="fa-solid fa-dumbbell"></i>
                  <span>Meus Treinos</span>
                </div>
                <div class="dropdown-item" @click="navigateTo('/student/progress')">
                  <i class="fa-solid fa-chart-line"></i>
                  <span>Progresso</span>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item logout" @click="handleLogout">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                  <span>Sair</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-icon blue">
                <i class="fas fa-dumbbell"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">Treinos Ativos</div>
                <div class="stat-value">{{ totalActivePlans }}</div>
                <div class="stat-change positive">
                  <i class="fas fa-arrow-up stat-change-icon"></i>
                  <span>Prontos para treinar</span>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-icon blue">
                <i class="fas fa-stopwatch"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">Duração Média</div>
                <div class="stat-value">{{ monthlyStats.avgDuration || 0 }} min</div>
                <div class="stat-change positive">
                  <i class="fas stat-change-icon fa-chart-line"></i>
                  <span>Por treino este mês</span>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-icon blue">
                <i class="fas fa-fire"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">Sequência Atual</div>
                <div class="stat-value">{{ currentStreak }} {{ currentStreak === 1 ? 'dia' : 'dias' }}</div>
                <div class="stat-change" :class="currentStreak > 0 ? 'positive' : 'negative'">
                  <i class="fas stat-change-icon" :class="currentStreak > 0 ? 'fa-arrow-up' : 'fa-minus'"></i>
                  <span>{{ currentStreak > 0 ? 'Continue assim!' : 'Comece hoje!' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-icon blue">
                <i class="fas fa-trophy"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">Meta do Mês</div>
                <div class="stat-value">{{ monthGoalProgress }}%</div>
                <div class="stat-change" :class="monthGoalProgress >= 50 ? 'positive' : 'negative'">
                  <i class="fas stat-change-icon" :class="monthGoalProgress >= 50 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
                  <span>{{ totalCompletedWorkouts }} de 20 treinos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-wrapper">
          <div class="main-content">
            <div class="content-grid">
              <div class="card">
                <div class="chart-header">
                  <div class="card-title">
                    <TrendingUp :size="24" :stroke-width="2.5" class="chart-icon" />
                    {{ chartType === 'orders' ? 'Desempenho dos Treinos' : 'Treinos da Semana Atual' }}
                  </div>
                  <div class="chart-header-right">
                    <div v-if="chartType === 'orders'" class="legend">
                      <div class="legend-item">
                        <div class="legend-dot orders"></div>
                        Minutos
                      </div>
                      <div class="legend-item">
                        <div class="legend-dot revenue"></div>
                        Séries
                      </div>
                    </div>
                    <div v-else class="legend">
                      <div class="legend-item">
                        <div class="legend-dot" style="background: #2563eb;"></div>
                        Duração
                      </div>
                      <div class="legend-item">
                        <div class="legend-dot" style="background: #2563eb; opacity: 0.7;"></div>
                        Séries
                      </div>
                      <div class="legend-item">
                        <div class="legend-dot" style="background: #2563eb; opacity: 0.45;"></div>
                        Exercícios
                      </div>
                    </div>
                    <div class="chart-toggle">
                      <button
                        class="toggle-btn"
                        :class="{ active: chartType === 'orders' }"
                        @click="chartType = 'orders'"
                      >
                        Evolução
                      </button>
                      <button
                        class="toggle-btn"
                        :class="{ active: chartType === 'revenue' }"
                        @click="chartType = 'revenue'"
                      >
                        Semanal
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Line Chart (Orders) -->
                <div v-if="chartType === 'orders'" class="chart-container">
                  <canvas ref="performanceChart"></canvas>
                  <div
                    class="tooltip-custom"
                    :class="{ show: tooltip.show }"
                    :style="{ left: tooltip.left, top: tooltip.top }"
                  >
                    <div class="tooltip-date">{{ tooltip.date }}</div>
                    <div class="tooltip-value">{{ tooltip.value }}</div>
                  </div>
                </div>

                <!-- Bar Chart (Revenue) -->
                <div v-if="chartType === 'revenue'" class="bar-chart-container">
                  <div class="bar-chart-wrapper">
                    <div class="bar-y-axis">
                      <div
                        v-for="value in yLabels"
                        :key="`label-${value}`"
                        class="bar-y-label"
                        :style="{
                          bottom: `${(value / maxValue) * 100}%`,
                        }"
                      >
                        {{ value }}
                      </div>
                    </div>

                    <div class="bar-chart-content">
                      <div class="bar-grid-lines">
                        <div
                          v-for="value in yLabels"
                          :key="`grid-${value}`"
                          class="bar-grid-line"
                          :style="{ bottom: `${(value / maxValue) * 100}%` }"
                        ></div>
                      </div>

                      <div class="bar-chart">
                        <div
                          v-for="(item, dayIndex) in barChartData"
                          :key="`day-${dayIndex}`"
                          class="bar-chart-day"
                        >
                          <div class="bar-bars-group">
                            <div
                              v-for="(value, barIndex) in item.bars"
                              :key="`bar-${dayIndex}-${barIndex}`"
                              :class="`bar-item bar-item-${
                                barIndex + 1
                              } bar-animate-${barChartKey}`"
                              :style="{
                                height: `${(value / maxValue) * 100}%`,
                              }"
                              @mouseenter="showBarTooltip($event, item.day, value, barIndex)"
                              @mouseleave="hideBarTooltip"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- Tooltip para barras -->
                      <div
                        v-if="barTooltip.show"
                        class="bar-tooltip"
                        :style="{ left: barTooltip.left, top: barTooltip.top }"
                      >
                        <div class="bar-tooltip-day">{{ barTooltip.day }}</div>
                        <div class="bar-tooltip-value">{{ barTooltip.label }}: <strong>{{ barTooltip.value }}</strong></div>
                      </div>

                      <div class="bar-labels-row">
                        <span
                          v-for="(item, dayIndex) in barChartData"
                          :key="`label-${dayIndex}`"
                          class="bar-day-label"
                        >
                          {{ item.day }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="recent-workouts-section">
              <div class="workouts-container">
                <div class="workouts-header">
                  <h1>
                    <i class="fas fa-history"></i>
                    Treinos Realizados Recentemente
                  </h1>
                  <router-link to="/student/history" class="view-all">Ver Todos ›</router-link>
                </div>

                <div v-if="recentWorkouts.length === 0" class="empty-workouts">
                  <i class="fas fa-clipboard-list"></i>
                  <p>Nenhum treino realizado ainda</p>
                  <small>Comece seu primeiro treino para ver o histórico aqui</small>
                </div>

                <div v-else class="workouts-table">
                  <div class="table-header">
                    <div>Treino</div>
                    <div>Data</div>
                    <div>Duração</div>
                    <div>Exercícios</div>
                    <div>Status</div>
                  </div>

                  <div class="workouts-list">
                    <div
                      class="workout-item"
                      v-for="(workout, index) in recentWorkouts"
                      :key="workout.id || index"
                    >
                      <div class="workout-info">
                        <div class="workout-icon">
                          <i class="fas fa-dumbbell"></i>
                        </div>
                        <div class="workout-details">
                          <span class="workout-name">{{ workout.workoutName }}</span>
                          <span v-if="workout.divisionName" class="division-name">{{ workout.divisionName }}</span>
                        </div>
                      </div>
                      <div class="workout-date">{{ formatDate(workout.date) }}</div>
                      <div class="workout-duration">{{ formatDuration(workout.duration) }}</div>
                      <div class="workout-exercises">{{ workout.exercises }} exercícios</div>
                      <div class="workout-status">
                        <span class="status-badge" :class="workout.status">
                          <span class="status-dot"></span>
                          {{ getStatusText(workout.status) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar-container">
            <div class="calendar-container">
              <div class="calendar-header">
                <div class="month-year">{{ monthYear }}</div>
                <div class="nav-buttons">
                  <button class="nav-btn" @click="prevMonth">‹</button>
                  <button class="nav-btn" @click="nextMonth">›</button>
                </div>
              </div>

              <div class="divider"></div>

              <div class="weekdays">
                <div class="weekday">Seg</div>
                <div class="weekday">Ter</div>
                <div class="weekday">Qua</div>
                <div class="weekday">Qui</div>
                <div class="weekday">Sex</div>
                <div class="weekday">Sáb</div>
                <div class="weekday">Dom</div>
              </div>

              <div class="days">
                <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  class="day"
                  :class="day.class"
                >
                  <span class="day-number">{{ day.number }}</span>
                  <span v-if="day.hasWorkout" class="workout-indicator"></span>
                </div>
              </div>
            </div>

            <div class="quick-stats-card">
              <h3 class="sidebar-title">Estatísticas do Mês</h3>

              <div class="quick-stat-item">
                <div class="quick-stat-icon">
                  <i class="fas fa-dumbbell"></i>
                </div>
                <div class="quick-stat-info">
                  <span class="quick-stat-label">Treinos Realizados</span>
                  <span class="quick-stat-value">{{ monthlyStats.completedWorkouts }}</span>
                  <span class="quick-stat-change" :class="monthlyStats.workoutChange >= 0 ? 'positive' : 'negative'">
                    {{ monthlyStats.workoutChange >= 0 ? '+' : '' }}{{ monthlyStats.workoutChange }} vs mês anterior
                  </span>
                </div>
              </div>

              <div class="quick-stat-item">
                <div class="quick-stat-icon">
                  <i class="fas fa-trophy"></i>
                </div>
                <div class="quick-stat-info">
                  <span class="quick-stat-label">Desempenho Mensal</span>
                  <span class="quick-stat-value">{{ monthlyStats.performancePercent > 0 ? '+' : '' }}{{ monthlyStats.performancePercent }}%</span>
                  <span class="quick-stat-change" :class="monthlyStats.performancePercent >= 0 ? 'positive' : 'negative'">
                    {{ monthlyStats.performancePercent > 0 ? '↑' : monthlyStats.performancePercent < 0 ? '↓' : '→' }} 
                    {{ monthlyStats.performanceText }}
                  </span>
                </div>
              </div>

              <div class="quick-stat-item">
                <div class="quick-stat-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="quick-stat-info">
                  <span class="quick-stat-label">Tempo Total de Treino</span>
                  <span class="quick-stat-value">{{ formatTotalTime(monthlyStats.totalMinutes) }}</span>
                  <span class="quick-stat-change" :class="monthlyStats.timeChange >= 0 ? 'positive' : 'negative'">
                    {{ monthlyStats.timeChange >= 0 ? '+' : '' }}{{ monthlyStats.timeChange }}min vs anterior
                  </span>
                </div>
              </div>
            </div>

            <div class="workout-distribution-card">
              <div class="distribution-header">
                <h2 class="distribution-title">Distribuição de Treinos</h2>
                <select
                  class="distribution-dropdown"
                  v-model="selectedPeriod"
                >
                  <option value="week">Semana</option>
                  <option value="month">Mês</option>
                  <option value="year">Ano</option>
                </select>
              </div>
              <div class="distribution-stat-item">
                <div class="distribution-stat-value">
                  <span class="distribution-arrow up">↑</span>
                  <span class="distribution-number">{{
                    animatedCompletedCount
                  }}</span>
                </div>
                <p class="distribution-stat-description">
                  Treinos completados com sucesso no período
                </p>
              </div>
              <div class="distribution-stat-item">
                <div class="distribution-stat-value">
                  <i class="fa distribution-icon-progress">&#xf110;</i>
                  <span class="distribution-number">{{
                    animatedCancelledCount
                  }}</span>
                </div>
                <p class="distribution-stat-description">
                  Treinos não concluídos aguardando retomada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import StudentNavBar from "@/components/StudentNavBar.vue";
import { TrendingUp } from "lucide-vue-next";

Chart.register(...registerables);

export default {
  name: "NewDashboardStudent",
  components: {
    StudentNavBar,
    TrendingUp,
  },
  data() {
    return {
      // Dados do usuário
      userData: {
        name: '',
        avatar: '',
        role: 'Aluno'
      },
      showUserDropdown: false,
      chartType: "orders",
      currentDate: new Date(),
      chart: null,
      isInitializingChart: false,
      isDestroyed: false,
      monthNames: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      monthNamesShort: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      tooltip: {
        show: false,
        date: "Mar 02, 2022",
        value: "$ 44.72",
        left: "0px",
        top: "0px",
      },
      barTooltip: {
        show: false,
        day: "",
        label: "",
        value: "",
        left: "0px",
        top: "0px",
      },
      recentWorkouts: [],
      allWorkoutSessions: [], // Todas as sessões para o calendário
      monthlyStats: {
        completedWorkouts: 0,
        totalMinutes: 0,
        avgDuration: 0,
        workoutChange: 0,
        timeChange: 0,
        performancePercent: 0,
        performanceText: '',
        totalVolume: 0, // Volume total (kg)
        totalSets: 0,   // Total de séries
        totalExercises: 0 // Total de exercícios
      },
      updateInterval: null,
      selectedPeriod: "month",
      animatedCompletedCount: 0,
      animatedCancelledCount: 0,
      periodStats: {
        completed: 0,
        cancelled: 0
      },
      ordersData: [],
      revenueData: [],
      chartLabels: [],
      barChartData: [
        { day: "Seg", bars: [0, 0, 0] },
        { day: "Ter", bars: [0, 0, 0] },
        { day: "Qua", bars: [0, 0, 0] },
        { day: "Qui", bars: [0, 0, 0] },
        { day: "Sex", bars: [0, 0, 0] },
        { day: "Sáb", bars: [0, 0, 0] },
        { day: "Dom", bars: [0, 0, 0] },
      ],
      maxValue: 150,
      yLabels: [0, 50, 100, 150],
      barChartKey: 0,
    };
  },
  computed: {
    monthYear() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      return `${this.monthNames[month]}, ${year}`;
    },
    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const today = new Date();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const prevLastDay = new Date(year, month, 0);

      let firstDayOfWeek = firstDay.getDay();
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

      const daysInMonth = lastDay.getDate();
      const daysInPrevMonth = prevLastDay.getDate();

      // Criar set de dias com treinos completados (todos os meses desde o primeiro treino)
      const workoutDaysByMonth = new Map();
      if (this.allWorkoutSessions && this.allWorkoutSessions.length > 0) {
        console.log('📅 CALENDÁRIO - Total de treinos:', this.allWorkoutSessions.length);
        this.allWorkoutSessions.forEach(workout => {
          if (workout.date && workout.status === 'completed') {
            const workoutDate = new Date(workout.date);
            const workoutYear = workoutDate.getFullYear();
            const workoutMonth = workoutDate.getMonth();
            const workoutDay = workoutDate.getDate();
            
            console.log(`  📍 Treino: ${workoutDate.toLocaleDateString('pt-BR')} - Mês: ${workoutMonth} (${workoutMonth === 8 ? 'SET' : workoutMonth === 9 ? 'OUT' : workoutMonth === 10 ? 'NOV' : 'OUTRO'}), Dia: ${workoutDay}`);
            
            const key = `${workoutYear}-${workoutMonth}`;
            if (!workoutDaysByMonth.has(key)) {
              workoutDaysByMonth.set(key, new Set());
            }
            workoutDaysByMonth.get(key).add(workoutDay);
          }
        });
        
        console.log('📊 Meses com treinos:', Array.from(workoutDaysByMonth.keys()));
        workoutDaysByMonth.forEach((days, monthKey) => {
          console.log(`  ${monthKey}: ${days.size} dias com treinos`, Array.from(days).sort((a, b) => a - b));
        });
      }

      const days = [];

      // Dias do mês anterior
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevMonthKey = `${prevYear}-${prevMonth}`;
      const prevMonthWorkouts = workoutDaysByMonth.get(prevMonthKey) || new Set();
      
      for (let i = firstDayOfWeek; i > 0; i--) {
        const dayNum = daysInPrevMonth - i + 1;
        days.push({
          number: dayNum,
          class: "other-month",
          hasWorkout: prevMonthWorkouts.has(dayNum),
        });
      }

      // Dias do mês atual
      const currentMonthKey = `${year}-${month}`;
      const currentMonthWorkouts = workoutDaysByMonth.get(currentMonthKey) || new Set();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday =
          year === today.getFullYear() &&
          month === today.getMonth() &&
          day === today.getDate();

        days.push({
          number: day,
          class: isToday ? "today" : "",
          hasWorkout: !isToday && currentMonthWorkouts.has(day), // Não mostrar bolinha no dia atual
        });
      }

      // Dias do próximo mês
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const nextMonthKey = `${nextYear}-${nextMonth}`;
      const nextMonthWorkouts = workoutDaysByMonth.get(nextMonthKey) || new Set();
      
      const totalCells = days.length;
      const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

      for (let i = 1; i <= remainingCells; i++) {
        days.push({
          number: i,
          class: "other-month",
          hasWorkout: nextMonthWorkouts.has(i),
        });
      }

      return days;
    },
    // Stats para os cards do topo
    totalActivePlans() {
      // Retorna número de planos de treino ativos do aluno
      // Por enquanto retorna valor fixo até implementarmos endpoint específico
      return 3;
    },
    totalCompletedWorkouts() {
      // Total de treinos completados (todos os tempos)
      return this.monthlyStats.completedWorkouts || 0;
    },
    completedThisMonth() {
      // Treinos completados este mês
      return this.monthlyStats.workoutChange || 0;
    },
    currentStreak() {
      // Calcula sequência de dias consecutivos com treino
      if (!this.recentWorkouts || this.recentWorkouts.length === 0) return 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let streak = 0;
      let currentDate = new Date(today);
      
      // Ordenar treinos por data (mais recente primeiro)
      const sortedWorkouts = [...this.recentWorkouts].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      // Verificar dias consecutivos
      for (let i = 0; i < 30; i++) { // Verificar últimos 30 dias
        const hasWorkout = sortedWorkouts.some(workout => {
          const workoutDate = new Date(workout.date);
          workoutDate.setHours(0, 0, 0, 0);
          return workoutDate.getTime() === currentDate.getTime();
        });
        
        if (hasWorkout) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (i === 0) {
          // Se não treinou hoje, verificar ontem
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        } else {
          break; // Sequência quebrada
        }
      }
      
      return streak;
    },
    monthGoalProgress() {
      // Progresso da meta do mês (baseado em treinos completados vs meta de 20)
      const goal = 20;
      const completed = this.monthlyStats.completedWorkouts || 0;
      return Math.min(Math.round((completed / goal) * 100), 100);
    },
  },
  methods: {
    async fetchRecentWorkouts() {
      try {
        const token = sessionStorage.getItem('token');
        console.log('Token encontrado:', token ? 'Sim' : 'Não');
        
        if (!token) {
          console.warn('⚠️ Nenhum token encontrado. Usuário não autenticado.');
          this.recentWorkouts = [];
          return;
        }
        
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        
        console.log('=== INÍCIO BUSCA TREINOS RECENTES ===');
        console.log('URL da API:', 'http://localhost:3000/api/workout-sessions/sessions/history?limit=50');
        
        const response = await fetch('http://localhost:3000/api/workout-sessions/sessions/history?limit=50', {
          method: 'GET',
          headers: headers
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro na resposta:', response.status, response.statusText);
          console.error('Corpo da resposta de erro:', errorText);
          
          // Se token expirado, redirecionar para login
          if (response.status === 401 || response.status === 403) {
            console.error('❌ Token inválido ou expirado. Redirecionando para login...');
            sessionStorage.removeItem('token');
            this.$router.push('/login');
            return;
          }
          
          this.recentWorkouts = [];
          return;
        }
        
        const data = await response.json();
        console.log('=== DADOS RECEBIDOS DA API ===');
        console.log('Data completo:', JSON.stringify(data, null, 2));
        console.log('Tipo de data:', typeof data);
        console.log('data.sessions existe?', !!data.sessions);
        console.log('data.sessions é array?', Array.isArray(data.sessions));
        console.log('Quantidade de sessions:', data.sessions ? data.sessions.length : 0);
        
        if (data && data.sessions && Array.isArray(data.sessions)) {
          console.log('=== PROCESSANDO SESSIONS ===');
          console.log('Total de sessions recebidas:', data.sessions.length);
          
          // Log cada session antes de processar
          data.sessions.forEach((session, index) => {
            console.log(`Session ${index}:`, {
              id: session._id,
              workoutPlanId: session.workoutPlanId,
              endTime: session.endTime,
              startTime: session.startTime,
              createdAt: session.createdAt,
              status: session.status,
              duration: session.duration,
              exercisesCompleted: session.exercisesCompleted,
              exercises: session.exercises
            });
          });
          
          // Armazenar TODAS as sessões para o calendário
          this.allWorkoutSessions = data.sessions.map(session => {
            const date = session.endTime || session.createdAt;
            return {
              id: session._id,
              date,
              status: session.status || 'completed'
            };
          });
          
          // Processar e mapear diretamente (API já retorna apenas completed/cancelled)
          this.recentWorkouts = data.sessions
            .slice(0, 5) // Limita a 5 para a lista de treinos recentes
            .map(session => {
              // Pegar o nome do treino do workoutPlanId (se foi populado)
              let workoutName = 'Treino';
              let divisionName = '';
              
              if (session.workoutPlanId) {
                if (typeof session.workoutPlanId === 'object') {
                  // Se foi populado, pegar o nome do plano
                  workoutName = session.workoutPlanId.name || 'Treino';
                  
                  // Tentar pegar a divisão do plano
                  if (session.workoutPlanId.divisions && session.workoutPlanId.divisions.length > 0) {
                    // Se houver divisões no plano, mostrar a primeira ou baseado no index
                    divisionName = session.workoutPlanId.divisions[0]?.name || '';
                  }
                } else {
                  workoutName = 'Treino';
                }
              }
              
              // Usar endTime se existir, senão usar createdAt
              const date = session.endTime || session.createdAt;
              
              // Calcular duração se não estiver definida
              let duration = session.duration || 0;
              if (!duration && session.startTime && session.endTime) {
                const start = new Date(session.startTime);
                const end = new Date(session.endTime);
                duration = Math.round((end - start) / (1000 * 60)); // em minutos
              }
              
              // Contar exercícios
              const exercises = session.exercisesCompleted || 
                              (session.exercises ? session.exercises.length : 0);
              
              return {
                id: session._id,
                workoutName,
                divisionName,
                date,
                duration,
                exercises,
                status: session.status || 'completed'
              };
            });
          
          console.log('=== RESULTADO FINAL ===');
          console.log('Treinos processados para exibição:', this.recentWorkouts.length);
          console.log('Dados dos treinos:', JSON.stringify(this.recentWorkouts, null, 2));
          
          // Calcular estatísticas mensais
          this.calculateMonthlyStats(data.sessions);
          
          // Calcular estatísticas do período para o card de distribuição
          this.calculatePeriodStats(data.sessions);
          
          // Preparar dados do gráfico com os últimos treinos
          this.prepareChartData(data.sessions);
          
          if (this.recentWorkouts.length === 0) {
            console.warn('⚠️ NENHUM TREINO ENCONTRADO NO HISTÓRICO');
            console.log('O aluno ainda não completou ou cancelou nenhum treino');
          }
        } else {
          console.error('❌ FORMATO DE DADOS INESPERADO');
          console.log('data:', data);
          console.log('data.sessions:', data.sessions);
          this.recentWorkouts = [];
        }
        
        console.log('=== FIM BUSCA TREINOS RECENTES ===');
      } catch (error) {
        console.error('❌ ERRO AO BUSCAR TREINOS RECENTES:', error);
        console.error('Stack trace:', error.stack);
        this.recentWorkouts = [];
      }
    },
    async fetchUserData() {
      try {
        const storedUser = sessionStorage.getItem('user');
        
        if (!storedUser) {
          console.warn('⚠️ Nenhum usuário no sessionStorage');
          this.userData.name = 'Usuário';
          this.userData.avatar = 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff&size=48';
          this.userData.role = 'Aluno';
          return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.id || userData._id;
        
        if (!userId) {
          console.warn('⚠️ Nenhum ID encontrado no userData');
          this.userData.name = userData.name || 'Usuário';
          this.userData.avatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.userData.name) + '&background=2563eb&color=fff&size=48';
          this.userData.role = 'Aluno';
          return;
        }

        // Buscar dados do Student para pegar informações completas
        const token = sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/students/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const studentData = await response.json();
          
          // Extrair nome do User populado
          const userName = studentData.userId?.name || userData.name || 'Usuário';
          
          // Extrair avatar com URL completa do backend
          const avatarPath = studentData.userId?.avatar || userData.avatar;
          let avatarUrl;
          
          if (avatarPath && avatarPath.startsWith('/uploads/')) {
            avatarUrl = `http://localhost:3000${avatarPath}`;
          } else if (avatarPath && (avatarPath.startsWith('http://') || avatarPath.startsWith('https://'))) {
            avatarUrl = avatarPath;
          } else {
            avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff&size=48`;
          }
          
          this.userData.name = userName;
          this.userData.avatar = avatarUrl;
          this.userData.role = 'Aluno';
          
          console.log('✅ Dados do usuário carregados:', this.userData);
        } else {
          // Fallback para dados do sessionStorage
          this.userData.name = userData.name || 'Usuário';
          this.userData.avatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.userData.name) + '&background=2563eb&color=fff&size=48';
          this.userData.role = 'Aluno';
        }
      } catch (error) {
        console.error('❌ Erro ao buscar dados do usuário:', error);
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          this.userData.name = userData.name || 'Usuário';
        } else {
          this.userData.name = 'Usuário';
        }
        this.userData.avatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.userData.name) + '&background=2563eb&color=fff&size=48';
        this.userData.role = 'Aluno';
      }
    },
    calculateMonthlyStats(allSessions) {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      console.log('🔍 CALCULANDO ESTATÍSTICAS MENSAIS:');
      console.log('Data atual:', now);
      console.log('Mês atual:', currentMonth, '(Novembro = 10)');
      console.log('Ano atual:', currentYear);
      console.log('Mês anterior:', lastMonth, '(Outubro = 9)');
      console.log('Total de sessões recebidas:', allSessions.length);
      
      // Filtrar sessões do mês atual (completadas)
      const currentMonthSessions = allSessions.filter(session => {
        if (!session.endTime || session.status !== 'completed') return false;
        const date = new Date(session.endTime);
        const isCurrentMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        if (isCurrentMonth) {
          console.log('✅ Treino do mês atual:', {
            date: session.endTime,
            duration: session.duration,
            status: session.status
          });
        }
        return isCurrentMonth;
      });
      
      // Filtrar sessões do mês anterior (completadas)
      const lastMonthSessions = allSessions.filter(session => {
        if (!session.endTime || session.status !== 'completed') return false;
        const date = new Date(session.endTime);
        const isLastMonth = date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        if (isLastMonth) {
          console.log('📅 Treino do mês anterior:', {
            date: session.endTime,
            duration: session.duration,
            status: session.status
          });
        }
        return isLastMonth;
      });
      
      console.log('📊 Treinos do mês atual:', currentMonthSessions.length);
      console.log('📊 Treinos do mês anterior:', lastMonthSessions.length);
      
      // Calcular estatísticas
      const completedWorkouts = currentMonthSessions.length;
      const totalMinutes = currentMonthSessions.reduce((sum, session) => {
        let duration = session.duration || 0;
        if (!duration && session.startTime && session.endTime) {
          const start = new Date(session.startTime);
          const end = new Date(session.endTime);
          duration = Math.round((end - start) / (1000 * 60));
        }
        return sum + duration;
      }, 0);
      
      // Calcular tempo total do mês anterior
      const lastMonthMinutes = lastMonthSessions.reduce((sum, session) => {
        let duration = session.duration || 0;
        if (!duration && session.startTime && session.endTime) {
          const start = new Date(session.startTime);
          const end = new Date(session.endTime);
          duration = Math.round((end - start) / (1000 * 60));
        }
        return sum + duration;
      }, 0);
      
      const avgDuration = completedWorkouts > 0 ? Math.round(totalMinutes / completedWorkouts) : 0;
      const workoutChange = completedWorkouts - lastMonthSessions.length;
      const timeChange = totalMinutes - lastMonthMinutes;
      
      // Calcular volume total, séries e exercícios do mês atual
      const totalVolume = currentMonthSessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);
      const totalSets = currentMonthSessions.reduce((sum, s) => sum + (s.completedSets || 0), 0);
      const totalExercises = currentMonthSessions.reduce((sum, s) => sum + (s.completedExercises || 0), 0);
      
      // Calcular porcentagem de desempenho real baseada nos treinos completados
      let performancePercent = 0;
      let performanceText = 'Sem dados anteriores';
      
      if (lastMonthSessions.length > 0) {
        // Calcula a diferença percentual entre este mês e o anterior
        const difference = completedWorkouts - lastMonthSessions.length;
        performancePercent = Math.round((difference / lastMonthSessions.length) * 100);
        
        if (performancePercent > 0) {
          performanceText = 'Melhor que mês passado';
        } else if (performancePercent < 0) {
          performanceText = 'Abaixo do mês passado';
        } else {
          performanceText = 'Mesmo que mês passado';
        }
      } else if (completedWorkouts > 0) {
        // Primeiro mês: considera 100% de progresso se tiver pelo menos 1 treino
        performancePercent = 100;
        performanceText = 'Primeiro mês ativo!';
      } else {
        // Sem treinos em ambos os meses
        performancePercent = 0;
        performanceText = 'Sem dados anteriores';
      }
      
      this.monthlyStats = {
        completedWorkouts,
        totalMinutes,
        avgDuration,
        workoutChange,
        timeChange,
        performancePercent,
        performanceText,
        totalVolume,
        totalSets,
        totalExercises
      };
      
      console.log('📊 ========== ESTATÍSTICAS FINAIS ==========');
      console.log('Treinos Completados (mês atual):', completedWorkouts);
      console.log('Treinos Completados (mês anterior):', lastMonthSessions.length);
      console.log('Mudança de Treinos:', workoutChange);
      console.log('Tempo Total (mês atual):', totalMinutes, 'min');
      console.log('Tempo Total (mês anterior):', lastMonthMinutes, 'min');
      console.log('Mudança de Tempo:', timeChange, 'min');
      console.log('Duração Média:', avgDuration, 'min');
      console.log('Performance:', performancePercent + '%', '-', performanceText);
      console.log('==========================================');
    },
    calculatePeriodStats(allSessions) {
      if (!allSessions || allSessions.length === 0) {
        this.periodStats = { completed: 0, cancelled: 0 };
        this.animateCount(0, 'animatedCompletedCount');
        this.animateCount(0, 'animatedCancelledCount');
        return;
      }

      const now = new Date();
      let startDate;

      if (this.selectedPeriod === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (this.selectedPeriod === 'month') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (this.selectedPeriod === 'year') {
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      }

      const periodSessions = allSessions.filter(session => {
        if (!session.endTime && !session.createdAt) return false;
        const sessionDate = new Date(session.endTime || session.createdAt);
        return sessionDate >= startDate && sessionDate <= now;
      });

      const completed = periodSessions.filter(s => s.status === 'completed').length;
      const cancelled = periodSessions.filter(s => s.status === 'cancelled').length;

      this.periodStats = { completed, cancelled };

      console.log('📊 Distribuição de Treinos:', this.selectedPeriod);
      console.log('  Completados:', completed);
      console.log('  Cancelados (não finalizados):', cancelled);

      this.animateCount(completed, 'animatedCompletedCount');
      this.animateCount(cancelled, 'animatedCancelledCount');
    },
    prepareChartData(allSessions) {
      console.log('📈 Preparando dados do gráfico de desempenho...');
      console.log('Total de sessões recebidas:', allSessions ? allSessions.length : 0);
      
      if (!allSessions || allSessions.length === 0) {
        console.warn('⚠️ Nenhuma sessão recebida para o gráfico');
        this.chartLabels = ['Sem dados'];
        this.ordersData = [0];
        this.revenueData = [0];
        return;
      }
      
      // Filtrar apenas sessões completadas com endTime
      const completedSessions = allSessions
        .filter(session => session.status === 'completed' && session.endTime)
        .sort((a, b) => new Date(b.endTime) - new Date(a.endTime)); // Mais recentes primeiro
      
      console.log('Total de sessões completadas com endTime:', completedSessions.length);
      
      // Pegar os últimos 8 treinos (ou menos se houver menos de 8)
      const lastWorkouts = completedSessions.slice(0, 8).reverse(); // Reverter para ordem cronológica
      
      console.log('Últimos treinos selecionados para o gráfico:', lastWorkouts.length);
      console.log('Treinos selecionados:', lastWorkouts.map(w => ({
        date: w.endTime,
        duration: w.duration,
        status: w.status
      })));
      
      if (lastWorkouts.length === 0) {
        // Se não houver treinos, usar dados vazios
        this.chartLabels = ['Sem dados'];
        this.ordersData = [0];
        this.revenueData = [0];
        console.log('⚠️ Nenhum treino para exibir no gráfico');
        return;
      }
      
      // Processar labels e dados - SEM agrupar por dia
      this.chartLabels = lastWorkouts.map(session => {
        const date = new Date(session.endTime);
        const day = date.getDate();
        const month = this.monthNamesShort[date.getMonth()];
        return `${month} ${day}`;
      });
      
      // Processar duração em minutos
      this.ordersData = lastWorkouts.map(session => {
        let duration = session.duration || 0;
        if (!duration && session.startTime && session.endTime) {
          const start = new Date(session.startTime);
          const end = new Date(session.endTime);
          duration = Math.round((end - start) / (1000 * 60));
        }
        return duration || 0;
      });
      
      // Séries completadas - métrica de volume de trabalho realizado
      this.revenueData = lastWorkouts.map(session => {
        return session.completedSets || 0;
      });
      
      console.log('Labels do gráfico:', this.chartLabels);
      console.log('Durações (minutos):', this.ordersData);
      console.log('Séries completadas:', this.revenueData);
      
      // Preparar dados do gráfico de barras (revenue) por dia da semana
      this.prepareBarChartData(allSessions);
      
      // Atualizar o gráfico se já estiver criado
      if (this.chart && this.chartType === 'orders') {
        console.log('Atualizando gráfico existente...');
        this.destroyChart();
        this.$nextTick(() => {
          this.initChart();
        });
      } else if (this.chartType === 'orders') {
        // Se o gráfico ainda não foi criado, inicializar agora
        console.log('Inicializando gráfico pela primeira vez com dados...');
        this.$nextTick(() => {
          this.initChart();
        });
      }
    },
    prepareBarChartData(allSessions) {
      console.log('📊 ========== PREPARANDO GRÁFICO DE BARRAS ==========');
      console.log('📊 Preparando dados do gráfico de barras por dia da semana...');
      console.log('Total de sessões recebidas:', allSessions ? allSessions.length : 0);
      
      if (!allSessions || allSessions.length === 0) {
        console.warn('⚠️ Nenhuma sessão para gráfico de barras');
        // Resetar para zeros
        this.barChartData = [
          { day: "Seg", bars: [0, 0, 0] },
          { day: "Ter", bars: [0, 0, 0] },
          { day: "Qua", bars: [0, 0, 0] },
          { day: "Qui", bars: [0, 0, 0] },
          { day: "Sex", bars: [0, 0, 0] },
          { day: "Sáb", bars: [0, 0, 0] },
          { day: "Dom", bars: [0, 0, 0] },
        ];
        return;
      }
      
      // Filtrar apenas sessões completadas DA SEMANA ATUAL (últimos 7 dias)
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const completedSessions = allSessions.filter(session => {
        if (session.status !== 'completed' || !session.endTime) return false;
        
        const sessionDate = new Date(session.endTime);
        return sessionDate >= sevenDaysAgo && sessionDate <= now;
      });
      
      console.log('Sessões completadas DA SEMANA ATUAL (últimos 7 dias):', completedSessions.length);
      console.log('Período:', sevenDaysAgo.toLocaleDateString('pt-BR'), 'até', now.toLocaleDateString('pt-BR'));
      
      // Definir nomes dos dias
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      
      // Agrupar por dia da semana (0 = domingo, 1 = segunda, etc.)
      const dayGroups = {
        1: [], // Segunda
        2: [], // Terça
        3: [], // Quarta
        4: [], // Quinta
        5: [], // Sexta
        6: [], // Sábado
        0: []  // Domingo
      };
      
      completedSessions.forEach((session, index) => {
        const date = new Date(session.endTime);
        const dayOfWeek = date.getDay();
        dayGroups[dayOfWeek].push(session);
        
        // Log SUPER detalhado de cada sessão
        console.log(`\n📅 TREINO #${index + 1}:`);
        console.log(`   Nome: ${session.workoutName || 'Sem nome'}`);
        console.log(`   Divisão: ${session.divisionName || 'Sem divisão'}`);
        console.log(`   Data/Hora Fim: ${date.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}`);
        console.log(`   Dia da Semana: ${dayOfWeek} = ${dayNames[dayOfWeek]}`);
        console.log(`   Duração: ${session.duration || 0} minutos`);
        console.log(`   Séries Completadas: ${session.completedSets || 0}`);
        console.log(`   Exercícios Completados: ${session.completedExercises || 0}`);
        console.log(`   Status: ${session.status}`);
        console.log(`   ID: ${session._id || session.id}`);
      });
      
      // Mostrar resumo de cada dia
      console.log('\n📊 ========== RESUMO POR DIA DA SEMANA ==========');
      Object.keys(dayGroups).forEach(dayNum => {
        const dayName = dayNames[parseInt(dayNum)];
        const sessions = dayGroups[dayNum];
        console.log(`\n${dayName} (código: ${dayNum}): ${sessions.length} treino(s)`);
        
        if (sessions.length > 0) {
          sessions.forEach((s, i) => {
            const d = new Date(s.endTime);
            console.log(`  ${i + 1}. ${s.workoutName} - ${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${s.duration}min, ${s.completedSets} séries, ${s.completedExercises} ex`);
          });
        }
      });
      console.log('===============================================\n');
      
      // Ordem dos dias para exibição: Seg, Ter, Qua, Qui, Sex, Sáb, Dom
      const weekDays = [1, 2, 3, 4, 5, 6, 0]; // Ordem: Seg, Ter, Qua, Qui, Sex, Sáb, Dom
      
      this.barChartData = weekDays.map(dayNum => {
        const sessions = dayGroups[dayNum];
        const dayName = dayNames[dayNum];
        
        if (sessions.length === 0) {
          console.log(`⚠️ ${dayName}: Nenhum treino encontrado`);
          return { day: dayName, bars: [0, 0, 0] };
        }
        
        // Calcular TOTAIS (não médias)
        const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const totalSets = sessions.reduce((sum, s) => sum + (s.completedSets || 0), 0);
        const totalExercises = sessions.reduce((sum, s) => sum + (s.completedExercises || 0), 0);
        
        console.log(`\n✅ ${dayName} - TOTAIS:`);
        console.log(`   Quantidade de treinos: ${sessions.length}`);
        console.log(`   Total de minutos: ${totalDuration}min`);
        console.log(`   Total de séries: ${totalSets}`);
        console.log(`   Total de exercícios: ${totalExercises}`);
        console.log(`   Barras no gráfico: [${totalDuration}, ${totalSets}, ${totalExercises}]`);
        
        return {
          day: dayName,
          bars: [totalDuration, totalSets, totalExercises]
        };
      });
      
      // Calcular maxValue dinâmico
      const allValues = this.barChartData.flatMap(day => day.bars);
      const maxBarValue = Math.max(...allValues);
      this.maxValue = Math.ceil(maxBarValue / 10) * 10 + 10; // Arredondar para cima
      
      // Criar labels do eixo Y
      const step = Math.ceil(this.maxValue / 4);
      this.yLabels = [0, step, step * 2, step * 3, this.maxValue];
      
      console.log('📊 Dados do gráfico de barras preparados:', this.barChartData);
      console.log('Max value:', this.maxValue);
      console.log('Y labels:', this.yLabels);
    },
    showBarTooltip(event, day, value, barIndex) {
      const labels = ['Duração', 'Séries', 'Exercícios'];
      const units = ['min', 'séries', 'exercícios'];
      
      this.barTooltip.show = true;
      this.barTooltip.day = day;
      this.barTooltip.label = labels[barIndex];
      this.barTooltip.value = `${value} ${units[barIndex]}`;
      
      // Posicionar o tooltip próximo ao mouse
      const rect = event.target.getBoundingClientRect();
      const container = event.target.closest('.bar-chart-container');
      const containerRect = container.getBoundingClientRect();
      
      this.barTooltip.left = (rect.left - containerRect.left + rect.width / 2) + 'px';
      this.barTooltip.top = (rect.top - containerRect.top - 10) + 'px';
    },
    hideBarTooltip() {
      this.barTooltip.show = false;
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    formatDuration(minutes) {
      if (!minutes || minutes === 0) return '< 1min';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0) {
        return `${hours}h ${mins}min`;
      }
      return `${mins}min`;
    },
    formatTotalTime(minutes) {
      if (!minutes || minutes === 0) return '0h';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0 && mins > 0) {
        return `${hours}h ${mins}min`;
      } else if (hours > 0) {
        return `${hours}h`;
      }
      return `${mins}min`;
    },
    getStatusText(status) {
      const statusMap = {
        'completed': 'Concluído',
        'in-progress': 'Em Progresso',
        'cancelled': 'Cancelado'
      };
      return statusMap[status] || status;
    },
    prevMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      );
    },
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      );
    },
    getChartLabels() {
      const labels = [];
      const today = new Date();

      for (let i = 9; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const month = this.monthNamesShort[date.getMonth()];
        const day = date.getDate();

        labels.push(`${month} ${day}`);
      }

      return labels;
    },
    destroyChart() {
      if (this.chart) {
        try {
          // Immediately disable all animations
          if (this.chart.options && this.chart.options.animation) {
            this.chart.options.animation = false;
          }
          // Stop all animations
          if (this.chart.stop) {
            this.chart.stop();
          }
          // Set to null first to prevent callbacks
          const chartToDestroy = this.chart;
          this.chart = null;
          // Now destroy
          if (chartToDestroy && chartToDestroy.destroy) {
            chartToDestroy.destroy();
          }
        } catch (e) {
          console.warn("Chart destruction warning:", e);
          this.chart = null;
        }
      }
    },
    initChart() {
      // Prevent multiple initializations
      if (this.isInitializingChart || this.isDestroyed) return;
      
      // Clear any existing chart first
      this.destroyChart();
      
      // Only proceed if we should show the chart
      if (this.chartType !== "orders") return;

      this.isInitializingChart = true;

      this.$nextTick(() => {
        // Double check conditions
        if (this.chartType !== "orders" || this.isDestroyed) {
          this.isInitializingChart = false;
          return;
        }
        if (!this.$refs.performanceChart) {
          this.isInitializingChart = false;
          return;
        }

        const canvas = this.$refs.performanceChart;
        if (!canvas || !canvas.getContext) {
          this.isInitializingChart = false;
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          this.isInitializingChart = false;
          return;
        }

        // Usar os dados reais dos treinos ou dados padrão se não houver treinos
        const labels = this.chartLabels.length > 0 ? this.chartLabels : this.getChartLabels();
        const ordersData = this.ordersData.length > 0 ? this.ordersData : [0];
        const revenueData = this.revenueData.length > 0 ? this.revenueData : [0];
        
        console.log('📊 Criando gráfico com dados:', { labels, ordersData, revenueData });

        const gradient1 = ctx.createLinearGradient(0, 0, 0, 300);
        gradient1.addColorStop(0, "rgba(0, 128, 255, 0.3)");
        gradient1.addColorStop(0.5, "rgba(0, 128, 255, 0.15)");
        gradient1.addColorStop(1, "rgba(0, 128, 255, 0.01)");

        const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
        gradient2.addColorStop(0, "rgba(93, 211, 199, 0.3)");
        gradient2.addColorStop(0.5, "rgba(93, 211, 199, 0.15)");
        gradient2.addColorStop(1, "rgba(93, 211, 199, 0.01)");

        // Final check before creating chart
        if (this.chart || this.chartType !== "orders") return;

        try {
          this.chart = new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Minutos de Treino",
                  data: ordersData,
                  borderColor: "#0080ff",
                  backgroundColor: gradient1,
                  borderWidth: 3,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 0,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "#0080ff",
                  pointHoverBorderColor: "white",
                  pointHoverBorderWidth: 2,
                  hidden: false,
                  animation: false,
                  yAxisID: 'y',
                },
                {
                  label: "Séries Completadas",
                  data: revenueData,
                  borderColor: "#5dd3c7",
                  backgroundColor: gradient2,
                  borderWidth: 3,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 0,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "#5dd3c7",
                  pointHoverBorderColor: "white",
                  pointHoverBorderWidth: 2,
                  hidden: false,
                  animation: false,
                  yAxisID: 'y1',
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: false,
              animations: {
                colors: false,
                x: false,
                y: false
              },
              transitions: {
                active: {
                  animation: {
                    duration: 0
                  }
                }
              },
              layout: {
                padding: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                },
              },
              interaction: {
                mode: "index",
                intersect: false,
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: false,
                  external: (context) => {
                    const tooltipModel = context.tooltip;

                    if (tooltipModel.opacity === 0) {
                      this.tooltip.show = false;
                      return;
                    }

                    if (tooltipModel.body) {
                      const dataPoints = tooltipModel.dataPoints;
                      const date = dataPoints[0].label;
                      
                      // Pegar ambos os valores
                      let minutos = 0;
                      let series = 0;
                      
                      dataPoints.forEach((point, index) => {
                        if (index === 0) {
                          minutos = Math.round(point.raw);
                        } else if (index === 1) {
                          series = Math.round(point.raw);
                        }
                      });

                      this.tooltip.date = date;
                      this.tooltip.value = `${minutos} min • ${series} séries`;
                      this.tooltip.left = tooltipModel.caretX + "px";
                      this.tooltip.top = tooltipModel.caretY - 50 + "px";
                      this.tooltip.show = true;
                    }
                  },
                },
              },
              scales: {
                x: {
                  display: true,
                  offset: false,
                  grid: {
                    display: false,
                    offset: false,
                  },
                  ticks: {
                    color: "#94a3b8",
                    font: {
                      family: "'Inter', sans-serif",
                      size: 12,
                      weight: "500",
                    },
                    padding: 8,
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: false,
                    align: "inner",
                  },
                  border: {
                    display: false,
                  },
                },
                y: {
                  display: false,
                  grid: {
                    display: false,
                  },
                  position: 'left',
                },
                y1: {
                  display: false,
                  grid: {
                    display: false,
                  },
                  position: 'right',
                },
              },
            },
          });
        } catch (error) {
          console.error("Chart creation error:", error);
          this.chart = null;
        } finally {
          this.isInitializingChart = false;
        }
      });
    },
    startCalendarUpdate() {
      this.updateInterval = setInterval(() => {
        const now = new Date();
        if (
          now.getMonth() === this.currentDate.getMonth() &&
          now.getFullYear() === this.currentDate.getFullYear()
        ) {
          this.currentDate = new Date();
        }
      }, 60000);
    },
    animateCount(targetValue, targetKey) {
      const duration = 800;
      const startValue = this[targetKey];
      const difference = targetValue - startValue;
      const startTime = Date.now();

      const updateCount = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        this[targetKey] = Math.round(startValue + difference * easeOutQuart);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          this[targetKey] = targetValue;
        }
      };

      requestAnimationFrame(updateCount);
    },
    handleImageError(event) {
      // Se a imagem falhar ao carregar, usar avatar gerado com tamanho 48px
      event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.userData.name || 'User')}&background=2563eb&color=fff&size=48`;
    },
    toggleUserDropdown() {
      this.showUserDropdown = !this.showUserDropdown;
    },
    handleClickOutside(event) {
      const userProfile = event.target.closest('.user-profile');
      if (!userProfile) {
        this.showUserDropdown = false;
      }
    },
    navigateTo(route) {
      this.showUserDropdown = false;
      this.$router.push(route);
    },
    handleLogout() {
      this.showUserDropdown = false;
      // Limpar dados de sessão
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      // Redirecionar para login
      this.$router.push('/login');
    },
  },
  watch: {
    selectedPeriod() {
      if (this.allWorkoutSessions && this.allWorkoutSessions.length > 0) {
        this.fetchRecentWorkouts();
      }
    },
    chartType(newVal, oldVal) {
      // Destroy chart immediately when switching away from orders
      if (oldVal === "orders" && this.chart) {
        this.destroyChart();
      }

      // Initialize chart when switching to orders
      if (newVal === "orders") {
        // Use setTimeout with longer delay to ensure DOM is ready
        setTimeout(() => {
          if (this.chartType === "orders") {
            this.initChart();
          }
        }, 100);
      }

      // Trigger animation when switching to revenue
      if (newVal === "revenue") {
        this.barChartKey++;
      }
    },
    completedCount(newValue) {
      this.animateCount(newValue, "animatedCompletedCount");
    },
    inProgressCount(newValue) {
      this.animateCount(newValue, "animatedInProgressCount");
    },
  },
  mounted() {
    // Use nextTick to ensure DOM is fully ready
    this.$nextTick(async () => {
      this.startCalendarUpdate();
      
      // Buscar dados do usuário
      await this.fetchUserData();
      
      // Buscar dados dos treinos
      await this.fetchRecentWorkouts();
      
      // Depois inicializar o gráfico com os dados
      if (this.chartType === 'orders') {
        setTimeout(() => {
          this.initChart();
        }, 200);
      }
    });
    
    // Adicionar listener para fechar dropdown ao clicar fora
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // Mark as destroyed to prevent any new operations
    this.isDestroyed = true;
    
    // Clear interval first
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    // Destroy chart
    this.destroyChart();
    
    // Clear chart type last
    this.chartType = null;
    
    // Remover listener de click
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, sans-serif;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  background-color: #f8f9fa;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content-wrapper {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #ffffff;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.header-container {
  max-width: 1600px;
  width: 100%;
  padding: 0 40px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
}

.nav-title {
  color: #1a1a1a;
  font-size: 16px;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  position: relative;
}

.search-bar input {
  width: 300px;
  padding: 10px 15px 10px 40px;
  border: none;
  background-color: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
}

.search-bar input::placeholder {
  color: #999;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
}

.notification-icon {
  width: 40px;
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  color: #666;
  font-size: 18px;
  transition: background-color 0.2s ease;
}

.notification-icon:hover {
  background-color: #ebebeb;
}

.notification-icon i {
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
}

.notification-icon::after {
  content: "";
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background-color: #ff4444;
  border-radius: 50%;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f3f4f6;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid #e5e7eb;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  transition: color 0.3s ease;
}

.dark-mode .user-name {
  color: #f3f4f6;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: capitalize;
  transition: color 0.3s ease;
}

.dark-mode .user-role {
  color: #9ca3af;
}

.dark-mode .user-avatar {
  background-color: #374151;
  border-color: #4b5563;
}

.dropdown-arrow {
  color: #6b7280;
  font-size: 12px;
  margin-left: 5px;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
  transition: all 0.3s ease;
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

.dark-mode .dropdown-arrow {
  color: #9ca3af;
}

/* User Dropdown Menu */
.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  z-index: 1000;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-item i {
  width: 18px;
  font-size: 14px;
  color: #6b7280;
  transition: color 0.2s ease;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-item:hover i {
  color: #2563eb;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background-color: #fee2e2;
}

.dropdown-item.logout i {
  color: #dc2626;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
}

.dropdown-item.logout:hover i {
  color: #dc2626;
}

.dropdown-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}

.dark-mode .user-dropdown {
  background: #1f2937;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.dark-mode .dropdown-item {
  color: #f3f4f6;
}

.dark-mode .dropdown-item:hover {
  background-color: #374151;
}

.dark-mode .dropdown-item i {
  color: #9ca3af;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
}

.dark-mode .dropdown-item:hover i {
  color: #60a5fa;
}

.dark-mode .dropdown-divider {
  background-color: #374151;
}

.dark-mode .dropdown-item.logout {
  color: #f87171;
}

.dark-mode .dropdown-item.logout:hover {
  background-color: #7f1d1d;
}

.dark-mode .dropdown-item.logout i {
  color: #f87171;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
}

.content {
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-bottom: 24px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 2.2fr 0.6fr;
  gap: 24px;
  align-items: start;
  min-width: 0;
  overflow: hidden;
}

.stat-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 15px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-icon i {
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.stat-icon.yellow {
  background-color: #fff8e6;
  color: #ffb800;
}

.stat-icon.blue {
  background-color: #e6f4ff;
  color: #0080ff;
}

.stat-icon.green {
  background-color: #e6f9f0;
  color: #00c853;
}

.stat-icon.pink {
  background-color: #ffe6f0;
  color: #ff4d94;
}

.stat-icon.purple {
  background-color: #f0e6ff;
  color: #9966ff;
}

.stat-icon.orange {
  background-color: #fff4e6;
  color: #ff9800;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
}

.stat-change i {
  font-family: 'Font Awesome 6 Free';
  font-weight: 900;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.stat-change.negative {
  color: #ff4444;
}

.stat-change.positive {
  color: #00c853;
}

.stat-change-icon {
  font-size: 12px;
}

.main-content {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 24px;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

.sidebar-container {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 20px;
  height: 100%;
  min-width: 0;
}

.card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 213, 225, 0.3);
  min-width: 0;
  overflow: hidden;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-title .chart-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #e6f4ff;
  color: #0080ff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.card-title i {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #e6f4ff;
  color: #0080ff;
  font-size: 18px;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.chart-toggle {
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
}

.toggle-btn {
  padding: 8px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn i {
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
  font-size: 16px;
}

.toggle-btn:hover {
  color: #334155;
}

.toggle-btn.active {
  background: #ffffff;
  color: #0080ff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-btn.active i {
  color: #0080ff;
}

.legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.orders {
  background: #0080ff;
}

.legend-dot.revenue {
  background: #5dd3c7;
}

.chart-container {
  height: 350px;
  position: relative;
  padding-bottom: 10px;
  margin-right: -50px;
  padding-right: 50px;
  overflow: visible;
}

.tooltip-custom {
  position: absolute;
  background: #2d3748;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 1000;
}

.tooltip-custom.show {
  opacity: 1;
}

.tooltip-date {
  font-weight: 600;
  margin-bottom: 2px;
}

.tooltip-value {
  font-size: 11px;
  opacity: 0.9;
}

.bar-chart-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  width: 100%;
  padding: 0;
  height: 350px;
}

.bar-chart-wrapper {
  display: flex;
  gap: 16px;
  height: 100%;
  position: relative;
}

.bar-y-axis {
  width: 30px;
  height: calc(100% - 32px);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
}

.bar-y-label {
  font-size: 11px;
  color: #9ca3af;
  text-align: right;
  position: absolute;
  right: 0;
  line-height: 1;
  transform: translateY(50%);
}

.bar-chart-content {
  flex: 1;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.bar-grid-lines {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 32px;
  pointer-events: none;
  z-index: 0;
}

.bar-grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e5e7eb;
  transform: translateY(0.5px);
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  height: calc(100% - 32px);
  position: relative;
  z-index: 1;
}

.bar-chart-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
}

.bar-bars-group {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 100%;
}

.bar-item {
  width: 16px;
  background-color: #2563eb;
  border-radius: 2px 2px 0 0;
  transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease;
  cursor: pointer;
}

.bar-item:hover {
  transform: scaleY(1.05);
  filter: brightness(1.1);
}

.bar-item[class*="bar-animate-"] {
  animation: growUpSmooth 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes growUpSmooth {
  from {
    transform: scaleY(0);
    transform-origin: bottom;
  }
  to {
    transform: scaleY(1);
    transform-origin: bottom;
  }
}

.bar-item-1 {
  opacity: 1;
}

.bar-item-2 {
  opacity: 0.7;
}

.bar-item-3 {
  opacity: 0.45;
}

.bar-labels-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 12px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.bar-day-label {
  font-size: 12px;
  color: #9ca3af;
  flex: 1;
  text-align: center;
}

.bar-tooltip {
  position: absolute;
  background: #2d3748;
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  pointer-events: none;
  transform: translate(-50%, -100%);
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
}

.bar-tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #2d3748;
}

.bar-tooltip-day {
  font-size: 11px;
  opacity: 0.8;
  margin-bottom: 4px;
  font-weight: 500;
}

.bar-tooltip-value {
  font-size: 13px;
  font-weight: 400;
}

.bar-tooltip-value strong {
  font-weight: 700;
  color: #fff;
}

/* Recent Workouts Section */
.recent-workouts-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}

.workouts-container {
  background: white;
  padding: 32px 32px 12px 32px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 213, 225, 0.3);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
  min-width: 0;
}

.workouts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.workouts-header h1 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
}

.workouts-header h1 i {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #e6f4ff;
  color: #0080ff;
  font-size: 18px;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.view-all {
  color: #2563eb;
  font-size: 14px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.view-all:hover {
  color: #1d4ed8;
}

.empty-workouts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-workouts i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.3;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
}

.empty-workouts p {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #64748b;
}

.empty-workouts small {
  font-size: 13px;
  color: #94a3b8;
}

.workouts-table {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1fr 1.2fr;
  padding: 14px 20px;
  color: #64748b;
  font-size: 11.5px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  width: 100%;
  min-width: 0;
  border-bottom: 2px solid #f1f5f9;
}

.workouts-list {
  background: #fafafa;
  border-radius: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.workout-item {
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1fr 1.2fr;
  padding: 19px 20px;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  background: white;
  width: 100%;
  min-width: 0;
  transition: background-color 0.2s ease;
}

.workout-item:hover {
  background-color: #f8fafc;
}

.workout-item:last-child {
  border-bottom: none;
}

.workout-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  overflow: hidden;
}

.workout-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 17px;
}

.workout-icon i {
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
}

.workout-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.workout-name {
  font-size: 14.5px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.division-name {
  font-size: 12.5px;
  color: #64748b;
  font-weight: 500;
}

.workout-date {
  font-size: 13.5px;
  color: #64748b;
  white-space: nowrap;
}

.workout-duration {
  font-size: 13.5px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
}

.workout-exercises {
  font-size: 13.5px;
  color: #2563eb;
  font-weight: 600;
  white-space: nowrap;
}

.workout-status {
  display: flex;
  justify-content: flex-start;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.status-badge.completed .status-dot {
  background: #10b981;
}

.status-badge.in-progress {
  background: rgba(251, 191, 36, 0.15);
  color: #d97706;
}

.status-badge.in-progress .status-dot {
  background: #fbbf24;
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.status-badge.cancelled .status-dot {
  background: #ef4444;
}

.calendar-container {
  background: white;
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 213, 225, 0.3);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.month-year {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.nav-buttons {
  display: flex;
  gap: 10px;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: #f0f0f0;
}

.divider {
  height: 3px;
  background: #2563eb;
  border-radius: 2px;
  margin-bottom: 16px;
  width: 60px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
  position: relative;
  gap: 4px;
  padding-bottom: 4px;
}

.day-number {
  line-height: 1;
}

.workout-indicator {
  width: 5px;
  height: 5px;
  background: #10b981;
  border-radius: 50%;
  position: absolute;
  bottom: 4px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.day:hover:not(.today):not(.other-month) {
  background: #f0f0f0;
}

.day.today {
  background: #2563eb;
  color: white;
  font-weight: 600;
}

.day.other-month {
  color: #ccc;
}

.quick-stats-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 213, 225, 0.3);
  width: 100%;
}

.sidebar-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.quick-stat-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid rgba(203, 213, 225, 0.2);
}

.quick-stat-item:last-child {
  border-bottom: none;
}

.quick-stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-stat-icon i {
  font-size: 20px;
  color: #2563eb;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.quick-stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.quick-stat-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.quick-stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.3px;
}

.quick-stat-change {
  font-size: 11px;
  font-weight: 600;
}

.quick-stat-change.positive {
  color: #10b981;
}

.quick-stat-change.negative {
  color: #ef4444;
}

.workout-distribution-card {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 213, 225, 0.3);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.distribution-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.distribution-dropdown {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
  font-weight: 500;
}

.distribution-dropdown:hover {
  border-color: #cbd5e1;
}

.distribution-dropdown:focus {
  outline: none;
  border-color: #2563eb;
}

.distribution-stat-item {
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid transparent;
  background: linear-gradient(
      90deg,
      transparent 0%,
      #e5e7eb 20%,
      #e5e7eb 80%,
      transparent 100%
    )
    bottom / 100% 1px no-repeat;
}

.distribution-stat-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  background: none;
}

.distribution-stat-value {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  overflow: visible;
  min-height: 48px;
}

.distribution-arrow {
  font-size: 40px;
  font-weight: 900;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.distribution-arrow.up {
  color: #10b981;
}

.distribution-arrow.progress {
  color: #f59e0b;
}

.fa {
  font-family: FontAwesome;
}

.distribution-icon-progress {
  font-size: 40px;
  color: #f59e0b;
  margin-right: 8px;
}

.distribution-number {
  font-size: 40px;
  font-weight: 700;
  color: #1f2937;
  display: inline-block;
}

.distribution-stat-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  padding-left: 32px;
  margin: 0;
  font-weight: 500;
}

@media (max-width: 1400px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .main-content {
    width: 100%;
  }

  .sidebar-container {
    width: 100%;
    grid-template-rows: auto;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .calendar-container {
    grid-column: 1 / 2;
  }

  .quick-stats-card {
    grid-column: 2 / 3;
  }

  .workout-distribution-card {
    grid-column: 3 / 4;
  }
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .sidebar-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .calendar-container {
    grid-column: 1 / 2;
  }

  .quick-stats-card {
    grid-column: 2 / 3;
  }

  .workout-distribution-card {
    grid-column: 1 / -1;
  }
}

@media (max-width: 992px) {
  .main-content-wrapper {
    margin-left: 0;
  }

  .header {
    padding: 15px 20px;
    flex-wrap: wrap;
  }

  .search-bar input {
    width: 180px;
  }

  .content {
    padding: 30px 20px;
    overflow-x: hidden;
  }

  .chart-container {
    margin-right: 0;
    padding-right: 0;
  }

  .workout-item {
    grid-template-columns: 2fr 1fr 1fr 1.2fr;
    gap: 10px;
  }

  .workout-duration,
  .workout-exercises {
    font-size: 13px;
  }
}

@media (max-width: 880px) {
  .workout-item {
    grid-template-columns: 2fr 1fr 1fr;
  }

  .workout-item .workout-status {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-content-wrapper {
    margin-left: 0;
    margin-bottom: 70px;
  }

  .header {
    padding: 12px 15px;
  }

  .header-right {
    gap: 10px;
  }

  .search-bar {
    display: none;
  }

  .user-info {
    display: none;
  }

  .content {
    padding: 20px 15px;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .card {
    padding: 20px;
  }

  .workouts-container {
    padding: 20px;
    overflow-x: auto;
  }

  .workout-item {
    grid-template-columns: 2fr 1fr 1fr;
    padding: 15px;
    gap: 10px;
  }

  .sidebar-container {
    grid-template-columns: 1fr;
  }

  .calendar-container,
  .quick-stats-card,
  .workout-distribution-card {
    grid-column: 1 / -1;
  }

  .chart-container {
    height: 280px;
    margin-right: 0;
    padding-right: 0;
  }

  .legend {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .chart-header-right {
    width: 100%;
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 12px;
  }

  .chart-toggle {
    width: 100%;
  }

  .toggle-btn {
    flex: 1;
    text-align: center;
  }
}

@media (max-width: 576px) {
  * {
    box-sizing: border-box;
  }

  body {
    overflow-x: hidden;
    width: 100%;
  }

  .main-content-wrapper {
    margin-left: 0;
    margin-bottom: 70px;
  }

  .header {
    padding: 10px 12px;
    width: 100%;
  }

  .nav-title {
    font-size: 18px;
  }

  .notification-icon {
    width: 36px;
    height: 36px;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
  }

  .content {
    padding: 15px 12px;
    width: 100%;
    overflow-x: hidden;
  }

  .stats-grid {
    gap: 12px;
  }

  .stat-card {
    padding: 18px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-change {
    font-size: 12px;
  }

  .card {
    padding: 18px;
  }

  .card-title {
    font-size: 16px;
  }

  .chart-container {
    height: 220px;
    margin-right: 0;
    padding-right: 0;
  }

  .workouts-container {
    padding: 18px;
  }

  .workouts-header h1 {
    font-size: 16px;
  }

  .workouts-header a {
    font-size: 13px;
  }

  .workout-item {
    grid-template-columns: 2.5fr 1.2fr 1.3fr;
    font-size: 13px;
    padding: 12px;
    gap: 8px;
  }

  .calendar-container {
    padding: 18px;
  }

  .month-year {
    font-size: 14px;
  }

  .nav-btn {
    width: 26px;
    height: 26px;
    font-size: 16px;
  }

  .day {
    font-size: 12px;
  }

  .weekday {
    font-size: 10px;
  }

  .quick-stats-card,
  .workout-distribution-card {
    padding: 18px;
  }

  .sidebar-title,
  .distribution-title {
    font-size: 15px;
  }

  .quick-stat-icon {
    width: 36px;
    height: 36px;
  }

  .quick-stat-icon i {
    font-size: 18px;
  }

  .quick-stat-label {
    font-size: 10px;
  }

  .quick-stat-value {
    font-size: 16px;
  }

  .quick-stat-change {
    font-size: 10px;
  }

  .distribution-dropdown {
    padding: 6px 12px;
    font-size: 12px;
    padding-right: 32px;
  }

  .distribution-arrow,
  .distribution-icon-progress {
    font-size: 32px;
  }

  .distribution-number {
    font-size: 32px;
  }

  .distribution-stat-description {
    font-size: 12px;
    padding-left: 24px;
  }

  .legend-item {
    font-size: 12px;
  }

  .content-wrapper {
    gap: 15px;
  }

  .main-content {
    gap: 15px;
  }

  .toggle-btn {
    padding: 6px 16px;
    font-size: 13px;
  }

  .bar-chart-container {
    padding: 16px 0;
  }

  .bar-chart {
    gap: 12px;
  }

  .bar-item {
    width: 8px;
  }

  .bar-day-label {
    font-size: 11px;
  }
}

@media (max-width: 400px) {
  .main-content-wrapper {
    margin-left: 0;
    margin-bottom: 70px;
  }

  .header {
    padding: 10px;
  }

  .nav-title {
    font-size: 16px;
  }

  .notification-icon,
  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .content {
    padding: 12px 8px;
  }

  .stat-card {
    padding: 15px;
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .card,
  .workouts-container,
  .calendar-container,
  .quick-stats-card,
  .workout-distribution-card {
    padding: 15px;
  }

  .workout-item {
    padding: 10px;
    gap: 6px;
  }

  .workout-name {
    font-size: 11px;
  }

  .workout-date,
  .workout-duration {
    font-size: 12px;
  }

  .workout-exercises {
    font-size: 10px;
  }

  .chart-container {
    height: 200px;
  }

  .toggle-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .bar-chart {
    gap: 8px;
  }

  .bar-item {
    width: 6px;
  }
}
</style>
