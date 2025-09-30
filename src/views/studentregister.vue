<template>
  <div class="container">
    <aside class="sidebar">
      <h2 class="sidebar-title">Cadastro de Aluno</h2>
      <ul class="sidebar-steps">
        <li :class="stepClass(1)">1. Pessoais</li>
        <li :class="stepClass(2)">2. Saúde</li>
        <li :class="stepClass(3)">3. Objetivos</li>
        <li :class="stepClass(4)">4. Preferências</li>
      </ul>
    </aside>

    <main class="main">
      <div class="form-card">
        <!-- Etapa 1 -->
        <div v-if="step === 1">
          <h3 class="form-title">Informações Pessoais</h3>
          <div class="form-grid">
            <input v-model.number="form.personalInfo.height" type="number" placeholder="Altura (cm)" class="input" />
            <input v-model.number="form.personalInfo.weight" type="number" placeholder="Peso (kg)" class="input" />
            
            <select v-model="form.personalInfo.trainingExperience" class="input">
              <option disabled value="">Experiência de treino</option>
              <option>Iniciante</option>
              <option>Intermediário</option>
              <option>Avançado</option>
              <option>Atleta</option>
            </select>

            <input v-model="form.personalInfo.location.cep" placeholder="CEP" @blur="fetchAddress" class="input" :class="{ 'input-error': cepError }" />
            <input v-model="form.personalInfo.location.city" placeholder="Cidade" class="input disabled" readonly />
            <input v-model="form.personalInfo.location.neighborhood" placeholder="Bairro" class="input disabled" readonly />
            <input v-model="form.personalInfo.location.street" placeholder="Rua" class="input" />
            <input v-model="form.personalInfo.location.number" placeholder="Número" type="text" class="input" />
            
            <select v-model="form.personalInfo.location.preferredTrainingType" class="input">
              <option disabled value="">Tipo de treino preferido</option>
              <option>Musculação</option>
              <option>Funcional</option>
              <option>Aeróbico</option>
              <option>Crossfit</option>
              <option>Outros</option>
            </select>
          </div>
        </div>

        <!-- Etapa 2 -->
        <div v-if="step === 2">
          <h3 class="form-title">Restrições de Saúde</h3>
          <div class="form-grid">
            <div class="medical-contact">
              <label for="doctorContact">Contato Médico</label>
              <input id="doctorContact" v-model="form.healthRestrictions.doctorContact" placeholder="Nome e telefone do médico" class="input" />
            </div>

            <label class="checkbox-label">
              <input type="checkbox" v-model="form.healthRestrictions.medicalAuthorization" />
              Possui autorização médica?
            </label>

            <textarea
              v-model="form.healthRestrictions.notes"
              placeholder="Notas médicas, restrições, observações..."
              class="input textarea"
            ></textarea>
          </div>
        </div>

        <!-- Etapa 3 -->
        <div v-if="step === 3">
          <h3 class="form-title">Objetivos</h3>
          <div class="form-grid">
            <input v-model="goal.description" placeholder="Qual seu objetivo?" class="input" />
            <button class="btn" @click="addGoal">Adicionar Objetivo</button>
          </div>
          <ul class="goal-list">
            <li v-for="(g, i) in form.goals" :key="i">• {{ g.description }}</li>
          </ul>
        </div>

        <!-- Etapa 4 -->
        <div v-if="step === 4">
          <h3 class="form-title">Preferências</h3>
          <div class="form-grid">
            <div>
              <label>Dias preferidos:</label>
              <div class="checkbox-group">
                <label v-for="day in daysOfWeek" :key="day" class="checkbox-label">
                  <input type="checkbox" :value="day" v-model="form.preferences.trainingDays" />
                  {{ day }}
                </label>
              </div>
            </div>

            <div>
              <label>Horário preferido:</label>
              <div class="time-range">
                <input type="time" v-model="form.preferences.preferredTimeStart" class="input time-input" />
                <span class="time-separator">até</span>
                <input type="time" v-model="form.preferences.preferredTimeEnd" class="input time-input" />
              </div>
            </div>
          </div>
        </div>

        <!-- Navegação -->
        <div class="form-nav">
          <button class="btn secondary" @click="prevStep" :disabled="step === 1">Voltar</button>
          <button class="btn primary" @click="nextStep">{{ step < maxStep ? 'Próximo' : 'Finalizar' }}</button>
        </div>

        <div v-if="step > maxStep" class="form-success">
          Aluno cadastrado com sucesso!
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StudentRegister',
  data() {
    return {
      step: 1,
      maxStep: 4,
      cepError: false,
      isSubmitting: false,
      daysOfWeek: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
      goal: { description: '' },
      form: {
        personalInfo: {
          weight: null,
          height: null,
          trainingExperience: '',
          location: {
            cep: '',
            city: '',
            neighborhood: '',
            street: '',
            number: '',
            preferredTrainingType: ''
          }
        },
        healthRestrictions: {
          medicalAuthorization: false,
          doctorContact: '',
          notes: '',
          injuries: [],
          chronicConditions: [],
          medications: []
        },
        goals: [],
        preferences: {
          trainingDays: [],
          preferredTimeStart: '',
          preferredTimeEnd: ''
        }
      }
    };
  },
  methods: {
    stepClass(n) {
      return { 'active-step': this.step === n };
    },
    async nextStep() {
      if (this.step === 1 && !this.validateStepOne()) return;
      if (this.step === 3 && !this.form.goals.length) {
        alert('Adicione pelo menos um objetivo.');
        return;
      }

      if (this.step < this.maxStep) {
        this.step++;
      } else {
        this.isSubmitting = true;
        try {
          const userId = this.$route.query.userId;
          if (!userId) {
            alert('ID do usuário não encontrado.');
            return;
          }
          // TODO - Ajustar payload para como está sendo salvo no banco
          const payload = {
            userId,
            // instructorId will be assigned later by instructor
            personalInfo: {
              height: this.form.personalInfo.height,
              weight: this.form.personalInfo.weight,
              trainingExperience: this.form.personalInfo.trainingExperience,
              location: { 
                cep: this.form.personalInfo.location.cep,
                city: this.form.personalInfo.location.city,
                neighborhood: this.form.personalInfo.location.neighborhood,
                street: this.form.personalInfo.location.street,
                number: this.form.personalInfo.location.number,
                preferredTrainingType: this.form.personalInfo.location.preferredTrainingType
              },
              availability: {
                trainingDays: this.form.preferences.trainingDays,
                preferredTime: `${this.form.preferences.preferredTimeStart} - ${this.form.preferences.preferredTimeEnd}`
              }
            },
            healthRestrictions: {
              medicalAuthorization: this.form.healthRestrictions.medicalAuthorization,
              doctorContact: this.form.healthRestrictions.doctorContact,
              notes: this.form.healthRestrictions.notes,
              injuries: this.form.healthRestrictions.injuries || [],
              chronicConditions: this.form.healthRestrictions.chronicConditions || [],
              medications: this.form.healthRestrictions.medications || []
            },
            goals: this.form.goals,
            preferences: {
              trainingDays: this.form.preferences.trainingDays,
              preferredTime: `${this.form.preferences.preferredTimeStart} - ${this.form.preferences.preferredTimeEnd}`
            }
          };

          await axios.post('http://localhost:3000/api/students', payload);

          this.step++;
          this.$router.push('/login');
        } catch (err) {
          console.error(err);
          alert('Erro ao cadastrar aluno.');
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    prevStep() {
      if (this.step > 1) this.step--;
    },
    validateStepOne() {
      const { height, weight, trainingExperience, location } = this.form.personalInfo;
      return (
        height &&
        weight &&
        trainingExperience &&
        location.cep &&
        location.street &&
        location.number &&
        !this.cepError
      );
    },
    addGoal() {
      const desc = this.goal.description.trim();
      if (!desc) return alert('Digite um objetivo válido');
      this.form.goals.push({ description: desc });
      this.goal.description = '';
    },
    async fetchAddress() {
      const cep = this.form.personalInfo.location.cep.replace(/\D/g, '');
      if (cep.length !== 8) {
        this.cepError = true;
        return;
      }

      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();

        if (data.erro) {
          this.cepError = true;
        } else {
          this.form.personalInfo.location.city = data.localidade;
          this.form.personalInfo.location.neighborhood = data.bairro;
          this.cepError = false;
        }
      } catch {
        this.cepError = true;
      }
    },
    resetForm() {
      this.form = {
        personalInfo: {
          weight: null,
          height: null,
          trainingExperience: '',
          location: {
            cep: '',
            city: '',
            neighborhood: '',
            street: '',
            number: '',
            preferredTrainingType: ''
          }
        },
        healthRestrictions: {
          medicalAuthorization: false,
          doctorContact: '',
          notes: ''
        },
        goals: [],
        preferences: {
          trainingDays: [],
          preferredTimeStart: '',
          preferredTimeEnd: ''
        }
      };
      this.goal = { description: '' };
      this.step = 1;
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #fff;
}

.sidebar {
  background: #f4fafa;
  padding: 2rem;
  width: 250px;
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.sidebar-steps {
  list-style: none;
  padding: 0;
}

.sidebar-steps li {
  padding: 0.75rem 1rem;
  border-left: 3px solid transparent;
  cursor: default;
  margin-bottom: 0.5rem;
  color: #555;
  background-color: #fff;
  border-radius: 4px;
}

.sidebar-steps li.active-step {
  background: #e0f7f7;
  border-left-color: #06b6d4;
  font-weight: 600;
}

.main {
  flex: 1;
  padding: 2rem 4rem;
  background-color: #fafefe;
  overflow-y: auto;
}

.form-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
  transition: border 0.3s;
}

.input:focus {
  border-color: #06b6d4;
  outline: none;
}

.input-error {
  border-color: #e63946;
}

.input.disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input.textarea {
  min-height: 100px;
  resize: vertical;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.btn.primary {
  background-color: #06b6d4;
  color: #fff;
}

.btn.secondary {
  background-color: #ccc;
  color: #333;
  margin-right: 0.5rem;
}

.goal-list {
  margin-top: 1rem;
  padding-left: 1rem;
  list-style: disc;
  color: #333;
}

.form-nav {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

.form-success {
  text-align: center;
  font-weight: bold;
  color: #16a34a;
  font-size: 1.1rem;
  margin-top: 2rem;
}

/* NOVOS ESTILOS */
.medical-contact {
  display: flex;
  flex-direction: column;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-separator {
  font-size: 0.9rem;
  color: #555;
}

.time-input {
  width: 120px;
}
</style>
