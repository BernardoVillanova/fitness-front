<template>
  <div class="student-instructor" :class="{ 'dark-mode': isDarkMode }">
    <StudentNavBar />
    <main class="main-content">
      <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-            })
          }
        } catch (err) {
          // Nenhuma sessão agendada
          upcomingSessions.value = []
        }tie"></i>
        Meu Instrutor
      </h1>
      <p class="page-subtitle">Informações sobre seu personal trainer</p>
    </div>

    <!-- Instructor Profile -->
    <div v-if="instructor" class="instructor-profile">
      <div class="profile-card">
        <div class="profile-header">
          <div class="instructor-avatar">
            <img :src="instructor.avatar" :alt="instructor.name" />
          </div>
          <div class="instructor-info">
            <h2>{{ instructor.name }}</h2>
            <p class="instructor-title">{{ instructor.speciality }}</p>
            <div class="instructor-rating">
              <div class="rating-stars">
                <i v-for="n in 5" :key="n" :class="n <= instructor.rating ? 'fas fa-star' : 'far fa-star'"></i>
              </div>
              <span class="rating-text">{{ instructor.rating }}/5 ({{ instructor.reviews }} avaliações)</span>
            </div>
          </div>
          <div class="contact-actions">
            <a v-if="instructor.phone" :href="`tel:${instructor.phone}`" class="btn-primary">
              <i class="fas fa-phone"></i>
              Ligar
            </a>
            <a v-if="instructor.email" :href="`mailto:${instructor.email}`" class="btn-secondary">
              <i class="fas fa-envelope"></i>
              Enviar Email
            </a>
          </div>
        </div>

        <div class="profile-details">
          <div class="detail-section">
            <h3>Sobre</h3>
            <p>{{ instructor.bio }}</p>
          </div>
          
          <div class="detail-section">
            <h3>Especialidades</h3>
            <div class="specialties">
              <span v-for="specialty in instructor.specialties" :key="specialty" class="specialty-tag">
                {{ specialty }}
              </span>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Certificações</h3>
            <ul class="certifications">
              <li v-for="cert in instructor.certifications" :key="cert">{{ cert }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="contact-section">
      <h2 class="section-title">
        <i class="fas fa-address-book"></i>
        Informações de Contato
      </h2>
      
      <div class="contact-card">
        <div class="contact-options">
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-phone"></i>
            </div>
            <div>
              <strong>Telefone</strong>
              <p>{{ instructor?.phone || 'Não informado' }}</p>
              <a v-if="instructor?.phone" :href="`tel:${instructor.phone}`" class="contact-link">
                <i class="fas fa-phone-alt"></i> Ligar agora
              </a>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div>
              <strong>Email</strong>
              <p>{{ instructor?.email || 'Não informado' }}</p>
              <a v-if="instructor?.email" :href="`mailto:${instructor.email}`" class="contact-link">
                <i class="fas fa-paper-plane"></i> Enviar email
              </a>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div>
              <strong>Horário de Atendimento</strong>
              <p>{{ instructor?.availableHours || 'Consulte com a academia' }}</p>
            </div>
          </div>
          <div v-if="instructor?.location" class="contact-item">
            <div class="contact-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <strong>Localização</strong>
              <p>{{ instructor.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule -->
    <div class="schedule-section">
      <h2 class="section-title">
        <i class="fas fa-calendar-alt"></i>
        Próximas Sessões
      </h2>
      
      <div v-if="upcomingSessions.length === 0" class="empty-schedule">
        <i class="fas fa-calendar-times"></i>
        <h3>Nenhuma sessão agendada</h3>
        <p>Agende uma sessão com seu instrutor para acompanhamento personalizado</p>
        <button @click="scheduleSession" class="btn-primary">
          <i class="fas fa-plus"></i>
          Agendar Nova Sessão
        </button>
      </div>
      
      <div v-else class="sessions-list">
        <div v-for="session in upcomingSessions" :key="session.id" class="session-card">
          <div class="session-date">
            <div class="date-display">
              <span class="day">{{ getDay(session.date) }}</span>
              <span class="month">{{ getMonth(session.date) }}</span>
            </div>
          </div>
          <div class="session-details">
            <h4>{{ session.type }}</h4>
            <p class="session-time">
              <i class="fas fa-clock"></i>
              {{ session.time }}
            </p>
            <p class="session-location">
              <i class="fas fa-map-marker-alt"></i>
              {{ session.location }}
            </p>
          </div>
          <div class="session-actions">
            <button @click="rescheduleSession(session)" class="btn-text">
              <i class="fas fa-edit"></i>
              Reagendar
            </button>
            <button @click="cancelSession(session)" class="btn-text danger">
              <i class="fas fa-times"></i>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/store/theme'
import StudentNavBar from '@/components/StudentNavBar.vue'
import api from '@/api'

// Theme
const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

// Reactive data
const loading = ref(true)
const instructor = ref(null)
const upcomingSessions = ref([])

// Fetch instructor data
const fetchInstructorData = async () => {
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
    const studentId = userData.studentId || userData.id
    
    if (!studentId) {
      useFallbackData()
      loading.value = false
      return
    }

    // Buscar dados completos do estudante
    const studentResponse = await api.get(`/students/${studentId}`)
    let instructorId = studentResponse.data?.instructorId
    
    // Extrair ID se for objeto MongoDB
    if (instructorId && typeof instructorId === 'object') {
      instructorId = instructorId.$oid || instructorId._id || instructorId.toString()
    }
    
    if (instructorId) {
      // Buscar dados completos do instrutor
      const instructorResponse = await api.get(`/instructors/${instructorId}`)
      
      if (instructorResponse.data) {
        const data = instructorResponse.data
        const instructorName = data.name || data.user?.name || 'Instrutor'
        
        instructor.value = {
          id: data._id || data.id,
          name: instructorName,
          speciality: data.speciality || data.specialty || 'Personal Trainer',
          avatar: data.avatar || data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorName)}&background=667eea&color=fff&size=120`,
          rating: data.rating || 5.0,
          reviews: data.reviews || data.reviewCount || 0,
          bio: data.bio || data.description || data.about || `${instructorName} é um profissional dedicado ao seu desenvolvimento físico e bem-estar.`,
          specialties: data.specialties || data.specializations || data.expertise || ['Musculação', 'Treinamento Funcional'],
          certifications: data.certifications || data.certificates || data.qualifications || ['Certificado CREF'],
          phone: data.phone || data.contact?.phone || data.user?.phone || null,
          email: data.email || data.user?.email || data.contact?.email || null,
          availableHours: data.availableHours || data.schedule || data.workingHours || 'Segunda a Sexta: 6h - 22h | Sábado: 8h - 14h',
          location: data.location || data.gym?.name || studentResponse.data.gym?.name || 'Academia'
        }
        
        // Buscar sessões agendadas (se houver endpoint)
        try {
          const sessionsResponse = await api.get('/student/sessions/upcoming')
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
          console.log('Nenhuma sessão agendada encontrada')
        }
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

// Fallback data quando não há instrutor ou erro na API
const useFallbackData = () => {
  instructor.value = {
    id: null,
    name: 'Instrutor não atribuído',
    speciality: 'Entre em contato com a academia',
    avatar: 'https://ui-avatars.com/api/?name=Instrutor&background=94a3b8&color=fff&size=120',
    rating: 0,
    reviews: 0,
    bio: 'Você ainda não possui um instrutor atribuído. Entre em contato com a recepção da academia para solicitar um acompanhamento personalizado.',
    specialties: [],
    certifications: [],
    phone: null,
    email: null,
    availableHours: 'Consulte a academia',
    location: null
  }
}

// Schedule session
const scheduleSession = () => {
  console.log('Opening session scheduling...')
  // TODO: Implementar modal de agendamento
}

const rescheduleSession = (session) => {
  console.log('Rescheduling session:', session)
  // TODO: Implementar reagendamento
}

const cancelSession = (session) => {
  if (confirm('Deseja realmente cancelar esta sessão?')) {
    console.log('Canceling session:', session)
    // TODO: Chamar API para cancelar
    upcomingSessions.value = upcomingSessions.value.filter(s => s.id !== session.id)
  }
}

const getDay = (dateStr) => {
  return new Date(dateStr).getDate().toString().padStart(2, '0')
}

const getMonth = (dateStr) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return months[new Date(dateStr).getMonth()]
}

// Lifecycle
onMounted(() => {
  fetchInstructorData()
})
</script>

<style scoped>
.student-instructor {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Detecta quando o navbar está colapsado globalmente */
body:has(.navbar-collapsed) .main-content {
  margin-left: 0 !important;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title i {
  color: var(--primary-color);
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin: 0;
}

/* Instructor Profile */
.instructor-profile {
  margin-bottom: 3rem;
}

.profile-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .profile-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.profile-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: flex-start;
}

.instructor-avatar {
  flex-shrink: 0;
}

.instructor-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-color);
}

.instructor-info {
  flex: 1;
}

.instructor-info h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.instructor-title {
  font-size: 1.1rem;
  color: var(--primary-color);
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.instructor-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  color: var(--warning-color);
}

.rating-text {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.contact-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.detail-section h3 {
  font-size: 1.2rem;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.detail-section p {
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

.specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.specialty-tag {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.certifications {
  list-style: none;
  padding: 0;
  margin: 0;
}

.certifications li {
  padding: 0.5rem 0;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.certifications li:before {
  content: '✓';
  color: var(--success-color);
  font-weight: bold;
}

.certifications li:last-child {
  border-bottom: none;
}

/* Contact Section */
.contact-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: var(--primary-color);
}

.contact-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .contact-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.empty-messages {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.empty-messages i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.messages-list {
  max-height: 300px;
  overflow-y: auto;
}

.message-item {
  padding: 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.message-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.message-content {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.contact-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.dark-mode .contact-item:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.contact-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.contact-item strong {
  display: block;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.contact-item p {
  margin: 0 0 0.75rem 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.contact-link:hover {
  color: var(--primary-hover);
  gap: 0.75rem;
}

/* Schedule Section */
.schedule-section {
  margin-bottom: 3rem;
}

.empty-schedule {
  text-align: center;
  padding: 3rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  color: var(--text-muted);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .empty-schedule {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.empty-schedule i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
  color: var(--primary-color);
}

.empty-schedule h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.empty-schedule p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .session-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.session-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
}

.dark-mode .session-card:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.session-date {
  flex-shrink: 0;
}

.date-display {
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  color: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.month {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.session-details {
  flex: 1;
}

.session-details h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-size: 1.2rem;
}

.session-time,
.session-location {
  margin: 0.25rem 0;
  color: var(--text-muted);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.session-time i,
.session-location i {
  color: var(--primary-color);
}

.session-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  text-align: center;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  text-decoration: none;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dark-mode .btn-primary:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  text-decoration: none;
}

.btn-secondary:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
}

.btn-text {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.btn-text:hover {
  background: var(--bg-secondary);
}

.btn-text.danger {
  color: var(--danger-color);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .instructor-avatar {
    margin: 0 auto;
  }

  .contact-actions {
    flex-direction: column;
  }

  .profile-details {
    grid-template-columns: 1fr;
  }

  .contact-options {
    grid-template-columns: 1fr;
  }

  .session-card {
    flex-direction: column;
    gap: 1rem;
  }

  .session-actions {
    flex-direction: column;
  }
}
</style>