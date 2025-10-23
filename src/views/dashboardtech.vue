<template>
  <div :class="isDarkMode ? 'dashboard-dark' : 'dashboard-light'" class="dashboard-container">
    <DashboardNavBar />
    <main class="dashboard-main">

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando dados do dashboard...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3>Erro ao carregar dados</h3>
        <p>{{ error }}</p>
        <button @click="loadDashboardData" class="retry-btn">Tentar novamente</button>
      </div>

      <!-- Main Content Grid -->
      <section v-else class="content-grid">
        <!-- Progress Overview -->
        <div class="card progress-overview-card">
          <div class="card-header-with-dropdown">
            <div>
              <h3 class="card-title">Visão Geral do Progresso dos Alunos</h3>
              <p class="card-subtitle">Comparação do progresso ao longo do tempo.</p>
            </div>
            <div v-if="hasProgressData" class="dropdown-container" @click="showPeriodDropdown = !showPeriodDropdown">
              <span class="dropdown-text">{{ selectedPeriod }}</span>
              <i class="fas fa-chevron-down dropdown-icon" :class="{ 'rotated': showPeriodDropdown }"></i>
              <div v-if="showPeriodDropdown" class="dropdown-menu">
                <div 
                  v-for="option in periodOptions" 
                  :key="option.value"
                  class="dropdown-item"
                  :class="{ 'active': selectedPeriod === option.value }"
                  @click.stop="changePeriod(option.value)"
                >
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Mensagem quando não há dados -->
          <div v-if="!hasProgressData" class="no-data-message">
            <div class="no-data-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h4>Nenhum dado de progresso disponível</h4>
            <p>Os gráficos serão exibidos quando houver sessões de treino concluídas ou registros de progresso dos alunos.</p>
          </div>
          
          <!-- Gráfico (só exibe se houver dados) -->
          <div v-else>
            <div class="chart-container">
              <apexchart 
                ref="progressChart"
                type="area" 
                height="300" 
                :options="progressChartOptions" 
                :series="progressData" 
              />
            </div>
            
            <!-- Enhanced Legend with Stats (só exibe se houver dados) -->
            <div class="enhanced-chart-legend">
              <div class="legend-stats-row">
                <div class="legend-stat-card">
                  <div class="legend-stat-header">
                    <div class="legend-indicator primary-indicator">
                      <div class="indicator-dot"></div>
                      <span class="indicator-line"></span>
                    </div>
                    <span class="legend-stat-label">Alunos Ativos</span>
                  </div>
                  <div class="legend-stat-value">
                    <span class="stat-number">{{ getTotalActiveStudents() }}</span>
                    <span class="stat-unit">alunos</span>
                  </div>
                  <div class="legend-stat-trend" :class="getActiveStudentsTrendClass()">
                    <i class="fas" :class="getActiveStudentsTrendIcon()"></i>
                    <span>{{ getActiveStudentsTrendText() }}</span>
                  </div>
                </div>

                <div class="legend-stat-card">
                  <div class="legend-stat-header">
                    <div class="legend-indicator secondary-indicator">
                      <div class="indicator-dot"></div>
                      <span class="indicator-line"></span>
                    </div>
                    <span class="legend-stat-label">Treinos Concluídos</span>
                  </div>
                  <div class="legend-stat-value">
                    <span class="stat-number">{{ getTotalCompletedWorkouts() }}</span>
                    <span class="stat-unit">sessões</span>
                  </div>
                  <div class="legend-stat-trend success">
                    <i class="fas fa-chart-line"></i>
                    <span>{{ getWorkoutsPeriodText() }}</span>
                  </div>
                </div>

                <div class="legend-stat-card highlight-card">
                  <div class="legend-stat-header">
                    <div class="legend-indicator accent-indicator">
                      <i class="fas fa-percentage"></i>
                    </div>
                    <span class="legend-stat-label">Adesão Média</span>
                  </div>
                  <div class="legend-stat-value">
                    <span class="stat-number">{{ getAverageAdherence() }}</span>
                    <span class="stat-unit">%</span>
                  </div>
                  <div class="legend-stat-trend" :class="getAdherenceTrendClass()">
                    <i class="fas" :class="getAdherenceTrendIcon()"></i>
                    <span>{{ getAdherenceTrendText() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics - VALORES BASEADOS EM DADOS REAIS -->
        <div class="card performance-metrics-card">
          <div class="metrics-header">
            <h3 class="metrics-title">Métricas de Desempenho</h3>
            <p class="metrics-subtitle">Dados calculados automaticamente baseados nas sessões e progressos registrados</p>
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
              <h4 class="achievements-title">Alertas do Instrutor</h4>
              <div class="achievements-badge">{{ instructorAlerts.length }}</div>
            </div>
            <div class="achievement-list">
              <div v-for="alert in instructorAlerts" :key="alert.id" class="achievement-item" :class="`alert-${alert.type}`">
                <div class="achievement-icon">
                  <span v-if="alert.type === 'warning'">⚠️</span>
                  <span v-else-if="alert.type === 'alert'">🚨</span>
                  <span v-else-if="alert.type === 'success'">✅</span>
                  <span v-else>ℹ️</span>
                </div>
                <div class="achievement-content">
                  <span class="achievement-student">{{ alert.title }}</span>
                  <span class="achievement-description">{{ alert.message }}</span>
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
        </div>

        <div class="summary-stats">
          <div class="summary-card">
            <div class="summary-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ studentsData.length }}</span>
              <span class="summary-label">Alunos Ativos</span>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ calculateAverageProgress() }}%</span>
              <span class="summary-label">Progresso Médio</span>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-icon">
              <i class="fas fa-dumbbell"></i>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ calculateAverageAdherence() }}%</span>
              <span class="summary-label">Adesão Média</span>
            </div>
          </div>
          
          <div class="summary-card">
            <div class="summary-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ getPositiveTrends() }}</span>
              <span class="summary-label">Tendências Positivas</span>
            </div>
          </div>
        </div>
        
        <div class="students-grid" :data-items="paginatedStudentsData.length">
          <div 
            v-for="student in paginatedStudentsData" 
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
              </div>
            </div>

            <!-- Progress Stats -->
            <div class="progress-stats">
              <div class="stat-row">
                <div class="stat-item weight-stat">
                  <div class="stat-icon-container">
                    <i class="fas stat-icon" :class="getWeightIconFA(student.weightProgress)"></i>
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
                    <i class="fas fa-dumbbell stat-icon"></i>
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
                  <i class="fas trend-icon" :class="[getTrendClass(student.trend), getTrendIconFA(student.trend)]"></i>
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
                    <i class="fas fa-clock activity-icon"></i>
                  </div>
                  <div class="activity-details">
                    <span class="activity-label">Última atividade</span>
                    <span class="activity-value">há {{ student.lastWorkout }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controles de Paginação -->
        <div v-if="totalPages > 1" class="pagination-controls">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1"
            class="pagination-btn pagination-prev"
          >
            <i class="fas fa-chevron-left"></i>
            Anterior
          </button>
          
          <div class="pagination-info">
            <span class="page-indicator">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            <span class="items-indicator">
              ({{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, studentsData.length) }} de {{ studentsData.length }} alunos)
            </span>
          </div>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="pagination-btn pagination-next"
          >
            Próximo
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Summary Stats -->
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
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="month-year">
                <h4 class="current-month">{{ getCurrentMonthName() }}</h4>
                <span class="current-year">{{ currentDate.getFullYear() }}</span>
              </div>
              <button @click="nextMonth" class="nav-btn">
                <i class="fas fa-chevron-right"></i>
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
import { getStudentsByInstructor, getInstructorSessions } from "@/api";
import api from "@/api";
import { API_URL } from '@/config';

