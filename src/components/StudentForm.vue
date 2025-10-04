<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Header com Gradiente e Orbs Animados -->
      <div class="modal-header">
        <div class="header-background">
          <div class="gradient-orb orb-1"></div>
          <div class="gradient-orb orb-2"></div>
          <div class="gradient-orb orb-3"></div>
        </div>
        <div class="header-content">
          <div class="icon-wrapper">
            <div class="icon-glow"></div>
            <i class="fas fa-user-plus"></i>
          </div>
          <div class="header-text">
            <h2>{{ student ? 'Editar Aluno' : 'Novo Aluno' }}</h2>
            <p class="subtitle">{{ student ? 'Atualize' : 'Cadastre' }} as informações com precisão</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')" aria-label="Fechar">
          <span class="close-line"></span>
          <span class="close-line"></span>
        </button>
      </div>

      <div class="form-container">
        <!-- Progress Bar Premium com 4 Etapas -->
        <div class="progress-container">
          <div class="progress-steps">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="step-wrapper"
            >
              <div 
                class="step" 
                :class="{ 
                  active: currentStep >= index + 1, 
                  completed: currentStep > index + 1 
                }"
                @click="goToStep(index + 1)"
              >
                <div class="step-circle">
                  <div class="step-circle-bg"></div>
                  <div class="step-circle-border"></div>
                  <div class="step-content">
                    <transition name="step-icon" mode="out-in">
                      <i v-if="currentStep > index + 1" class="fas fa-check" :key="'check-' + index"></i>
                      <span v-else :key="'num-' + index">{{ index + 1 }}</span>
                    </transition>
                  </div>
                </div>
                <span class="step-label">{{ step.label }}</span>
              </div>
              
              <div v-if="index < steps.length - 1" class="step-line-wrapper">
                <div class="step-line" :class="{ active: currentStep >= index + 2 }">
                  <div class="step-line-fill"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="form-content">
          <!-- Seção 1: Informações Pessoais -->
          <transition name="slide-fade" mode="out-in">
            <div v-if="currentStep === 1" class="form-section" key="step-1">
              <div class="section-header">
                <div class="section-icon">
                  <div class="section-icon-bg"></div>
                  <i class="fas fa-user-circle"></i>
                </div>
                <div class="section-text">
                  <h3>Informações Pessoais</h3>
                  <p>Dados fundamentais para análise física</p>
                </div>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="modern-label">
                    <span class="label-icon">
                      <i class="fas fa-weight"></i>
                    </span>
                    <span class="label-text">Peso</span>
                  </label>
                  <div class="input-wrapper">
                    <input 
                      type="number" 
                      v-model="form.personalInfo.weight"
                      step="0.1"
                      min="0"
                      placeholder="70.5"
                      class="modern-input"
                    />
                    <span class="input-unit">kg</span>
                    <div class="input-border"></div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="modern-label">
                    <span class="label-icon">
                      <i class="fas fa-ruler-vertical"></i>
                    </span>
                    <span class="label-text">Altura</span>
                  </label>
                  <div class="input-wrapper">
                    <input 
                      type="number" 
                      v-model="form.personalInfo.height"
                      step="1"
                      min="0"
                      placeholder="175"
                      class="modern-input"
                    />
                    <span class="input-unit">cm</span>
                    <div class="input-border"></div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="modern-label">
                  <span class="label-icon">
                    <i class="fas fa-chart-line"></i>
                  </span>
                  <span class="label-text">Nível de Experiência</span>
                </label>
                <div class="select-wrapper">
                  <select v-model="form.personalInfo.trainingExperience" class="modern-select">
                    <option value="iniciante">🌱 Iniciante - Começando agora</option>
                    <option value="intermediario">💪 Intermediário - 6+ meses</option>
                    <option value="avancado">🔥 Avançado - 2+ anos</option>
                    <option value="atleta">🏆 Atleta - Competidor</option>
                  </select>
                  <div class="select-border"></div>
                  <div class="select-icon">
                    <i class="fas fa-chevron-down"></i>
                  </div>
                </div>
              </div>

              <!-- IMC Card Premium -->
              <transition name="scale-fade">
                <div v-if="form.personalInfo.weight > 0 && form.personalInfo.height > 0" class="imc-card">
                  <div class="imc-background">
                    <div class="imc-orb imc-orb-1"></div>
                    <div class="imc-orb imc-orb-2"></div>
                  </div>
                  <div class="imc-content">
                    <div class="imc-badge">
                      <span>ÍNDICE DE MASSA CORPORAL</span>
                    </div>
                    <div class="imc-value-wrapper">
                      <div class="imc-value">{{ calculateIMC }}</div>
                      <div class="imc-unit">kg/m²</div>
                    </div>
                    <div class="imc-category" :class="imcCategory.class">
                      <div class="category-dot"></div>
                      <span>{{ imcCategory.label }}</span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </transition>

          <!-- Seção 2: Localização -->
          <transition name="slide-fade" mode="out-in">
            <div v-if="currentStep === 2" class="form-section" key="step-2">
              <div class="section-header">
                <div class="section-icon">
                  <div class="section-icon-bg"></div>
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="section-text">
                  <h3>Localização</h3>
                  <p>Informações geográficas do aluno</p>
                </div>
              </div>
              
              <div class="form-group">
                <label class="modern-label">
                  <span class="label-icon">
                    <i class="fas fa-city"></i>
                  </span>
                  <span class="label-text">Cidade</span>
                </label>
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    v-model="form.personalInfo.location.city"
                    placeholder="Digite a cidade"
                    class="modern-input"
                  />
                  <div class="input-border"></div>
                </div>
              </div>

              <div class="form-group">
                <label class="modern-label">
                  <span class="label-icon">
                    <i class="fas fa-map-signs"></i>
                  </span>
                  <span class="label-text">Bairro</span>
                </label>
                <div class="input-wrapper">
                  <input 
                    type="text" 
                    v-model="form.personalInfo.location.neighborhood"
                    placeholder="Digite o bairro"
                    class="modern-input"
                  />
                  <div class="input-border"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Seção 3: Restrições de Saúde -->
          <transition name="slide-fade" mode="out-in">
            <div v-if="currentStep === 3" class="form-section" key="step-3">
              <div class="section-header">
                <div class="section-icon">
                  <div class="section-icon-bg"></div>
                  <i class="fas fa-heartbeat"></i>
                </div>
                <div class="section-text">
                  <h3>Restrições de Saúde</h3>
                  <p>Informações médicas importantes</p>
                </div>
              </div>
              
              <div class="form-group">
                <label class="modern-label">
                  <span class="label-icon">
                    <i class="fas fa-notes-medical"></i>
                  </span>
                  <span class="label-text">Condições Crônicas</span>
                </label>
                <div class="textarea-wrapper">
                  <textarea 
                    v-model="form.healthRestrictions.chronicConditions"
                    placeholder="Descreva condições crônicas (diabetes, hipertensão, etc.)"
                    class="modern-textarea"
                    rows="3"
                  ></textarea>
                  <div class="textarea-border"></div>
                </div>
                <span class="help-text">
                  <i class="fas fa-info-circle"></i>
                  Uma condição por linha
                </span>
              </div>

              <div class="form-group">
                <label class="modern-label">
                  <span class="label-icon">
                    <i class="fas fa-pills"></i>
                  </span>
                  <span class="label-text">Medicamentos em Uso</span>
                </label>
                <div class="textarea-wrapper">
                  <textarea 
                    v-model="form.healthRestrictions.medications"
                    placeholder="Liste os medicamentos que utiliza regularmente"
                    class="modern-textarea"
                    rows="3"
                  ></textarea>
                  <div class="textarea-border"></div>
                </div>
                <span class="help-text">
                  <i class="fas fa-info-circle"></i>
                  Um medicamento por linha
                </span>
              </div>

              <div class="form-group">
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    v-model="form.healthRestrictions.medicalAuthorization"
                    class="checkbox-input"
                  >
                  <div class="checkbox-card">
                    <div class="checkbox-icon">
                      <div class="checkbox-icon-bg"></div>
                      <i class="fas fa-shield-check"></i>
                    </div>
                    <div class="checkbox-content">
                      <strong>Autorização Médica</strong>
                      <p>Possui autorização médica para prática de exercícios físicos</p>
                    </div>
                    <div class="checkbox-indicator">
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </transition>

          <!-- Seção 4: Status e Objetivos -->
          <transition name="slide-fade" mode="out-in">
            <div v-if="currentStep === 4" class="form-section" key="step-4">
              <div class="section-header">
                <div class="section-icon">
                  <div class="section-icon-bg"></div>
                  <i class="fas fa-bullseye"></i>
                </div>
                <div class="section-text">
                  <h3>Status e Objetivos</h3>
                  <p>Defina metas e acompanhamento</p>
                </div>
              </div>
              
              <div class="form-group">
                <label class="modern-label">
                  <span class="label-icon">
                    <i class="fas fa-toggle-on"></i>
                  </span>
                  <span class="label-text">Status do Aluno</span>
                </label>
                <div class="status-grid">
                  <label 
                    v-for="status in statusOptions" 
                    :key="status.value"
                    class="status-card" 
                    :class="{ selected: form.status === status.value }"
                  >
                    <input type="radio" v-model="form.status" :value="status.value" class="status-input">
                    <div class="status-content">
                      <div class="status-icon-wrapper">
                        <div class="status-icon-bg"></div>
                        <i :class="status.icon"></i>
                      </div>
                      <span class="status-label">{{ status.label }}</span>
                    </div>
                    <div class="status-check">
                      <i class="fas fa-check"></i>
                    </div>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="modern-label">
                  <span class="label-icon">
                    <i class="fas fa-target"></i>
                  </span>
                  <span class="label-text">Objetivos e Metas</span>
                </label>
                <div class="textarea-wrapper">
                  <textarea 
                    v-model="form.goals"
                    placeholder="Descreva os objetivos do aluno (perda de peso, ganho de massa, condicionamento, etc.)"
                    class="modern-textarea"
                    rows="4"
                  ></textarea>
                  <div class="textarea-border"></div>
                </div>
                <span class="help-text">
                  <i class="fas fa-info-circle"></i>
                  Seja específico para criar um plano de treino personalizado
                </span>
              </div>
            </div>
          </transition>
        </div>

        <!-- Navigation com Botões Animados -->
        <div class="form-navigation">
          <button 
            v-if="currentStep > 1"
            type="button" 
            class="nav-btn btn-secondary" 
            @click="previousStep"
          >
            <span class="btn-icon">
              <i class="fas fa-arrow-left"></i>
            </span>
            <span class="btn-text">Anterior</span>
            <div class="btn-shine"></div>
          </button>
          
          <div class="nav-spacer"></div>
          
          <button 
            v-if="currentStep < 4"
            type="button" 
            class="nav-btn btn-primary" 
            @click="nextStep"
          >
            <span class="btn-text">Próximo</span>
            <span class="btn-icon">
              <i class="fas fa-arrow-right"></i>
            </span>
            <div class="btn-shine"></div>
          </button>
          
          <button 
            v-if="currentStep === 4"
            type="button" 
            class="nav-btn btn-submit" 
            @click="handleSubmit"
          >
            <span class="btn-icon">
              <i class="fas fa-save"></i>
            </span>
            <span class="btn-text">{{ student ? 'Atualizar Aluno' : 'Cadastrar Aluno' }}</span>
            <div class="btn-shine"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  student: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const currentStep = ref(1)

