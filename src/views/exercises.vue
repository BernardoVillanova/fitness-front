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
          <div class="stats-grid">
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

            <div class="stat-card stat-tertiary">
              <div class="stat-background"></div>
              <div class="stat-content">
                <div class="stat-header">
                  <div class="stat-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20" width="28" height="28">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                    </svg>
                  </div>
                  <div class="stat-trend">
                    <span class="trend-value">Ativo</span>
                  </div>
                </div>
                <div class="stat-body">
                  <span class="stat-number">{{ exercisesStats.mostUsed }}</span>
                  <span class="stat-label">Mais Utilizados</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ====== SEÇÃO DE FILTROS CLEAN COMO A IMAGEM ====== -->
        <section class="clean-filter-section">
          <div class="clean-filter-container">
            
            <!-- Grid de Categorias Clean -->
            <div class="clean-categories-grid">
              <button 
                v-for="category in categories" 
                :key="category.id"
                :class="['clean-category-card', { 'card-selected': activeCategory === category.id }]"
                @click="filterByCategory(category.id)"
              >
                <div class="category-icon-clean">
                  <svg v-if="category.id === 'all'" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                  <svg v-else-if="category.id === 'chest'" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else-if="category.id === 'back'" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                  <svg v-else-if="category.id === 'arms'" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                  <svg v-else-if="category.id === 'legs'" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else-if="category.id === 'shoulders'" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg v-else-if="category.id === 'core'" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                
                <div class="category-content-clean">
                  <h4 class="category-title-clean">{{ category.name }}</h4>
                  <span class="category-count-clean">{{ category.count }} exercícios</span>
                </div>
                
                <div v-if="activeCategory === category.id" class="category-arrow-clean">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </button>
            </div>

            <!-- Seção de Resultados -->
            <div class="results-section-clean">
              <div class="results-info-wrapper">
                <div class="results-badge-clean">
                  <div class="results-icon-clean">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <span class="results-text-clean">{{ filteredExercises.length }} exercícios encontrados</span>
                </div>
                
                <div v-if="activeCategory !== 'all'" class="active-filter-chip">
                  <span>Categoria: {{ getCategoryName(activeCategory) }}</span>
                </div>
              </div>
              
              <div class="results-actions-clean">
                <button 
                  v-if="activeCategory !== 'all'" 
                  class="clear-filters-btn" 
                  @click="filterByCategory('all')"
                >
                  Limpar Filtros
                </button>
                <button class="export-btn">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  Exportar
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Exercises Grid -->
        <section class="exercises-section">
          <div class="exercises-grid">
            <div 
              v-for="exercise in filteredExercises" 
              :key="exercise.id" 
              class="exercise-card"
            >
              <!-- Floating Glow Effect -->
              <div class="card-glow"></div>
              
              <!-- Exercise Header -->
              <div class="exercise-header">
                <div class="exercise-image">
                  <div class="image-container">
                    <!-- Fixed Image Implementation with Proper Fallback -->
                    <div v-if="!exercise.image || imageError[exercise.id]" class="image-placeholder">
                      <div class="placeholder-icon">
                        <svg width="48" height="48" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <span class="placeholder-text">{{ exercise.category }}</span>
                    </div>
                    <img 
                      v-else
                      :src="exercise.image" 
                      :alt="exercise.name"
                      @error="handleImageError(exercise.id)"
                      @load="handleImageLoad(exercise.id)"
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
                
                <div class="exercise-menu-wrapper">
                  <button 
                    class="menu-trigger" 
                    @click="toggleExerciseMenu(exercise.id)"
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </button>
                  
                  <div v-if="exercise.showMenu" class="dropdown-menu">
                    <button class="dropdown-option" @click="editExercise(exercise)">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                      </svg>
                      Editar
                    </button>
                    <button class="dropdown-option" @click="duplicateExercise(exercise)">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 7a1 1 0 000 2h6a1 1 0 100-2H7zM7 11a1 1 0 100 2h6a1 1 0 100-2H7zM7 15a1 1 0 100 2h6a1 1 0 100-2H7z"></path>
                      </svg>
                      Duplicar
                    </button>
                    <div class="dropdown-separator"></div>
                    <button class="dropdown-option danger" @click="deleteExercise(exercise)">
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              </div>

              <!-- Exercise Info -->
              <div class="exercise-info">
                <div class="exercise-meta">
                  <div class="category-badge">
                    {{ exercise.category }}
                  </div>
                  <div class="difficulty-indicator" :class="exercise.difficulty.toLowerCase()">
                    <div class="difficulty-dot"></div>
                    {{ exercise.difficulty }}
                  </div>
                </div>
                
                <h3 class="exercise-name">{{ exercise.name }}</h3>
                <p class="exercise-description">{{ exercise.description }}</p>
              </div>

              <!-- Exercise Stats -->
              <div class="exercise-stats">
                <div class="stats-row">
                  <div class="stat-item">
                    <div class="stat-icon-wrapper">
                      <svg class="stat-icon" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div class="stat-content">
                      <span class="stat-label">Duração</span>
                      <span class="stat-value">{{ exercise.duration || 'Variável' }}</span>
                    </div>
                  </div>
                  
                  <div class="stat-item">
                    <div class="stat-icon-wrapper">
                      <svg class="stat-icon" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                      </svg>
                    </div>
                    <div class="stat-content">
                      <span class="stat-label">Uso</span>
                      <span class="stat-value">{{ exercise.usageCount || 0 }} planos</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Exercise Actions -->
              <div class="exercise-actions">
                <button class="action-button secondary-action" @click="viewExerciseDetails(exercise)">
                  <div class="button-shine"></div>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="button-text">Ver Detalhes</span>
                </button>
                <button class="action-button primary-action" @click="addToWorkout(exercise)">
                  <div class="button-shine"></div>
                  <div class="button-particles"></div>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span class="button-text">Adicionar ao Treino</span>
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

    <!-- Modal de Edição de Exercício -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-container-large">
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="modal-icon">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
            </div>
            <div>
              <h2 class="modal-title">Editar Exercício</h2>
              <p class="modal-subtitle">Personalize as informações do exercício</p>
            </div>
          </div>
          <button class="modal-close" @click="closeEditModal">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveEditedExercise">
            <div class="form-grid">
              <!-- Coluna Esquerda -->
              <div class="form-column">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Nome do Exercício
                  </label>
                  <input 
                    v-model="editingExercise.name" 
                    type="text" 
                    class="form-input"
                    placeholder="Digite o nome do exercício"
                    required
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                      Categoria
                    </label>
                    <select v-model="editingExercise.category" class="form-input" required>
                      <option value="">Selecione</option>
                      <option value="Peito">Peito</option>
                      <option value="Costas">Costas</option>
                      <option value="Pernas">Pernas</option>
                      <option value="Braços">Braços</option>
                      <option value="Ombros">Ombros</option>
                      <option value="Core">Core</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Duração
                    </label>
                    <input 
                      v-model="editingExercise.duration" 
                      type="text" 
                      class="form-input"
                      placeholder="Ex: 45-60 seg"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    Dificuldade
                  </label>
                  <select v-model="editingExercise.difficulty" class="form-input" required>
                    <option value="">Selecione</option>
                    <option value="Iniciante">🟢 Iniciante</option>
                    <option value="Intermediário">🟡 Intermediário</option>
                    <option value="Avançado">🔴 Avançado</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Descrição
                  </label>
                  <textarea 
                    v-model="editingExercise.description" 
                    class="form-textarea"
                    placeholder="Descreva o exercício, seus benefícios e técnica de execução..."
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>

              <!-- Coluna Direita - Upload de Imagem -->
              <div class="form-column">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Imagem do Exercício
                  </label>
                  
                  <!-- Preview da Imagem -->
                  <div v-if="imagePreview" class="image-preview-container">
                    <img :src="imagePreview" alt="Preview" class="image-preview" />
                    <button type="button" class="remove-image-btn" @click="removeImage">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1L11 11M11 1L1 11" stroke="white" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Área de Upload -->
                  <div 
                    v-else
                    class="upload-area"
                    :class="{ 'drag-over': isDragging }"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleDrop"
                  >
                    <input 
                      ref="fileInput"
                      type="file" 
                      accept="image/*"
                      class="file-input"
                      @change="handleFileSelect"
                    />
                    <div class="upload-content">
                      <div class="upload-icon-large">
                        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div class="upload-text">
                        <p class="upload-title-large">Adicionar Imagem do Exercício</p>
                        <p class="upload-subtitle-large">Arraste e solte aqui ou</p>
                      </div>
                      <button type="button" class="upload-button" @click="triggerFileInput">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        Selecionar Arquivo
                      </button>
                    </div>
                  </div>

                  <!-- Informação Adicional -->
                  <div class="upload-info">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <span>PNG, JPG, GIF ou WEBP • Máximo 10MB • Recomendado: 800×600px</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeEditModal">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancelar
              </button>
              <button type="submit" class="btn-save">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Salvar Alterações
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
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";

