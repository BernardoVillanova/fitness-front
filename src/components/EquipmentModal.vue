<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Header with tabs and close button -->
      <div class="header">
        <div class="tabs">
          <button
            @click="activeTab = 'register'"
            :class="['tab-button', { active: activeTab === 'register' }]"
          >
            Cadastrar
          </button>
          <button
            @click="activeTab = 'list'"
            :class="['tab-button', { active: activeTab === 'list' }]"
          >
            Listar
          </button>
        </div>
        <button class="close-button" @click="closeModal">
          <span class="close-icon">×</span>
        </button>
      </div>

      <h1 class="title">
        {{ activeTab === 'register' ? 'Cadastrar Aparelho' : 'Aparelhos Cadastrados' }}
      </h1>

      <div class="forms-container">
        <!-- Register Form -->
        <div :class="['form-wrapper', { active: activeTab === 'register' }]">
          <form @submit.prevent="handleSubmit" class="form">
            <!-- Nome do Aparelho -->
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M9 9h6v6H9z"></path>
              </svg>
              <input
                type="text"
                v-model="equipmentName"
                class="input with-icon"
                placeholder="Nome do aparelho"
                required
              />
            </div>

            <!-- Categoria -->
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <select
                v-model="category"
                class="input with-icon"
                required
              >
                <option value="" disabled>Selecione a categoria</option>
                <option value="cardio">Cardio</option>
                <option value="musculacao">Musculação</option>
                <option value="funcional">Funcional</option>
                <option value="crossfit">CrossFit</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <!-- Marca e Modelo -->
            <div class="name-fields">
              <div class="input-group">
                <input
                  type="text"
                  v-model="brand"
                  class="input"
                  placeholder="Marca"
                  required
                />
              </div>
              <div class="input-group">
                <input
                  type="text"
                  v-model="model"
                  class="input"
                  placeholder="Modelo"
                />
              </div>
            </div>

            <!-- Número de Série -->
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              <input
                type="text"
                v-model="serialNumber"
                class="input with-icon"
                placeholder="Número de série"
              />
            </div>

            <!-- Data de Aquisição -->
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <input
                type="date"
                v-model="acquisitionDate"
                class="input with-icon"
                placeholder="Data de aquisição"
              />
            </div>

            <!-- Estado e Localização -->
            <div class="name-fields">
              <div class="input-group">
                <select
                  v-model="condition"
                  class="input"
                  required
                >
                  <option value="" disabled>Estado</option>
                  <option value="novo">Novo</option>
                  <option value="otimo">Ótimo</option>
                  <option value="bom">Bom</option>
                  <option value="regular">Regular</option>
                  <option value="manutencao">Manutenção</option>
                </select>
              </div>
              <div class="input-group">
                <input
                  type="text"
                  v-model="location"
                  class="input"
                  placeholder="Localização"
                  required
                />
              </div>
            </div>

            <!-- Observações -->
            <div class="input-group">
              <textarea
                v-model="observations"
                class="textarea"
                placeholder="Observações (opcional)"
                rows="3"
              ></textarea>
            </div>

            <!-- Register button -->
            <button type="submit" class="submit-button" :disabled="isLoading">
              {{ isLoading ? 'Cadastrando...' : 'Cadastrar Aparelho' }}
            </button>
          </form>
        </div>

        <!-- List View -->
        <div :class="['form-wrapper', { active: activeTab === 'list' }]">
          <div class="equipment-list">
            <div v-if="equipmentList.length === 0" class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>Nenhum aparelho cadastrado</p>
            </div>

            <div v-else class="equipment-items">
              <div 
                v-for="(equipment, index) in equipmentList" 
                :key="index"
                class="equipment-item"
              >
                <div class="equipment-header">
                  <h3>{{ equipment.name }}</h3>
                  <span :class="['status-badge', equipment.condition]">
                    {{ getConditionLabel(equipment.condition) }}
                  </span>
                </div>
                <div class="equipment-details">
                  <p><strong>Categoria:</strong> {{ getCategoryLabel(equipment.category) }}</p>
                  <p><strong>Marca:</strong> {{ equipment.brand }}</p>
                  <p v-if="equipment.model"><strong>Modelo:</strong> {{ equipment.model }}</p>
                  <p><strong>Localização:</strong> {{ equipment.location }}</p>
                  <p v-if="equipment.serialNumber"><strong>Série:</strong> {{ equipment.serialNumber }}</p>
                </div>
                <button @click="removeEquipment(index)" class="remove-button">
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider">
        <div class="line"></div>
        <span class="divider-text">
          GESTÃO DE EQUIPAMENTOS
        </span>
        <div class="line"></div>
      </div>

      <!-- Stats -->
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number">{{ equipmentList.length }}</div>
          <div class="stat-label">Total de Aparelhos</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ getEquipmentByCondition('novo') + getEquipmentByCondition('otimo') }}</div>
          <div class="stat-label">Em Bom Estado</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-text">
          Sistema de Gestão de Academia v1.0
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EquipmentModal',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: 'register',
      equipmentName: '',
      category: '',
      brand: '',
      model: '',
      serialNumber: '',
      acquisitionDate: '',
      condition: '',
      location: '',
      observations: '',
      equipmentList: []
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    handleSubmit() {
      const newEquipment = {
        name: this.equipmentName,
        category: this.category,
        brand: this.brand,
        model: this.model,
        serialNumber: this.serialNumber,
        acquisitionDate: this.acquisitionDate,
        condition: this.condition,
        location: this.location,
        observations: this.observations,
        registeredAt: new Date().toISOString()
      }

      this.equipmentList.push(newEquipment)
      this.$emit('equipment-added', newEquipment)
      this.resetForm()
      this.activeTab = 'list'
    },
    resetForm() {
      this.equipmentName = ''
      this.category = ''
      this.brand = ''
      this.model = ''
      this.serialNumber = ''
      this.acquisitionDate = ''
      this.condition = ''
      this.location = ''
      this.observations = ''
    },
    removeEquipment(index) {
      this.equipmentList.splice(index, 1)
    },
    getConditionLabel(condition) {
      const labels = {
        novo: 'Novo',
        otimo: 'Ótimo',
        bom: 'Bom',
        regular: 'Regular',
        manutencao: 'Manutenção'
      }
      return labels[condition] || condition
    },
    getCategoryLabel(category) {
      const labels = {
        cardio: 'Cardio',
        musculacao: 'Musculação',
        funcional: 'Funcional',
        crossfit: 'CrossFit',
        outros: 'Outros'
      }
      return labels[category] || category
    },
    getEquipmentByCondition(condition) {
      return this.equipmentList.filter(eq => eq.condition === condition).length
    }
  }
}
</script>

