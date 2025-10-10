<template>
  <div :class="isDarkMode ? 'dark' : 'light'" class="gym-home">
    <DashboardNavBar />
    <div class="dashboard-container">
      <div class="content-wrapper">
        <!-- Stats Section -->
        <section class="stats-section" v-if="!showForm">
          <div class="stats-grid">
            <div class="stat-card stat-total">
              <div class="stat-icon">
                <i class="fas fa-building"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ gyms.length }}</h3>
                <p class="stat-label">Total de Academias</p>
              </div>
            </div>

            <div class="stat-card stat-students">
              <div class="stat-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ totalStudents }}</h3>
                <p class="stat-label">Alunos Cadastrados</p>
                <div class="stat-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: '75%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="stat-card stat-equipments">
              <div class="stat-icon">
                <i class="fas fa-dumbbell"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ totalEquipments }}</h3>
                <p class="stat-label">Equipamentos</p>
                <div class="stat-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: '60%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="stat-card stat-active">
              <div class="stat-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ gyms.length }}</h3>
                <p class="stat-label">Academias Ativas</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Actions Section -->
        <section class="actions-section" v-if="!showForm">
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
        <GymForm
          v-if="showForm"
          :gym="selectedGym"
          :show="showForm"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />

        <!-- Gyms Grid Section -->
        <section v-if="!showForm" class="gyms-section">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Carregando academias...</p>
          </div>

          <!-- Gyms Grid -->
          <div v-else-if="filteredGyms.length > 0" class="gyms-grid">
            <div 
              v-for="gym in filteredGyms" 
              :key="gym._id" 
              class="gym-card"
            >
              <div class="card-glow"></div>
              
              <!-- Gym Header -->
              <div class="gym-header">
                <div class="gym-image">
                  <div v-if="!gym.image" class="image-placeholder">
                    <div class="placeholder-icon">
                      <svg width="48" height="48" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                  <div v-else class="image-container">
                    <img :src="getGymImageUrl(gym.image)" :alt="gym.name" />
                  </div>
                  <div class="image-gradient"></div>
                </div>
                
                <div class="image-overlay">
                  <div class="overlay-actions">
                    <button class="modern-overlay-btn preview-btn" @click="handleEdit(gym)" title="Visualizar">
                      <div class="btn-glow-effect"></div>
                      <div class="btn-icon-wrapper">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <span class="btn-tooltip">Visualizar</span>
                    </button>
                    <button class="modern-overlay-btn edit-btn" @click="handleEdit(gym)" title="Editar">
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
              
              <div class="gym-menu-wrapper" :ref="`dropdownRef-${gym._id}`">
                <button 
                  class="settings-button" 
                  @click="toggleGymMenu(gym._id)"
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
                  <div v-if="gym.showMenu" class="dropdown-menu">
                    <a href="#" class="dropdown-item" @click.prevent="handleEdit(gym)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Ver detalhes
                    </a>
                    
                    <a href="#" class="dropdown-item" @click.prevent="handleEdit(gym)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                      </svg>
                      Editar
                    </a>
                    
                    <div class="divider"></div>
                    
                    <a href="#" class="dropdown-item logout" @click.prevent="confirmDelete(gym._id)">
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

              <!-- Gym Info -->
              <div class="gym-info">
                <div class="gym-meta">
                  <div class="location-badge" v-if="gym.location">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                    </svg>
                    {{ gym.location.city }}, {{ gym.location.state }}
                  </div>
                  <div class="status-indicator active">
                    <div class="status-dot"></div>
                    Ativa
                  </div>
                </div>
                
                <h3 class="gym-name">{{ gym.name }}</h3>
                <p class="gym-address" v-if="gym.location">{{ gym.location.address }}</p>
              </div>

              <!-- Gym Stats -->
              <div class="gym-stats">
                <div class="stats-row">
                  <div class="stat-item">
                    <div class="stat-icon-wrapper">
                      <svg class="stat-icon" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                    </div>
                    <div class="stat-content">
                      <span class="stat-label">Alunos</span>
                      <span class="stat-value">{{ gym.students?.length || 0 }}</span>
                    </div>
                  </div>
                  
                  <div class="stat-item">
                    <div class="stat-icon-wrapper">
                      <svg class="stat-icon" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div class="stat-content">
                      <span class="stat-label">Equipamentos</span>
                      <span class="stat-value">{{ gym.equipments?.length || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Gym Actions -->
              <div class="gym-actions">
                <button class="action-button secondary-action" @click="handleEdit(gym)">
                  <div class="button-shine"></div>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="button-text">Ver Detalhes</span>
                </button>
                <button class="action-button primary-action" @click="handleEdit(gym)">
                  <div class="button-shine"></div>
                  <div class="button-particles"></div>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span class="button-text">Gerenciar</span>
                  <div class="button-arrow">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <div class="empty-icon">
              <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="empty-title">Nenhuma academia encontrada</h3>
            <p class="empty-description">Não encontramos academias com os filtros aplicados.</p>
            <button class="create-first-button" @click="showForm = true">
              Cadastrar Primeira Academia
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>

    <!-- Notification Modal -->
    <NotificationModal
      v-model:visible="notification.visible"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
    />
</template>

<script>
import { ref, computed } from 'vue';
import NotificationModal from '@/components/NotificationModal.vue';
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import { getAllGyms, createGym, updateGym, deleteGym } from '@/api';
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import GymForm from '@/components/GymForm.vue';

export default {
  name: 'GymHome',
  components: {
    NotificationModal,
    GymForm,
    DashboardNavBar,
  },
  setup() {
    const notification = ref({ visible: false, type: 'info', title: '', message: '' });
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    
    // Dados mockados de academias para teste
    const gyms = ref([
      {
        _id: '1',
        name: 'Smart Fit Paulista',
        location: {
          address: 'Av. Paulista, 1000',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100'
        },
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
        students: [1, 2, 3, 4, 5],
        equipments: [1, 2, 3, 4, 5, 6, 7, 8],
        showMenu: false
      },
      {
        _id: '2',
        name: 'Bio Ritmo Moema',
        location: {
          address: 'Rua dos Açores, 234',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '04032-060'
        },
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
        students: [1, 2, 3, 4, 5, 6, 7],
        equipments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        showMenu: false
      },
      {
        _id: '3',
        name: 'Bodytech Itaim',
        location: {
          address: 'Av. Brigadeiro Faria Lima, 1500',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01452-001'
        },
        image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop',
        students: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        equipments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        showMenu: false
      },
      {
        _id: '4',
        name: 'Competition Centro',
        location: {
          address: 'Rua da Consolação, 456',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01302-000'
        },
        image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop',
        students: [1, 2, 3, 4],
        equipments: [1, 2, 3, 4, 5, 6],
        showMenu: false
      },
      {
        _id: '5',
        name: 'Formula Academia',
        location: {
          address: 'Av. Ibirapuera, 890',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '04029-200'
        },
        image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&h=600&fit=crop',
        students: [1, 2, 3, 4, 5, 6],
        equipments: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        showMenu: false
      },
      {
        _id: '6',
        name: 'Runner Vila Mariana',
        location: {
          address: 'Rua Domingos de Morais, 1200',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '04010-100'
        },
        image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop',
        students: [1, 2, 3, 4, 5, 6, 7, 8],
        equipments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        showMenu: false
      }
    ]);
    
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
        (gym.location?.city && gym.location.city.toLowerCase().includes(query)) ||
        (gym.location?.state && gym.location.state.toLowerCase().includes(query))
      );
    });

    const showNotification = (type, title, message) => {
      notification.value = {
        visible: true,
        type: type,
        title: title,
        message: message
      };
    };

    return {
      isDarkMode,
      notification,
      showNotification,
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
    getGymImageUrl(imagePath) {
      if (!imagePath) return null;
      // Se já é uma URL completa, retorna como está
      if (imagePath.startsWith('http')) return imagePath;
      // Se é um caminho relativo, adiciona a URL base
      return `http://localhost:3000${imagePath}`;
    },
    openCreateModal() {
      this.selectedGym = null;
      this.showForm = true;
    },
    async fetchGyms() {
      this.loading = true;
      try {
        const response = await getAllGyms();
        
        // Se houver academias da API, usa elas, senão mantém os mockados
        if (response.data && response.data.length > 0) {
          this.gyms = response.data.map(gym => ({
            ...gym,
            showMenu: false
          }));
        }
        // Se não houver academias da API, mantém os dados mockados do setup
      } catch (error) {
        console.error('Error fetching gyms:', error);
        // Em caso de erro, mantém os dados mockados
      } finally {
        this.loading = false;
      }
    },
    toggleGymMenu(gymId) {
      this.gyms = this.gyms.map(gym => ({
        ...gym,
        showMenu: gym._id === gymId ? !gym.showMenu : false
      }));
    },
    handleClickOutside(event) {
      const isClickInsideAnyDropdown = this.gyms.some(gym => {
        const dropdownRef = this.$refs[`dropdownRef-${gym._id}`];
        if (!dropdownRef) return false;
        
        const element = Array.isArray(dropdownRef) ? dropdownRef[0] : dropdownRef;
        return element && element.contains && element.contains(event.target);
      });
      
      if (!isClickInsideAnyDropdown) {
        this.gyms = this.gyms.map(gym => ({
          ...gym,
          showMenu: false
        }));
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
          this.showNotification('success', 'Sucesso', '✅ Academia atualizada com sucesso!');
        } else {
          await createGym(formData);
          this.showNotification('success', 'Sucesso', '✅ Academia cadastrada com sucesso!');
        }
        
        await this.fetchGyms();
        this.handleCancel();
      } catch (error) {
        console.error('Error saving gym:', error);
        this.showNotification('error', 'Erro', `${error.response?.data?.message || error.message || 'Erro ao salvar academia'}`);
      }
    },
    handleEdit(gym) {
      // Fecha todos os dropdowns
      this.gyms = this.gyms.map(g => ({
        ...g,
        showMenu: false
      }));
      
      this.selectedGym = gym;
      this.showForm = true;
    },
    confirmDelete(gymId) {
      // Fecha todos os dropdowns
      this.gyms = this.gyms.map(gym => ({
        ...gym,
        showMenu: false
      }));
      
      if (confirm('⚠️ Tem certeza que deseja excluir esta academia? Esta ação não pode ser desfeita.')) {
        this.handleDelete(gymId);
      }
    },
    async handleDelete(gymId) {
      try {
        await deleteGym(gymId);
        this.showNotification('success', 'Sucesso', '✅ Academia excluída com sucesso!');
        await this.fetchGyms();
      } catch (error) {
        console.error('Error deleting gym:', error);
        this.showNotification('info', 'Informacao', '❌ Erro ao excluir academia. Tente novamente.');
      }
    },
    handleCancel() {
      this.selectedGym = null;
      this.showForm = false;
    },
  },
  mounted() {
    this.fetchGyms();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
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

/* Stats Section - Cards superiores */
.stats-section {
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stats-grid .stat-card {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stats-grid .stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.dark .stats-grid .stat-card:hover {
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
}

.stats-grid .stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.stats-grid .stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.stats-grid .stat-total .stat-icon { 
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stats-grid .stat-students .stat-icon { 
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stats-grid .stat-equipments .stat-icon { 
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stats-grid .stat-active .stat-icon { 
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.dark .stats-grid .stat-total .stat-icon { 
  background: linear-gradient(135deg, #667eea 0%, #5a67d8 100%);
}

.dark .stats-grid .stat-students .stat-icon { 
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.dark .stats-grid .stat-equipments .stat-icon { 
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.dark .stats-grid .stat-active .stat-icon { 
  background: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
}

.stats-grid .stat-content {
  flex: 1;
}

.stats-grid .stat-value {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.stats-grid .stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.stats-grid .stat-progress {
  margin-top: 0.5rem;
}

.stats-grid .progress-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.stats-grid .progress-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 3px;
  transition: width 0.5s ease;
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

/* ====== GYMS GRID ====== */
.gyms-section {
  margin-bottom: 2rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.gyms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
  padding: 0.5rem;
}

.gym-card {
  position: relative;
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out;
  display: flex;
  flex-direction: column;
  max-width: 448px;
  height: 618px;
}

.gym-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-color);
}

.dark .gym-card:hover {
  background: rgba(42, 42, 42, 0.9);
  box-shadow: 0 35px 60px -12px rgba(139, 92, 246, 0.3);
}

.card-glow {
  position: absolute;
  inset: -2px;
  background: var(--primary-gradient);
  border-radius: 24px;
  opacity: 0;
  z-index: -1;
  filter: blur(20px);
  transition: opacity 0.4s ease;
}

.gym-card:hover .card-glow {
  opacity: 0.5;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

.gym-header {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.gym-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.gym-card:hover .image-container img {
  transform: scale(1.1);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--surface-color) 0%, var(--background-color) 100%);
  position: relative;
  overflow: hidden;
}

.image-placeholder::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  animation: shimmer 3s infinite;
}

.placeholder-icon {
  position: relative;
  z-index: 1;
  color: var(--text-secondary);
  opacity: 0.5;
}

.gym-card:hover .placeholder-icon {
  opacity: 0.7;
  transform: scale(1.1);
}

.image-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.dark .image-gradient {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.5) 70%,
    rgba(0, 0, 0, 0.9) 100%
  );
}

.gym-card:hover .image-gradient {
  opacity: 1;
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

.gym-card:hover .image-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 12px;
  transform: translateY(20px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
}

.gym-card:hover .overlay-actions {
  transform: translateY(0);
}

.modern-overlay-btn {
  position: relative;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
}

.modern-overlay-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-overlay-btn:hover::before {
  opacity: 1;
}

.btn-glow-effect {
  position: absolute;
  inset: -2px;
  background: var(--primary-gradient);
  border-radius: 12px;
  opacity: 0;
  filter: blur(8px);
  transition: opacity 0.3s ease;
}

.modern-overlay-btn:hover .btn-glow-effect {
  opacity: 0.6;
}

.btn-icon-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-overlay-btn:hover .btn-icon-wrapper {
  transform: scale(1.1);
}

.modern-overlay-btn:active .btn-icon-wrapper {
  transform: scale(0.95);
}

.btn-tooltip {
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.btn-tooltip::after {
  content: "";
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-bottom-color: rgba(0, 0, 0, 0.9);
}

.modern-overlay-btn:hover .btn-tooltip {
  opacity: 1;
  bottom: -36px;
  transition: all 0.3s ease 0.5s;
}

.modern-overlay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.modern-overlay-btn:active {
  transform: translateY(0);
}

.preview-btn:hover {
  background: rgba(59, 130, 246, 0.2);
}

.preview-btn:hover .btn-glow-effect {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
}

.edit-btn:hover {
  background: rgba(139, 92, 246, 0.2);
}

.edit-btn:hover .btn-glow-effect {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.gym-menu-wrapper {
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
  padding: 6px;
  box-shadow: none !important;
  outline: none !important;
  transition: color 0.2s ease;
}

.settings-button:hover {
  color: #2563eb !important;
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

.dark .settings-button {
  color: #64748b !important;
  background: transparent !important;
}

.dark .settings-button:hover {
  color: #8b5cf6 !important;
}

.dark .settings-button:focus,
.dark .settings-button:active {
  color: #64748b !important;
  background: transparent !important;
  box-shadow: none !important;
}

.dropdown-menu {
  position: absolute;
  top: 48px;
  right: 0;
  width: 14rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  padding: 0.25rem 0;
  z-index: 1001;
}

.dark .dropdown-menu {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.15s;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.dark .dropdown-item {
  color: #f8fafc;
}

.dropdown-item:hover {
  background-color: #f9fafb;
}

.dark .dropdown-item:hover {
  background-color: rgba(139, 92, 246, 0.1);
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background-color: #fef2f2;
}

.dark .dropdown-item.logout:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.divider {
  border-top: 1px solid #e5e7eb;
  margin: 0.25rem 0;
}

.dark .divider {
  border-top-color: rgba(255, 255, 255, 0.1);
}

/* Animações Vue Transition */
.dropdown-enter-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.dropdown-leave-active {
  transition: opacity 0.15s ease-in, transform 0.15s ease-in;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.gym-info {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.gym-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.location-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--surface-color);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.dark .location-badge {
  background: rgba(139, 92, 246, 0.1);
  color: #c084fc;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #22c55e;
}

.status-indicator.active {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.gym-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 8px;
  line-height: 1.3;
}

.gym-address {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gym-stats {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--surface-color);
}

.stats-row {
  display: flex;
  gap: 1rem;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 10px;
  background: var(--card-background);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: var(--background-color);
  transform: translateY(-2px);
}

.stat-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.stat-icon {
  width: 24px;
  height: 24px;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-color);
}

.gym-actions {
  padding: 1rem 1.5rem;
  display: flex;
  gap: 12px;
  border-top: 1px solid var(--border-color);
}

.action-button {
  position: relative;
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-button svg {
  flex-shrink: 0;
}

.button-text {
  white-space: nowrap;
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
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  border: 1px solid transparent;
}

.dark .primary-action {
  background: var(--primary-gradient);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.button-particles {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0;
  animation: particleFloat 3s ease-in-out infinite;
}

.primary-action:hover .button-particles {
  opacity: 0.5;
  animation: particleFloat 2s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.button-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.primary-action:hover .button-arrow {
  opacity: 1;
  transform: translateX(0);
}

.primary-action:hover .button-text {
  transform: translateX(-4px);
}

.primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.dark .primary-action:hover {
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.5);
}

.primary-action:active {
  transform: translateY(0);
}

/* Secondary Action - Glass Morphism */
.secondary-action {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  backdrop-filter: blur(10px);
}

.secondary-action:hover {
  background: var(--surface-color);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .secondary-action:hover {
  background: rgba(42, 42, 42, 0.9);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.secondary-action:hover svg {
  color: var(--primary-color);
}

.secondary-action:active {
  transform: translateY(0);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  color: var(--text-secondary);
  opacity: 0.5;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.empty-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.create-first-button {
  padding: 12px 24px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-first-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

@keyframes shimmer {
  to { transform: translate(50%, 50%); }
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

