

<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container-wizard">
      <!-- Header com Progresso -->
      <div class="modal-header">
        <div class="header-content">
          <div class="modal-icon">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h2 class="modal-title">{{ isEditing ? 'Editar Plano de Treino' : 'Novo Plano de Treino' }}</h2>
            <p class="modal-subtitle">Etapa {{ currentStep }} de 4 - {{ stepTitles[currentStep - 1] }}</p>
          </div>
        </div>

        <button class="modal-close" @click="closeModal">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Barra de Progresso -->
      <div class="progress-stepper">
        <div 
          v-for="(step, index) in stepTitles" 
          :key="index"
          class="step-item"
          :class="{
            'active': currentStep === index + 1,
            'completed': currentStep > index + 1
          }"
        >
          <div class="step-circle">
            <svg v-if="currentStep > index + 1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="step-label">{{ step }}</div>
          <div v-if="index < stepTitles.length - 1" class="step-line"></div>
        </div>
      </div>

      <!-- Corpo do Modal -->
      <div class="modal-body">
        <!-- ETAPA 1: Informações do Plano -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="step-header">
            <div class="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <div>
              <h3 class="step-title">Informações Básicas do Plano</h3>
              <p class="step-description">Defina o nome, objetivo e quantas divisões seu treino terá</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                </svg>
                Nome do Plano *
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="Ex: Hipertrofia Avançada, Treino ABC, Funcional..."
                required
              />
            </div>

            <div class="form-group full-width">
              <label class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                </svg>
                Descrição (Opcional)
              </label>
              <textarea
                v-model="formData.description"
                class="form-textarea"
                placeholder="Descreva os objetivos e características deste plano de treino..."
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
                Objetivo do Treino *
              </label>
              <select v-model="formData.goal" class="form-select" required>
                <option value="">Selecione o objetivo...</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="emagrecimento">Emagrecimento</option>
                <option value="forca">Força</option>
                <option value="condicionamento">Condicionamento Físico</option>
                <option value="resistencia">Resistência</option>
                <option value="funcional">Funcional</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                Número de Divisões *
              </label>
              <select v-model.number="numberOfDivisions" class="form-select" required @change="initializeDivisions">
                <option value="">Quantas divisões?</option>
                <option value="1">1 Divisão (Full Body)</option>
                <option value="2">2 Divisões (AB)</option>
                <option value="3">3 Divisões (ABC)</option>
                <option value="4">4 Divisões (ABCD)</option>
                <option value="5">5 Divisões (ABCDE)</option>
                <option value="6">6 Divisões (ABCDEF)</option>
              </select>
            </div>
          </div>

          <div v-if="numberOfDivisions > 0" class="info-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <div>
              <strong>Você criará {{ numberOfDivisions }} {{ numberOfDivisions === 1 ? 'divisão' : 'divisões' }} de treino</strong>
              <p>Na próxima etapa, você definirá o nome e grupos musculares de cada divisão</p>
            </div>
          </div>
        </div>

        <!-- ETAPA 2: Divisões de Treino -->
        <div v-else-if="currentStep === 2" class="step-content">
          <div class="step-header">
            <div class="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div>
              <h3 class="step-title">Definir Divisões de Treino</h3>
              <p class="step-description">Configure cada divisão com nome e grupos musculares trabalhados</p>
            </div>
          </div>

          <!-- Carrossel das Divisões -->
          <div class="divisions-carousel">
            <div class="carousel-container">
              <div 
                class="carousel-track"
                :style="{ transform: `translateX(-${currentDivisionIndex * 100}%)` }"
              >
                <div 
                  v-for="(division, index) in formData.divisions" 
                  :key="index"
                  class="carousel-slide"
                >
                  <div 
                    class="division-card-enhanced"
                    :class="{ 'filled': division.name && division.muscleGroups.length > 0 }"
                  >
                    <!-- Indicador de divisão no canto superior direito -->
                    <div class="division-indicator">
                      <span class="division-index">Divisão {{ currentDivisionIndex + 1 }} de {{ numberOfDivisions }}</span>
                    </div>

                    <!-- Header melhorado -->
                    <div class="division-header-enhanced">
                <div class="division-badge">
                  <div class="division-letter">{{ getDivisionLetter(index) }}</div>
                  <div class="division-status">
                    <svg v-if="division.name && division.muscleGroups.length > 0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <div class="division-title-section">
                  <h4>Divisão {{ getDivisionLetter(index) }}</h4>
                  <p class="division-subtitle">
                    {{ division.muscleGroups.length > 0 ? 
                        `${division.muscleGroups.length} grupo${division.muscleGroups.length !== 1 ? 's' : ''} muscular${division.muscleGroups.length !== 1 ? 'es' : ''}` : 
                        'Configurar grupos musculares' 
                    }}
                  </p>
                </div>
              </div>

              <!-- Conteúdo do formulário -->
              <div class="division-content">
                <div class="form-row">
                  <div class="form-group-enhanced">
                    <label class="form-label-enhanced">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                      </svg>
                      Nome da Divisão
                      <span class="required-indicator">*</span>
                    </label>
                    <input
                      v-model="division.name"
                      type="text"
                      class="form-input-enhanced"
                      :placeholder="`Ex: Treino ${getDivisionLetter(index)} - Peito e Tríceps`"
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group-enhanced">
                    <label class="form-label-enhanced">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Descrição
                      <span class="optional-indicator">(Opcional)</span>
                    </label>
                    <textarea
                      v-model="division.description"
                      class="form-textarea-enhanced"
                      placeholder="Ex: Foco em volume para hipertrofia, trabalho de força..."
                      rows="2"
                    ></textarea>
                  </div>
                </div>

                <!-- Seletor de grupos musculares aprimorado -->
                <div class="muscle-groups-section">
                  <label class="form-label-enhanced muscle-groups-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <polyline points="17 11 19 13 23 9"/>
                    </svg>
                    Grupos Musculares
                    <span class="required-indicator">*</span>
                  </label>

                  <!-- Seletor de grupos musculares -->
                  <div class="muscle-groups-selector-enhanced">
                    <div class="muscle-groups-grid">
                      <label 
                        v-for="muscle in availableMuscleGroups" 
                        :key="muscle"
                        class="muscle-checkbox-enhanced"
                        :class="{ 'selected': division.muscleGroups.includes(muscle) }"
                      >
                        <input
                          type="checkbox"
                          :value="muscle"
                          v-model="division.muscleGroups"
                          class="muscle-checkbox-input"
                        />
                        <div class="muscle-checkbox-content">
                          <div class="muscle-icon">
                            <i :class="getMuscleGroupIcon(muscle)"></i>
                          </div>
                          <div class="checkbox-indicator">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span class="muscle-name">{{ muscle }}</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <!-- Músculos selecionados (versão original) -->
                  <div v-if="division.muscleGroups.length > 0" class="selected-muscles">
                    <span 
                      v-for="muscle in division.muscleGroups" 
                      :key="muscle"
                      class="muscle-tag"
                    >
                      {{ muscle }}
                      <button @click="removeMuscleGroup(currentDivisionIndex, muscle)" type="button">×</button>
                    </span>
                  </div>
                </div>

                <!-- Botão para avançar etapa -->
                <div class="division-content-footer">
                  <button 
                    @click.stop="handleDivisionNextButton" 
                    class="btn-save"
                    :disabled="!canProceedFromCurrentDivision"
                    type="button"
                  >
                    {{ currentDivisionIndex < numberOfDivisions - 1 ? 'Próxima Divisão' : 'Próxima Etapa' }}
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ETAPA 3: Exercícios por Divisão -->
        <div v-else-if="currentStep === 3" class="step-content step-exercises">
          <div class="step-header">
            <div class="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h3 class="step-title">Adicionar Exercícios</h3>
              <p class="step-description">Selecione exercícios do catálogo e configure para cada divisão</p>
            </div>
          </div>

          <!-- Layout em 2 colunas -->
          <div class="exercises-layout">
            <!-- COLUNA ESQUERDA: Catálogo -->
            <div class="catalog-column">
              <!-- Dropdown Moderno de Divisões -->
              <div class="division-dropdown-modern">
                <div class="dropdown-header" @click="toggleDivisionDropdown" :class="{ open: divisionDropdownOpen }">
                  <div class="dropdown-current">
                    <div class="current-badge">{{ getDivisionLetter(activeDivision) }}</div>
                    <div class="current-info">
                      <span class="current-name">{{ formData.divisions[activeDivision].name }}</span>
                      <span class="current-meta">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                          <path d="M2 17l10 5 10-5"/>
                          <path d="M2 12l10 5 10-5"/>
                        </svg>
                        {{ formData.divisions[activeDivision].exercises.length }} exercícios • 
                        {{ formData.divisions[activeDivision].muscleGroups.length }} grupos
                      </span>
                    </div>
                  </div>
                  <svg class="dropdown-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

                <transition name="dropdown-fade">
                  <div v-if="divisionDropdownOpen" class="dropdown-menu" @click.stop>
                    <div
                      v-for="(division, index) in formData.divisions"
                      :key="index"
                      @click="selectDivisionFromDropdown(index)"
                      class="dropdown-item"
                      :class="{ active: activeDivision === index }"
                    >
                      <div class="item-badge">{{ getDivisionLetter(index) }}</div>
                      <div class="item-content">
                        <div class="item-name">{{ division.name }}</div>
                        <div class="item-stats">
                          <span class="stat-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                              <path d="M2 17l10 5 10-5"/>
                              <path d="M2 12l10 5 10-5"/>
                            </svg>
                            {{ division.exercises.length }}
                          </span>
                          <span class="stat-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                              <circle cx="8.5" cy="7" r="4"/>
                            </svg>
                            {{ division.muscleGroups.length }}
                          </span>
                        </div>
                      </div>
                      <svg v-if="activeDivision === index" class="item-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Busca de Exercícios -->
              <div class="search-box-compact">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  v-model="exerciseSearch"
                  @input="handleExerciseSearchChange"
                  type="text"
                  class="search-input"
                  placeholder="Buscar exercícios..."
                />
              </div>

              <!-- Loading State -->
              <div v-if="loadingExercises" class="loading-state">
                <div class="spinner"></div>
                <p>Carregando exercícios...</p>
              </div>

              <!-- Grid de Exercícios do Catálogo -->
              <div v-else-if="filteredExercises.length > 0" class="catalog-content">
                <div class="exercise-catalog-grid-new">
                  <div
                    v-for="exercise in paginatedExercises"
                    :key="exercise._id"
                    @click="openExerciseModal(exercise)"
                    class="exercise-catalog-card-new"
                  >
                    <div class="exercise-image-new">
                      <img v-if="exercise.image" :src="getImageUrl(exercise.image)" :alt="exercise.name" />
                      <div v-else class="no-image-placeholder-new">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                      </div>
                      <div class="add-overlay">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </div>
                    </div>
                    <div class="exercise-info-new">
                      <h5>{{ exercise.name }}</h5>
                      <span v-if="exercise.muscleGroup" class="muscle-badge-new">
                        {{ exercise.muscleGroup }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Paginação Compacta -->
                <div class="pagination-compact">
                  <button 
                    @click="changeExercisePage(exerciseCurrentPage - 1)" 
                    :disabled="exerciseCurrentPage === 1"
                    class="pagination-btn-compact"
                    type="button"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <span class="pagination-text">{{ exerciseCurrentPage }} / {{ totalExercisePages }}</span>
                  <button 
                    @click="changeExercisePage(exerciseCurrentPage + 1)" 
                    :disabled="exerciseCurrentPage === totalExercisePages"
                    class="pagination-btn-compact"
                    type="button"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <p>Nenhum exercício encontrado</p>
              </div>
            </div>

            <!-- COLUNA DIREITA: Exercícios Adicionados -->
            <div class="added-column">
              <h4 class="added-column-title">
                Exercícios Adicionados
                <span class="exercise-count-badge">{{ formData.divisions[activeDivision].exercises.length }}</span>
              </h4>

              <div v-if="formData.divisions[activeDivision].exercises.length === 0" class="empty-added">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p>Nenhum exercício adicionado</p>
                <small>Clique nos exercícios ao lado para adicionar</small>
              </div>

              <div v-else class="added-exercises-list">
                <div 
                  v-for="(exercise, exIndex) in formData.divisions[activeDivision].exercises"
                  :key="exIndex"
                  class="added-exercise-card"
                >
                  <div class="exercise-card-header">
                    <div class="exercise-number">{{ exIndex + 1 }}</div>
                    <h5>{{ exercise.name }}</h5>
                    <div class="exercise-actions">
                      <button @click="editExerciseInList(activeDivision, exIndex)" class="btn-icon-small" type="button" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button @click="removeExercise(activeDivision, exIndex)" class="btn-icon-small btn-delete" type="button" title="Remover">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="exercise-card-details">
                    <div class="detail-item">
                      <span class="detail-label">Séries:</span>
                      <span class="detail-value">{{ exercise.sets }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Reps:</span>
                      <span class="detail-value">{{ exercise.reps }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Carga:</span>
                      <span class="detail-value">{{ exercise.isBodyweight ? 'Corporal' : exercise.idealWeight + 'kg' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Descanso:</span>
                      <span class="detail-value">{{ exercise.restTime }}s</span>
                    </div>
                  </div>
                  <div v-if="exercise.toFailure || exercise.notes" class="exercise-card-footer">
                    <span v-if="exercise.toFailure" class="tag-failure">Até a Falha</span>
                    <span v-if="exercise.notes" class="exercise-notes">{{ exercise.notes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de Configuração de Exercício -->
        <div v-if="showExerciseModal" class="exercise-modal-overlay" @click.self="closeExerciseModal">
          <div class="exercise-modal">
            <div class="exercise-modal-header">
              <h3>{{ editingExerciseIndex !== null ? 'Editar Exercício' : 'Configurar Exercício' }}</h3>
              <button @click="closeExerciseModal" class="modal-close-btn" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="exercise-modal-body">
              <div class="exercise-modal-preview">
                <img v-if="tempExercise.image" :src="getImageUrl(tempExercise.image)" :alt="tempExercise.name" />
                <div v-else class="preview-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
              </div>

              <div class="exercise-modal-form">
                <div class="form-group-modal">
                  <label>Nome do Exercício</label>
                  <input
                    v-model="tempExercise.name"
                    type="text"
                    class="form-input-modal"
                    placeholder="Nome do exercício"
                    readonly
                  />
                </div>

                <div class="form-row-modal">
                  <div class="form-group-modal">
                    <label>Séries</label>
                    <input
                      v-model.number="tempExercise.sets"
                      type="number"
                      class="form-input-modal"
                      min="1"
                      placeholder="3"
                    />
                  </div>
                  <div class="form-group-modal">
                    <label>Repetições</label>
                    <input
                      v-model.number="tempExercise.reps"
                      type="number"
                      class="form-input-modal"
                      min="1"
                      placeholder="12"
                    />
                  </div>
                </div>

                <div class="form-group-modal">
                  <label>Carga (kg)</label>
                  <input
                    v-model.number="tempExercise.idealWeight"
                    type="number"
                    class="form-input-modal"
                    min="0"
                    step="0.5"
                    placeholder="20"
                    :disabled="tempExercise.isBodyweight"
                  />
                </div>

                <div class="form-group-modal">
                  <label class="checkbox-label-modal">
                    <input
                      type="checkbox"
                      v-model="tempExercise.isBodyweight"
                      @change="handleTempBodyweightChange"
                    />
                    <span class="checkbox-text">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Peso Corporal
                    </span>
                  </label>
                </div>

                <div class="form-group-modal">
                  <label>Descanso (segundos)</label>
                  <input
                    v-model.number="tempExercise.restTime"
                    type="number"
                    class="form-input-modal"
                    min="0"
                    step="5"
                    placeholder="60"
                  />
                </div>

                <div class="form-group-modal">
                  <label class="checkbox-label-modal">
                    <input
                      type="checkbox"
                      v-model="tempExercise.toFailure"
                    />
                    <span class="checkbox-text">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
                      </svg>
                      Ir até a falha
                    </span>
                  </label>
                </div>

                <div class="form-group-modal">
                  <label>Observações</label>
                  <textarea
                    v-model="tempExercise.notes"
                    class="form-textarea-modal"
                    placeholder="Observações sobre execução, técnica, etc..."
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="exercise-modal-footer">
              <button @click="closeExerciseModal" class="btn-modal-cancel" type="button">
                Cancelar
              </button>
              <button @click="saveExerciseFromModal" class="btn-modal-save" type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ editingExerciseIndex !== null ? 'Salvar Alterações' : 'Adicionar Exercício' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ETAPA 4: Vincular Alunos (Opcional) -->
        <div v-else-if="currentStep === 4" class="step-content">
          <div class="step-header">
            <div class="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h3 class="step-title">Vincular Alunos (Opcional)</h3>
              <p class="step-description">Selecione os alunos que usarão este plano de treino</p>
            </div>
          </div>

          <div class="optional-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            Esta etapa é opcional. Você pode vincular alunos agora ou depois.
          </div>

          <div class="search-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              v-model="studentSearch"
              type="text"
              class="search-input"
              placeholder="Buscar alunos por nome ou email..."
            />
          </div>

          <div v-if="loadingStudents" class="loading-students">
            <div class="spinner"></div>
            <p>Carregando alunos...</p>
          </div>

          <div v-else-if="availableStudents.length === 0" class="empty-students">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <p>Nenhum aluno encontrado</p>
          </div>

          <div v-else class="students-grid">
            <!-- Debug: {{ filteredStudents.length }} alunos filtrados -->
            <label 
              v-for="student in filteredStudents" 
              :key="student._id"
              class="student-card"
              :class="{ selected: selectedStudents.includes(student._id) }"
            >
              <input
                type="checkbox"
                :value="student._id"
                v-model="selectedStudents"
                class="student-checkbox"
              />
              <div class="student-avatar">
                <img v-if="student.profileImage" :src="student.profileImage" :alt="student.name || student.fullName || 'Aluno'" />
                <div v-else class="avatar-placeholder">
                  {{ getInitials(student.name || student.fullName || 'Aluno') }}
                </div>
              </div>
              <div class="student-info">
                <h5>{{ student.name || student.fullName || 'Nome não disponível' }}</h5>
                <p>{{ student.email || 'Email não disponível' }}</p>
              </div>
              <div class="student-check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </label>
          </div>

          <div v-if="selectedStudents.length > 0" class="selected-count">
            {{ selectedStudents.length }} {{ selectedStudents.length === 1 ? 'aluno selecionado' : 'alunos selecionados' }}
          </div>
        </div>
      </div>

      <!-- Footer com Ações -->
      <div class="modal-footer">
        <button 
          v-if="currentStep > 1"
          @click="previousStep" 
          class="btn-cancel"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar
        </button>
        <button 
          v-else
          @click="closeModal" 
          class="btn-cancel"
          type="button"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Cancelar
        </button>

        <button 
          v-if="currentStep < 4"
          @click="nextStep" 
          class="btn-save"
          :disabled="!canProceedToNextStep"
          type="button"
        >
          Próxima Etapa
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </button>
        <button 
          v-else
          @click="savePlan" 
          class="btn-save"
          :disabled="!isFormValid || isSaving"
          type="button"
        >
          <div v-if="isSaving" class="spinner-small"></div>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Plano') }}
        </button>
      </div>
    </div>

    <!-- Notification Modal -->
    <NotificationModal
      v-model:visible="notification.visible"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
      @close="notification.visible = false"
    />

    <!-- Confirmation Modal -->
    <div v-if="confirmation.visible" class="modal-overlay" style="z-index: 10000;" @click.self="cancelConfirmation">
      <div class="confirmation-modal" @click.stop>
        <div class="confirmation-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 class="confirmation-title">{{ confirmation.title }}</h3>
        <p class="confirmation-message">{{ confirmation.message }}</p>
        <div class="confirmation-actions">
          <button class="btn-confirm-cancel" @click="cancelConfirmation">
            Cancelar
          </button>
          <button class="btn-confirm-ok" @click="confirmAction">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NotificationModal from './NotificationModal.vue'

export default {
  name: 'WorkoutPlanModalWizard',
  components: {
    NotificationModal
  },
  props: {
    show: Boolean,
    isEditing: Boolean,
    planData: Object
  },
  emits: ['close', 'save'],
  data() {
    return {
      currentStep: 1,
      activeDivision: 0,
      currentDivisionIndex: 0, // Novo: controla qual divisão está sendo exibida no carrossel
      numberOfDivisions: 0,
      studentSearch: '',
      selectedStudents: [],
      availableStudents: [],
      loadingStudents: false,
      exerciseSearch: '',
      availableExercises: [],
      loadingExercises: false,
      exerciseCurrentPage: 1,
      exercisesPerPage: 6,
      isSaving: false,
      
      // Modal de exercício
      showExerciseModal: false,
      editingExerciseIndex: null,
      tempExercise: {
        exerciseId: null,
        name: '',
        sets: 3,
        reps: 12,
        idealWeight: 0,
        isBodyweight: false,
        restTime: 60,
        toFailure: false,
        notes: '',
        image: null
      },
      
      notification: {
        visible: false,
        type: 'info',
        title: '',
        message: ''
      },
      
      confirmation: {
        visible: false,
        title: '',
        message: '',
        onConfirm: null
      },
      
      stepTitles: [
        'Informações do Plano',
        'Divisões de Treino',
        'Exercícios',
        'Vincular Alunos'
      ],

      availableMuscleGroups: [
        'Peito', 'Costas', 'Ombro', 'Bíceps', 'Tríceps',
        'Antebraço', 'Quadríceps', 'Posterior', 'Glúteo',
        'Panturrilha', 'Abdômen', 'Core', 'Trapézio'
      ],

      formData: {
        name: '',
        description: '',
        goal: '',
        divisions: []
      },

      // Estado inicial para comparar se houve alterações
      initialFormData: {
        name: '',
        description: '',
        goal: '',
        divisions: []
      },

      initialSelectedStudents: [],
      
      // Controle do dropdown de divisões
      divisionDropdownOpen: false
    }
  },

  computed: {
    filteredStudents() {      
      if (!this.studentSearch) {
        return this.availableStudents;
      }
      
      const search = this.studentSearch.toLowerCase();
      const filtered = this.availableStudents.filter(student => {
        const studentName = (student.name || student.fullName || '').toLowerCase();
        const studentEmail = (student.email || '').toLowerCase();
        return studentName.includes(search) || studentEmail.includes(search);
      });
      
      return filtered;
    },

    filteredExercises() {
      // Garantir que availableExercises sempre seja um array
      if (!Array.isArray(this.availableExercises)) {
        console.warn('⚠️ availableExercises não é um array:', this.availableExercises);
        return [];
      }
      
      if (!this.exerciseSearch) return this.availableExercises;
      const search = this.exerciseSearch.toLowerCase();
      return this.availableExercises.filter(exercise => 
        exercise.name.toLowerCase().includes(search) ||
        (exercise.description && exercise.description.toLowerCase().includes(search))
      );
    },

    totalExercisePages() {
      return Math.ceil(this.filteredExercises.length / this.exercisesPerPage);
    },

    paginatedExercises() {
      const start = (this.exerciseCurrentPage - 1) * this.exercisesPerPage;
      const end = start + this.exercisesPerPage;
      return this.filteredExercises.slice(start, end);
    },

    canProceedToNextStep() {
      if (this.currentStep === 1) {
        return this.formData.name.trim() !== '' && 
               this.formData.goal !== '' && 
               this.numberOfDivisions > 0;
      }
      if (this.currentStep === 2) {
        return this.formData.divisions.every(d => 
          d.name.trim() !== '' && d.muscleGroups.length > 0
        );
      }
      if (this.currentStep === 3) {
        return this.formData.divisions.every(d => d.exercises.length > 0);
      }
      return true;
    },

    canProceedFromCurrentDivision() {
      // Valida apenas a divisão atual
      if (this.currentStep === 2 && this.formData.divisions[this.currentDivisionIndex]) {
        const currentDivision = this.formData.divisions[this.currentDivisionIndex];
        return currentDivision.name.trim() !== '' && currentDivision.muscleGroups.length > 0;
      }
      return true;
    },

    hasFormChanges() {
      // Compara os dados atuais com o estado inicial
      const formChanged = JSON.stringify(this.formData) !== JSON.stringify(this.initialFormData);
      const studentsChanged = JSON.stringify(this.selectedStudents) !== JSON.stringify(this.initialSelectedStudents);
      
      return formChanged || studentsChanged;
    },

    isFormValid() {
      return this.formData.name.trim() !== '' &&
             this.formData.goal !== '' &&
             this.formData.divisions.length > 0 &&
             this.formData.divisions.every(d => 
               d.name.trim() !== '' && 
               d.exercises.length > 0 &&
               d.exercises.every(e => 
                 e.name.trim() !== '' && 
                 e.sets > 0 && 
                 e.reps > 0 && 
                 e.idealWeight >= 0
               )
             );
    }
  },

  watch: {
    show(newVal) {
      if (newVal) {        
        // Só inicializa se NÃO estiver em modo de edição
        // Em modo de edição, deixa os watchers de isEditing/planData cuidarem
        if (!this.isEditing) {
          this.initializeForm();
        }
        
        if (this.currentStep === 4) {
          this.fetchStudents();
        }
      }
    },
    
    isEditing: {
      immediate: true,
      handler(newVal, oldVal) {
        console.log('🔄 Watch isEditing:', { newVal, oldVal, planData: this.planData });
        
        // Se entrou em modo de edição e tem dados do plano
        if (newVal && this.planData && this.planData._id) {
          this.initializeForm();
        }
      }
    },
    
    planData: {
      immediate: true,
      deep: true,
      handler(newPlanData) {
        // Se está em modo de edição e recebeu dados do plano
        if (this.isEditing && newPlanData && newPlanData._id) {
          this.initializeForm();
        }
      }
    },
    
    currentStep(newVal) {
      if (newVal === 3 && this.availableExercises.length === 0) {
        this.fetchExercises();
      }
      if (newVal === 4 && this.availableStudents.length === 0) {
        this.fetchStudents();
      }
    }
  },

  mounted() {
    // Adicionar listener para navegação por teclado
    document.addEventListener('keydown', this.handleKeyboardNavigation);
  },

  beforeUnmount() {
    // Remover listener para evitar memory leaks
    document.removeEventListener('keydown', this.handleKeyboardNavigation);
  },

  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      // Remove barra inicial se existir para evitar barra dupla
      const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      return `http://localhost:3000/${cleanPath}`;
    },

    initializeForm() {
      if (this.planData && this.isEditing) {        
        // Criar cópia profunda dos dados
        const planCopy = JSON.parse(JSON.stringify(this.planData));
        
        // Garantir que divisions está definido
        if (!planCopy.divisions || !Array.isArray(planCopy.divisions)) {
          planCopy.divisions = [];
        }
        
        // Garantir que cada divisão tem exercises
        planCopy.divisions.forEach(div => {
          if (!div.exercises || !Array.isArray(div.exercises)) {
            div.exercises = [];
          }
          if (!div.muscleGroups || !Array.isArray(div.muscleGroups)) {
            div.muscleGroups = [];
          }
          
          // Converter isBodyweight baseado em idealWeight
          div.exercises.forEach(ex => {
            ex.isBodyweight = ex.idealWeight === 0;
          });
        });
        
        this.formData = planCopy;
        this.numberOfDivisions = this.formData.divisions.length;
        
        // Mapear assignedStudents (pode ser array de objetos ou de IDs)
        if (Array.isArray(this.planData.assignedStudents)) {
          this.selectedStudents = this.planData.assignedStudents.map(s => {
            return typeof s === 'string' ? s : (s._id || s);
          });
        } else {
          this.selectedStudents = [];
        }
        
        // Salva o estado inicial após carregar os dados de edição
        this.saveInitialState();
      } else {
        this.resetForm();
      }
    },

    resetForm() {
      this.currentStep = 1;
      this.activeDivision = 0;
      this.numberOfDivisions = 0;
      this.selectedStudents = [];
      this.isSaving = false;
      this.formData = {
        name: '',
        description: '',
        goal: '',
        divisions: []
      };
      
      // Salva o estado inicial
      this.saveInitialState();
    },

    saveInitialState() {
      // Salva uma cópia profunda do estado atual como estado inicial
      this.initialFormData = JSON.parse(JSON.stringify(this.formData));
      this.initialSelectedStudents = [...this.selectedStudents];
    },

    initializeDivisions() {
      this.formData.divisions = [];
      for (let i = 0; i < this.numberOfDivisions; i++) {
        this.formData.divisions.push({
          name: '',
          description: '',
          muscleGroups: [],
          exercises: []
        });
      }
      // Resetar o carrossel para a primeira divisão
      this.currentDivisionIndex = 0;
    },

    getDivisionLetter(index) {
      return String.fromCharCode(65 + index); // A, B, C, D...
    },

    getMuscleGroupIcon(muscle) {
      const icons = {
        'Peito': 'fas fa-male',
        'Costas': 'fas fa-user-friends',
        'Ombro': 'fas fa-expand-arrows-alt',
        'Bíceps': 'fas fa-fist-raised',
        'Tríceps': 'fas fa-hand-paper',
        'Antebraço': 'fas fa-hand-rock',
        'Quadríceps': 'fas fa-running',
        'Posterior': 'fas fa-walking',
        'Glúteo': 'fas fa-chair',
        'Panturrilha': 'fas fa-shoe-prints',
        'Abdômen': 'fas fa-crosshairs',
        'Core': 'fas fa-circle-notch',
        'Trapézio': 'fas fa-mountain'
      };
      return icons[muscle] || 'fas fa-dumbbell';
    },

    removeMuscleGroup(divisionIndex, muscle) {
      const division = this.formData.divisions[divisionIndex];
      division.muscleGroups = division.muscleGroups.filter(m => m !== muscle);
    },

    clearAllMuscleGroups(divisionIndex) {
      this.formData.divisions[divisionIndex].muscleGroups = [];
    },

    // Métodos do carrossel de divisões
    goToDivision(index) {
      this.currentDivisionIndex = index;
    },

    nextDivision() {
      if (this.currentDivisionIndex < this.formData.divisions.length - 1) {
        this.currentDivisionIndex++;
      }
    },

    previousDivision() {
      if (this.currentDivisionIndex > 0) {
        this.currentDivisionIndex--;
      }
    },

    // Navegação por teclado
    handleKeyboardNavigation(event) {
      // Só navegar se estivermos na etapa 2 (divisões)
      if (this.currentStep !== 2) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.previousDivision();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.nextDivision();
      }
    },

    addExerciseToDivision(divisionIndex, exerciseData = null) {
      if (exerciseData) {
        // Adicionar exercício do catálogo
        this.formData.divisions[divisionIndex].exercises.push({
          exerciseId: exerciseData._id,
          name: exerciseData.name,
          sets: 3,
          reps: 12,
          idealWeight: 0,
          isBodyweight: false,
          restTime: 60,
          toFailure: false,
          notes: ''
        });
      } else {
        // Adicionar exercício em branco
        this.formData.divisions[divisionIndex].exercises.push({
          name: '',
          sets: 3,
          reps: 12,
          idealWeight: 0,
          isBodyweight: false,
          restTime: 60,
          toFailure: false,
          notes: ''
        });
      }
    },

    openExerciseModal(exerciseData) {
      this.tempExercise = {
        exerciseId: exerciseData._id,
        name: exerciseData.name,
        sets: 3,
        reps: 12,
        idealWeight: 0,
        isBodyweight: false,
        restTime: 60,
        toFailure: false,
        notes: '',
        image: exerciseData.image || null
      };
      this.editingExerciseIndex = null;
      this.showExerciseModal = true;
    },

    editExerciseInList(divisionIndex, exerciseIndex) {
      const exercise = this.formData.divisions[divisionIndex].exercises[exerciseIndex];
      this.tempExercise = { ...exercise };
      this.editingExerciseIndex = exerciseIndex;
      this.showExerciseModal = true;
    },

    closeExerciseModal() {
      this.showExerciseModal = false;
      this.editingExerciseIndex = null;
      this.tempExercise = {
        exerciseId: null,
        name: '',
        sets: 3,
        reps: 12,
        idealWeight: 0,
        isBodyweight: false,
        restTime: 60,
        toFailure: false,
        notes: '',
        image: null
      };
    },

    saveExerciseFromModal() {
      if (this.editingExerciseIndex !== null) {
        // Editando exercício existente
        const exerciseData = {
          exerciseId: this.tempExercise.exerciseId,
          name: this.tempExercise.name,
          sets: this.tempExercise.sets,
          reps: this.tempExercise.reps,
          idealWeight: this.tempExercise.idealWeight,
          isBodyweight: this.tempExercise.isBodyweight,
          restTime: this.tempExercise.restTime,
          toFailure: this.tempExercise.toFailure,
          notes: this.tempExercise.notes
        };
        this.formData.divisions[this.activeDivision].exercises[this.editingExerciseIndex] = exerciseData;
      } else {
        // Adicionando novo exercício
        const exerciseData = {
          exerciseId: this.tempExercise.exerciseId,
          name: this.tempExercise.name,
          sets: this.tempExercise.sets,
          reps: this.tempExercise.reps,
          idealWeight: this.tempExercise.idealWeight,
          isBodyweight: this.tempExercise.isBodyweight,
          restTime: this.tempExercise.restTime,
          toFailure: this.tempExercise.toFailure,
          notes: this.tempExercise.notes
        };
        this.formData.divisions[this.activeDivision].exercises.push(exerciseData);
      }
      this.closeExerciseModal();
    },

    handleTempBodyweightChange() {
      if (this.tempExercise.isBodyweight) {
        this.tempExercise.idealWeight = 0;
      }
    },

    handleBodyweightChange(divisionIndex, exerciseIndex) {
      const exercise = this.formData.divisions[divisionIndex].exercises[exerciseIndex];
      if (exercise.isBodyweight) {
        exercise.idealWeight = 0;
      }
    },

    removeExercise(divisionIndex, exerciseIndex) {
      this.formData.divisions[divisionIndex].exercises.splice(exerciseIndex, 1);
    },

    async fetchExercises() {
      this.loadingExercises = true;
      
      try {
        // Buscar o ID do instrutor logado
        const userStr = sessionStorage.getItem('user');
        
        if (!userStr) {
          console.error('❌ Usuário não encontrado na sessão');
          this.availableExercises = [];
          return;
        }
        
        const user = JSON.parse(userStr);
        // CORREÇÃO: usar instructorId do objeto user (campo correto do backend)
        const instructorId = user.instructorId || user._id || user.id;
        
        if (!instructorId) {
          console.error('❌ ID do instrutor não encontrado');
          this.availableExercises = [];
          return;
        }

        const token = sessionStorage.getItem('token');
        const url = `http://localhost:3000/api/exercises/instructor/${instructorId}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
                
        if (response.ok) {
          const data = await response.json();
          
          // Garantir que sempre seja um array
          if (Array.isArray(data)) {
            this.availableExercises = data;
          } else if (data && Array.isArray(data.exercises)) {
            this.availableExercises = data.exercises;
          } else if (data && typeof data === 'object') {
            // Se for um objeto único, transforma em array
            this.availableExercises = [data];
          } else {
            this.availableExercises = [];
          }
          
          if (this.availableExercises.length === 0) {
            console.warn('⚠️ Nenhum exercício cadastrado para este instrutor!');
          }
        } else {
          const errorText = await response.text();
          console.error('❌ Erro ao buscar exercícios:', response.status, errorText);
          this.availableExercises = [];
        }
      } catch (error) {
        console.error('❌ Erro ao buscar exercícios:', error);
        this.availableExercises = [];
      } finally {
        this.loadingExercises = false;
      }
    },

    changeExercisePage(page) {
      if (page >= 1 && page <= this.totalExercisePages) {
        this.exerciseCurrentPage = page;
      }
    },

    handleExerciseSearchChange() {
      this.exerciseCurrentPage = 1; // Reset para primeira página ao buscar
    },

    toggleDivisionDropdown() {
      this.divisionDropdownOpen = !this.divisionDropdownOpen;
    },

    selectDivisionFromDropdown(index) {
      this.activeDivision = index;
      this.divisionDropdownOpen = false;
    },

    async fetchStudents() {
      this.loadingStudents = true;
      
      try {
        const token = sessionStorage.getItem('token');
        
        const response = await fetch('http://localhost:3000/api/students', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
                
        if (!response.ok) {
          let errorText;
          try {
            const errorJson = await response.json();
            errorText = JSON.stringify(errorJson);
            console.error('❌ Erro JSON:', errorJson);
          } catch {
            errorText = await response.text();
            console.error('❌ Erro Text:', errorText);
          }
          this.showNotification('error', 'Erro ao buscar alunos', `Erro ao buscar alunos: ${errorText}`);
          this.availableStudents = [];
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          
          // Normalizar estrutura dos alunos (alguns têm personalInfo, outros não)
          this.availableStudents = (Array.isArray(data) ? data : []).map(student => {
            // Se tiver personalInfo, usar esses dados
            if (student.personalInfo) {
              return {
                ...student,
                name: student.personalInfo.name || student.name,
                email: student.personalInfo.email || student.email,
                profileImage: student.personalInfo.profileImage || student.profileImage
              };
            }
            return student;
          });
          
        } else {
          console.error('❌ Erro ao buscar alunos:', response.status);
          this.availableStudents = [];
        }
      } catch (error) {
        console.error('❌ Erro ao buscar alunos:', error);
        this.availableStudents = [];
      } finally {
        this.loadingStudents = false;
      }
    },

    // Obtém as iniciais do nome do aluno (proteção contra undefined)
    getInitials(name) {
      // Validação: retorna '?' se name for undefined, null ou não for string
      if (!name || typeof name !== 'string') {
        return '?';
      }
      // Pega as 2 primeiras letras do nome
      return name
        .trim()
        .split(' ')
        .filter(n => n.length > 0)
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    },

    handleDivisionNextButton() {
      console.log('🔘 Botão clicado!');
      console.log('Step atual:', this.currentStep);
      console.log('Divisão atual:', this.currentDivisionIndex);
      console.log('Total de divisões:', this.numberOfDivisions);
      console.log('canProceedFromCurrentDivision:', this.canProceedFromCurrentDivision);
      
      // Verifica se a divisão atual está válida
      if (!this.canProceedFromCurrentDivision) {
        console.log('❌ Divisão atual não está completa');
        return;
      }
      
      // Se não for a última divisão, avança para próxima divisão
      if (this.currentDivisionIndex < this.numberOfDivisions - 1) {
        console.log('➡️ Avançando para próxima divisão');
        this.nextDivision();
      } 
      // Se for a última divisão e todas as divisões estão completas, avança para próxima etapa
      else if (this.canProceedToNextStep) {
        console.log('⏭️ Avançando para próxima etapa');
        this.currentStep++;
        if (this.currentStep === 3) {
          this.activeDivision = 0;
        }
      } else {
        console.log('⚠️ Ainda há divisões incompletas. Complete todas antes de avançar.');
      }
    },

    nextStep() {
      // Se estivermos na etapa 2 (divisões) e não for a última divisão
      if (this.currentStep === 2 && this.currentDivisionIndex < this.numberOfDivisions - 1) {
        this.nextDivision();
      } 
      // Se estivermos na etapa 2 e for a última divisão, ou qualquer outra etapa
      else if (this.canProceedToNextStep && this.currentStep < 4) {
        this.currentStep++;
        if (this.currentStep === 3) {
          this.activeDivision = 0;
        }
      }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },

    async savePlan() {
      if (!this.isFormValid || this.isSaving) return;

      this.isSaving = true;

      const planToSave = {
        ...this.formData,
        assignedStudents: this.selectedStudents
      };
      
      // Se está editando, incluir o _id
      if (this.isEditing && this.planData && this.planData._id) {
        planToSave._id = this.planData._id;
      }
      
      this.$emit('save', planToSave);
    },

    closeModal() {
      // Se não há alterações no formulário, fecha diretamente
      if (!this.hasFormChanges) {
        this.resetForm();
        this.$emit('close');
        return;
      }
      
      // Se há alterações, mostra a confirmação
      this.showConfirmation(
        'Confirmar saída',
        'Tem certeza que deseja sair? As alterações não salvas serão perdidas.',
        () => {
          this.resetForm();
          this.$emit('close');
        }
      );
    },

    showNotification(type, title, message) {
      this.notification = {
        visible: true,
        type,
        title,
        message
      };
    },

    showConfirmation(title, message, onConfirm) {
      this.confirmation = {
        visible: true,
        title,
        message,
        onConfirm
      };
    },

    confirmAction() {
      if (this.confirmation.onConfirm) {
        this.confirmation.onConfirm();
      }
      this.confirmation.visible = false;
    },

    cancelConfirmation() {
      this.confirmation.visible = false;
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Theme Variables */
.dashboard-light {
  --bg-primary: #f8f9fa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #ffffff;
  --text-primary: #1a202c;
  --text-secondary: #718096;
  --border-color: #e2e8f0;
  --border-primary: rgba(226, 232, 240, 0.6);
  --input-background: #ffffff;
  --header-gradient: linear-gradient(to bottom, #ffffff, #f8f9fa);
}

.dashboard-dark {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
  --border-primary: rgba(51, 65, 85, 0.6);
  --input-background: #0f172a;
  --header-gradient: linear-gradient(to bottom, #1e293b, #0f172a);
}

* {
  box-sizing: border-box;
}

/* ========== MODAL BASE ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container-wizard {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 1000px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ========== HEADER ========== */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.modal-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.modal-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
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

/* ========== PROGRESS STEPPER ========== */
.progress-stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem 3rem;
  position: relative;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: 3px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: #94a3b8;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

.step-item.active .step-circle {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.step-item.completed .step-circle {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.step-label {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #64748b;
  text-align: center;
  transition: all 0.3s ease;
}

.step-item.active .step-label {
  color: #3b82f6;
  font-weight: 600;
}

.step-item.completed .step-label {
  color: #10b981;
}

.step-line {
  position: absolute;
  top: 25px;
  left: 50%;
  width: 100%;
  height: 3px;
  background: #cbd5e1;
  z-index: 1;
  transition: all 0.3s ease;
}

.step-item.completed .step-line {
  background: #10b981;
  z-index: 1;
}

/* ========== CORPO DO MODAL ========== */
.modal-body {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: #ffffff;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.step-content {
  max-width: 900px;
  margin: 0 auto;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(59, 130, 246, 0.05));
  border-radius: 16px;
  border: 1px solid rgba(37, 99, 235, 0.1);
}

.step-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.step-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
}

.step-description {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #64748b;
}

/* ========== FORMULÁRIOS ========== */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.form-label i {
  color: #3b82f6;
  font-size: 14px;
}

.form-label svg {
  color: #3b82f6;
  flex-shrink: 0;
}

.form-input,
.form-select,
.form-textarea,
.form-textarea-small {
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  background: #ffffff;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus,
.form-textarea-small:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-textarea-small {
  resize: vertical;
  min-height: 60px;
}

.form-select {
  cursor: pointer;
}

/* ========== INFO BOX ========== */
.info-box,
.optional-badge {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  margin-top: 20px;
}

.info-box svg,
.optional-badge svg {
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-box strong {
  color: #1e293b;
  display: block;
  margin-bottom: 4px;
}

.info-box p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.optional-badge {
  background: rgba(251, 146, 60, 0.05);
  border-color: rgba(251, 146, 60, 0.2);
  font-size: 14px;
  color: #ea580c;
  font-weight: 500;
}

.optional-badge svg {
  color: #ea580c;
}

/* ========== DIVISÕES APRIMORADAS ========== */
.divisions-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.division-card-enhanced {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.division-card-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.division-card-enhanced:hover {
  border-color: #3b82f6;
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.division-card-enhanced:hover::before {
  opacity: 1;
}

.division-card-enhanced.filled {
  border-color: #10b981;
  background: linear-gradient(145deg, #f0fdf4, #ecfdf5);
}

.division-card-enhanced.filled::before {
  background: linear-gradient(90deg, #10b981, #059669);
  opacity: 1;
}

.division-header-enhanced {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 24px 0 24px;
  margin-bottom: 24px;
}

.division-badge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.division-letter {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  flex-shrink: 0;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.division-card-enhanced.filled .division-letter {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.division-status {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.division-card-enhanced.filled .division-status {
  opacity: 1;
  transform: scale(1);
}

.division-title-section {
  flex: 1;
}

.division-title-section h4 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.division-subtitle {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.division-content {
  padding: 0 24px 24px 24px;
}

.division-content-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 10;
}

.division-content-footer .btn-save {
  pointer-events: auto;
  cursor: pointer;
}

.form-row {
  margin-bottom: 24px;
}

.form-group-enhanced {
  width: 100%;
}

.form-label-enhanced {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-label-enhanced svg {
  color: #6b7280;
}

.required-indicator {
  color: #ef4444;
  font-weight: 700;
}

.optional-indicator {
  color: #6b7280;
  font-weight: 400;
  font-style: italic;
}

.form-input-enhanced,
.form-textarea-enhanced {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
}

.form-input-enhanced:focus,
.form-textarea-enhanced:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea-enhanced {
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}

/* ========== GRUPOS MUSCULARES APRIMORADOS ========== */
.muscle-groups-section {
  margin-top: 8px;
}

.muscle-groups-label {
  margin-bottom: 16px !important;
}

.muscle-groups-selector-enhanced {
  margin-top: 8px;
}

.muscle-groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.muscle-checkbox-enhanced {
  position: relative;
  cursor: pointer;
  display: block;
}

.muscle-checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.muscle-checkbox-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.muscle-checkbox-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.muscle-checkbox-enhanced:hover .muscle-checkbox-content {
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.muscle-checkbox-enhanced:hover .muscle-checkbox-content::before {
  opacity: 1;
}

.muscle-checkbox-enhanced.selected .muscle-checkbox-content {
  border-color: #3b82f6;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.muscle-checkbox-enhanced.selected .muscle-checkbox-content::before {
  opacity: 1;
}

.muscle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #6b7280;
  font-size: 16px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.muscle-checkbox-enhanced:hover .muscle-icon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%);
  color: #3b82f6;
  transform: scale(1.05);
}

.muscle-checkbox-enhanced.selected .muscle-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.checkbox-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.muscle-checkbox-enhanced.selected .checkbox-indicator {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-color: #3b82f6;
  color: white;
}

.checkbox-indicator svg {
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s ease;
}

.muscle-checkbox-enhanced.selected .checkbox-indicator svg {
  opacity: 1;
  transform: scale(1);
}

.muscle-checkbox-enhanced .muscle-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.muscle-checkbox-enhanced.selected .muscle-name {
  color: #1e40af;
  font-weight: 600;
}

/* ========== ETAPA 3: EXERCÍCIOS - NOVO LAYOUT ========== */
.step-exercises {
  padding: 0 !important;
  max-width: 100% !important;
}

.exercises-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  height: 500px;
}

/* COLUNA ESQUERDA: Catálogo */
.catalog-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

/* ========== DROPDOWN MODERNO DE DIVISÕES ========== */
.division-dropdown-modern {
  position: relative;
  z-index: 10;
}

.dropdown-header {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  position: relative;
}

.dropdown-header:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
  transform: translateY(-1px);
}

.dropdown-header.open {
  border-color: #3b82f6;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.dropdown-current {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.current-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
}

.current-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.current-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current-meta {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.current-meta svg {
  flex-shrink: 0;
}

.dropdown-arrow {
  color: #94a3b8;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  margin-left: 8px;
}

.dropdown-header.open .dropdown-arrow {
  transform: rotate(180deg);
  color: #3b82f6;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #3b82f6;
  border-top: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  max-height: 360px;
  overflow-y: auto;
  z-index: 100;
}

.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
  margin: 8px 0;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dropdown-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item.active {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.02));
  border-left: 3px solid #3b82f6;
  padding-left: 13px;
}

.item-badge {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.dropdown-item.active .item-badge {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-stats {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.stat-item svg {
  color: #94a3b8;
  flex-shrink: 0;
}

.item-check {
  color: #3b82f6;
  flex-shrink: 0;
  animation: checkAppear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes checkAppear {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animação do dropdown */
.dropdown-fade-enter-active {
  animation: dropdownSlideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-fade-leave-active {
  animation: dropdownSlideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dropdownSlideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dropdownSlideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Remove estilos antigos dos tabs */
.division-tabs-compact {
  display: none;
}

.search-box-compact {
  position: relative;
  flex-shrink: 0;
}

.search-box-compact .search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.search-box-compact .search-input {
  width: 100%;
  padding: 10px 14px 10px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
}

.search-box-compact .search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.catalog-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding-right: 4px;
}

.catalog-content::-webkit-scrollbar {
  width: 6px;
}

.catalog-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.catalog-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.catalog-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.exercise-catalog-grid-new {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.exercise-catalog-card-new {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.exercise-catalog-card-new:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(59, 130, 246, 0.2);
}

.exercise-image-new {
  width: 100%;
  height: 120px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.exercise-image-new img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.exercise-catalog-card-new:hover .exercise-image-new img {
  transform: scale(1.1);
}

.no-image-placeholder-new {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.add-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.exercise-catalog-card-new:hover .add-overlay {
  opacity: 1;
}

.exercise-info-new {
  padding: 12px;
}

.exercise-info-new h5 {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.muscle-badge-new {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
}

.pagination-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 0 0 0;
  border-top: 1px solid #e2e8f0;
}

.pagination-btn-compact {
  width: 32px;
  height: 32px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  padding: 0;
}

.pagination-btn-compact svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke-width: 2.5;
  transition: all 0.2s ease;
}

.pagination-btn-compact:hover:not(:disabled) {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.pagination-btn-compact:hover:not(:disabled) svg {
  transform: scale(1.1);
}

.pagination-btn-compact:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-text {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.loading-state,
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #94a3b8;
}

.loading-state .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state svg {
  color: #cbd5e1;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

/* COLUNA DIREITA: Exercícios Adicionados */
.added-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.added-column-title {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.02em;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.exercise-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 10px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }
}

.empty-added {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 30px;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  color: #94a3b8;
  position: relative;
  overflow: hidden;
}

.empty-added::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 70%);
  pointer-events: none;
}

.empty-added svg {
  color: #cbd5e1;
  opacity: 0.8;
}

.empty-added p {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #64748b;
  position: relative;
}

.empty-added small {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  position: relative;
}

.added-exercises-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
  padding-right: 4px;
}

.added-exercises-list::-webkit-scrollbar {
  width: 6px;
}

.added-exercises-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.added-exercises-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1, #94a3b8);
  border-radius: 4px;
}

.added-exercises-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94a3b8, #64748b);
}

.added-exercise-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.added-exercise-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #3b82f6, #2563eb);
  transform: scaleY(0);
  transition: transform 0.3s ease;
  transform-origin: top;
}

.added-exercise-card:hover::before {
  transform: scaleY(1);
}

.added-exercise-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.exercise-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.exercise-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.exercise-number::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

.exercise-card-header h5 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  flex: 1;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.exercise-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.btn-icon-small {
  width: 32px;
  height: 32px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
  padding: 0;
}

.btn-icon-small svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke-width: 2.5;
  transition: all 0.2s ease;
}

.btn-icon-small:hover {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-icon-small:hover svg {
  stroke-width: 2.5;
  transform: scale(1.1);
}

.btn-icon-small.btn-delete:hover {
  background: #ef4444;
  border-color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.exercise-card-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 0;
  border-top: 2px solid #f1f5f9;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.detail-item:hover {
  background: #eff6ff;
  transform: translateY(-1px);
}

.detail-label {
  color: #94a3b8;
  font-weight: 600;
}

.detail-value {
  color: #1e293b;
  font-weight: 700;
}

.exercise-card-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tag-failure {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.08));
  color: #dc2626;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  width: fit-content;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.tag-failure::before {
  content: '🔥';
  font-size: 14px;
}

.exercise-notes {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  font-weight: 500;
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

/* ========== MODAL DE EXERCÍCIO ========== */
.exercise-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.exercise-modal {
  background: white;
  border-radius: 20px;
  width: 600px;
  max-width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.exercise-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
}

.exercise-modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.modal-close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f1f5f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.modal-close-btn:hover {
  background: #ef4444;
  color: white;
  transform: rotate(90deg);
}

.exercise-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.exercise-modal-body::-webkit-scrollbar {
  width: 8px;
}

.exercise-modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.exercise-modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.exercise-modal-preview {
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.exercise-modal-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  color: #94a3b8;
}

.exercise-modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group-modal {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group-modal label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-input-modal,
.form-textarea-modal {
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.2s ease;
  font-family: inherit;
  background: white;
}

.form-input-modal:focus,
.form-textarea-modal:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input-modal:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.form-textarea-modal {
  resize: vertical;
  min-height: 80px;
}

.form-row-modal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.checkbox-label-modal {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  transition: all 0.2s ease;
}

.checkbox-label-modal:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.checkbox-label-modal input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.checkbox-text svg {
  color: #3b82f6;
}

.exercise-modal-footer {
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 2px solid #e2e8f0;
  background: #f8fafc;
}

.btn-modal-cancel,
.btn-modal-save {
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
}

.btn-modal-cancel {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-modal-cancel:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-modal-save {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.btn-modal-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}


/* ========== MÚSCULOS SELECIONADOS (VERSÃO ORIGINAL) ========== */
.selected-muscles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.muscle-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.muscle-tag button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.muscle-tag button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ========== CARROSSEL DE DIVISÕES ========== */
.division-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(29, 78, 216, 0.9));
  color: white;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  z-index: 10;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
  max-width: 140px;
  text-align: center;
}

.division-card-enhanced.filled .division-indicator {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9));
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.divisions-carousel {
  overflow: hidden;
  border-radius: 16px;
}

.carousel-container {
  width: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  width: 100%;
}

.carousel-slide .division-card-enhanced {
  margin: 0;
  width: 100%;
  position: relative;
}

/* Controles de navegação do carrossel */
.carousel-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.carousel-nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  justify-content: center;
}

.carousel-nav-btn:hover:not(:disabled) {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.carousel-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.carousel-nav-btn svg {
  flex-shrink: 0;
}

/* ========== CATÁLOGO DE EXERCÍCIOS ========== */
.exercise-catalog-section {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.catalog-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.03));
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 16px;
}

.catalog-icon {
  font-size: 28px;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.catalog-header svg {
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.catalog-header h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.catalog-header p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.exercise-catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.exercise-catalog-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.exercise-catalog-card:hover {
  border-color: #10b981;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);
}

.exercise-catalog-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exercise-catalog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.no-image-placeholder i {
  font-size: 48px;
}

.exercise-catalog-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exercise-catalog-content h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.exercise-catalog-content p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.exercise-catalog-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: auto;
}

.muscle-badge {
  padding: 4px 8px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #2563eb;
}

.empty-hint {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 8px;
}

.exercise-count {
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #2563eb;
}

/* Paginação de Exercícios */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 0;
  margin-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.pagination-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: white;
  border: 2px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-color: #3b82f6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.pagination-info span {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.pagination-info .results-count {
  font-size: 0.75rem;
  font-weight: 400;
  color: #64748b;
}

/* ========== TABS DE DIVISÕES ========== */
.division-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.division-tab {
  flex: 1;
  min-width: 150px;
  padding: 14px 18px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.division-tab:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.division-tab.active {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-color: #2563eb;
  color: white;
}

.tab-letter {
  font-size: 20px;
  font-weight: 700;
}

.tab-name {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.9;
}

.tab-count {
  font-size: 11px;
  opacity: 0.7;
}

/* ========== EXERCÍCIOS ========== */
.exercises-container {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
}

.exercises-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.exercises-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.btn-add-exercise {
  padding: 10px 18px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-add-exercise:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.empty-exercises {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px;
  color: #94a3b8;
}

.empty-exercises p {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.btn-add-first {
  padding: 12px 24px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-first:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exercise-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  position: relative;
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.exercise-number {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.exercise-number i {
  font-size: 12px;
  opacity: 0.7;
}

.exercise-number span {
  font-size: 16px;
}

.btn-remove-exercise {
  padding: 10px 12px;
  background: #fee2e2;
  border: none;
  border-radius: 10px;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn-remove-exercise:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.05);
}

.form-grid-exercise {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.checkbox-group {
  grid-column: span 2;
}

.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-checkbox:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.form-checkbox input[type="checkbox"] {
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.modern-checkbox .checkbox-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.modern-checkbox .checkbox-content i {
  font-size: 20px;
  color: #f59e0b;
  margin-top: 2px;
}

.modern-checkbox .checkbox-content div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modern-checkbox .checkbox-content strong {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  display: block;
}

.modern-checkbox .checkbox-content small {
  font-size: 12px;
  color: #64748b;
  font-weight: 400;
}

.form-checkbox span {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.form-checkbox small {
  font-size: 12px;
  color: #64748b;
}

/* ========== ALUNOS ========== */
.search-box {
  position: relative;
  margin-bottom: 24px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 16px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 14px 14px 44px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.loading-students,
.empty-students {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  color: #cbd5e1;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.student-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.student-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
}

.student-card.selected {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(59, 130, 246, 0.05));
  border-color: #2563eb;
}

.student-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.student-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-info h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-info p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-check {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: all 0.2s ease;
}

.student-card.selected .student-check {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  opacity: 1;
}

.selected-count {
  margin-top: 16px;
  padding: 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  color: #059669;
}

/* ========== FOOTER ========== */
.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 32px 48px;
  border-top: 1px solid var(--border-color);
  background: var(--header-gradient);
}

.btn-cancel,
.btn-save {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  flex: 1;
  max-width: 280px;
  min-height: 56px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  font-family: inherit;
}

.btn-cancel {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-cancel:hover {
  background: var(--bg-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.btn-save:active {
  transform: translateY(0);
}

.btn-save:disabled {
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.6;
}

/* ========== RESPONSIVIDADE ========== */
@media (max-width: 1024px) {
  .exercise-catalog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .modal-container-wizard {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header {
    padding: 24px;
  }

  .modal-body {
    padding: 24px;
  }

  .modal-footer {
    padding: 20px 24px;
    flex-direction: column;
    gap: 12px;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    max-width: 100%;
  }

  .form-grid,
  .form-grid-exercise {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .muscle-groups-selector {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Músculos selecionados responsivos */
  .selected-muscles {
    gap: 6px;
  }

  .muscle-tag {
    font-size: 12px;
    padding: 5px 10px;
  }

  /* Estilos responsivos para divisões aprimoradas */
  .muscle-groups-grid {
    grid-template-columns: 1fr;
  }

  .division-header-enhanced {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    text-align: center;
  }

  /* Estilos responsivos para carrossel */
  .division-indicator {
    top: 12px;
    right: 12px;
    font-size: 10px;
    padding: 6px 10px;
    max-width: 120px;
  }

  .division-badge {
    align-self: center;
  }

  .division-title-section {
    text-align: center;
    width: 100%;
  }

  .selected-muscles-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .division-tabs {
    flex-direction: column;
  }

  .students-grid,
  .exercise-catalog-grid {
    grid-template-columns: 1fr;
  }

  .progress-stepper {
    padding: 1.5rem 1rem;
  }
  
  .step-label {
    font-size: 0.7rem;
  }
  
  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .step-label {
    display: none;
  }
}

/* ========== PESO CORPORAL ========== */
.weight-input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bodyweight-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.03));
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bodyweight-toggle:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.05));
  border-color: rgba(16, 185, 129, 0.3);
}

.bodyweight-toggle input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #10b981;
}

.bodyweight-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #059669;
}

.bodyweight-label i {
  font-size: 14px;
}

.form-input:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

/* ========== CONFIRMATION MODAL ========== */
.confirmation-modal {
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10001;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.confirmation-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(251, 146, 60, 0.05));
  border: 3px solid rgba(251, 146, 60, 0.2);
  color: #ea580c;
}

.confirmation-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
}

.confirmation-message {
  margin: 0;
  font-size: 1rem;
  color: #64748b;
  text-align: center;
  line-height: 1.5;
}

.confirmation-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 0.5rem;
}

.btn-confirm-cancel,
.btn-confirm-ok {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-confirm-cancel {
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-confirm-cancel:hover {
  background: #e2e8f0;
  color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-confirm-ok {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-confirm-ok:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

@media (max-width: 480px) {
  .confirmation-modal {
    padding: 1.5rem;
  }

  .confirmation-icon {
    width: 64px;
    height: 64px;
  }

  .confirmation-icon svg {
    width: 40px;
    height: 40px;
  }

  .confirmation-title {
    font-size: 1.25rem;
  }

  .confirmation-message {
    font-size: 0.9rem;
  }

  .confirmation-actions {
    flex-direction: column;
  }

  /* Estilos móveis para divisões aprimoradas */
  .divisions-container {
    gap: 20px;
  }

  .division-card-enhanced {
    border-radius: 16px;
  }

  .division-header-enhanced {
    padding: 16px 16px 0 16px;
    margin-bottom: 16px;
  }

  /* Estilos móveis para carrossel */
  .division-indicator {
    top: 10px;
    right: 10px;
    font-size: 9px;
    padding: 4px 8px;
    max-width: 100px;
  }

  .division-content {
    padding: 0 16px 16px 16px;
  }

  .division-letter {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .muscle-tags-grid {
    gap: 6px;
  }

  .muscle-tag-enhanced {
    padding: 6px 10px;
    font-size: 12px;
  }

  .muscle-checkbox-content {
    padding: 12px;
  }

  .form-input-enhanced,
  .form-textarea-enhanced {
    padding: 10px 12px;
    font-size: 16px; /* Previne zoom no iOS */
  }
}
</style>
