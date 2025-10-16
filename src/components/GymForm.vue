<template>
  <div 
    v-if="showModal"
    class="modal-overlay" 
    :class="[isDarkMode ? 'dashboard-dark' : 'dashboard-light']" 
    @click.self="resetForm"
  >
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
    
    <div class="modal-container-large">
      <div class="modal-header">
        <div class="modal-header-content">
          <div class="modal-icon">
            <svg v-if="editMode" width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
            </svg>
            <svg v-else width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <div class="header-text-section">
            <h2 class="modal-title">{{ editMode ? 'Editar Academia' : 'Nova Academia' }}</h2>
            <p class="modal-subtitle">{{ getStepSubtitle }}</p>
          </div>
        </div>

        <!-- Indicador de Etapas -->
        <div class="steps-indicator">
          <div 
            class="step-item" 
            :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }"
          >
            <div class="step-circle">
              <svg v-if="currentStep > 1" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
              <span v-else>1</span>
            </div>
            <div class="step-info">
              <span class="step-label">Etapa 1</span>
              <span class="step-title">Informações</span>
            </div>
          </div>

          <div class="step-connector" :class="{ 'completed': currentStep > 1 }"></div>

          <div 
            class="step-item" 
            :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }"
          >
            <div class="step-circle">
              <svg v-if="currentStep > 2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
              <span v-else>2</span>
            </div>
            <div class="step-info">
              <span class="step-label">Etapa 2</span>
              <span class="step-title">Aparelhos</span>
            </div>
          </div>
        </div>

        <button class="modal-close" @click="resetForm">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <!-- ETAPA 1: Informações da Academia -->
        <form v-if="currentStep === 1" @submit.prevent="goToStep2">
          <div class="form-grid">
            <!-- Coluna Esquerda -->
            <div class="form-column">
              <!-- Nome da Academia -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Nome da Academia
                </label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  class="form-input"
                  placeholder="Digite o nome da academia"
                  required
                />
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
                  v-model="formData.description" 
                  class="form-textarea"
                  placeholder="Descreva a academia, seus diferenciais e instalações..."
                  rows="3"
                ></textarea>
              </div>

              <!-- Endereço -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Endereço Completo
                </label>
                <input 
                  v-model="formData.location.address" 
                  type="text" 
                  class="form-input"
                  placeholder="Rua, avenida, número"
                  required
                />
              </div>

              <!-- Cidade e Estado -->
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Cidade
                  </label>
                  <input 
                    v-model="formData.location.city" 
                    type="text" 
                    class="form-input"
                    placeholder="Cidade"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    Estado (UF)
                  </label>
                  <input 
                    v-model="formData.location.state" 
                    type="text" 
                    class="form-input"
                    placeholder="UF"
                    maxlength="2"
                    style="text-transform: uppercase;"
                    required
                  />
                </div>
              </div>

              <!-- CEP -->
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  CEP
                  <span v-if="isValidatingCep" class="cep-loading">Validando...</span>
                </label>
                <div class="cep-input-container">
                  <input 
                    v-model="formData.location.zipCode" 
                    type="text" 
                    class="form-input"
                    :class="{ 'cep-loading': isValidatingCep, 'cep-valid': cepValidated }"
                    placeholder="00000-000"
                    v-mask="'#####-###'"
                    @blur="validateCep"
                    @input="onCepInput"
                    required
                  />
                  <div v-if="isValidatingCep" class="cep-spinner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" values="0 12 12;360 12 12"/>
                      </path>
                    </svg>
                  </div>
                  <div v-else-if="cepValidated" class="cep-check">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div v-if="cepError" class="cep-error">{{ cepError }}</div>
              </div>

              <!-- Telefone e Email -->
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Telefone
                  </label>
                  <input 
                    v-model="formData.phone" 
                    type="tel" 
                    class="form-input"
                    placeholder="(00) 0000-0000"
                    v-mask="'(##) ####-####'"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    E-mail
                  </label>
                  <input 
                    v-model="formData.email" 
                    type="email" 
                    class="form-input"
                    placeholder="contato@academia.com"
                  />
                </div>
              </div>
            </div>

            <!-- Coluna Direita - Upload de Imagem -->
            <div class="form-column">
              <div class="form-group">
                <label class="form-label">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Imagem da Academia
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

                <!-- Upload Area Moderna -->
                <div 
                  v-else
                  class="upload-area-modern upload-dashed"
                  :class="{ 'drag-over': isDragging, 'uploading': isUploadingImage }"
                  @dragover.prevent="handleDragOver"
                  @dragleave.prevent="handleDragLeave"
                  @drop.prevent="handleDrop"
                  @click="triggerFileInput"
                >
                  <div class="upload-gradient-bg"></div>
                  <div class="upload-grid-pattern"></div>
                  
                  <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*"
                    class="file-input"
                    @change="handleFileSelect"
                    style="display: none;"
                    :disabled="isUploadingImage"
                  />
                  
                  <div class="upload-content-modern" v-if="!isUploadingImage">
                    <!-- Ícone Animado -->
                    <div class="upload-icon-container">
                      <div class="icon-circle-outer">
                        <div class="icon-circle-inner">
                          <svg class="upload-icon-svg" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      </div>
                      <!-- Partículas Flutuantes -->
                      <div class="particle particle-1"></div>
                      <div class="particle particle-2"></div>
                      <div class="particle particle-3"></div>
                    </div>

                    <!-- Texto -->
                    <div class="upload-text-modern">
                      <p class="upload-title-modern">
                        <span class="title-gradient-text">Adicionar Imagem</span>
                      </p>
                      <p class="upload-subtitle-modern">Arraste e solte ou clique para selecionar</p>
                    </div>

                    <!-- Botão de Upload -->
                    <button type="button" class="upload-button-modern" @click.stop="triggerFileInput">
                      <div class="button-bg-gradient"></div>
                      <div class="button-content-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <span>Selecionar Arquivo</span>
                      </div>
                      <div class="button-shine-effect"></div>
                    </button>

                    <!-- Formatos Suportados -->
                    <div class="upload-formats-modern">
                      <span class="format-badge">PNG</span>
                      <span class="format-badge">JPG</span>
                      <span class="format-badge">WEBP</span>
                    </div>
                  </div>

                  <!-- Loading State -->
                  <div class="upload-loading-state" v-else>
                    <div class="loading-spinner">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                          <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" values="0 12 12;360 12 12"/>
                        </path>
                      </svg>
                    </div>
                    <div class="loading-text">
                      <h4>Processando Imagem...</h4>
                      <p>Comprimindo e otimizando a imagem</p>
                    </div>
                  </div>
                </div>

                <!-- Informação Adicional -->
                <div class="upload-info-modern">
                  <div class="info-icon-wrapper">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div class="info-content">
                    <span class="info-primary"><strong>Formatos aceitos:</strong> PNG, JPG ou WEBP</span>
                    <span class="info-divider">•</span>
                    <span class="info-secondary"><strong>Tamanho máximo:</strong> 10MB</span>
                    <span class="info-divider">•</span>
                    <span class="info-secondary"><strong>Recomendado:</strong> 1920×1080px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ações do Modal -->
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="resetForm">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancelar
            </button>
            <button type="submit" class="btn-save">
              Próxima Etapa
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>
          </div>
        </form>

        <!-- ETAPA 2: Equipamentos -->
        <div v-if="currentStep === 2" class="equipments-section">
          <!-- PARTE 1: Busca de Aparelhos Pré-cadastrados -->
          <div class="search-equipments-section">
            <div class="section-header-modern">
              <div class="section-title-wrapper">
                <div class="section-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="section-title">Buscar Aparelhos</h3>
                  <p class="section-subtitle">Pesquise e adicione aparelhos comuns de academia</p>
                </div>
              </div>
            </div>

            <!-- Barra de Pesquisa -->
            <div class="search-bar-wrapper">
              <div class="search-input-container">
                <svg class="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input 
                  v-model="searchQuery"
                  type="text"
                  class="search-input-modern"
                  placeholder="Buscar aparelhos (ex: leg press, supino, esteira...)"
                />
                <button 
                  v-if="searchQuery"
                  type="button" 
                  class="clear-search-btn"
                  @click="clearSearch"
                >
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Resultados da Busca -->
            <div v-if="searchQuery && filteredEquipments.length > 0" class="search-results">
              <div class="results-header">
                <span class="results-count">{{ filteredEquipments.length }} aparelho(s) encontrado(s)</span>
              </div>
              <div class="equipment-cards-grid">
                <div 
                  v-for="equipment in filteredEquipments" 
                  :key="equipment._id"
                  class="equipment-card-searchable"
                  :class="{ 'added': isEquipmentAdded(equipment._id) }"
                >
                  <div class="equipment-card-icon">
                    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                  </div>
                  <div class="equipment-card-content">
                    <h4 class="equipment-card-name">{{ equipment.name }}</h4>
                    <p class="equipment-card-description">{{ equipment.description }}</p>
                    <span class="equipment-card-category">{{ equipment.category }}</span>
                  </div>
                  <div class="equipment-card-actions">
                    <div v-if="!isEquipmentAdded(equipment._id)" class="quantity-selector">
                      <button 
                        type="button" 
                        class="qty-btn" 
                        @click="decrementQuantity(equipment._id)"
                        :disabled="getEquipmentQuantityInput(equipment._id) <= 1"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <input 
                        type="number" 
                        class="qty-input" 
                        :value="getEquipmentQuantityInput(equipment._id)"
                        @input="updateQuantityInput(equipment._id, $event.target.value)"
                        min="1"
                        max="999"
                      />
                      <button 
                        type="button" 
                        class="qty-btn" 
                        @click="incrementQuantity(equipment._id)"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </button>
                    </div>
                    <button 
                      v-if="!isEquipmentAdded(equipment._id)"
                      type="button" 
                      class="btn-add-to-list"
                      @click="addEquipmentFromSearch(equipment)"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      Adicionar
                    </button>
                    <span v-else class="added-badge">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Adicionado
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado: Nenhum resultado -->
            <div v-else-if="searchQuery && filteredEquipments.length === 0" class="no-results">
              <div class="no-results-icon">
                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 class="no-results-title">Nenhum aparelho encontrado</h4>
              <p class="no-results-text">Tente outro termo de busca</p>
            </div>

            <!-- Estado: Inicial - Aparelhos em Destaque -->
            <div v-else class="featured-equipments">
              <div class="featured-header">
                <div class="featured-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="featured-title">Aparelhos em Destaque</h4>
                  <p class="featured-subtitle">Adicione os aparelhos mais comuns de academias</p>
                </div>
              </div>

              <!-- Grid de Aparelhos em Destaque -->
              <div class="exercises-grid-featured">
                <div 
                  v-for="equipment in paginatedFeaturedEquipments" 
                  :key="equipment._id || equipment.id"
                  class="exercise-card-featured"
                  :class="{ 'is-added': isEquipmentAdded(equipment._id || equipment.id) }"
                >
                  <div class="card-glow"></div>
                  
                  <!-- Image Section -->
                  <div class="exercise-header">
                    <div class="exercise-image">
                      <div v-if="equipment.image" class="image-container">
                        <img :src="getImageUrl(equipment.image)" :alt="equipment.name" />
                      </div>
                      <div v-else class="image-placeholder">
                        <div class="placeholder-icon">
                          <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Equipment Info -->
                  <div class="exercise-info">
                    <!-- Badge + Disponível -->
                    <div class="info-top">
                      <div class="badge">
                        <span class="badge-dot"></span>
                        <span class="badge-text">{{ (equipment.category || 'GERAL').toUpperCase() }}</span>
                      </div>
                      <span class="difficulty-indicator disponível" v-if="!isEquipmentAdded(equipment._id || equipment.id)">
                        <span class="difficulty-dot"></span>
                        Disponível
                      </span>
                      <span class="difficulty-indicator added-status" v-else>
                        <span class="difficulty-dot"></span>
                        Adicionado
                      </span>
                    </div>

                    <!-- Título -->
                    <h1 class="title">{{ equipment.name }}</h1>
                    
                    <!-- Descrição -->
                    <p class="description">{{ equipment.description }}</p>

                    <!-- Quantidade -->
                    <div class="quantity-section" v-if="!isEquipmentAdded(equipment._id)">
                      <div class="quantity-label">
                        <span class="hashtag">#</span>
                        <span class="label-text">QUANTIDADE</span>
                      </div>
                      
                      <div class="quantity-control">
                        <button 
                          type="button"
                          @click="decrementQuantity(equipment._id)" 
                          class="btn-control"
                          :disabled="getEquipmentQuantityInput(equipment._id) <= 1"
                        >−</button>
                        <span class="quantity-value">{{ getEquipmentQuantityInput(equipment._id) }}</span>
                        <button 
                          type="button"
                          @click="incrementQuantity(equipment._id)" 
                          class="btn-control"
                        >+</button>
                      </div>
                    </div>

                    <!-- Botão Adicionar -->
                    <button 
                      v-if="!isEquipmentAdded(equipment._id)"
                      type="button"
                      class="btn-adicionar"
                      @click="addEquipmentFromSearch(equipment)"
                    >Adicionar</button>
                    
                    <div v-else class="added-badge-full">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Adicionado com Sucesso</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Paginação -->
              <div class="pagination-controls" v-if="featuredEquipments.length > 3">
                <button 
                  type="button"
                  class="pagination-btn"
                  :disabled="currentFeaturedPage === 1"
                  @click="currentFeaturedPage--"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                
                <div class="pagination-numbers">
                  <button
                    v-for="page in totalFeaturedPages"
                    :key="page"
                    type="button"
                    class="pagination-number"
                    :class="{ active: currentFeaturedPage === page }"
                    @click="currentFeaturedPage = page"
                  >
                    {{ page }}
                  </button>
                </div>

                <button 
                  type="button"
                  class="pagination-btn"
                  :disabled="currentFeaturedPage === totalFeaturedPages"
                  @click="currentFeaturedPage++"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Lista de Aparelhos Adicionados -->
          <div v-if="equipmentsList.length > 0" class="added-equipments-section">
            <div class="added-header">
              <h3 class="added-title">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
                Aparelhos Adicionados ({{ equipmentsList.length }})
              </h3>
            </div>
            
          <div class="equipments-list">
            <div 
              v-for="(equipment, index) in equipmentsList" 
              :key="index"
              class="equipment-card"
            >
              <div class="equipment-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <div class="equipment-info">
                <h4 class="equipment-name">{{ equipment.name }}</h4>
                <p class="equipment-description">{{ equipment.description || 'Sem descrição' }}</p>
                <div class="equipment-quantity">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                  </svg>
                  Quantidade: <strong>{{ equipment.quantity }}</strong>
                </div>
              </div>
              <div class="equipment-actions">
                <button type="button" class="btn-icon-delete" @click="removeEquipment(index)" title="Remover">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          </div>

          <!-- Ações Finais -->
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="backToStep1">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
              </svg>
              Voltar
            </button>
            <button type="button" class="btn-save" @click="handleSubmit">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ editMode ? 'Salvar Alterações' : 'Cadastrar Academia' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { mask } from 'vue-the-mask';
