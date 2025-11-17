<template>
  <div class="page-wrapper">
    <StudentNavBar />
    
    <div class="container">
      <div class="max-width">
        <!-- Header Section with Background -->
        <div class="header-section">
          <!-- Blurred Background Image -->
          <div class="background-wrapper">
            <div class="background-image"></div>
            <div class="background-gradient"></div>
          </div>

          <!-- Content -->
          <div class="header-content">
            <!-- Profile Image -->
            <div class="profile-image-wrapper">
              <img
                :src="studentData.avatar"
                :alt="studentData.name"
                class="profile-image"
              />
              <button class="review-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
                Editar Perfil
              </button>
            </div>

            <!-- Profile Info -->
            <div class="profile-info">
              <div class="profile-header">
                <div>
                  <h1 class="profile-title">{{ studentData.name || 'Carregando...' }}</h1>
                  <div class="profile-meta">
                    <span class="meta-item">
                      <i class="fas fa-envelope"></i>
                      {{ studentData.email || 'email@exemplo.com' }}
                    </span>
                    <span v-if="studentData.phone" class="meta-item">
                      <i class="fas fa-phone"></i>
                      {{ formatPhone(studentData.phone) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Rating -->
              <div class="rating-section">
                <div>
                  <div class="rating-label">Altura (cm)</div>
                  <div class="rating-value">
                    <IconRuler :size="20" :stroke-width="2.5" class="stat-icon" />
                    <span class="rating-number">{{ studentData.height || '-' }}</span>
                  </div>
                </div>
                <div>
                  <div class="rating-label">Peso (kg)</div>
                  <div class="rating-value">
                    <IconWeight :size="20" :stroke-width="2.5" class="stat-icon" />
                    <span class="rating-number">{{ studentData.weight || '-' }}</span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="description-section">
                <h2 class="section-title">
                  Condições Médicas
                </h2>
                <p class="description-text">
                  <i class="fas fa-notes-medical"></i>
                  {{ studentData.medicalConditions || 'Nenhuma condição médica registrada' }}
                </p>
              </div>

              <!-- Details Grid -->
              <div class="details-grid">
                <div 
                  v-for="(detail, index) in availableDetails" 
                  :key="index"
                  class="detail-item"
                >
                  <div class="detail-label">{{ detail.label }}</div>
                  <div class="detail-value">
                    <i :class="getDetailIcon(detail.label)"></i>
                    {{ detail.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="bottom-section">
          <!-- Left Column - Characters -->
          <div class="left-column">
            <div class="characters-header">
              <i class="fas fa-trophy"></i>
              <h2 class="characters-title">Minhas Metas Pessoais</h2>
            </div>

            <div v-if="goals.length === 0" class="empty-goals">
              <div class="empty-icon">🎯</div>
              <p>Nenhuma meta definida ainda</p>
            </div>

            <div v-else class="goals-list">
              <div 
                v-for="(goal, index) in goals" 
                :key="index"
                class="goal-card"
              >
                <div class="goal-badge">
                  <i class="fas fa-bullseye"></i>
                  <span>Meta {{ index + 1 }}</span>
                </div>
                <p class="goal-description">{{ goal.description }}</p>
                <div class="goal-footer">
                  <span class="goal-category" v-if="goal.category">
                    {{ getCategoryLabel(goal.category) }}
                  </span>
                  <span 
                    class="goal-priority" 
                    :class="`priority-${goal.priority}`"
                    v-if="goal.priority"
                  >
                    {{ getPriorityLabel(goal.priority) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Actions -->
          <div class="right-column">
            <h2 class="sidebar-title">
              Personal Trainer
              <span class="info-icon">Ⓘ</span>
            </h2>

            <div class="user-card">
              <div class="user-info">
                <img
                  :src="instructorData.avatar"
                  :alt="instructorData.name"
                  class="user-avatar"
                />
                <div>
                  <div class="user-name">{{ instructorData.name }}</div>
                  <div class="user-handle" v-if="instructorData.email">{{ instructorData.email }}</div>
                </div>
              </div>
            </div>

            <div class="links-section">
              <div class="link-group" v-if="instructorData.specialization">
                <h3 class="link-title">Especialização</h3>
                <div class="link-text">{{ instructorData.specialization }}</div>
              </div>

              <div class="link-group" v-if="instructorData.experience">
                <h3 class="link-title">Experiência</h3>
                <div class="link-text">{{ instructorData.experience }}</div>
              </div>

              <div class="link-group" v-if="instructorData.phone">
                <h3 class="link-title">Contato</h3>
                <div class="link-text">{{ formatPhone(instructorData.phone) }}</div>
              </div>
            </div>

            <div class="bottom-buttons">
              <button class="contact-btn" @click="contactInstructor">
                <i class="fas fa-comment-dots"></i>
                Enviar Mensagem
              </button>
              <button class="schedule-btn" @click="viewSchedule">
                <i class="fas fa-calendar-alt"></i>
                Agendar Treino
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StudentNavBar from "@/components/StudentNavBar.vue";
import api from "@/api";

export default {
  name: "RamonDinoProfile",
  components: {
    StudentNavBar,
  },
  data() {
    return {
      loading: false,
      studentData: {
        name: '',
        email: '',
        phone: '',
        height: null,
        weight: null,
        avatar: '',
        age: null,
        gender: '',
        birthDate: '',
        gym: '',
        activePlan: '',
        imc: null,
        totalWorkouts: 0,
        lastWorkout: '',
        goal: '',
        experience: '',
        medicalConditions: ''
      },
      instructorData: {
        name: 'Personal Trainer',
        avatar: 'https://ui-avatars.com/api/?name=Personal&background=10b981&color=fff&size=150',
        email: '',
        phone: '',
        specialization: '',
        experience: ''
      },
      goals: []
    };
  },
  computed: {
    availableDetails() {
      console.log('availableDetails - studentData:', this.studentData);
      const details = [];
      
      // Objetivo
      if (this.studentData.goal) {
        details.push({
          label: 'Objetivo',
          value: this.studentData.goal
        });
      }
      
      // Experiência em Treino
      if (this.studentData.experience) {
        details.push({
          label: 'Experiência em Treino',
          value: this.studentData.experience
        });
      }
      
      // Idade
      if (this.studentData.age) {
        details.push({
          label: 'Idade',
          value: `${this.studentData.age} anos`
        });
      }
      
      // Data de Nascimento
      if (this.studentData.birthDate) {
        details.push({
          label: 'Data de Nascimento',
          value: this.studentData.birthDate
        });
      }
      
      // Gênero
      if (this.studentData.gender) {
        details.push({
          label: 'Gênero',
          value: this.studentData.gender
        });
      }
      
      // Academia
      if (this.studentData.gym) {
        details.push({
          label: 'Academia',
          value: this.studentData.gym
        });
      }
      
      // Plano Ativo
      if (this.studentData.activePlan) {
        details.push({
          label: 'Plano Ativo',
          value: this.studentData.activePlan
        });
      }
      
      // IMC
      if (this.studentData.imc) {
        details.push({
          label: 'IMC',
          value: this.studentData.imc
        });
      }
      
      // Total de Treinos
      if (this.studentData.totalWorkouts > 0) {
        details.push({
          label: 'Treinos Realizados',
          value: `${this.studentData.totalWorkouts} treinos`
        });
      }
      
      // Último Treino
      if (this.studentData.lastWorkout) {
        details.push({
          label: 'Último Treino',
          value: this.studentData.lastWorkout
        });
      }
      
      // Retornar apenas os primeiros 4 para manter o layout
      return details.slice(0, 4);
    }
  },
  methods: {
    getCategoryLabel(category) {
      const categoryMap = {
        'estetica': 'Estética',
        'saude': 'Saúde',
        'desempenho': 'Desempenho',
        'habito': 'Hábito',
        'geral': 'Geral'
      };
      const label = categoryMap[category?.toLowerCase()] || category;
      // Garantir que a primeira letra seja maiúscula
      return label ? label.charAt(0).toUpperCase() + label.slice(1) : '';
    },
    getPriorityLabel(priority) {
      const priorityMap = {
        'alta': 'Alta',
        'media': 'Média',
        'baixa': 'Baixa'
      };
      return priorityMap[priority] || priority;
    },
    getDetailIcon(label) {
      const iconMap = {
        'Objetivo': 'fas fa-bullseye',
        'Experiência em Treino': 'fas fa-trophy',
        'Idade': 'fas fa-birthday-cake',
        'Data de Nascimento': 'fas fa-calendar',
        'Gênero': 'fas fa-venus-mars',
        'Academia': 'fas fa-dumbbell',
        'Plano Ativo': 'fas fa-clipboard-list',
        'IMC': 'fas fa-chart-line',
        'Treinos Realizados': 'fas fa-check-circle',
        'Último Treino': 'fas fa-clock'
      };
      return iconMap[label] || 'fas fa-info-circle';
    },
    async fetchProfile() {
      this.loading = true;
      try {
        const storedUser = sessionStorage.getItem('user');
        
        if (!storedUser) {
          console.error('Nenhum usuário no sessionStorage');
          this.loading = false;
          return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.id || userData._id;
        
        if (!userId) {
          console.error('Nenhum ID encontrado no userData');
          this.loading = false;
          return;
        }

        // Buscar dados do estudante
        const studentResponse = await api.get(`/students/user/${userId}`);
        const studentData_API = studentResponse.data;
        
        if (studentData_API) {
          // Buscar nome e email do User populado
          const userName = studentData_API.userId?.name || userData.name || '';
          const userEmail = studentData_API.userId?.email || userData.email || '';
          const userPhone = studentData_API.userId?.phone || userData.phone || '';
          
          // Buscar altura e peso de personalInfo
          const height = studentData_API.personalInfo?.currentHeight || 
                         studentData_API.personalInfo?.height || 
                         null;
          const weight = studentData_API.personalInfo?.currentWeight || 
                         studentData_API.personalInfo?.weight || 
                         null;
          
          // Calcular IMC se tiver altura e peso
          let imc = null;
          if (height && weight && height > 0) {
            const heightInMeters = height / 100;
            imc = (weight / (heightInMeters * heightInMeters)).toFixed(1);
          }
          
          // Calcular idade a partir da data de nascimento
          const birthDate = studentData_API.birthDate; // birthDate está no nível raiz, não em personalInfo
          let age = null;
          let birthDateFormatted = '';
          
          console.log('birthDate original:', birthDate);
          
          if (birthDate) {
            const birth = new Date(birthDate);
            const today = new Date();
            age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
              age--;
            }
            
            // Data de nascimento formatada
            birthDateFormatted = birth.toLocaleDateString('pt-BR');
            console.log('birthDateFormatted:', birthDateFormatted);
          }
          
          // Gênero traduzido
          const gender = studentData_API.personalInfo?.gender || '';
          const genderMap = {
            'male': 'Masculino',
            'female': 'Feminino',
            'other': 'Outro'
          };
          const genderLabel = genderMap[gender] || '';
          
          // Objetivo traduzido
          const goalType = studentData_API.personalInfo?.preferences?.trainingGoalType || '';
          const goalMap = {
            'hipertrofia': 'Hipertrofia',
            'emagrecimento': 'Emagrecimento',
            'condicionamento': 'Condicionamento',
            'forca': 'Força',
            'saude': 'Saúde',
            'performance': 'Performance'
          };
          const goalLabel = goalMap[goalType] || '';
          
          // Experiência traduzida
          const experienceLevel = studentData_API.personalInfo?.trainingExperience || '';
          const experienceMap = {
            'iniciante': 'Iniciante',
            'intermediario': 'Intermediário',
            'avancado': 'Avançado',
            'atleta': 'Atleta'
          };
          const experienceLabel = experienceMap[experienceLevel] || '';
          
          // Montar texto de condições médicas - usar mesma lógica do studentprofile
          let medicalConditions = 'Nenhuma condição médica registrada';
          const healthRestrictions = studentData_API.healthRestrictions || {};
          
          const medicalNotes = healthRestrictions.generalNotes || healthRestrictions.notes || '';
          const chronicConditions = healthRestrictions.chronicConditions || [];
          
          if (medicalNotes) {
            medicalConditions = medicalNotes;
          } else if (chronicConditions.length > 0) {
            medicalConditions = chronicConditions.map(c => c.name || c).join(', ');
          }
          
          // Buscar nome da academia
          let gymName = '';
          if (studentData_API.gymId) {
            try {
              const gymResponse = await api.get(`/gyms/${studentData_API.gymId}`);
              gymName = gymResponse.data?.name || '';
            } catch (err) {
              console.log('Erro ao buscar academia:', err);
            }
          }
          
          // Buscar dados do instrutor
          if (studentData_API.instructorId && typeof studentData_API.instructorId === 'object') {
            const instructorData_API = studentData_API.instructorId;
            
            const instructorName = instructorData_API.userId?.name || instructorData_API.name || 'Personal Trainer';
            const instructorEmail = instructorData_API.userId?.email || instructorData_API.email || '';
            const instructorPhone = instructorData_API.userId?.phone || '';
            const instructorAvatarPath = instructorData_API.userId?.avatar || '';
            
            // Especialização e experiência
            const specialization = instructorData_API.specialization || '';
            const experience = instructorData_API.experience || '';
            
            let instructorAvatarUrl;
            if (instructorAvatarPath && instructorAvatarPath.startsWith('/uploads/')) {
              instructorAvatarUrl = `http://localhost:3000${instructorAvatarPath}`;
            } else if (instructorAvatarPath && (instructorAvatarPath.startsWith('http://') || instructorAvatarPath.startsWith('https://'))) {
              instructorAvatarUrl = instructorAvatarPath;
            } else {
              instructorAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorName)}&background=10b981&color=fff&size=150`;
            }
            
            this.instructorData = {
              name: instructorName,
              avatar: instructorAvatarUrl,
              email: instructorEmail,
              phone: instructorPhone,
              specialization: specialization,
              experience: experience
            };
          }
          
          // Buscar plano ativo
          let activePlan = '';
          if (studentData_API.workoutPlanId) {
            try {
              const planResponse = await api.get(`/workout-plans/${studentData_API.workoutPlanId}`);
              activePlan = planResponse.data?.name || '';
            } catch (err) {
              console.log('Erro ao buscar plano:', err);
            }
          }
          
          // Buscar total de treinos e último treino
          let totalWorkouts = 0;
          let lastWorkout = '';
          try {
            const sessionsResponse = await api.get(`/workout-sessions/student/${studentData_API._id}`);
            const sessions = sessionsResponse.data || [];
            
            // Total de treinos completados
            totalWorkouts = sessions.filter(s => s.status === 'completed').length;
            
            // Último treino
            if (sessions.length > 0) {
              const sortedSessions = sessions.sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-'));
                const dateB = new Date(b.date.split('/').reverse().join('-'));
                return dateB - dateA;
              });
              
              if (sortedSessions[0]?.date) {
                const lastDate = sortedSessions[0].date;
                const [day, month, year] = lastDate.split('/');
                const date = new Date(year, month - 1, day);
                lastWorkout = date.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                });
              }
            }
          } catch (err) {
            console.log('Erro ao buscar sessões:', err);
          }
          
          // Construir URL do avatar
          const avatarPath = studentData_API.userId?.avatar || userData.avatar;
          let avatarUrl;
          if (avatarPath && avatarPath.startsWith('/uploads/')) {
            avatarUrl = `http://localhost:3000${avatarPath}`;
          } else if (avatarPath && (avatarPath.startsWith('http://') || avatarPath.startsWith('https://'))) {
            avatarUrl = avatarPath;
          } else {
            avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=2563eb&color=fff&size=240`;
          }
          
          this.studentData = {
            name: userName,
            email: userEmail,
            phone: userPhone,
            height: height,
            weight: weight,
            avatar: avatarUrl,
            age: age,
            gender: genderLabel,
            birthDate: birthDateFormatted,
            gym: gymName,
            activePlan: activePlan,
            imc: imc,
            totalWorkouts: totalWorkouts,
            lastWorkout: lastWorkout,
            goal: goalLabel,
            experience: experienceLabel,
            medicalConditions: medicalConditions
          };
          
          console.log('Dados carregados:', this.studentData);
        }
        
        // Buscar metas pessoais
        const personalGoals = studentData_API.goals?.personal || [];
        this.goals = personalGoals.map(goal => ({
          id: goal._id,
          description: goal.description || '',
          category: goal.category || 'geral',
          priority: goal.priority || 'media',
          status: goal.achieved ? 'completed' : 'active'
        }));
        
        console.log('Metas carregadas:', this.goals);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      } finally {
        this.loading = false;
      }
    },
    formatPhone(phone) {
      if (!phone) return '';
      // Remove tudo que não é número
      const numbers = phone.replace(/\D/g, '');
      // Formata como (XX) XXXXX-XXXX
      if (numbers.length === 11) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
      }
      // Formata como (XX) XXXX-XXXX
      if (numbers.length === 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      }
      return phone;
    },
    contactInstructor() {
      if (this.instructorData.email) {
        // Abrir cliente de e-mail
        window.location.href = `mailto:${this.instructorData.email}?subject=Contato do Aluno ${this.studentData.name}`;
      } else if (this.instructorData.phone) {
        // Abrir WhatsApp se tiver telefone
        const phone = this.instructorData.phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${phone}`, '_blank');
      } else {
        alert('Nenhum contato disponível para o instrutor.');
      }
    },
    viewSchedule() {
      // Redirecionar para página de agendamento ou treinos
      this.$router.push('/dashboard-student');
    }
  },
  mounted() {
    this.fetchProfile();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

body,
html {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

#app {
  margin: 0 !important;
  padding: 0 !important;
}

.page-wrapper {
  min-height: 100vh;
  width: 100vw;
  margin: 0 !important;
  padding: 0 !important;
  background: linear-gradient(to bottom right, #f9fafb, #f3f4f6, #e5e7eb);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  display: flex;
}

.container {
  width: 100%;
  color: #111827;
  padding: 0 !important;
  margin: 0 !important;
  margin-left: 250px !important;
  flex: 1;
}

.max-width {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem;
}

/* Header Section */
.header-section {
  position: relative;
  margin-bottom: 3rem;
  margin-left: -2rem;
  margin-right: -2rem;
  padding-left: 2rem;
  padding-right: 2rem;
}

.background-wrapper {
  position: fixed;
  left: 250px;
  right: 0;
  top: 0;
  height: 400px;
  overflow: hidden;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  z-index: 0;
}

.background-image {
  position: absolute;
  inset: 0;
  background-image: v-bind('`url(${studentData.avatar})`');
  background-size: cover;
  background-position: center center;
  filter: blur(60px);
  transform: scale(1.1);
  opacity: 0.6;
}

.background-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.6),
    #f3f4f6
  );
}

.header-content {
  position: relative;
  display: flex;
  gap: 2rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  z-index: 1;
}

/* Profile Image */
.profile-image-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.profile-image {
  width: 270px;
  height: 270px;
  object-fit: cover;
  object-position: center;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.review-button {
  width: 270px;
  background-color: rgba(255, 255, 255, 0.95);
  color: #111827;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.review-button:hover {
  background-color: #f9fafb;
}

/* Profile Info */
.profile-info {
  flex: 1;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.profile-title {
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  margin-top: 0;
  color: #111827;
}

.profile-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #4b5563;
  font-size: 0.875rem;
  flex-wrap: wrap;
  
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item i {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  color: #2563eb;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.icon-button:hover {
  background-color: #f9fafb;
}

/* Rating */
.rating-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.rating-section > div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.rating-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  color: #2563eb;
}

.star-filled {
  color: #eab308;
  fill: #eab308;
}

.star-empty {
  color: #ef4444;
}

.rating-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
}

.rating-max {
  color: #6b7280;
}

.rating-count {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.rate-text {
  font-size: 0.875rem;
  color: #ef4444;
}

/* Description */
.description-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0;
  color: #111827;
}

.description-text {
  color: #374151;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.description-text i {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  color: #2563eb;
  font-size: 1rem;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 54px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.detail-value {
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-value i {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  color: #2563eb;
  font-size: 0.875rem;
}

/* Bottom Section */
.bottom-section {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

.left-column {
  flex: 0 0 600px;
  max-width: 600px;
  margin-right: auto;
}

.characters-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.characters-header i {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  color: #2563eb;
  font-size: 1.125rem;
}

.characters-title {
  font-size: 1.125rem;
  font-weight: bold;
  margin: 0;
  color: #111827;
}

.empty-goals {
  text-align: center;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.empty-goals p {
  color: #6b7280;
  margin: 0;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-card {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.goal-card:last-child {
  border-bottom: none;
}

.goal-card:hover {
  background-color: rgba(37, 99, 235, 0.02);
}

.goal-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #2563eb;
  font-weight: 600;
  font-size: 0.875rem;
}

.goal-badge i {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.goal-description {
  color: #111827;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
}

.goal-footer {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.goal-category,
.goal-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.goal-category {
  background-color: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.goal-priority {
  background-color: #f3f4f6;
  color: #374151;
}

.goal-priority.priority-alta {
  background-color: #fee2e2;
  color: #991b1b;
}

.goal-priority.priority-media {
  background-color: #fef3c7;
  color: #d97706;
}

.goal-priority.priority-baixa {
  background-color: #dcfce7;
  color: #166534;
}

.goal-priority.priority-baixa {
  background-color: #dcfce7;
  color: #166534;
}

/* Right Column */
.right-column {
  width: 20rem;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  margin-top: 0;
  color: #111827;
}

.info-icon {
  color: #6b7280;
  font-size: 0.875rem;
  margin-left: 0.25rem;
}

.user-card {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

.user-handle {
  font-size: 0.875rem;
  color: #4b5563;
}

.links-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.link-group {
  display: flex;
  flex-direction: column;
}

.link-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0;
  color: #111827;
}

.link-text {
  color: #374151;
}

.bottom-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.contact-btn,
.schedule-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
}

.contact-btn {
  background-color: #2563eb;
  color: white;
  box-shadow: 0 2px 4px 0 rgba(37, 99, 235, 0.2);
}

.contact-btn:hover {
  background-color: #1d4ed8;
  box-shadow: 0 4px 6px 0 rgba(37, 99, 235, 0.3);
}

.contact-btn i {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.schedule-btn {
  background-color: white;
  color: #2563eb;
  border: 2px solid #2563eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.schedule-btn:hover {
  background-color: #eff6ff;
  border-color: #1d4ed8;
  color: #1d4ed8;
}

.schedule-btn i {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

/* Responsividade para mobile */
@media (max-width: 768px) {
  .container {
    margin-left: 0 !important;
  }
  
  .background-wrapper {
    left: 0;
  }
  
  .max-width {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
  }
  
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .bottom-section {
    flex-direction: column;
  }
  
  .right-column {
    width: 100%;
  }
}
</style>