export default {
  name: "ExercisesPage",
  components: { 
    DashboardNavBar
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    return { isDarkMode };
  },
  data() {
    return {
      searchQuery: '',
      activeCategory: 'all',
      imageError: {},
      showEditModal: false,
      editingExercise: {
        id: null,
        name: '',
        category: '',
        description: '',
        difficulty: '',
        duration: '',
        image: '',
        usageCount: 0
      },
      imagePreview: null,
      isDragging: false,
      selectedFile: null,
      exercisesStats: {
        total: 45,
        categories: 8,
        mostUsed: 12
      },
      categories: [
        { id: 'all', name: 'Todos', count: 45 },
        { id: 'chest', name: 'Peito', count: 8 },
        { id: 'back', name: 'Costas', count: 7 },
        { id: 'legs', name: 'Pernas', count: 12 },
        { id: 'arms', name: 'Braços', count: 6 },
        { id: 'shoulders', name: 'Ombros', count: 5 },
        { id: 'core', name: 'Core', count: 7 }
      ],
      exercises: [
        {
          id: 1,
          name: 'Supino Reto com Barra',
          category: 'Peito',
          description: 'Exercício fundamental para desenvolvimento do peitoral maior.',
          difficulty: 'Intermediário',
          duration: '45-60 seg',
          usageCount: 23,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop&q=80',
          showMenu: false
        },
        {
          id: 2,
          name: 'Agachamento Livre',
          category: 'Pernas',
          description: 'Movimento composto para fortalecimento de quadríceps e glúteos.',
          difficulty: 'Intermediário',
          duration: '60-90 seg',
          usageCount: 31,
          image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&h=240&fit=crop&q=80',
          showMenu: false
        },
        {
          id: 3,
          name: 'Puxada Frontal',
          category: 'Costas',
          description: 'Exercício para desenvolvimento do latíssimo do dorso.',
          difficulty: 'Iniciante',
          duration: '45 seg',
          usageCount: 18,
          image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=240&fit=crop&q=80',
          showMenu: false
        },
        {
          id: 4,
          name: 'Desenvolvimento com Halteres',
          category: 'Ombros',
          description: 'Fortalecimento dos deltoides anterior e medial.',
          difficulty: 'Intermediário',
          duration: '50 seg',
          usageCount: 15,
          image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=240&fit=crop&q=80',
          showMenu: false
        },
        {
          id: 5,
          name: 'Flexão de Braços',
          category: 'Peito',
          description: 'Exercício clássico utilizando peso corporal.',
          difficulty: 'Iniciante',
          duration: '30-45 seg',
          usageCount: 42,
          image: null,
          showMenu: false
        },
        {
          id: 6,
          name: 'Remada Curvada',
          category: 'Costas',
          description: 'Exercício para músculos das costas e bíceps.',
          difficulty: 'Intermediário',
          duration: '45-60 seg',
          usageCount: 28,
          image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=240&fit=crop&q=80',
          showMenu: false
        }
      ],
      filteredExercises: []
    }
  },
  mounted() {
    this.filteredExercises = [...this.exercises];
  },
  methods: {
    handleImageError(exerciseId) {
      this.imageError[exerciseId] = true;
    },
    handleImageLoad(exerciseId) {
      this.imageError[exerciseId] = false;
    },
    openCreateExerciseModal() {
      console.log('Abrir modal de criação de exercício');
    },
    filterExercises() {
      this.applyFilters();
    },
    filterByCategory(categoryId) {
      this.activeCategory = categoryId;
      this.applyFilters();
    },
    clearSearch() {
      this.searchQuery = '';
      this.applyFilters();
    },
    resetFilters() {
      this.searchQuery = '';
      this.activeCategory = 'all';
      this.applyFilters();
    },
    applyFilters() {
      let filtered = [...this.exercises];
      
      if (this.activeCategory !== 'all') {
        const categoryMap = {
          'chest': 'Peito',
          'back': 'Costas', 
          'legs': 'Pernas',
          'arms': 'Braços',
          'shoulders': 'Ombros',
          'core': 'Core'
        };
        filtered = filtered.filter(exercise => 
          exercise.category === categoryMap[this.activeCategory]
        );
      }
      
      if (this.searchQuery.trim()) {
        filtered = filtered.filter(exercise =>
          exercise.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          exercise.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          exercise.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      this.filteredExercises = filtered;
    },
    toggleExerciseMenu(exerciseId) {
      this.exercises.forEach(exercise => {
        exercise.showMenu = exercise.id === exerciseId ? !exercise.showMenu : false;
      });
    },
    previewExercise(exercise) {
      console.log('Visualizar exercício:', exercise);
    },
    editExercise(exercise) {
      // Fecha o menu dropdown se estiver aberto
      exercise.showMenu = false;
      
      // Copia os dados do exercício para edição
      this.editingExercise = {
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        description: exercise.description,
        difficulty: exercise.difficulty,
        duration: exercise.duration,
        image: exercise.image,
        usageCount: exercise.usageCount
      };
      
      // Carrega a imagem atual no preview se existir
      if (exercise.image) {
        this.imagePreview = exercise.image;
      }
      
      // Abre o modal
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      // Limpa os dados do formulário
      this.editingExercise = {
        id: null,
        name: '',
        category: '',
        description: '',
        difficulty: '',
        duration: '',
        image: '',
        usageCount: 0
      };
      // Limpa preview e arquivo da imagem
      this.imagePreview = null;
      this.selectedFile = null;
      this.isDragging = false;
    },
    saveEditedExercise() {
      // Encontra o exercício na lista
      const index = this.exercises.findIndex(ex => ex.id === this.editingExercise.id);
      
      if (index !== -1) {
        // Atualiza o exercício mantendo o showMenu e usageCount
        this.exercises[index] = {
          ...this.exercises[index],
          name: this.editingExercise.name,
          category: this.editingExercise.category,
          description: this.editingExercise.description,
          difficulty: this.editingExercise.difficulty,
          duration: this.editingExercise.duration,
          image: this.imagePreview || this.editingExercise.image
        };
        
        // Aqui você pode adicionar uma chamada de API para salvar no backend
        console.log('Exercício atualizado:', this.exercises[index]);
        
        // Fecha o modal
        this.closeEditModal();
        
        // Opcional: Mostrar mensagem de sucesso
        // this.$toast.success('Exercício atualizado com sucesso!');
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processFile(file);
      }
    },
    handleDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.processFile(file);
      }
    },
    processFile(file) {
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

      this.selectedFile = file;

      // Cria preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage() {
      this.imagePreview = null;
      this.selectedFile = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    duplicateExercise(exercise) {
      console.log('Duplicar exercício:', exercise);
      exercise.showMenu = false;
    },
    deleteExercise(exercise) {
      console.log('Excluir exercício:', exercise);
      exercise.showMenu = false;
    },
    viewExerciseDetails(exercise) {
      console.log('Ver detalhes do exercício:', exercise);
    },
    addToWorkout(exercise) {
      console.log('Adicionar ao treino:', exercise);
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : '';
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
  --font-display: 'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.dashboard-container {
  display: flex;
  min-height: 100vh;
  font-family: var(--font-family);
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
  padding: 100px 40px 40px;
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
  font-family: inherit;
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
  font-family: inherit;
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
  font-family: inherit;
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
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 32px;
  justify-content: center;
  align-items: stretch;
  padding: 8px;
}

.exercise-card {
  position: relative;
  background: var(--bg-secondary);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 28px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 8px 40px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
  display: flex;
  flex-direction: column;
  height: 100%;
  transform: translateY(0);
  cursor: pointer;
}

.exercise-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 
    0 25px 50px rgba(37, 99, 235, 0.15),
    0 15px 35px rgba(37, 99, 235, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: var(--border-accent);
}

.dashboard-dark .exercise-card:hover {
  box-shadow: 
    0 25px 50px rgba(139, 92, 246, 0.25),
    0 15px 35px rgba(139, 92, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: conic-gradient(from 0deg, transparent, var(--border-accent), transparent);
  opacity: 0;
  border-radius: 28px;
  animation: rotate 6s linear infinite;
  transition: opacity 0.5s ease;
  z-index: -1;
}

.exercise-card:hover .card-glow {
  opacity: 0.1;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.exercise-header {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.exercise-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  border-radius: 28px 28px 0 0;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(0.9) saturate(1.1);
}

.exercise-card:hover .image-container img {
  transform: scale(1.15);
  filter: brightness(1) saturate(1.3);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  color: white;
  font-weight: 600;
  text-align: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.image-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  opacity: 0.8;
}

.placeholder-icon {
  position: relative;
  z-index: 1;
  opacity: 0.9;
  transition: all 0.3s ease;
}

.exercise-card:hover .placeholder-icon {
  transform: scale(1.1);
  opacity: 1;
}

.placeholder-text {
  position: relative;
  z-index: 1;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.9;
  transition: all 0.3s ease;
}

.exercise-card:hover .placeholder-text {
  opacity: 1;
  transform: translateY(-2px);
}

.image-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg, 
    rgba(37, 99, 235, 0.1) 0%, 
    transparent 30%, 
    transparent 70%, 
    rgba(59, 130, 246, 0.15) 100%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
}

.dashboard-dark .image-gradient {
  background: linear-gradient(
    135deg, 
    rgba(139, 92, 246, 0.15) 0%, 
    transparent 30%, 
    transparent 70%, 
    rgba(168, 85, 247, 0.2) 100%
  );
}

.exercise-card:hover .image-gradient {
  opacity: 1;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg, 
    rgba(0, 0, 0, 0.4) 0%, 
    transparent 40%, 
    transparent 60%, 
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.exercise-card:hover .image-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 16px;
  transform: translateY(20px);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.exercise-card:hover .overlay-actions {
  transform: translateY(0);
}

.modern-overlay-btn {
  position: relative;
  width: 56px;
  height: 56px;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}

.modern-overlay-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 18px;
  padding: 1.5px;
  background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-overlay-btn:hover::before {
  opacity: 1;
}

.btn-glow-effect {
  position: absolute;
  inset: -2px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.4), rgba(59, 130, 246, 0.4));
  opacity: 0;
  filter: blur(12px);
  transition: opacity 0.4s ease;
  z-index: -1;
}

.modern-overlay-btn:hover .btn-glow-effect {
  opacity: 1;
}

.btn-icon-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modern-overlay-btn:hover .btn-icon-wrapper {
  transform: scale(1.15) rotate(5deg);
}

.modern-overlay-btn:active .btn-icon-wrapper {
  transform: scale(0.95);
}

.btn-tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(5px);
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 8px 20px rgba(37, 99, 235, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.modern-overlay-btn:active {
  transform: translateY(-2px) scale(1.02);
}

.preview-btn:hover {
  background: rgba(59, 130, 246, 0.25);
}

.preview-btn:hover .btn-glow-effect {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(37, 99, 235, 0.6));
}

.edit-btn:hover {
  background: rgba(139, 92, 246, 0.25);
}

.edit-btn:hover .btn-glow-effect {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.6), rgba(139, 92, 246, 0.6));
}

.exercise-menu-wrapper {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
}

.menu-trigger {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
}

.menu-trigger:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: var(--bg-tertiary);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 10px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 1000;
  min-width: 180px;
  padding: 12px;
  animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}