import { useThemeStore } from '@/store/theme';
import { storeToRefs } from 'pinia';
import NotificationModal from '@/components/NotificationModal.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import api from '@/api';

export default {
  name: 'GymForm',
  directives: { mask },
  components: {
    NotificationModal,
    ConfirmationModal
  },
  props: {
    gym: {
      type: Object,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);
    
    // Notification system
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

    // Confirmation system
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
    
    const fileInput = ref(null);
    const imagePreview = ref(null);
    const isDragging = ref(false);
    const showModal = ref(props.show);
    
    // Controle de Etapas
    const currentStep = ref(1);
    
    // Controle de Equipamentos
    const equipmentsList = ref([]);
    
    // Busca de Equipamentos
    const searchQuery = ref('');
    const filteredEquipments = ref([]);
    const quantityInputs = ref({}); // Armazena quantidades temporárias para cada equipamento
    const popularSearchTerms = ['Leg Press', 'Supino', 'Esteira', 'Bicicleta'];
    
    // Paginação dos aparelhos em destaque
    const currentFeaturedPage = ref(1);
    const itemsPerPage = 3;
    
    // Equipamentos carregados do backend
    const featuredEquipmentsData = ref([]);
    const isLoadingEquipments = ref(false);

    // Validação de CEP
    const isValidatingCep = ref(false);
    const cepValidated = ref(false);
    const cepError = ref('');
    let cepTimeout = null;

    // Upload de imagem
    const isUploadingImage = ref(false);

    // Aparelhos em destaque (mais populares)
    const featuredEquipments = computed(() => {
      console.log('🔢 Computed featuredEquipments chamado, valor:', featuredEquipmentsData.value);
      return featuredEquipmentsData.value;
    });

    // Total de páginas
    const totalFeaturedPages = computed(() => {
      const total = Math.ceil(featuredEquipments.value.length / itemsPerPage);
      console.log('📄 Total de páginas calculado:', total);
      return total;
    });

    // Aparelhos paginados
    const paginatedFeaturedEquipments = computed(() => {
      const start = (currentFeaturedPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginated = featuredEquipments.value.slice(start, end);
      console.log('📑 Equipamentos paginados:', paginated);
      return paginated;
    });

    const defaultFormData = {
      name: '',
      description: '',
      image: null,
      imageBase64: '', // Adiciona campo para imagem base64
      location: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
      },
      phone: '',
      email: '',
    };

    const formData = ref({ ...defaultFormData, location: { ...defaultFormData.location } });

    const editMode = computed(() => !!props.gym);
    
    const getStepSubtitle = computed(() => {
      if (editMode.value) {
        return currentStep.value === 1 
          ? 'Atualize as informações da academia' 
          : 'Gerencie os equipamentos da academia';
      }
      return currentStep.value === 1 
        ? 'Adicione as informações básicas da academia' 
        : 'Adicione os equipamentos disponíveis';
    });

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const handleFileSelect = (event) => {
      const file = event.target.files?.[0];
      if (file) {
        processImageFile(file);
      }
    };

    const processImageFile = (file) => {
      // Validar tipo de arquivo
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showNotification('error', 'Arquivo Inválido', 'Tipo de arquivo inválido. Use PNG, JPG, GIF ou WEBP.');
        return;
      }

      // Validar tamanho (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showNotification('error', 'Arquivo Muito Grande', 'Arquivo muito grande. O tamanho máximo é 10MB.');
        return;
      }

      // Mostrar loading
      isUploadingImage.value = true;
      formData.value.image = file;
      
      // Comprimir a imagem antes de converter para base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            // Criar canvas para redimensionar
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Redimensionar se for muito grande (máximo 1920px para manter qualidade boa)
            const maxSize = 1920;
            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = (height * maxSize) / width;
                width = maxSize;
              } else {
                width = (width * maxSize) / height;
                height = maxSize;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            
            // Aplicar filtros para melhorar a qualidade
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Preencher fundo branco para PNGs com transparência
            if (file.type === 'image/png') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
            }
            
            ctx.drawImage(img, 0, 0, width, height);
            
            // Converter para base64 com qualidade otimizada
            let quality = 0.8; // Qualidade inicial
            let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            
            // Se ainda estiver muito grande, reduzir qualidade gradualmente
            while (compressedBase64.length > 500000 && quality > 0.3) { // ~500KB limite
              quality -= 0.1;
              compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            }
            
            // Verificar tamanho final
            const finalSizeInBytes = (compressedBase64.length * 3) / 4;
            const finalSizeInMB = finalSizeInBytes / (1024 * 1024);
            
            if (finalSizeInMB > 2) { // Limite de 2MB para o base64
              showNotification('error', 'Imagem Muito Grande', 
                `A imagem ainda está muito grande (${finalSizeInMB.toFixed(1)}MB). Tente uma imagem menor ou com menor resolução.`);
              resetImageState();
              return;
            }
            
            // Sucesso
            imagePreview.value = compressedBase64;
            formData.value.imageBase64 = compressedBase64;
            
            showNotification('success', 'Imagem Carregada!', 
              `Imagem processada com sucesso (${finalSizeInMB.toFixed(1)}MB, ${width}x${height}px)`);
              
          } catch (error) {
            console.error('Erro ao processar imagem:', error);
            showNotification('error', 'Erro no Processamento', 'Erro ao processar a imagem. Tente novamente.');
            resetImageState();
          } finally {
            isUploadingImage.value = false; // Remove loading
          }
        };
        
        img.onerror = () => {
          showNotification('error', 'Imagem Corrompida', 'Não foi possível carregar a imagem. Arquivo pode estar corrompido.');
          resetImageState();
          isUploadingImage.value = false;
        };
        
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        showNotification('error', 'Erro de Leitura', 'Erro ao ler o arquivo. Tente novamente.');
        resetImageState();
        isUploadingImage.value = false;
      };
      
      reader.readAsDataURL(file);
    };

    const resetImageState = () => {
      imagePreview.value = null;
      formData.value.image = null;
      formData.value.imageBase64 = '';
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const handleDragOver = () => {
      isDragging.value = true;
    };

    const handleDragLeave = () => {
      isDragging.value = false;
    };

    const handleDrop = (event) => {
      isDragging.value = false;
      const file = event.dataTransfer?.files?.[0];
      if (file) {
        processImageFile(file);
      }
    };

    const removeImage = () => {
      resetImageState();
    };

    // Funções de validação de CEP
    const validateCep = async () => {
      const cep = formData.value.location.zipCode?.replace(/\D/g, '');
      
      if (!cep || cep.length !== 8) {
        cepError.value = '';
        cepValidated.value = false;
        return;
      }

      isValidatingCep.value = true;
      cepError.value = '';
      cepValidated.value = false;

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          cepError.value = 'CEP não encontrado';
          cepValidated.value = false;
        } else {
          // Preenche automaticamente os campos de endereço
          formData.value.location.address = data.logradouro || formData.value.location.address;
          formData.value.location.city = data.localidade || formData.value.location.city;
          formData.value.location.state = data.uf || formData.value.location.state;
          
          cepValidated.value = true;
          cepError.value = '';
          
          showNotification('success', 'CEP Validado!', 
            `Endereço encontrado: ${data.logradouro ? data.logradouro + ', ' : ''}${data.localidade} - ${data.uf}`);
        }
      } catch (error) {
        console.error('Erro ao validar CEP:', error);
        cepError.value = 'Erro ao validar CEP. Verifique sua conexão.';
        cepValidated.value = false;
      } finally {
        isValidatingCep.value = false;
      }
    };

    const onCepInput = () => {
      cepValidated.value = false;
      cepError.value = '';
      
      // Debounce para validação automática
      if (cepTimeout) {
        clearTimeout(cepTimeout);
      }
      
      cepTimeout = setTimeout(() => {
        const cep = formData.value.location.zipCode?.replace(/\D/g, '');
        if (cep && cep.length === 8) {
          validateCep();
        }
      }, 1000); // Valida automaticamente após 1 segundo de inatividade
    };

    const resetForm = () => {
      console.log('🔄 Resetando formulário completo');
      
      // Reset dos dados do formulário
      formData.value = { ...defaultFormData, location: { ...defaultFormData.location } };
      formData.value.imageBase64 = '';
      
      // Reset da imagem
      resetImageState();
      
      // Reset dos estados
      isDragging.value = false;
      showModal.value = false;
      currentStep.value = 1;
      
      // Reset dos equipamentos
      equipmentsList.value = [];
      searchQuery.value = '';
      filteredEquipments.value = [];
      quantityInputs.value = {};
      
      // Reset da validação de CEP
      isValidatingCep.value = false;
      cepValidated.value = false;
      cepError.value = '';
      
      // Clear timeout do CEP se existir
      if (cepTimeout) {
        clearTimeout(cepTimeout);
        cepTimeout = null;
      }
      
      // Reset da paginação
      currentFeaturedPage.value = 1;
      
      emit('cancel');
      console.log('✅ Formulário resetado');
    };
    
    // Equipamentos carregados do backend
    const allEquipments = ref([]);
    
    // Buscar equipamentos do backend - IGUAL AO MACHINES.VUE
    const loadAllEquipments = async () => {
      try {
        isLoadingEquipments.value = true;
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        // USAR O INSTRUCTORID CORRETO DO USUÁRIO
        const instructorId = user.instructorId || user.id || user._id;
        
        console.log('🔍 Carregando equipamentos...');
        console.log('👤 Usuário:', user);
        console.log('🆔 Instrutor ID:', instructorId);
        
        if (!instructorId) {
          console.warn('Instrutor não identificado');
          return;
        }
        
        // EXATAMENTE COMO NO MACHINES.VUE
        const response = await api.get(`/equipments/instructor/${instructorId}`);
        allEquipments.value = response.data.equipments;
        console.log('📦 Equipamentos carregados:', allEquipments.value);
        
      } catch (error) {
        console.error('❌ Erro ao carregar equipamentos:', error);
        allEquipments.value = [];
        showNotification('error', 'Erro', 'Erro ao carregar equipamentos.');
      } finally {
        isLoadingEquipments.value = false;
      }
    };

    // Função para construir URL completa das imagens
    const getImageUrl = (imagePath) => {
      if (!imagePath) return null;
      
      // Se já é uma URL completa, retorna como está
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      
      // Se começa com /, constrói URL completa
      if (imagePath.startsWith('/')) {
        return `http://localhost:3000${imagePath}`;
      }
      
      // Caso contrário, adiciona o prefixo padrão
      return `http://localhost:3000/uploads/equipments/${imagePath}`;
    };

    // Funções de Busca de Equipamentos
    const filterEquipments = () => {
      if (!searchQuery.value.trim()) {
        filteredEquipments.value = [];
        return;
      }
      
      const query = searchQuery.value.toLowerCase().trim();
      filteredEquipments.value = allEquipments.value.filter(eq => 
        eq.name.toLowerCase().includes(query) ||
        (eq.description && eq.description.toLowerCase().includes(query)) ||
        (eq.category && eq.category.toLowerCase().includes(query)) ||
        (eq.muscleGroups && eq.muscleGroups.some(mg => mg.toLowerCase().includes(query)))
      );
      
      // Inicializa quantidades para os resultados
      filteredEquipments.value.forEach(eq => {
        if (!quantityInputs.value[eq._id]) {
          quantityInputs.value[eq._id] = 1;
        }
      });
    };

    // Carregar equipamentos em destaque (usa os primeiros equipamentos carregados)
    const loadFeaturedEquipments = () => {
      console.log('⭐ Carregando equipamentos em destaque...');
      console.log('📊 Total de equipamentos disponíveis:', allEquipments.value.length);
      
      // Usa os primeiros equipamentos como em destaque (máximo 8)
      featuredEquipmentsData.value = allEquipments.value.slice(0, 8);
      console.log('✨ Equipamentos em destaque carregados:', featuredEquipmentsData.value.length);
      console.log('📋 Lista de equipamentos em destaque:', featuredEquipmentsData.value);
      
      // Inicializa quantidades para os equipamentos em destaque
      featuredEquipmentsData.value.forEach(eq => {
        const equipmentId = eq._id || eq.id;
        if (!quantityInputs.value[equipmentId]) {
          quantityInputs.value[equipmentId] = 1;
        }
      });
    };
    
    const clearSearch = () => {
      searchQuery.value = '';
      filteredEquipments.value = [];
    };
    
    const isEquipmentAdded = (equipmentId) => {
      return equipmentsList.value.some(eq => eq.sourceId === equipmentId);
    };
    
    const getEquipmentQuantityInput = (equipmentId) => {
      return quantityInputs.value[equipmentId] || 1;
    };
    
    const updateQuantityInput = (equipmentId, value) => {
      const numValue = parseInt(value) || 1;
      quantityInputs.value[equipmentId] = Math.max(1, Math.min(999, numValue));
    };
    
    const incrementQuantity = (equipmentId) => {
      const current = quantityInputs.value[equipmentId] || 1;
      quantityInputs.value[equipmentId] = Math.min(999, current + 1);
    };
    
    const decrementQuantity = (equipmentId) => {
      const current = quantityInputs.value[equipmentId] || 1;
      quantityInputs.value[equipmentId] = Math.max(1, current - 1);
    };
    
    const addEquipmentFromSearch = (equipment) => {
      const equipmentId = equipment._id || equipment.id;
      const quantity = quantityInputs.value[equipmentId] || 1;
      
      // Validações
      if (!equipment.name?.trim()) {
        showNotification('warning', 'Equipamento Inválido', 'Nome do equipamento é obrigatório.');
        return;
      }
      
      if (quantity < 1 || quantity > 999) {
        showNotification('warning', 'Quantidade Inválida', 'Quantidade deve estar entre 1 e 999.');
        return;
      }
      
      // Verifica se já foi adicionado
      if (isEquipmentAdded(equipmentId)) {
        showNotification('warning', 'Equipamento Duplicado', 'Este equipamento já foi adicionado.');
        return;
      }
      
      // Adiciona o equipamento
      const newEquipment = {
        sourceId: equipmentId, // ID do equipamento da base de dados
        name: equipment.name.trim(),
        description: (equipment.description || '').trim(),
        quantity: parseInt(quantity),
        category: equipment.category || 'Geral',
        isCustom: false
      };
      
      equipmentsList.value.push(newEquipment);
      
      // Reseta a quantidade desse equipamento
      quantityInputs.value[equipmentId] = 1;
      
      // Feedback de sucesso
      showNotification('success', 'Equipamento Adicionado!', 
        `${equipment.name} (${quantity}x) foi adicionado à academia.`);
      
      console.log('⚙️ Equipamento adicionado:', newEquipment);
      console.log('📋 Lista atual de equipamentos:', equipmentsList.value);
    };

    // Funções para gerenciar equipamentos adicionados
    const removeEquipment = (index) => {
      if (index >= 0 && index < equipmentsList.value.length) {
        const removedEquipment = equipmentsList.value[index];
        equipmentsList.value.splice(index, 1);
        
        showNotification('info', 'Equipamento Removido', 
          `${removedEquipment.name} foi removido da lista.`);
        
        console.log('🗑️ Equipamento removido:', removedEquipment);
      }
    };

    const updateEquipmentQuantity = (index, newQuantity) => {
      if (index >= 0 && index < equipmentsList.value.length) {
        const quantity = parseInt(newQuantity) || 1;
        if (quantity >= 1 && quantity <= 999) {
          equipmentsList.value[index].quantity = quantity;
          console.log(`🔢 Quantidade atualizada: ${equipmentsList.value[index].name} = ${quantity}`);
        }
      }
    };

    const canRemoveEquipments = computed(() => {
      return equipmentsList.value.length > 0;
    });
    
    // Navegação entre Etapas
    const goToStep2 = () => {
      // Validação básica
      if (!formData.value.name?.trim()) {
        showNotification('warning', 'Campo Obrigatório', 'Nome da academia é obrigatório.');
        return;
      }
      
      if (!formData.value.phone?.trim()) {
        showNotification('warning', 'Campo Obrigatório', 'Telefone é obrigatório.');
        return;
      }
      
      if (!formData.value.location.address?.trim() || !formData.value.location.city?.trim() || 
          !formData.value.location.state?.trim() || !formData.value.location.zipCode?.trim()) {
        showNotification('warning', 'Endereço Incompleto', 'Por favor, preencha todos os campos de endereço.');
        return;
      }
      
      // Validar formato do estado (2 letras)
      if (formData.value.location.state.trim().length !== 2) {
        showNotification('warning', 'Estado Inválido', 'Estado deve ter 2 letras (UF).');
        return;
      }
      
      // Validar CEP
      const cepNumbers = formData.value.location.zipCode.replace(/\D/g, '');
      if (cepNumbers.length !== 8) {
        showNotification('warning', 'CEP Inválido', 'CEP deve ter 8 dígitos. Use o formato: 00000-000');
        return;
      }
      
      // Se CEP não foi validado ainda, tenta validar
      if (!cepValidated.value && !isValidatingCep.value) {
        showNotification('info', 'Validando CEP...', 'Verificando o CEP informado...');
        validateCep().then(() => {
          if (cepValidated.value) {
            currentStep.value = 2;
          }
        });
        return;
      }
      
      // Se CEP tem erro, bloqueia
      if (cepError.value) {
        showNotification('warning', 'CEP Inválido', 'Por favor, corrija o CEP antes de continuar.');
        return;
      }
      
      currentStep.value = 2;
      console.log('➡️ Avançando para Etapa 2 - Equipamentos');
    };
    
    const backToStep1 = () => {
      currentStep.value = 1;
    };

    const handleSubmit = async () => {
      try {
        console.log('📤 Iniciando submissão do formulário');
        
        // Validações básicas da etapa 1
        if (!formData.value.name?.trim()) {
          showNotification('warning', 'Campo Obrigatório', 'Nome da academia é obrigatório.');
          currentStep.value = 1;
          return;
        }
        
        if (!formData.value.phone?.trim()) {
          showNotification('warning', 'Campo Obrigatório', 'Telefone é obrigatório.');
          currentStep.value = 1;
          return;
        }
        
        if (!formData.value.location.address?.trim() || 
            !formData.value.location.city?.trim() || 
            !formData.value.location.state?.trim() || 
            !formData.value.location.zipCode?.trim()) {
          showNotification('warning', 'Endereço Incompleto', 'Por favor, preencha todos os campos de endereço.');
          currentStep.value = 1;
          return;
        }
        
        // Validar formato do estado (2 letras)
        if (formData.value.location.state.trim().length !== 2) {
          showNotification('warning', 'Estado Inválido', 'Estado deve ter 2 letras (UF).');
          currentStep.value = 1;
          return;
        }

        // Validar CEP (deve ter 8 dígitos)
        const cepNumbers = formData.value.location.zipCode.replace(/\D/g, '');
        if (cepNumbers.length !== 8) {
          showNotification('warning', 'CEP Inválido', 'CEP deve ter 8 dígitos.');
          currentStep.value = 1;
          return;
        }

        // Prepara os dados da academia
        const gymData = {
          name: formData.value.name.trim(),
          description: (formData.value.description || '').trim(),
          phone: formData.value.phone.trim(),
          email: (formData.value.email || '').trim(),
          location: {
            address: formData.value.location.address.trim(),
            city: formData.value.location.city.trim(),
            state: formData.value.location.state.trim().toUpperCase(),
            zipCode: formData.value.location.zipCode.trim()
          }
        };

        // Adiciona imagem se houver
        if (formData.value.imageBase64) {
          gymData.imageBase64 = formData.value.imageBase64;
          console.log('🖼️ Imagem base64 adicionada ao payload');
        } else if (formData.value.image) {
          // Fallback para compatibilidade
          gymData.image = formData.value.image;
          console.log('🖼️ Imagem file adicionada ao payload');
        }

        // Processa e valida equipamentos
        if (equipmentsList.value && equipmentsList.value.length > 0) {
          gymData.equipments = equipmentsList.value.map(eq => {
            const equipment = {
              name: eq.name?.trim() || '',
              description: eq.description?.trim() || '',
              quantity: parseInt(eq.quantity) || 1,
              category: eq.category?.trim() || 'Geral',
              isCustom: Boolean(eq.isCustom)
            };

            // Se não é customizado, inclui o sourceId
            if (!eq.isCustom && eq.sourceId) {
              equipment.sourceId = eq.sourceId;
            }

            return equipment;
          }).filter(eq => eq.name); // Remove equipamentos sem nome

          console.log(`⚙️ ${gymData.equipments.length} equipamentos processados:`, gymData.equipments);
        } else {
          gymData.equipments = [];
          console.log('⚙️ Nenhum equipamento para salvar');
        }

        // Log dos dados finais
        console.log('📋 Dados finais para envio:', {
          ...gymData,
          imageBase64: gymData.imageBase64 ? `[BASE64 - ${(gymData.imageBase64.length / 1024).toFixed(1)}KB]` : null
        });

        // Emite os dados para o componente pai
        emit('submit', { data: gymData });
        
        // Feedback de sucesso
        showNotification('success', 'Dados Preparados!', 
          `Academia "${gymData.name}" está pronta para ${editMode.value ? 'atualização' : 'criação'}.`);
        
        // Reset após sucesso
        setTimeout(() => {
          resetForm();
        }, 1500);
        
      } catch (error) {
        console.error('❌ Erro ao preparar dados do formulário:', error);
        showNotification('error', 'Erro no Formulário!', 
          `Erro ao processar dados: ${error.message || 'Erro desconhecido'}`);
      }
    };

    // Watch para mudanças no prop show
    watch(() => props.show, (newVal) => {
      showModal.value = newVal;
    });
    
    // Watch para mudanças no searchQuery com debounce
    let searchTimeout;
    watch(searchQuery, () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        filterEquipments();
      }, 300); // Debounce de 300ms
    });

    // Watch para mudanças no prop gym
    watch(() => props.gym, (newVal) => {
      console.log('🏢 Academia recebida para edição:', newVal);
      
      if (newVal) {
        // Reset dos estados de validação
        cepValidated.value = false;
        cepError.value = '';
        
        formData.value = {
          name: newVal.name || '',
          description: newVal.description || '',
          image: null, // Sempre null para evitar conflitos
          imageBase64: '', // Limpa o base64 ao carregar academia existente
          location: {
            address: newVal.location?.address || '',
            city: newVal.location?.city || '',
            state: newVal.location?.state || '',
            zipCode: newVal.location?.zipCode || '',
          },
          phone: newVal.phone || '',
          email: newVal.email || '',
        };
        
        // Carrega a imagem existente
        if (newVal.image) {
          // Se é um caminho de imagem do servidor
          if (typeof newVal.image === 'string') {
            // Constroi URL completa se necessário
            const imageUrl = newVal.image.startsWith('http') 
              ? newVal.image 
              : newVal.image.startsWith('/') 
                ? `http://localhost:3000${newVal.image}`
                : `http://localhost:3000/uploads/gyms/${newVal.image}`;
            
            imagePreview.value = imageUrl;
            console.log('🖼️ Imagem carregada:', imageUrl);
          }
        } else if (newVal.imageUrl) {
          // Fallback para imageUrl
          imagePreview.value = newVal.imageUrl;
          console.log('🖼️ ImageUrl carregada:', newVal.imageUrl);
        } else {
          imagePreview.value = null;
          console.log('📷 Nenhuma imagem encontrada');
        }
        
        // Carrega equipamentos se existirem
        if (newVal.equipments && Array.isArray(newVal.equipments)) {
          equipmentsList.value = newVal.equipments.map(eq => ({
            sourceId: eq.sourceId || eq._id || eq.id,
            name: eq.name || '',
            description: eq.description || '',
            quantity: eq.quantity || 1,
            category: eq.category || 'Geral',
            isCustom: eq.isCustom || false
          }));
          console.log('⚙️ Equipamentos carregados:', equipmentsList.value.length);
        } else {
          equipmentsList.value = [];
          console.log('⚙️ Nenhum equipamento encontrado');
        }
        
        // Se tem CEP válido, marca como validado
        if (formData.value.location.zipCode && formData.value.location.zipCode.length >= 8) {
          cepValidated.value = true;
        }
        
        console.log('✅ Dados da academia carregados com sucesso');
      } else {
        // Reset completo quando não há academia
        console.log('🔄 Resetando formulário');
        formData.value = { ...defaultFormData, location: { ...defaultFormData.location } };
        imagePreview.value = null;
        equipmentsList.value = [];
        cepValidated.value = false;
        cepError.value = '';
      }
    }, { immediate: true, deep: true });

    // Inicialização dos equipamentos
    const initializeEquipments = async () => {
      await loadAllEquipments();
      loadFeaturedEquipments();
    };

    // Inicializar equipamentos quando o componente for montado
    onMounted(() => {
      initializeEquipments();
    });

    // Reinicializar quando o modal for aberto
    watch(() => props.show, (newVal) => {
      if (newVal) {
        initializeEquipments();
      }
    });

    return {
      isDarkMode,
      notification,
      showNotification,
      showConfirmation,
      confirmationConfig,
      fileInput,
      imagePreview,
      isDragging,
      showModal,
      formData,
      editMode,
      getStepSubtitle,
      currentStep,
      equipmentsList,
      searchQuery,
      filteredEquipments,
      featuredEquipments,
      currentFeaturedPage,
      totalFeaturedPages,
      paginatedFeaturedEquipments,
      popularSearchTerms,
      allEquipments,
      // Validação de CEP
      isValidatingCep,
      cepValidated,
      cepError,
      validateCep,
      onCepInput,
      // Upload de imagem
      isUploadingImage,
      // Funções existentes
      loadAllEquipments,
      getImageUrl,
      triggerFileInput,
      handleFileSelect,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeImage,
      resetImageState,
      resetForm,
      goToStep2,
      backToStep1,
      filterEquipments,
      clearSearch,
      loadFeaturedEquipments,
      isEquipmentAdded,
      getEquipmentQuantityInput,
      updateQuantityInput,
      incrementQuantity,
      decrementQuantity,
      addEquipmentFromSearch,
      removeEquipment,
      updateEquipmentQuantity,
      canRemoveEquipments,
      isLoadingEquipments,
      handleSubmit,
    };
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

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
  --upload-background: rgba(248, 249, 250, 0.5);
  --upload-hover: rgba(59, 130, 246, 0.05);
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
  --upload-background: rgba(15, 23, 42, 0.5);
  --upload-hover: rgba(59, 130, 246, 0.08);
}

