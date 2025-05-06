<template>
  <div class="container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="sidebar-title">Cadastro de Aluno</h2>
      <ul class="sidebar-steps">
        <li :class="stepClass(1)">1. Pessoais</li>
        <li :class="stepClass(2)">2. Saúde</li>
        <li :class="stepClass(3)">3. Objetivos</li>
        <li :class="stepClass(4)">4. Preferências</li>
      </ul>
    </aside>

    <!-- Conteúdo Principal -->
    <main class="main">
      <div class="form-card">
        <!-- Etapa 1 -->
        <div v-if="step === 1">
          <h3 class="form-title">Informações Pessoais</h3>
          <div class="form-grid">
            <input v-model="form.personalInfo.height" type="number" placeholder="Altura (cm)" class="input" />
            <input v-model="form.personalInfo.weight" type="number" placeholder="Peso (kg)" class="input" />
            <input v-model="form.personalInfo.trainingExperience" placeholder="Experiência de treino" class="input" />
            <input
              v-model="form.personalInfo.location.cep"
              placeholder="CEP"
              @blur="fetchAddress"
              class="input"
              :class="{ 'input-error': cepError }"
            />
            <input
              v-model="form.personalInfo.location.city"
              placeholder="Cidade"
              class="input disabled"
              readonly
            />
            <input
              v-model="form.personalInfo.location.neighborhood"
              placeholder="Bairro"
              class="input disabled"
              readonly
            />
          </div>
        </div>

        <!-- Etapa 2 -->
        <div v-if="step === 2">
          <h3 class="form-title">Restrições de Saúde</h3>
          <textarea
            v-model="form.healthRestrictions.notes"
            placeholder="Notas médicas, restrições, observações..."
            class="input textarea"
          ></textarea>
        </div>

        <!-- Etapa 3 -->
        <div v-if="step === 3">
          <h3 class="form-title">Objetivos</h3>
          <input
            v-model="goal.description"
            placeholder="Qual seu objetivo?"
            class="input"
          />
          <button class="btn" @click="addGoal">Adicionar</button>
          <ul class="goal-list">
            <li v-for="(g, i) in form.goals" :key="i">{{ g.description }}</li>
          </ul>
        </div>

        <!-- Etapa 4 -->
        <div v-if="step === 4">
          <h3 class="form-title">Preferências</h3>
          <input v-model="form.preferences.trainingLocation" placeholder="Local de treino" class="input" />
          <input v-model="form.preferences.preferredTime" placeholder="Horário preferido" class="input" />
          <input v-model="form.preferences.trainingDays" placeholder="Dias de treino" class="input" />
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
export default {
  name: 'StudentRegister',
  data() {
    return {
      step: 1,
      maxStep: 4,
      isSubmitting: false,
      cepError: false,
      goal: {
        description: ''
      },
      form: {
        personalInfo: {
          height: '',
          weight: '',
          trainingExperience: '',
          location: {
            cep: '',
            city: '',
            neighborhood: ''
          }
        },
        healthRestrictions: {
          notes: ''
        },
        goals: [],
        preferences: {
          trainingLocation: '',
          preferredTime: '',
          trainingDays: ''
        }
      }
    };
  },
  methods: {
    stepClass(n) {
      return {
        'active-step': this.step === n
      };
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
        // Finalizar
        this.isSubmitting = true;
        try {
          console.log('Dados do aluno:', this.form);
          this.step++;
        } catch (error) {
          alert('Erro ao enviar. Tente novamente.');
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
      if (!height || !weight || !trainingExperience || !location.cep) {
        alert('Preencha todos os campos obrigatórios.');
        return false;
      }
      if (this.cepError) {
        alert('Verifique o CEP inserido.');
        return false;
      }
      return true;
    },
    addGoal() {
      const desc = this.goal.description.trim();
      if (desc) {
        this.form.goals.push({ description: desc });
        this.goal.description = '';
      }
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

        if (!data.erro) {
          this.form.personalInfo.location.city = data.localidade;
          this.form.personalInfo.location.neighborhood = data.bairro;
          this.cepError = false;
        } else {
          this.cepError = true;
        }
      } catch (err) {
        this.cepError = true;
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  max-width: none;
  min-height: 100vh;
  margin: 0;
  border-radius: 0;
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
  gap: 2rem;
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
</style>