@keyframes dropdownSlide {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-option {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-option:hover {
  background: var(--bg-primary);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-option.danger {
  color: #ef4444;
}

.dropdown-option.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.dropdown-separator {
  height: 1px;
  background: var(--border-primary);
  margin: 8px 0;
  opacity: 0.6;
}

.exercise-info {
  position: relative;
  z-index: 1;
  padding: 24px 28px 20px;
  flex: 1;
  background: var(--bg-secondary);
}

.exercise-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-badge {
  padding: 6px 14px;
  background: var(--gradient-primary);
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.dashboard-dark .category-badge {
  background: var(--gradient-primary);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.difficulty-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.difficulty-indicator.iniciante {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.difficulty-indicator.intermediário {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.difficulty-indicator.avançado {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.difficulty-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.exercise-name {
  margin: 0 0 12px 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.exercise-description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  opacity: 0.9;
}

.exercise-stats {
  position: relative;
  z-index: 1;
  padding: 20px 28px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-primary);
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
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: white;
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

.exercise-actions {
  position: relative;
  z-index: 1;
  padding: 24px 28px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-primary);
  display: flex;
  gap: 12px;
}

.action-button {
  position: relative;
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: hidden;
  letter-spacing: 0.01em;
}

.action-button svg {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.button-text {
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.button-shine {
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
  transition: left 0.6s ease;
  z-index: 1;
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
  background: var(--card-background);
  border-radius: 28px;
  width: 100%;
  max-width: 1200px;
  max-height: 92vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  animation: slideUp 0.3s ease;
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

.modal-close:hover svg {
  transform: scale(1.1);
}

.modal-body {
  padding: 48px;
  overflow-y: auto;
  max-height: calc(92vh - 220px);
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
  font-family: inherit;
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
.upload-area {
  position: relative;
  border: 2px dashed transparent;
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%);
  overflow: hidden;
  cursor: pointer;
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
  transform: translateY(-4px);
  box-shadow: 
    0 20px 40px rgba(99, 102, 241, 0.15),
    0 10px 20px rgba(139, 92, 246, 0.1);
}

.upload-area-modern:hover .upload-gradient-bg,
.upload-area-modern:hover .upload-grid-pattern {
  opacity: 1;
}

.upload-area-modern.drag-over {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
  transform: scale(1.02);
  box-shadow: 
    0 25px 50px rgba(99, 102, 241, 0.2),
    0 15px 30px rgba(139, 92, 246, 0.15);
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
  transform: scale(1.1);
  box-shadow: 
    0 20px 40px rgba(99, 102, 241, 0.3),
    0 0 0 20px rgba(99, 102, 241, 0.1);
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
  animation: floatUpDown 3s ease-in-out infinite;
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
  transform: rotate(5deg) scale(1.05);
  box-shadow: 
    0 12px 32px rgba(99, 102, 241, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.upload-icon-svg {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.upload-area-modern:hover .upload-icon-svg {
  transform: scale(1.1);
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
}

.upload-area-modern:hover .particle {
  opacity: 0.6;
  animation: particleFloat 3s ease-in-out infinite;
}

.particle-1 {
  top: 20%;
  right: 20%;
  animation-delay: 0s;
}

.particle-2 {
  bottom: 25%;
  left: 15%;
  animation-delay: 1s;
  width: 6px;
  height: 6px;
}

.particle-3 {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
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
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
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
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 12px 32px rgba(99, 102, 241, 0.4),
    0 6px 16px rgba(139, 92, 246, 0.3);
}

.upload-button-modern:active {
  transform: translateY(-1px) scale(1.02);
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
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
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

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  margin-top: 24px;
}

.btn-cancel,
.btn-save {
  flex: 1;
  max-width: 48%;
  min-height: 48px;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
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
  background: var(--button-secondary-bg);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-cancel:hover {
  background: var(--button-secondary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-save {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn-save svg {
  width: 20px;
  height: 20px;
}

.dashboard-dark .modal-container-large {
  --card-background: #1e1e2e;
  --text-primary: #e5e5f0;
  --text-secondary: #a0a0b8;
  --border-color: #2d2d44;
  --hover-background: #2d2d44;
  --input-background: #151521;
  --button-secondary-bg: #2d2d44;
  --button-secondary-hover: #383852;
  --header-gradient: linear-gradient(135deg, rgba(30, 30, 46, 0.8) 0%, rgba(30, 30, 46, 1) 100%);
  --upload-background: #151521;
  --upload-hover: rgba(99, 102, 241, 0.05);
  --info-background: rgba(99, 102, 241, 0.1);
}

.dashboard-light .modal-container-large {
  --card-background: #ffffff;
  --text-primary: #1a1a2e;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --hover-background: #f3f4f6;
  --input-background: #f9fafb;
  --button-secondary-bg: #f3f4f6;
  --button-secondary-hover: #e5e7eb;
  --header-gradient: linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(255, 255, 255, 1) 100%);
  --upload-background: #f9fafb;
  --upload-hover: rgba(99, 102, 241, 0.03);
  --info-background: rgba(99, 102, 241, 0.05);
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