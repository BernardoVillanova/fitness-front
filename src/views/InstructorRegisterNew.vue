<template>
  <div class="register-page" :class="{ 'dark-mode': isDarkMode }">
    <NavBar />
    <NotificationModal 
      v-model:visible="notification.visible"
      :type="notification.type"
      :title="notification.title"
      :message="notification.message"
    />
    <div class="register-container">
      <!-- Progress Stepper -->
      <div class="progress-stepper">
        <div 
          v-for="(stepItem, index) in steps" 
          :key="index" 
          class="step-item"
          :class="{ 
            'active': currentStep === index + 1,
            'completed': currentStep > index + 1
          }"
        >
          <div class="step-circle">{{ index + 1 }}</div>
          <span class="step-label">{{ stepItem.label }}</span>
          <div v-if="index < steps.length - 1" class="step-line"></div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="form-card">
        <div class="form-header">
          <h1 class="form-title">{{ steps[currentStep - 1].title }}</h1>
          <p class="form-subtitle">{{ steps[currentStep - 1].subtitle }}</p>
        </div>

        <form @submit.prevent class="register-form">
          <!-- Step 1: Dados Profissionais -->
          <div v-if="currentStep === 1" class="form-step">
            <div class="info-banner">
              <div class="info-icon">💼</div>
              <div class="info-content">
                <h4>Informações Profissionais</h4>
                <p>Dados que validam sua expertise como instrutor</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label><font-awesome-icon :icon="['fas', 'id-card']" /> CREF (Opcional)</label>
                <input 
                  v-model="form.cref" 
                  type="text" 
                  placeholder="000000-G/SP"
                  v-mask="'######-#/AA'"
                />
              </div>
              <div class="form-group">
                <label><font-awesome-icon :icon="['fas', 'calendar-alt']" /> Anos de Experiência</label>
                <input 
                  v-model.number="form.yearsOfExperience" 
                  type="number" 
                  min="0"
                  placeholder="Ex: 5"
                  required
                />
              </div>
            </div>

            <div class="form-group full-width">
              <label><font-awesome-icon :icon="['fas', 'user']" /> Biografia Profissional</label>
              <textarea 
                v-model="form.bio" 
                rows="4"
                placeholder="Conte um pouco sobre sua trajetória profissional, formação e paixão pelo fitness..."
                required
              ></textarea>
            </div>
          </div>

          <!-- Step 2: Certificações e Especializações -->
          <div v-if="currentStep === 2" class="form-step">
            <div class="info-banner">
              <div class="info-icon">🏆</div>
              <div class="info-content">
                <h4>Qualificações</h4>
                <p>Suas certificações e áreas de especialização</p>
              </div>
            </div>

            <!-- Certificações -->
            <div class="section-card">
              <h3 class="section-title">
                <font-awesome-icon :icon="['fas', 'certificate']" /> Certificações
              </h3>
              <div class="add-item-container">
                <input 
                  v-model="certInput" 
                  type="text"
                  placeholder="Ex: Personal Trainer - CREF"
                  class="add-input"
                  @keyup.enter="addCertification"
                />
                <button type="button" @click="addCertification" class="btn-add-item">
                  <font-awesome-icon :icon="['fas', 'plus']" /> Adicionar
                </button>
              </div>
              <div v-if="form.certifications.length" class="items-list">
                <div 
                  v-for="(cert, index) in form.certifications" 
                  :key="index"
                  class="list-item"
                >
                  <font-awesome-icon :icon="['fas', 'certificate']" />
                  <span>{{ cert }}</span>
                  <button type="button" @click="removeCertification(index)" class="btn-remove-item">
                    <font-awesome-icon :icon="['fas', 'times']" />
                  </button>
                </div>
              </div>
              <p v-else class="empty-state">Nenhuma certificação adicionada</p>
            </div>

            <!-- Especializações -->
            <div class="section-card">
              <h3 class="section-title">
                <font-awesome-icon :icon="['fas', 'star']" /> Especializações
              </h3>
              <div class="specialties-grid">
                <label 
                  v-for="specialty in availableSpecialties" 
                  :key="specialty"
                  class="specialty-checkbox"
                >
                  <input 
                    type="checkbox" 
                    :value="specialty"
                    v-model="form.specialties"
                  />
                  <span>{{ specialty }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Step 3: Disponibilidade -->
          <div v-if="currentStep === 3" class="form-step">
            <div class="info-banner">
              <div class="info-icon">📅</div>
              <div class="info-content">
                <h4>Horários de Trabalho</h4>
                <p>Defina sua disponibilidade semanal</p>
              </div>
            </div>

            <div class="form-group full-width">
              <label><font-awesome-icon :icon="['fas', 'calendar-week']" /> Dias Disponíveis</label>
              <div class="days-selector">
                <label 
                  v-for="day in daysOfWeek" 
                  :key="day.value"
                  class="day-option"
                  :class="{ 'selected': form.availability.workingDays.includes(day.value) }"
                >
                  <input 
                    type="checkbox" 
                    :value="day.value"
                    v-model="form.availability.workingDays"
                  />
                  <span>{{ day.label }}</span>
                </label>
              </div>
            </div>

            <div class="form-row time-row">
              <div class="form-group">
                <label><font-awesome-icon :icon="['fas', 'clock']" /> Horário Início</label>
                <input 
                  v-model="form.availability.startTime" 
                  type="time"
                  required
                />
              </div>
              <div class="form-group">
                <label><font-awesome-icon :icon="['fas', 'clock']" /> Horário Fim</label>
                <input 
                  v-model="form.availability.endTime" 
                  type="time"
                  required
                />
              </div>
            </div>

            <div class="form-group full-width capacity-group">
              <label><font-awesome-icon :icon="['fas', 'users']" /> Capacidade Máxima de Alunos</label>
              <input 
                v-model.number="form.maxStudents" 
                type="number"
                min="1"
                placeholder="Ex: 20"
                required
              />
              <small>Número máximo de alunos que pode acompanhar simultaneamente</small>
            </div>
          </div>

          <!-- Step 4: Vincular Alunos (Opcional) -->
          <div v-if="currentStep === 4" class="form-step">
            <div class="info-banner">
              <div class="info-icon">👥</div>
              <div class="info-content">
                <h4>Vincular Alunos (Opcional)</h4>
                <p>Você pode adicionar alunos agora ou depois no painel</p>
              </div>
            </div>

            <!-- Busca de Alunos -->
            <div class="search-section">
              <div class="search-wrapper">
                <font-awesome-icon :icon="['fas', 'search']" />
                <input 
                  v-model="studentSearch" 
                  type="text"
                  placeholder="Buscar aluno por nome, CPF ou email..."
                  class="search-input"
                  @input="searchStudents"
                />
              </div>

              <!-- Resultados da Busca -->
              <div v-if="searchResults.length" class="search-results">
                <div 
                  v-for="student in searchResults" 
                  :key="student._id"
                  class="student-result-card"
                >
                  <div class="result-card-content">
                    <div class="student-avatar-search">
                      <font-awesome-icon :icon="['fas', 'user']" />
                    </div>
                    <div class="student-info-grid">
                      <h4 class="student-name" :title="student.name">{{ student.name }}</h4>
                      <div class="student-details">
                        <div class="detail-item">
                          <font-awesome-icon :icon="['fas', 'envelope']" class="detail-icon" />
                          <span :title="student.email">{{ student.email }}</span>
                        </div>
                        <div class="detail-item">
                          <font-awesome-icon :icon="['fas', 'phone']" class="detail-icon" />
                          <span>{{ formatPhone(student.phone) || 'Não informado' }}</span>
                        </div>
                        <div class="detail-item">
                          <font-awesome-icon :icon="['fas', 'id-card']" class="detail-icon" />
                          <span>{{ formatCPF(student.cpf) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    @click="toggleStudent(student)"
                    class="btn-add-compact"
                    :title="`Adicionar ${student.name}`"
                  >
                    <font-awesome-icon :icon="['fas', 'plus']" />
                  </button>
                </div>
              </div>
              <div v-else-if="studentSearch && studentSearch.length >= 2 && !loadingStudents" class="empty-search">
                <font-awesome-icon :icon="['fas', 'user-slash']" />
                <p>Nenhum aluno disponível encontrado</p>
                <small>Alunos que já possuem instrutor não aparecem na busca</small>
              </div>
              <div v-if="loadingStudents" class="loading-search">
                <font-awesome-icon :icon="['fas', 'spinner']" spin />
                <p>Buscando alunos...</p>
              </div>
            </div>

            <!-- Alunos Selecionados -->
            <div v-if="form.students.length" class="selected-students">
              <h3 class="section-title">
                <font-awesome-icon :icon="['fas', 'check-circle']" /> Alunos Selecionados ({{ form.students.length }})
              </h3>
              <div class="students-grid">
                <div 
                  v-for="student in form.students" 
                  :key="student._id"
                  class="selected-student-card"
                >
                  <div class="student-avatar">
                    <font-awesome-icon :icon="['fas', 'user']" />
                  </div>
                  <div class="student-details">
                    <h4>{{ student.name }}</h4>
                    <p>{{ student.email }}</p>
                  </div>
                  <button 
                    type="button"
                    @click="removeStudent(student._id)" 
                    class="btn-remove-student"
                  >
                    <font-awesome-icon :icon="['fas', 'times']" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="form-navigation">
            <button 
              type="button"
              @click="prevStep" 
              class="btn btn-secondary"
              :disabled="currentStep === 1"
            >
              <font-awesome-icon :icon="['fas', 'arrow-left']" /> Voltar
            </button>
            <button 
              type="button"
              @click="nextStep" 
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{ currentStep < totalSteps ? 'Próximo' : 'Finalizar Cadastro' }}
              <font-awesome-icon :icon="['fas', currentStep < totalSteps ? 'arrow-right' : 'check']" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { API_URL } from '@/config'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/theme'
import NavBar from '@/components/NavBar.vue'
import NotificationModal from '@/components/NotificationModal.vue'
import axios from 'axios'

const router = useRouter()
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)


const route = router.currentRoute.value
const userId = route.query.userId


const notification = ref({
  visible: false,
  type: 'info',
  title: '',
  message: ''
})

const showNotification = (type, title, message) => {
  notification.value = {
    visible: true,
    type,
    title,
    message
  }
}


const steps = [
  { label: 'Profissional', title: 'Dados Profissionais', subtitle: 'Informações sobre sua carreira' },
  { label: 'Qualificações', title: 'Certificações e Especializações', subtitle: 'Suas qualificações e áreas de atuação' },
  { label: 'Disponibilidade', title: 'Horários de Trabalho', subtitle: 'Defina sua disponibilidade' },
  { label: 'Alunos', title: 'Vincular Alunos', subtitle: 'Adicione alunos à sua carteira (opcional)' }
]

const currentStep = ref(1)
const totalSteps = 4
const isSubmitting = ref(false)
const certInput = ref('')
const studentSearch = ref('')
const searchResults = ref([])
const loadingStudents = ref(false)
let searchTimeout = null


const form = ref({
  userId: userId || '',
  cref: '',
  yearsOfExperience: null,
  bio: '',
  certifications: [],
  specialties: [],
  availability: {
    workingDays: [],
    startTime: '08:00',
    endTime: '18:00'
  },
  maxStudents: 20,
  students: []
})


const availableSpecialties = [
  'Musculação',
  'Funcional',
  'CrossFit',
  'Pilates',
  'Yoga',
  'Spinning',
  'Natação',
  'Lutas',
  'Emagrecimento',
  'Hipertrofia',
  'Reabilitação',
  'Terceira Idade',
  'Gestantes',
  'Atletas'
]


const daysOfWeek = [
  { label: 'Dom', value: 'Domingo' },
  { label: 'Seg', value: 'Segunda' },
  { label: 'Ter', value: 'Terça' },
  { label: 'Qua', value: 'Quarta' },
  { label: 'Qui', value: 'Quinta' },
  { label: 'Sex', value: 'Sexta' },
  { label: 'Sáb', value: 'Sábado' }
]


const addCertification = () => {
  const cert = certInput.value.trim()
  if (cert && !form.value.certifications.includes(cert)) {
    form.value.certifications.push(cert)
    certInput.value = ''
  }
}

const removeCertification = (index) => {
  form.value.certifications.splice(index, 1)
}

const searchStudents = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!studentSearch.value || studentSearch.value.length < 2) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    loadingStudents.value = true
    try {
      const config = {
        params: {
          search: studentSearch.value,
          limit: 10
        }
      }
      
     
      const response = await axios.get(`${API_URL}/api/students/public-search`, config)
      
     
      const filtered = response.data.filter(student => {
        const alreadySelected = form.value.students.some(s => s._id === student._id)
        const hasInstructor = student.instructorId && student.instructorId !== null
        
        return !alreadySelected && !hasInstructor
      })
      
      searchResults.value = filtered
    } catch (error) {
      console.error('❌ Error searching students:', error)
      searchResults.value = []
    } finally {
      loadingStudents.value = false
    }
  }, 500)
}