<style scoped>
* {
  font-family: sans-serif;
}

.auth-container {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
}

.auth-card {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.auth-card:hover {
  transform: scale(1.02);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 9999px;
  padding: 0.50rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-button {
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

.tab-button:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
  transform: scale(1.05);
}

.tab-button.active {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-top: 0;
font-weight: 700;
}

.close-button {
  width: 3rem;
  height: 3rem;
  background: rgba(70, 70, 70, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.close-button:hover {
  background: rgba(90, 90, 90, 0.9);
  transform: scale(1.05);
}

.close-icon {
  color: rgba(255, 255, 255, 0.7);
  font-size: 2rem;
  font-weight: 300;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 2.25rem;
  font-weight: 400;
  color: white;
  margin-bottom: 2.5rem;
  transition: all 0.3s ease;
}

.forms-container {
  position: relative;
  overflow: hidden;
  min-height: 500px;
}

.form-wrapper {
  transition: all 0.5s ease;
  transform: translateX(100%);
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.form-wrapper.active {
  transform: translateX(0);
  opacity: 1;
  position: relative;
}

.form-wrapper:first-child.active {
  transform: translateX(0);
}

.form-wrapper:first-child:not(.active) {
  transform: translateX(-100%);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.name-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.input-group {
  position: relative;
}

.input, select.input {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  height: 3.75rem;
  color: white;
  font-size: 1.0625rem;
  padding: 0 1.25rem;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

select.input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;
  padding-right: 3rem;
}

select.input option {
  background: rgba(20, 20, 20, 0.95);
  color: white;
  padding: 0.5rem;
}

.textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  color: white;
  font-size: 1.0625rem;
  padding: 1.25rem;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
}

.input::placeholder, .textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input:hover, .textarea:hover {
  background: rgba(0, 0, 0, 0.3);
}

.input:focus, .textarea:focus {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}

.input.with-icon {
  padding-left: 3rem;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s ease;
  pointer-events: none;
}

.submit-button {
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 500;
  border-radius: 1rem;
  height: 3.75rem;
  margin-top: 1.5rem;
  font-size: 1.0625rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.submit-button:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.equipment-list {
  min-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: rgba(255, 255, 255, 0.4);
}

.empty-icon {
  width: 5rem;
  height: 5rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.2);
}

.equipment-items {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-height: 500px;
  overflow-y: auto;
}

.equipment-items::-webkit-scrollbar {
  width: 8px;
}

.equipment-items::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.equipment-items::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.equipment-items::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.equipment-item {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.equipment-item:hover {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.equipment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.equipment-header h3 {
  color: white;
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
}

.status-badge {
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.status-badge.novo, .status-badge.otimo {
  background: rgba(34, 197, 94, 0.2);
  color: rgb(134, 239, 172);
}

.status-badge.bom {
  background: rgba(59, 130, 246, 0.2);
  color: rgb(147, 197, 253);
}

.status-badge.regular {
  background: rgba(234, 179, 8, 0.2);
  color: rgb(253, 224, 71);
}

.status-badge.manutencao {
  background: rgba(239, 68, 68, 0.2);
  color: rgb(252, 165, 165);
}

.equipment-details {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9375rem;
  line-height: 1.7;
}

.equipment-details p {
  margin: 0.375rem 0;
}

.equipment-details strong {
  color: rgba(255, 255, 255, 0.9);
}

.remove-button {
  margin-top: 0.75rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: rgb(252, 165, 165);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-button:hover {
  background: rgba(239, 68, 68, 0.3);
  transform: scale(1.02);
}

.divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
}

.line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider-text {
  padding: 0 1rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-text {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.75rem;
}
</style>