* {
  box-sizing: border-box;
}

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
  font-family: 'Inter', sans-serif;
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
  scrollbar-color: rgba(59, 130, 246, 0.3) transparent;
}

.modal-container-large::-webkit-scrollbar {
  width: 8px;
}

.modal-container-large::-webkit-scrollbar-track {
  background: transparent;
}

.modal-container-large::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 4px;
}

.modal-container-large::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
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
  flex-wrap: wrap;
  gap: 24px;
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

.header-text-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ========== INDICADOR DE ETAPAS ========== */
.steps-indicator {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.step-circle {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 12px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-secondary);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.step-item.active .step-circle {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  transform: scale(1.05);
}

.step-item.completed .step-circle {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.step-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.step-item.active .step-label {
  color: #3b82f6;
  font-weight: 600;
}

.dashboard-dark .step-item.active .step-label {
  color: #60a5fa;
}

.step-item.completed .step-label {
  color: #10b981;
}

.step-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.step-connector {
  width: 40px;
  height: 3px;
  background: var(--border-color);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.step-connector::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  transition: width 0.5s ease;
}

.step-connector.completed::before {
  width: 100%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
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
  margin-bottom: 0;
}

.form-row .form-group {
  margin-bottom: 0;
}

.form-row + .form-group {
  margin-top: 24px;
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
  color: #3b82f6;
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
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-secondary);
}

/* Image Preview Container */
.image-preview-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.95);
  backdrop-filter: blur(8px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  z-index: 10;
}

