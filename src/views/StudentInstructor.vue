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

      <!-- Card de Perfil Principal do Instrutor -->
      <div v-if="instructor" class="card-profile-main">
        <div class="container">
          <div class="profile-header">
            <div class="header-content">
              <div class="avatar-wrapper">
                <div class="avatar">
                  <img :src="instructor.avatar" :alt="instructor.name" />
                </div>
              </div>

              <div class="header-info">
                <div class="name-section">
                  <h1>{{ instructor.name }}</h1>
                  <span class="badge-primary">Personal Trainer</span>
                </div>
                <p class="email">{{ instructor.email }}</p>
                <p v-if="instructor.speciality" class="subtitle">
                  Especializado em {{ instructor.speciality }}
                </p>
                
                <div class="meta-info">
                  <div v-if="instructor.yearsOfExperience" class="meta-item">
                    <i class="fas fa-award"></i>
                    <span>{{ instructor.yearsOfExperience }} anos de experiência</span>
                  </div>
                  <div v-if="instructor.cref" class="meta-item">
                    <i class="fas fa-id-card"></i>
                    <span>CREF: {{ instructor.cref }}</span>
                  </div>
                  <div v-if="instructor.location" class="meta-item">
                    <i class="fas fa-building"></i>
                    <span>{{ instructor.location }}</span>
                  </div>
                </div>
              </div>

              <!-- CTA Buttons -->
              <div class="action-buttons">
                <a v-if="instructor.phone" :href="`tel:${instructor.phone}`" class="btn btn-primary">
                  <i class="fas fa-phone"></i>
                  Ligar
                </a>
                <a v-if="instructor.email" :href="`mailto:${instructor.email}`" class="btn btn-outline">
                  <i class="fas fa-envelope"></i>
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
        
        console.log('📋 instructorData inicial:', instructorData)
        
        // Se só tiver _id e name, o populate não funcionou - buscar diretamente
        const fieldsCount = Object.keys(instructorData).length
        if (fieldsCount <= 3) {  // _id, name, __v ou similar
          try {
            console.log('🔄 Populate incompleto, buscando dados completos do instrutor...')
            const instructorResponse = await api.get(`/instructors/${instructorData._id}`)
            Object.assign(instructorData, instructorResponse.data)
            console.log('✅ Dados completos do instrutor carregados:', instructorResponse.data)
          } catch (err) {
            console.error('❌ Erro ao buscar dados completos do instrutor:', err)
          }
        } else {
          console.log('✅ instructorData já está populado')
        }
        
        // Buscar dados do userId do instrutor para pegar avatar e informações atualizadas
        let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorData.name)}&background=2563eb&color=fff&size=200`
        
        console.log('🔍 Dados do instrutor:', {
          id: instructorData._id,
          name: instructorData.name,
          userId: instructorData.userId,
          hasUserId: !!instructorData.userId,
          userIdType: typeof instructorData.userId,
          userIdKeys: instructorData.userId ? Object.keys(instructorData.userId) : []
        })
        
        // Tentar buscar avatar do próprio objeto instructorData primeiro
        if (instructorData.userId) {
          // Se userId é um objeto (populado), extrair avatar
          if (typeof instructorData.userId === 'object' && instructorData.userId.avatar) {
            const userData = instructorData.userId
            
            console.log('👤 userId já populado com avatar:', {
              hasAvatar: !!userData.avatar,
              avatarType: userData.avatar.startsWith('data:image') ? 'base64' : 
                         userData.avatar.startsWith('http') ? 'url' : 'path',
              avatarPreview: userData.avatar.substring(0, 50) + '...'
            })
            
            if (userData.avatar.startsWith('data:image')) {
              avatarUrl = userData.avatar
              console.log('✅ Avatar carregado (base64 do populate)')
            } else if (userData.avatar.startsWith('http')) {
              avatarUrl = userData.avatar
              console.log('✅ Avatar carregado (URL completa do populate):', avatarUrl)
            } else {
              avatarUrl = `http://localhost:3000${userData.avatar}`
              console.log('✅ Avatar carregado (path relativo do populate):', avatarUrl)
            }
          } else if (typeof instructorData.userId === 'string') {
            // userId é apenas string (ID), não está populado
            console.log('⚠️ userId é string, não está populado. Precisamos fazer populate no backend')
          } else {
            console.log('⚠️ userId está populado mas não tem avatar')
          }
        } else {
          console.log('⚠️ Instrutor não tem userId associado')
        }
        
        console.log('🖼️ Avatar final que será usado:', avatarUrl)
        
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
          avatar: avatarUrl,
          rating: instructorData.rating || null,
          reviews: instructorData.reviews || null,
          bio: instructorData.bio,
          specialties: instructorData.specialties,
          certifications: instructorData.certifications,
          phone: instructorData.phone,
          email: instructorData.email,
          availableHours: availableHours,
          location: studentData.gymId?.name || null,
          yearsOfExperience: instructorData.yearsOfExperience,
          cref: instructorData.cref
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