const steps = [
  { label: 'PESSOAL', icon: 'fa-user-circle' },
  { label: 'LOCAL', icon: 'fa-map-marker-alt' },
  { label: 'SAÚDE', icon: 'fa-heartbeat' },
  { label: 'METAS', icon: 'fa-bullseye' }
]

const statusOptions = [
  { value: 'active', label: 'Ativo', icon: 'fas fa-check-circle' },
  { value: 'paused', label: 'Em Pausa', icon: 'fas fa-pause-circle' },
  { value: 'inactive', label: 'Inativo', icon: 'fas fa-times-circle' }
]

const form = ref({
  personalInfo: {
    weight: 0,
    height: 0,
    trainingExperience: 'iniciante',
    location: {
      city: '',
      neighborhood: ''
    }
  },
  healthRestrictions: {
    chronicConditions: '',
    medications: '',
    medicalAuthorization: false
  },
  status: 'active',
  goals: ''
})

const calculateIMC = computed(() => {
  const weight = parseFloat(form.value.personalInfo.weight)
  const height = parseFloat(form.value.personalInfo.height) / 100
  if (weight > 0 && height > 0) {
    return (weight / (height * height)).toFixed(1)
  }
  return '0.0'
})

const imcCategory = computed(() => {
  const imc = parseFloat(calculateIMC.value)
  if (imc < 18.5) return { label: 'Abaixo do peso', class: 'underweight' }
  if (imc < 25) return { label: 'Peso normal', class: 'normal' }
  if (imc < 30) return { label: 'Sobrepeso', class: 'overweight' }
  return { label: 'Obesidade', class: 'obese' }
})