.remove-image-btn:hover {
  background: rgba(220, 38, 38, 1);
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

/* ========== ÁREA DE UPLOAD MELHORADA ========== */
.upload-area-modern {
  position: relative;
  border: 3px dashed transparent;
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(37, 99, 235, 0.03) 100%);
  overflow: hidden;
  cursor: pointer;
  will-change: box-shadow;
  margin-bottom: 20px;
}

/* Variante com borda tracejada visível */
.upload-area-modern.upload-dashed {
  border-color: var(--border-color);
}

.upload-area-modern.upload-dashed:hover {
  border-color: #3b82f6;
}

.upload-area-modern.upload-dashed.drag-over {
  border-color: #2563eb;
}

/* Desabilita o ::before (borda gradiente) quando usar borda tracejada */
.upload-area-modern.upload-dashed::before {
  display: none;
}

.upload-gradient-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.05) 0%, 
    rgba(37, 99, 235, 0.05) 100%
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
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
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
    rgba(59, 130, 246, 0.4) 0%, 
    rgba(37, 99, 235, 0.4) 100%
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
    rgba(59, 130, 246, 0.6) 0%, 
    rgba(37, 99, 235, 0.6) 100%
  );
}

.upload-area-modern:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
  box-shadow: 
    0 10px 30px rgba(59, 130, 246, 0.12),
    0 5px 15px rgba(37, 99, 235, 0.08);
}