const toggleStudent = (student) => {
  const index = form.value.students.findIndex(s => s._id === student._id)
  if (index === -1) {
    form.value.students.push(student)
  } else {
    form.value.students.splice(index, 1)
  }
 
  searchResults.value = searchResults.value.filter(s => s._id !== student._id)
}

const removeStudent = (studentId) => {
  form.value.students = form.value.students.filter(s => s._id !== studentId)
}

const formatCPF = (cpf) => {
  if (!cpf) return ''
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

const validateStep = () => {
  switch (currentStep.value) {
    case 1:
      if (!form.value.yearsOfExperience || form.value.yearsOfExperience < 0) {
        showNotification('warning', 'Atenção', 'Informe os anos de experiência')
        return false
      }
      if (!form.value.bio || form.value.bio.length < 50) {
        showNotification('warning', 'Biografia Incompleta', 'A biografia deve ter pelo menos 50 caracteres')
        return false
      }
      break
    case 2:
      if (form.value.certifications.length === 0) {
        showNotification('warning', 'Certificações Necessárias', 'Adicione pelo menos uma certificação')
        return false
      }
      if (form.value.specialties.length === 0) {
        showNotification('warning', 'Especializações Necessárias', 'Selecione pelo menos uma especialização')
        return false
      }
      break
    case 3:
      if (form.value.availability.workingDays.length === 0) {
        showNotification('warning', 'Dias de Trabalho', 'Selecione pelo menos um dia de trabalho')
        return false
      }
      if (!form.value.availability.startTime || !form.value.availability.endTime) {
        showNotification('warning', 'Horário Incompleto', 'Defina o horário de trabalho')
        return false
      }
      if (form.value.availability.startTime >= form.value.availability.endTime) {
        showNotification('warning', 'Horário Inválido', 'O horário de início deve ser antes do horário de fim')
        return false
      }
      if (!form.value.maxStudents || form.value.maxStudents < 1) {
        showNotification('warning', 'Capacidade Necessária', 'Defina a capacidade máxima de alunos')
        return false
      }
      break
  }
  return true
}

const nextStep = async () => {
  if (!validateStep()) return

  if (currentStep.value < totalSteps) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    await submitForm()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const submitForm = async () => {
  if (!form.value.userId) {
    showNotification('error', 'Erro no Cadastro', 'ID do usuário não encontrado. Volte ao início.')
    return
  }

  isSubmitting.value = true

  try {
    const instructorPayload = {
      userId: form.value.userId,
      cref: form.value.cref || null,
      yearsOfExperience: form.value.yearsOfExperience,
      bio: form.value.bio,
      certifications: form.value.certifications,
      specialties: form.value.specialties,
      availability: {
        workingDays: form.value.availability.workingDays,
        startTime: form.value.availability.startTime,
        endTime: form.value.availability.endTime
      },
      maxStudents: form.value.maxStudents,
      students: form.value.students.map(s => s._id)
    }

    const { data } = await axios.post(`${API_URL}/api/instructors`, instructorPayload)
    console.log('data: ', data);
        
    showNotification('success', 'Cadastro Realizado!', 'Você será redirecionado para o login.')
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    showNotification('error', 'Erro no Cadastro', error.response?.data?.message || error.message || 'Erro ao cadastrar instrutor')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<script>
export default {
  name: 'InstructorRegisterNew'
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

* {
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
}

.register-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: 6rem 1rem 2rem 1rem;
}

.register-container {
  max-width: 900px;
  margin: 0 auto;
  padding-top: 1rem;
}

/* Progress Stepper */
.progress-stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
  position: relative;
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
  background: var(--card-bg);
  border: 3px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-muted);
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

.step-item.active .step-circle {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.dark-mode .step-item.active .step-circle {
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
}

.step-item.completed .step-circle {
  background: var(--success-color);
  border-color: var(--success-color);
  color: white;
}

.step-label {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
  text-align: center;
  transition: all 0.3s ease;
}

.step-item.active .step-label {
  color: var(--primary-color);
  font-weight: 600;
}

.step-item.completed .step-label {
  color: var(--success-color);
}

.step-line {
  position: absolute;
  top: 25px;
  left: 50%;
  width: 100%;
  height: 3px;
  background: var(--border-color);
  z-index: 1;
  transition: all 0.3s ease;
}

.step-item.completed .step-line {
  background: var(--success-color);
}

/* Form Card */
.form-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.dark-mode .form-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.form-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
}

/* Info Banner */
.info-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: 12px;
  margin-bottom: 2rem;
  color: white;
}

.info-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.info-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.9;
}

.info-content p {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Form Elements */
.register-form {
  width: 100%;
}

.form-step {
  animation: fadeInUp 0.4s ease;
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

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.form-row.time-row {
  gap: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group.capacity-group {
  margin-top: 1.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group label svg,
.form-group label i {
  color: var(--primary-color);
  font-size: 0.95rem;
  flex-shrink: 0;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  outline: none;
  width: 100%;
}

.form-group input[type="time"] {
  font-family: "Inter", sans-serif;
  cursor: pointer;
}

.form-group input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.form-group input[type="number"]::-webkit-inner-spin-button,
.form-group input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .form-group input:focus,
.dark-mode .form-group select:focus,
.dark-mode .form-group textarea:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group small {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Section Card */
.section-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
}

.section-title svg,
.section-title i {
  color: var(--primary-color);
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

/* Add Item */
.add-item-container {
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
  margin-bottom: 1rem;
  width: 100%;
}

.add-input {
  flex: 1;
  min-width: 0;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
  height: auto;
}

.add-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-add-item {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  flex-shrink: 0;
  width: auto;
  max-width: 150px;
}

.btn-add-item:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

/* Items List */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.list-item:hover {
  border-color: var(--primary-color);
  transform: translateX(5px);
}

.list-item svg,
.list-item i {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.list-item span {
  flex: 1;
  font-weight: 500;
  color: var(--text-color);
}

.btn-remove-item {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--danger-color);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  font-size: 0.875rem;
}

.btn-remove-item:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-style: italic;
}

/* Specialties Grid */
.specialties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.specialty-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: var(--text-color);
}

.specialty-checkbox:hover {
  border-color: var(--primary-color);
}

.specialty-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.specialty-checkbox input[type="checkbox"]:checked + span {
  color: var(--primary-color);
  font-weight: 600;
}

/* Days Selector */
.days-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 0.5rem;
}

.day-option {
  position: relative;
  cursor: pointer;
  flex: 0 0 auto;
}

.day-option input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.day-option span {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
  transition: all 0.3s ease;
  min-width: 85px;
  text-align: center;
  user-select: none;
}

.day-option:hover span {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.day-option.selected span,
.day-option input[type="checkbox"]:checked + span {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Search Section */
.search-section {
  margin-bottom: 2rem;
}

.search-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.search-wrapper svg,
.search-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 1rem;
  width: 16px;
  height: 16px;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  max-height: 500px;
  overflow-y: auto;
  margin-top: 1rem;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
}

.student-result-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.875rem;
  padding: 0.875rem 1.125rem;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  margin-bottom: 0.875rem;
  min-height: 135px;
}

.student-result-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
}

.dark-mode .student-result-card:hover {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
}

.result-card-content {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  flex: 1;
  min-width: 0;
}

.student-avatar-search {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #667eea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
  margin-top: 0;
}

.student-result-card:hover .student-avatar-search {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
}

.student-avatar-search svg {
  width: 26px;
  height: 26px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.student-info-grid {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0;
}

.student-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
  margin-bottom: 0;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  overflow: hidden;
  line-height: 1.5;
  min-height: 20px;
}

.detail-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--primary-color);
  opacity: 0.8;
}