const goToStep = (step) => {
  if (step <= currentStep.value) {
    currentStep.value = step
  }
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  try {
    const data = { ...form.value }
    
    data.healthRestrictions.chronicConditions = data.healthRestrictions.chronicConditions
      .split('\n')
      .filter(item => item.trim())
    
    data.healthRestrictions.medications = data.healthRestrictions.medications
      .split('\n')
      .filter(item => item.trim())
    
    data.goals = [{
      description: data.goals,
      targetValue: 0
    }]

    emit('save', data)
  } catch (error) {
    console.error('Erro ao salvar aluno:', error)
  }
}

onMounted(() => {
  if (props.student) {
    form.value = {
      personalInfo: {
        weight: props.student.personalInfo?.weight || 0,
        height: props.student.personalInfo?.height || 0,
        trainingExperience: props.student.personalInfo?.trainingExperience || 'iniciante',
        location: {
          city: props.student.personalInfo?.location?.city || '',
          neighborhood: props.student.personalInfo?.location?.neighborhood || ''
        }
      },
      healthRestrictions: {
        chronicConditions: (props.student.healthRestrictions?.chronicConditions || []).join('\n'),
        medications: (props.student.healthRestrictions?.medications || []).join('\n'),
        medicalAuthorization: props.student.healthRestrictions?.medicalAuthorization || false
      },
      status: props.student.status || 'active',
      goals: props.student.goals?.[0]?.description || ''
    }
  }
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", sans-serif;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.5rem;
  animation: overlayFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: "Inter", sans-serif;
}

@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: #ffffff;
  border-radius: 32px;
  width: 100%;
  max-width: 950px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 60px 120px -20px rgba(0, 0, 0, 0.6), 0 30px 60px -30px rgba(102, 126, 234, 0.5);
  animation: modalSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.92); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  position: relative;
  overflow: hidden;
}