.upload-area-modern:hover .upload-gradient-bg,
.upload-area-modern:hover .upload-grid-pattern {
  opacity: 1;
}

.upload-area-modern.drag-over {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%);
  transform: scale(1.01);
  box-shadow: 
    0 15px 35px rgba(59, 130, 246, 0.18),
    0 8px 20px rgba(37, 99, 235, 0.12);
}

.upload-area-modern.drag-over::before {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.8) 0%, 
    rgba(37, 99, 235, 0.8) 100%
  );
}

.upload-area-modern.drag-over .upload-gradient-bg,
.upload-area-modern.drag-over .upload-grid-pattern {
  opacity: 1;
}

.upload-area-modern.drag-over .icon-circle-outer {
  transform: scale(1.05);
  box-shadow: 
    0 15px 35px rgba(59, 130, 246, 0.25),
    0 0 0 15px rgba(59, 130, 246, 0.08);
}

/* Loading state para upload */
.upload-area-modern.uploading {
  cursor: not-allowed;
  border-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%);
}

.upload-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  z-index: 3;
  position: relative;
}

.loading-spinner {
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text {
  text-align: center;
}

.loading-text h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.loading-text p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
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
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    0 10px 30px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.icon-circle-inner {
  width: 90px;
  height: 90px;
  border-radius: 22px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 24px rgba(37, 99, 235, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
}

.upload-area-modern:hover .icon-circle-inner {
  transform: rotate(3deg) scale(1.03);
  box-shadow: 
    0 10px 28px rgba(37, 99, 235, 0.45),
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.upload-area-modern:hover .particle {
  opacity: 0.4;
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
  width: 6px;
  height: 6px;
  animation-delay: 0.5s;
}

.particle-3 {
  top: 60%;
  right: 15%;
  width: 10px;
  height: 10px;
  animation-delay: 1s;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.2;
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transition: all 0.4s ease;
  z-index: -1;
  border-radius: 16px;
}

.upload-button-modern:hover .button-bg-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
    0 8px 24px rgba(59, 130, 246, 0.3),
    0 4px 12px rgba(37, 99, 235, 0.2);
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
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  transition: all 0.3s ease;
}

.dashboard-dark .format-badge {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.format-badge:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

/* Upload Info Modern */
.upload-info-modern {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  padding: 16px 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 14px;
  transition: all 0.3s ease;
}

.dashboard-dark .upload-info-modern {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%);
  border-color: rgba(59, 130, 246, 0.2);
}

.upload-info-modern:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%);
  border-color: rgba(59, 130, 246, 0.25);
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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

.info-secondary {
  color: var(--text-secondary);
}

.info-primary strong,
.info-secondary strong {
  color: #3b82f6;
  font-weight: 700;
}

.dashboard-dark .info-primary strong,
.dashboard-dark .info-secondary strong {
  color: #60a5fa;
}

.info-divider {
  color: var(--border-color);
  opacity: 0.5;
}

/* Hidden file input */
.file-input {
  display: none;
}

/* Validação de CEP */
.cep-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.cep-loading {
  font-size: 0.875rem;
  color: #f59e0b;
  font-weight: 500;
  margin-left: 8px;
}

.form-input.cep-loading {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
}

.form-input.cep-valid {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.cep-spinner {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.cep-check {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.cep-error {
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cep-error::before {
  content: '⚠️';
  font-size: 14px;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 1px solid var(--border-color);
}

.btn-cancel,
.btn-save {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
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
  border-color: #ef4444;
  color: #ef4444;
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

/* ========== SEÇÃO DE EQUIPAMENTOS (ETAPA 2) ========== */
.equipments-section {
  animation: fadeInUp 0.5s ease;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Seção de Busca */
.search-equipments-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-header-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
  border: 1px solid var(--border-color);
  border-radius: 20px;
}

/* Barra de Pesquisa */
.search-bar-wrapper {
  padding: 0 4px;
}

.search-input-container {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.search-input-modern {
  width: 100%;
  padding: 18px 54px 18px 52px;
  border: 2px solid var(--border-color);
  border-radius: 16px;
  font-size: 1rem;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--input-background);
  transition: all 0.3s ease;
}

.search-input-modern:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.search-input-modern::placeholder {
  color: var(--text-secondary);
}

.clear-search-btn {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
  transform: translateY(-50%) rotate(90deg);
}

/* Resultados da Busca */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.results-header {
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
}

.results-count {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #3b82f6;
}

.dashboard-dark .results-count {
  color: #60a5fa;
}

.equipment-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.equipment-card-searchable {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.equipment-card-searchable::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.equipment-card-searchable:hover::before {
  opacity: 1;
}

.equipment-card-searchable:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.equipment-card-searchable.added {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
  border-color: rgba(16, 185, 129, 0.3);
}

.equipment-card-searchable.added::before {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  opacity: 1;
}

.equipment-card-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.equipment-card-searchable.added .equipment-card-icon {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%);
  color: #10b981;
}

.equipment-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.equipment-card-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.equipment-card-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.equipment-card-category {
  display: inline-flex;
  padding: 6px 12px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  align-self: flex-start;
}

.dashboard-dark .equipment-card-category {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.equipment-card-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

/* Seletor de Quantidade */
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  transform: scale(1.05);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-input {
  width: 60px;
  height: 36px;
  text-align: center;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--input-background);
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
}

.qty-input:focus {
  outline: none;
  border-color: #3b82f6;
}

/* Remove setas do input number */
.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qty-input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.btn-add-to-list {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  white-space: nowrap;
}

.btn-add-to-list:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.added-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%);
  color: #10b981;
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
}

/* Estado: Sem resultados */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
}

.no-results-icon {
  width: 96px;
  height: 96px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  margin-bottom: 24px;
}

.no-results-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.no-results-text {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  max-width: 400px;
}

/* Estado: Placeholder de busca */
.search-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
}

.placeholder-icon {
  width: 120px;
  height: 120px;
  border-radius: 30px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  margin-bottom: 32px;
  opacity: 0.8;
}

.placeholder-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.placeholder-text {
  font-size: 1.0625rem;
  color: var(--text-secondary);
  margin: 0 0 32px 0;
  max-width: 500px;
}

.popular-searches {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.popular-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.popular-chip {
  padding: 10px 20px;
  background: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.popular-chip:hover {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  transform: translateY(-2px);
}

/* Featured Equipments Section */
.featured-equipments {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 0;
}

.featured-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 4px;
}

.featured-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.15) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  flex-shrink: 0;
}

.dashboard-dark .featured-icon {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.2) 100%);
}