.detail-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.btn-add-compact {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 10px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  position: relative;
  align-self: flex-start;
  margin-top: 0.2rem;
}

.btn-add-compact::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-add-compact:hover {
  background: var(--primary-hover);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-add-compact:hover::before {
  opacity: 1;
}

.btn-add-compact:active {
  transform: translateY(0) scale(0.98);
}

.btn-add-compact svg {
  width: 18px;
  height: 18px;
}

.empty-search,
.loading-search {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-muted);
}

.empty-search svg,
.empty-search i,
.loading-search svg,
.loading-search i {
  font-size: 3rem;
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-search p,
.loading-search p {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.empty-search small {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  opacity: 0.8;
}

/* Selected Students */
.selected-students {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.selected-student-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--bg-secondary);
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.selected-student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.student-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.student-avatar svg {
  width: 20px;
  height: 20px;
}

.student-details {
  flex: 1;
  min-width: 0;
}

.student-details h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-details p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-remove-student {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--danger-color);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  font-size: 0.875rem;
}

.btn-remove-student:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.btn-remove-student svg {
  width: 14px;
  height: 14px;
}

/* Navigation */
.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--text-muted);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.dark-mode .btn-primary:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .progress-stepper {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .step-item {
    flex-direction: row;
    width: 100%;
  }

  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 0.95rem;
  }

  .step-label {
    margin-top: 0;
    margin-left: 0.75rem;
  }

  .step-line {
    display: none;
  }

  .form-card {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .specialties-grid {
    grid-template-columns: 1fr;
  }

  .days-selector {
    justify-content: center;
  }

  .students-grid {
    grid-template-columns: 1fr;
  }

  .form-navigation {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .register-page {
    padding: 5rem 0.5rem 1rem 0.5rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .add-item-container {
    flex-direction: column;
  }

  .btn-add-item {
    width: 100%;
    justify-content: center;
  }
}
</style>
