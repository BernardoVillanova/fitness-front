<template>
  <div class="flex bg-[#0f172a] min-h-screen text-white p-10 rounded-lg">
    <!-- Steps Sidebar -->
    <div class="w-1/4 pr-6 border-r border-gray-700">
      <h2 class="text-xl font-bold mb-6">Cadastro de Aluno</h2>
      <ul class="space-y-4">
        <li :class="{ 'text-green-400': step === 1 }">1. Pessoais</li>
        <li :class="{ 'text-green-400': step === 2 }">2. Saúde</li>
        <li :class="{ 'text-green-400': step === 3 }">3. Objetivos</li>
        <li :class="{ 'text-green-400': step === 4 }">4. Preferências</li>
      </ul>
    </div>

    <!-- Formulário -->
    <div class="w-3/4 pl-10">
      <div v-if="step === 1">
        <h3 class="text-lg font-semibold mb-4">Informações Pessoais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="form.personalInfo.height" placeholder="Altura (cm)" type="number" class="input" />
          <input v-model="form.personalInfo.weight" placeholder="Peso (kg)" type="number" class="input" />
          <input v-model="form.personalInfo.trainingExperience" placeholder="Experiência de treino" class="input" />
          <input v-model="form.personalInfo.location.cep" placeholder="CEP" @blur="fetchAddress" class="input" />
          <input v-model="form.personalInfo.location.city" placeholder="Cidade" class="input" readonly />
          <input v-model="form.personalInfo.location.neighborhood" placeholder="Bairro" class="input" readonly />
        </div>
      </div>

      <div v-else-if="step === 2">
        <h3 class="text-lg font-semibold mb-4">Restrições de Saúde</h3>
        <textarea v-model="form.healthRestrictions.notes" placeholder="Notas médicas" class="input"></textarea>
      </div>

      <div v-else-if="step === 3">
        <h3 class="text-lg font-semibold mb-4">Meta / Objetivo</h3>
        <input v-model="goal.description" placeholder="Qual seu objetivo?" class="input" />
        <button class="btn mt-2" @click="addGoal">Adicionar</button>
        <ul class="list-disc ml-6 mt-2">
          <li v-for="(g, index) in form.goals" :key="index">{{ g.description }}</li>
        </ul>
      </div>

      <div v-else-if="step === 4">
        <h3 class="text-lg font-semibold mb-4">Preferências</h3>
        <input v-model="form.preferences.trainingLocation" placeholder="Local de treino (casa, academia, parque...)" class="input" />
        <input v-model="form.preferences.preferredTime" placeholder="Horário preferido (ex: manhã, tarde, noite)" class="input" />
        <input v-model="form.preferences.trainingDays" placeholder="Dias da semana (ex: seg, qua, sex)" class="input" />
      </div>

      <div class="flex justify-between mt-6">
        <button class="btn" @click="prevStep" :disabled="step === 1">Voltar</button>
        <button class="btn" @click="nextStep">
          {{ step < maxStep ? 'Próximo' : 'Finalizar' }}
        </button>
      </div>

      <div v-if="step > maxStep">
        <p class="mt-4 text-green-400">Aluno cadastrado com sucesso!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentRegister',

  data() {
    return {
      step: 1,
      maxStep: 4,
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
    }
  },
  methods: {
    nextStep() {
      if (this.step < this.maxStep) {
        this.step++;
      } else {
        this.step++;
        // Aqui você pode adicionar lógica de envio
        console.log('Formulário finalizado:', this.form);
      }
    },
    prevStep() {
      if (this.step > 1) {
        this.step--;
      }
    },
    addGoal() {
      if (this.goal.description.trim()) {
        this.form.goals.push({ ...this.goal });
        this.goal.description = '';
      }
    },
    async fetchAddress() {
      const cep = this.form.personalInfo.location.cep.replace(/\D/g, '');
      if (cep.length !== 8) return;

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          this.form.personalInfo.location.city = data.localidade;
          this.form.personalInfo.location.neighborhood = data.bairro;
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
      }
    }
  }
}
</script>

<style scoped>
.input {
  @apply w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400;
}

.btn {
  @apply bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded;
}
</style>