.featured-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.featured-subtitle {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}

/* Featured Grid - Same as exercises-grid from machines.vue */
.exercises-grid-featured {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.exercise-card-featured {
  position: relative;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 600px;
  min-height: 600px;
  max-height: 600px;
}

.exercise-card-featured:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -15px rgba(37, 99, 235, 0.3);
  border-color: rgba(37, 99, 235, 0.4);
}

.dashboard-dark .exercise-card-featured:hover {
  box-shadow: 0 20px 40px -15px rgba(139, 92, 246, 0.4);
  border-color: rgba(139, 92, 246, 0.5);
}

.exercise-card-featured.is-added {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.02);
}

.dashboard-dark .exercise-card-featured.is-added {
  background: rgba(16, 185, 129, 0.05);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.dashboard-dark .card-glow {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 60%);
}

.exercise-card-featured:hover .card-glow {
  opacity: 1;
}

/* Image Section */
.exercise-card-featured .exercise-header {
  position: relative;
  width: 100%;
}

.exercise-card-featured .exercise-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.exercise-card-featured .image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(59, 130, 246, 0.12) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

/* Real Image Container */
.exercise-card-featured .image-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.exercise-card-featured .image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.exercise-card-featured:hover .image-container img {
  transform: scale(1.05);
}

/* Placeholder for equipments without images */
.dashboard-dark .exercise-card-featured .image-placeholder {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.15) 100%);
}

