<template>
  <div class="student-instructor">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-user-tie"></i>
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
            <button @click="sendMessage" class="btn-primary">
              <i class="fas fa-comment"></i>
              Enviar Mensagem
            </button>
            <button @click="scheduleSession" class="btn-secondary">
              <i class="fas fa-calendar-plus"></i>
              Agendar Sessão
            </button>
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

    <!-- Communication -->
    <div class="communication-section">
      <h2 class="section-title">
        <i class="fas fa-comments"></i>
        Comunicação
      </h2>
      
      <div class="communication-grid">
        <div class="recent-messages">
          <h3>Mensagens Recentes</h3>
          <div v-if="messages.length === 0" class="empty-messages">
            <i class="fas fa-inbox"></i>
            <p>Nenhuma mensagem ainda</p>
          </div>
          <div v-else class="messages-list">
            <div v-for="message in messages" :key="message.id" class="message-item">
              <div class="message-header">
                <strong>{{ message.sender === 'instructor' ? instructor.name : 'Você' }}</strong>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
              <p class="message-content">{{ message.content }}</p>
            </div>
          </div>
        </div>

        <div class="quick-contact">
          <h3>Contato Rápido</h3>
          <div class="contact-options">
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <div>
                <strong>Telefone</strong>
                <p>{{ instructor?.phone || 'Não informado' }}</p>
              </div>
            </div>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <div>
                <strong>Email</strong>
                <p>{{ instructor?.email || 'Não informado' }}</p>
              </div>
            </div>
            <div class="contact-item">
              <i class="fas fa-clock"></i>
              <div>
                <strong>Horário de Atendimento</strong>
                <p>{{ instructor?.availableHours || 'Segunda a Sexta: 8h-18h' }}</p>
              </div>
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

    <!-- Message Modal -->
    <div v-if="showMessageModal" class="modal-overlay" @click="closeMessageModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Enviar Mensagem</h2>
          <button @click="closeMessageModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitMessage" class="message-form">
            <div class="form-group">
              <label>Assunto</label>
              <input v-model="newMessage.subject" type="text" required class="form-input">
            </div>
            <div class="form-group">
              <label>Mensagem</label>
              <textarea v-model="newMessage.content" required class="form-textarea" rows="5"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeMessageModal" class="btn-secondary">Cancelar</button>
          <button @click="submitMessage" class="btn-primary">Enviar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'StudentInstructor',
  
  setup() {
    // Reactive data
    const showMessageModal = ref(false);
    
    // Mock instructor data
    const instructor = ref({
      id: 1,
      name: 'Carlos Silva',
      speciality: 'Personal Trainer & Nutricionista',
      avatar: 'https://via.placeholder.com/120x120/6366f1/white?text=CS',
      rating: 4.8,
      reviews: 156,
      bio: 'Personal trainer com mais de 8 anos de experiência em treinamento funcional e musculação. Especializado em transformação corporal e acompanhamento nutricional.',
      specialties: ['Musculação', 'Treinamento Funcional', 'Nutrição Esportiva', 'Reabilitação'],
      certifications: [
        'CREF 123456-G/SP',
        'Certificação ACSM',
        'Curso de Nutrição Esportiva',
        'Treinamento Funcional - FMS'
      ],
      phone: '(11) 99999-9999',
      email: 'carlos.silva@fitness.com',
      availableHours: 'Segunda a Sexta: 6h-22h | Sábado: 8h-16h'
    });

    const messages = ref([
      {
        id: 1,
        sender: 'instructor',
        content: 'Ótimo treino hoje! Continue assim que logo veremos resultados.',
        timestamp: '2024-02-15T14:30:00'
      },
      {
        id: 2,
        sender: 'student',
        content: 'Obrigado! Estou me sentindo mais forte a cada treino.',
        timestamp: '2024-02-15T15:00:00'
      }
    ]);

    const upcomingSessions = ref([
      {
        id: 1,
        type: 'Avaliação Física',
        date: '2024-02-20',
        time: '15:00',
        location: 'Sala de Avaliação - Academia Central'
      },
      {
        id: 2,
        type: 'Sessão de Treino',
        date: '2024-02-22',
        time: '09:00',
        location: 'Área de Musculação - Academia Central'
      }
    ]);

    const newMessage = reactive({
      subject: '',
      content: ''
    });

    // Methods
    const sendMessage = () => {
      showMessageModal.value = true;
    };

    const closeMessageModal = () => {
      showMessageModal.value = false;
      newMessage.subject = '';
      newMessage.content = '';
    };

    const submitMessage = () => {
      if (newMessage.subject && newMessage.content) {
        messages.value.push({
          id: messages.value.length + 1,
          sender: 'student',
          content: newMessage.content,
          timestamp: new Date().toISOString()
        });
        closeMessageModal();
      }
    };

    const scheduleSession = () => {
      console.log('Opening session scheduling...');
      // In a real app, open scheduling modal or navigate to scheduling page
    };

    const rescheduleSession = (session) => {
      console.log('Rescheduling session:', session);
    };

    const cancelSession = (session) => {
      console.log('Canceling session:', session);
    };

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleString('pt-BR');
    };

    const getDay = (dateStr) => {
      return new Date(dateStr).getDate().toString().padStart(2, '0');
    };

    const getMonth = (dateStr) => {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                     'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return months[new Date(dateStr).getMonth()];
    };

    return {
      instructor,
      messages,
      upcomingSessions,
      showMessageModal,
      newMessage,
      sendMessage,
      closeMessageModal,
      submitMessage,
      scheduleSession,
      rescheduleSession,
      cancelSession,
      formatTime,
      getDay,
      getMonth
    };
  }
};
</script>

