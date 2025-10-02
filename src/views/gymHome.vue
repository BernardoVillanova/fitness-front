<template>
  <div :class="isDarkMode ? 'dark' : 'light'" class="gym-home">
    <DashboardNavBar />
    <div class="dashboard-container">
      <div class="content-wrapper">
        <!-- Stats Section -->
        <section class="stats-section" v-if="!showForm">
          <div class="stats-container">
            <div class="stat-item">
              <div class="stat-card">
                <div class="card-icon">🏢</div>
                <div class="card-content">
                  <span class="stat-number">{{ gyms.length }}</span>
                  <span class="stat-label">Academias</span>
                </div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-card">
                <div class="card-icon">👥</div>
                <div class="card-content">
                  <span class="stat-number">{{ totalStudents }}</span>
                  <span class="stat-label">Alunos</span>
                </div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-card">
                <div class="card-icon">💪</div>
                <div class="card-content">
                  <span class="stat-number">{{ totalEquipments }}</span>
                  <span class="stat-label">Equipamentos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Actions Section -->
        <section class="actions-section">
          <div class="search-container">
            <div class="search-wrapper">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Buscar academias..."
                class="search-input"
              >
              <i class="fas fa-search search-icon"></i>
            </div>
            <button @click="showForm = true" class="cta-button primary">
              <span>Nova Academia</span>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        <!-- Form Section -->
        <section v-if="showForm" class="form-section">
          <GymForm
            :gym="selectedGym"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </section>

        <!-- List Section -->
        <section v-else class="list-section">
          <div class="grid-container">
            <GymList
              :gyms="filteredGyms"
              :loading="loading"
              @edit-gym="handleEdit"
              @delete-gym="confirmDelete"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import { getAllGyms, createGym, updateGym, deleteGym } from '@/api';
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import GymList from '@/components/GymList.vue';
import GymForm from '@/components/GymForm.vue';

export default {
  name: 'GymHome',
  components: {
    GymList,
    GymForm,
    DashboardNavBar,
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    
    const gyms = ref([]);
    const loading = ref(false);
    const selectedGym = ref(null);
    const showForm = ref(false);
    const searchQuery = ref('');

    const totalStudents = computed(() => {
      return gyms.value.reduce((total, gym) => total + (gym.students?.length || 0), 0);
    });

    const totalEquipments = computed(() => {
      return gyms.value.reduce((total, gym) => total + (gym.equipments?.length || 0), 0);
    });

    const filteredGyms = computed(() => {
      if (!searchQuery.value) return gyms.value;
      const query = searchQuery.value.toLowerCase();
      return gyms.value.filter(gym => 
        gym.name.toLowerCase().includes(query) ||
        gym.location.city.toLowerCase().includes(query) ||
        gym.location.state.toLowerCase().includes(query)
      );
    });

    return {
      isDarkMode,
      gyms,
      loading,
      selectedGym,
      showForm,
      searchQuery,
      filteredGyms,
      totalStudents,
      totalEquipments
    };
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
      if (!this.showForm) {
        this.selectedGym = null;
      }
    },
    async fetchGyms() {
      this.loading = true;
      try {
        const response = await getAllGyms();
        this.gyms = response.data;
      } catch (error) {
        console.error('Error fetching gyms:', error);
        // TODO: Implementar notificação de erro
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit(formPayload) {
      try {
        // Verifica se os dados estão na estrutura correta
        const formData = formPayload?.data || formPayload;
        if (!formData || !formData.name) {
          throw new Error('Dados da academia não encontrados no payload');
        }
        
        if (this.selectedGym) {
          await updateGym(this.selectedGym._id, formData);
          alert('✅ Academia atualizada com sucesso!');
        } else {
          await createGym(formData);
          alert('✅ Academia cadastrada com sucesso!');
        }
        
        await this.fetchGyms();
        this.handleCancel();
      } catch (error) {
        console.error('Error saving gym:', error);
        alert(`❌ Erro: ${error.response?.data?.message || error.message || 'Erro ao salvar academia'}`);
      }
    },
    handleEdit(gym) {
      this.selectedGym = gym;
      this.showForm = true;
    },
    confirmDelete(gymId) {
      if (confirm('Tem certeza que deseja excluir esta academia?')) {
        this.handleDelete(gymId);
      }
    },
    async handleDelete(gymId) {
      try {
        await deleteGym(gymId);
        await this.fetchGyms();
      } catch (error) {
        console.error('Error deleting gym:', error);
        // TODO: Implementar notificação de erro
      }
    },
    handleCancel() {
      this.selectedGym = null;
      this.showForm = false;
    },
  },
  mounted() {
    this.fetchGyms();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

.light {
  --primary-color: #2563eb;
  --primary-gradient: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --secondary-gradient: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  --accent-gradient: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  --background-color: #ffffff;
  --surface-color: #f8fafc;
  --card-background: rgba(255, 255, 255, 0.9);
  --text-color: #1e293b;
  --text-secondary: #64748b;
  --border-color: rgba(226, 232, 240, 0.8);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.15);
}

.dark {
  --primary-color: #8b5cf6;
  --primary-gradient: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --secondary-gradient: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  --accent-gradient: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
  --background-color: #0a0a0a;
  --surface-color: #1a1a1a;
  --card-background: rgba(42, 42, 42, 0.8);
  --text-color: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.7);
}

.gym-home {
  font-family: "Inter", sans-serif;
  background-color: var(--background-color);
  min-height: 100vh;
  color: var(--text-color);
}

.gym-home::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(37, 99, 235, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(59, 130, 246, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 40%,
      rgba(14, 165, 233, 0.2) 0%,
      transparent 50%
    );
  z-index: -1;
  animation: spinFloat 20s ease-in-out infinite;
  opacity: 0.3;
}

.dark .gym-home::before {
  background: radial-gradient(
      circle at 20% 80%,
      rgba(139, 92, 246, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(168, 85, 247, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 40%,
      rgba(192, 132, 252, 0.2) 0%,
      transparent 50%
    );
  opacity: 0.5;
}

.dashboard-container {
  padding: 2rem;
  margin-left: 280px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Detecta quando o navbar está colapsado */
body:has(.navbar-collapsed) .dashboard-container,
.gym-home:has(.navbar-collapsed) .dashboard-container {
  margin-left: 0 !important;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 50px;
  margin-bottom: 1.5rem;
}

.badge-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* Stats Section */
.stats-section {
  margin-bottom: 3rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.stat-card {
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease-out;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.card-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: var(--primary-gradient);
}

.card-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Actions Section */
.actions-section {
  margin-bottom: 3rem;
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1rem;
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--surface-color);
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color), 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background: var(--primary-gradient);
  color: white;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow-icon {
  transform: translateX(4px);
}

/* Form and List Sections */
.form-section,
.list-section {
  animation: fadeInUp 0.8s ease-out;
}

.grid-container {
  display: grid;
  gap: 2rem;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spinFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-container {
    margin-left: 0;
    padding: 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .search-container {
    flex-direction: column;
  }

  .cta-button {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }

  .search-container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .card-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}

/* Transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