.exercise-card-featured .image-placeholder::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    rgba(37, 99, 235, 0.03) 20px,
    rgba(37, 99, 235, 0.03) 40px
  );
  animation: shimmer 20s linear infinite;
  z-index: 1;
}

.dashboard-dark .exercise-card-featured .image-placeholder::before {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    rgba(139, 92, 246, 0.05) 20px,
    rgba(139, 92, 246, 0.05) 40px
  );
}

@keyframes shimmer {
  0% { transform: translate(-50%, -50%) rotate(45deg); }
  100% { transform: translate(50%, 50%) rotate(45deg); }
}

.exercise-card-featured .placeholder-icon {
  position: relative;
  z-index: 10;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 16px;
}

.dashboard-dark .exercise-card-featured .placeholder-icon {
  color: #8b5cf6;
  background: rgba(30, 41, 59, 0.8);
}

.exercise-card-featured .placeholder-icon svg {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 2px 8px rgba(37, 99, 235, 0.3));
}

/* Exercise Info */
.exercise-card-featured .exercise-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  justify-content: space-between;
}

.exercise-card-featured .info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.exercise-card-featured .badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
}

.dashboard-dark .exercise-card-featured .badge {
  background-color: #8b5cf6;
}

.exercise-card-featured .badge-dot {
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
}

.exercise-card-featured .badge-text {
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
    white-space: nowrap;
}

.exercise-card-featured .difficulty-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #10b981;
  text-transform: capitalize;
}

.exercise-card-featured .difficulty-indicator.added-status {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
}

.exercise-card-featured .difficulty-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.exercise-card-featured .title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  padding: 0;
  line-height: 1.4;
  margin-bottom: 12px;
  text-align: left;
  height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.exercise-card-featured .description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
  padding: 0;
  line-height: 1.4;
  margin-bottom: 20px;
  height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.exercise-card-featured .quantity-section {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  margin-bottom: 20px;
  border: none;
  box-shadow: none;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.exercise-card-featured .quantity-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.exercise-card-featured .hashtag {
  font-size: 1.5rem;
  color: #9ca3af;
  font-weight: 300;
  line-height: 1;
}

.dashboard-dark .exercise-card-featured .hashtag {
  color: #6b7280;
}

.exercise-card-featured .label-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.exercise-card-featured .quantity-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9fafb;
  padding: 8px 16px;
  border-radius: 12px;
  max-width: 100%;
  height: 48px;
  min-height: 48px;
}

.dashboard-dark .exercise-card-featured .quantity-control {
  background-color: rgba(255, 255, 255, 0.05);
}

.exercise-card-featured .btn-control {
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  border-radius: 8px;
  font-size: 1.5rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: none;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exercise-card-featured .btn-control:hover:not(:disabled) {
  background-color: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  transform: scale(1.1);
}

.dashboard-dark .exercise-card-featured .btn-control:hover:not(:disabled) {
  background-color: rgba(139, 92, 246, 0.2);
  color: #a855f7;
}

.exercise-card-featured .btn-control:active:not(:disabled) {
  transform: scale(0.95);
}

.exercise-card-featured .btn-control:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.exercise-card-featured .quantity-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
  text-align: center;
}

.exercise-card-featured .btn-adicionar {
  width: 100%;
  height: 48px;
  padding: 14px 20px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
}

.exercise-card-featured .btn-adicionar:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.exercise-card-featured .btn-adicionar:active {
  transform: translateY(0);
}

.dashboard-dark .exercise-card-featured .btn-adicionar {
  background-color: #8b5cf6;
}

.dashboard-dark .exercise-card-featured .btn-adicionar:hover {
  background-color: #7c3aed;
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Added Badge */
.exercise-card-featured .added-badge-full {
  width: 100%;
  padding: 14px 20px;
  background: rgba(16, 185, 129, 0.1);
  border: 1.5px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  color: #10b981;
  font-weight: 600;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  flex-shrink: 0;
}

.exercise-card-featured .added-badge-full svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.dashboard-dark .exercise-card-featured .added-badge-full {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  margin-bottom: 32px;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--card-background);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.pagination-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(37, 99, 235, 0.1);
  border-color: #2563eb;
  color: #2563eb;
  transform: scale(1.05);
}

.dashboard-dark .pagination-btn:hover:not(:disabled) {
  background: rgba(37, 99, 235, 0.15);
  border-color: #2563eb;
  color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-number {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--card-background);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover {
  background: rgba(37, 99, 235, 0.1);
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-2px);
}

