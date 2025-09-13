<template>
  <div :class="isDarkMode ? 'dashboard-dark' : 'dashboard-light'" class="dashboard-container">
    <DashboardNavBar />
    <main class="dashboard-main">
      <!-- Header sem título -->
      <header class="dashboard-header">
        <div class="user-info">
          <div class="user-avatar"></div>
          <div>
            <h2 class="user-name">Alexandre</h2>
            <p class="user-role">Personal Trainer</p>
          </div>
        </div>
      </header>

      <!-- Main Content Grid -->
      <section class="content-grid">
        <!-- Progress Overview -->
        <div class="card progress-overview-card">
          <div class="card-header-with-dropdown">
            <div>
              <h3 class="card-title">Visão Geral do Progresso dos Alunos</h3>
              <p class="card-subtitle">Comparação do progresso ao longo do tempo.</p>
            </div>
            <div class="dropdown-container">
              <span class="dropdown-text">{{ selectedPeriod }}</span>
              <span class="material-symbols-outlined dropdown-icon">expand_more</span>
            </div>
          </div>
          
          <div class="chart-container">
            <apexchart 
              type="area" 
              height="300" 
              :options="progressChartOptions" 
              :series="progressChartData" 
            />
          </div>
          
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-dot primary"></div>
              <span>Média de Peso (kg)</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot secondary"></div>
              <span>Treinos Concluídos</span>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="card performance-metrics-card">
          <h3 class="card-title">Métricas de Desempenho</h3>
          
          <div class="metrics-list">
            <div v-for="metric in performanceMetrics" :key="metric.label" class="metric-item">
              <div class="metric-header">
                <span class="metric-label">{{ metric.label }}</span>
                <span class="metric-value">{{ metric.value }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: metric.percentage + '%' }"></div>
              </div>
            </div>
          </div>

          <div class="achievements-section">
            <h4 class="achievements-title">Conquistas Recentes</h4>
            <div class="achievement-list">
              <p v-for="achievement in recentAchievements" :key="achievement.id" class="achievement-item">
                <span class="achievement-name">{{ achievement.student }}</span> {{ achievement.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Individual Analysis -->
      <section class="individual-analysis-section">
        <h2 class="section-title">Análise Individual de Alunos</h2>
        
        <div class="table-container">
          <table class="students-table">
            <thead class="table-header">
              <tr>
                <th class="table-th">Aluno</th>
                <th class="table-th text-center">Progresso de Peso</th>
                <th class="table-th text-center">Adesão ao Treino</th>
                <th class="table-th">Tendência</th>
                <th class="table-th">Ações</th>
              </tr>
            </thead>
            <tbody class="table-body">
              <tr v-for="student in studentsData" :key="student.id" class="table-row">
                <td class="table-cell">
                  <div class="student-info">
                    <div class="student-avatar" :style="{ backgroundImage: `url(${student.avatar})` }"></div>
                    <span>{{ student.name }}</span>
                  </div>
                </td>
                <td class="table-cell text-center">
                  <span :class="['weight-progress', getWeightClass(student.weightProgress)]">
                    <span class="material-symbols-outlined progress-icon">{{ getWeightIcon(student.weightProgress) }}</span>
                    {{ formatWeight(student.weightProgress) }}
                  </span>
                </td>
                <td class="table-cell text-center">
                  <span :class="['adherence-value', getAdherenceClass(student.adherence)]">{{ student.adherence }}%</span>
                </td>
                <td class="table-cell">
                  <span :class="['trend-value', getTrendClass(student.trend)]">
                    <span class="material-symbols-outlined trend-icon">{{ getTrendIcon(student.trend) }}</span>
                    {{ getTrendText(student.trend) }}
                  </span>
                </td>
                <td class="table-cell">
                  <button class="action-button" @click="viewStudentDetails(student.id)">Ver Detalhes</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Calendar and Weekly Stats Section -->
      <section class="bottom-section">
        <!-- Calendar Card -->
        <div class="card calendar-card">
          <div class="calendar-header">
            <h3 class="card-title">Agenda de Treinos</h3>
          </div>
          
          <!-- Modern Calendar Component -->
          <div class="modern-calendar">
            <div class="calendar-nav">
              <button @click="previousMonth" class="nav-btn">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <div class="month-year">
                <h4 class="current-month">{{ getCurrentMonthName() }}</h4>
                <span class="current-year">{{ currentDate.getFullYear() }}</span>
              </div>
              <button @click="nextMonth" class="nav-btn">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <div class="calendar-grid">
              <div class="weekdays">
                <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
              </div>
              
              <div class="days-grid">
                <div 
                  v-for="day in calendarDays" 
                  :key="day.date"
                  :class="[
                    'day-cell',
                    {
                      'other-month': day.isOtherMonth,
                      'today': day.isToday,
                      'has-events': day.events.length > 0
                    }
                  ]"
                  @click="selectDay(day)"
                >
                  <span class="day-number">{{ day.day }}</span>
                  <div v-if="day.events.length > 0" class="events-container">
                    <div 
                      v-for="event in day.events.slice(0, 2)" 
                      :key="event.id"
                      :class="['event-dot', event.type]"
                    ></div>
                    <span v-if="day.events.length > 2" class="more-events">+{{ day.events.length - 2 }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Event Types Legend -->
            <div class="calendar-legend">
              <div class="legend-item">
                <div class="legend-dot personal"></div>
                <span>Personal Training</span>
              </div>
              <div class="legend-item">
                <div class="legend-dot group"></div>
                <span>Treino em Grupo</span>
              </div>
              <div class="legend-item">
                <div class="legend-dot assessment"></div>
                <span>Avaliação</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Weekly Volume Chart -->
        <div class="card weekly-volume-card">
          <h3 class="card-title">Volume Semanal</h3>
          <div class="weekly-chart">
            <apexchart 
              type="column" 
              height="350" 
              :options="weeklyChartOptions" 
              :series="weeklyChartData" 
            />
          </div>
          <div class="weekly-stats">
            <div class="stat-item">
              <span class="stat-value">{{ weeklyStats.totalSessions }}</span>
              <span class="stat-label">Sessões Totais</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ weeklyStats.avgDuration }}min</span>
              <span class="stat-label">Duração Média</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ weeklyStats.completionRate }}%</span>
              <span class="stat-label">Taxa de Conclusão</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "DashboardTech",
  components: { 
    DashboardNavBar, 
    apexchart: VueApexCharts 
  },
  data() {
    return {
      currentDate: new Date(),
      selectedPeriod: 'Últimos 6 meses',
      weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    };
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);

    return { isDarkMode };
  },
  computed: {
    studentsData() {
      return [
        {
          id: 1,
          name: 'Carlos Silva',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          weightProgress: -2.5,
          adherence: 95,
          trend: 'positive'
        },
        {
          id: 2,
          name: 'Sofia Santos',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b4fb0ce5?w=100&h=100&fit=crop&crop=face',
          weightProgress: -1.0,
          adherence: 80,
          trend: 'stable'
        },
        {
          id: 3,
          name: 'Lucas Oliveira',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          weightProgress: 0.5,
          adherence: 65,
          trend: 'negative'
        },
        {
          id: 4,
          name: 'Ana Costa',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          weightProgress: -3.2,
          adherence: 88,
          trend: 'positive'
        }
      ];
    },

    performanceMetrics() {
      return [
        { label: 'Perda de Peso Total', value: '-25.4kg', percentage: 75 },
        { label: 'Total de Treinos Concluídos', value: '342', percentage: 85 },
        { label: 'Aumento de Carga (Média)', value: '+15%', percentage: 60 },
        { label: 'Taxa de Adesão', value: '92%', percentage: 92 }
      ];
    },

    recentAchievements() {
      return [
        { id: 1, student: 'Sofia', description: 'atingiu a meta de perda de peso!' },
        { id: 2, student: 'Lucas', description: 'completou 50 treinos.' },
        { id: 3, student: 'Ana', description: 'melhorou 20% na força.' }
      ];
    },

    progressChartData() {
      return [
        {
          name: "Média de Peso",
          data: [78, 76, 74, 75, 73, 71, 72, 70]
        },
        {
          name: "Treinos Concluídos",
          data: [42, 48, 46, 52, 49, 56, 58, 54]
        }
      ];
    },

    progressChartOptions() {
      return {
        chart: {
          toolbar: { show: false },
          background: 'transparent'
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
          labels: { 
            style: { colors: '#6B7280' } 
          }
        },
        yaxis: [
          {
            title: { text: 'Peso (kg)', style: { color: '#6B7280' } },
            labels: { style: { colors: '#6B7280' } }
          },
          {
            opposite: true,
            title: { text: 'Treinos', style: { color: '#6B7280' } },
            labels: { style: { colors: '#6B7280' } }
          }
        ],
        colors: ["#007bff", "#9CA3AF"],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.3,
            opacityTo: 0
          }
        },
        stroke: { 
          curve: "smooth", 
          width: [3, 2.5] 
        },
        grid: { 
          borderColor: '#E5E7EB', 
          strokeDashArray: 3 
        },
        legend: { show: false }
      };
    },

    weeklyChartData() {
      return [
        {
          name: "Sessões Realizadas",
          data: [45, 52, 48, 61, 55, 67, 43]
        }
      ];
    },

    weeklyChartOptions() {
      return {
        chart: {
          toolbar: { show: false },
          background: 'transparent'
        },
        plotOptions: {
          bar: {
            borderRadius: 8,
            columnWidth: '70%'
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
          labels: { 
            style: { colors: '#6B7280' } 
          }
        },
        yaxis: {
          labels: { 
            style: { colors: '#6B7280' } 
          }
        },
        colors: ["#007bff"],
        grid: { 
          borderColor: '#E5E7EB', 
          strokeDashArray: 3 
        }
      };
    },

    weeklyStats() {
      return {
        totalSessions: 326,
        avgDuration: 52,
        completionRate: 94
      };
    },

    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const firstDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      
      const days = [];
      
      // Previous month days
      const prevMonth = new Date(year, month - 1, 0);
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        days.push({
          day: prevMonth.getDate() - i,
          date: `${year}-${month}-${prevMonth.getDate() - i}`,
          isOtherMonth: true,
          events: [],
          isToday: false
        });
      }
      
      // Current month days
      const today = new Date();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getDate() === day && 
                       today.getMonth() === month && 
                       today.getFullYear() === year;
        
        const events = this.generateEventsForDay(day);
        
        days.push({
          day,
          date: `${year}-${month + 1}-${day}`,
          isOtherMonth: false,
          events,
          isToday
        });
      }
      
      // Next month days
      const remainingDays = 42 - days.length;
      for (let day = 1; day <= remainingDays; day++) {
        days.push({
          day,
          date: `${year}-${month + 2}-${day}`,
          isOtherMonth: true,
          events: [],
          isToday: false
        });
      }
      
      return days;
    }
  },

  methods: {
    generateEventsForDay(day) {
      const events = [];
      const eventTypes = ['personal', 'group', 'assessment'];
      
      // Simulate events on certain days
      if ([3, 5, 8, 12, 15, 17, 19, 22, 24, 26, 29].includes(day)) {
        const numEvents = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numEvents; i++) {
          events.push({
            id: `${day}-${i}`,
            type: eventTypes[Math.floor(Math.random() * eventTypes.length)]
          });
        }
      }
      
      return events;
    },

    getCurrentMonthName() {
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return months[this.currentDate.getMonth()];
    },

    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    },

    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    },

    selectDay(day) {
      console.log('Selected day:', day);
      // Implement day selection logic
    },

    getWeightClass(weight) {
      return weight < 0 ? 'negative' : weight > 0 ? 'positive' : 'neutral';
    },

    getWeightIcon(weight) {
      return weight < 0 ? 'arrow_downward' : weight > 0 ? 'arrow_upward' : 'remove';
    },

    formatWeight(weight) {
      return weight > 0 ? `+${weight}kg` : `${weight}kg`;
    },

    getAdherenceClass(adherence) {
      if (adherence >= 90) return 'positive';
      if (adherence >= 70) return 'warning';
      return 'negative';
    },

    getTrendClass(trend) {
      const classes = {
        'positive': 'positive',
        'stable': 'warning',
        'negative': 'negative'
      };
      return classes[trend] || 'neutral';
    },

    getTrendIcon(trend) {
      const icons = {
        'positive': 'trending_up',
        'stable': 'trending_flat',
        'negative': 'trending_down'
      };
      return icons[trend] || 'remove';
    },

    getTrendText(trend) {
      const texts = {
        'positive': 'Positiva',
        'stable': 'Estável',
        'negative': 'Requer Atenção'
      };
      return texts[trend] || 'Indefinida';
    },

    viewStudentDetails(studentId) {
      console.log('Viewing details for student:', studentId);
      // Implement navigation to student details
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0');

.dashboard-container {
  display: flex;
  min-height: 100vh;
  margin-left: 80px;
  font-family: 'Manrope', 'Noto Sans', sans-serif;
}

.dashboard-light {
  --card-bg: #ffffff;
  --text-color: #1f2937;
  --text-muted: #6b7280;
  --border-color: #e5e7eb;
  --bg-secondary: #f9fafb;
  --hover-bg: #f3f4f6;
  background-color: #ffffff;
}

.dashboard-dark {
  --card-bg: #1f2937;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --border-color: #374151;
  --bg-secondary: #111827;
  --hover-bg: #374151;
  background-color: #111827;
}

.dashboard-main {
  flex: 1;
  padding: 2rem;
  background-color: var(--card-bg);
  color: var(--text-color);
}

/* Header - Simplified */
.dashboard-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background-image: url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face');
  background-size: cover;
  background-position: center;
  border-radius: 50%;
}