.header-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: floatOrb 8s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent 70%);
  top: -200px;
  right: -100px;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(138, 75, 175, 0.4), transparent 70%);
  bottom: -150px;
  left: -50px;
  animation-delay: 2s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent 70%);
  top: 50%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes floatOrb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  z-index: 1;
}

.icon-wrapper {
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  color: white;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  position: relative;
  animation: iconPulse 3s ease-in-out infinite;
}

.icon-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%);
  border-radius: 50%;
  filter: blur(20px);
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.header-text h2 {
  color: white;
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: -1px;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
  margin: 0.5rem 0 0;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.close-btn {
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  z-index: 1;
  position: relative;
}

.close-line {
  position: absolute;
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-line:first-child {
  transform: rotate(45deg);
}

.close-line:last-child {
  transform: rotate(-45deg);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg);
  border-color: rgba(255, 255, 255, 0.4);
}

.close-btn:hover .close-line {
  width: 24px;
}

.form-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.progress-container {
  background: linear-gradient(to bottom, #fafbff, #ffffff);
  border-bottom: 1px solid rgba(102, 126, 234, 0.08);
  padding: 2.5rem 2rem 2rem;
  position: relative;
}

.progress-container::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 750px;
  margin: 0 auto;
}

.step-wrapper {
  display: flex;
  align-items: center;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.4;
}

.step.active {
  opacity: 1;
}

.step-circle {
  width: 56px;
  height: 56px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-circle-bg {
  position: absolute;
  inset: 0;
  background: #e8eaf6;
  border-radius: 50%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.step.active .step-circle-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
}

.step.completed .step-circle-bg {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.step-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-weight: 900;
  font-size: 1.25rem;
  z-index: 1;
  transition: all 0.3s;
}

.step.active .step-content {
  color: white;
}

.step-label {
  font-size: 0.875rem;
  font-weight: 800;
  color: #64748b;
  transition: all 0.4s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.step.active .step-label {
  color: #667eea;
  font-size: 0.938rem;
  letter-spacing: 1px;
}

.step-line-wrapper {
  display: flex;
  align-items: center;
  margin: 0 0.75rem -2rem;
}

.step-line {
  width: 90px;
  height: 4px;
  background: #e8eaf6;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.step-line-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-line.active .step-line-fill {
  transform: scaleX(1);
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 3rem 2.5rem;
  background: #ffffff;
}

.form-content::-webkit-scrollbar {
  width: 10px;
}

.form-content::-webkit-scrollbar-track {
  background: transparent;
}

.form-content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #667eea, #764ba2);
  border-radius: 10px;
  border: 2px solid #ffffff;
}

.form-section {
  max-width: 750px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid transparent;
  background: linear-gradient(white, white) padding-box, linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent) border-box;
  border-image-slice: 1;
  position: relative;
}

.section-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1.75rem;
  flex-shrink: 0;
  position: relative;
}

