<template>
    <div class="student-register">
      <h2 class="text-2xl font-bold mb-4">Cadastro de Aluno</h2>
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: progress + '%' }"></div>
      </div>
  
      <div v-if="step === 1">
        <h3 class="text-lg font-semibold">1. Informações Pessoais</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="form.personalInfo.weight" placeholder="Peso (kg)" type="number" class="input" />
          <input v-model="form.personalInfo.height" placeholder="Altura (cm)" type="number" class="input" />
          <input v-model="form.personalInfo.trainingExperience" placeholder="Experiência de treino" class="input" />
          <input v-model="form.personalInfo.location.city" placeholder="Cidade" class="input" />
          <input v-model="form.personalInfo.location.neighborhood" placeholder="Bairro" class="input" />
          <input v-model="form.personalInfo.location.preferredTrainingType" placeholder="Tipo de treino preferido" class="input" />
        </div>
      </div>
  
      <div v-else-if="step === 2">
        <h3 class="text-lg font-semibold">2. Restrições de Saúde</h3>
        <textarea v-model="form.healthRestrictions.notes" placeholder="Notas ou observações médicas" class="input"></textarea>
        <label class="flex items-center">
          <input type="checkbox" v-model="form.healthRestrictions.medicalAuthorization" /> Autorização médica fornecida
        </label>
        <input v-model="form.healthRestrictions.doctorContact" placeholder="Contato médico" class="input" />
      </div>
  
      <div v-else-if="step === 3">
        <h3 class="text-lg font-semibold">3. Objetivos</h3>
        <input v-model="goal.description" placeholder="Descrição do objetivo" class="input" />
        <input type="date" v-model="goal.startDate" class="input" />
        <input type="date" v-model="goal.endDate" class="input" />
        <input type="number" v-model="goal.targetValue" placeholder="Valor alvo" class="input" />
        <button class="btn" @click="addGoal">Adicionar Objetivo</button>
      </div>
  
      <div v-else-if="step === 4">
        <h3 class="text-lg font-semibold">4. Preferências</h3>
        <input v-model="form.preferences.preferredTime" placeholder="Horário preferido" class="input" />
        <input v-model="form.preferences.trainingDays" placeholder="Dias de treino (ex: SEG, QUA)" class="input" />
      </div>
  
      <div class="flex justify-between mt-6">
        <button class="btn" @click="prevStep" :disabled="step === 1">Voltar</button>
        <button class="btn" @click="nextStep">
          {{ step < maxStep ? 'Próximo' : 'Finalizar' }}
        </button>
      </div>
  
      <div v-if="step > maxStep">
        <p class="mt-4 text-green-600">Aluno cadastrado com sucesso!</p>
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
        userId: null, // será preenchido após cadastro do usuário
        form: {
          userId: null,
          personalInfo: {
            weight: '',
            height: '',
            trainingExperience: '',
            location: {
              city: '',
              neighborhood: '',
              preferredTrainingType: ''
            },
            availability: {
              trainingDays: [],
              preferredTime: ''
            }
          },
          healthRestrictions: {
            injuries: [],
            chronicConditions: [],
            medications: [],
            medicalAuthorization: false,
            doctorContact: '',
            notes: ''
          },
          goals: [],
          preferences: {
            trainingDays: [],
            preferredTime: ''
          },
          status: 'active'
        },
        goal: {
          description: '',
          startDate: '',
          endDate: '',
          targetValue: 0,
          currentValue: 0,
          status: 'in-progress'
        }
      };
    },
    computed: {
      progress() {
        return (this.step / this.maxStep) * 100;
      }
    },
    methods: {
      nextStep() {
        if (this.step < this.maxStep) {
          this.step++;
        } else {
          this.submitForm();
        }
      },
      prevStep() {
        if (this.step > 1) {
          this.step--;
        }
      },
      addGoal() {
        this.form.goals.push({ ...this.goal });
        this.goal = {
          description: '',
          startDate: '',
          endDate: '',
          targetValue: 0,
          currentValue: 0,
          status: 'in-progress'
        };
      },
      async submitForm() {
        try {
          this.form.userId = this.userId;
          await this.$axios.post('/api/students', this.form);
          this.step++;
        } catch (error) {
          console.error('Erro ao cadastrar aluno:', error);
        }
      },
      setUserId(id) {
        this.userId = id;
      }
    }
  };
  </script>
  
  <style scoped>
  .input {
    @apply border border-gray-300 rounded px-4 py-2 w-full;
  }
  .btn {
    @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
  }
  </style>
  