export default {
  name: "DashboardTech",
  components: { 
    DashboardNavBar,
    apexchart: VueApexCharts 
  },
  async mounted() {
    await this.loadDashboardData();
    
    // Adicionar listener para fechar dropdown quando clicar fora
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    // Remover listener quando o componente for destruído
    document.removeEventListener('click', this.handleClickOutside);
  },
  data() {
    return {
      currentDate: new Date(),
      selectedPeriod: 'Últimos 6 meses',
      periodOptions: [
        { value: '1 semana', label: '1 semana' },
        { value: '1 mês', label: '1 mês' },
        { value: 'Últimos 6 meses', label: 'Últimos 6 meses' }
      ],
      showPeriodDropdown: false,
      weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      // Dados reais que serão carregados da API
      students: [],
      workoutSessions: [],
      loading: true,
      error: null,
      // Paginação para análise individual de alunos
      currentPage: 1,
      itemsPerPage: 3,
      progressData: [
        {
          name: "Média de Peso",
          type: 'area',
          data: [0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: "Treinos Concluídos",
          type: 'area',
          data: [0, 0, 0, 0, 0, 0, 0, 0]
        }
      ],
      weeklyData: [
        {
          name: "Sessões Realizadas",
          type: 'bar',
          data: [0, 0, 0, 0, 0, 0, 0]
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
      
      if (!this.students || !Array.isArray(this.students) || this.students.length === 0) {
        console.warn('⚠️ DEBUG: Nenhum estudante encontrado ou array inválido');
        return [];
      }
      
      if (!Array.isArray(this.workoutSessions)) {
        console.warn('⚠️ DEBUG: workoutSessions não é um array válido');
        
        return this.students.map((student) => {
          return {
            id: student._id,
            name: student.name || 'Nome não disponível',
            avatar: this.getAvatarUrl(student),
            weightProgress: 0,
            adherence: 0,
            trend: 'neutral',
            lastWorkout: 'Dados indisponíveis',
            totalSessions: 0,
            currentWeight: student.personalInfo?.currentWeight || 0,
            phone: student.phone || '',
            email: student.email || '',
            currentWorkoutPlan: student.currentWorkoutPlanId
          };
        });
      }
      
      return this.students.map((student) => {
        try {
          
          const studentSessions = this.workoutSessions.filter(session => {
            if (!session) {
              console.warn('⚠️ Sessão nula encontrada');
              return false;
            }
            
            const matches = session.studentId === student._id || 
                           (session.studentId && session.studentId._id === student._id);
            
            return matches;
          });
          
          const completedSessions = studentSessions.filter(session => 
            session && session.status === 'completed'
          );
          
          const progressLogs = student.progressLogs || [];
          const weightProgress = this.calculateWeightProgress(progressLogs);
          
          const adherence = this.calculateAdherence(studentSessions);
          
          const trend = this.calculateTrend(completedSessions);
          
          const lastWorkout = this.getLastWorkoutTime(studentSessions);
          
          const result = {
            id: student._id,
            name: student.name || 'Nome não disponível',
            avatar: this.getAvatarUrl(student),
            weightProgress,
            adherence,
            trend,
            lastWorkout,
            totalSessions: completedSessions.length,
            currentWeight: student.personalInfo?.currentWeight || 0,
            phone: student.phone || '',
            email: student.email || '',
            currentWorkoutPlan: student.currentWorkoutPlanId
          };
          
          return result;
          
        } catch (error) {
          console.error(`❌ ERRO ao processar dados do aluno ${student.name}:`, error);
          console.error('📋 Stack trace:', error.stack);
          console.error('👤 Dados do estudante que causou erro:', student);
          
          return {
            id: student._id,
            name: student.name || 'Nome não disponível',
            avatar: this.getAvatarUrl(student),
            weightProgress: 0,
            adherence: 0,
            trend: 'neutral',
            lastWorkout: 'Erro ao calcular',
            totalSessions: 0,
            currentWeight: 0,
            phone: '',
            email: '',
            currentWorkoutPlan: null
          };
        }
      });
    },

    // Dados paginados para a seção de análise individual
    paginatedStudentsData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.studentsData.slice(startIndex, endIndex);
    },

    // Total de páginas
    totalPages() {
      return Math.ceil(this.studentsData.length / this.itemsPerPage);
    },

    performanceMetrics() {
      // Verificar se há dados válidos para calcular métricas
      const hasStudents = this.students && this.students.length > 0;
      const hasSessions = this.workoutSessions && this.workoutSessions.length > 0;
      
      if (!hasStudents || !hasSessions) {
        return [
          { label: 'Alunos Ativos', value: hasStudents ? this.students.length.toString() : '0', percentage: hasStudents ? Math.min((this.students.length / 20) * 100, 100) : 0 },
          { label: 'Sessões Registradas', value: hasSessions ? this.workoutSessions.length.toString() : '0', percentage: hasSessions ? Math.min((this.workoutSessions.length / 100) * 100, 100) : 0 },
          { label: 'Sessões Concluídas', value: '0', percentage: 0 },
          { label: 'Taxa de Conclusão', value: '0%', percentage: 0 },
          { label: 'Média de Exercícios', value: '0', percentage: 0 },
          { label: 'Progressos Registrados', value: '0', percentage: 0 }
        ];
      }
      
      // Calcular métricas reais baseadas nos dados disponíveis
      const completedSessions = this.workoutSessions.filter(s => s.status === 'completed');
      const totalSessions = this.workoutSessions.length;
      const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0;
      
      // Calcular média de exercícios por sessão
      const avgExercisesPerSession = this.calculateAverageExercisesPerSession();
      
      // Calcular adesão média
      const averageAdherence = this.calculateOverallAdherence();
      
      return [
        { 
          label: 'Alunos Ativos', 
          value: this.students.length.toString(), 
          percentage: Math.min((this.students.length / 30) * 100, 100) 
        },
        { 
          label: 'Sessões Concluídas', 
          value: completedSessions.length.toString(), 
          percentage: Math.min((completedSessions.length / 200) * 100, 100) 
        },
        { 
          label: 'Taxa de Conclusão', 
          value: `${completionRate.toFixed(1)}%`, 
          percentage: completionRate 
        },
        { 
          label: 'Adesão Média', 
          value: `${averageAdherence.toFixed(0)}%`, 
          percentage: averageAdherence 
        },
        { 
          label: 'Exercícios/Sessão', 
          value: avgExercisesPerSession.toFixed(1), 
          percentage: Math.min((avgExercisesPerSession / 10) * 100, 100) 
        },
        { 
          label: 'Tempo Médio por Sessão', 
          value: this.calculateAverageSessionDuration(), 
          percentage: this.calculateDurationPercentage()
        }
      ];
    },

    instructorAlerts() {
      if (!this.studentsData || this.studentsData.length === 0) {
        return [
          { id: 'info_1', type: 'info', title: 'Sistema', message: 'carregando dados dos alunos...' }
        ];
      }
      
      const alerts = [];
      
      // Alerta para alunos inativos (sem treino há mais de 7 dias)
      const inactiveStudents = this.studentsData.filter(student => {
        if (student.lastWorkout === 'Nenhum treino registrado') return true;
        if (student.lastWorkout.includes('semana') || student.lastWorkout.includes('mês')) return true;
        if (student.lastWorkout.includes(' dias atrás')) {
          const days = parseInt(student.lastWorkout.match(/(\d+) dias/)?.[1] || '0');
          return days > 7;
        }
        return false;
      });
      
      if (inactiveStudents.length > 0) {
        alerts.push({
          id: 'inactive_students',
          type: 'warning',
          title: `${inactiveStudents.length} aluno${inactiveStudents.length > 1 ? 's' : ''} inativo${inactiveStudents.length > 1 ? 's' : ''} `,
          message: `${inactiveStudents.map(s => s.name.split(' ')[0]).slice(0, 3).join(', ')}${inactiveStudents.length > 3 ? ` e mais ${inactiveStudents.length - 3}` : ''} não treina${inactiveStudents.length === 1 ? '' : 'm'} há mais de 7 dias`
        });
      }
      
      // Alerta para baixa aderência (menos de 50%)
      const lowAdherenceStudents = this.studentsData.filter(student => 
        student.adherence > 0 && student.adherence < 50
      );
      
      if (lowAdherenceStudents.length > 0) {
        alerts.push({
          id: 'low_adherence',
          type: 'warning',
          title: 'Baixa aderência detectada',
          message: `${lowAdherenceStudents.length} aluno${lowAdherenceStudents.length > 1 ? 's' : ''} com aderência abaixo de 50%`
        });
      }
      
      // Alerta para tendência negativa
      const negativeProgressStudents = this.studentsData.filter(student => 
        student.trend === 'negative'
      );
      
      if (negativeProgressStudents.length > 0) {
        alerts.push({
          id: 'negative_progress',
          type: 'alert',
          title: 'Tendência de queda detectada',
          message: `${negativeProgressStudents.length} aluno${negativeProgressStudents.length > 1 ? 's' : ''} apresentando queda no desempenho`
        });
      }
      
      // Alerta positivo para alta performance
      const highPerformanceStudents = this.studentsData.filter(student => 
        student.adherence >= 80 && student.totalSessions >= 10
      );
      
      if (highPerformanceStudents.length > 0) {
        alerts.push({
          id: 'high_performance',
          type: 'success',
          title: 'Alunos de alta performance',
          message: `${highPerformanceStudents.length} aluno${highPerformanceStudents.length > 1 ? 's' : ''} com excelente aderência e consistência`
        });
      }
      
      // Alerta para sessões pendentes hoje
      const today = new Date().toDateString();
      const todaySessions = this.workoutSessions.filter(session => {
        if (!session.startTime) return false;
        const sessionDate = new Date(session.startTime);
        return sessionDate.toDateString() === today && session.status !== 'completed';
      });
      
      if (todaySessions.length > 0) {
        alerts.push({
          id: 'pending_sessions',
          type: 'info',
          title: 'Sessões pendentes hoje',
          message: `${todaySessions.length} sessão${todaySessions.length > 1 ? 'ões' : ''} agendada${todaySessions.length > 1 ? 's' : ''} para hoje`
        });
      }
      
      // Sugestão para orientação e acompanhamento
      const studentsNeedingAttention = this.studentsData.filter(student => 
        student.adherence < 70 && student.totalSessions > 3
      );
      
      if (studentsNeedingAttention.length > 0) {
        const studentName = studentsNeedingAttention[0].name.split(' ')[0];
        
        if (studentsNeedingAttention.length === 1) {
          alerts.push({
            id: 'needs_attention',
            type: 'info',
            title: `${studentName} está progredindo`,
          });
        } else {
          alerts.push({
            id: 'needs_attention',
            type: 'info',
            title: `${studentsNeedingAttention.length} alunos em desenvolvimento`,
            message: `${studentName} e mais ${studentsNeedingAttention.length - 1} podem se beneficiar de acompanhamento mais próximo`
          });
        }
      }
      
      // Se não houver alertas, mostrar mensagem positiva
      if (alerts.length === 0) {
        const totalSessions = this.workoutSessions.filter(s => s.status === 'completed').length;
        const avgAdherence = this.calculateOverallAdherence();
        
        alerts.push({
          id: 'all_good',
          type: 'success',
          title: 'Tudo funcionando bem!',
          message: `${totalSessions} sessões concluídas com aderência média de ${avgAdherence.toFixed(0)}%`
        });
      }
      
      return alerts.slice(0, 6); // Limitar a 6 alertas
    },

    // Verifica se há dados de progresso reais para exibir no gráfico
    hasProgressData() {
      // Verifica se há alunos e sessões
      if (!this.students || this.students.length === 0) {
        return false;
      }
      
      if (!this.workoutSessions || this.workoutSessions.length === 0) {
        return false;
      }
      
      // Verifica se há pelo menos uma sessão concluída
      const hasCompletedSessions = this.workoutSessions.some(s => s.status === 'completed');
      if (!hasCompletedSessions) {
        return false;
      }
      
      // Verifica se há registros de progresso
      const hasProgressLogs = this.students.some(s => 
        s.progressLogs && s.progressLogs.length > 0
      );
      
      // Retorna true se há sessões concluídas OU registros de progresso
      return hasCompletedSessions || hasProgressLogs;
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
      if (!this.workoutSessions || this.workoutSessions.length === 0) {
        return {
          totalSessions: 0,
          avgDuration: 0,
          completionRate: 0
        };
      }
      
      const completedSessions = this.workoutSessions.filter(s => s.status === 'completed');
      const totalSessions = completedSessions.length;
      const avgDuration = totalSessions > 0 ? 
        completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / totalSessions : 0;
      const completionRate = this.workoutSessions.length > 0 ? 
        (completedSessions.length / this.workoutSessions.length) * 100 : 0;
      
      return {
        totalSessions,
        avgDuration: Math.round(avgDuration),
        completionRate: Math.round(completionRate)
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
    // ========= HELPER PARA PROCESSAR AVATAR =========
    getAvatarUrl(student) {
      // Tenta pegar o avatar do userId primeiro, depois do próprio student
      const avatar = student.userId?.avatar || student.avatar;
      
      if (!avatar) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'User')}&background=6c5ce7&color=fff`;
      }
      
      // Se é base64, usar diretamente
      if (avatar.startsWith('data:image')) {
        return avatar;
      }
      
      // Se já é URL completa
      if (avatar.startsWith('http')) {
        return avatar;
      }
      
      // Se é path relativo, construir URL completa
      return `${API_URL}${avatar}`;
    },

    // ========= MÉTODOS DE PAGINAÇÃO =========
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    // ========= MÉTODOS DE CARREGAMENTO DE DADOS =========
    async loadDashboardData() {
      try {
        this.loading = true;
        this.error = null;
        
        // Pegar o ID do usuário logado
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        
        const userId = user.id;
        if (!userId) {
          throw new Error('ID do usuário não encontrado. Faça login novamente.');
        }
        
        // Buscar o instrutor pelo userId
        const instructorsResponse = await api.get('/instructors');
        const allInstructors = instructorsResponse.data;
        const currentInstructor = allInstructors.find(
          inst => inst.userId === userId || inst.userId?._id === userId
        );
        
        if (!currentInstructor) {
          throw new Error('Instrutor não encontrado para este usuário. Verifique se você está logado como instrutor.');
        }
        
        const instructorId = currentInstructor._id;
        
        // Buscar estudantes do instrutor
        await this.loadStudents(instructorId);
        
        // Buscar sessões de treino
        try {
          await this.loadWorkoutSessions(instructorId);
        } catch (sessionError) {
          console.error('[DEBUG] Erro específico em loadWorkoutSessions:', sessionError);
          console.error('[DEBUG] Stack do erro:', sessionError.stack);
        }
        
        // Gerar dados dos gráficos
        this.generateChartData();
        
        // Validar e processar dados para garantir consistência
        this.validateAndProcessData();
        
      } catch (error) {
        console.error('[DEBUG] Erro ao carregar dados do dashboard:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    validateAndProcessData() {
      // Validar se os dados carregados estão consistentes
      console.log('📊 Validando dados carregados:');
      console.log(`   Estudantes: ${this.students.length}`);
      console.log(`   Sessões: ${this.workoutSessions.length}`);
      console.log(`   Sessões concluídas: ${this.workoutSessions.filter(s => s.status === 'completed').length}`);
      
      // Verificar se há dados de progresso
      const studentsWithProgress = this.students.filter(s => s.progressLogs && s.progressLogs.length > 0);
      console.log(`   Estudantes com progresso: ${studentsWithProgress.length}`);
      
      // Verificar sessões com exercícios
      const sessionsWithExercises = this.workoutSessions.filter(s => s.exercises && s.exercises.length > 0);
      console.log(`   Sessões com exercícios: ${sessionsWithExercises.length}`);
      
      // Log das métricas calculadas
      if (this.performanceMetrics && this.performanceMetrics.length > 0) {
        console.log('📈 Métricas calculadas:');
        this.performanceMetrics.forEach(metric => {
          console.log(`   ${metric.label}: ${metric.value} (${metric.percentage.toFixed(1)}%)`);
        });
      }
      
      // Forçar recompute das computed properties se necessário
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    
    async loadStudents(instructorId) {
      try {
        const response = await getStudentsByInstructor(instructorId);
        
        if (response && response.data) {
          this.students = Array.isArray(response.data) ? response.data : [];
          
          this.students.forEach((student, index) => {
            console.log(`� DEBUG: Estudante ${index + 1}:`, {
              id: student._id,
              name: student.name,
              email: student.email,
              instructorId: student.instructorId,
              personalInfo: student.personalInfo ? 'Presente' : 'Ausente',
              progressLogs: student.progressLogs?.length || 0,
              workoutPlans: student.workoutPlans?.length || 0
            });
          });
        } else {
          console.warn('⚠️ DEBUG: Resposta da API não contém dados válidos');
          this.students = [];
        }
      } catch (error) {
        console.error('❌ DEBUG: Erro detalhado ao buscar estudantes:');
        console.error('🔥 Error object:', error);
        console.error('📊 Error message:', error.message);
        console.error('📈 Error stack:', error.stack);
        console.error('🌐 Response status:', error.response?.status);
        console.error('� Response data:', error.response?.data);
        console.error('🔗 Request config:', error.config);
        this.students = [];
      }
    },
    
    async loadWorkoutSessions(instructorId) {
      try {
        if (!instructorId) {
          console.warn('⚠️ ID do instrutor não fornecido');
          this.workoutSessions = [];
          return;
        }
        
        const response = await getInstructorSessions(instructorId);
        
        if (response && response.data) {
          if (response.data.sessions) {
            this.workoutSessions = Array.isArray(response.data.sessions) ? response.data.sessions : [];
          } else if (Array.isArray(response.data)) {
            this.workoutSessions = response.data;
          } else {
            console.warn('⚠️ Resposta da API não contém sessões válidas');
            this.workoutSessions = [];
          }
          
          if (this.workoutSessions.length > 0) {
            console.log('📝 Primeira sessão:', this.workoutSessions[0]);
            console.log('📝 Tipos de sessões encontradas:', this.workoutSessions.map(s => ({
              id: s._id,
              studentId: s.studentId,
              status: s.status,
              studentName: s.studentId?.userId?.name || s.studentId?.name
            })));
          }
        } else {
          console.warn('⚠️ Resposta da API está vazia ou inválida');
          this.workoutSessions = [];
        }
        
      } catch (error) {
        console.error('❌ Erro ao buscar sessões:', error);
        console.error('📊 Status:', error.response?.status);
        console.error('📄 Data:', error.response?.data);
        console.error('📄 Message:', error.message);
        console.error('📄 Stack:', error.stack);
        this.workoutSessions = [];
      }
    },
    
    changePeriod(newPeriod) {
      this.selectedPeriod = newPeriod;
      this.showPeriodDropdown = false;
      this.generateProgressData();
    },
    
    handleClickOutside(event) {
      // Fechar dropdown do período se clicar fora dele
      if (!event.target.closest('.dropdown-container')) {
        this.showPeriodDropdown = false;
      }
    },
    
    generateChartData() {
      // Gerar dados para o gráfico de progresso
      this.generateProgressData();
      
      // Gerar dados para o gráfico semanal
      this.generateWeeklyData();
    },
    
    generateProgressData() {
      // Verificar se há dados reais antes de gerar o gráfico
      if (!this.hasProgressData) {
        // Não gerar dados falsos - deixar vazio
        this.progressData = [
          {
            name: "Média de Peso",
            type: 'area',
            data: []
          },
          {
            name: "Treinos Concluídos",
            type: 'area',
            data: []
          }
        ];
        return;
      }
      
      // Gerar dados para o gráfico de progresso baseados em dados reais
      const periods = this.getPeriodData();
      const weightData = [];
      const completedData = [];
      
      periods.forEach(period => {
        // Calcular peso médio dos alunos neste período
        const periodWeight = this.calculatePeriodAverageWeight(period.date);
        weightData.push(periodWeight || 0);
        
        // Calcular treinos completados neste período
        const periodCompleted = this.calculatePeriodCompletedWorkouts(period.date, period.isWeek);
        completedData.push(periodCompleted);
      });
      
      this.progressData = [
        {
          name: "Média de Peso",
          type: 'area',
          data: weightData
        },
        {
          name: "Treinos Concluídos",
          type: 'area',
          data: completedData
        }
      ];
      
      // Atualizar as categorias do gráfico
      if (this.$refs.progressChart) {
        this.$refs.progressChart.updateOptions({
          xaxis: {
            categories: periods.map(p => p.label)
          }
        });
      }
    },
    
    getPeriodData() {
      const periods = [];
      
      if (this.selectedPeriod === '1 semana') {
        // Últimos 7 dias
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          periods.push({
            date: date,
            label: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
            isWeek: true
          });
        }
      } else if (this.selectedPeriod === '1 mês') {
        // Últimas 4 semanas
        for (let i = 3; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - (i * 7));
          periods.push({
            date: date,
            label: `Sem ${4 - i}`,
            isWeek: true
          });
        }
      } else {
        // Últimos 6 meses (padrão)
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          periods.push({
            date: date,
            label: date.toLocaleDateString('pt-BR', { month: 'short' }),
            isWeek: false
          });
        }
      }
      
      return periods;
    },
    
    calculatePeriodAverageWeight(periodDate) {
      const weights = [];
      
      this.students.forEach(student => {
        const progressLogs = student.progressLogs || [];
        
        // Filtrar logs do período específico
        const periodLogs = progressLogs.filter(log => {
          if (!log.date) return false;
          const logDate = new Date(log.date);
          
          if (this.selectedPeriod === '1 semana') {
            return logDate.toDateString() === periodDate.toDateString();
          } else if (this.selectedPeriod === '1 mês') {
            const weekStart = new Date(periodDate);
            const weekEnd = new Date(periodDate);
            weekEnd.setDate(weekEnd.getDate() + 7);
            return logDate >= weekStart && logDate < weekEnd;
          } else {
            return logDate.getMonth() === periodDate.getMonth() && 
                   logDate.getFullYear() === periodDate.getFullYear();
          }
        });
        
        if (periodLogs.length > 0) {
          const avgWeight = periodLogs.reduce((sum, log) => sum + (log.weight || 0), 0) / periodLogs.length;
          weights.push(avgWeight);
        } else {
          // Se não há logs específicos do período, usar peso atual ou inicial
          const currentWeight = student.personalInfo?.currentWeight;
          const initialWeight = student.personalInfo?.initialWeight;
          
          if (currentWeight) {
            weights.push(currentWeight);
          } else if (initialWeight) {
            weights.push(initialWeight);
          }
        }
      });
      
      if (weights.length === 0) {
        return 70; // Peso médio padrão
      }
      
      return Math.round(weights.reduce((sum, w) => sum + w, 0) / weights.length);
    },
    
    calculatePeriodCompletedWorkouts(periodDate, isWeekly = false) {
      return this.workoutSessions.filter(session => {
        if (!session.startTime || session.status !== 'completed') return false;
        
        const sessionDate = new Date(session.startTime);
        
        if (this.selectedPeriod === '1 semana') {
          return sessionDate.toDateString() === periodDate.toDateString();
        } else if (this.selectedPeriod === '1 mês' && isWeekly) {
          const weekStart = new Date(periodDate);
          const weekEnd = new Date(periodDate);
          weekEnd.setDate(weekEnd.getDate() + 7);
          return sessionDate >= weekStart && sessionDate < weekEnd;
        } else {
          return sessionDate.getMonth() === periodDate.getMonth() && 
                 sessionDate.getFullYear() === periodDate.getFullYear();
        }
      }).length;
    },
    
    generateWeeklyData() {
      // Gerar dados para os últimos 7 dias
      const weekData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const dayWorkouts = this.workoutSessions.filter(session => {
          if (!session.startTime) return false;
          const sessionDate = new Date(session.startTime);
          return sessionDate.toDateString() === date.toDateString() && 
                 session.status === 'completed';
        }).length;
        
        weekData.push(dayWorkouts);
      }
      
      // Se não há dados reais, gerar uma distribuição baseada no total de sessões
      if (weekData.every(val => val === 0) && this.workoutSessions.length > 0) {
        const totalSessions = this.workoutSessions.filter(s => s.status === 'completed').length;
        const avgPerDay = Math.ceil(totalSessions / 30); // Distribuir por 30 dias
        
        // Simular uma distribuição mais realista (mais treinos na semana, menos no fim de semana)
        const weekPattern = [0.7, 1.2, 1.3, 1.1, 1.2, 0.8, 0.5]; // Dom, Seg, Ter, Qua, Qui, Sex, Sab
        
        for (let i = 0; i < 7; i++) {
          weekData[i] = Math.max(0, Math.round(avgPerDay * weekPattern[i]));
        }
      }
      
      this.weeklyData = [
        {
          name: "Sessões Realizadas",
          type: 'bar',
          data: weekData
        }
      ];
    },
    
    // ========= MÉTODOS DE CÁLCULO DE MÉTRICAS =========
    calculateWeightProgress(progressLogs) {
      if (!progressLogs || progressLogs.length < 2) return 0;
      
      const sortedLogs = progressLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      const latest = sortedLogs[0];
      const previous = sortedLogs[1];
      
      if (latest.weight && previous.weight) {
        return latest.weight - previous.weight;
      }
      
      return 0;
    },
    
    calculateAdherence(studentSessions) {
      // Validar se é um array
      if (!Array.isArray(studentSessions) || studentSessions.length === 0) {
        return 0;
      }
      
      try {
        // Considerar últimos 30 dias ou todas as sessões se menor período
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        
        const recentSessions = studentSessions.filter(session => {
          if (!session || !session.startTime) return false;
          const sessionDate = new Date(session.startTime);
          return sessionDate >= last30Days;
        });
        
        // Se não há sessões recentes, considerar todas as sessões
        const sessionsToAnalyze = recentSessions.length > 0 ? recentSessions : studentSessions;
        
        if (sessionsToAnalyze.length === 0) return 0;
        
        const completedSessions = sessionsToAnalyze.filter(session => 
          session && session.status === 'completed'
        );
        
        const adherenceRate = (completedSessions.length / sessionsToAnalyze.length) * 100;
        
        // Aplicar fator de qualidade baseado na quantidade de exercícios completados
        let qualityFactor = 1;
        if (completedSessions.length > 0) {
          const avgExercisesCompleted = completedSessions.reduce((total, session) => {
            if (!session.exercises) return total;
            const completedExercises = session.exercises.filter(ex => 
              ex.sets && ex.sets.some(set => set.completed)
            ).length;
            return total + completedExercises;
          }, 0) / completedSessions.length;
          
          // Ajustar qualidade baseado na média de exercícios completados
          if (avgExercisesCompleted >= 6) qualityFactor = 1;
          else if (avgExercisesCompleted >= 4) qualityFactor = 0.9;
          else if (avgExercisesCompleted >= 2) qualityFactor = 0.8;
          else qualityFactor = 0.6;
        }
        
        return Math.min(Math.round(adherenceRate * qualityFactor), 100);
      } catch (error) {
        console.error('Erro ao calcular aderência:', error);
        return 0;
      }
    },
    
    calculateTrend(completedSessions) {
      // Validar se é um array
      if (!Array.isArray(completedSessions) || completedSessions.length < 3) {
        return 'neutral';
      }
      
      try {
        // Pegar as últimas 3 sessões e verificar tendência
        const lastThree = completedSessions
          .filter(session => session && session.startTime && session.totalVolume !== undefined)
          .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
          .slice(0, 3);
        
        if (lastThree.length < 3) return 'neutral';
        
        const volumes = lastThree.map(session => session.totalVolume || 0);
        
        if (volumes[0] > volumes[1] && volumes[1] > volumes[2]) return 'positive';
        if (volumes[0] < volumes[1] && volumes[1] < volumes[2]) return 'negative';
        return 'stable';
      } catch (error) {
        console.error('Erro ao calcular tendência:', error);
        return 'neutral';
      }
    },
    
    
    
    calculateAverageSessionDuration() {
      const completedSessions = this.workoutSessions.filter(s => 
        s.status === 'completed' && s.duration
      );
      
      if (completedSessions.length === 0) return '0min';
      
      const totalDuration = completedSessions.reduce((total, session) => {
        return total + (session.duration || 0);
      }, 0);
      
      const avgDuration = totalDuration / completedSessions.length;
      
      if (avgDuration >= 60) {
        const hours = Math.floor(avgDuration / 60);
        const minutes = Math.round(avgDuration % 60);
        return `${hours}h ${minutes}min`;
      }
      
      return `${Math.round(avgDuration)}min`;
    },
    
    calculateDurationPercentage() {
      const completedSessions = this.workoutSessions.filter(s => 
        s.status === 'completed' && s.duration
      );
      
      if (completedSessions.length === 0) return 0;
      
      const totalDuration = completedSessions.reduce((total, session) => {
        return total + (session.duration || 0);
      }, 0);
      
      const avgDuration = totalDuration / completedSessions.length;
      
      // Meta: 60 minutos = 100%
      return Math.min((avgDuration / 60) * 100, 100);
    },
    
    calculateAverageExercisesPerSession() {
      const validSessions = this.workoutSessions.filter(session => 
        session.exercises && session.exercises.length > 0
      );
      
      if (validSessions.length === 0) return 0;
      
      const totalExercises = validSessions.reduce((total, session) => {
        return total + session.exercises.length;
      }, 0);
      
      return totalExercises / validSessions.length;
    },
    
    calculateTotalWeightLoss() {
      let totalLoss = 0;
      let studentsWithData = 0;
      
      this.students.forEach(student => {
        const progressLogs = student.progressLogs || [];
        
        if (progressLogs.length >= 2) {
          // Ordenar por data para pegar inicial e mais recente
          const sortedLogs = progressLogs
            .filter(log => log.weight && log.date) // Filtrar logs válidos
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          
          if (sortedLogs.length >= 2) {
            const initial = sortedLogs[0].weight;
            const current = sortedLogs[sortedLogs.length - 1].weight;
            
            if (initial && current && initial > current) {
              const loss = initial - current;
              totalLoss += loss;
              studentsWithData++;
            }
          }
        } else {
          // Se não há progressLogs, tentar usar personalInfo
          const initialWeight = student.personalInfo?.initialWeight;
          const currentWeight = student.personalInfo?.currentWeight;
          
          if (initialWeight && currentWeight && initialWeight > currentWeight) {
            const loss = initialWeight - currentWeight;
            totalLoss += loss;
            studentsWithData++;
          }
        }
      });
      
      // Se não há dados de perda de peso, retornar 0
      if (studentsWithData === 0) {
        return 0;
      }
      
      return Math.max(0, totalLoss); // Garantir que não seja negativo
    },
    
    calculateAverageLoadIncrease() {
      // Calcular aumento médio de carga baseado nas sessões REAIS
      const increases = [];
      
      this.students.forEach(student => {
        const studentSessions = this.workoutSessions.filter(session => 
          session.studentId === student._id && session.status === 'completed'
        );
        
        if (studentSessions.length >= 2) {
          const sorted = studentSessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
          
          // Pegar sessões com pelo menos 30 dias de diferença para medir progressão
          for (let i = 0; i < sorted.length - 1; i++) {
            const first = sorted[i];
            const last = sorted[sorted.length - 1];
            
            const daysDiff = (new Date(last.startTime) - new Date(first.startTime)) / (1000 * 60 * 60 * 24);
            
            if (daysDiff >= 30 && first.totalVolume && last.totalVolume && first.totalVolume > 0) {
              const increase = ((last.totalVolume - first.totalVolume) / first.totalVolume) * 100;
              increases.push(increase);
              break; // Usar apenas a primeira comparação válida
            }
          }
        }
      });
      
      return increases.length > 0 ? 
        increases.reduce((sum, inc) => sum + inc, 0) / increases.length : 0;
    },
    
    calculateWeightProgression() {
      // Calcular progressão de peso baseada nos dados REAIS dos exercícios
      const progressions = [];
      
      this.students.forEach(student => {
        const studentSessions = this.workoutSessions.filter(session => 
          session.studentId === student._id && 
          session.status === 'completed' &&
          session.exercises && 
          session.exercises.length > 0
        );
        
        if (studentSessions.length >= 2) {
          // Agrupar por exercício
          const exerciseProgressions = {};
          
          studentSessions.forEach(session => {
            session.exercises.forEach(exercise => {
              const exerciseName = exercise.exerciseName;
              
              if (!exerciseProgressions[exerciseName]) {
                exerciseProgressions[exerciseName] = [];
              }
              
              // Pegar peso máximo da sessão para este exercício
              let maxWeight = 0;
              exercise.sets.forEach(set => {
                if (set.completed && set.weight) {
                  const actualWeight = set.isBodyWeight ? session.studentWeight : set.weight;
                  maxWeight = Math.max(maxWeight, actualWeight);
                }
              });
              
              if (maxWeight > 0) {
                exerciseProgressions[exerciseName].push({
                  date: new Date(session.startTime),
                  weight: maxWeight,
                  isBodyWeight: exercise.sets.some(s => s.isBodyWeight)
                });
              }
            });
          });
          
          // Calcular progressão para cada exercício
          Object.keys(exerciseProgressions).forEach(exerciseName => {
            const records = exerciseProgressions[exerciseName]
              .sort((a, b) => a.date - b.date);
            
            if (records.length >= 2) {
              const first = records[0];
              const last = records[records.length - 1];
              const daysDiff = (last.date - first.date) / (1000 * 60 * 60 * 24);
              
              // Só considerar se há pelo menos 14 dias de diferença
              if (daysDiff >= 14 && first.weight > 0) {
                const progression = ((last.weight - first.weight) / first.weight) * 100;
                progressions.push({
                  student: student.name,
                  exercise: exerciseName,
                  progression: progression,
                  from: first.weight,
                  to: last.weight,
                  isBodyWeight: first.isBodyWeight
                });
              }
            }
          });
        }
      });
      
      return progressions;
    },
    
    calculateOverallAdherence() {
      if (this.students.length === 0) return 0;
      
      const validAdherences = this.studentsData
        .map(student => student.adherence)
        .filter(adherence => adherence > 0); // Filtrar apenas valores válidos
      
      if (validAdherences.length === 0) {
        // Se não há dados de aderência, calcular baseado na proporção de sessões concluídas
        const totalSessions = this.workoutSessions.length;
        const completedSessions = this.workoutSessions.filter(s => s.status === 'completed').length;
        
        return totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
      }
      
      return validAdherences.reduce((sum, adh) => sum + adh, 0) / validAdherences.length;
    },
    
    calculateWorkoutEfficiency() {
      // Calcular eficiência baseada em actualReps vs plannedReps e tempo de descanso
      const completedSessions = this.workoutSessions.filter(s => s.status === 'completed');
      
      if (completedSessions.length === 0) return 0;
      
      let totalEfficiency = 0;
      let validSessions = 0;
      
      completedSessions.forEach(session => {
        if (session.exercises && session.exercises.length > 0) {
          let sessionEfficiency = 0;
          let validExercises = 0;
          
          session.exercises.forEach(exercise => {
            if (exercise.sets && exercise.sets.length > 0) {
              exercise.sets.forEach(set => {
                if (set.actualReps && set.plannedReps && set.plannedReps > 0) {
                  // Calcular eficiência de repetições (actualReps / plannedReps)
                  const repsEfficiency = Math.min((set.actualReps / set.plannedReps), 1.5); // Cap em 150%
                  
                  // Ajustar pela dificuldade (difficulty 1-5, onde 3 é ideal)
                  let difficultyFactor = 1;
                  if (set.difficulty) {
                    if (set.difficulty === 3) difficultyFactor = 1; // Dificuldade ideal
                    else if (set.difficulty < 3) difficultyFactor = 0.8; // Muito fácil
                    else if (set.difficulty > 3) difficultyFactor = 1.1; // Mais desafiador
                  }
                  
                  // Considerar tempo de descanso se disponível
                  let restFactor = 1;
                  if (set.restTimeTaken && set.plannedRestTime) {
                    const restRatio = set.restTimeTaken / set.plannedRestTime;
                    if (restRatio <= 1.2) restFactor = 1; // Dentro do esperado
                    else restFactor = 0.9; // Descanso excessivo
                  }
                  
                  sessionEfficiency += (repsEfficiency * difficultyFactor * restFactor);
                  validExercises++;
                }
              });
            }
          });
          
          if (validExercises > 0) {
            totalEfficiency += (sessionEfficiency / validExercises) * 100;
            validSessions++;
          }
        }
      });
      
      return validSessions > 0 ? totalEfficiency / validSessions : 0;
    },
    
    calculateAveragePerformance() {
      // Calcular desempenho médio baseado na dificuldade dos exercícios
      const completedSessions = this.workoutSessions.filter(s => s.status === 'completed');
      
      if (completedSessions.length === 0) return 0;
      
      let totalDifficulty = 0;
      let totalSets = 0;
      
      completedSessions.forEach(session => {
        if (session.exercises && session.exercises.length > 0) {
          session.exercises.forEach(exercise => {
            if (exercise.sets && exercise.sets.length > 0) {
              exercise.sets.forEach(set => {
                if (set.difficulty && set.difficulty >= 1 && set.difficulty <= 5) {
                  totalDifficulty += set.difficulty;
                  totalSets++;
                }
              });
            }
          });
        }
      });
      
      return totalSets > 0 ? totalDifficulty / totalSets : 0;
    },
    
    calculateBodyweightExerciseRatio() {
      // Calcular proporção de exercícios com peso corporal vs peso externo
      const completedSessions = this.workoutSessions.filter(s => s.status === 'completed');
      
      if (completedSessions.length === 0) return 0;
      
      let bodyweightVolume = 0;
      let externalWeightVolume = 0;
      
      completedSessions.forEach(session => {
        if (session.exercises && session.exercises.length > 0) {
          session.exercises.forEach(exercise => {
            if (exercise.sets && exercise.sets.length > 0) {
              exercise.sets.forEach(set => {
                if (set.actualReps && set.weight) {
                  const setVolume = set.actualReps * set.weight;
                  
                  if (set.isBodyWeight) {
                    // Para exercícios de peso corporal, usar o peso do aluno
                    const studentWeight = session.studentWeight || 70; // Peso padrão se não disponível
                    bodyweightVolume += set.actualReps * studentWeight;
                  } else {
                    // Exercícios com peso externo
                    externalWeightVolume += setVolume;
                  }
                }
              });
            }
          });
        }
      });
      
      const totalVolume = bodyweightVolume + externalWeightVolume;
      return totalVolume > 0 ? (bodyweightVolume / totalVolume) * 100 : 0;
    },
    
    calculateEnhancedVolumeProgression() {
      // Calcular progressão de volume separando peso corporal de peso externo
      const progressions = [];
      
      this.students.forEach(student => {
        const studentSessions = this.workoutSessions.filter(session => 
          session.studentId === student._id && session.status === 'completed'
        );
        
        if (studentSessions.length >= 2) {
          const sorted = studentSessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
          
          for (let i = 0; i < sorted.length - 1; i++) {
            const first = sorted[i];
            const last = sorted[sorted.length - 1];
            
            const daysDiff = (new Date(last.startTime) - new Date(first.startTime)) / (1000 * 60 * 60 * 24);
            
            if (daysDiff >= 30) {
              // Calcular volume separado por tipo
              const firstVolumes = this.calculateSessionVolumeBreakdown(first);
              const lastVolumes = this.calculateSessionVolumeBreakdown(last);
              
              if (firstVolumes.total > 0 && lastVolumes.total > 0) {
                progressions.push({
                  studentId: student._id,
                  studentName: student.name,
                  daysDifference: Math.round(daysDiff),
                  totalVolumeProgress: ((lastVolumes.total - firstVolumes.total) / firstVolumes.total) * 100,
                  bodyweightVolumeProgress: firstVolumes.bodyweight > 0 ? 
                    ((lastVolumes.bodyweight - firstVolumes.bodyweight) / firstVolumes.bodyweight) * 100 : 0,
                  externalWeightVolumeProgress: firstVolumes.external > 0 ? 
                    ((lastVolumes.external - firstVolumes.external) / firstVolumes.external) * 100 : 0
                });
              }
              break;
            }
          }
        }
      });
      
      return progressions;
    },
    
    calculateSessionVolumeBreakdown(session) {
      // Calcular breakdown de volume da sessão por tipo de peso
      let bodyweightVolume = 0;
      let externalWeightVolume = 0;
      
      if (session.exercises && session.exercises.length > 0) {
        session.exercises.forEach(exercise => {
          if (exercise.sets && exercise.sets.length > 0) {
            exercise.sets.forEach(set => {
              if (set.actualReps && set.weight) {
                if (set.isBodyWeight) {
                  const studentWeight = session.studentWeight || 70;
                  bodyweightVolume += set.actualReps * studentWeight;
                } else {
                  externalWeightVolume += set.actualReps * set.weight;
                }
              }
            });
          }
        });
      }
      
      return {
        bodyweight: bodyweightVolume,
        external: externalWeightVolume,
        total: bodyweightVolume + externalWeightVolume
      };
    },
    
    calculateMonthlyAverageWeight(month) {
      const weights = [];
      
      this.students.forEach(student => {
        const progressLogs = student.progressLogs || [];
        
        // Filtrar logs do mês específico
        const monthLogs = progressLogs.filter(log => {
          if (!log.date) return false;
          const logDate = new Date(log.date);
          return logDate.getMonth() === month.getMonth() && 
                 logDate.getFullYear() === month.getFullYear();
        });
        
        if (monthLogs.length > 0) {
          const avgWeight = monthLogs.reduce((sum, log) => sum + (log.weight || 0), 0) / monthLogs.length;
          weights.push(avgWeight);
        } else {
          // Se não há logs específicos do mês, usar peso atual ou inicial
          const currentWeight = student.personalInfo?.currentWeight;
          const initialWeight = student.personalInfo?.initialWeight;
          
          if (currentWeight) {
            weights.push(currentWeight);
          } else if (initialWeight) {
            weights.push(initialWeight);
          }
        }
      });
      
      if (weights.length === 0) {
        // Se não há dados de peso, retornar peso médio padrão
        return 70;
      }
      
      return Math.round(weights.reduce((sum, w) => sum + w, 0) / weights.length);
    },
    
    calculateMonthlyCompletedWorkouts(month) {
      return this.workoutSessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate.getMonth() === month.getMonth() && 
               sessionDate.getFullYear() === month.getFullYear() &&
               session.status === 'completed';
      }).length;
    },
    
    // ========= MÉTODOS AUXILIARES =========
    generateEventsForDay(day) {
      // Usar dados REAIS das sessões ao invés de dados mockados
      const events = [];
      
      // Filtrar sessões do dia específico
      const sessionsOnDay = this.workoutSessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate.getDate() === day &&
               sessionDate.getMonth() === this.currentDate.getMonth() &&
               sessionDate.getFullYear() === this.currentDate.getFullYear();
      });
      
      sessionsOnDay.forEach((session, index) => {
        // Determinar tipo baseado nos dados da sessão
        let eventType = 'personal'; // padrão
        
        // Se a sessão tem muitos exercícios, pode ser treino em grupo
        if (session.exercises && session.exercises.length > 6) {
          eventType = 'group';
        }
        
        // Se é primeira sessão do aluno ou tem poucas séries, pode ser avaliação
        const studentSessions = this.workoutSessions.filter(s => s.studentId === session.studentId);
        if (studentSessions.length <= 2) {
          eventType = 'assessment';
        }
        
        events.push({
          id: `${session._id}-${index}`,
          type: eventType,
          sessionId: session._id,
          studentName: this.getStudentName(session.studentId),
          workoutName: session.workoutName,
          status: session.status,
          duration: session.duration
        });
      });
      
      return events;
    },
    
    getStudentName(studentId) {
      const student = this.students.find(s => s._id === studentId);
      return student ? student.name : 'Aluno';
    },
    
    calculateSessionAverageDifficulty(session) {
      // Calcular dificuldade média da sessão baseada nos sets
      if (!session.exercises || session.exercises.length === 0) return 0;
      
      let totalDifficulty = 0;
      let totalSets = 0;
      
      session.exercises.forEach(exercise => {
        if (exercise.sets && exercise.sets.length > 0) {
          exercise.sets.forEach(set => {
            if (set.difficulty && set.difficulty >= 1 && set.difficulty <= 5) {
              totalDifficulty += set.difficulty;
              totalSets++;
            }
          });
        }
      });
      
      return totalSets > 0 ? totalDifficulty / totalSets : 0;
    },
    
    calculateSessionConsistency(session) {
      // Calcular consistência da sessão baseada em actualReps vs plannedReps
      if (!session.exercises || session.exercises.length === 0) return 0;
      
      let totalConsistency = 0;
      let totalSets = 0;
      
      session.exercises.forEach(exercise => {
        if (exercise.sets && exercise.sets.length > 0) {
          exercise.sets.forEach(set => {
            if (set.actualReps && set.plannedReps && set.plannedReps > 0) {
              const consistency = Math.min((set.actualReps / set.plannedReps) * 100, 120); // Cap em 120%
              totalConsistency += consistency;
              totalSets++;
            }
          });
        }
      });
      
      return totalSets > 0 ? totalConsistency / totalSets : 0;
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

    // Novos métodos Font Awesome
    getWeightIconFA(weight) {
      return weight < 0 ? 'fa-arrow-down' : weight > 0 ? 'fa-arrow-up' : 'fa-minus';
    },

    getTrendIconFA(trend) {
      const icons = {
        'positive': 'fa-arrow-trend-up',
        'stable': 'fa-arrow-right',
        'negative': 'fa-arrow-trend-down'
      };
      return icons[trend] || 'fa-minus';
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

    getLastWorkoutTime(studentSessions) {
      // Validar se é um array
      if (!Array.isArray(studentSessions) || studentSessions.length === 0) {
        return 'Nenhum treino registrado';
      }
      
      try {
        // Buscar a sessão mais recente (independente do status)
        const allSessions = studentSessions.filter(session => 
          session && session.startTime
        );
        
        if (allSessions.length === 0) return 'Nenhum treino registrado';
        
        const lastSession = allSessions.sort((a, b) => {
          const dateA = new Date(a.startTime);
          const dateB = new Date(b.startTime);
          return dateB - dateA;
        })[0];
        
        if (!lastSession || !lastSession.startTime) return 'Data não disponível';
        
        const lastDate = new Date(lastSession.startTime);
        const now = new Date();
        
        // Verificar se a data é válida
        if (isNaN(lastDate.getTime())) return 'Data inválida';
        
        const diffTime = now - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        
        // Incluir status da sessão na resposta
        const statusText = lastSession.status === 'completed' ? '' : ' (incompleto)';
        
        if (diffDays < 0) return 'Data futura'; // Proteção contra datas futuras
        if (diffHours < 1) return `agora${statusText}`;
        if (diffHours < 24) return `${diffHours}h atrás${statusText}`;
        if (diffDays === 1) return `ontem${statusText}`;
        if (diffDays < 7) return `${diffDays} dias atrás${statusText}`;
        if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7);
          return `${weeks} semana${weeks > 1 ? 's' : ''} atrás${statusText}`;
        }
        if (diffDays < 365) {
          const months = Math.floor(diffDays / 30);
          return `${months} mês${months > 1 ? 'es' : ''} atrás${statusText}`;
        }
        
        const years = Math.floor(diffDays / 365);
        return `${years} ano${years > 1 ? 's' : ''} atrás${statusText}`;
        
      } catch (error) {
        console.error('Erro ao calcular último treino:', error);
        return 'Erro ao calcular';
      }
    },

    calculateAverageProgress() {
      if (this.studentsData.length === 0) return 0;
      const total = this.studentsData.reduce((sum, student) => sum + Math.abs(student.weightProgress), 0);
      return Math.round((total / this.studentsData.length) * 10);
    },

    calculateAverageAdherence() {
      if (this.studentsData.length === 0) return 0;
      const total = this.studentsData.reduce((sum, student) => sum + student.adherence, 0);
      return Math.round(total / this.studentsData.length);
    },

    getPositiveTrends() {
      return this.studentsData.filter(student => student.trend === 'positive').length;
    },

    // ========= MÉTODOS PARA LEGENDA APRIMORADA (100% DADOS REAIS) =========
    
    // Total de alunos ativos (que tem pelo menos 1 treino)
    getTotalActiveStudents() {
      if (!this.students || this.students.length === 0) {
        return 0;
      }
      return this.students.length;
    },

    // Trend de alunos ativos
    getActiveStudentsTrendIcon() {
      const total = this.getTotalActiveStudents();
      if (total === 0) return 'fa-minus';
      if (total >= 10) return 'fa-arrow-up';
      if (total >= 5) return 'fa-check';
      return 'fa-arrow-down';
    },

    getActiveStudentsTrendText() {
      const total = this.getTotalActiveStudents();
      if (total === 0) return 'Nenhum aluno cadastrado';
      if (total >= 10) return 'Base de alunos crescendo';
      if (total >= 5) return 'Boa quantidade de alunos';
      return 'Expandindo base de alunos';
    },

    getActiveStudentsTrendClass() {
      const total = this.getTotalActiveStudents();
      if (total >= 10) return 'success';
      if (total >= 5) return '';
      return 'warning';
    },

    // Total de treinos completados (DADOS REAIS do banco)
    getTotalCompletedWorkouts() {
      if (!this.workoutSessions || this.workoutSessions.length === 0) {
        return 0;
      }
      const completedSessions = this.workoutSessions.filter(s => s.status === 'completed');
      return completedSessions.length;
    },

    // Texto do período de treinos
    getWorkoutsPeriodText() {
      const total = this.getTotalCompletedWorkouts();
      if (total === 0) return 'Nenhum treino concluído';
      return `${this.selectedPeriod.toLowerCase()}`;
    },

    // Adesão média REAL calculada dos alunos
    getAverageAdherence() {
      if (!this.studentsData || this.studentsData.length === 0) {
        return 0;
      }
      
      const totalAdherence = this.studentsData.reduce((sum, student) => {
        return sum + (student.adherence || 0);
      }, 0);
      
      const avg = totalAdherence / this.studentsData.length;
      return Math.round(avg);
    },

    // Trend de adesão
    getAdherenceTrendIcon() {
      const avg = this.getAverageAdherence();
      if (avg >= 80) return 'fa-arrow-up';
      if (avg >= 60) return 'fa-check';
      if (avg >= 40) return 'fa-minus';
      return 'fa-arrow-down';
    },

    getAdherenceTrendText() {
      const avg = this.getAverageAdherence();
      if (avg >= 80) return 'Excelente adesão';
      if (avg >= 60) return 'Boa adesão';
      if (avg >= 40) return 'Adesão regular';
      return 'Necessita atenção';
    },

    getAdherenceTrendClass() {
      const avg = this.getAverageAdherence();
      if (avg >= 80) return 'success';
      if (avg >= 60) return 'success';
      if (avg >= 40) return '';
      return 'warning';
    },

    viewStudentDetails(studentId) {
      console.log('Viewing details for student:', studentId);
      this.$router.push(`/student/${studentId}/profile`);
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
}

.dashboard-main {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  background-color: var(--bg-secondary);
  color: var(--text-color);
  min-height: 100vh;
  box-sizing: border-box;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Detecta quando o navbar está colapsado */
body:has(.navbar-collapsed) .dashboard-main,
.dashboard-container:has(.navbar-collapsed) .dashboard-main {
  margin-left: 0 !important;
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
  position: relative;
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

.dropdown-icon {
  transition: transform 0.2s ease;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 4px;
}

.dropdown-item {
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid var(--border-color);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: var(--hover-bg);
}

.dropdown-item.active {
  background-color: var(--primary-color);
  color: white;
}

.dropdown-item.active:hover {
  background-color: var(--primary-light);
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
  gap: 0.75rem;
}

.achievement-item {
  display: block;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

/* Estilos para diferentes tipos de alerta */
.achievement-item.alert-warning {
  border-left: 4px solid #f59e0b;
  padding-left: 1rem;
  background: rgba(245, 158, 11, 0.08);
}

.achievement-item.alert-alert {
  border-left: 4px solid #ef4444;
  padding-left: 1rem;
  background: rgba(239, 68, 68, 0.08);
}

.achievement-item.alert-success {
  border-left: 4px solid #10b981;
  padding-left: 1rem;
  background: rgba(16, 185, 129, 0.08);
}

.achievement-item.alert-info {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  background: rgba(59, 130, 246, 0.08);
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

/* No Data Message - Mensagem quando não há dados para exibir */
.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 300px;
}

.no-data-icon {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);
  border: 2px solid rgba(139, 92, 246, 0.2);
}

.dashboard-light .no-data-icon {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-color: rgba(37, 99, 235, 0.2);
}

.no-data-icon i {
  font-size: 2.5rem;
  color: var(--primary-color);
  opacity: 0.6;
}

.no-data-message h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.025em;
}

.no-data-message p {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
  max-width: 400px;
  line-height: 1.6;
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

/* ========= ENHANCED CHART LEGEND ========= */
.enhanced-chart-legend {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.dashboard-dark .enhanced-chart-legend {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.05);
}

.legend-stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.legend-stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.legend-stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #6c5ce7 0%, #a29bfe 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.legend-stat-card:hover::before {
  opacity: 1;
}

.legend-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.15);
  border-color: rgba(108, 92, 231, 0.3);
}

.dashboard-dark .legend-stat-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
}

.dashboard-dark .legend-stat-card:hover {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
}

.highlight-card {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.05) 0%, rgba(162, 155, 254, 0.05) 100%);
  border-color: rgba(108, 92, 231, 0.2);
}

.dashboard-dark .highlight-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(167, 139, 250, 0.08) 100%);
  border-color: rgba(139, 92, 246, 0.3);
}

.legend-stat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.legend-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.indicator-line {
  width: 24px;
  height: 3px;
  border-radius: 2px;
}

.primary-indicator .indicator-dot {
  background: #6c5ce7;
  box-shadow: 0 0 12px rgba(108, 92, 231, 0.4);
}

.primary-indicator .indicator-line {
  background: linear-gradient(90deg, #6c5ce7 0%, transparent 100%);
}

.secondary-indicator .indicator-dot {
  background: #a29bfe;
  box-shadow: 0 0 12px rgba(162, 155, 254, 0.4);
}

.secondary-indicator .indicator-line {
  background: linear-gradient(90deg, #a29bfe 0%, transparent 100%);
}

.accent-indicator {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.legend-stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.legend-stat-value {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  line-height: 1;
}

.stat-unit {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
}

.legend-stat-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.legend-stat-trend i {
  font-size: 0.875rem;
}

.legend-stat-trend.success {
  color: #10b981;
}

.legend-stat-trend.success i {
  color: #10b981;
}

.legend-stat-trend.warning {
  color: #f59e0b;
}

.legend-stat-trend.warning i {
  color: #f59e0b;
}

.legend-stat-trend .fa-arrow-up {
  color: #10b981;
}

.legend-stat-trend .fa-arrow-down {
  color: #ef4444;
}

.legend-stat-trend .fa-minus {
  color: #f59e0b;
}

.legend-stat-trend .fa-check {
  color: #10b981;
}

/* Responsive adjustments for legend */
@media (max-width: 1200px) {
  .legend-stats-row {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
}

@media (max-width: 768px) {
  .enhanced-chart-legend {
    padding: 1rem;
  }
  
  .legend-stats-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .legend-stat-card {
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}

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

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(470px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: start;
}

.students-grid:has(.student-card:nth-child(-n+3):last-child) {
  grid-template-columns: repeat(auto-fill, 470px);
  justify-content: start;
}

@supports not (selector(:has(*))) {
  .students-grid[data-items="1"] {
    grid-template-columns: 470px;
    justify-content: start;
  }
  
  .students-grid[data-items="2"] {
    grid-template-columns: repeat(2, 470px);
    justify-content: start;
  }
  
  .students-grid[data-items="3"] {
    grid-template-columns: repeat(3, 470px);
    justify-content: start;
  }
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

.btn-arrow-container .fas {
  font-size: 0.8125rem;
  font-weight: 600;
}

/* Summary Stats */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
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

.summary-icon .fas {
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

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-color);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 500px;
  justify-content: center;
}

.pagination-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dashboard-light .pagination-btn:not(:disabled):hover {
  border-color: rgba(37, 99, 235, 0.3);
  background: rgba(37, 99, 235, 0.05);
}

.dashboard-dark .pagination-btn:not(:disabled):hover {
  border-color: rgba(139, 92, 246, 0.3);
  background: rgba(139, 92, 246, 0.05);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.page-indicator {
  font-weight: 600;
  color: var(--text-color);
  font-size: 1rem;
}

.items-indicator {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.pagination-btn i {
  font-size: 0.875rem;
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

/* Media query para tablets */
@media (max-width: 1024px) and (min-width: 769px) {
  .students-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) !important;
    justify-content: start;
  }
  
  .students-grid[data-items="1"],
  .students-grid[data-items="2"] {
    grid-template-columns: repeat(auto-fill, 350px) !important;
    justify-content: start;
  }
}

@media (max-width: 768px) {
  .dashboard-main {
    margin-left: 0;
    padding: 1rem;
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

  .students-grid {
    grid-template-columns: 1fr !important;
    gap: 1.5rem;
    justify-content: stretch !important;
  }

  /* Força o comportamento responsivo, ignorando as regras de tamanho fixo */
  .students-grid[data-items="1"],
  .students-grid[data-items="2"],
  .students-grid[data-items="3"] {
    grid-template-columns: 1fr !important;
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

.btn-view-details:hover .fas {
  animation: arrowBounce 0.6s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}

/* Focus States */
.nav-btn:focus,
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

/* Loading and Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: var(--text-color);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container .error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-container h3 {
  color: var(--error-color);
  margin-bottom: 0.5rem;
}

.error-container p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: var(--primary-light);
}

/* Print Styles */
@media print {
  .dashboard-main {
    margin-left: 0;
  }
  
  .nav-btn,
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