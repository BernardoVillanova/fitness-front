<template>
  <div class="student-progress">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-chart-line"></i>
        Meu Progresso
      </h1>
      <p class="page-subtitle">Acompanhe sua evolução e conquistas</p>
    </div>

    <!-- Progress Overview -->
    <div class="progress-overview">
      <div class="overview-card">
        <div class="card-header">
          <h2>Visão Geral</h2>
          <div class="period-selector">
            <button 
              v-for="period in periods" 
              :key="period.value"
              @click="selectedPeriod = period.value"
              :class="['period-btn', { active: selectedPeriod === period.value }]"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div class="metric-info">
              <h3>{{ workoutStats.completed }}</h3>
              <p>Treinos Realizados</p>
              <span class="metric-change positive">+{{ workoutStats.change }}%</span>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <i class="fas fa-fire"></i>
            </div>
            <div class="metric-info">
              <h3>{{ consistencyStats.streak }}</h3>
              <p>Dias Consecutivos</p>
              <span class="metric-change positive">+{{ consistencyStats.change }}</span>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <i class="fas fa-weight-hanging"></i>
            </div>
            <div class="metric-info">
              <h3>{{ weightStats.total }}kg</h3>
              <p>Volume Total</p>
              <span class="metric-change positive">+{{ weightStats.change }}%</span>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <i class="fas fa-trophy"></i>
            </div>
            <div class="metric-info">
              <h3>{{ achievementStats.total }}</h3>
              <p>Conquistas</p>
              <span class="metric-change positive">+{{ achievementStats.new }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <!-- Workout Frequency Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Frequência de Treinos</h3>
          <p>Treinos realizados por semana</p>
        </div>
        <div class="chart-container">
          <canvas ref="workoutChart" id="workoutChart"></canvas>
        </div>
      </div>

      <!-- Progress Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Evolução de Força</h3>
          <p>Progresso em exercícios principais</p>
        </div>
        <div class="chart-container">
          <canvas ref="progressChart" id="progressChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Goals Progress -->
    <div class="goals-section">
      <div class="section-header">
        <h2 class="section-title">
          <i class="fas fa-bullseye"></i>
          Progresso das Metas
        </h2>
        <button @click="showGoalsModal = true" class="btn-primary">
          <i class="fas fa-plus"></i>
          Nova Meta
        </button>
      </div>

      <div class="goals-grid">
        <div v-for="goal in goals" :key="goal.id" class="goal-card">
          <div class="goal-header">
            <div class="goal-info">
              <h4>{{ goal.title }}</h4>
              <p>{{ goal.description }}</p>
            </div>
            <div class="goal-status">
              <span :class="['status-badge', goal.status]">
                {{ getGoalStatusText(goal.status) }}
              </span>
            </div>
          </div>
          
          <div class="goal-progress">
            <div class="progress-info">
              <span class="current-value">{{ goal.current }}{{ goal.unit }}</span>
              <span class="target-value">Meta: {{ goal.target }}{{ goal.unit }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${goal.progress}%` }"></div>
            </div>
            <div class="progress-percentage">{{ goal.progress }}%</div>
          </div>

          <div class="goal-timeline">
            <div class="timeline-info">
              <span><i class="fas fa-calendar"></i> Criada em {{ formatDate(goal.createdAt) }}</span>
              <span><i class="fas fa-flag"></i> Meta até {{ formatDate(goal.deadline) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievements -->
    <div class="achievements-section">
      <h2 class="section-title">
        <i class="fas fa-trophy"></i>
        Conquistas Recentes
      </h2>
      
      <div class="achievements-grid">
        <div v-for="achievement in recentAchievements" :key="achievement.id" class="achievement-card">
          <div class="achievement-icon">
            <i :class="achievement.icon"></i>
          </div>
          <div class="achievement-info">
            <h4>{{ achievement.title }}</h4>
            <p>{{ achievement.description }}</p>
            <span class="achievement-date">{{ formatDate(achievement.unlockedAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Body Measurements -->
    <div class="measurements-section">
      <div class="section-header">
        <h2 class="section-title">
          <i class="fas fa-ruler"></i>
          Medidas Corporais
        </h2>
        <button @click="showMeasurementsModal = true" class="btn-secondary">
          <i class="fas fa-plus"></i>
          Adicionar Medida
        </button>
      </div>

      <div class="measurements-grid">
        <div v-for="measurement in bodyMeasurements" :key="measurement.type" class="measurement-card">
          <div class="measurement-header">
            <h4>{{ measurement.name }}</h4>
            <span class="measurement-unit">{{ measurement.unit }}</span>
          </div>
          <div class="measurement-progress">
            <div class="current-measurement">
              <span class="value">{{ measurement.current }}</span>
              <span class="change" :class="measurement.changeType">
                {{ measurement.change > 0 ? '+' : '' }}{{ measurement.change }}
              </span>
            </div>
            <div class="measurement-chart">
              <!-- Mini chart would go here -->
              <div class="mini-chart-placeholder">
                <div class="chart-line" :style="{ height: `${Math.abs(measurement.change) * 10}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Goals Modal -->
    <div v-if="showGoalsModal" class="modal-overlay" @click="closeGoalsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Nova Meta</h2>
          <button @click="closeGoalsModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createGoal" class="goal-form">
            <div class="form-group">
              <label>Título da Meta</label>
              <input v-model="newGoal.title" type="text" required class="form-input">
            </div>
            <div class="form-group">
              <label>Descrição</label>
              <textarea v-model="newGoal.description" class="form-textarea"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Valor Atual</label>
                <input v-model="newGoal.current" type="number" required class="form-input">
              </div>
              <div class="form-group">
                <label>Meta</label>
                <input v-model="newGoal.target" type="number" required class="form-input">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Unidade</label>
                <select v-model="newGoal.unit" class="form-select">
                  <option value="kg">kg</option>
                  <option value="reps">repetições</option>
                  <option value="min">minutos</option>
                  <option value="cm">cm</option>
                </select>
              </div>
              <div class="form-group">
                <label>Prazo</label>
                <input v-model="newGoal.deadline" type="date" required class="form-input">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeGoalsModal" class="btn-secondary">Cancelar</button>
          <button @click="createGoal" class="btn-primary">Criar Meta</button>
        </div>
      </div>
    </div>

    <!-- Measurements Modal -->
    <div v-if="showMeasurementsModal" class="modal-overlay" @click="closeMeasurementsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Adicionar Medida</h2>
          <button @click="closeMeasurementsModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addMeasurement" class="measurement-form">
            <div class="form-group">
              <label>Tipo de Medida</label>
              <select v-model="newMeasurement.type" class="form-select" required>
                <option value="weight">Peso</option>
                <option value="bodyfat">Gordura Corporal</option>
                <option value="muscle">Massa Muscular</option>
                <option value="chest">Peitoral</option>
                <option value="waist">Cintura</option>
                <option value="bicep">Bíceps</option>
                <option value="thigh">Coxa</option>
              </select>
            </div>
            <div class="form-group">
              <label>Valor</label>
              <input v-model="newMeasurement.value" type="number" step="0.1" required class="form-input">
            </div>
            <div class="form-group">
              <label>Data</label>
              <input v-model="newMeasurement.date" type="date" required class="form-input">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeMeasurementsModal" class="btn-secondary">Cancelar</button>
          <button @click="addMeasurement" class="btn-primary">Adicionar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';

export default {
  name: 'StudentProgress',
  
  setup() {
    // Reactive data
    const selectedPeriod = ref('month');
    const showGoalsModal = ref(false);
    const showMeasurementsModal = ref(false);
    
    const periods = [
      { value: 'week', label: '7 dias' },
      { value: 'month', label: '30 dias' },
      { value: '3months', label: '3 meses' },
      { value: '6months', label: '6 meses' }
    ];

    // Mock data
    const workoutStats = reactive({
      completed: 24,
      change: 15
    });

    const consistencyStats = reactive({
      streak: 7,
      change: 2
    });

    const weightStats = reactive({
      total: 1250,
      change: 8
    });

    const achievementStats = reactive({
      total: 12,
      new: 3
    });

    const goals = ref([
      {
        id: 1,
        title: 'Supino 100kg',
        description: 'Conseguir fazer supino reto com 100kg',
        current: 85,
        target: 100,
        unit: 'kg',
        progress: 85,
        status: 'active',
        createdAt: '2024-01-15',
        deadline: '2024-03-15'
      },
      {
        id: 2,
        title: 'Perder 5kg',
        description: 'Reduzir peso corporal em 5kg mantendo massa muscular',
        current: 3,
        target: 5,
        unit: 'kg',
        progress: 60,
        status: 'active',
        createdAt: '2024-01-01',
        deadline: '2024-04-01'
      },
      {
        id: 3,
        title: '50 Flexões',
        description: 'Conseguir fazer 50 flexões consecutivas',
        current: 50,
        target: 50,
        unit: '',
        progress: 100,
        status: 'completed',
        createdAt: '2023-12-01',
        deadline: '2024-02-01'
      }
    ]);

    const recentAchievements = ref([
      {
        id: 1,
        title: 'Primeira Semana',
        description: 'Completou sua primeira semana de treinos',
        icon: 'fas fa-star',
        unlockedAt: '2024-01-22'
      },
      {
        id: 2,
        title: 'Consistência',
        description: '7 dias consecutivos de treino',
        icon: 'fas fa-fire',
        unlockedAt: '2024-01-28'
      },
      {
        id: 3,
        title: 'Força Crescente',
        description: 'Aumentou a carga em 10kg no supino',
        icon: 'fas fa-dumbbell',
        unlockedAt: '2024-02-05'
      }
    ]);

    const bodyMeasurements = ref([
      {
        type: 'weight',
        name: 'Peso',
        current: 78.5,
        change: -1.2,
        changeType: 'positive',
        unit: 'kg'
      },
      {
        type: 'bodyfat',
        name: 'Gordura Corporal',
        current: 15.2,
        change: -2.1,
        changeType: 'positive',
        unit: '%'
      },
      {
        type: 'muscle',
        name: 'Massa Muscular',
        current: 65.8,
        change: 1.5,
        changeType: 'positive',
        unit: 'kg'
      },
      {
        type: 'bicep',
        name: 'Bíceps',
        current: 38.5,
        change: 0.8,
        changeType: 'positive',
        unit: 'cm'
      }
    ]);

    const newGoal = reactive({
      title: '',
      description: '',
      current: 0,
      target: 0,
      unit: 'kg',
      deadline: ''
    });

    const newMeasurement = reactive({
      type: 'weight',
      value: 0,
      date: new Date().toISOString().split('T')[0]
    });

    // Methods
    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const getGoalStatusText = (status) => {
      const statusMap = {
        'active': 'Ativa',
        'completed': 'Concluída',
        'paused': 'Pausada'
      };
      return statusMap[status] || 'Desconhecida';
    };

    const closeGoalsModal = () => {
      showGoalsModal.value = false;
      Object.assign(newGoal, {
        title: '',
        description: '',
        current: 0,
        target: 0,
        unit: 'kg',
        deadline: ''
      });
    };

    const closeMeasurementsModal = () => {
      showMeasurementsModal.value = false;
      Object.assign(newMeasurement, {
        type: 'weight',
        value: 0,
        date: new Date().toISOString().split('T')[0]
      });
    };

    const createGoal = () => {
      const goal = {
        id: goals.value.length + 1,
        ...newGoal,
        progress: (newGoal.current / newGoal.target) * 100,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      goals.value.push(goal);
      closeGoalsModal();
    };

    const addMeasurement = () => {
      // In a real app, this would update the measurements
      console.log('Adding measurement:', newMeasurement);
      closeMeasurementsModal();
    };

    const initCharts = () => {
      // Chart initialization would go here
      // Using Chart.js or similar library
      console.log('Initializing charts...');
    };

    // Lifecycle
    onMounted(() => {
      initCharts();
    });

    return {
      selectedPeriod,
      showGoalsModal,
      showMeasurementsModal,
      periods,
      workoutStats,
      consistencyStats,
      weightStats,
      achievementStats,
      goals,
      recentAchievements,
      bodyMeasurements,
      newGoal,
      newMeasurement,
      formatDate,
      getGoalStatusText,
      closeGoalsModal,
      closeMeasurementsModal,
      createGoal,
      addMeasurement
    };
  }
};
</script>

<style scoped>
.student-progress {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title i {
  color: var(--primary-color);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Progress Overview */
.progress-overview {
  margin-bottom: 3rem;
}

.overview-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.period-selector {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.period-btn.active,
.period-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.metric-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.metric-info h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.metric-info p {
  color: var(--text-secondary);
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.metric-change {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.metric-change.positive {
  background: var(--success-bg);
  color: var(--success-color);
}

.metric-change.negative {
  background: var(--error-bg);
  color: var(--error-color);
}

/* Charts Section */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.chart-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.chart-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
}

/* Goals Section */
.goals-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: var(--primary-color);
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.goal-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.goal-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1.2rem;
}

.goal-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: var(--success-bg);
  color: var(--success-color);
}

.status-badge.completed {
  background: var(--info-bg);
  color: var(--info-color);
}

.goal-progress {
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.current-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.target-value {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.progress-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transition: width 0.3s ease;
}

.progress-percentage {
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-color);
}

.goal-timeline {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.timeline-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.timeline-info span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Achievements */
.achievements-section {
  margin-bottom: 3rem;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.achievement-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #8b5a00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.achievement-info h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.achievement-info p {
  margin: 0 0 0.25rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.achievement-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Measurements */
.measurements-section {
  margin-bottom: 3rem;
}

.measurements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.measurement-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.measurement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.measurement-header h4 {
  margin: 0;
  color: var(--text-primary);
}

.measurement-unit {
  font-size: 0.8rem;
  color: var(--text-secondary);
  background: var(--bg-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.current-measurement {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.current-measurement .value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.current-measurement .change {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.current-measurement .change.positive {
  background: var(--success-bg);
  color: var(--success-color);
}

.mini-chart-placeholder {
  height: 50px;
  background: var(--bg-primary);
  border-radius: 4px;
  display: flex;
  align-items: end;
  justify-content: center;
  padding: 0.5rem;
}

.chart-line {
  width: 4px;
  background: var(--primary-color);
  border-radius: 2px;
  min-height: 10px;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
}

.modal-close:hover {
  background: var(--bg-secondary);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Form Styles */
.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .student-progress {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .goals-grid,
  .achievements-grid,
  .measurements-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .goal-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .timeline-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-overlay {
    padding: 1rem;
  }
}

/* CSS Variables */
:root {
  --primary-color: #6366f1;
  --primary-hover: #5856eb;
  --secondary-color: #8b5cf6;
  --success-color: #10b981;
  --success-bg: #d1fae5;
  --info-color: #3b82f6;
  --info-bg: #dbeafe;
  --warning-color: #f59e0b;
  --warning-bg: #fef3c7;
  --error-color: #ef4444;
  --error-bg: #fef2f2;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
</style>