<style scoped>
.student-instructor {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
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
  color: var(--text-secondary);
  margin: 0;
}

/* Instructor Profile */
.instructor-profile {
  margin-bottom: 3rem;
}

.profile-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
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
  color: var(--text-primary);
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
  color: #fbbf24;
}

.rating-text {
  color: var(--text-secondary);
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
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.detail-section p {
  color: var(--text-secondary);
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
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
}

.certifications li:last-child {
  border-bottom: none;
}

/* Communication Section */
.communication-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: var(--primary-color);
}

.communication-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.recent-messages,
.quick-contact {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
}

.recent-messages h3,
.quick-contact h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-item i {
  width: 20px;
  color: var(--primary-color);
  margin-top: 0.25rem;
}

.contact-item strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.contact-item p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Schedule Section */
.schedule-section {
  margin-bottom: 3rem;
}

.empty-schedule {
  text-align: center;
  padding: 3rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-secondary);
}

.empty-schedule i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
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
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.session-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
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
  color: var(--text-primary);
  font-size: 1.2rem;
}

.session-time,
.session-location {
  margin: 0.25rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
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
  background: var(--bg-primary);
}

.btn-text.danger {
  color: var(--error-color);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
}

.modal-close:hover {
  background: var(--bg-secondary);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Form Styles */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-textarea {
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .student-instructor {
    padding: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .contact-actions {
    flex-direction: row;
    justify-content: center;
  }

  .profile-details {
    grid-template-columns: 1fr;
  }

  .communication-grid {
    grid-template-columns: 1fr;
  }

  .session-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .session-actions {
    flex-direction: row;
    justify-content: center;
  }

  .modal-overlay {
    padding: 1rem;
  }
}

/* CSS Variables */
:root {
  --primary-color: #6366f1;
  --primary-hover: #5856eb;
  --secondary-color: #8b5cf6;
  --success-color: #10b981;
  --success-bg: #d1fae5;
  --info-color: #3b82f6;
  --info-bg: #dbeafe;
  --warning-color: #f59e0b;
  --warning-bg: #fef3c7;
  --error-color: #ef4444;
  --error-bg: #fef2f2;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}
</style>