.dashboard-dark .pagination-number:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: #8b5cf6;
  color: #a855f7;
}

.pagination-number.active {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.dashboard-dark .pagination-number.active {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
}

/* Divisor entre seções */
.section-divider {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 48px 0;
  padding: 0 4px;
}

.section-divider::before,
.section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(99, 102, 241, 0.15) 20%,
    rgba(139, 92, 246, 0.25) 50%,
    rgba(99, 102, 241, 0.15) 80%,
    transparent 100%
  );
  position: relative;
}

.section-divider::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(99, 102, 241, 0.15) 20%,
    rgba(139, 92, 246, 0.25) 50%,
    rgba(99, 102, 241, 0.15) 100%
  );
}

.section-divider::after {
  background: linear-gradient(
    90deg,
    rgba(99, 102, 241, 0.15) 0%,
    rgba(139, 92, 246, 0.25) 50%,
    rgba(99, 102, 241, 0.15) 80%,
    transparent 100%
  );
}

.divider-text {
  position: relative;
  padding: 12px 32px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.dashboard-dark .divider-text {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.divider-text::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50px;
  padding: 2px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.section-divider:hover .divider-text::before {
  opacity: 1;
}

.section-divider:hover .divider-text {
  color: #6366f1;
  transform: scale(1.05);
  border-color: rgba(99, 102, 241, 0.3);
}

.dashboard-dark .section-divider:hover .divider-text {
  color: #818cf8;
}

/* Seção de Aparelhos Personalizados */
.custom-equipment-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 40px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%);
  border: 2px solid var(--border-color);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.custom-equipment-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.custom-equipment-section:hover::before {
  transform: scaleX(1);
}

.custom-equipment-section:hover {
  border-color: rgba(37, 99, 235, 0.4);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12);
}

.dashboard-dark .custom-equipment-section {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.dashboard-dark .custom-equipment-section:hover {
  border-color: rgba(37, 99, 235, 0.5);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.2);
}

/* Header do Formulário Customizado */
.custom-form-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon-wrapper {
  position: relative;
}

.header-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 
    0 8px 20px rgba(37, 99, 235, 0.35),
    0 0 0 6px rgba(37, 99, 235, 0.1);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.custom-equipment-section:hover .header-icon {
  transform: scale(1.05) rotate(-3deg);
  box-shadow: 
    0 12px 28px rgba(37, 99, 235, 0.45),
    0 0 0 8px rgba(37, 99, 235, 0.15);
}

.header-content {
  flex: 1;
}

.custom-form-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-dark .custom-form-title {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.custom-form-subtitle {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* Formulário Moderno */
.equipment-form-modern {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-fields-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.form-field-modern {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-field-modern.full-width-field {
  grid-column: 1 / -1;
}

.field-label-modern {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.label-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  transition: all 0.3s ease;
}

.dashboard-dark .label-icon {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
  color: #3b82f6;
}

.form-field-modern:focus-within .label-icon {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.label-text-modern {
  font-size: 0.9375rem;
  font-weight: 600;
}

.input-wrapper-modern {
  position: relative;
}

.input-modern,
.textarea-modern {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid var(--border-color);
  border-radius: 14px;
  font-size: 1rem;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--input-background);
  transition: all 0.3s ease;
  outline: none;
}

.input-modern:hover,
.textarea-modern:hover {
  border-color: rgba(37, 99, 235, 0.3);
}

.input-modern:focus,
.textarea-modern:focus {
  border-color: #2563eb;
  box-shadow: 
    0 0 0 4px rgba(37, 99, 235, 0.1),
    0 4px 12px rgba(37, 99, 235, 0.15);
  transform: translateY(-1px);
}

.textarea-modern {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

.input-modern::placeholder,
.textarea-modern::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

/* Ações do Formulário */
.form-actions-modern {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 8px;
}

.btn-clear-modern,
.btn-add-modern {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  max-width: 280px;
  min-height: 56px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  font-family: inherit;
}

.btn-clear-modern {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-clear-modern:hover {
  background: var(--bg-primary);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-add-modern {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-add-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.btn-add-modern:hover::before {
  left: 100%;
}

.btn-add-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}

.btn-add-modern:active {
  transform: translateY(0);
}

/* Seção de Aparelhos Adicionados */
.added-equipments-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 2px dashed var(--border-color);
}

.added-header {
  margin-bottom: 24px;
}

.added-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.added-title svg {
  color: #10b981;
}

.equipments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  border: 1px solid var(--border-color);
  border-radius: 20px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.section-subtitle {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 6px 0 0 0;
}

.btn-add-equipment {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-add-equipment:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

/* Formulário de Equipamento */
.equipment-form-card {
  background: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 28px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.equipment-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.equipment-form-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.btn-close-form {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.btn-close-form:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
  transform: rotate(90deg);
}

.equipment-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.equipment-form-grid .full-width {
  grid-column: 1 / -1;
}

.equipment-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.btn-secondary {
  padding: 12px 24px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--bg-primary);
  transform: translateY(-2px);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

/* Lista de Equipamentos */
.equipments-list {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}

.equipment-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.equipment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(37, 99, 235, 0.3);
}

.equipment-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.equipment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.equipment-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.equipment-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.equipment-quantity {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.equipment-quantity svg {
  color: #6366f1;
}

.equipment-quantity strong {
  color: var(--text-primary);
  font-weight: 700;
}

.equipment-actions {
  display: flex;
  gap: 8px;
}

.btn-icon-edit,
.btn-icon-delete {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-icon-edit {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.btn-icon-edit:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: translateY(-2px);
}

.btn-icon-delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-icon-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-2px);
}

/* Estado Vazio */
.empty-equipments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
}

.empty-icon {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  max-width: 400px;
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


/* Responsive */
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .modal-header {
    padding: 24px 32px;
  }

  .modal-body {
    padding: 32px;
  }
  
  .equipment-form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-fields-wrapper {
    grid-template-columns: 1fr;
  }
  
  .custom-equipment-section {
    padding: 32px 24px;
  }
  
  .custom-form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-icon {
    width: 56px;
    height: 56px;
  }
  
  .custom-form-title {
    font-size: 1.5rem;
  }
  
  .form-actions-modern {
    flex-direction: column;
  }
  
  .btn-clear-modern,
  .btn-add-modern {
    width: 100%;
    justify-content: center;
  }
  
  .exercises-grid-featured {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .equipment-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .exercises-grid-featured {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .modal-container-large {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  .modal-header {
    padding: 20px 24px;
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-header-content {
    gap: 12px;
    width: 100%;
  }

  .steps-indicator {
    width: 100%;
    padding: 16px;
    justify-content: space-between;
  }
  
  .step-info {
    display: none;
  }
  
  .step-connector {
    width: 30px;
  }

  .modal-icon {
    width: 48px;
    height: 48px;
  }

  .modal-icon svg {
    width: 24px;
    height: 24px;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .modal-body {
    padding: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
  
  .section-header-modern {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .equipments-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .btn-add-equipment {
    width: 100%;
    justify-content: center;
  }
  
  .equipment-card-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .quantity-selector {
    justify-content: space-between;
  }
  
  .btn-add-to-list,
  .added-badge {
    width: 100%;
    justify-content: center;
  }
  
  .search-placeholder {
    padding: 60px 24px;
  }
  
  .placeholder-icon {
    width: 96px;
    height: 96px;
  }
  
  .equipment-card {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .equipment-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }

  .upload-area-modern {
    padding: 40px 24px;
  }

  .upload-icon-container {
    width: 100px;
    height: 100px;
  }

  .icon-circle-outer {
    width: 90px;
    height: 90px;
  }

  .icon-circle-inner {
    width: 70px;
    height: 70px;
  }

  .upload-icon-svg {
    width: 28px;
    height: 28px;
  }

  .upload-title-modern {
    font-size: 1.25rem;
  }

  .upload-subtitle-modern {
    font-size: 0.875rem;
  }

  .upload-button-modern {
    padding: 12px 28px;
    font-size: 0.9375rem;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 16px 20px;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-subtitle {
    font-size: 0.875rem;
  }

  .modal-body {
    padding: 20px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-input,
  .form-textarea {
    padding: 12px 16px;
    font-size: 0.9375rem;
  }
}
</style>