.section-icon-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 18px;
  transition: all 0.4s;
}

.section-icon i {
  position: relative;
  z-index: 1;
}

.section-text h3 {
  color: #0f172a;
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  margin: 0 0 0.25rem;
}

.section-text p {
  color: #64748b;
  font-size: 0.938rem;
  margin: 0;
  font-weight: 500;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.75rem;
  margin-bottom: 1.75rem;
}

.form-group {
  margin-bottom: 2rem;
}

.modern-label {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1rem;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.label-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-wrapper,
.select-wrapper,
.textarea-wrapper {
  position: relative;
}

.modern-input,
.modern-select,
.modern-textarea {
  width: 100%;
  padding: 1.125rem 1.5rem;
  border: 2px solid #e8eaf6;
  border-radius: 16px;
  background: #fafbff;
  color: #0f172a;
  font-size: 1.063rem;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.input-wrapper .modern-input {
  padding-right: 4.5rem;
}

.input-unit {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-weight: 900;
  font-size: 0.938rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  padding: 0.625rem 1rem;
  border-radius: 12px;
  pointer-events: none;
  z-index: 2;
  transition: all 0.3s;
}

.modern-input:focus + .input-unit {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-50%) scale(1.05);
}

.modern-input::placeholder,
.modern-textarea::placeholder {
  color: #94a3b8;
  font-weight: 500;
}

.modern-input:focus,
.modern-select:focus,
.modern-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), 0 8px 24px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.input-border,
.select-border,
.textarea-border {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  pointer-events: none;
  opacity: 0;
  transition: all 0.4s;
}

.modern-input:focus ~ .input-border,
.modern-select:focus ~ .select-border,
.modern-textarea:focus ~ .textarea-border {
  opacity: 1;
}

.select-wrapper {
  position: relative;
}

.modern-select {
  cursor: pointer;
  padding-right: 4rem;
  appearance: none;
}

.select-icon {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-size: 1rem;
  pointer-events: none;
  z-index: 2;
  transition: all 0.3s;
}

.modern-select:focus ~ .select-icon {
  transform: translateY(-50%) rotate(180deg);
}

.modern-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.7;
  font-weight: 500;
}

.help-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.875rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.help-text i {
  color: #667eea;
}

.checkbox-container {
  display: block;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem;
  border: 2px solid #e8eaf6;
  border-radius: 20px;
  background: #fafbff;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.checkbox-input:checked + .checkbox-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
  border-color: #667eea;
}

.checkbox-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  position: relative;
}

.checkbox-icon-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 16px;
  transition: all 0.4s;
}

.checkbox-input:checked + .checkbox-card .checkbox-icon-bg {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.checkbox-icon i {
  position: relative;
  z-index: 1;
  color: #667eea;
  transition: all 0.4s;
}

.checkbox-input:checked + .checkbox-card .checkbox-icon i {
  color: white;
}

.checkbox-content {
  flex: 1;
}

.checkbox-content strong {
  display: block;
  color: #0f172a;
  font-size: 1.063rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.checkbox-content p {
  color: #64748b;
  font-size: 0.938rem;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
}

.checkbox-indicator {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e8eaf6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: transparent;
  font-size: 0.75rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-card .checkbox-indicator {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: scale(1.1) rotate(360deg);
}

.imc-card {
  margin-top: 2.5rem;
  padding: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.imc-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.imc-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: floatOrb 10s ease-in-out infinite;
}

.imc-orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent);
  top: -150px;
  right: -100px;
}

.imc-orb-2 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(138, 75, 175, 0.5), transparent);
  bottom: -100px;
  left: -50px;
  animation-delay: 5s;
}

