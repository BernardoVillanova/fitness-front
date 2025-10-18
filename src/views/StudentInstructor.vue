<template>
  <div class="student-instructor" :class="{ 'dark-mode': isDarkMode }">
    <StudentNavBar />
    
    <div class="page-wrapper">
      <!-- Mensagem quando não há instrutor -->
      <div v-if="!instructor && !loading" class="empty-instructor-state">
        <div class="container">
          <i class="fas fa-user-slash"></i>
          <h3>Nenhum instrutor atribuído</h3>
          <p>Você ainda não possui um instrutor vinculado. Entre em contato com a recepção da academia para solicitar um acompanhamento personalizado.</p>
        </div>
      </div>

      <!-- Hero Section -->
      <div v-if="instructor" class="hero">
        <div class="hero-content">
          <div class="container">
            <div class="hero-flex">
              <!-- Avatar -->
              <div class="avatar-wrapper">
                <div class="avatar">
                  <img v-if="instructor.avatar" :src="instructor.avatar" :alt="instructor.name" />
                  <span v-else>{{ getInitials(instructor.name) }}</span>
                </div>
              </div>

              <!-- Header Info -->
              <div class="hero-info">
                <h1 class="hero-title">{{ instructor.name }}</h1>
                <p v-if="instructor.speciality" class="hero-subtitle">
                  Personal Trainer especializado em {{ instructor.speciality }}
                </p>

                <div class="hero-meta">
                  <div v-if="instructor.yearsOfExperience" class="hero-meta-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                    </svg>
                    <span>{{ instructor.yearsOfExperience }} anos de experiência</span>
                  </div>
                  <div v-if="instructor.cref" class="hero-meta-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span>CREF: {{ instructor.cref }}</span>
                  </div>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="hero-buttons">
                <a v-if="instructor.phone" :href="`tel:${instructor.phone}`" class="btn btn-primary">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  Ligar
                </a>
                <a v-if="instructor.email" :href="`mailto:${instructor.email}`" class="btn btn-secondary">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Enviar Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="instructor" class="main-content">
        <div class="container">
          <div class="grid">
            <!-- Left Column -->
            <div class="left-column">
              <!-- About Section -->
              <div v-if="instructor.bio" class="card">
                <h2 class="card-title">Sobre</h2>
                <p class="card-text">{{ instructor.bio }}</p>
              </div>

              <!-- Specialties Section -->
              <div v-if="instructor.specialties && instructor.specialties.length > 0" class="card">
                <h2 class="card-title">Especialidades</h2>
                <div class="specialties">
                  <span v-for="specialty in instructor.specialties" :key="specialty" class="badge">
                    <i :class="getSpecialtyIcon(specialty)"></i>
                    {{ specialty }}
                  </span>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="card">
                <h2 class="card-title">Informações de Contato</h2>

                <div class="contact-grid">
                  <!-- Phone -->
                  <div v-if="instructor.phone" class="contact-item">
                    <div class="contact-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div class="contact-info">
                      <p class="contact-label">Telefone</p>
                      <p class="contact-value">{{ instructor.phone }}</p>
                      <a :href="`tel:${instructor.phone}`" class="contact-link">Ligar agora</a>
                    </div>
                  </div>

                  <!-- Email -->
                  <div v-if="instructor.email" class="contact-item">
                    <div class="contact-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div class="contact-info">
                      <p class="contact-label">Email</p>
                      <p class="contact-value">{{ instructor.email }}</p>
                      <a :href="`mailto:${instructor.email}`" class="contact-link">Enviar email</a>
                    </div>
                  </div>

                  <!-- Hours -->
                  <div v-if="instructor.availableHours" class="contact-item full">
                    <div class="contact-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="contact-info">
                      <p class="contact-label">Horário de Atendimento</p>
                      <p class="contact-value">{{ instructor.availableHours }}</p>
                    </div>
                  </div>

                  <!-- Location -->
                  <div v-if="instructor.location" class="contact-item full">
                    <div class="contact-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <div class="contact-info">
                      <p class="contact-label">Localização</p>
                      <p class="contact-value">{{ instructor.location }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="right-column">
              <!-- Certifications -->
              <div v-if="instructor.certifications && instructor.certifications.length > 0" class="card">
                <h2 class="card-title">Certificações</h2>
                <div class="cert-list">
                  <div v-for="cert in instructor.certifications" :key="cert" class="cert-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ cert }}</span>
                  </div>
                </div>
              </div>

              <!-- Sessions Card -->
              <div class="sessions-card">
                <div class="sessions-header">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <h2>Próximas Sessões</h2>
                </div>

                <div v-if="upcomingSessions.length === 0" class="sessions-empty">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p>Nenhuma sessão agendada</p>
                  <p class="small">
                    Agende uma sessão com seu instrutor para acompanhamento personalizado
                  </p>
                </div>

                <div v-else class="sessions-list-compact">
                  <div v-for="session in upcomingSessions" :key="session.id" class="session-item-compact">
                    <div class="session-date-small">
                      <span class="day">{{ getDay(session.date) }}</span>
                      <span class="month">{{ getMonth(session.date) }}</span>
                    </div>
                    <div class="session-info-small">
                      <h4>{{ session.type }}</h4>
                      <p>{{ session.time }}</p>
                    </div>
                  </div>
                </div>

                <button @click="scheduleSession" class="btn btn-white">
                  Agendar Nova Sessão
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/theme'
import { useAuthStore } from '@/store/auth'
import StudentNavBar from '@/components/StudentNavBar.vue'
import api from '@/api'

// Stores
const themeStore = useThemeStore()
const authStore = useAuthStore()
const { isDarkMode } = storeToRefs(themeStore)

// Reactive data
const loading = ref(true)
const instructor = ref(null)
const upcomingSessions = ref([])

// Cache do instructor no store para evitar re-fetch
const cachedInstructor = computed(() => authStore.instructorData)

// Fetch instructor data
const fetchInstructorData = async () => {
  // Verificar se já temos dados em cache
  if (cachedInstructor.value) {
    instructor.value = cachedInstructor.value
    loading.value = false
    return
  }

  loading.value = true
  try {
    // Buscar dados do estudante do sessionStorage
    const storedUser = sessionStorage.getItem('user')
    if (!storedUser) {
      useFallbackData()
      loading.value = false
      return
    }

    const userData = JSON.parse(storedUser)
    const userId = userData.id || userData._id
    
    if (!userId) {
      useFallbackData()
      loading.value = false
      return
    }

    // Buscar dados completos do estudante por userId (já traz instructor populado)
    const studentResponse = await api.get(`/students/user/${userId}`)
    const studentData = studentResponse.data
    
    // Verificar se o aluno tem instrutor atribuído
    if (studentData.instructorId) {
      const instructorData = studentData.instructorId
      
      // Se só tiver _id e name, o populate não funcionou - buscar diretamente
      const fieldsCount = Object.keys(instructorData).length
      if (fieldsCount <= 3) {  // _id, name, __v ou similar
        try {
          const instructorResponse = await api.get(`/instructors/${instructorData._id}`)
          Object.assign(instructorData, instructorResponse.data)
        } catch (err) {
          console.error('Erro ao buscar dados completos do instrutor:', err)
        }
      }
      
      // Formatar horário de trabalho (SOMENTE se existir no banco)
      let availableHours = null
      if (instructorData.availability && instructorData.availability.workingDays && instructorData.availability.workingDays.length > 0) {
        const days = instructorData.availability.workingDays.join(', ')
        const start = instructorData.availability.startTime
        const end = instructorData.availability.endTime
        availableHours = `${days}: ${start} - ${end}`
      }
      
      // Usar APENAS dados reais do banco, sem fallbacks ou mocks
      instructor.value = {
        id: instructorData._id,
        name: instructorData.name,
        speciality: instructorData.specialties && instructorData.specialties.length > 0 
          ? instructorData.specialties.join(', ') 
          : null,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorData.name)}&background=2563eb&color=fff&size=120`,
        rating: instructorData.rating || null,  // Null se não existir
        reviews: instructorData.reviews || null,  // Null se não existir
        bio: instructorData.bio,  // APENAS do banco
        specialties: instructorData.specialties,  // APENAS do banco
        certifications: instructorData.certifications,  // APENAS do banco
        phone: instructorData.phone,  // APENAS do banco (pode ser null)
        email: instructorData.email,  // APENAS do banco
        availableHours: availableHours,  // APENAS do banco (pode ser null)
        location: studentData.gymId?.name || null,
        yearsOfExperience: instructorData.yearsOfExperience,  // APENAS do banco
        cref: instructorData.cref  // ADICIONAR CREF do banco
      }
      
      // Salvar no store para cache
      authStore.setInstructorData(instructor.value)
      
      // Buscar sessões agendadas (se houver endpoint)
      try {
        const sessionsResponse = await api.get('/workout-sessions/sessions/upcoming')
        if (sessionsResponse.data && Array.isArray(sessionsResponse.data)) {
          upcomingSessions.value = sessionsResponse.data.map(s => ({
            id: s._id || s.id,
            type: s.type || s.title || 'Sessão de Treino',
            date: s.date || s.scheduledDate,
            time: s.time || new Date(s.scheduledDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            location: s.location || instructor.value.location || 'Academia'
          }))
        }
      } catch (err) {
        // Nenhuma sessão agendada
      }
    } else {
      // Se não tem instrutor, usar fallback
      useFallbackData()
    }
  } catch (error) {
    console.error('Erro ao buscar dados do instrutor:', error)
    useFallbackData()
  } finally {
    loading.value = false
  }
}

// Fallback quando não há instrutor atribuído
const useFallbackData = () => {
  instructor.value = null  // Apenas null, sem dados mockados
}

// Schedule session
const scheduleSession = () => {
  // TODO: Implementar modal de agendamento
}

const getDay = (dateStr) => {
  return new Date(dateStr).getDate().toString().padStart(2, '0')
}

const getMonth = (dateStr) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return months[new Date(dateStr).getMonth()]
}

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getSpecialtyIcon = (specialty) => {
  const specialtyLower = specialty.toLowerCase()
  
  // Mapeamento de especialidades para ícones Font Awesome
  const iconMap = {
    'musculação': 'fas fa-dumbbell',
    'musculacao': 'fas fa-dumbbell',
    'crossfit': 'fas fa-fire-flame-curved',
    'yoga': 'fas fa-om',
    'pilates': 'fas fa-person-yoga',
    'funcional': 'fas fa-running',
    'cardio': 'fas fa-heart-pulse',
    'hiit': 'fas fa-bolt',
    'boxe': 'fas fa-hand-back-fist',
    'muay thai': 'fas fa-hand-back-fist',
    'luta': 'fas fa-hand-back-fist',
    'lutas': 'fas fa-hand-back-fist',
    'natação': 'fas fa-person-swimming',
    'natacao': 'fas fa-person-swimming',
    'corrida': 'fas fa-person-running',
    'emagrecimento': 'fas fa-fire',
    'hipertrofia': 'fas fa-weight-hanging',
    'alongamento': 'fas fa-hand-dots',
    'mobilidade': 'fas fa-arrows-rotate',
    'spinning': 'fas fa-bicycle',
    'ciclismo': 'fas fa-bicycle',
    'caminhada': 'fas fa-person-walking',
    'dança': 'fas fa-music',
    'danca': 'fas fa-music',
    'artes marciais': 'fas fa-hand-back-fist',
    'trx': 'fas fa-grip-lines',
    'ginástica': 'fas fa-child-reaching',
    'ginastica': 'fas fa-child-reaching',
    'atleta': 'fas fa-medal',
    'atletas': 'fas fa-medal'
  }
  
  // Buscar correspondência exata ou parcial
  for (const [key, value] of Object.entries(iconMap)) {
    if (specialtyLower === key || specialtyLower.includes(key) || key.includes(specialtyLower)) {
      return value
    }
  }
  
  // Ícone padrão
  return 'fas fa-star'
}

// Lifecycle
onMounted(() => {
  fetchInstructorData()
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.student-instructor {
  display: flex;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
}

.page-wrapper {
  flex: 1;
  margin-left: 280px;
  background: linear-gradient(to bottom right, #f8fafc, #dbeafe 50%, #f8fafc);
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark Mode Background */
.dark-mode .page-wrapper {
  background: linear-gradient(to bottom right, #0f172a, #1e293b 50%, #0f172a);
}

/* Detecta quando o navbar está colapsado */
body:has(.navbar-collapsed) .page-wrapper {
  margin-left: 0 !important;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Empty Instructor State */
.empty-instructor-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 4rem 2rem;
}

.empty-instructor-state i {
  font-size: 5rem;
  color: var(--text-muted);
  opacity: 0.3;
  margin-bottom: 1.5rem;
}

.empty-instructor-state h3 {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  font-weight: 700;
}

.empty-instructor-state p {
  font-size: 1.1rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
}

/* Hero Section */
.hero {
  background: linear-gradient(to bottom right, #eff6ff, #ffffff, #f8fafc);
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dark-mode .hero {
  background: linear-gradient(to bottom right, #1e293b, #334155, #1e293b);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.hero-content {
  padding: 64px 0;
  position: relative;
}

.hero-flex {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: flex-start;
}

@media (min-width: 1024px) {
  .hero-flex {
    flex-direction: row;
    align-items: center;
    gap: 48px;
  }
  .hero-content {
    padding: 96px 0;
  }
}

/* Avatar */
.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #3b82f6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  font-weight: bold;
  border: 4px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 1024px) {
  .avatar {
    width: 160px;
    height: 160px;
    font-size: 64px;
  }
}

.hero-info {
  flex: 1;
}

.hero-title {
  font-size: 36px;
  font-weight: bold;
  color: #0f172a;
  margin-bottom: 12px;
}

.dark-mode .hero-title {
  color: white;
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 48px;
  }
}

.hero-subtitle {
  font-size: 18px;
  color: #475569;
  line-height: 1.75;
  margin-bottom: 16px;
  max-width: 768px;
}

.dark-mode .hero-subtitle {
  color: #cbd5e1;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #64748b;
}

.dark-mode .hero-meta {
  color: #94a3b8;
}

.hero-meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

@media (min-width: 640px) {
  .hero-buttons {
    flex-direction: row;
    width: auto;
  }
}

@media (min-width: 1024px) {
  .hero-buttons {
    flex-direction: column;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-size: 16px;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background: #2563eb;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.dark-mode .btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark-mode .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

/* Main Content */
.main-content {
  padding: 48px 0;
}

@media (min-width: 1024px) {
  .main-content {
    padding: 64px 0;
  }
}

.grid {
  display: grid;
  gap: 32px;
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 2fr 1fr;
  }
}

.card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.dark-mode .card {
  background: #1e293b;
  border-color: rgba(71, 85, 105, 0.6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  color: #0f172a;
  margin-bottom: 16px;
}

.dark-mode .card-title {
  color: white;
}

.card-text {
  color: #475569;
  line-height: 1.75;
}

.dark-mode .card-text {
  color: #cbd5e1;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Specialties */
.specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  line-height: 1;
}

.badge i {
  font-size: 14px;
  line-height: 1;
}

.badge:hover {
  background: #dbeafe;
  transform: translateY(-1px);
}

.dark-mode .badge {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  border-color: rgba(59, 130, 246, 0.4);
}

.dark-mode .badge:hover {
  background: rgba(59, 130, 246, 0.3);
}

/* Contact Info */
.contact-grid {
  display: grid;
  gap: 24px;
}

@media (min-width: 640px) {
  .contact-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.contact-item {
  display: flex;
  gap: 16px;
}

.contact-item.full {
  grid-column: 1 / -1;
}

.contact-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-mode .contact-icon {
  background: rgba(59, 130, 246, 0.2);
}

.contact-icon svg {
  width: 20px;
  height: 20px;
  color: #2563eb;
}

.dark-mode .contact-icon svg {
  color: #93c5fd;
}

.contact-info {
  flex: 1;
}

.contact-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
}

.dark-mode .contact-label {
  color: #94a3b8;
}

.contact-value {
  color: #0f172a;
  font-weight: 500;
  margin-bottom: 8px;
}

.dark-mode .contact-value {
  color: white;
}

.contact-link {
  font-size: 14px;
  color: #2563eb;
  font-weight: 500;
  display: inline-block;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.contact-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.dark-mode .contact-link {
  color: #60a5fa;
}

.dark-mode .contact-link:hover {
  color: #93c5fd;
}

/* Certifications */
.cert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.cert-item svg {
  width: 20px;
  height: 20px;
  color: #16a34a;
  flex-shrink: 0;
  margin-top: 2px;
}

.dark-mode .cert-item svg {
  color: #4ade80;
}

.cert-item span {
  color: #334155;
  line-height: 1.75;
}

.dark-mode .cert-item span {
  color: #cbd5e1;
}

/* Sessions Card */
.sessions-card {
  background: linear-gradient(to bottom right, #2563eb, #1d4ed8);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  color: white;
}

.dark-mode .sessions-card {
  background: linear-gradient(to bottom right, #1e40af, #1e3a8a);
}

.sessions-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.sessions-header svg {
  width: 24px;
  height: 24px;
}

.sessions-header h2 {
  font-size: 20px;
  font-weight: bold;
}

.sessions-empty {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
}

.sessions-empty svg {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  opacity: 0.6;
}

.sessions-empty p {
  font-weight: 500;
  margin-bottom: 8px;
}

.sessions-empty .small {
  font-size: 14px;
  color: #bfdbfe;
  margin-bottom: 0;
}

.sessions-list-compact {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  max-height: 300px;
  overflow-y: auto;
}

.session-item-compact {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 12px;
}

.session-item-compact:last-child {
  margin-bottom: 0;
}

.session-date-small {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.session-date-small .day {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.session-date-small .month {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.8;
}

.session-info-small {
  flex: 1;
}

.session-info-small h4 {
  font-size: 0.95rem;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.session-info-small p {
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.8;
}

.btn-white {
  width: 100%;
  background: white;
  color: #2563eb;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

.btn-white:hover {
  background: #eff6ff;
}

.dark-mode .btn-white {
  background: rgba(255, 255, 255, 0.95);
}

.dark-mode .btn-white:hover {
  background: white;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .page-wrapper {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .hero-content {
    padding: 48px 0;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }

  .card {
    padding: 24px;
  }

  .card-title {
    font-size: 20px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>