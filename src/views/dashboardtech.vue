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
              ref="progressChart"
              type="area" 
              height="300" 
              :options="progressChartOptions" 
              :series="progressData" 
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

        <!-- Performance Metrics - DESIGN MELHORADO -->
        <div class="card performance-metrics-card">
          <div class="metrics-header">
            <h3 class="metrics-title">Métricas de Desempenho</h3>
            <p class="metrics-subtitle">Acompanhe os resultados obtidos</p>
          </div>
          
          <div class="metrics-grid">
            <div v-for="metric in performanceMetrics" :key="metric.label" class="metric-card">
              <div class="metric-content">
                <div class="metric-info">
                  <h4 class="metric-label">{{ metric.label }}</h4>
                  <span class="metric-value">{{ metric.value }}</span>
                </div>
                <div class="progress-wrapper">
                  <div class="progress-track">
                    <div 
                      class="progress-bar" 
                      :style="{ 
                        width: metric.percentage + '%',
                        '--progress-width': metric.percentage + '%'
                      }"
                    ></div>
                  </div>
                  <span class="progress-percentage">{{ metric.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="achievements-section">
            <div class="achievements-header">
              <h4 class="achievements-title">Conquistas Recentes</h4>
              <div class="achievements-badge">{{ recentAchievements.length }}</div>
            </div>
            <div class="achievement-list">
              <div v-for="achievement in recentAchievements" :key="achievement.id" class="achievement-item">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-content">
                  <span class="achievement-student">{{ achievement.student }}</span>
                  <span class="achievement-description">{{ achievement.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Individual Analysis - VERSÃO MELHORADA COM CORES DO NAVBAR -->
      <section class="individual-analysis-section">
        <div class="section-header">
          <div class="section-title-container">
            <h2 class="section-title">Análise Individual de Alunos</h2>
            <p class="section-subtitle">Acompanhamento detalhado do progresso de cada estudante</p>
          </div>
          <div class="section-actions">
            <button class="filter-btn">
              <span class="material-symbols-outlined">tune</span>
              Filtros
            </button>
            <button class="export-btn">
              <span class="material-symbols-outlined">download</span>
              Exportar
            </button>
          </div>
        </div>
        
        <div class="students-grid">
          <div 
            v-for="student in studentsData" 
            :key="student.id" 
            class="student-card"
            @click="viewStudentDetails(student.id)"
          >
            <!-- Student Header -->
            <div class="student-header">
              <div class="student-avatar-container">
                <div class="student-avatar" :style="{ backgroundImage: `url(${student.avatar})` }"></div>
                <div class="online-indicator"></div>
              </div>
              <div class="student-basic-info">
                <h3 class="student-name">{{ student.name }}</h3>
                <p class="student-id">#{{ String(student.id).padStart(4, '0') }}</p>
              </div>
              <div class="student-menu">
                <button class="menu-btn">
                  <span class="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>

            <!-- Progress Stats -->
            <div class="progress-stats">
              <div class="stat-row">
                <div class="stat-item weight-stat">
                  <div class="stat-icon-container">
                    <span class="material-symbols-outlined stat-icon">{{ getWeightIcon(student.weightProgress) }}</span>
                  </div>
                  <div class="stat-content">
                    <span class="stat-label">Progresso de Peso</span>
                    <div class="stat-value-container">
                      <span :class="['stat-value', getWeightClass(student.weightProgress)]">
                        {{ formatWeight(student.weightProgress) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="stat-item adherence-stat">
                  <div class="stat-icon-container">
                    <span class="material-symbols-outlined stat-icon">fitness_center</span>
                  </div>
                  <div class="stat-content">
                    <span class="stat-label">Adesão ao Treino</span>
                    <div class="adherence-progress">
                      <div class="adherence-bar">
                        <div 
                          class="adherence-fill" 
                          :style="{ width: student.adherence + '%' }"
                          :class="getAdherenceClass(student.adherence)"
                        ></div>
                      </div>
                      <span :class="['adherence-value', getAdherenceClass(student.adherence)]">
                        {{ student.adherence }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Trend Analysis -->
              <div class="trend-analysis">
                <div class="trend-indicator">
                  <span class="material-symbols-outlined trend-icon" :class="getTrendClass(student.trend)">
                    {{ getTrendIcon(student.trend) }}
                  </span>
                  <span class="trend-label">Tendência:</span>
                  <span :class="['trend-value', getTrendClass(student.trend)]">
                    {{ getTrendText(student.trend) }}
                  </span>
                </div>
                
                <!-- Mini Chart -->
                <div class="mini-chart">
                  <svg width="80" height="30" viewBox="0 0 80 30">
                    <polyline
                      :points="generateMiniChartPoints(student.trend)"
                      fill="none"
                      :stroke="getTrendColor(student.trend)"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Action Footer -->
            <div class="card-footer">
              <div class="footer-content">
                <div class="activity-info-wrapper">
                  <div class="activity-icon-container">
                    <div class="icon-pulse"></div>
                    <span class="material-symbols-outlined activity-icon">schedule</span>
                  </div>
                  <div class="activity-details">
                    <span class="activity-label">Última atividade</span>
                    <span class="activity-value">há {{ getLastWorkoutTime(student.id) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="summary-stats">
          <div class="summary-card">
            <div class="summary-icon">
              <span class="material-symbols-outlined">group</span>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ studentsData.length }}</span>
              <span class="summary-label">Alunos Ativos</span>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-icon">
              <span class="material-symbols-outlined">trending_up</span>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ calculateAverageProgress() }}%</span>
              <span class="summary-label">Progresso Médio</span>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-icon">
              <span class="material-symbols-outlined">fitness_center</span>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ calculateAverageAdherence() }}%</span>
              <span class="summary-label">Adesão Média</span>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-icon">
              <span class="material-symbols-outlined">emoji_events</span>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ getPositiveTrends() }}</span>
              <span class="summary-label">Tendências Positivas</span>
            </div>
          </div>
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
              ref="weeklyChart"
              type="bar" 
              height="350" 
              :options="weeklyChartOptions" 
              :series="weeklyData" 
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
      weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      progressData: [
        {
          name: "Média de Peso",
          type: 'area',
          data: [78, 76, 74, 75, 73, 71, 72, 70]
        },
        {
          name: "Treinos Concluídos",
          type: 'area',
          data: [42, 48, 46, 52, 49, 56, 58, 54]
        }
      ],
      weeklyData: [
        {
          name: "Sessões Realizadas",
          type: 'bar',
          data: [45, 52, 48, 61, 55, 67, 43]
        }
      ]
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

    progressChartOptions() {
      return {
        chart: {
          id: 'progress-chart',
          type: 'area',
          toolbar: { show: false },
          background: 'transparent',
          fontFamily: 'Inter, -apple-system, sans-serif',
          zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
          labels: { 
            style: { colors: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' } 
          },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: [
          {
            title: { 
              text: 'Peso (kg)',
              style: { color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }
            },
            labels: { 
              style: { colors: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' },
              formatter: function(val) {
                return val.toFixed(0)
              }
            }
          },
          {
            opposite: true,
            title: { 
              text: 'Treinos',
              style: { color: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' }
            },
            labels: { 
              style: { colors: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' },
              formatter: function(val) {
                return val.toFixed(0)
              }
            }
          }
        ],
        colors: ["#6c5ce7", "#a29bfe"],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 100]
          }
        },
        stroke: { 
          curve: "smooth",
          width: [3, 2.5],
          lineCap: 'round'
        },
        grid: { 
          borderColor: '#e5e7eb',
          strokeDashArray: 3,
          xaxis: { lines: { show: false } },
          padding: { top: 10, right: 0, bottom: 0, left: 10 }
        },
        legend: { show: false },
        tooltip: {
          enabled: true,
          theme: 'light',
          x: {
            show: true,
            format: 'dd MMM'
          },
          y: [
            {
              formatter: function(value) {
                return value + ' kg'
              }
            },
            {
              formatter: function(value) {
                return value + ' treinos'
              }
            }
          ]
        }
      };
    },

    weeklyChartOptions() {
      return {
        chart: {
          id: 'weekly-chart',
          type: 'bar',
          toolbar: { show: false },
          background: 'transparent',
          fontFamily: 'Inter, -apple-system, sans-serif'
        },
        plotOptions: {
          bar: {
            borderRadius: 8,
            columnWidth: '70%',
            distributed: true
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
          labels: { 
            style: { colors: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' } 
          }
        },
        yaxis: {
          labels: { 
            style: { colors: '#6B7280', fontFamily: 'Inter, -apple-system, sans-serif' } 
          }
        },
        colors: ['#6c5ce7'],
        grid: { 
          borderColor: '#e5e7eb', 
          strokeDashArray: 3 
        },
        tooltip: {
          enabled: true,
          theme: 'light',
          y: {
            formatter: function(value) {
              return value + ' sessões'
            }
          }
        },
        states: {
          hover: {
            filter: { type: 'lighten', value: 0.1 }
          }
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
      if (adherence >= 90) return 'excellent';
      if (adherence >= 80) return 'good';
      if (adherence >= 70) return 'warning';
      return 'poor';
    },

    getTrendClass(trend) {
      const classes = {
        'positive': 'positive',
        'stable': 'stable',
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
        'positive': 'Excelente',
        'stable': 'Estável',
        'negative': 'Requer Atenção'
      };
      return texts[trend] || 'Indefinida';
    },

    getTrendColor(trend) {
      const colors = {
        'positive': '#10b981',
        'stable': '#f59e0b',
        'negative': '#ef4444'
      };
      return colors[trend] || '#6b7280';
    },

    generateMiniChartPoints(trend) {
      const points = {
        'positive': '0,25 20,20 40,15 60,10 80,5',
        'stable': '0,15 20,18 40,15 60,17 80,15',
        'negative': '0,5 20,10 40,15 60,20 80,25'
      };
      return points[trend] || '0,15 20,15 40,15 60,15 80,15';
    },

    getLastWorkoutTime(studentId) {
      const times = ['2 horas', '1 dia', '3 dias', '5 dias'];
      return times[studentId % times.length];
    },

    calculateAverageProgress() {
      const total = this.studentsData.reduce((sum, student) => sum + Math.abs(student.weightProgress), 0);
      return Math.round((total / this.studentsData.length) * 10);
    },

    calculateAverageAdherence() {
      const total = this.studentsData.reduce((sum, student) => sum + student.adherence, 0);
      return Math.round(total / this.studentsData.length);
    },

    getPositiveTrends() {
      return this.studentsData.filter(student => student.trend === 'positive').length;
    },

    viewStudentDetails(studentId) {
      console.log('Viewing details for student:', studentId);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0');

.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.dashboard-main {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  background-color: var(--bg-secondary);
  color: var(--text-color);
  min-height: 100vh;
  box-sizing: border-box;
}

.dashboard-light {
  --card-bg: #ffffff;
  --text-color: #0f172a;
  --text-muted: #64748b;
  --text-secondary: #475569;
  --border-color: #e2e8f0;
  --bg-secondary: #f8fafc;
  --hover-bg: #f1f5f9;
  --primary-color: #2563eb;
  --primary-light: #3b82f6;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --progress-bg: #f1f5f9;
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(37, 99, 235, 0.1);
  background-color: #f8fafc;
}

.dashboard-dark {
  --card-bg: #1e1e2d;
  --text-color: #f9fafb;
  --text-muted: #9ca3af;
  --text-secondary: #6b7280;
  --border-color: #2d2d3f;
  --bg-secondary: #0f172a;
  --hover-bg: #1e1b4b;
  --primary-color: #8b5cf6;
  --primary-light: #a855f7;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --progress-bg: #374151;
  --glass-bg: rgba(30, 30, 45, 0.8);
  --glass-border: rgba(139, 92, 246, 0.2);
  background-color: #0f172a;
}

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
  background-color: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  font-weight: 400;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card:hover {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header-with-dropdown {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
  letter-spacing: -0.025em;
}

.card-subtitle {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
  font-weight: 400;
}

.dropdown-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.dropdown-container:hover {
  background-color: var(--hover-bg);
  border-color: var(--primary-color);
}

.performance-metrics-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.metrics-header {
  margin-bottom: 2rem;
}

.metrics-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.metrics-subtitle {
  display: none;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: transparent;
  border: none;
  padding: 0;
}

.metric-card:hover {
  background: transparent;
  border: none;
  transform: none;
  box-shadow: none;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metric-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-color);
  margin: 0;
}

.metric-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-color);
  text-align: right;
}

.progress-wrapper {
  display: block;
}

.progress-track {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #8b5cf6;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.progress-percentage {
  display: none;
}

.achievements-section {
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.achievements-header {
  margin-bottom: 1rem;
}

.achievements-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.achievements-badge {
  display: none;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.achievement-item {
  display: block;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-color);
}

.achievement-icon {
  display: none;
}

.achievement-content {
  display: inline;
}

.achievement-student {
  font-weight: 700;
  color: var(--text-color);
}

.achievement-description {
  color: var(--text-color);
  font-weight: 400;
}

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

.legend-dot.primary { background-color: #6c5ce7; }
.legend-dot.secondary { background-color: #a29bfe; }

/* ========= SEÇÃO INDIVIDUAL ANALYSIS - MELHORADA COM CORES DO NAVBAR ========= */
.individual-analysis-section {
  margin-bottom: 2rem;
  padding: 2.5rem;
  background: var(--card-bg);
  border-radius: 24px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.dashboard-light .individual-analysis-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(37, 99, 235, 0.1);
}

.dashboard-dark .individual-analysis-section {
  background: linear-gradient(135deg, #1e1e2d 0%, #0f172a 100%);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.section-title-container {
  flex: 1;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.dashboard-light .section-title {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-dark .section-title {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

.section-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-btn,
.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-color);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dashboard-light .filter-btn:hover,
.dashboard-light .export-btn:hover {
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  border-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
}

.dashboard-dark .filter-btn:hover,
.dashboard-dark .export-btn:hover {
  background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
  color: white;
  border-color: #8b5cf6;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

/* Students Grid - Melhorado e Alinhado */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.student-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: visible;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.student-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.dashboard-light .student-card::before {
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
}

.dashboard-dark .student-card::before {
  background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
}

.student-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.dashboard-light .student-card:hover {
  border-color: rgba(37, 99, 235, 0.3);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.15);
}

.dashboard-dark .student-card:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 12px 30px rgba(139, 92, 246, 0.15);
}

.student-card:hover::before {
  transform: scaleX(1);
}

.student-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.student-avatar-container {
  position: relative;
  flex-shrink: 0;
}

.student-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 3px solid var(--card-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.student-card:hover .student-avatar {
  transform: scale(1.08);
}

.dashboard-light .student-card:hover .student-avatar {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.dashboard-dark .student-card:hover .student-avatar {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: var(--success-color);
  border: 2px solid var(--card-bg);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.student-basic-info {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-id {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
  font-weight: 500;
  font-family: 'Fira Code', monospace;
}

.student-menu {
  opacity: 0;
  transition: opacity 0.3s ease;
  flex-shrink: 0;
}

.student-card:hover .student-menu {
  opacity: 1;
}

.menu-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: var(--hover-bg);
  color: var(--text-muted);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.dashboard-light .menu-btn:hover {
  background: #2563eb;
  color: white;
  transform: rotate(90deg);
}

.dashboard-dark .menu-btn:hover {
  background: #8b5cf6;
  color: white;
  transform: rotate(90deg);
}

.progress-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--hover-bg);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateX(4px);
}

.dashboard-light .stat-item:hover {
  background: rgba(37, 99, 235, 0.08);
}

.dashboard-dark .stat-item:hover {
  background: rgba(139, 92, 246, 0.12);
}

.stat-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  flex-shrink: 0;
}

.dashboard-light .stat-icon-container {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
}

.dashboard-dark .stat-icon-container {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
}

.stat-icon {
  font-size: 1.25rem;
  color: white;
  transition: all 0.3s ease;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value-container {
  display: flex;
  align-items: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  transition: color 0.3s ease;
}

.stat-value.positive {
  color: var(--success-color);
}

.stat-value.negative {
  color: var(--error-color);
}

.stat-value.neutral {
  color: var(--text-muted);
}

.adherence-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.adherence-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.dashboard-dark .adherence-bar {
  background: rgba(255, 255, 255, 0.08);
}

.adherence-fill {
  height: 100%;
  border-radius: 4px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.adherence-fill.excellent {
  background: linear-gradient(90deg, var(--success-color) 0%, #34d399 100%);
}

.adherence-fill.good {
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
}

.adherence-fill.warning {
  background: linear-gradient(90deg, var(--warning-color) 0%, #fbbf24 100%);
}

.adherence-fill.poor {
  background: linear-gradient(90deg, var(--error-color) 0%, #f87171 100%);
}

.adherence-value {
  font-weight: 700;
  font-size: 0.95rem;
  min-width: 3rem;
  text-align: right;
}

.adherence-value.excellent { color: var(--success-color); }
.adherence-value.good { color: #3b82f6; }
.adherence-value.warning { color: var(--warning-color); }
.adherence-value.poor { color: var(--error-color); }

.trend-analysis {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--hover-bg);
  border-radius: 12px;
  margin-top: 0.5rem;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.trend-icon {
  font-size: 1.25rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.trend-icon.positive {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.trend-icon.stable {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.trend-icon.negative {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
}

.trend-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
}

.trend-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.trend-value.positive { color: var(--success-color); }
.trend-value.stable { color: var(--warning-color); }
.trend-value.negative { color: var(--error-color); }

.mini-chart {
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.student-card:hover .mini-chart {
  opacity: 1;
}

/* Card Footer - CORRIGIDO */
.card-footer {
  padding: 0;
  margin: 1.5rem -2rem -2rem -2rem;
  border-top: 1px solid var(--border-color);
  border-radius: 0 0 20px 20px;
  background: transparent;
  position: relative;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  gap: 1.25rem;
  position: relative;
}

.dashboard-light .footer-content {
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.6) 0%, rgba(241, 245, 249, 0.4) 100%);
}

.dashboard-dark .footer-content {
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.3) 100%);
}

/* Activity Info Wrapper */
.activity-info-wrapper {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex: 1;
  min-width: 0;
}

.activity-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.dashboard-light .activity-icon-container {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.14) 100%);
}

.dashboard-dark .activity-icon-container {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.14) 0%, rgba(168, 85, 247, 0.18) 100%);
}

.icon-pulse {
  position: absolute;
  inset: -2px;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.dashboard-light .icon-pulse {
  border: 1.5px solid rgba(37, 99, 235, 0.4);
}

.dashboard-dark .icon-pulse {
  border: 1.5px solid rgba(139, 92, 246, 0.4);
}

.activity-icon-container:hover .icon-pulse {
  opacity: 1;
  animation: iconPulse 1.5s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.12);
    opacity: 0.2;
  }
}

.activity-icon-container:hover {
  transform: scale(1.06);
}

.activity-icon {
  font-size: 1rem;
  z-index: 2;
  position: relative;
}

.dashboard-light .activity-icon {
  color: #2563eb;
}

.dashboard-dark .activity-icon {
  color: #a855f7;
}

.activity-details {
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-width: 0;
  flex: 1;
}

.activity-label {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  line-height: 1.2;
  opacity: 0.85;
}

.activity-value {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Button Ver Detalhes - CORRIGIDO */
.btn-view-details {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6875rem 1.375rem;
  border: none;
  border-radius: 9px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.005em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  z-index: 10;
}

.dashboard-light .btn-view-details {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
}

.dashboard-dark .btn-view-details {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.25);
}

.btn-view-details::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.dashboard-light .btn-view-details::before {
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
}

.dashboard-dark .btn-view-details::before {
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
}

.btn-view-details::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.dashboard-light .btn-view-details::after {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
}

.dashboard-dark .btn-view-details::after {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.btn-view-details:hover {
  transform: translateY(-2px);
}

.dashboard-light .btn-view-details:hover {
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
}

.dashboard-dark .btn-view-details:hover {
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.35);
}

.btn-view-details:hover::before {
  opacity: 1;
}

.btn-view-details:hover::after {
  left: 100%;
}

.btn-view-details:active {
  transform: translateY(0);
}

.btn-label {
  position: relative;
  z-index: 2;
}

.btn-arrow-container {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.dashboard-light .btn-arrow-container {
  background: rgba(255, 255, 255, 0.15);
}

.dashboard-dark .btn-arrow-container {
  background: rgba(255, 255, 255, 0.1);
}

.btn-view-details:hover .btn-arrow-container {
  transform: translateX(2px);
}

.dashboard-light .btn-view-details:hover .btn-arrow-container {
  background: rgba(255, 255, 255, 0.25);
}

.dashboard-dark .btn-view-details:hover .btn-arrow-container {
  background: rgba(255, 255, 255, 0.18);
}

.btn-arrow-container .material-symbols-outlined {
  font-size: 0.8125rem;
  font-weight: 600;
}

/* Summary Stats */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.dashboard-light .summary-stats {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.dashboard-dark .summary-stats {
  background: linear-gradient(135deg, #1e1e2d 0%, #0f172a 100%);
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.dashboard-light .summary-card:hover {
  border-color: rgba(37, 99, 235, 0.3);
}

.dashboard-dark .summary-card:hover {
  border-color: rgba(139, 92, 246, 0.3);
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  flex-shrink: 0;
}

.dashboard-light .summary-icon {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
}

.dashboard-dark .summary-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
}

.summary-icon .material-symbols-outlined {
  font-size: 1.5rem;
  color: white;
}

.summary-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
}

.summary-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* Bottom Section */
.bottom-section {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
}

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
  border-color: var(--primary-color);
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
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.02);
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
  background-color: var(--primary-color);
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
  background-color: rgba(99, 102, 241, 0.05);
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
  background-color: var(--primary-color);
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
  background-color: var(--primary-color);
}

.legend-dot.group {
  background-color: #10b981;
}

.legend-dot.assessment {
  background-color: #f59e0b;
}

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

.weekly-stats .stat-item {
  text-align: center;
  background: transparent;
  padding: 0;
  border-radius: 0;
}

.weekly-stats .stat-item:hover {
  transform: none;
  background: transparent;
}

.weekly-stats .stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.weekly-stats .stat-label {
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

  .students-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-main {
    margin-left: 0;
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
  
  .individual-analysis-section {
    padding: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-actions {
    justify-content: center;
    width: 100%;
  }

  .filter-btn,
  .export-btn {
    flex: 1;
  }

  .students-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .student-card {
    padding: 1.5rem;
  }

  .student-header {
    flex-wrap: wrap;
  }

  .student-avatar-container {
    order: 1;
  }

  .student-basic-info {
    order: 2;
    flex: 1;
  }

  .student-menu {
    order: 3;
    opacity: 1;
  }

  .card-footer {
    margin: 1.5rem -1.5rem -1.5rem -1.5rem;
  }

  .footer-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem 1.5rem;
  }

  .activity-info-wrapper {
    justify-content: center;
  }

  .btn-view-details {
    width: 100%;
    justify-content: center;
  }

  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1.5rem;
  }

  .summary-card {
    padding: 1rem;
  }

  .summary-value {
    font-size: 1.25rem;
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
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.student-card {
  animation: slideInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.student-card:nth-child(1) { animation-delay: 0.1s; }
.student-card:nth-child(2) { animation-delay: 0.2s; }
.student-card:nth-child(3) { animation-delay: 0.3s; }
.student-card:nth-child(4) { animation-delay: 0.4s; }

.summary-card {
  animation: fadeInScale 0.5s ease-out;
  animation-fill-mode: both;
}

.summary-card:nth-child(1) { animation-delay: 0.1s; }
.summary-card:nth-child(2) { animation-delay: 0.2s; }
.summary-card:nth-child(3) { animation-delay: 0.3s; }
.summary-card:nth-child(4) { animation-delay: 0.4s; }

.btn-view-details:hover .material-symbols-outlined {
  animation: arrowBounce 0.6s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}

/* Focus States */
.nav-btn:focus,
.filter-btn:focus,
.export-btn:focus,
.btn-view-details:focus,
.menu-btn:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.student-card:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 4px;
}

/* Selection Styles */
::selection {
  background-color: var(--primary-color);
  color: white;
}

::-moz-selection {
  background-color: var(--primary-color);
  color: white;
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.dashboard-light ::-webkit-scrollbar-thumb:hover {
  background: #2563eb;
}

.dashboard-dark ::-webkit-scrollbar-thumb:hover {
  background: #8b5cf6;
}

/* Print Styles */
@media print {
  .dashboard-main {
    margin-left: 0;
  }
  
  .nav-btn,
  .filter-btn,
  .export-btn,
  .btn-view-details,
  .menu-btn {
    display: none;
  }
  
  .card,
  .student-card {
    break-inside: avoid;
  }

  .individual-analysis-section {
    background: white !important;
  }

  .students-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .student-card {
    border: 2px solid var(--text-color);
  }
  
  .btn-view-details {
    border: 2px solid white;
  }
}

.positive { 
  color: #4ade80;
  background-color: rgba(74, 222, 128, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.negative { 
  color: #f87171;
  background-color: rgba(248, 113, 113, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.warning { 
  color: #fbbf24;
  background-color: rgba(251, 191, 36, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.neutral { 
  color: var(--text-muted);
  background-color: rgba(156, 163, 175, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}
</style>