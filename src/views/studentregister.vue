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
            <input v-model="form.name" type="text" placeholder="Nome Completo *" class="input" required />
            <input v-model="form.email" type="email" placeholder="Email *" class="input" required />
            <input v-model="form.cpf" type="text" placeholder="CPF *" class="input" required />
            <input v-model="form.phone" type="text" placeholder="Telefone *" class="input" required />
            <input v-model="form.birthDate" type="date" placeholder="Data de Nascimento *" class="input" required />
            
            <input v-model.number="form.personalInfo.currentHeight" type="number" placeholder="Altura (cm)" class="input" />
            <input v-model.number="form.personalInfo.currentWeight" type="number" placeholder="Peso (kg)" class="input" />
            
            <select v-model="form.personalInfo.trainingExperience" class="input">
              <option disabled value="">Experiência de treino</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
              <option value="atleta">Atleta</option>
            </select>

            <input v-model="form.personalInfo.address.cep" placeholder="CEP" @blur="fetchAddress" class="input" :class="{ 'input-error': cepError }" />
            <input v-model="form.personalInfo.address.city" placeholder="Cidade" class="input disabled" readonly />
            <input v-model="form.personalInfo.address.state" placeholder="Estado" class="input disabled" readonly />
            <input v-model="form.personalInfo.address.neighborhood" placeholder="Bairro" class="input disabled" readonly />
            <input v-model="form.personalInfo.address.street" placeholder="Rua" class="input" />
            <input v-model="form.personalInfo.address.number" placeholder="Número" type="text" class="input" />
            
            <select v-model="form.personalInfo.preferences.preferredTrainingType" class="input">
              <option disabled value="">Tipo de treino preferido</option>
              <option value="musculacao">Musculação</option>
              <option value="funcional">Funcional</option>
              <option value="aerobico">Aeróbico</option>
              <option value="crossfit">Crossfit</option>
              <option value="outros">Outros</option>
            </select>

            <!-- Medidas Corporais -->
            <h4 style="grid-column: 1 / -1; margin: 1rem 0 0.5rem; color: #333; font-size: 1.1rem;">Medidas Corporais (opcional)</h4>
            <input v-model.number="form.personalInfo.initialMeasurements.shoulder" type="number" step="0.1" placeholder="Ombro (cm)" class="input" />
            <input v-model.number="form.personalInfo.initialMeasurements.chest" type="number" step="0.1" placeholder="Peito (cm)" class="input" />
            <input v-model.number="form.personalInfo.initialMeasurements.arm" type="number" step="0.1" placeholder="Braço (cm)" class="input" />
            <input v-model.number="form.personalInfo.initialMeasurements.forearm" type="number" step="0.1" placeholder="Antebraço (cm)" class="input" />
            <input v-model.number="form.personalInfo.initialMeasurements.waist" type="number" step="0.1" placeholder="Cintura (cm)" class="input" />
            <input v-model.number="form.personalInfo.initialMeasurements.hip" type="number" step="0.1" placeholder="Quadril (cm)" class="input" />
            <input v-model.number="form.personalInfo.initialMeasurements.thigh" type="number" step="0.1" placeholder="Coxa (cm)" class="input" />
            <input v-model.number="form.personalInfo.initialMeasurements.calf" type="number" step="0.1" placeholder="Panturrilha (cm)" class="input" />
            <input v-model.number="form.personalInfo.initialMeasurements.bodyFatPercentage" type="number" step="0.1" placeholder="% Gordura Corporal" class="input" />
          </div>
        </div>

        <!-- Etapa 2 -->
        <div v-if="step === 2">
          <h3 class="form-title">Restrições de Saúde</h3>
          <div class="form-grid">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.healthRestrictions.hasChronicConditions" />
              Possui condições crônicas?
            </label>
            <textarea
              v-if="form.healthRestrictions.hasChronicConditions"
              v-model="chronicConditionsText"
              placeholder="Liste as condições crônicas (uma por linha)"
              class="input textarea"
            ></textarea>

            <label class="checkbox-label">
              <input type="checkbox" v-model="form.healthRestrictions.hasMedications" />
              Faz uso de medicamentos?
            </label>
            <textarea
              v-if="form.healthRestrictions.hasMedications"
              v-model="medicationsText"
              placeholder="Liste os medicamentos (um por linha)"
              class="input textarea"
            ></textarea>

            <label class="checkbox-label">
              <input type="checkbox" v-model="form.healthRestrictions.hasInjuries" />
              Possui lesões?
            </label>
            <textarea
              v-if="form.healthRestrictions.hasInjuries"
              v-model="injuriesText"
              placeholder="Liste as lesões (uma por linha)"
              class="input textarea"
            ></textarea>

            <label class="checkbox-label">
              <input type="checkbox" v-model="form.healthRestrictions.medicalAuthorization" />
              Possui autorização médica?
            </label>

            <div class="medical-contact">
              <label for="doctorName">Nome do Médico</label>
              <input id="doctorName" v-model="form.healthRestrictions.doctorContact.name" placeholder="Nome do médico" class="input" />
            </div>
            <div class="medical-contact">
              <label for="doctorPhone">Telefone do Médico</label>
              <input id="doctorPhone" v-model="form.healthRestrictions.doctorContact.phone" placeholder="Telefone do médico" class="input" />
            </div>

            <textarea
              v-model="form.healthRestrictions.generalNotes"
              placeholder="Observações gerais sobre saúde..."
              class="input textarea"
            ></textarea>
          </div>
        </div>

        <!-- Etapa 3 -->
        <div v-if="step === 3">
          <h3 class="form-title">Objetivos</h3>
          <div class="form-grid">
            <div>
              <label>Objetivo Principal</label>
              <select v-model="form.goals.primary.type" class="input">
                <option disabled value="">Selecione seu objetivo principal</option>
                <option value="perda_peso">Perda de Peso</option>
                <option value="ganho_massa">Ganho de Massa Muscular</option>
                <option value="definicao">Definição Muscular</option>
                <option value="condicionamento">Condicionamento Físico</option>
                <option value="saude">Saúde e Bem-estar</option>
                <option value="performance">Performance Esportiva</option>
              </select>
            </div>
            <textarea v-model="form.goals.primary.description" placeholder="Descreva seu objetivo principal" class="input textarea"></textarea>
            
            <input v-model.number="form.goals.weight.target" type="number" placeholder="Peso alvo (kg)" class="input" />
            <input v-model.number="form.goals.monthlyWorkouts" type="number" placeholder="Meta de treinos por mês" class="input" />
            <input v-model.number="form.goals.monthlyCalories" type="number" placeholder="Meta de calorias por mês" class="input" />
            <input v-model.number="form.goals.monthlyHours" type="number" placeholder="Meta de horas de treino por mês" class="input" />
          </div>
        </div>

        <!-- Etapa 4 -->
        <div v-if="step === 4">
          <h3 class="form-title">Preferências</h3>
          <div class="form-grid">
            <div>
              <label>Dias preferidos para treinar:</label>
              <div class="checkbox-group">
                <label v-for="day in daysOfWeek" :key="day" class="checkbox-label">
                  <input type="checkbox" :value="day" v-model="form.personalInfo.preferences.trainingDays" />
                  {{ day }}
                </label>
              </div>
            </div>

            <div>
              <label>Horário preferido:</label>
              <div class="time-range">
                <input type="time" v-model="form.personalInfo.preferences.preferredTimeStart" class="input time-input" />
                <span class="time-separator">até</span>
                <input type="time" v-model="form.personalInfo.preferences.preferredTimeEnd" class="input time-input" />
              </div>
            </div>
            
            <div>
              <label>Quantos dias por semana pode treinar?</label>
              <input v-model.number="form.personalInfo.availability.daysPerWeek" type="number" min="1" max="7" class="input" />
            </div>
            
            <div>
              <label>Duração média de treino (minutos):</label>
              <input v-model.number="form.personalInfo.availability.minutesPerSession" type="number" class="input" />
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
      chronicConditionsText: '',
      medicationsText: '',
      injuriesText: '',
      form: {
        name: '',
        email: '',
        cpf: '',
        phone: '',
        birthDate: '',
        personalInfo: {
          currentWeight: null,
          currentHeight: null,
          trainingExperience: '',
          address: {
            cep: '',
            city: '',
            neighborhood: '',
            street: '',
            number: '',
            state: '',
            country: 'Brasil'
          },
          preferences: {
            trainingDays: [],
            preferredTimeStart: '',
            preferredTimeEnd: '',
            preferredTrainingType: ''
          },
          availability: {
            daysPerWeek: null,
            minutesPerSession: null,
            flexibleSchedule: false
          },
          initialMeasurements: {
            shoulder: null,
            chest: null,
            arm: null,
            forearm: null,
            waist: null,
            hip: null,
            thigh: null,
            calf: null,
            bodyFatPercentage: null
          }
        },
        healthRestrictions: {
          hasChronicConditions: false,
          chronicConditions: [],
          hasMedications: false,
          medications: [],
          hasInjuries: false,
          injuries: [],
          medicalAuthorization: false,
          doctorContact: {
            name: '',
            phone: ''
          },
          generalNotes: ''
        },
        goals: {
          primary: {
            type: '',
            description: ''
          },
          weight: {
            target: null
          },
          monthlyWorkouts: null,
          monthlyCalories: null,
          monthlyHours: null
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

          // Processar arrays de texto em arrays reais
          if (this.chronicConditionsText) {
            this.form.healthRestrictions.chronicConditions = this.chronicConditionsText
              .split('\n')
              .map(item => item.trim())
              .filter(item => item.length > 0);
          }
          if (this.medicationsText) {
            this.form.healthRestrictions.medications = this.medicationsText
              .split('\n')
              .map(item => item.trim())
              .filter(item => item.length > 0);
          }
          if (this.injuriesText) {
            this.form.healthRestrictions.injuries = this.injuriesText
              .split('\n')
              .map(item => item.trim())
              .filter(item => item.length > 0);
          }

          const payload = {
            userId,
            name: this.form.name,
            email: this.form.email,
            cpf: this.form.cpf,
            phone: this.form.phone,
            birthDate: this.form.birthDate,
            personalInfo: {
              currentWeight: this.form.personalInfo.currentWeight,
              currentHeight: this.form.personalInfo.currentHeight,
              trainingExperience: this.form.personalInfo.trainingExperience,
              address: {
                cep: this.form.personalInfo.address.cep,
                city: this.form.personalInfo.address.city,
                state: this.form.personalInfo.address.state,
                neighborhood: this.form.personalInfo.address.neighborhood,
                street: this.form.personalInfo.address.street,
                number: this.form.personalInfo.address.number,
                country: this.form.personalInfo.address.country
              },
              preferences: {
                trainingDays: this.form.personalInfo.preferences.trainingDays,
                preferredTimeStart: this.form.personalInfo.preferences.preferredTimeStart,
                preferredTimeEnd: this.form.personalInfo.preferences.preferredTimeEnd,
                preferredTrainingType: this.form.personalInfo.preferences.preferredTrainingType
              },
              availability: {
                daysPerWeek: this.form.personalInfo.availability.daysPerWeek,
                minutesPerSession: this.form.personalInfo.availability.minutesPerSession,
                flexibleSchedule: this.form.personalInfo.availability.flexibleSchedule
              },
              initialMeasurements: {
                shoulder: this.form.personalInfo.initialMeasurements.shoulder,
                chest: this.form.personalInfo.initialMeasurements.chest,
                arm: this.form.personalInfo.initialMeasurements.arm,
                forearm: this.form.personalInfo.initialMeasurements.forearm,
                waist: this.form.personalInfo.initialMeasurements.waist,
                hip: this.form.personalInfo.initialMeasurements.hip,
                thigh: this.form.personalInfo.initialMeasurements.thigh,
                calf: this.form.personalInfo.initialMeasurements.calf,
                bodyFatPercentage: this.form.personalInfo.initialMeasurements.bodyFatPercentage
              }
            },
            healthRestrictions: {
              hasChronicConditions: this.form.healthRestrictions.hasChronicConditions,
              chronicConditions: this.form.healthRestrictions.chronicConditions,
              hasMedications: this.form.healthRestrictions.hasMedications,
              medications: this.form.healthRestrictions.medications,
              hasInjuries: this.form.healthRestrictions.hasInjuries,
              injuries: this.form.healthRestrictions.injuries,
              medicalAuthorization: this.form.healthRestrictions.medicalAuthorization,
              doctorContact: this.form.healthRestrictions.doctorContact,
              generalNotes: this.form.healthRestrictions.generalNotes
            },
            goals: {
              primary: this.form.goals.primary,
              weight: {
                initial: this.form.personalInfo.currentWeight,
                target: this.form.goals.weight.target
              },
              monthlyWorkouts: this.form.goals.monthlyWorkouts || null,
              monthlyCalories: this.form.goals.monthlyCalories || null,
              monthlyHours: this.form.goals.monthlyHours || null
            }
          };

          console.log('📤 Enviando payload:', JSON.stringify(payload, null, 2));

          await axios.post('http://localhost:3000/api/students', payload);

          this.step++;
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } catch (err) {
          console.error('❌ Erro ao cadastrar:', err.response?.data || err);
          alert(`Erro ao cadastrar aluno: ${err.response?.data?.message || err.message}`);
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    prevStep() {
      if (this.step > 1) this.step--;
    },
    validateStepOne() {
      const { name, email, cpf, phone, birthDate } = this.form;
      const { currentHeight, currentWeight, trainingExperience, address } = this.form.personalInfo;
      
      if (!name || !email || !cpf || !phone || !birthDate) {
        alert('Preencha todos os campos obrigatórios marcados com *');
        return false;
      }
      
      if (!currentHeight || !currentWeight || !trainingExperience) {
        alert('Preencha altura, peso e experiência de treino');
        return false;
      }
      
      if (!address.cep || !address.street || !address.number) {
        alert('Preencha o endereço completo');
        return false;
      }
      
      if (this.cepError) {
        alert('CEP inválido');
        return false;
      }
      
      return true;
    },
    async fetchAddress() {
      const cep = this.form.personalInfo.address.cep.replace(/\D/g, '');
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
          this.form.personalInfo.address.city = data.localidade;
          this.form.personalInfo.address.state = data.uf;
          this.form.personalInfo.address.neighborhood = data.bairro;
          this.cepError = false;
        }
      } catch {
        this.cepError = true;
      }
    },
    resetForm() {
      this.form = {
        name: '',
        email: '',
        cpf: '',
        phone: '',
        birthDate: '',
        personalInfo: {
          currentWeight: null,
          currentHeight: null,
          trainingExperience: '',
          address: {
            cep: '',
            city: '',
            neighborhood: '',
            street: '',
            number: '',
            state: '',
            country: 'Brasil'
          },
          preferences: {
            trainingDays: [],
            preferredTimeStart: '',
            preferredTimeEnd: '',
            preferredTrainingType: ''
          },
          availability: {
            daysPerWeek: null,
            minutesPerSession: null,
            flexibleSchedule: false
          },
          initialMeasurements: {
            shoulder: null,
            chest: null,
            arm: null,
            forearm: null,
            waist: null,
            hip: null,
            thigh: null,
            calf: null,
            bodyFatPercentage: null
          }
        },
        healthRestrictions: {
          hasChronicConditions: false,
          chronicConditions: [],
          hasMedications: false,
          medications: [],
          hasInjuries: false,
          injuries: [],
          medicalAuthorization: false,
          doctorContact: {
            name: '',
            phone: ''
          },
          generalNotes: ''
        },
        goals: {
          primary: {
            type: '',
            description: ''
          },
          weight: {
            target: null
          },
          monthlyWorkouts: null,
          monthlyCalories: null,
          monthlyHours: null
        }
      };
      this.chronicConditionsText = '';
      this.medicationsText = '';
      this.injuriesText = '';
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
