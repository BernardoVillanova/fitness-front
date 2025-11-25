<template>
  <div class="dashboard-wrapper">
    <DashboardNavBar />
    <main class="dashboard-main">
      <!-- Header -->
      <div class="header">
        <div class="header-container">
          <div class="header-right">
            <div class="search-bar">
              <i class="fas fa-search search-icon"></i>
              <input 
                type="text" 
                placeholder="Buscar alunos, treinos ou sessões..." 
                v-model="searchQuery"
                @input="handleSearch"
              />
              <i 
                v-if="searchQuery" 
                class="fa-solid fa-xmark clear-icon" 
                @click="clearSearch"
              ></i>
            </div>
            <div class="user-profile clickable-profile" @click="viewInstructorProfile">
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
            </div>
          </div>
        </div>
      </div>

      <!-- Content wrapper -->
      <div class="content">
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-icon blue">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">Total de Alunos</div>
                <div class="stat-value">{{ totalStudents }}</div>
                <div class="stat-change positive">
                  <i class="fas fa-arrow-up stat-change-icon"></i>
                  <span>Alunos ativos</span>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-icon blue">
                <i class="fas fa-clipboard-list"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">Planos Ativos</div>
                <div class="stat-value">{{ totalActivePlans }}</div>
                <div class="stat-change positive">
                  <i class="fas stat-change-icon fa-chart-line"></i>
                  <span>Planos em uso</span>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-icon blue">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">Treinos Completos</div>
                <div class="stat-value">{{ totalCompletedWorkouts }}</div>
                <div class="stat-change" :class="totalCompletedWorkouts > 0 ? 'positive' : 'negative'">
                  <i class="fas stat-change-icon" :class="totalCompletedWorkouts > 0 ? 'fa-arrow-up' : 'fa-minus'"></i>
                  <span>Este mês</span>
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-icon blue">
                <i class="fas fa-chart-pie"></i>
              </div>
              <div class="stat-info">
                <div class="stat-label">Taxa de Conclusão</div>
                <div class="stat-value">{{ averageCompletionRate }}%</div>
                <div class="stat-change" :class="averageCompletionRate >= 70 ? 'positive' : 'negative'">
                  <i class="fas stat-change-icon" :class="averageCompletionRate >= 70 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
                  <span>Média geral</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
      <!-- Performance Analytics Chart - Top Left -->
      <div class="grid-item chart-area">
        <div class="chart-container-modern">
          <div class="chart-header-modern">
            <div class="title-section-modern">
              <h3 class="chart-title-modern">Performance Analytics</h3>
              <div class="badge-modern">
                <span class="badge-dot-modern"></span>
                <span class="badge-text-modern">Live</span>
              </div>
            </div>
          </div>

          <div class="chart-stats-grid">
            <div class="chart-stat-card">
              <span class="chart-stat-label">Pico</span>
              <span class="chart-stat-value">{{ chartStats.peak }}%</span>
              <span class="chart-stat-trend positive">+12.5%</span>
              <span class="chart-stat-comparison">vs período anterior</span>
            </div>
            <div class="chart-stat-card">
              <span class="chart-stat-label">Média</span>
              <span class="chart-stat-value">{{ chartStats.average }}%</span>
              <span class="chart-stat-trend positive">+8.2%</span>
              <span class="chart-stat-comparison">vs período anterior</span>
            </div>
            <div class="chart-stat-card">
              <span class="chart-stat-label">Mínimo</span>
              <span class="chart-stat-value">{{ chartStats.minimum }}%</span>
              <span class="chart-stat-trend negative">-3.1%</span>
              <span class="chart-stat-comparison">vs período anterior</span>
            </div>
            <div class="chart-stat-card">
              <span class="chart-stat-label">Taxa Conversão</span>
              <span class="chart-stat-value">{{ chartStats.conversionRate }}%</span>
              <span class="chart-stat-trend positive">+5.3%</span>
              <span class="chart-stat-comparison">vs período anterior</span>
            </div>
          </div>

          <div class="charts-container">
            <!-- Upper Chart - Purple/Blue -->
            <div class="chart-wrapper">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1000 240"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="purpleTopGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stop-color="#b8a7ff" stop-opacity="0.6" />
                    <stop
                      offset="100%"
                      stop-color="#e8e0ff"
                      stop-opacity="0.25"
                    />
                  </linearGradient>
                  <linearGradient
                    id="purpleBottomGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stop-color="#6b5ce7"
                      stop-opacity="0.85"
                    />
                    <stop
                      offset="100%"
                      stop-color="#9b8aff"
                      stop-opacity="0.75"
                    />
                  </linearGradient>
                </defs>

                <!-- Grid -->
                <g v-for="i in 5" :key="`grid-purple-${i}`">
                  <line
                    :x1="40"
                    :y1="13 + (190 / 4) * (i - 1)"
                    :x2="990"
                    :y2="13 + (190 / 4) * (i - 1)"
                    stroke="#f0f0f0"
                    stroke-dasharray="3 3"
                  />
                </g>

                <!-- Y Axis Labels -->
                <text
                  v-for="(tick, i) in [0, 13, 25, 38, 50]"
                  :key="`y-purple-${i}`"
                  :x="5"
                  :y="209 - (190 / 4) * i"
                  text-anchor="start"
                  fill="#94a3b8"
                  font-size="11"
                  font-family="Inter, sans-serif"
                  font-weight="500"
                >
                  {{ tick }}
                </text>

                <!-- X Axis Labels -->
                <text
                  v-for="(point, i) in data"
                  :key="`x-purple-${i}`"
                  :x="40 + (950 / 7) * i"
                  :y="225"
                  text-anchor="middle"
                  fill="#94a3b8"
                  font-size="11"
                  font-family="Inter, sans-serif"
                  font-weight="500"
                >
                  Sem {{ point.month }}
                </text>

                <!-- Areas -->
                <path
                  :d="purpleTopPath"
                  fill="url(#purpleTopGradient)"
                  class="area-animation"
                />
                <path
                  :d="purpleBottomPath"
                  fill="url(#purpleBottomGradient)"
                  class="area-animation"
                />
                
                <!-- Áreas invisíveis para hover -->
                <rect
                  v-for="(point, i) in data"
                  :key="`hover-purple-${i}`"
                  :x="40 + (950 / 7) * i - 60"
                  :y="13"
                  width="120"
                  height="190"
                  fill="transparent"
                  style="cursor: pointer;"
                  @mouseenter="(e) => showTooltipPurple(e, point)"
                  @mouseleave="hideTooltip"
                />
              </svg>
            </div>

            <!-- Lower Chart - Orange -->
            <div class="chart-wrapper">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1000 240"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="orangeTopGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stop-color="#ffb088"
                      stop-opacity="0.55"
                    />
                    <stop
                      offset="100%"
                      stop-color="#ffe8d9"
                      stop-opacity="0.25"
                    />
                  </linearGradient>
                  <linearGradient
                    id="orangeBottomGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stop-color="#ff8c5a" stop-opacity="0.8" />
                    <stop
                      offset="100%"
                      stop-color="#ffa875"
                      stop-opacity="0.7"
                    />
                  </linearGradient>
                </defs>

                <!-- Grid -->
                <g v-for="i in 5" :key="`grid-orange-${i}`">
                  <line
                    :x1="40"
                    :y1="13 + (190 / 4) * (i - 1)"
                    :x2="990"
                    :y2="13 + (190 / 4) * (i - 1)"
                    stroke="#f0f0f0"
                    stroke-dasharray="3 3"
                  />
                </g>

                <!-- Y Axis Labels -->
                <text
                  v-for="(tick, i) in [0, 10, 20, 30, 40]"
                  :key="`y-orange-${i}`"
                  :x="5"
                  :y="209 - (190 / 4) * i"
                  text-anchor="start"
                  fill="#94a3b8"
                  font-size="11"
                  font-family="Inter, sans-serif"
                  font-weight="500"
                >
                  {{ tick }}
                </text>

                <!-- X Axis Labels -->
                <text
                  v-for="(point, i) in data"
                  :key="`x-orange-${i}`"
                  :x="40 + (950 / 7) * i"
                  :y="225"
                  text-anchor="middle"
                  fill="#94a3b8"
                  font-size="11"
                  font-family="Inter, sans-serif"
                  font-weight="500"
                >
                  Sem {{ point.month }}
                </text>

                <!-- Areas -->
                <path
                  :d="orangeTopPath"
                  fill="url(#orangeTopGradient)"
                  class="area-animation"
                />
                <path
                  :d="orangeBottomPath"
                  fill="url(#orangeBottomGradient)"
                  class="area-animation"
                />
                
                <!-- Áreas invisíveis para hover -->
                <rect
                  v-for="(point, i) in data"
                  :key="`hover-orange-${i}`"
                  :x="40 + (950 / 7) * i - 60"
                  :y="13"
                  width="120"
                  height="190"
                  fill="transparent"
                  style="cursor: pointer;"
                  @mouseenter="(e) => showTooltipOrange(e, point)"
                  @mouseleave="hideTooltip"
                />
              </svg>
            </div>
          </div>

          <!-- Tooltip -->
          <div
            v-if="tooltipVisible"
            class="chart-tooltip"
            :style="{
              left: tooltipPosition.x + 'px',
              top: tooltipPosition.y + 'px'
            }"
          >
            <div class="tooltip-header">{{ tooltipData.week }}</div>
            <div class="tooltip-row">
              <span class="tooltip-label">
                <span class="tooltip-dot" :style="{ background: tooltipData.color }"></span>
                {{ tooltipData.label }}
              </span>
              <span class="tooltip-value">{{ tooltipData.value }}</span>
            </div>
          </div>

          <div class="legend-container">
            <div class="legend-item">
              <div
                class="legend-color"
                style="background: linear-gradient(135deg, #8b5cf6, #6366f1)"
              ></div>
              <span>Total de Treinos</span>
            </div>
            <div class="legend-item">
              <div
                class="legend-color"
                style="background: linear-gradient(135deg, #ff8c5a, #ffa875)"
              ></div>
              <span>Exercícios Completados</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column with Sidebar Content -->
      <div class="grid-item sidebar-area">
        <div class="sidebar-content">
          <!-- Calendar Card -->
          <div class="calendar-card">
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
                <div class="weekday" v-for="day in weekdays" :key="day">
                  {{ day }}
                </div>
              </div>

              <div class="days">
                <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  class="day"
                  :class="{
                    today: day.isToday,
                    'other-month': day.isOtherMonth,
                    empty: day.isEmpty,
                  }"
                >
                  <span class="day-number">{{ day.number }}</span>
                  <span v-if="day.hasWorkout" class="workout-indicator"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats Card -->
          <div class="quick-stats-card">
            <h3 class="sidebar-title">Resumo do Mês</h3>
            <div class="quick-stat-item">
              <div class="quick-stat-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="quick-stat-info">
                <span class="quick-stat-label">Alunos Ativos</span>
                <span class="quick-stat-value">{{ activeStudentsThisMonth }}</span>
                <span 
                  class="quick-stat-change" 
                  :class="newStudentsThisMonth >= 0 ? 'positive' : 'negative'"
                >
                  {{ newStudentsThisMonth >= 0 ? '+' : '' }}{{ newStudentsThisMonth }} novos alunos
                </span>
              </div>
            </div>
            <div class="quick-stat-item">
              <div class="quick-stat-icon">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div class="quick-stat-info">
                <span class="quick-stat-label">Frequência Média</span>
                <span class="quick-stat-value">{{ averageWeeklyFrequency }}x/semana</span>
                <span 
                  class="quick-stat-change" 
                  :class="frequencyChangePercentage >= 0 ? 'positive' : 'negative'"
                >
                  {{ frequencyChangePercentage >= 0 ? '+' : '' }}{{ frequencyChangePercentage }}% este mês
                </span>
              </div>
            </div>
            <div class="quick-stat-item">
              <div class="quick-stat-icon">
                <i class="fas fa-dumbbell"></i>
              </div>
              <div class="quick-stat-info">
                <span class="quick-stat-label">Treinos Completados</span>
                <span class="quick-stat-value">{{ workoutsCompletedThisMonth.toLocaleString('pt-BR') }}</span>
                <span 
                  class="quick-stat-change" 
                  :class="workoutsChangePercentage >= 0 ? 'positive' : 'negative'"
                >
                  {{ workoutsChangePercentage >= 0 ? '+' : '' }}{{ workoutsChangePercentage }}% este mês
                </span>
              </div>
            </div>
          </div>

          <!-- Performance Gauge -->
          <div class="performance-card">
            <div class="card-header-perf">
              <div>
                <h2 class="card-title-perf">Taxa de Adesão</h2>
                <p class="card-subtitle-perf">% de alunos ativos no período</p>
              </div>
              <select class="completion-dropdown" v-model="selectedCompletionPeriod">
                <option value="week">Semana</option>
                <option value="month">Mês</option>
                <option value="year">Ano</option>
              </select>
            </div>
            <div class="gauge-container">
              <svg width="180" height="180" viewBox="0 0 200 200">
                <defs>
                  <linearGradient
                    id="blueGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style="stop-color: #2563eb; stop-opacity: 1"
                    />
                    <stop
                      offset="100%"
                      style="stop-color: #3b82f6; stop-opacity: 1"
                    />
                  </linearGradient>
                </defs>
                <circle class="circle-bg" cx="100" cy="100" r="80"></circle>
                <circle
                  class="circle-progress"
                  cx="100"
                  cy="100"
                  r="80"
                  :style="{ strokeDashoffset: completionRate }"
                ></circle>
              </svg>
              <div class="percentage-text">{{ completionPercentage }}%</div>
            </div>
            <p class="card-description-perf">
              {{ completionMessage }}
            </p>
            <button class="btn-view-details">Ver Detalhes</button>
          </div>

          <!-- Workout Distribution Stats Card -->
          <div class="workout-distribution-card">
            <div class="distribution-header">
              <h2 class="distribution-title">Distribuição de Treinos</h2>
              <select class="distribution-dropdown" v-model="selectedLoremPeriod">
                <option value="week">Semana</option>
                <option value="month">Mês</option>
                <option value="year">Ano</option>
              </select>
            </div>
            <div class="distribution-stat-item">
              <div class="distribution-stat-value">
                <span class="distribution-arrow up">↑</span>
                <span class="distribution-number">{{ animatedCompletedCount }}</span>
              </div>
              <p class="distribution-stat-description">
                Treinos completados com sucesso pelos alunos
              </p>
            </div>
            <div class="distribution-stat-item">
              <div class="distribution-stat-value">
                <i class="fa distribution-icon-progress">&#xf110;</i>
                <span class="distribution-number">{{ animatedInProgressCount }}</span>
              </div>
              <p class="distribution-stat-description">
                Treinos em andamento aguardando conclusão
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table - Bottom spanning full width -->
      <div class="grid-item table-area">
        <div class="data-table-card">
          <div class="card-header">
            <div class="header-title">
              <div class="title-icon">
                <i class="fa-solid fa-clock-rotate-left"></i>
              </div>
              <div>
                <h2>Sessões de Treino Recentes</h2>
                <p class="chart-description">
                  Últimas 5 sessões realizadas pelos alunos
                </p>
              </div>
            </div>
            <div class="header-actions">
              <div class="filter-chips">
                <button
                  v-for="filter in statusFilters"
                  :key="filter.value"
                  :class="[
                    'filter-chip',
                    filter.value,
                    { active: activeFilter === filter.value },
                  ]"
                  @click="activeFilter = filter.value"
                >
                  <span class="filter-dot"></span>
                  {{ filter.label }}
                </button>
              </div>
              <a href="#" class="view-all">Ver Todas ›</a>
            </div>
          </div>
          <div class="table-wrapper">
            <div v-if="loading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>Carregando sessões...</p>
            </div>
            <div v-else-if="filteredSessions.length === 0" class="empty-state">
              <p>Nenhuma sessão encontrada</p>
            </div>
            <table v-else class="data-table">
              <thead>
                <tr>
                  <th>ALUNO</th>
                  <th>TREINO</th>
                  <th>DIVISÃO</th>
                  <th>EXERCÍCIOS</th>
                  <th>STATUS</th>
                  <th>DATA</th>
                  <th>AÇÃO</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="session in filteredSessions"
                  :key="session.id"
                  class="table-row"
                >
                  <td>
                    <div class="client-cell clickable" @click="viewStudentProfile(session.studentId)">
                      <div class="client-avatar">
                        <img
                          :src="session.studentAvatar"
                          :alt="session.student"
                          @error="(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session.student)}&background=2563eb&color=fff&size=48`"
                        />
                      </div>
                      <span>{{ session.student }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="workout-name">{{ session.workoutName }}</span>
                  </td>
                  <td>
                    <span class="division-badge">{{ session.division }}</span>
                  </td>
                  <td class="exercises-count">
                    {{ session.exercisesCompleted }}/{{ session.totalExercises }}
                  </td>
                  <td>
                    <span class="status-badge" :class="session.status">
                      <span class="status-dot"></span>
                      {{ session.statusText }}
                    </span>
                  </td>
                  <td class="date-cell">{{ session.date }}</td>
                  <td>
                    <button class="action-btn">Detalhes</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import api from "@/api";

export default {
  name: "NewDashboardTech",
  components: {
    DashboardNavBar,
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref("");
    const selectedPeriod = ref("7d");
    const activeFilter = ref("all");
    const selectedLoremPeriod = ref("week");
    const selectedCompletionPeriod = ref("week");
    const currentDate = ref(new Date());
    const loading = ref(false);

   
    const tooltipVisible = ref(false);
    const tooltipData = ref({ week: '', label: '', value: 0, color: '' });
    const tooltipPosition = ref({ x: 0, y: 0 });

    const monthNames = [
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
    ];
    const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    let updateInterval = null;

    const periods = [
      { label: "7D", value: "7d" },
      { label: "30D", value: "30d" },
      { label: "90D", value: "90d" },
    ];

    const statusFilters = [
      { label: "Todos", value: "all" },
      { label: "Completos", value: "completed" },
      { label: "Em Progresso", value: "in-progress" },
      { label: "Cancelados", value: "cancelled" },
    ];

    const workoutSessions = ref([]);
    const allWorkoutSessions = ref([]);
    const students = ref([]);

   
    const animatedCompletedCount = ref(0);
    const animatedInProgressCount = ref(0);

   
    const userData = ref({
      name: 'Instrutor',
      avatar: 'https://ui-avatars.com/api/?name=Instrutor&background=2563eb&color=fff&size=48',
      role: 'Personal Trainer'
    });
    const showUserDropdown = ref(false);
    const totalStudents = ref(0);
    const totalActivePlans = ref(0);
    const totalCompletedWorkouts = ref(0);
    const averageCompletionRate = ref(0);

   
    const avatarGradients = [
      "linear-gradient(135deg, #2563eb, #3b82f6)",
      "linear-gradient(135deg, #2563eb, #3b82f6)",
      "linear-gradient(135deg, #2563eb, #3b82f6)",
      "linear-gradient(135deg, #2563eb, #3b82f6)",
      "linear-gradient(135deg, #2563eb, #3b82f6)",
      "linear-gradient(135deg, #2563eb, #3b82f6)",
      "linear-gradient(135deg, #2563eb, #3b82f6)",
      "linear-gradient(135deg, #2563eb, #3b82f6)",
      "linear-gradient(135deg, #2563eb, #3b82f6)",
      "linear-gradient(135deg, #2563eb, #3b82f6)",
    ];

   
    const completionPercentage = computed(() => {
      if (!allWorkoutSessions.value || allWorkoutSessions.value.length === 0 || totalStudents.value === 0) {
        return 0;
      }
      
     
      const now = new Date();
      let filteredSessions = allWorkoutSessions.value;
      
      if (selectedCompletionPeriod.value === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredSessions = allWorkoutSessions.value.filter(session => {
          const sessionDate = new Date(session.date.split('/').reverse().join('-'));
          return sessionDate >= oneWeekAgo && session.status === 'completed';
        });
      } else if (selectedCompletionPeriod.value === "month") {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredSessions = allWorkoutSessions.value.filter(session => {
          const sessionDate = new Date(session.date.split('/').reverse().join('-'));
          return sessionDate >= oneMonthAgo && session.status === 'completed';
        });
      } else if (selectedCompletionPeriod.value === "year") {
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredSessions = allWorkoutSessions.value.filter(session => {
          const sessionDate = new Date(session.date.split('/').reverse().join('-'));
          return sessionDate >= oneYearAgo && session.status === 'completed';
        });
      }
      
      if (filteredSessions.length === 0) return 0;
      
     
      const activeStudents = new Set();
      filteredSessions.forEach(session => {
        activeStudents.add(session.studentId);
      });
      
     
      const percentage = Math.round((activeStudents.size / totalStudents.value) * 100);
      
      console.log(`📊 [Taxa de Adesão - ${selectedCompletionPeriod.value}]:`, {
        totalStudents: totalStudents.value,
        activeStudents: activeStudents.size,
        totalSessions: filteredSessions.length,
        percentage: percentage + '%',
        activeStudentsList: Array.from(activeStudents)
      });
      
      return percentage;
    });

   
    const completionRate = computed(() => {
      const circumference = 502.65;
      const percentage = completionPercentage.value;
      const offset = circumference - (percentage / 100) * circumference;
      return offset;
    });

   
    const completionMessage = computed(() => {
      const percentage = completionPercentage.value;
      
      if (percentage >= 80) {
        return "Excelente! A maioria dos alunos está engajada e treinando";
      } else if (percentage >= 60) {
        return "Muito bom! Boa parte dos alunos está ativa no período";
      } else if (percentage >= 40) {
        return "Regular. Considere estratégias para aumentar a adesão";
      } else if (percentage >= 20) {
        return "Atenção! Poucos alunos estão treinando regularmente";
      } else {
        return "Taxa baixa. Revisite suas estratégias de engajamento";
      }
    });

   
    const completedCount = computed(() => {
      if (!allWorkoutSessions.value || allWorkoutSessions.value.length === 0) {
        return 0;
      }
      
     
      const now = new Date();
      let filteredSessions = allWorkoutSessions.value;
      
      if (selectedLoremPeriod.value === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredSessions = allWorkoutSessions.value.filter(session => {
          const sessionDate = new Date(session.date.split('/').reverse().join('-'));
          return sessionDate >= oneWeekAgo;
        });
      } else if (selectedLoremPeriod.value === "month") {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredSessions = allWorkoutSessions.value.filter(session => {
          const sessionDate = new Date(session.date.split('/').reverse().join('-'));
          return sessionDate >= oneMonthAgo;
        });
      } else if (selectedLoremPeriod.value === "year") {
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredSessions = allWorkoutSessions.value.filter(session => {
          const sessionDate = new Date(session.date.split('/').reverse().join('-'));
          return sessionDate >= oneYearAgo;
        });
      }
      
      return filteredSessions.filter(
        (session) => session.status === "completed"
      ).length;
    });

   
    const inProgressCount = computed(() => {
      if (!allWorkoutSessions.value || allWorkoutSessions.value.length === 0) {
        return 0;
      }
      
     
      const now = new Date();
      let filteredSessions = allWorkoutSessions.value;
      
      if (selectedLoremPeriod.value === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredSessions = allWorkoutSessions.value.filter(session => {
          const sessionDate = new Date(session.date.split('/').reverse().join('-'));
          return sessionDate >= oneWeekAgo;
        });
      } else if (selectedLoremPeriod.value === "month") {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredSessions = allWorkoutSessions.value.filter(session => {
          const sessionDate = new Date(session.date.split('/').reverse().join('-'));
          return sessionDate >= oneMonthAgo;
        });
      } else if (selectedLoremPeriod.value === "year") {
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredSessions = allWorkoutSessions.value.filter(session => {
          const sessionDate = new Date(session.date.split('/').reverse().join('-'));
          return sessionDate >= oneYearAgo;
        });
      }
      
      return filteredSessions.filter(
        (session) => session.status === "in-progress"
      ).length;
    });

   
    
   
    const activeStudentsThisMonth = computed(() => {
      if (!allWorkoutSessions.value || allWorkoutSessions.value.length === 0) {
        return totalStudents.value || 0;
      }
      
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
     
      const uniqueStudents = new Set();
      allWorkoutSessions.value.forEach(session => {
        const sessionDate = new Date(session.date.split('/').reverse().join('-'));
        if (sessionDate >= firstDayOfMonth) {
          uniqueStudents.add(session.studentId);
        }
      });
      
      return uniqueStudents.size;
    });

   
    const newStudentsThisMonth = computed(() => {
      if (!allWorkoutSessions.value || allWorkoutSessions.value.length === 0) {
        return 0;
      }
      
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
     
      const studentsThisMonth = new Set();
      const studentsLastMonth = new Set();
      
      allWorkoutSessions.value.forEach(session => {
        const sessionDate = new Date(session.date.split('/').reverse().join('-'));
        
        if (sessionDate >= firstDayOfMonth) {
          studentsThisMonth.add(session.studentId);
        }
        
        if (sessionDate >= firstDayOfLastMonth && sessionDate < firstDayOfMonth) {
          studentsLastMonth.add(session.studentId);
        }
      });
      
     
      let newStudents = 0;
      studentsThisMonth.forEach(studentId => {
        if (!studentsLastMonth.has(studentId)) {
          newStudents++;
        }
      });
      
      return newStudents;
    });

   
    const workoutsCompletedThisMonth = computed(() => {
      if (!allWorkoutSessions.value || allWorkoutSessions.value.length === 0) {
        return 0;
      }
      
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      return allWorkoutSessions.value.filter(session => {
        const sessionDate = new Date(session.date.split('/').reverse().join('-'));
        return sessionDate >= firstDayOfMonth && session.status === 'completed';
      }).length;
    });

   
    const workoutsChangePercentage = computed(() => {
      if (!allWorkoutSessions.value || allWorkoutSessions.value.length === 0) {
        return 0;
      }
      
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      const workoutsThisMonth = allWorkoutSessions.value.filter(session => {
        const sessionDate = new Date(session.date.split('/').reverse().join('-'));
        return sessionDate >= firstDayOfMonth && session.status === 'completed';
      }).length;
      
      const workoutsLastMonth = allWorkoutSessions.value.filter(session => {
        const sessionDate = new Date(session.date.split('/').reverse().join('-'));
        return sessionDate >= firstDayOfLastMonth && sessionDate < firstDayOfMonth && session.status === 'completed';
      }).length;
      
      if (workoutsLastMonth === 0) {
        return workoutsThisMonth > 0 ? 100 : 0;
      }
      
      const change = ((workoutsThisMonth - workoutsLastMonth) / workoutsLastMonth) * 100;
      return Math.round(change * 10) / 10;
    });

   
    const adherenceRate = computed(() => {
      if (totalStudents.value === 0) {
        return 0;
      }
      
      const activeStudents = activeStudentsThisMonth.value;
      const rate = (activeStudents / totalStudents.value) * 100;
      return Math.round(rate * 10) / 10;
    });

   
    const adherenceChangePercentage = computed(() => {
      if (!allWorkoutSessions.value || allWorkoutSessions.value.length === 0 || totalStudents.value === 0) {
        return 0;
      }
      
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
     
      const activeThisMonth = new Set();
      allWorkoutSessions.value.forEach(session => {
        const sessionDate = new Date(session.date.split('/').reverse().join('-'));
        if (sessionDate >= firstDayOfMonth) {
          activeThisMonth.add(session.studentId);
        }
      });
      
     
      const activeLastMonth = new Set();
      allWorkoutSessions.value.forEach(session => {
        const sessionDate = new Date(session.date.split('/').reverse().join('-'));
        if (sessionDate >= firstDayOfLastMonth && sessionDate < firstDayOfMonth) {
          activeLastMonth.add(session.studentId);
        }
      });
      
      const rateThisMonth = (activeThisMonth.size / totalStudents.value) * 100;
      const rateLastMonth = (activeLastMonth.size / totalStudents.value) * 100;
      
      if (rateLastMonth === 0) {
        return rateThisMonth > 0 ? 100 : 0;
      }
      
      const change = ((rateThisMonth - rateLastMonth) / rateLastMonth) * 100;
      return Math.round(change * 10) / 10;
    });

   
    const averageWeeklyFrequency = computed(() => {
      if (!allWorkoutSessions.value || allWorkoutSessions.value.length === 0) {
        return 0;
      }
      
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
     
      const studentTrainingDays = new Map();
      
      allWorkoutSessions.value.forEach(session => {
        const sessionDate = new Date(session.date.split('/').reverse().join('-'));
        if (sessionDate >= firstDayOfMonth && session.status === 'completed') {
         
          const dateKey = sessionDate.toISOString().split('T')[0];
          
          if (!studentTrainingDays.has(session.studentId)) {
            studentTrainingDays.set(session.studentId, new Set());
          }
          
         
          studentTrainingDays.get(session.studentId).add(dateKey);
        }
      });
      
      if (studentTrainingDays.size === 0) return 0;
      
     
      const today = new Date();
      const daysElapsed = Math.floor((today - firstDayOfMonth) / (1000 * 60 * 60 * 24)) + 1;
      
     
     
      let totalFrequency = 0;
      let debugCount = 0;
      studentTrainingDays.forEach((daysSet, studentId) => {
        const uniqueDays = daysSet.size;
        const weeklyFrequency = (uniqueDays / daysElapsed) * 7;
        const limitedFreq = Math.min(weeklyFrequency, 7);
        
        if (debugCount < 5) {
          console.log(`  - Aluno ${studentId}: ${uniqueDays} dias únicos → ${weeklyFrequency.toFixed(1)}x/sem (limitado: ${limitedFreq.toFixed(1)}x)`);
          debugCount++;
        }
        
        totalFrequency += limitedFreq;
      });
      
      const avgFrequency = totalFrequency / studentTrainingDays.size;
      
      return Math.round(avgFrequency * 10) / 10;
    });

   
    const frequencyChangePercentage = computed(() => {
      if (!allWorkoutSessions.value || allWorkoutSessions.value.length === 0) {
        return 0;
      }
      
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
     
      const studentTrainingDaysThisMonth = new Map();
      allWorkoutSessions.value.forEach(session => {
        const sessionDate = new Date(session.date.split('/').reverse().join('-'));
        if (sessionDate >= firstDayOfMonth && session.status === 'completed') {
          const dateKey = sessionDate.toISOString().split('T')[0];
          
          if (!studentTrainingDaysThisMonth.has(session.studentId)) {
            studentTrainingDaysThisMonth.set(session.studentId, new Set());
          }
          studentTrainingDaysThisMonth.get(session.studentId).add(dateKey);
        }
      });
      
      const today = new Date();
      const daysThisMonth = Math.floor((today - firstDayOfMonth) / (1000 * 60 * 60 * 24)) + 1;
      
      let totalFreqThisMonth = 0;
      studentTrainingDaysThisMonth.forEach((daysSet) => {
        const uniqueDays = daysSet.size;
        const weeklyFreq = (uniqueDays / daysThisMonth) * 7;
        totalFreqThisMonth += Math.min(weeklyFreq, 7);
      });
      const avgFreqThisMonth = studentTrainingDaysThisMonth.size > 0 
        ? totalFreqThisMonth / studentTrainingDaysThisMonth.size 
        : 0;
      
     
      const studentTrainingDaysLastMonth = new Map();
      allWorkoutSessions.value.forEach(session => {
        const sessionDate = new Date(session.date.split('/').reverse().join('-'));
        if (sessionDate >= firstDayOfLastMonth && sessionDate < firstDayOfMonth && session.status === 'completed') {
          const dateKey = sessionDate.toISOString().split('T')[0];
          
          if (!studentTrainingDaysLastMonth.has(session.studentId)) {
            studentTrainingDaysLastMonth.set(session.studentId, new Set());
          }
          studentTrainingDaysLastMonth.get(session.studentId).add(dateKey);
        }
      });
      
     
      const lastMonthEnd = new Date(firstDayOfMonth);
      lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);
      const daysLastMonth = lastMonthEnd.getDate();
      
      let totalFreqLastMonth = 0;
      studentTrainingDaysLastMonth.forEach((daysSet) => {
        const uniqueDays = daysSet.size;
        const weeklyFreq = (uniqueDays / daysLastMonth) * 7;
        totalFreqLastMonth += Math.min(weeklyFreq, 7);
      });
      const avgFreqLastMonth = studentTrainingDaysLastMonth.size > 0 
        ? totalFreqLastMonth / studentTrainingDaysLastMonth.size 
        : 0;
      
      if (avgFreqLastMonth === 0) {
        return avgFreqThisMonth > 0 ? 100 : 0;
      }
      
      const change = ((avgFreqThisMonth - avgFreqLastMonth) / avgFreqLastMonth) * 100;
      return Math.round(change * 10) / 10;
    });

   
    const animateCount = (targetRef, targetValue) => {
      const duration = 800;
      const startValue = targetRef.value;
      const difference = targetValue - startValue;
      const startTime = Date.now();
      
      const updateCount = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
       
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        targetRef.value = Math.round(startValue + (difference * easeOutQuart));
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          targetRef.value = targetValue;
        }
      };
      
      requestAnimationFrame(updateCount);
    };

   
    watch(completedCount, (newValue) => {
      animateCount(animatedCompletedCount, newValue);
    });
    
    watch(inProgressCount, (newValue) => {
      animateCount(animatedInProgressCount, newValue);
    });

   
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

   
    const getStatusText = (status) => {
      const statusMap = {
        completed: "COMPLETO",
        "in-progress": "EM PROGRESSO",
        cancelled: "CANCELADO",
      };
      return statusMap[status] || status.toUpperCase();
    };

   
    const showTooltipPurple = (event, weekData) => {
     
      const displayValue = weekData.purpleBottom <= 1 ? 0 : weekData.purpleBottom;
      
      tooltipData.value = {
        week: `Semana ${weekData.month}`,
        label: 'Sets Completados',
        value: `${displayValue} sets`,
        color: '#8b5cf6'
      };
      
     
      const container = event.target.closest('.chart-container-modern');
      const rect = container.getBoundingClientRect();
      
      tooltipPosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      
      tooltipVisible.value = true;
    };

   
    const showTooltipOrange = (event, weekData) => {
     
      const displayValue = weekData.orangeBottom <= 1 ? 0 : weekData.orangeBottom;
      
      tooltipData.value = {
        week: `Semana ${weekData.month}`,
        label: 'Duração Média',
        value: `${displayValue} min`,
        color: '#ff8c5a'
      };
      
     
      const container = event.target.closest('.chart-container-modern');
      const rect = container.getBoundingClientRect();
      
      tooltipPosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      
      tooltipVisible.value = true;
    };

    const hideTooltip = () => {
      tooltipVisible.value = false;
    };

   
    const fetchWorkoutSessions = async () => {
      try {
        loading.value = true;

        const response = await api.get("/workout-sessions/sessions/instructor");

        if (response.data.success && response.data.sessions) {
         
          const transformedSessions = response.data.sessions
            .map((session, index) => {
             
              const studentName =
                session.studentId?.userId?.name ||
                session.studentId?.name ||
                "Aluno Desconhecido";

             
              let studentAvatar = null;
              
             
              if (session.studentId?.userId?.avatar) {
                studentAvatar = session.studentId.userId.avatar;
              } else if (session.studentId?.avatar) {
                studentAvatar = session.studentId.avatar;
              }
              
             
              if (studentAvatar && studentAvatar.startsWith('/uploads')) {
                studentAvatar = `http://localhost:3000${studentAvatar}`;
              }
              
             
              if (!studentAvatar) {
                studentAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=2563eb&color=fff&size=48`;
              }

              return {
                id: session._id,
                student: studentName,
                workoutName: session.workoutName || "Treino sem nome",
                division: session.divisionName || "N/A",
                exercisesCompleted: session.completedExercises || 0,
                totalExercises: session.totalExercises || 0,
                status: session.status,
                statusText: getStatusText(session.status),
                date: formatDate(session.startTime || session.createdAt),
                duration: session.duration || 0,
                totalVolume: session.totalVolume || 0,
                completedSets: session.completedSets || 0,
                studentId: session.studentId?._id || session.studentId,
                studentAvatar: studentAvatar,
                avatarGradient: avatarGradients[index % avatarGradients.length],
              };
            });

         
          allWorkoutSessions.value = transformedSessions;
          
         
          workoutSessions.value = transformedSessions.slice(0, 5);
          
         
          const now = new Date();
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const sessionsThisMonth = transformedSessions.filter(s => {
            const sessionDate = new Date(s.date.split('/').reverse().join('-'));
            return sessionDate >= firstDayOfMonth && s.status === 'completed';
          });
          console.log(`Sessões completadas em ${now.toLocaleDateString('pt-BR', { month: 'long' })}: ${sessionsThisMonth.length}`);
        } else {
          workoutSessions.value = [];
          allWorkoutSessions.value = [];
        }
      } catch (error) {
        workoutSessions.value = [];
        allWorkoutSessions.value = [];
      } finally {
        loading.value = false;
      }
    };

    const filteredSessions = computed(() => {
      let filtered = workoutSessions.value;

      if (activeFilter.value !== "all") {
        filtered = filtered.filter((s) => s.status === activeFilter.value);
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.student.toLowerCase().includes(query) ||
            s.workoutName.toLowerCase().includes(query) ||
            s.division.toLowerCase().includes(query)
        );
      }

      return filtered;
    });

   
    const data = computed(() => {
      const weeks = [];
      const now = new Date();
      
     
      const currentDayOfWeek = now.getDay();
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - currentDayOfWeek);
      currentWeekStart.setHours(0, 0, 0, 0);
      
     
      for (let i = 8; i >= 1; i--) {
       
        const weekEnd = new Date(currentWeekStart.getTime() - (i * 7 * 24 * 60 * 60 * 1000) + (6 * 24 * 60 * 60 * 1000));
        weekEnd.setHours(23, 59, 59, 999);
        
       
        const weekStart = new Date(weekEnd.getTime() - (6 * 24 * 60 * 60 * 1000));
        weekStart.setHours(0, 0, 0, 0);
        
       
        if (weekEnd > now) {
          continue;
        }
        
       
        const weekNumber = weeks.length + 1;
        
       
        const weekSessions = allWorkoutSessions.value.filter(session => {
          const sessionDate = new Date(session.date.split('/').reverse().join('-'));
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        });
        
       
        const totalSetsCompleted = weekSessions.reduce((sum, session) => {
          return sum + (session.completedSets || 0);
        }, 0);
        
       
        const sessionsWithDuration = weekSessions.filter(s => s.duration && s.duration > 0);
        const totalDuration = sessionsWithDuration.reduce((sum, session) => sum + (session.duration || 0), 0);
        const avgDuration = sessionsWithDuration.length > 0 ? totalDuration / sessionsWithDuration.length : 0;
        
       
       
       
        const purpleTopValue = totalSetsCompleted > 0 ? totalSetsCompleted : 1;
        const purpleBottomValue = totalSetsCompleted > 0 ? Math.round(totalSetsCompleted * 0.65) : 0.5;
        
       
        const orangeTopValue = avgDuration > 0 ? Math.round(avgDuration) : 1;
        const orangeBottomValue = avgDuration > 0 ? Math.round(avgDuration * 0.70) : 0.5;
        
        weeks.push({
          month: weekNumber,
          purpleBottom: purpleBottomValue,
          purpleTop: purpleTopValue,
          orangeBottom: orangeBottomValue,
          orangeTop: orangeTopValue,
          completedCount: totalSetsCompleted,
          inProgressCount: Math.round(avgDuration),
        });
        
       
        if (weeks.length === 8) break;
      }
      
      return weeks;
    });

   
    const chartStats = computed(() => {
      if (data.value.length === 0) {
        return { peak: 0, average: 0, minimum: 0, conversionRate: 0 };
      }

      const purpleTopValues = data.value.map(d => d.purpleTop);
      const peak = Math.max(...purpleTopValues);
      const minimum = Math.min(...purpleTopValues);
      const average = purpleTopValues.reduce((a, b) => a + b, 0) / purpleTopValues.length;
      
     
      const totalSessions = allWorkoutSessions.value.length;
      const completedSessions = allWorkoutSessions.value.filter(s => s.status === 'completed').length;
      const conversionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      return {
        peak: peak.toFixed(1),
        average: average.toFixed(1),
        minimum: minimum.toFixed(1),
        conversionRate: conversionRate.toFixed(1)
      };
    });

    const createMonotonePath = (key, maxValue) => {
      const xScale = (i) => 40 + (950 / 7) * i;
      const yScale = (value) => {
       
        if (value <= 0) return 203;
        return 203 - (value / maxValue) * 190;
      };

      const points = data.value.map((d, i) => ({
        x: xScale(i),
        y: yScale(d[key]),
      }));

      let path = `M ${points[0].x},${points[0].y}`;

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = i > 0 ? points[i - 1] : points[0];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i < points.length - 2 ? points[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        let cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        let cp2y = p2.y - (p3.y - p1.y) / 6;

       
        cp1y = Math.min(cp1y, 203);
        cp2y = Math.min(cp2y, 203);

        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }

      path += ` L ${points[points.length - 1].x},203`;
      path += ` L ${points[0].x},203 Z`;

      return path;
    };

    const purpleTopPath = computed(() => createMonotonePath("purpleTop", 50));
    const purpleBottomPath = computed(() =>
      createMonotonePath("purpleBottom", 50)
    );
    const orangeTopPath = computed(() => createMonotonePath("orangeTop", 40));
    const orangeBottomPath = computed(() =>
      createMonotonePath("orangeBottom", 40)
    );

   
    const monthYear = computed(() => {
      const month = monthNames[currentDate.value.getMonth()];
      const year = currentDate.value.getFullYear();
      return `${month}, ${year}`;
    });

    const calendarDays = computed(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      const today = new Date();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const prevLastDay = new Date(year, month, 0);

      let firstDayOfWeek = firstDay.getDay();
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

      const daysInMonth = lastDay.getDate();
      const daysInPrevMonth = prevLastDay.getDate();

     
      const workoutDaysByMonth = new Map();
      if (allWorkoutSessions.value && allWorkoutSessions.value.length > 0) {
        allWorkoutSessions.value.forEach(session => {
          if (session.date && session.status === 'completed') {
           
            const dateParts = session.date.split('/');
            if (dateParts.length === 3) {
              const workoutDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
              const workoutYear = workoutDate.getFullYear();
              const workoutMonth = workoutDate.getMonth();
              const workoutDay = workoutDate.getDate();
              
              const key = `${workoutYear}-${workoutMonth}`;
              if (!workoutDaysByMonth.has(key)) {
                workoutDaysByMonth.set(key, new Set());
              }
              workoutDaysByMonth.get(key).add(workoutDay);
            }
          }
        });
      }

      const days = [];

     
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevMonthKey = `${prevYear}-${prevMonth}`;
      const prevMonthWorkouts = workoutDaysByMonth.get(prevMonthKey) || new Set();
      
      for (let i = firstDayOfWeek; i > 0; i--) {
        const dayNum = daysInPrevMonth - i + 1;
        days.push({
          number: dayNum,
          isOtherMonth: true,
          isToday: false,
          isEmpty: false,
          hasWorkout: prevMonthWorkouts.has(dayNum),
        });
      }

     
      const currentMonthKey = `${year}-${month}`;
      const currentMonthWorkouts = workoutDaysByMonth.get(currentMonthKey) || new Set();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday =
          year === today.getFullYear() &&
          month === today.getMonth() &&
          day === today.getDate();

        days.push({
          number: day,
          isOtherMonth: false,
          isToday: isToday,
          isEmpty: false,
          hasWorkout: !isToday && currentMonthWorkouts.has(day),
        });
      }

     
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const nextMonthKey = `${nextYear}-${nextMonth}`;
      const nextMonthWorkouts = workoutDaysByMonth.get(nextMonthKey) || new Set();
      
      const totalCells = days.length;
      const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

      for (let i = 1; i <= remainingCells; i++) {
        days.push({
          number: i,
          isOtherMonth: true,
          isToday: false,
          isEmpty: false,
          hasWorkout: nextMonthWorkouts.has(i),
        });
      }

      return days;
    });

    const prevMonth = () => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      currentDate.value = new Date(year, month - 1, 1);
    };

    const nextMonth = () => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      currentDate.value = new Date(year, month + 1, 1);
    };

   
    const fetchUserData = async () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        
        if (!storedUser) {
          return;
        }

        const user = JSON.parse(storedUser);
        const userId = user.id || user._id;
        
        if (!userId) {
          userData.value.name = user.name || 'Instrutor';
          return;
        }

       
        const token = sessionStorage.getItem('token');
        const response = await api.get(`/instructors/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data) {
          const instructorData = response.data;
          
          const userName = instructorData.userId?.name || user.name || 'Instrutor';
          const avatarPath = instructorData.userId?.avatar || user.avatar;
          let avatarUrl;
          
          if (avatarPath && avatarPath.startsWith('/uploads/')) {
            avatarUrl = `http://localhost:3000${avatarPath}`;
          } else if (avatarPath && (avatarPath.startsWith('http://') || avatarPath.startsWith('https://'))) {
            avatarUrl = avatarPath;
          } else {
            avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff&size=48`;
          }
          
          userData.value.name = userName;
          userData.value.avatar = avatarUrl;
          userData.value.role = 'Personal Trainer';
        }
      } catch (error) {
        console.log('error: ', error);
      }
    };

   
    const fetchInstructorStats = async () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const userId = user.id || user._id;
        
        const token = sessionStorage.getItem('token');
        
       
        const instructorResponse = await api.get(`/instructors/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const instructorId = instructorResponse.data._id;
        
       
        const studentsResponse = await api.get(`/students/instructor/${instructorId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        students.value = studentsResponse.data || [];
        totalStudents.value = studentsResponse.data.length || 0;
        
       
        const studentsWithPlans = studentsResponse.data.filter(
          student => student.assignedWorkoutPlans && student.assignedWorkoutPlans.length > 0
        );
        totalActivePlans.value = studentsWithPlans.length;
        
       
        const sessionsResponse = await api.get('/workout-sessions/sessions/instructor', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (sessionsResponse.data.success && sessionsResponse.data.sessions) {
          const sessions = sessionsResponse.data.sessions;
          
         
          const now = new Date();
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          
          const completedThisMonth = sessions.filter(session => {
            if (session.status !== 'completed') return false;
            const sessionDate = new Date(session.startTime || session.createdAt);
            return sessionDate >= firstDayOfMonth;
          });
          
          totalCompletedWorkouts.value = completedThisMonth.length;
          
         
          if (sessions.length > 0) {
            const completed = sessions.filter(s => s.status === 'completed').length;
            averageCompletionRate.value = Math.round((completed / sessions.length) * 100);
          } else {
            averageCompletionRate.value = 0;
          }
        }
      } catch (error) {
        console.log('error: ', error);
      }
    };

   
    const toggleUserDropdown = () => {
      showUserDropdown.value = !showUserDropdown.value;
    };

   
    const navigateTo = (route) => {
      showUserDropdown.value = false;
      router.push(route);
    };

   
    const handleLogout = () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    };

   
    const handleSearch = () => {
     
    };

   
    const clearSearch = () => {
      searchQuery.value = '';
    };

   
    const viewStudentProfile = (studentId) => {
      if (studentId) {
        router.push({
          name: 'StudentProfileView',
          params: { id: studentId }
        });
      }
    };

   
    const viewInstructorProfile = () => {
      router.push('/instructor-profile');
    };

   
    const handleImageError = (event) => {
      event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.value.name)}&background=2563eb&color=fff&size=48`;
    };

   
    const handleClickOutside = (event) => {
      const userProfile = event.target.closest('.user-profile');
      if (!userProfile && showUserDropdown.value) {
        showUserDropdown.value = false;
      }
    };

    onMounted(() => {
     
      fetchWorkoutSessions();
      fetchUserData();
      fetchInstructorStats();

      updateInterval = setInterval(() => {
        const now = new Date();
        const current = currentDate.value;
        if (
          now.getDate() !== current.getDate() &&
          now.getMonth() === current.getMonth() &&
          now.getFullYear() === current.getFullYear()
        ) {
          currentDate.value = new Date();
        }
      }, 60000);
      
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      searchQuery,
      selectedPeriod,
      activeFilter,
      selectedLoremPeriod,
      selectedCompletionPeriod,
      periods,
      statusFilters,
      filteredSessions,
      loading,
      data,
      chartStats,
      purpleTopPath,
      purpleBottomPath,
      orangeTopPath,
      orangeBottomPath,
      tooltipVisible,
      tooltipData,
      tooltipPosition,
      showTooltipPurple,
      showTooltipOrange,
      hideTooltip,
      monthYear,
      weekdays,
      calendarDays,
      prevMonth,
      nextMonth,
      fetchWorkoutSessions,
      completionPercentage,
      completionRate,
      completionMessage,
      completedCount,
      inProgressCount,
      animatedCompletedCount,
      animatedInProgressCount,
      userData,
      showUserDropdown,
      totalStudents,
      totalActivePlans,
      totalCompletedWorkouts,
      averageCompletionRate,
      toggleUserDropdown,
      navigateTo,
      handleLogout,
      handleSearch,
      clearSearch,
      viewStudentProfile,
      viewInstructorProfile,
      handleImageError,
     
      activeStudentsThisMonth,
      newStudentsThisMonth,
      workoutsCompletedThisMonth,
      workoutsChangePercentage,
      adherenceRate,
      adherenceChangePercentage,
      averageWeeklyFrequency,
      frequencyChangePercentage,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

.dashboard-wrapper {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
}

.dashboard-main {
  margin-left: 280px;
  padding: 0;
  min-height: 100vh;
  box-sizing: border-box;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

/* Detecta quando o navbar está colapsado */
body:has(.navbar-collapsed) .dashboard-main,
.dashboard-wrapper:has(.navbar-collapsed) .dashboard-main {
  margin-left: 0 !important;
}

/* Header Styles */
.header {
  background-color: #ffffff;
  padding: 24px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-radius: 0;
  margin-bottom: 0;
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
  padding: 10px 40px 10px 40px;
  border: none;
  background-color: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  background-color: #fff;
  box-shadow: 0 0 0 2px #2563eb;
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

.clear-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s ease;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
}

.clear-icon:hover {
  color: #2563eb;
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
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin: -4px -8px;
}

.user-profile.clickable-profile:hover {
  background-color: #f5f5f5;
  transform: translateX(-2px);
}

.user-profile.clickable-profile:hover .user-name {
  color: #2563eb;
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
}

.user-role {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: capitalize;
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
}

.dropdown-item.logout:hover i {
  color: #dc2626;
}

.dropdown-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}

/* Content wrapper */
.content {
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(203, 213, 225, 0.3);
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
  gap: 8px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

.stat-icon.blue {
  background-color: #e6f4ff;
  color: #0080ff;
}

.stat-icon.green {
  background-color: #e6f4ff;
  color: #0080ff;
}

.stat-icon.purple {
  background-color: #e6f4ff;
  color: #0080ff;
}

.stat-icon.orange {
  background-color: #e6f4ff;
  color: #0080ff;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
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

/* Detecta quando o navbar está colapsado */
body:has(.navbar-collapsed) .dashboard-main,
.dashboard-wrapper:has(.navbar-collapsed) .dashboard-main {
  margin-left: 0 !important;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2.2fr 0.6fr;
  grid-template-rows: auto auto;
  gap: 24px;
}

.grid-item {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(203, 213, 225, 0.4);
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.chart-area {
  grid-column: 1;
  grid-row: 1;
}

.sidebar-area {
  grid-column: 2;
  grid-row: 1 / 3;
  background: transparent;
  border: none;
  box-shadow: none;
  overflow: visible;
}

.table-area {
  grid-column: 1;
  grid-row: 2;
}

/* Chart Styles */
.chart-container-modern {
  padding: 32px 24px;
  min-height: 685px;
  position: relative;
}

.chart-header-modern {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-section-modern {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-title-modern {
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.badge-modern {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 4px 10px;
  border-radius: 20px;
}

.badge-dot-modern {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.badge-text-modern {
  color: #10b981;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.chart-stat-card {
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(203, 213, 225, 0.3);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.3s ease;
}

.chart-stat-card:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.chart-stat-label {
  color: #64748b;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-stat-value {
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.chart-stat-trend {
  font-size: 13px;
  font-weight: 600;
}

.chart-stat-trend.positive {
  color: #10b981;
}

.chart-stat-trend.negative {
  color: #ef4444;
}

.chart-stat-comparison {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
  width: 100%;
}

.chart-wrapper {
  height: 280px;
  width: 100%;
}

.area-animation {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.legend-container {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid rgba(203, 213, 225, 0.3);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.legend-item:hover {
  transform: translateY(-1px);
}

.legend-color {
  width: 24px;
  height: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.legend-item span {
  color: #475569;
  font-size: 13px;
  font-weight: 500;
}

/* Chart Tooltip */
.chart-tooltip {
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 1000;
  min-width: 180px;
  border: 1px solid rgba(203, 213, 225, 0.3);
  transform: translate(-50%, -120%);
}

.tooltip-header {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.tooltip-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.tooltip-value {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.calendar-card,
.quick-stats-card,
.performance-card,
.distribution-card,
.workout-distribution-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 213, 225, 0.3);
}

/* Calendar Styles */
.calendar-container {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
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
  gap: 2px;
}

.day-number {
  display: block;
}

.workout-indicator {
  width: 4px;
  height: 4px;
  background: #10b981;
  border-radius: 50%;
  display: block;
}

.day:hover:not(.today):not(.empty):not(.other-month) {
  background: #f0f0f0;
}

.day.empty {
  cursor: default;
}

.day.today {
  background: #2563eb;
  color: white;
  font-weight: 600;
}

.day.other-month {
  color: #ccc;
}

/* Quick Stats */
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

/* Performance Gauge */
.performance-card {
  text-align: center;
}

.card-header-perf {
  margin-bottom: 20px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-title-perf {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 2px 0;
}

.card-subtitle-perf {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
  margin: 0;
}

.completion-dropdown {
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
  flex-shrink: 0;
}

.completion-dropdown:hover {
  border-color: #cbd5e1;
}

.completion-dropdown:focus {
  outline: none;
  border-color: #2563eb;
}

.gauge-container {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto 20px;
}

.percentage-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 42px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -1px;
}

.circle-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 14;
}

.circle-progress {
  fill: none;
  stroke: url(#blueGradient);
  stroke-width: 14;
  stroke-linecap: round;
  stroke-dasharray: 502.65;
  transition: stroke-dashoffset 1s ease;
  transform: rotate(-90deg);
  transform-origin: center;
}

.card-description-perf {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 24px;
  font-weight: 400;
  text-align: center;
  padding: 0 8px;
}

.btn-view-details {
  width: 100%;
  padding: 13px 0;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border: none;
  color: white;
  font-weight: 600;
  font-size: 15px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  letter-spacing: 0.3px;
}

.btn-view-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.btn-view-details:active {
  transform: translateY(0);
}

/* Distribution */
.distribution-item {
  margin-bottom: 16px;
}

.distribution-item:last-child {
  margin-bottom: 0;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.distribution-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.distribution-value {
  font-size: 13px;
  color: #1e293b;
  font-weight: 700;
}

.distribution-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease;
}

.distribution-fill.success {
  background: linear-gradient(90deg, #10b981, #059669);
}

.distribution-fill.warning {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.distribution-fill.error {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

/* Workout Distribution Card */
.workout-distribution-card {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
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

/* Animação estilo cassino/slot machine */
.number-change-enter-active {
  animation: slotRollUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.number-change-leave-active {
  animation: slotRollOut 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  position: absolute;
}

@keyframes slotRollUp {
  0% {
    opacity: 0;
    transform: translateY(100%) rotateX(90deg);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

@keyframes slotRollOut {
  0% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-100%) rotateX(-90deg);
  }
}

.distribution-stat-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  padding-left: 32px;
  margin: 0;
  font-weight: 500;
}

/* Data Table */
.data-table-card {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  width: 40px;
  height: 40px;
  background: rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.title-icon i {
  color: #2563eb;
  font-size: 18px;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.chart-description {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  margin-top: 2px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-chips {
  display: flex;
  gap: 8px;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid rgba(203, 213, 225, 0.4);
  background: rgba(248, 250, 252, 0.8);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(139, 92, 246, 0.3);
}

.filter-chip.active {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.4);
  color: #667eea;
}

.filter-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.filter-chip.completed .filter-dot {
  background: #10b981;
}

.filter-chip.in-progress .filter-dot {
  background: #fbbf24;
}

.filter-chip.cancelled .filter-dot {
  background: #ef4444;
}

.filter-chip.pending .filter-dot {
  background: #fbbf24;
}

.filter-chip.failed .filter-dot {
  background: #ef4444;
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

.table-wrapper {
  overflow-x: auto;
  min-height: 300px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p,
.empty-state p {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fafafa;
  border-radius: 12px;
  overflow: hidden;
}

.data-table thead th {
  text-align: left;
  padding: 14px 20px;
  color: #64748b;
  font-weight: 600;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #f1f5f9;
  background: #fafafa;
}

.table-row {
  transition: background-color 0.2s ease;
  background: white;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-row:last-child td {
  border-bottom: none;
}

.data-table tbody td {
  padding: 19px 20px;
  color: #475569;
  font-size: 13.5px;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
}

.mono {
  font-family: "SF Mono", "Monaco", monospace;
  color: #667eea;
  font-weight: 600;
  font-size: 12px;
  padding: 4px 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 6px;
}

.workout-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14.5px;
}

.division-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 500;
}

.exercises-count {
  font-weight: 600;
  color: #6366f1;
  font-size: 13.5px;
}

.client-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.client-cell.clickable {
  cursor: pointer;
}

.client-cell.clickable:hover {
  transform: translateX(2px);
}

.client-cell.clickable:hover span {
  color: #2563eb;
}

.client-avatar {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #fff;
  font-size: 17px;
  overflow: hidden;
  background-color: #f3f4f6;
}

.client-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.value {
  font-weight: 600;
  color: #059669;
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

.status-badge.pending {
  background: rgba(251, 191, 36, 0.15);
  color: #d97706;
}

.status-badge.pending .status-dot {
  background: #fbbf24;
}

.status-badge.failed {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.status-badge.failed .status-dot {
  background: #ef4444;
}

.date-cell {
  color: #64748b;
  font-size: 13.5px;
  white-space: nowrap;
}

.action-btn {
  padding: 6px 14px;
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.3);
  color: #2563eb;
  font-weight: 600;
  font-size: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

/* Responsive */
@media (max-width: 1400px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .chart-area,
  .sidebar-area,
  .table-area {
    grid-column: 1;
    grid-row: auto;
  }

  .sidebar-area {
    overflow: visible;
  }

  .sidebar-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-wrapper {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-container-modern {
    padding: 20px;
  }

  .chart-title-modern {
    font-size: 20px;
  }

  .chart-content-modern {
    height: 240px;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .filter-chips {
    width: 100%;
    justify-content: space-between;
  }

  .search-input {
    width: 100%;
  }

  .sidebar-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .header {
    padding: 16px 20px;
  }

  .search-bar input {
    width: 200px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .header {
    padding: 12px 16px;
  }

  .header-right {
    gap: 12px;
  }

  .search-bar {
    display: none;
  }

  .user-info {
    display: none;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
</style>
