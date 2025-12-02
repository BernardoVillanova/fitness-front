<template>
  <NotificationModal 
    v-model:visible="notification.visible"
    :type="notification.type"
    :title="notification.title"
    :message="notification.message"
  />
  
  <ConfirmationModal
    :show="showConfirmation"
    :title="confirmationConfig.title"
    :message="confirmationConfig.message"
    :icon-type="confirmationConfig.iconType"
    :confirm-text="confirmationConfig.confirmText"
    :cancel-text="confirmationConfig.cancelText"
    :button-class="confirmationConfig.buttonClass"
    @confirm="confirmationConfig.onConfirm"
    @close="showConfirmation = false"
  />
  
  <div :class="isDarkMode ? 'dashboard-dark' : 'dashboard-light'" class="dashboard-container">
    <DashboardNavBar />
    <main class="dashboard-main">
      <!-- Floating Header -->
      <header class="floating-header">
        <div class="header-content">
          <div class="header-left">
            <div class="title-section">
              <h1 class="main-title">
                <span class="title-gradient">Aparelhos</span>
              </h1>
              <p class="subtitle">Gerencie todos os aparelhos e equipamentos da sua academia</p>
            </div>
          </div>
          <div class="header-right">
            <button class="create-button" @click="openCreateMachineModal">
              <div class="button-glow"></div>
              <div class="button-content">
                <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Novo Aparelho
              </div>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="dashboard-content">
        <!-- Stats Section -->
        <section class="stats-section">
          <div class="stats-grid">
            <div class="stat-card stat-primary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-main">
                  <div class="stat-icon">
                    <Dumbbell :size="32" :stroke-width="2" />
                  </div>
                  <div class="stat-body">
                    <span class="stat-number">{{ machinesStats.total }}</span>
                    <span class="stat-label">Total de Aparelhos</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="stat-card stat-secondary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-main">
                  <div class="stat-icon">
                    <Grid3x3 :size="32" :stroke-width="2" />
                  </div>
                  <div class="stat-body">
                    <span class="stat-number">{{ machinesStats.categories }}</span>
                    <span class="stat-label">Categorias</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="stat-card stat-tertiary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-main">
                  <div class="stat-icon">
                    <CheckCircle2 :size="32" :stroke-width="2" />
                  </div>
                  <div class="stat-body">
                    <span class="stat-number">{{ machinesStats.available }}</span>
                    <span class="stat-label">Disponíveis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Filter Section -->
        <CategoryFilter
          :categories="categories"
          :selected-category="selectedCategory"
          :filtered-count="filteredMachines.length"
          item-label="aparelhos"
          @category-selected="filterByCategory"
          @clear-filters="clearFilters"
        />

        <!-- Machines Grid -->
        <section class="exercises-section">
          <div class="exercises-grid" v-if="displayedMachines.length > 0">
            <div 
              v-for="machine in displayedMachines" 
              :key="machine._id"
              class="exercise-card"
            >
              <div class="card-glow"></div>
              
              <!-- Image Section -->
              <div class="exercise-header">
                <div class="exercise-image">
                  <div class="image-container" v-if="machine.image">
                    <img :src="getImageUrl(machine.image)" :alt="machine.name">
                    <div class="image-gradient"></div>
                  </div>
                  <div class="image-placeholder" v-else>
                    <div class="placeholder-icon">
                      <i class="fas fa-cogs"></i>
                    </div>
                    <span class="placeholder-text">Sem imagem</span>
                  </div>
                </div>
              </div>

              <!-- Settings Menu -->
              <div class="machine-menu-wrapper" :ref="`dropdownRef-${machine._id}`">
                <button 
                  class="settings-button" 
                  @click="toggleMachineMenu(machine._id)"
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
                  <div v-if="machine.showMenu" class="dropdown-menu">
                    <a href="#" class="dropdown-item" @click.prevent="previewMachine(machine)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Ver detalhes
                    </a>
                    
                    <a href="#" class="dropdown-item" @click.prevent="editMachine(machine)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
                      </svg>
                      Editar
                    </a>
                    
                    <div class="divider"></div>
                    
                    <a href="#" class="dropdown-item logout" @click.prevent="deleteMachine(machine)">
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

              <!-- Machine Info -->
              <div class="exercise-info">
                <div class="exercise-meta">
                  <span class="category-badge">
                    <i :class="getCategoryIcon(machine.category)"></i>
                    {{ getCategoryName(machine.category) }}
                  </span>
                  <span :class="['difficulty-indicator', machine.difficulty]">
                    <span class="difficulty-dot"></span>
                    {{ getDifficultyLabel(machine.difficulty) }}
                  </span>
                </div>

                <h3 class="exercise-name">{{ machine.name }}</h3>
                <p class="exercise-description">{{ truncate(machine.description || machine.howToUse || 'Sem descrições', 150) }}</p>

                <!-- Machine Details -->
                <div class="exercise-stats" v-if="machine.muscleGroups && machine.muscleGroups.length > 0">
                  <div class="stats-row">
                    <div class="stat-item full-width">
                      <div class="stat-icon-wrapper">
                        <i class="fas fa-bullseye"></i>
                      </div>
                      <div class="stat-content">
                        <span class="stat-label">Grupos Musculares</span>
                        <div class="badges-wrapper">
                          <span 
                            v-for="group in machine.muscleGroups" 
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
                  <button class="action-button secondary-action" @click="deleteMachine(machine)">
                    <div class="button-shine"></div>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span class="button-text">Excluir</span>
                  </button>
                  <button class="action-button primary-action" @click="viewMachineDetails(machine)">
                    <div class="button-particles"></div>
                    <div class="button-shine"></div>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <span class="button-text">Ver Detalhes</span>
                    <div class="button-arrow">→</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" v-else>
            <div class="empty-icon">
              <i class="fas fa-cogs"></i>
            </div>
            <h3 class="empty-title">Nenhum aparelho encontrado</h3>
            <p class="empty-description">
              {{ selectedCategory ? 'Não há aparelhos nesta categoria.' : 'Comece adicionando seu primeiro aparelho de academia.' }}
            </p>
            <button class="create-first-button" @click="openCreateMachineModal" v-if="!selectedCategory">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Adicionar Primeiro Aparelho
            </button>
          </div>
        </section>
      </div>
    </main>

    <!-- Equipment Modal -->
    <EquipmentModal 
      v-if="showEquipmentModal"
      :instructor-id="instructorId"
      :equipment-list="machines"
      @close="closeEquipmentModal" 
      @equipment-added="handleEquipmentAdded"
      @equipment-removed="handleEquipmentAdded"
    />

    <!-- Modal de Visualização -->
    <div class="modal-overlay" v-if="showDetailModal && selectedMachine" @click="closeDetailModal" :class="[isDarkMode ? 'dashboard-dark' : 'dashboard-light']">
      <div class="modal-container-large" @click.stop>
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="modal-icon">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 640 512">
                <path d="M96 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V224v64V448c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V384H64c-17.7 0-32-14.3-32-32V288c-17.7 0-32-14.3-32-32s14.3-32 32-32V160c0-17.7 14.3-32 32-32H96V64zm448 0v64h32c17.7 0 32 14.3 32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32v64c0 17.7-14.3 32-32 32H544v64c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32V288 224 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32zM416 224v64H224V224H416z"/>
              </svg>
            </div>
            <div class="header-text-section">
              <h2>{{ selectedMachine.name }}</h2>
              <p class="modal-subtitle">Visualização completa do aparelho com todos os detalhes</p>
            </div>
          </div>
          <button class="modal-close" @click="closeDetailModal">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="equipment-form">
            <div class="form-grid">
              <!-- Coluna Esquerda -->
              <div class="form-column">
                <!-- Nome do Aparelho -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Nome do Aparelho
                  </label>
                  <div class="view-value">{{ selectedMachine.name }}</div>
                </div>

                <!-- Categoria -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Categoria
                  </label>
                  <div class="view-value">{{ getCategoryName(selectedMachine.category) }}</div>
                </div>

                <!-- Nível de Dificuldade -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Nível de Dificuldade
                  </label>
                  <div class="view-value">
                    <span :class="['details-tag', 'difficulty-tag', selectedMachine.difficulty]">
                      <span class="difficulty-dot"></span>
                      {{ getDifficultyLabel(selectedMachine.difficulty) }}
                    </span>
                  </div>
                </div>

                <!-- Descrição -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Descrição
                  </label>
                  <div class="view-textarea">{{ selectedMachine.description || 'Não informado' }}</div>
                </div>

                <!-- Como Usar -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    Instruções de Uso
                  </label>
                  <div class="view-textarea">{{ selectedMachine.howToUse || 'Não informado' }}</div>
                </div>

                <!-- Dicas de Segurança -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    Dicas de Segurança
                  </label>
                  <div class="view-textarea">{{ selectedMachine.safetyTips || 'Não informado' }}</div>
                </div>
              </div>

              <!-- Coluna Direita -->
              <div class="form-column">
                <!-- Imagem do Aparelho -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Foto do Aparelho
                  </label>
                  <div class="image-preview-view" v-if="selectedMachine.image">
                    <img :src="getImageUrl(selectedMachine.image)" :alt="selectedMachine.name" />
                  </div>
                  <div v-else class="no-image-placeholder">
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p>Sem imagem</p>
                  </div>
                </div>

                <!-- Grupos Musculares -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Grupos Musculares Trabalhados
                  </label>
                  <div class="muscle-groups-grid" v-if="selectedMachine.muscleGroups && selectedMachine.muscleGroups.length > 0">
                    <span v-for="group in selectedMachine.muscleGroups" :key="group" class="muscle-badge">
                      {{ getMuscleGroupLabel(group) }}
                    </span>
                  </div>
                  <div v-else class="view-value" style="color: var(--text-secondary); font-style: italic;">
                    Nenhum grupo muscular especificado
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeDetailModal">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Fechar
          </button>
          <button class="btn-save" @click="openEditModal(selectedMachine)">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Editar Aparelho
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Edição -->
    <div class="modal-overlay" v-if="showEditModal && editingMachine" @click="closeEditModal" :class="[isDarkMode ? 'dashboard-dark' : 'dashboard-light']">
      <div class="modal-container-large" @click.stop>
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="modal-icon">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 640 512">
                <path d="M96 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V224v64V448c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V384H64c-17.7 0-32-14.3-32-32V288c-17.7 0-32-14.3-32-32s14.3-32 32-32V160c0-17.7 14.3-32 32-32H96V64zm448 0v64h32c17.7 0 32 14.3 32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32v64c0 17.7-14.3 32-32 32H544v64c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32V288 224 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32zM416 224v64H224V224H416z"/>
              </svg>
            </div>
            <div class="header-text-section">
              <h2>Editar Aparelho</h2>
              <p class="modal-subtitle">Atualize as informações e detalhes do aparelho</p>
            </div>
          </div>
          <button class="modal-close" @click="closeEditModal">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveEditedMachine" class="equipment-form">
            <div class="form-grid">
              <!-- Coluna Esquerda -->
              <div class="form-column">
                <!-- Nome do Aparelho -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Nome do Aparelho
                  </label>
                  <input
                    v-model="editingMachine.name"
                    type="text"
                    class="form-input"
                    placeholder="Ex: Leg Press 45°"
                    required
                  />
                </div>

                <!-- Categoria e Dificuldade -->
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                      Categoria
                    </label>
                    <select v-model="editingMachine.category" class="form-input" required>
                      <option value="" disabled>Selecione a categoria</option>
                      <option value="cardio">Cardio</option>
                      <option value="musculacao">Musculação</option>
                      <option value="funcional">Funcional</option>
                      <option value="crossfit">CrossFit</option>
                      <option value="livre">Peso Livre</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Nível de Dificuldade
                    </label>
                    <select v-model="editingMachine.difficulty" class="form-input" required>
                      <option value="" disabled>Selecione o nível</option>
                      <option value="iniciante">Iniciante</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="avancado">Avançado</option>
                    </select>
                  </div>
                </div>

                <!-- Descrição -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Descrição
                  </label>
                  <textarea
                    v-model="editingMachine.description"
                    class="form-textarea"
                    placeholder="Descreva o aparelho, para que serve e seus benefícios..."
                    rows="3"
                    required
                  ></textarea>
                </div>

                <!-- Como Usar -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    Instruções de Uso
                  </label>
                  <textarea
                    v-model="editingMachine.howToUse"
                    class="form-textarea"
                    placeholder="Explique passo a passo como utilizar o aparelho corretamente..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                <!-- Dicas de Segurança -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    Dicas de Segurança
                  </label>
                  <textarea
                    v-model="editingMachine.safetyTips"
                    class="form-textarea"
                    placeholder="Dicas importantes de segurança..."
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <!-- Coluna Direita -->
              <div class="form-column">
                <!-- Upload de Imagem -->
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Foto do Aparelho
                  </label>
                  <div 
                    class="image-upload-area"
                    :class="{ 'has-image': editImagePreview || editingMachine.image }"
                    @click="$refs.imageInputEdit.click()"
                    @dragover.prevent
                    @drop.prevent="handleDropEdit"
                  >
                    <input
                      ref="imageInputEdit"
                      type="file"
                      accept="image/*"
                      @change="handleImageEdit"
                      style="display: none"
                    />
                    <div v-if="!editImagePreview && !editingMachine.image" class="upload-placeholder">
                      <i class="fas fa-cloud-upload-alt"></i>
                      <p>Clique ou arraste uma imagem</p>
                      <span class="upload-hint">PNG, JPG ou GIF • Máximo 10MB</span>
                    </div>
                    <div v-else class="image-preview">
                      <img :src="editImagePreview || getImageUrl(editingMachine.image)" alt="Preview" />
                      <button type="button" @click.stop="removeEditImage" class="remove-image-btn" title="Remover imagem">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Grupos Musculares -->
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-running"></i>
                    Grupos Musculares
                  </label>
                  <div class="muscle-groups-grid">
                    <label v-for="muscle in muscleGroupOptions" :key="muscle.value" class="checkbox-label">
                      <input
                        type="checkbox"
                        :value="muscle.value"
                        v-model="editingMachine.muscleGroups"
                        class="checkbox-input"
                      />
                      <i :class="muscle.icon" class="muscle-icon"></i>
                      <span class="checkbox-text">{{ muscle.label }}</span>
                    </label>
                  </div>
                  
                  <div v-if="editingMachine.muscleGroups && editingMachine.muscleGroups.length > 0" style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-secondary);">
                    Selecionados: {{ editingMachine.muscleGroups.join(', ') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Ações do Modal -->
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeEditModal">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancelar
              </button>
              <button type="submit" class="btn-save" :disabled="isSubmitting">
                {{ isSubmitting ? 'Salvando...' : 'Salvar Alterações' }}
                <svg v-if="!isSubmitting" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardNavBar from "@/components/DashboardNavBar.vue";
import EquipmentModal from "@/components/EquipmentModal.vue";
import CategoryFilter from "@/components/CategoryFilter.vue";
import NotificationModal from "@/components/NotificationModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { useThemeStore } from "@/store/theme";
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import api from "@/api";
import { Dumbbell, Grid3x3, CheckCircle2 } from 'lucide-vue-next';
import { API_URL } from '@/config';

export default {
  name: "MachinesView",
  components: {
    DashboardNavBar,
    EquipmentModal,
    CategoryFilter,
    NotificationModal,
    ConfirmationModal,
    Dumbbell,
    Grid3x3,
    CheckCircle2,
  },
  setup() {
    const themeStore = useThemeStore();
    const authStore = useAuthStore();
    const { isDarkMode } = storeToRefs(themeStore);
    const { user, currentUser } = storeToRefs(authStore);
    
    const notification = ref({
      visible: false,
      type: 'info',
      title: '',
      message: ''
    });

    const showNotification = (type, title, message) => {
      notification.value = {
        visible: true,
        type,
        title,
        message
      };
    };

   
    const showConfirmation = ref(false);
    const confirmationConfig = ref({
      title: '',
      message: '',
      iconType: 'warning',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      buttonClass: 'btn-danger',
      onConfirm: () => {}
    });
    
    return {
      isDarkMode,
      user,
      currentUser,
      notification,
      showNotification,
      showConfirmation,
      confirmationConfig,
    };
  },
  data() {
    return {
      selectedCategory: null,
      showEquipmentModal: false,
      showDetailModal: false,
      showEditModal: false,
      selectedMachine: null,
      editingMachine: null,
      editImagePreview: null,
      isLoading: false,
      isSubmitting: false,
      machinesStats: {
        total: 0,
        categories: 0,
        available: 0,
      },
      categories: [
        { id: 'todos', name: 'Todos', icon: 'fas fa-th-large', count: 0 },
        { id: 'cardio', name: 'Cardio', icon: 'fas fa-heartbeat', count: 0 },
        { id: 'musculacao', name: 'Musculação', icon: 'fas fa-dumbbell', count: 0 },
        { id: 'funcional', name: 'Funcional', icon: 'fas fa-running', count: 0 },
        { id: 'crossfit', name: 'CrossFit', icon: 'fas fa-fire', count: 0 },
        { id: 'outros', name: 'Outros', icon: 'fas fa-tools', count: 0 },
      ],
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
      machines: [],
      instructorId: null,
    };
  },
  async created() {
    console.log('Token:', sessionStorage.getItem('token'));
  },

  async mounted() {
    await this.$nextTick();
    
   
    await this.waitForAuthStore();
    
    await this.fetchInstructorId();
    if (this.instructorId) {
      await this.fetchEquipments();
    } else {
     
      setTimeout(async () => {
        await this.fetchInstructorId();
        if (this.instructorId) {
          await this.fetchEquipments();
        }
      }, 1000);
    }
    document.addEventListener('click', this.handleClickOutside);
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  
  computed: {
    getImageUrl() {
      return (imagePath) => {
        if (!imagePath) return null;
       
        if (imagePath.startsWith('http')) return imagePath;
       
        return `${API_URL}${imagePath}`;
      };
    },
    filteredMachines() {
      if (!this.selectedCategory || this.selectedCategory === 'todos') {
        return this.machines;
      }
      return this.machines.filter(machine => 
        machine.category === this.selectedCategory
      );
    },
    displayedMachines() {
      return this.filteredMachines;
    },
  },
  watch: {
   
    user: {
      handler(newUser) {
        const userId = newUser?.userId || newUser?.id;
        if (newUser && userId && !this.instructorId) {
          this.loadData();
        }
      },
      deep: true,
      immediate: true
    },
   
    instructorId: {
      handler(newInstructorId) {
        if (newInstructorId && this.machines.length === 0) {
          this.fetchEquipments();
        }
      },
      immediate: false
    }
  },
  methods: {
    async waitForAuthStore() {
     
      let retries = 0;
      const maxRetries = 10;
      
      while (retries < maxRetries) {
        const userData = this.user || this.currentUser;
        const token = sessionStorage.getItem('token');
        
       
        if (userData || token) {
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
    },
    async loadData() {
      try {
       
        await this.fetchInstructorId();
        
        if (this.instructorId) {
          await this.fetchEquipments();
        } else {
          
         
          setTimeout(async () => {
            await this.loadData();
          }, 1500);
        }
      } catch (error) {
        console.log('error: ', error);
        
       
        setTimeout(async () => {
          await this.loadData();
        }, 3000);
      }
    },
    async fetchInstructorId() {
      
      try {
       
        let userData = this.user || this.currentUser;
        
       
        if (!userData) {
          const sessionUser = sessionStorage.getItem('user');
          if (sessionUser) {
            try {
              userData = JSON.parse(sessionUser);
            } catch (e) {
              console.log('e: ', e);
            }
          }
        }
        
       
        if (!userData) {
          this.showNotification('error', 'Erro de Autenticação', 'Dados de usuário não encontrados.\nPor favor, faça logout e login novamente.');
          this.instructorId = null;
          return;
        }
        
       
        if (userData.instructorId) {
          this.instructorId = userData.instructorId;
          return;
        }
        
       
        const userId = userData.userId || userData.id;
        
        if (userId) {
          const response = await api.get(`/instructors/user/${userId}`);
          this.instructorId = response.data._id;
        } else {
          this.showNotification('error', 'Erro de Autenticação', 'Dados de usuário incompletos.\nPor favor, faça logout e login novamente.');
          this.instructorId = null;
          return;
        }
      } catch (error) {
        this.showNotification('error', 'Erro ao Buscar Instrutor', 'Erro ao buscar dados do instrutor.\nPor favor, tente novamente ou faça login novamente.');
        this.instructorId = null;
        return;
      }
    },
    async fetchEquipments() {
      this.isLoading = true;
      try {
        const response = await api.get(`/equipments/instructor/${this.instructorId}`);
        this.machines = response.data.equipments;
        this.updateStats();
        this.updateCategories();
      } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
      } finally {
        this.isLoading = false;
      }
    },
    updateStats() {
      this.machinesStats.total = this.machines.length;
      this.machinesStats.available = this.machines.filter(m => m.isAvailable).length;
      const uniqueCategories = [...new Set(this.machines.map(m => m.category))];
      this.machinesStats.categories = uniqueCategories.length;
    },
    updateCategories() {
      this.categories.forEach(cat => {
        if (cat.id === 'todos') {
          cat.count = this.machines.length;
        } else {
          cat.count = this.machines.filter(m => m.category === cat.id).length;
        }
      });
    },
    filterByCategory(categoryId) {
      this.selectedCategory = categoryId;
    },
    clearFilters() {
      this.selectedCategory = null;
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : categoryId;
    },
    getCategoryIcon(categoryName) {
      const categoryMap = {
        'cardio': 'fas fa-heartbeat',
        'musculacao': 'fas fa-dumbbell',
        'funcional': 'fas fa-running',
        'crossfit': 'fas fa-fire',
        'outros': 'fas fa-tools',
      };
      return categoryMap[categoryName] || 'fas fa-cogs';
    },
    getDifficultyLabel(difficulty) {
      const labels = {
        iniciante: 'Iniciante',
        intermediario: 'Intermediário',
        avancado: 'Avançado'
      };
      return labels[difficulty] || difficulty;
    },
    getMuscleGroupLabel(group) {
      const labels = {
        'peito': 'Peito',
        'costas': 'Costas',
        'ombros': 'Ombros',
        'biceps': 'Bíceps',
        'triceps': 'Tríceps',
        'pernas': 'Pernas',
        'gluteos': 'Glúteos',
        'abdomen': 'Abdômen',
        'panturrilha': 'Panturrilha',
        'antebraco': 'Antebraço',
        'corpo-todo': 'Corpo Todo'
      };
      return labels[group] || group;
    },
    async openCreateMachineModal() {
     
      if (!this.instructorId) {
        await this.fetchInstructorId();
        
        if (!this.instructorId) {
          this.showNotification('error', 'Erro Crítico', 'Não foi possível carregar o ID do instrutor.\n\nDados de debug (verifique o console):\n- User: ' + JSON.stringify(this.user || this.currentUser) + '\n\nPor favor, faça logout e login novamente.');
          return;
        } else {
          console.log('✅ [openCreateMachineModal] instructorId carregado com sucesso na segunda tentativa:', this.instructorId);
        }
      }
      
      this.showEquipmentModal = true;
    },
    closeEquipmentModal() {
      this.showEquipmentModal = false;
    },
    async handleEquipmentAdded() {
      await this.fetchEquipments();
    },
    
    toggleMachineMenu(machineId) {
      this.machines = this.machines.map(machine => {
        if (machine._id === machineId) {
          return { ...machine, showMenu: !machine.showMenu };
        }
        return { ...machine, showMenu: false };
      });
    },
    
    handleClickOutside(event) {
      const isClickInsideAnyDropdown = this.machines.some(machine => {
        const dropdownRef = this.$refs[`dropdownRef-${machine._id}`];
        if (!dropdownRef) return false;
        
        const element = Array.isArray(dropdownRef) ? dropdownRef[0] : dropdownRef;
        return element && element.contains && element.contains(event.target);
      });

      if (!isClickInsideAnyDropdown) {
        this.machines = this.machines.map(machine => ({
          ...machine,
          showMenu: false
        }));
      }
    },
    truncate(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    viewMachineDetails(machine) {
      this.selectedMachine = machine;
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedMachine = null;
    },
    openEditModal(machine) {
      this.editingMachine = { 
        ...machine,
        muscleGroups: Array.isArray(machine.muscleGroups) ? [...machine.muscleGroups] : []
      };
      this.editImagePreview = null;
      this.showDetailModal = false;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editingMachine = null;
      this.editImagePreview = null;
    },
    async saveEditedMachine() {
      if (this.isSubmitting) return;
      
      this.isSubmitting = true;
      try {
        const updateData = {
          name: this.editingMachine.name,
          description: this.editingMachine.description || '',
          category: this.editingMachine.category,
          difficulty: this.editingMachine.difficulty,
          howToUse: this.editingMachine.howToUse || '',
          safetyTips: this.editingMachine.safetyTips || '',
          muscleGroups: this.editingMachine.muscleGroups || []
        };

       
        if (this.editingMachine.newImageBase64) {
          updateData.imageBase64 = this.editingMachine.newImageBase64;
        }

        const response = await api.put(`/equipments/${this.editingMachine._id}`, updateData);
        console.log('response: ', response);
        
        await this.fetchEquipments();
        this.closeEditModal();
        this.showNotification('success', 'Sucesso', 'Aparelho atualizado com sucesso!');
      } catch (error) {
        this.showNotification('error', 'Erro ao Salvar', 'Erro ao salvar aparelho: ' + (error.response?.data?.message || error.message));
      } finally {
        this.isSubmitting = false;
      }
    },
    async deleteMachine(machine) {
      this.confirmationConfig = {
        title: 'Excluir Aparelho',
        message: `Tem certeza que deseja excluir o aparelho "${machine.name}"? Esta ação não pode ser desfeita.`,
        iconType: 'danger',
        confirmText: 'Sim, Excluir',
        cancelText: 'Cancelar',
        buttonClass: 'btn-danger',
        onConfirm: async () => {
          try {
            await api.delete(`/equipments/${machine._id}`);
            await this.fetchEquipments();
            this.showNotification('success', 'Aparelho Excluído', 'Aparelho excluído com sucesso!');
            this.showConfirmation = false;
          } catch (error) {
            console.error('Erro ao excluir aparelho:', error);
            this.showNotification('error', 'Erro ao Excluir', 'Erro ao excluir aparelho');
          }
        }
      };
      this.showConfirmation = true;
    },
    handleImageEdit(event) {
      const file = event.target.files[0];
      if (file) {
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
           
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
           
            const maxWidth = 1200;
            const maxHeight = 1200;
            let width = img.width;
            let height = img.height;
            
           
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
           
            const base64 = canvas.toDataURL('image/jpeg', 0.7);
            
           
            this.editImagePreview = base64;
            this.editingMachine.newImageBase64 = base64;
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleDropEdit(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
           
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
           
            const maxWidth = 1200;
            const maxHeight = 1200;
            let width = img.width;
            let height = img.height;
            
           
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
           
            const base64 = canvas.toDataURL('image/jpeg', 0.7);
            
           
            this.editImagePreview = base64;
            this.editingMachine.newImageBase64 = base64;
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    removeEditImage() {
      this.editImagePreview = null;
      this.editingMachine.image = null;
      this.editingMachine.newImageBase64 = null;
    },
    editMachine(machine) {
      this.openEditModal(machine);
    },
    previewMachine(machine) {
      this.viewMachineDetails(machine);
    },
    viewDetails(machine) {
      this.viewMachineDetails(machine);
    },
  },
};
</script>

<style scoped>
/* Reusing the same styles from exercises.vue */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-container {
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow-x: hidden;
  display: flex;
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
  pointer-events: none;
}

.dashboard-main {
  margin-left: 280px;
  padding: 0;
  position: relative;
  flex: 1;
  background: var(--bg-primary);
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
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(96, 165, 250, 0.15) 0%, transparent 50%);
  
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
  
  --primary-color: #2563eb;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  background: #ffffff;
}

.dashboard-dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: rgba(15, 16, 23, 0.8);
  --bg-tertiary: rgba(26, 32, 44, 0.9);
  --bg-pattern: radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(192, 132, 252, 0.15) 0%, transparent 50%);
  
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
  
  --primary-color: #8b5cf6;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  background: #0a0a0a;
}

/* Floating Header */
.floating-header {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  z-index: 100;
  padding: 24px 40px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
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
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
}

.header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.create-button {
  position: relative;
  padding: 16px 28px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 16px;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
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
  width: 100%;
  height: 100%;
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
  justify-content: center;
  height: 100%;
}

.stat-main {
  display: flex;
  align-items: center;
  gap: 24px;
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
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.stat-card.stat-primary .stat-icon {
  background: transparent;
  color: #2563eb;
}

.dashboard-dark .stat-card.stat-primary .stat-icon {
  background: transparent;
  color: #8b5cf6;
}

.stat-card.stat-secondary .stat-icon {
  background: transparent;
  color: #2563eb;
}

.dashboard-dark .stat-card.stat-secondary .stat-icon {
  background: transparent;
  color: #8b5cf6;
}

.stat-card.stat-tertiary .stat-icon {
  background: transparent;
  color: #2563eb;
}

.dashboard-dark .stat-card.stat-tertiary .stat-icon {
  background: transparent;
  color: #8b5cf6;
}

.stat-card:hover .stat-icon {
  transform: rotate(5deg) scale(1.1);
}

.stat-icon svg {
  flex-shrink: 0;
}

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
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

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Filter Section */
.clean-filter-section {
  margin-bottom: 32px;
}

.clean-filter-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.clean-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.clean-category-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
}

.clean-category-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
  box-shadow: var(--shadow);
}

.card-selected {
  background: var(--primary-gradient);
  border-color: transparent;
  color: white;
}

.category-icon-clean {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(37, 99, 235, 0.1);
  color: var(--primary-color);
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.card-selected .category-icon-clean {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.category-content-clean {
  flex: 1;
}

.category-title-clean {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.card-selected .category-title-clean {
  color: white;
}

.category-count-clean {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.card-selected .category-count-clean {
  color: rgba(255, 255, 255, 0.8);
}

.category-arrow-clean {
  width: 20px;
  height: 20px;
  color: white;
}

.category-arrow-clean svg {
  width: 100%;
  height: 100%;
}

/* Results Section */
.results-section-clean {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px 24px;
}

.results-info-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.results-badge-clean {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 10px;
}

.dashboard-dark .results-badge-clean {
  background: rgba(139, 92, 246, 0.15);
}

.results-icon-clean {
  width: 20px;
  height: 20px;
  color: var(--primary-color);
}

.results-icon-clean svg {
  width: 100%;
  height: 100%;
}

.results-text-clean {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.active-filter-chip {
  padding: 4px 12px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.results-actions-clean {
  display: flex;
  gap: 12px;
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters-btn svg {
  width: 16px;
  height: 16px;
}

.clear-filters-btn:hover {
  border-color: var(--error);
  color: var(--error);
  background: rgba(239, 68, 68, 0.1);
}

/* Machines Grid */
.exercises-section {
  margin-top: 2rem;
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
  opacity: 0;
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
  position: relative;
  overflow: hidden;
}

.image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.exercise-card:hover .image-container::before {
  opacity: 1;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: center center;
}

.exercise-card:hover .image-container img {
  transform: scale(1.10);
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

.exercise-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
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

/* Action Buttons */
.exercise-actions {
  margin-top: auto;
  position: relative;
  z-index: 1;
  padding: 1rem 1.5rem;
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
.exercise-actions .secondary-action {
  color: #ef4444;
}

.exercise-actions .secondary-action:hover {
  border-color: #ef4444; 
  box-shadow: 
    0 8px 25px rgba(239, 68, 68, 0.2),
    0 4px 15px rgba(239, 68, 68, 0.15);
}

.dashboard-dark .exercise-actions .secondary-action {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.25);
  color: #f87171;
}

.dashboard-dark .exercise-actions .secondary-action:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  color: #fca5a5;
}

/* Settings Button and Dropdown */
.machine-menu-wrapper {
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
  padding: 80px 32px;
}

.empty-icon {
  font-size: 4rem;
  color: var(--text-tertiary);
  margin-bottom: 24px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 32px 0;
}

.create-first-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
}

.create-first-button svg {
  width: 20px;
  height: 20px;
}

.create-first-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-main {
    margin-left: 0;
    padding-bottom: 80px;
  }

  .floating-header {
    left: 0;
    padding: 16px 24px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .dashboard-content {
    padding: 100px 24px 24px;
  }

  .exercises-grid {
    grid-template-columns: 1fr;
  }

  .clean-categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .results-section-clean {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .exercise-actions {
    flex-direction: column;
  }
}

/* How To Use Section */
.how-to-use {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border-left: 3px solid var(--primary-color);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.section-title i {
  color: var(--primary-color);
  font-size: 1rem;
}

.section-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.stat-item.full-width {
  grid-column: 1 / -1;
}

.stat-value {
  text-transform: capitalize;
}

/* Estilos para Modais */
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
  border-radius: 24px;
  max-width: 1200px;
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
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  z-index: 10;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.header-text-section {
  flex: 1;
}

.header-text-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.25rem 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: red;
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
  width: 24px;
  height: 24px;
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

.detail-section {
  margin-bottom: 32px;
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

/* Estilos para Modal de Edição */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-label i {
  color: var(--primary-color);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  font-size: 1rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.image-upload-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.image-preview-container {
  position: relative;
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  border-radius: 12px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.remove-image-btn i {
  font-size: 16px;
  pointer-events: none;
}

.remove-image-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: var(--bg-secondary);
  border-radius: 12px;
  color: var(--text-secondary);
}

.upload-placeholder i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 12px;
}

.upload-placeholder p {
  font-size: 0.9375rem;
  font-weight: 500;
}

.upload-trigger-btn {
  padding: 14px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.upload-trigger-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.upload-trigger-btn i {
  font-size: 1rem;
}

/* Grupos Musculares Checkboxes */
.muscle-groups-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-primary);
}

.muscle-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.muscle-checkbox-label:hover {
  border-color: var(--primary-color);
  background: var(--bg-primary);
  transform: translateY(-1px);
}

.muscle-checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.muscle-checkbox-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  flex: 1;
}

.muscle-checkbox-input:checked + .muscle-checkbox-text {
  color: var(--primary-color);
  font-weight: 600;
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
  font-family: "Inter", sans-serif;
  font-weight: 600;
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-save::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  transition: left 0.5s ease;
}

.btn-save:hover::before {
  left: 100%;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.btn-save:active {
  transform: translateY(0);
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
  
  .detail-info-grid,
  .form-row {
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

/* Estilos para visualização de dados */
.view-value {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;
  transition: all 0.2s ease;
}

.view-textarea {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 80px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.muscle-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.muscle-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.image-preview-view {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid var(--border-color);
  background: var(--card-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.image-preview-view img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: var(--card-bg);
  border: 2px dashed var(--border-color);
  border-radius: 16px;
  color: var(--text-secondary);
}

.no-image-placeholder svg {
  opacity: 0.4;
  margin-bottom: 12px;
}

.no-image-placeholder p {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.muscle-groups-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

/* Estilos do Equipment Form */
.equipment-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 968px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-color);
}

.form-label svg {
  color: var(--primary-color);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-color);
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.dashboard-dark .form-input:focus,
.dashboard-dark .form-textarea:focus {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-secondary);
}

select.form-input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: "Inter", sans-serif;
}

/* Checkbox Labels */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-label:hover {
  border-color: var(--primary-color);
  background: var(--bg-primary);
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary-color);
  flex-shrink: 0;
}

.checkbox-text {
  font-size: 0.875rem;
  color: var(--text-color);
  flex: 1;
}

.muscle-icon {
  font-size: 16px;
  color: var(--primary-color);
  margin-right: 8px;
  flex-shrink: 0;
}

/* Image Upload Area */
.image-upload-area {
  width: 100%;
  min-height: 200px;
  border: 3px dashed var(--border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

.image-upload-area:hover {
  border-color: var(--primary-color);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
}

.upload-placeholder svg,
.upload-placeholder i {
  font-size: 48px;
  width: 48px;
  height: 48px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.upload-placeholder p {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-color);
  margin: 0;
}

.upload-hint {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.image-preview {
  width: 100%;
  height: 400px;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.remove-image-btn i {
  font-size: 14px;
  pointer-events: none;
}

.remove-image-btn:hover {
  background: rgb(239, 68, 68);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}
</style>