.user-name {
  color: var(--text-color);
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
}

.user-role {
  color: var(--text-muted);
  font-size: 0.8rem;
  margin: 0;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Cards */
.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header-with-dropdown {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.card-subtitle {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.dropdown-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.dropdown-container:hover {
  background-color: var(--hover-bg);
}

/* Chart */
.chart-container {
  margin: 1rem 0;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 0.875rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.legend-dot.primary { background-color: #007bff; }
.legend-dot.secondary { background-color: #9ca3af; }

/* Performance Metrics */
.metrics-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--text-color);
}

.metric-value {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-color);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  border-radius: 3px;
  transition: width 0.6s ease;
}

/* Achievements */
.achievements-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.achievements-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.achievement-item {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}

.achievement-name {
  font-weight: 600;
  color: var(--text-color);
}

/* Individual Analysis */
.individual-analysis-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
}

.students-table {
  width: 100%;
  text-align: left;
}

.table-header {
  background-color: var(--bg-secondary);
}

.table-th {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: var(--bg-secondary);
}

.table-row:not(:last-child) {
  border-bottom: 1px solid var(--border-color);
}

.table-cell {
  padding: 1rem 1.5rem;
  white-space: nowrap;
  color: var(--text-color);
}

.text-center { text-align: center; }

.student-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.student-avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.weight-progress,
.trend-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.progress-icon,
.trend-icon {
  font-size: 1rem;
}

.positive { color: #059669; }
.negative { color: #dc2626; }
.warning { color: #d97706; }
.neutral { color: var(--text-muted); }

.adherence-value {
  font-weight: 500;
  font-size: 0.875rem;
}

.action-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

/* Bottom Section */
.bottom-section {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
}

/* Modern Calendar */
.modern-calendar {
  margin-top: 1rem;
}

.calendar-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.nav-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background-color: var(--bg-secondary);
  border-color: #007bff;
}

.month-year {
  text-align: center;
}

.current-month {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.current-year {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.calendar-grid {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.weekday {
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-cell {
  min-height: 3rem;
  padding: 0.5rem;
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.day-cell:nth-child(7n) {
  border-right: none;
}

.day-cell:hover {
  background-color: var(--hover-bg);
}

.day-cell.today {
  background-color: #007bff;
  color: white;
}

.day-cell.today .day-number {
  color: white;
}

.day-cell.other-month {
  color: var(--text-muted);
  opacity: 0.4;
}

.day-cell.has-events {
  background-color: #f0f9ff;
}

.day-number {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.events-container {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  align-items: center;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.event-dot.personal {
  background-color: #007bff;
}

.event-dot.group {
  background-color: #10b981;
}

.event-dot.assessment {
  background-color: #f59e0b;
}

.more-events {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.875rem;
}

.legend-dot.personal {
  background-color: #007bff;
}

.legend-dot.group {
  background-color: #10b981;
}

.legend-dot.assessment {
  background-color: #f59e0b;
}

/* Weekly Stats */
.weekly-chart {
  margin: 1rem 0;
}

.weekly-stats {
  display: flex;
  justify-content: space-around;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  margin-top: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .bottom-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    margin-left: 0;
  }
  
  .dashboard-main {
    padding: 1rem;
  }
  
  .dashboard-header {
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .user-info {
    width: 100%;
    justify-content: center;
  }
  
  .card {
    padding: 1rem;
  }
  
  .card-header-with-dropdown {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .chart-legend {
    flex-direction: column;
    gap: 1rem;
  }
  
  .table-container {
    overflow-x: scroll;
  }
  
  .calendar-nav {
    margin-bottom: 1rem;
  }
  
  .nav-btn {
    width: 2rem;
    height: 2rem;
  }
  
  .current-month {
    font-size: 1rem;
  }
  
  .day-cell {
    min-height: 2.5rem;
    padding: 0.25rem;
  }
  
  .weekday {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }
  
  .day-number {
    font-size: 0.75rem;
  }
  
  .event-dot {
    width: 4px;
    height: 4px;
  }
  
  .calendar-legend {
    flex-direction: column;
    gap: 0.75rem;
    font-size: 0.75rem;
  }
  
  .weekly-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: slideIn 0.5s ease-out;
}

.table-row:hover {
  transform: translateX(2px);
}

/* Focus States */
.nav-btn:focus,
.action-button:focus,
.dropdown-container:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Loading States */
.chart-container:empty::after {
  content: 'Carregando gráfico...';
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-muted);
  font-style: italic;
}

/* Hover Effects */
.student-avatar:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.day-cell:hover .day-number {
  font-weight: 600;
}

.metric-item:hover .progress-fill {
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
}

/* Dark Mode Adjustments */
.dashboard-dark .day-cell.has-events {
  background-color: rgba(0, 123, 255, 0.1);
}

.dashboard-dark .nav-btn:hover {
  background-color: var(--hover-bg);
  border-color: #007bff;
}

.dashboard-dark .calendar-grid {
  border: 1px solid var(--border-color);
}

/* Print Styles */
@media print {
  .dashboard-container {
    margin-left: 0;
  }
  
  .nav-btn,
  .action-button {
    display: none;
  }
  
  .card {
    break-inside: avoid;
  }
}
</style>