.imc-content {
  position: relative;
  z-index: 1;
}

.imc-badge {
  display: inline-block;
  margin-bottom: 1.5rem;
}

.imc-badge span {
  display: inline-block;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  padding: 0.625rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.imc-value-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.imc-value {
  color: white;
  font-size: 5rem;
  font-weight: 900;
  letter-spacing: -3px;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.imc-unit {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.25rem;
  font-weight: 700;
}

.imc-category {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 1.063rem;
  font-weight: 800;
  padding: 0.875rem 1.75rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.status-card {
  display: block;
  cursor: pointer;
}

.status-input {
  display: none;
}

.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.125rem;
  padding: 2rem 1.25rem;
  border: 2px solid #e8eaf6;
  border-radius: 20px;
  background: #fafbff;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.status-card:hover .status-content {
  border-color: #c7d2fe;
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.15);
}

.status-card.selected .status-content {
  border-color: transparent;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.4);
  transform: translateY(-5px);
}

.status-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  position: relative;
}

.status-icon-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 18px;
  transition: all 0.4s;
}

.status-card.selected .status-icon-bg {
  background: rgba(255, 255, 255, 0.2);
}

.status-icon-wrapper i {
  position: relative;
  z-index: 1;
  color: #667eea;
  transition: all 0.4s;
}

.status-card.selected .status-icon-wrapper i {
  color: white;
}

.status-label {
  font-weight: 900;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.4s;
  letter-spacing: 0.5px;
}

.status-card.selected .status-label {
  color: white;
}

.status-check {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 0.75rem;
  opacity: 0;
  transform: scale(0);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.status-card.selected .status-check {
  opacity: 1;
  transform: scale(1) rotate(360deg);
}

.form-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 2rem 2.5rem;
  background: linear-gradient(to top, #fafbff, #ffffff);
  border-top: 1px solid rgba(102, 126, 234, 0.08);
}

.nav-spacer {
  flex: 1;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.125rem 2.25rem;
  border-radius: 16px;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  white-space: nowrap;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.nav-btn:hover .btn-shine {
  left: 100%;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s;
  position: relative;
  z-index: 1;
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-secondary {
  background: #ffffff;
  border: 2px solid #e8eaf6;
  color: #64748b;
}

.btn-secondary:hover {
  border-color: #667eea;
  color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
}

.btn-secondary:hover .btn-icon {
  transform: translateX(-4px);
}

.btn-primary,
.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
  border: none;
}

.btn-primary:hover,
.btn-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.45);
}

.btn-primary:hover .btn-icon {
  transform: translateX(4px);
}

.btn-submit {
  padding: 1.125rem 2.75rem;
}

.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.scale-fade-enter-active {
  animation: scaleFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleFadeIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.step-icon-enter-active,
.step-icon-leave-active {
  transition: all 0.3s;
}

.step-icon-enter-from {
  opacity: 0;
  transform: scale(0) rotate(-180deg);
}

.step-icon-leave-to {
  opacity: 0;
  transform: scale(0) rotate(180deg);
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-content {
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-header {
    padding: 2rem 1.5rem;
  }

  .header-text h2 {
    font-size: 1.75rem;
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    font-size: 1.75rem;
  }

  .progress-container {
    padding: 2rem 1.5rem 1.5rem;
  }

  .step-circle {
    width: 48px;
    height: 48px;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .step-line {
    width: 40px;
  }

  .form-content {
    padding: 2rem 1.5rem;
  }

  .form-grid,
  .status-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .section-text h3 {
    font-size: 1.5rem;
  }

  .imc-card {
    padding: 2rem 1.5rem;
  }

  .imc-value {
    font-size: 3.5rem;
  }

  .form-navigation {
    padding: 1.5rem;
    flex-wrap: wrap;
  }

  .nav-btn {
    padding: 1rem 1.75rem;
  }

  .btn-submit {
    width: 100%;
    order: 3;
  }
}

</style>