/* Card Profile Main */
.card-profile-main {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.dark-mode .card-profile-main {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.profile-header {
  padding: 3rem 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  .header-content {
    flex-direction: row;
    align-items: center;
    gap: 2.5rem;
  }
}

/* Avatar */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 4px solid #e2e8f0;
}

.dark-mode .avatar {
  background: #334155;
  border-color: #475569;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Header Info */
.header-info {
  flex: 1;
  color: var(--text-color);
}

.dark-mode .header-info {
  color: white;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.name-section h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-color);
}

.dark-mode .name-section h1 {
  color: white;
}

.badge-primary {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.email {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
}

.dark-mode .email {
  color: #cbd5e1;
}

.subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.dark-mode .subtitle {
  color: #cbd5e1;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.dark-mode .meta-item {
  color: #cbd5e1;
}

.meta-item i {
  font-size: 1rem;
  color: var(--primary-color);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .action-buttons {
    flex-direction: row;
    gap: 1rem;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-outline {
  background: white;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.dark-mode .btn-outline {
  background: transparent;
  color: #60a5fa;
  border-color: #60a5fa;
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.dark-mode .btn-outline:hover {
  background: #60a5fa;
  color: white;
  border-color: #60a5fa;
}

/* Main Content */
.main-content {
  padding: 2rem 0 4rem 0;
}

.grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 2fr 1fr;
  }
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.dark-mode .card {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark-mode .card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-title i {
  color: var(--primary-color);
  font-size: 1.25rem;
}

.card-text {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1rem;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Specialties */
.specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.badge {
  padding: 0.625rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  background: var(--primary-light);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 8px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1;
}

.badge i {
  font-size: 0.9rem;
  line-height: 1;
}

.badge:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.dark-mode .badge {
  background: rgba(102, 126, 234, 0.15);
  color: #93c5fd;
  border-color: rgba(102, 126, 234, 0.4);
}

.dark-mode .badge:hover {
  background: rgba(102, 126, 234, 0.3);
  color: white;
}

/* Contact Info */
.contact-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .contact-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.contact-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.contact-item.full {
  grid-column: 1 / -1;
}

.contact-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.contact-item:hover .contact-icon {
  background: var(--primary-color);
  transform: scale(1.1);
}

.dark-mode .contact-icon {
  background: rgba(102, 126, 234, 0.2);
}

.dark-mode .contact-item:hover .contact-icon {
  background: rgba(102, 126, 234, 0.4);
}

.contact-icon svg {
  width: 20px;
  height: 20px;
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.contact-item:hover .contact-icon svg {
  color: white;
}

.dark-mode .contact-icon svg {
  color: #93c5fd;
}

.dark-mode .contact-item:hover .contact-icon svg {
  color: white;
}

.contact-info {
  flex: 1;
}

.contact-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-value {
  color: var(--text-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.contact-link {
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 600;
  display: inline-block;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.contact-link:hover {
  color: var(--primary-hover);
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
  gap: 1rem;
}

.cert-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cert-item:hover {
  background: var(--primary-light);
  border-color: var(--primary-color);
  transform: translateX(4px);
}

.dark-mode .cert-item {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .cert-item:hover {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.4);
}

.cert-item svg {
  width: 20px;
  height: 20px;
  color: var(--success-color);
  flex-shrink: 0;
  margin-top: 2px;
}

.cert-item span {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
}

.dark-mode .cert-item span {
  color: var(--text-muted);
}

/* Sessions Card */
.sessions-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: var(--text-color);
}

.dark-mode .sessions-card {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: white;
}

.sessions-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.sessions-header svg {
  width: 24px;
  height: 24px;
}

.sessions-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
}

.sessions-empty {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
}

.dark-mode .sessions-empty {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.sessions-empty svg {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  opacity: 0.6;
  color: var(--text-muted);
}

.sessions-empty p {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: var(--text-color);
}

.dark-mode .sessions-empty p {
  color: white;
}

.sessions-empty .small {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0;
  line-height: 1.5;
}

.sessions-list-compact {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
}

.dark-mode .sessions-list-compact {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.session-item-compact {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.dark-mode .session-item-compact {
  background: #334155;
  border-color: rgba(255, 255, 255, 0.1);
}

.session-item-compact:hover {
  background: var(--primary-light);
  transform: translateX(4px);
  border-color: var(--primary-color);
}

.dark-mode .session-item-compact:hover {
  background: rgba(102, 126, 234, 0.2);
}

.session-item-compact:last-child {
  margin-bottom: 0;
}

.session-date-small {
  width: 56px;
  height: 56px;
  background: var(--primary-light);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--primary-color);
}

.dark-mode .session-date-small {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.4);
}

.session-date-small .day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--primary-color);
}

.dark-mode .session-date-small .day {
  color: #93c5fd;
}

.session-date-small .month {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.9;
  margin-top: 0.125rem;
  color: var(--primary-color);
}

.dark-mode .session-date-small .month {
  color: #93c5fd;
}

.session-info-small {
  flex: 1;
}

.session-info-small h4 {
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: var(--text-color);
}

.dark-mode .session-info-small h4 {
  color: white;
}

.session-info-small p {
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.9;
  color: var(--text-secondary);
}

.dark-mode .session-info-small p {
  color: #cbd5e1;
}

.btn-white {
  width: 100%;
  background: var(--primary-color);
  color: white;
  font-family: "Inter", sans-serif;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 10px;
}

.btn-white:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .btn-white {
  background: #60a5fa;
}

.dark-mode .btn-white:hover {
  background: #3b82f6;
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