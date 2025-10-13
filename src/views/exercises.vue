<template>
  <div :class="isDarkMode ? 'dashboard-dark' : 'dashboard-light'" class="dashboard-container">
    <DashboardNavBar />
    <main class="dashboard-main">
      <!-- Floating Header -->
      <header class="floating-header">
        <div class="header-content">
          <div class="header-left">
            <div class="title-section">
              <h1 class="main-title">
                <span class="title-gradient">Exercícios</span>
              </h1>
              <p class="subtitle">Gerencie todos os exercícios disponíveis para seus planos de treino</p>
            </div>
          </div>
          <div class="header-right">
            <button class="create-button" @click="openCreateExerciseModal">
              <div class="button-glow"></div>
              <div class="button-content">
                <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                </svg>
                Novo Exercício
              </div>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="dashboard-content">
        <!-- Stats Section -->
        <section class="stats-section">
          <div class="stats-grid stats-grid-2">
            <div class="stat-card stat-primary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <div class="stat-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="stat-trend">
                    <span class="trend-value">+12%</span>
                  </div>
                </div>
                <div class="stat-body">
                  <span class="stat-number">{{ exercisesStats.total }}</span>
                  <span class="stat-label">Total de Exercícios</span>
                </div>
              </div>
            </div>

            <div class="stat-card stat-secondary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <div class="stat-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                    </svg>
                  </div>
                  <div class="stat-trend">
                    <span class="trend-value">{{ exercisesStats.categories }}</span>
                  </div>
                </div>
                <div class="stat-body">
                  <span class="stat-number">{{ exercisesStats.categories }}</span>
                  <span class="stat-label">Categorias</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Filter Section -->
        <section class="filter-wrapper">
          <CategoryFilter
            :categories="categoriesWithCounts"
            :selected-category="activeCategory"
            :filtered-count="filteredExercises.length"
            item-label="exercícios"
            @category-selected="filterByCategory"
            @clear-filters="clearFilters"
          />
        </section>

        <!-- Exercises Grid -->
        <section class="exercises-section">
          <div class="exercises-grid">
            <div 
              v-for="exercise in filteredExercises" 
              :key="exercise._id || exercise.id" 
              class="exercise-card"
            >
              <!-- Floating Glow Effect -->
              <div class="card-glow"></div>
              
              <!-- Exercise Header -->
              <div class="exercise-header">
                <div class="exercise-image">
                  <div class="image-container">
                    <!-- Fixed Image Implementation with Proper Fallback -->
                    <div v-if="!exercise.image || imageError[exercise._id || exercise.id]" class="image-placeholder">
                      <div class="placeholder-icon">
                        <svg width="48" height="48" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <span class="placeholder-text">{{ exercise.category }}</span>
                    </div>
                    <img 
                      v-else
                      :src="getImageUrl(exercise.image)"
                      :key="exercise.image"
                      :alt="exercise.name"
                      @error="handleImageError(exercise._id || exercise.id)"
                      @load="handleImageLoad(exercise._id || exercise.id)"
                    />
                    <div class="image-gradient"></div>
                  </div>
                  
                  <div class="image-overlay">
                    <div class="overlay-actions">
                      <button class="modern-overlay-btn preview-btn" @click="previewExercise(exercise)" title="Visualizar">
                        <div class="btn-glow-effect"></div>
                        <div class="btn-icon-wrapper">
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                          </svg>
                        </div>
                        <span class="btn-tooltip">Visualizar</span>
                      </button>
                      <button class="modern-overlay-btn edit-btn" @click="editExercise(exercise)" title="Editar">
                        <div class="btn-glow-effect"></div>
                        <div class="btn-icon-wrapper">
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                          </svg>
                        </div>
                        <span class="btn-tooltip">Editar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Settings Menu -->
              <div class="exercise-menu-wrapper" :ref="`dropdownRef-${exercise._id || exercise.id}`">
                <button 
                  class="settings-button" 
                  @click="toggleExerciseMenu(exercise._id || exercise.id)"
                  aria-label="Settings"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                  </svg>
                </button>
                
                <transition name="dropdown">
                  <div v-if="exercise.showMenu" class="dropdown-menu">
                    <a href="#" class="dropdown-item" @click.prevent="previewExercise(exercise)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Ver detalhes
                    </a>
                    
                    <a href="#" class="dropdown-item" @click.prevent="editExercise(exercise)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                      </svg>
                      Editar
                    </a>
                    
                    <div class="divider"></div>
                    
                    <a href="#" class="dropdown-item logout" @click.prevent="deleteExercise(exercise)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                      Excluir
                    </a>
                  </div>
                </transition>
              </div>

              <!-- Exercise Info -->
              <div class="exercise-info">
                <div class="exercise-meta">
                  <span class="category-badge">
                    <i :class="getCategoryIcon(exercise.category)"></i>
                    {{ getCategoryName(exercise.category) }}
                  </span>
                  <span :class="['difficulty-indicator', exercise.difficulty]">
                    <span class="difficulty-dot"></span>
                    {{ getDifficultyLabel(exercise.difficulty) }}
                  </span>
                </div>

                <h3 class="exercise-name">{{ exercise.name }}</h3>
                <p class="exercise-description">{{ truncate(exercise.description || 'Sem descrição', 150) }}</p>

                <!-- Exercise Details -->
                <div class="exercise-stats" v-if="exercise.muscleGroups && exercise.muscleGroups.length > 0">
                  <div class="stats-row">
                    <div class="stat-item full-width">
                      <div class="stat-icon-wrapper">
                        <i class="fas fa-bullseye"></i>
                      </div>
                      <div class="stat-content">
                        <span class="stat-label">Grupos Musculares</span>
                        <div class="badges-wrapper">
                          <span 
                            v-for="group in exercise.muscleGroups" 
                            :key="group" 
                            class="muscle-group-badge"
                          >
                            {{ group }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="exercise-actions">
                  <button class="action-button secondary-action" @click="deleteExercise(exercise)">
                    <div class="button-shine"></div>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="button-text">Excluir</span>
                  </button>
                  <button class="action-button primary-action" @click="viewExerciseDetails(exercise)">
                    <div class="button-particles"></div>
                    <div class="button-shine"></div>
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="button-text">Ver Detalhes</span>
                    <div class="button-arrow">→</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredExercises.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="empty-title">Nenhum exercício encontrado</h3>
            <p class="empty-description">Não encontramos exercícios com os filtros aplicados.</p>
            <button class="create-first-button" @click="openCreateExerciseModal">
              Criar Primeiro Exercício
            </button>
          </div>
        </section>
      </div>
    </main>

    <!-- Modal de Visualização -->
    <div class="modal-overlay" v-if="showDetailModal && selectedExercise" @click="closeDetailModal">
      <div class="modal-container-large" @click.stop>
        <div class="modal-header">
          <div class="modal-title-section">
            <i class="fas fa-dumbbell modal-icon"></i>
            <h2 class="modal-title">{{ selectedExercise.name }}</h2>
          </div>
          <button class="modal-close" @click="closeDetailModal">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Imagem do exercício -->
          <div class="detail-image-container" v-if="selectedExercise.image">
            <img :src="getImageUrl(selectedExercise.image)" :alt="selectedExercise.name" class="detail-image">
          </div>

          <!-- Informações Principais -->
          <div class="detail-info-grid">
            <div class="detail-info-item">
              <span class="detail-label">Nome</span>
              <span class="detail-value">{{ selectedExercise.name }}</span>
            </div>
            <div class="detail-info-item">
              <span class="detail-label">Categoria</span>
              <span class="detail-value">{{ selectedExercise.category }}</span>
            </div>
            <div class="detail-info-item">
              <span class="detail-label">Dificuldade</span>
              <span :class="['details-tag', 'difficulty-tag', selectedExercise.difficulty.toLowerCase()]">
                <span class="difficulty-dot"></span>
                {{ selectedExercise.difficulty }}
              </span>
            </div>
          </div>

          <!-- Descrição -->
          <div class="detail-section description-section" v-if="selectedExercise.description">
            <h3 class="detail-section-title">
              <i class="fas fa-file-alt"></i>
              Descrição
            </h3>
            <p class="detail-text">{{ selectedExercise.description }}</p>
          </div>

          <!-- Como Executar -->
          <div class="detail-section howto-section" v-if="selectedExercise.howToPerform">
            <h3 class="detail-section-title">
              <i class="fas fa-info-circle"></i>
              Como Executar
            </h3>
            <p class="detail-text">{{ selectedExercise.howToPerform }}</p>
          </div>

          <!-- Dicas de Segurança -->
          <div class="detail-section warning-section safety-section">
            <h3 class="detail-section-title">
              <i class="fas fa-shield-alt"></i>
              Dicas de Segurança
            </h3>
            <p class="detail-text warning-text">{{ selectedExercise.safetyTips || 'Mantenha sempre a postura correta durante a execução do exercício. Em caso de dor ou desconforto, pare imediatamente e consulte um profissional.' }}</p>
          </div>

          <!-- Grupos Musculares -->
          <div class="detail-section" v-if="selectedExercise.muscleGroups && selectedExercise.muscleGroups.length > 0">
            <h3 class="detail-section-title">
              <i class="fas fa-bullseye"></i>
              Grupos Musculares
            </h3>
            <div>
              <span v-for="group in selectedExercise.muscleGroups" :key="group" class="muscle-tag-large">
                {{ group }}
              </span>
            </div>
          </div>

          <!-- Vídeo Demonstrativo -->
          <div class="detail-section" v-if="selectedExercise.videoUrl">
            <h3 class="detail-section-title">
              <i class="fas fa-video"></i>
              Vídeo Demonstrativo
            </h3>
            <a :href="selectedExercise.videoUrl" target="_blank" class="video-link">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
              Assistir Vídeo
            </a>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeDetailModal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Fechar
          </button>
          <button class="btn-save" @click="editExercise(selectedExercise); closeDetailModal()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Editar Exercício
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Exercício -->
    <EditExerciseModal
      v-if="showEditModal && editingExercise"
      :exercise="editingExercise"
      :equipments="equipments"
      :muscleGroupOptions="muscleGroupOptions"
      @close="closeEditModal"
      @save="handleEditSave"
    />

    <!-- Modal de Criação de Exercício -->
    <ExerciseModal
      v-if="showCreateModal"
      :key="exerciseModalKey"
      :equipments="equipments"
      :muscleGroupOptions="muscleGroupOptions"
      @close="closeCreateModal"
      @save="saveNewExercise"
    />
  </div>
</template>

<script>
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import ExerciseModal from "@/components/ExerciseModal.vue";
import EditExerciseModal from "@/components/EditExerciseModal.vue";
import CategoryFilter from "@/components/CategoryFilter.vue";
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";
import api from "@/api";

export default {
  name: "ExercisesPage",
  components: { 
    DashboardNavBar,
    ExerciseModal,
    EditExerciseModal,
    CategoryFilter
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    return { isDarkMode };
  },
  data() {
    return {
      searchQuery: '',
      activeCategory: 'todos',
      imageError: {},
      showEditModal: false,
      showCreateModal: false,
      showDetailModal: false,
      selectedExercise: null,
      editingExercise: null,
      currentStep: 1,
      exercises: [],
      equipments: [],
      instructorId: null,
      exerciseModalKey: 0,
      newExercise: {
        name: '',
        description: '',
        howToPerform: '',
        category: 'forca',
        muscleGroups: [],
        equipmentId: null,
        difficulty: 'intermediario',
        safetyTips: '',
        variations: [],
        videoUrl: '',
        imageBase64: null
      },
      muscleGroupOptions: [
        { value: 'peito', label: 'Peito', icon: 'fas fa-hand-fist' },
        { value: 'costas', label: 'Costas', icon: 'fas fa-user' },
        { value: 'ombros', label: 'Ombros', icon: 'fas fa-arrows-alt-h' },
        { value: 'biceps', label: 'Bíceps', icon: 'fas fa-dumbbell' },
        { value: 'triceps', label: 'Tríceps', icon: 'fas fa-dumbbell' },
        { value: 'pernas', label: 'Pernas', icon: 'fas fa-running' },
        { value: 'gluteos', label: 'Glúteos', icon: 'fas fa-walking' },
        { value: 'abdomen', label: 'Abdômen', icon: 'fas fa-circle' },
        { value: 'panturrilha', label: 'Panturrilha', icon: 'fas fa-shoe-prints' },
        { value: 'antebraco', label: 'Antebraço', icon: 'fas fa-hand-rock' },
        { value: 'corpo-todo', label: 'Corpo Todo', icon: 'fas fa-user-check' }
      ],
      exercisesStats: {
        total: 0,
        categories: 0,
        mostUsed: 0
      },
      filteredExercises: []
    }
  },
  computed: {
    getImageUrl() {
      return (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:3000${imagePath}`;
      };
    },
    categoriesWithCounts() {
      const categories = [
        { id: 'todos', name: 'Todos', key: null, icon: 'fas fa-th-large' },
        { id: 'forca', name: 'Força', key: 'forca', icon: 'fas fa-dumbbell' },
        { id: 'cardio', name: 'Cardio', key: 'cardio', icon: 'fas fa-heartbeat' },
        { id: 'flexibilidade', name: 'Flexibilidade', key: 'flexibilidade', icon: 'fas fa-yin-yang' },
        { id: 'resistencia', name: 'Resistência', key: 'resistencia', icon: 'fas fa-running' },
        { id: 'potencia', name: 'Potência', key: 'potencia', icon: 'fas fa-bolt' },
        { id: 'outros', name: 'Outros', key: 'outros', icon: 'fas fa-ellipsis-h' }
      ];

      return categories.map(cat => {
        if (cat.id === 'todos') {
          return { ...cat, count: this.exercises.length };
        }
        const count = this.exercises.filter(ex => ex.category === cat.key).length;
        return { ...cat, count };
      });
    },
  },
  watch: {
    exercises: {
      handler() {
        console.log('📝 Lista de exercícios foi atualizada, re-aplicando filtros');
        this.applyFilters();
      },
      deep: true
    }
  },
  async mounted() {
    await this.fetchInstructorId();
    
    if (this.instructorId) {
      await Promise.all([
        this.fetchExercises(),
        this.fetchEquipments()
      ]);
    } else {
      console.error('❌ InstructorId inválido, não foi possível buscar dados');
    }
    
    // Adiciona listener para cliques fora do dropdown
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    async fetchInstructorId() {
      try {
        let userId = localStorage.getItem('userId');
        
        if (!userId) {
          userId = sessionStorage.getItem('userId');
        }
        
        if (!userId) {
          console.error('❌ UserId não encontrado no localStorage nem sessionStorage');
          
          // Tentar pegar do user completo
          const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            userId = user._id || user.id;
          }
        }
        
        if (!userId) {
          console.error('❌ Não foi possível obter userId de nenhuma fonte');
          return;
        }

        const response = await api.get(`/instructors/user/${userId}`);
        
        // A API retorna o instructor diretamente, não em response.data.instructor
        const instructor = response.data.instructor || response.data;
        this.instructorId = instructor._id;
      } catch (error) {
        console.error('❌ Erro ao buscar instructorId:', error);
        console.error('❌ Detalhes:', error.response?.data);
        console.error('❌ Status:', error.response?.status);
      }
    },
    
    async fetchExercises() {
      try {
        if (!this.instructorId) {
          console.error('❌ InstructorId não disponível');
          return;
        }

        const response = await api.get(`/exercises/instructor/${this.instructorId}`);
        this.exercises = response.data.exercises || [];
        
        // Atualiza estatísticas
        this.exercisesStats.total = this.exercises.length;
        const uniqueCategories = [...new Set(this.exercises.map(ex => ex.category))];
        this.exercisesStats.categories = uniqueCategories.length;
        
        // Aplica filtros
        this.applyFilters();
      } catch (error) {
        console.error('❌ Erro ao buscar exercícios:', error);
        this.exercises = [];
      }
    },

    async fetchEquipments() {
      try {
        if (!this.instructorId) {
          console.warn('⚠️ Sem instructorId para buscar equipamentos');
          return;
        }
        
        const url = `/equipments/instructor/${this.instructorId}`;
        
        const response = await api.get(url);
        
        this.equipments = response.data.equipments || [];
      } catch (error) {
        console.error('❌ Erro ao buscar equipamentos:', error);
        console.error('❌ Detalhes do erro:', error.response?.data);
        console.error('❌ Status:', error.response?.status);
        this.equipments = [];
      }
    },

    toggleExerciseMenu(exerciseId) {
      this.exercises = this.exercises.map(ex => {
        if (ex._id === exerciseId || ex.id === exerciseId) {
          return { ...ex, showMenu: !ex.showMenu };
        }
        return { ...ex, showMenu: false };
      });
    },

    async deleteExercise(exercise) {
      if (!confirm(`Tem certeza que deseja excluir o exercício "${exercise.name}"?`)) {
        return;
      }

      try {
        await api.delete(`/exercises/${exercise._id}`);
        
        // Remove da lista local
        this.exercises = this.exercises.filter(ex => ex._id !== exercise._id);
        
        // Atualiza stats
        this.exercisesStats.total = this.exercises.length;
        
        // Reaplica filtros
        this.applyFilters();
      } catch (error) {
        console.error('❌ Erro ao deletar exercício:', error);
        alert('Erro ao excluir exercício');
      }
    },

    viewExerciseDetails(exercise) {
      this.selectedExercise = exercise;
      this.showDetailModal = true;
    },

    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedExercise = null;
    },

    openEditModal(exercise) {
      
      // Passamos o exercício original - o componente filho irá processar os dados
      this.editingExercise = exercise;
      
      this.showEditModal = true;
    },

    closeEditModal() {
      this.showEditModal = false;
      this.editingExercise = null;
    },

    async handleEditSave(updateData) {
      try {
        const response = await api.put(`/exercises/${updateData._id}`, updateData);
        
        // Atualiza na lista local usando _id como identificador
        const index = this.exercises.findIndex(ex => ex._id === updateData._id || ex.id === updateData._id);
        if (index !== -1) {
          // Substitui o exercício completo na lista
          this.exercises.splice(index, 1, response.data.exercise || response.data);
          console.log('✅ Lista local atualizada no índice:', index);
        }

        this.closeEditModal();
        // Re-aplica os filtros para atualizar a lista filtrada
        this.applyFilters();
        
        console.log('🔄 Exercícios após atualização:', this.exercises.length);
      } catch (error) {
        console.error('❌ Erro ao atualizar exercício:', error);
        alert('Erro ao salvar exercício');
      }
    },

    truncate(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    handleImageError(exerciseId) {
      this.imageError[exerciseId] = true;
    },
    handleImageLoad(exerciseId) {
      this.imageError[exerciseId] = false;
    },
    filterExercises() {
      this.applyFilters();
    },
    filterByCategory(categoryId) {
      this.activeCategory = categoryId;
      this.applyFilters();
    },
    clearFilters() {
      this.activeCategory = 'todos';
      this.applyFilters();
    },
    clearSearch() {
      this.searchQuery = '';
      this.applyFilters();
    },
    resetFilters() {
      this.searchQuery = '';
      this.activeCategory = 'todos';
      this.applyFilters();
    },
    applyFilters() {
      let filtered = [...this.exercises];
      
      if (this.activeCategory && this.activeCategory !== 'todos') {
        filtered = filtered.filter(exercise => 
          exercise.category === this.activeCategory
        );
      }
      
      if (this.searchQuery.trim()) {
        filtered = filtered.filter(exercise =>
          exercise.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (exercise.description && exercise.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
      }
      
      this.filteredExercises = filtered;
    },
    previewExercise(exercise) {
      this.viewExerciseDetails(exercise);
    },
    editExercise(exercise) {
      this.openEditModal(exercise);
    },
    
    getCategoryName(categoryId) {
      const categoryMap = {
        'todos': 'Todos',
        'forca': 'Força',
        'cardio': 'Cardio',
        'flexibilidade': 'Flexibilidade',
        'resistencia': 'Resistência',
        'potencia': 'Potência',
        'outros': 'Outros'
      };
      return categoryMap[categoryId] || categoryId;
    },
    getCategoryIcon(categoryId) {
      const categoryMap = {
        'forca': 'fas fa-dumbbell',
        'cardio': 'fas fa-heartbeat',
        'flexibilidade': 'fas fa-leaf',
        'resistencia': 'fas fa-running',
        'potencia': 'fas fa-bolt',
        'outros': 'fas fa-cogs'
      };
      return categoryMap[categoryId] || 'fas fa-cogs';
    },
    getDifficultyLabel(difficulty) {
      const labels = {
        iniciante: 'Iniciante',
        intermediario: 'Intermediário',
        avancado: 'Avançado'
      };
      return labels[difficulty] || difficulty;
    },
    async openCreateExerciseModal() {
      if (!this.instructorId) {
        console.warn('⚠️ Sem instructorId, buscando novamente...');
        await this.fetchInstructorId();
      }
      
      // Re-fetch equipments para garantir dados atualizados
      await this.fetchEquipments();
      
      this.exerciseModalKey++; // Force re-render
      this.showCreateModal = true;
      this.currentStep = 1;
      this.newExercise = {
        name: '',
        description: '',
        howToPerform: '',
        category: 'forca',
        muscleGroups: [],
        equipmentId: null,
        difficulty: 'intermediario',
        safetyTips: '',
        variations: [],
        videoUrl: '',
        imageBase64: null
      };
    },

    nextStep() {
      if (this.currentStep === 1) {
        if (!this.newExercise.name || !this.newExercise.howToPerform) {
          alert('Nome e instruções de execução são obrigatórios');
          return;
        }
      }
      this.currentStep++;
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },

    closeCreateModal() {
      this.showCreateModal = false;
      this.newExercise = {
        name: '',
        description: '',
        howToPerform: '',
        category: 'forca',
        muscleGroups: [],
        equipmentId: null,
        difficulty: 'intermediario',
        safetyTips: '',
        variations: [],
        videoUrl: '',
        imageBase64: null
      };
    },

    async saveNewExercise(formData) {
      try {
        
        // formData já vem do modal com todos os campos preenchidos
        const exerciseData = {
          name: formData.name,
          description: formData.description || '',
          howToPerform: formData.howToPerform,
          category: formData.category,
          muscleGroups: formData.muscleGroups || [],
          equipmentId: formData.equipmentId || null,
          difficulty: formData.difficulty,
          safetyTips: formData.safetyTips || '',
          videoUrl: formData.videoUrl || ''
        };

        if (formData.imageBase64) {
          exerciseData.imageBase64 = formData.imageBase64;
        }

        const response = await api.post(`/exercises/instructor/${this.instructorId}`, exerciseData);
        
        this.exercises.push(response.data.exercise);
        this.exercisesStats.total = this.exercises.length;
        
        this.closeCreateModal();
        this.applyFilters();
        
        alert('Exercício criado com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao criar exercício:', error);
        console.error('❌ Detalhes:', error.response?.data);
        alert('Erro ao criar exercício: ' + (error.response?.data?.message || error.message));
      }
    },

    handleImageCreate(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            const maxSize = 1200;
            if (width > height && width > maxSize) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else if (height > maxSize) {
              width = (width / height) * maxSize;
              height = maxSize;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const base64 = canvas.toDataURL('image/jpeg', 0.7);
            this.newExercise.imageBase64 = base64;
          };
          img.src = e.target.result;
        } catch (error) {
          console.error('❌ Erro ao processar imagem:', error);
        }
      };
      reader.readAsDataURL(file);
    },
    triggerCreateFileInput() {
      this.$refs.createFileInput.click();
    },
    handleCreateFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processCreateFile(file);
      }
    },
    handleCreateDrop(event) {
      this.isCreateDragging = false;
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.processCreateFile(file);
      }
    },
    processCreateFile(file) {
      // Valida o tamanho do arquivo (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 10MB');
        return;
      }

      // Valida o tipo do arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      this.createSelectedFile = file;

      // Cria preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        this.createImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeCreateImage() {
      this.createImagePreview = null;
      this.createSelectedFile = null;
      if (this.$refs.createFileInput) {
        this.$refs.createFileInput.value = '';
      }
    },
    
    handleClickOutside(event) {
      const isClickInsideAnyDropdown = this.exercises.some(exercise => {
        const dropdownRef = this.$refs[`dropdownRef-${exercise._id || exercise.id}`];
        if (!dropdownRef) return false;
        
        const element = Array.isArray(dropdownRef) ? dropdownRef[0] : dropdownRef;
        return element && element.contains && element.contains(event.target);
      });

      if (!isClickInsideAnyDropdown) {
        this.exercises = this.exercises.map(exercise => ({
          ...exercise,
          showMenu: false
        }));
      }
    }
  }
}
</script>

<style scoped>
/* Reusing the same base styles */
* {
  box-sizing: border-box;
}

:root {
  --font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-family: "Inter", sans-serif;
}

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.dashboard-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-pattern);
  z-index: -1;
  opacity: 0.3;
}

.dashboard-main {
  flex: 1;
  padding: 0;
  margin-left: 280px;
  background: var(--bg-primary);
  position: relative;
  z-index: 1;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Detecta quando o navbar está colapsado */
body:has(.navbar-collapsed) .dashboard-main,
.dashboard-container:has(.navbar-collapsed) .dashboard-main {
  margin-left: 0 !important;
}

.dashboard-content {
  padding: 140px 40px 40px;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Theme Variables */
.dashboard-light {
  --bg-primary: #ffffff;
  --bg-secondary: rgba(248, 250, 252, 0.9);
  --bg-tertiary: rgba(255, 255, 255, 0.95);
  --bg-pattern: radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.1) 0%, transparent 50%);
  
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --text-accent: #475569;
  
  --border-primary: rgba(226, 232, 240, 0.8);
  --border-secondary: rgba(241, 245, 249, 0.6);
  --border-accent: rgba(37, 99, 235, 0.3);
  
  --gradient-primary: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --gradient-secondary: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  --gradient-tertiary: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  --gradient-accent: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(37, 99, 235, 0.15), 0 10px 10px -5px rgba(37, 99, 235, 0.1);
  
  --glass-bg: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.3);
  --glass-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
}

.dashboard-dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: rgba(15, 16, 23, 0.8);
  --bg-tertiary: rgba(26, 32, 44, 0.9);
  --bg-pattern: radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(192, 132, 252, 0.1) 0%, transparent 50%);
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-accent: #e2e8f0;
  
  --border-primary: rgba(51, 65, 85, 0.6);
  --border-secondary: rgba(30, 41, 59, 0.4);
  --border-accent: rgba(139, 92, 246, 0.3);
  
  --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --gradient-secondary: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  --gradient-tertiary: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
  --gradient-accent: linear-gradient(135deg, #d8b4fe 0%, #c084fc 100%);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(139, 92, 246, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.2);
  
  --glass-bg: rgba(15, 16, 23, 0.4);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
}

/* Floating Header */
.floating-header {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  z-index: 50;
  padding: 24px 40px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ajusta header quando navbar está colapsado */
body:has(.navbar-collapsed) .floating-header,
.dashboard-container:has(.navbar-collapsed) .floating-header {
  left: 0 !important;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1600px;
  margin: 0 auto;
  gap: 32px;
}

.header-left {
  flex: 1;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.main-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.title-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  opacity: 0.9;
}

.header-right {
  display: flex;
  align-items: center;
}

.create-button {
  position: relative;
  padding: 16px 28px;
  border: none;
  border-radius: 16px;
  background: var(--gradient-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-lg);
}

.create-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.create-button:hover .button-glow {
  opacity: 1;
}

.button-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;
}

.button-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
}

/* Stats Section */
.stats-section {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

.stats-grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

/* Filter Wrapper */
.filter-wrapper {
  margin-bottom: 32px;
}

.stat-card {
  position: relative;
  background: var(--bg-secondary);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  padding: 32px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border-color: var(--border-accent);
}

.stat-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 24px;
}

.stat-card.stat-primary .stat-background {
  background: var(--gradient-primary);
}

.stat-card.stat-secondary .stat-background {
  background: var(--gradient-secondary);
}

.stat-card.stat-tertiary .stat-background {
  background: var(--gradient-tertiary);
}

.stat-card:hover .stat-background {
  opacity: 0.05;
}

.stat-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.stat-card.stat-primary .stat-icon {
  background: var(--gradient-primary);
}

.stat-card.stat-secondary .stat-icon {
  background: var(--gradient-secondary);
}

.stat-card.stat-tertiary .stat-icon {
  background: var(--gradient-tertiary);
}

.stat-card:hover .stat-icon {
  transform: rotate(5deg) scale(1.1);
}

.stat-trend {
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
}

.trend-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
}

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ====== SEÇÃO DE FILTROS CLEAN COMO A IMAGEM ====== */
.clean-filter-section {
  margin-bottom: 32px;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.clean-filter-container {
  background: transparent;
  padding: 0;
}

/* ====== GRID DE CATEGORIAS CLEAN ====== */
.clean-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.clean-category-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  width: 100%;
  text-align: left;
}

.dashboard-dark .clean-category-card {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.clean-category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.12);
}

.dashboard-dark .clean-category-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.15);
}

.card-selected {
  background: #4285f4 !important;
  border-color: #4285f4 !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(66, 133, 244, 0.3);
}

.card-selected:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(66, 133, 244, 0.4);
}

/* ====== ÍCONES DAS CATEGORIAS ====== */
.category-icon-clean {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  color: #6b7280;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.dashboard-dark .category-icon-clean {
  background: rgba(255, 255, 255, 0.1);
  color: #9ca3af;
}

.card-selected .category-icon-clean {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

/* ====== CONTEÚDO DAS CATEGORIAS ====== */
.category-content-clean {
  flex: 1;
  min-width: 0;
}

.category-title-clean {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.card-selected .category-title-clean {
  color: white;
}

.category-count-clean {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 400;
  opacity: 0.8;
}

.card-selected .category-count-clean {
  color: rgba(255, 255, 255, 0.8);
  opacity: 1;
}

/* ====== SETA INDICADORA ====== */
.category-arrow-clean {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  flex-shrink: 0;
}

/* ====== SEÇÃO DE RESULTADOS ====== */
.results-section-clean {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 24px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  margin-bottom: 32px;
}

.dashboard-dark .results-section-clean {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.results-info-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.results-badge-clean {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  color: #0369a1;
}

.dashboard-dark .results-badge-clean {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.results-icon-clean {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #10b981;
  border-radius: 6px;
  color: white;
  flex-shrink: 0;
}

.results-text-clean {
  font-size: 14px;
  font-weight: 600;
  color: inherit;
}

.active-filter-chip {
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.dashboard-dark .active-filter-chip {
  background: rgba(255, 255, 255, 0.1);
}

/* ====== AÇÕES DOS RESULTADOS ====== */
.results-actions-clean {
  display: flex;
  gap: 12px;
  align-items: center;
}

.clear-filters-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #ef4444;
  border-radius: 8px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;
}

.clear-filters-btn:hover {
  background: #ef4444;
  color: white;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #4285f4;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;
}

.export-btn:hover {
  background: #3367d6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

/* ====== EXERCISES GRID ====== */
.exercises-section {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 32px;
}

.exercise-card {
  position: relative;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  max-width: 435px;
  height: 618px;
}

.exercise-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-color);
  box-shadow: var(--shadow-lg);
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.exercise-card:hover .card-glow {
  opacity: 1;
}

.exercise-header {
  position: relative;
}

.exercise-image {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.image-container {
  width: 100%;
  height: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.exercise-card:hover .image-container img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  position: relative;
}

.dashboard-dark .image-placeholder {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);
}

.image-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(45deg, transparent 45%, var(--border-color) 45%, var(--border-color) 55%, transparent 55%),
    linear-gradient(-45deg, transparent 45%, var(--border-color) 45%, var(--border-color) 55%, transparent 55%);
  background-size: 30px 30px;
  opacity: 0.05;
}

.placeholder-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 12px;
}

.placeholder-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.image-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
  pointer-events: none;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.exercise-card:hover .image-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 12px;
  transform: translateY(20px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
}

.exercise-card:hover .overlay-actions {
  transform: translateY(0);
}

.modern-overlay-btn {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.modern-overlay-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-overlay-btn:hover::before {
  opacity: 1;
}

.btn-glow-effect {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-overlay-btn:hover .btn-glow-effect {
  opacity: 1;
}

.btn-icon-wrapper {
  position: relative;
  z-index: 1;
  width: 24px;
  height: 24px;
  color: white;
  transition: transform 0.3s ease;
}

.btn-icon-wrapper svg {
  width: 100%;
  height: 100%;
}

.modern-overlay-btn:hover .btn-icon-wrapper {
  transform: scale(1.1);
}

.btn-tooltip {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.btn-tooltip::after {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-bottom-color: rgba(0, 0, 0, 0.9);
}

.modern-overlay-btn:hover .btn-tooltip {
  opacity: 1;
  bottom: -32px;
}

/* Exercise Info */
.exercise-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px;
  gap: 16px;
}

.exercise-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--primary-color);
}

.dashboard-dark .category-badge {
  background: rgba(139, 92, 246, 0.15);
}

.difficulty-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.difficulty-indicator.iniciante {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.dashboard-dark .difficulty-indicator.iniciante {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.difficulty-indicator.intermediario {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.dashboard-dark .difficulty-indicator.intermediario {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.difficulty-indicator.avancado {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.dashboard-dark .difficulty-indicator.avancado {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.difficulty-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.exercise-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.exercise-stats {
  padding: 16px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.stats-row {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: var(--bg-primary);
}

.stat-icon-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary-color);
}

.dashboard-dark .stat-icon-wrapper {
  background: rgba(139, 92, 246, 0.15);
}

.stat-icon-wrapper i {
  font-size: 1rem;
}

.stat-icon {
  width: 20px;
  height: 20px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.badges-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-item.full-width {
  grid-column: 1 / -1;
}

/* Muscle Groups Badges */
.muscle-group-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 15px;
  border: none;
  letter-spacing: 0.025em;
  text-transform: capitalize;
  transition: all 0.2s ease;
  box-shadow: none;
}

.dashboard-dark .muscle-group-badge {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.muscle-group-badge:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

.btn-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
}

.modern-overlay-btn:hover .btn-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.modern-overlay-btn:hover {
  background: #2563eb;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 12px 40px rgba(37, 99, 235, 0.6),
    0 8px 20px rgba(37, 99, 235, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.dashboard-dark .modern-overlay-btn:hover {
  background: #7c3aed;
  box-shadow: 
    0 12px 40px rgba(139, 92, 246, 0.6),
    0 8px 20px rgba(139, 92, 246, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.modern-overlay-btn:active {
  transform: translateY(-2px) scale(1.02);
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--primary-color);
}

.dashboard-dark .category-badge {
  background: rgba(139, 92, 246, 0.15);
}

.difficulty-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.difficulty-indicator.iniciante {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.dashboard-dark .difficulty-indicator.iniciante {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.difficulty-indicator.intermediario {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.dashboard-dark .difficulty-indicator.intermediario {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.difficulty-indicator.avancado {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.dashboard-dark .difficulty-indicator.avancado {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.difficulty-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.exercise-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.exercise-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  opacity: 0.9;
}

.muscle-groups-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.muscle-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 15px;
  border: none;
  letter-spacing: 0.025em;
  text-transform: capitalize;
  transition: all 0.2s ease;
  box-shadow: none;
}

.dashboard-dark .muscle-tag {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.muscle-tag:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

.stats-row {
  display: flex;
  gap: 24px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.2;
}

/* Action Buttons */
.exercise-actions {
  margin-top: auto;
  position: relative;
  z-index: 1;
  padding: 1rem 1.5rem;
  background: transparent;
  display: flex;
  gap: 12px;
}

.action-button {
  position: relative;
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
  letter-spacing: 0.01em;
}

.action-button svg {
  width: 18px;
  height: 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.button-text {
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-family: "Inter", sans-serif;
}

.button-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.action-button:hover .button-shine {
  transform: translateX(100%);
}

/* Primary Action - Gradient with Glow */
.primary-action {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 
    0 4px 20px rgba(37, 99, 235, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  position: relative;
}

.dashboard-dark .primary-action {
  box-shadow: 
    0 4px 20px rgba(139, 92, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.button-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.primary-action:hover .button-particles {
  opacity: 1;
  animation: particleFloat 3s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.button-arrow {
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: absolute;
  right: 20px;
}

.primary-action:hover .button-arrow {
  opacity: 1;
  transform: translateX(0);
}

.primary-action:hover .button-text {
  transform: translateX(-8px);
}

.primary-action:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 12px 35px rgba(37, 99, 235, 0.4),
    0 6px 20px rgba(37, 99, 235, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dashboard-dark .primary-action:hover {
  box-shadow: 
    0 12px 35px rgba(139, 92, 246, 0.5),
    0 6px 20px rgba(139, 92, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.primary-action:active {
  transform: translateY(-1px) scale(1.01);
}

/* Secondary Action - Glass Morphism */
.secondary-action {
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border: 1.5px solid var(--border-primary);
  color: var(--text-primary);
  box-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.secondary-action:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: var(--border-accent);
  background: var(--bg-tertiary);
  box-shadow: 
    0 8px 25px rgba(37, 99, 235, 0.15),
    0 4px 15px rgba(37, 99, 235, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.dashboard-dark .secondary-action:hover {
  box-shadow: 
    0 8px 25px rgba(139, 92, 246, 0.2),
    0 4px 15px rgba(139, 92, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.secondary-action:hover svg {
  transform: scale(1.15);
}

.secondary-action:active {
  transform: translateY(-1px) scale(1.01);
}

/* Delete Button Specific Styles */
.danger-action,
.exercise-actions .secondary-action {
  color: #ef4444;
}

.danger-action:hover,
.exercise-actions .secondary-action:hover {
  border-color: #ef4444;
  box-shadow: 
    0 8px 25px rgba(239, 68, 68, 0.2),
    0 4px 15px rgba(239, 68, 68, 0.15);
}

.dashboard-dark .danger-action,
.dashboard-dark .exercise-actions .secondary-action {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.25);
  color: #f87171;
}

.dashboard-dark .danger-action:hover,
.dashboard-dark .exercise-actions .secondary-action:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  color: #fca5a5;
}

.action-button:hover .button-shine {
  left: 100%;
}

/* Primary Action - Gradient with Glow */
.primary-action {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 
    0 4px 20px rgba(37, 99, 235, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  position: relative;
}

.dashboard-dark .primary-action {
  box-shadow: 
    0 4px 20px rgba(139, 92, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.button-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.primary-action:hover .button-particles {
  opacity: 1;
  animation: particleFloat 3s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.button-arrow {
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: absolute;
  right: 20px;
}

.primary-action:hover .button-arrow {
  opacity: 1;
  transform: translateX(0);
}

.primary-action:hover .button-text {
  transform: translateX(-8px);
}

.primary-action:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 12px 35px rgba(37, 99, 235, 0.4),
    0 6px 20px rgba(37, 99, 235, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dashboard-dark .primary-action:hover {
  box-shadow: 
    0 12px 35px rgba(139, 92, 246, 0.5),
    0 6px 20px rgba(139, 92, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* Danger Action - Red Delete Button */
.danger-action {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  box-shadow: 
    0 4px 20px rgba(220, 38, 38, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  flex: 1;
}

.dashboard-dark .danger-action {
  box-shadow: 
    0 4px 20px rgba(220, 38, 38, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.danger-action:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 12px 35px rgba(220, 38, 38, 0.4),
    0 6px 20px rgba(220, 38, 38, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dashboard-dark .danger-action:hover {
  box-shadow: 
    0 12px 35px rgba(220, 38, 38, 0.5),
    0 6px 20px rgba(220, 38, 38, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.danger-action:active {
  transform: translateY(-1px) scale(0.98);
}

.primary-action:active {
  transform: translateY(-1px) scale(1.01);
}

/* Secondary Action - Glass Morphism */
.secondary-action {
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border: 1.5px solid var(--border-primary);
  color: var(--text-primary);
  box-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.secondary-action:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: var(--border-accent);
  background: var(--bg-tertiary);
  box-shadow: 
    0 8px 25px rgba(37, 99, 235, 0.15),
    0 4px 15px rgba(37, 99, 235, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.dashboard-dark .secondary-action:hover {
  box-shadow: 
    0 8px 25px rgba(139, 92, 246, 0.2),
    0 4px 15px rgba(139, 92, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.secondary-action:hover svg {
  transform: scale(1.15);
}

.secondary-action:active {
  transform: translateY(-1px) scale(1.01);
}

/* Settings Button and Dropdown */
.exercise-menu-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1000;
}

.settings-button {
  width: auto;
  height: auto;
  border: none;
  background: transparent !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF !important;
  padding: 8px;
  box-shadow: none !important;
  outline: none !important;
  transition: color 0.2s ease;
  border-radius: 50%;
}

.settings-button:hover {
  color: #2563eb !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

.settings-button:focus,
.settings-button:active {
  background: transparent !important;
  color: #4a5568 !important;
  transform: none !important;
  box-shadow: none !important;
  outline: none !important;
}

.settings-button svg {
  transition: none !important;
  transform: none !important;
}

.dashboard-dark .settings-button {
  color: #64748b !important;
  background: transparent !important;
}

.dashboard-dark .settings-button:hover {
  color: #8b5cf6 !important;
  background: rgba(139, 92, 246, 0.1) !important;
}

.dashboard-dark .settings-button:focus,
.dashboard-dark .settings-button:active {
  color: #64748b !important;
  background: transparent !important;
  box-shadow: none !important;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 180px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
  z-index: 1000;
  overflow: hidden;
  margin-top: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--bg-accent);
  color: var(--primary-color);
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.divider {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}

.dropdown-enter-active {
  transition: all 0.2s ease;
}

.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  color: var(--text-secondary);
}

.empty-icon {
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-title {
  margin: 0 0 12px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-description {
  margin: 0 0 32px 0;
  font-size: 1rem;
  line-height: 1.6;
}

.create-first-button {
  padding: 16px 32px;
  border: none;
  border-radius: 16px;
  background: var(--gradient-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.create-first-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ====== RESPONSIVIDADE CLEAN FILTERS ====== */
@media (max-width: 768px) {
  .clean-categories-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .clean-category-card {
    padding: 16px 20px;
    gap: 12px;
  }
  
  .category-icon-clean {
    width: 40px;
    height: 40px;
  }
  
  .results-section-clean {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 16px 20px;
  }
  
  .results-info-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .results-actions-clean {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .clean-category-card {
    padding: 12px 16px;
    gap: 10px;
  }
  
  .category-title-clean {
    font-size: 15px;
  }
  
  .category-count-clean {
    font-size: 13px;
  }
  
  .results-actions-clean {
    flex-direction: column;
    gap: 8px;
  }
  
  .clear-filters-btn,
  .export-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Responsividade Geral */
@media (max-width: 1200px) {
  .dashboard-container {
    margin-left: 0;
  }
  
  .floating-header {
    left: 0;
  }
  
  .exercises-grid {
    grid-template-columns: 1fr;
    padding: 0;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 140px 20px 20px;
    gap: 24px;
  }
  
  .floating-header {
    padding: 16px 20px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .exercises-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .stats-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .exercise-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.75rem;
  }
}

/* ========== MODAL DE EDIÇÃO ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-container-large {
  background: var(--bg-tertiary);
  border-radius: 28px;
  width: 100%;
  max-width: 1200px;
  max-height: 92vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  animation: slideUp 0.3s ease;
  border: 1px solid var(--border-primary);
  scrollbar-width: thin;
  scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
}

.modal-container-large::-webkit-scrollbar {
  width: 8px;
}

.modal-container-large::-webkit-scrollbar-track {
  background: transparent;
}

.modal-container-large::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 4px;
}

.modal-container-large::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 48px;
  border-bottom: 1px solid var(--border-color);
  background: var(--header-gradient);
  position: relative;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.modal-icon svg {
  width: 28px;
  height: 28px;
}

.modal-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-subtitle {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 6px 0 0 0;
}

.modal-close {
  background: white;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-dark .modal-close {
  background: #334155;
}

.modal-close svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dashboard-dark .modal-close:hover {
  background: #475569;
}

.modal-close:hover svg {
  transform: scale(1.1);
}

.modal-body {
  padding: 48px;
  max-height: calc(92vh - 250px);
  overflow-y: auto;
  overflow-x: hidden;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-group {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.form-label svg {
  color: #6366f1;
  flex-shrink: 0;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  font-family: "Inter", sans-serif;
  color: var(--text-primary);
  background: var(--input-background);
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* ========== ÁREA DE UPLOAD MELHORADA ========== */
.upload-area-modern {
  position: relative;
  border: 3px dashed transparent;
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%);
  overflow: hidden;
  cursor: pointer;
  will-change: box-shadow;
}

/* Variante com borda tracejada visível */
.upload-area-modern.upload-dashed {
  border-color: var(--border-color);
}

.upload-area-modern.upload-dashed:hover {
  border-color: #6366f1;
}

.upload-area-modern.upload-dashed.drag-over {
  border-color: #6366f1;
}

/* Desabilita o ::before (borda gradiente) quando usar borda tracejada */
.upload-area-modern.upload-dashed::before {
  display: none;
}

.upload-gradient-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.05) 0%, 
    rgba(139, 92, 246, 0.05) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
  pointer-events: none;
}

.upload-grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
  pointer-events: none;
}

.upload-area-modern::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.2) 0%, 
    rgba(139, 92, 246, 0.2) 50%,
    rgba(236, 72, 153, 0.2) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  transition: all 0.4s ease;
  z-index: 2;
  pointer-events: none;
}

.upload-area-modern:hover::before {
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.5) 0%, 
    rgba(139, 92, 246, 0.5) 50%,
    rgba(236, 72, 153, 0.5) 100%
  );
}

.upload-area-modern:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  box-shadow: 
    0 10px 30px rgba(99, 102, 241, 0.12),
    0 5px 15px rgba(139, 92, 246, 0.08);
}

.upload-area-modern:hover .upload-gradient-bg,
.upload-area-modern:hover .upload-grid-pattern {
  opacity: 1;
}

.upload-area-modern.drag-over {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
  transform: scale(1.01);
  box-shadow: 
    0 15px 35px rgba(99, 102, 241, 0.18),
    0 8px 20px rgba(139, 92, 246, 0.12);
}

.upload-area-modern.drag-over::before {
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.7) 0%, 
    rgba(139, 92, 246, 0.7) 50%,
    rgba(236, 72, 153, 0.7) 100%
  );
}

.upload-area-modern.drag-over .upload-gradient-bg,
.upload-area-modern.drag-over .upload-grid-pattern {
  opacity: 1;
}

.upload-area-modern.drag-over .icon-circle-outer {
  transform: scale(1.05);
  box-shadow: 
    0 15px 35px rgba(99, 102, 241, 0.25),
    0 0 0 15px rgba(99, 102, 241, 0.08);
}

.upload-content-modern {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

/* Icon Container with Animations */
.upload-icon-container {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-circle-outer {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 30px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    0 10px 30px rgba(99, 102, 241, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.icon-circle-inner {
  width: 90px;
  height: 90px;
  border-radius: 22px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 24px rgba(99, 102, 241, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
}

.upload-area-modern:hover .icon-circle-inner {
  transform: rotate(3deg) scale(1.03);
  box-shadow: 
    0 10px 28px rgba(99, 102, 241, 0.45),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.upload-icon-svg {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.upload-area-modern:hover .upload-icon-svg {
  transform: scale(1.05);
}

/* Floating Particles */
.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.upload-area-modern:hover .particle {
  opacity: 0.4;
}

.particle-1 {
  top: 20%;
  right: 20%;
}

.particle-2 {
  bottom: 25%;
  left: 15%;
  width: 6px;
  height: 6px;
}

.particle-3 {
  top: 60%;
  right: 15%;
  width: 10px;
  height: 10px;
}

@keyframes floatUpDown {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.3;
  }
}

/* Text Content */
.upload-text-modern {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  max-width: 400px;
}

.upload-title-modern {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.title-gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.upload-subtitle-modern {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* Upload Button Modern */
.upload-button-modern {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 40px;
  background: transparent;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1;
}

.button-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  transition: all 0.4s ease;
  z-index: -1;
}

.upload-button-modern:hover .button-bg-gradient {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
}

.button-content-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
}

.button-shine-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  transition: left 0.6s ease;
  z-index: 3;
  pointer-events: none;
}

.upload-button-modern:hover .button-shine-effect {
  left: 100%;
}

.upload-button-modern:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 24px rgba(99, 102, 241, 0.3),
    0 4px 12px rgba(139, 92, 246, 0.2);
}

.upload-button-modern:active {
  transform: translateY(0);
}

/* Format Badges */
.upload-formats-modern {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.format-badge {
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6366f1;
  transition: all 0.3s ease;
}

.dashboard-dark .format-badge {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
  color: #818cf8;
}

.format-badge:hover {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-2px);
}

/* Upload Info Modern */
.upload-info-modern {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  padding: 16px 24px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 14px;
  transition: all 0.3s ease;
}

.dashboard-dark .upload-info-modern {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
  border-color: rgba(99, 102, 241, 0.2);
}

.upload-info-modern:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
  border-color: rgba(99, 102, 241, 0.25);
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 10px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.info-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.info-primary {
  color: var(--text-primary);
}

.info-primary strong,
.info-secondary strong {
  color: #6366f1;
  font-weight: 700;
}

.dashboard-dark .info-primary strong,
.dashboard-dark .info-secondary strong {
  color: #818cf8;
}

.info-divider {
  color: var(--border-color);
  opacity: 0.5;
}

/* Old Upload Styles - Keep for backward compatibility */
.upload-area {
  border: 3px dashed var(--border-color);
  border-radius: 20px;
  padding: 50px 32px;
  text-align: center;
  transition: all 0.3s ease;
  background: var(--upload-background);
  position: relative;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #6366f1;
  background: var(--upload-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.1);
}

.upload-area.drag-over {
  border-color: #6366f1;
  background: var(--upload-hover);
  transform: scale(1.02);
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.15);
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.upload-icon-large {
  width: 100px;
  height: 100px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.1);
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.upload-title-large {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.upload-subtitle-large {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  margin-top: 8px;
}

.upload-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.upload-button svg {
  width: 20px;
  height: 20px;
}

.upload-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 14px 20px;
  background: var(--info-background);
  border-radius: 12px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.upload-info svg {
  flex-shrink: 0;
  color: #6366f1;
  width: 16px;
  height: 16px;
}

/* Image Preview Container - Melhorado */
.image-preview-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 3px dashed var(--border-color);
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease;
}

.image-preview-container:hover {
  border-color: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
}

.image-preview {
  width: 100%;
  height: 300px;
  object-fit: contain;
  display: block;
  transition: transform 0.3s ease;
  background: var(--bg-secondary);
}

.image-preview-container:hover .image-preview {
  transform: scale(1.02);
}

.remove-image-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 12px rgba(239, 68, 68, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
  opacity: 0.95;
}

.remove-image-btn svg {
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.remove-image-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: scale(1.1);
  box-shadow: 
    0 6px 20px rgba(239, 68, 68, 0.6),
    0 3px 10px rgba(0, 0, 0, 0.3);
  opacity: 1;
}

.remove-image-btn:active {
  transform: scale(1.05) rotate(90deg);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ========================================
   MODAL DE DETALHES DO EXERCÍCIO - MODERN REDESIGN
   ======================================== */

/* Estilos do Modal de Visualização (igual ao machines.vue) */
.modal-container-large {
  background: var(--bg-tertiary);
  border-radius: 24px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-primary);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 48px;
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  border-radius: 24px 24px 0 0;
  flex-shrink: 0;
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-container-large .modal-icon {
  font-size: 2rem;
  color: var(--primary-color);
  width: auto;
  height: auto;
  border-radius: 0;
  background: none;
  box-shadow: none;
  display: inline;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: white;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-dark .modal-close {
  background: #334155;
}

.modal-close svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dashboard-dark .modal-close:hover {
  background: #475569;
}

.modal-close:hover svg {
  transform: scale(1.1);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 48px;
  scrollbar-width: thin;
  scrollbar-color: var(--primary-color) var(--bg-secondary);
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
}

/* Estilos para Modal de Visualização */
.detail-image-container {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 12px;
  background: var(--bg-secondary);
  margin-bottom: 32px;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Tags de Categoria e Dificuldade (estilo da versão anterior) */
.details-tags {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.details-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.details-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.details-tag:hover::before {
  left: 100%;
}

.category-tag {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dashboard-dark .category-tag {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
}

.category-tag:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.difficulty-tag {
  backdrop-filter: blur(10px);
}

.difficulty-tag.iniciante,
.difficulty-tag.Iniciante {
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.difficulty-tag.intermediário,
.difficulty-tag.Intermediário,
.difficulty-tag.intermediario {
  color: #f59e0b;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.difficulty-tag.avançado,
.difficulty-tag.Avançado,
.difficulty-tag.avancado {
  color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.difficulty-tag:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.difficulty-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.detail-section {
  margin-bottom: 32px;
  animation: fadeInUp 0.6s ease both;
}

.detail-section:nth-child(1) { animation-delay: 0.1s; }
.detail-section:nth-child(2) { animation-delay: 0.2s; }
.detail-section:nth-child(3) { animation-delay: 0.3s; }
.detail-section:nth-child(4) { animation-delay: 0.4s; }
.detail-section:nth-child(5) { animation-delay: 0.5s; }

/* Specific animation delays for each section */
.description-section {
  animation-delay: 0.2s !important;
}

.howto-section {
  animation-delay: 0.3s !important;
}

.safety-section {
  animation-delay: 0.4s !important;
}

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

.detail-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-section-title i {
  color: var(--primary-color);
  font-size: 1.25rem;
}

/* Estilo especial para seção de Dicas de Segurança (versão anterior) */
.warning-section .detail-section-title {
  color: #f59e0b;
}

.warning-section .detail-section-title i {
  color: #f59e0b;
}

.warning-text {
  border-left-color: #f59e0b !important;
  background: rgba(245, 158, 11, 0.08) !important;
  border-color: rgba(245, 158, 11, 0.2) !important;
}

.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.detail-info-item {
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border-primary);
  transition: all 0.2s ease;
}

.detail-info-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: block;
}

.detail-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Tags dentro do detail-info-item */
.detail-info-item .details-tag {
  display: inline-flex;
  margin-top: 0;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 24px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.detail-text {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--border-primary);
}

.muscle-tag-large {
  display: inline-block;
  padding: 10px 16px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 4px;
  transition: all 0.2s ease;
}

.muscle-tag-large:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
}

/* Video Link */
.video-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  text-decoration: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
  position: relative;
  overflow: hidden;
}

.video-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-link:hover::before {
  opacity: 1;
}

.video-link:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.video-link svg {
  transition: transform 0.3s ease;
}

.video-link:hover svg {
  transform: translateX(4px);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 48px;
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  border-radius: 0 0 24px 24px;
  flex-shrink: 0;
}

.btn-cancel,
.btn-save {
  flex: 1;
  max-width: 280px;
  min-height: 56px;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-cancel {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
}

.btn-cancel:hover {
  background: var(--bg-secondary);
  border-color: var(--error);
  color: var(--error);
}

.btn-save {
  background: var(--primary-color);
  color: white;
}

.btn-save:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.btn-cancel svg,
.btn-save svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .modal-container-large {
    max-width: 100%;
    margin: 20px;
  }
  
  .modal-header,
  .modal-body,
  .modal-actions {
    padding: 24px;
  }
  
  .detail-info-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-save {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
  
  .modal-header,
  .modal-body {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-save {
    width: 100%;
    max-width: 100%;
  }
  
  /* Upload Modern Responsivo */
  .upload-area-modern {
    padding: 40px 24px;
  }
  
  .upload-icon-container {
    width: 110px;
    height: 110px;
  }
  
  .icon-circle-outer {
    width: 100px;
    height: 100px;
  }
  
  .icon-circle-inner {
    width: 75px;
    height: 75px;
  }
  
  .upload-icon-svg {
    width: 32px;
    height: 32px;
  }
  
  .upload-title-modern {
    font-size: 1.25rem;
  }
  
  .upload-subtitle-modern {
    font-size: 0.9rem;
  }
  
  .upload-button-modern {
    padding: 14px 32px;
    font-size: 0.9375rem;
  }
  
  .upload-info {
    flex-direction: column;
    text-align: center;
    padding: 14px 20px;
  }
  
  .image-preview {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .upload-area {
    padding: 32px 20px;
  }
  
  .upload-content {
    gap: 20px;
  }
  
  .upload-icon-large {
    width: 70px;
    height: 70px;
  }
  
  .upload-icon-large svg {
    width: 36px;
    height: 36px;
  }
  
  .upload-title-large {
    font-size: 1rem;
  }
  
  .upload-subtitle-large {
    font-size: 0.875rem;
  }
  
  .upload-button {
    padding: 12px 24px;
    font-size: 0.875rem;
    width: 100%;
  }
  
  .upload-info {
    padding: 10px 14px;
    font-size: 0.75rem;
  }
  
  .image-preview {
    height: 200px;
  }
  
  .remove-image-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
  }
}
</style>
