<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-header-icon">+</div>
          <div>
            <h2>{{ isEditing ? 'Editar Plano' : 'Novo Plano' }}</h2>
            <p>{{ isEditing ? 'Modifique seu plano de exercícios' : 'Crie um plano personalizado' }}</p>
          </div>
        </div>

        <!-- Informações Básicas -->
        <div class="section">
          <h3>Informações Básicas</h3>
          <div class="input-group">
            <label for="nome-plano">Nome do Plano</label>
            <input 
              id="nome-plano" 
              v-model="formData.name"
              type="text" 
              placeholder="Ex: Hipertrofia Avançada"
            >
          </div>
        </div>

        <!-- Divisão -->
        <div class="section">
          <h3>Divisão: 1</h3>
          <div class="input-group">
            <label for="nome-divisao">Nome da Divisão</label>
            <input 
              id="nome-divisao" 
              v-model="formData.divisions[0].name"
              type="text" 
              placeholder="Ex: Treino A – Peito/Tríceps"
            >
          </div>

          <!-- Exercício -->
          <div class="input-group">
            <label for="nome-exercicio">Nome do Exercício</label>
            <input 
              id="nome-exercicio" 
              v-model="formData.divisions[0].exercises[0].name"
              type="text" 
              placeholder="Ex: Supino Reto"
            >
          </div>
          <div class="input-group">
            <label for="descricao">Descrição</label>
            <textarea 
              id="descricao" 
              v-model="formData.divisions[0].exercises[0].description"
              placeholder="Descreva a execução do exercício..."
            ></textarea>
          </div>

          <!-- Séries, Reps, Peso -->
          <div class="row">
            <div class="input-group">
              <label for="series">Séries</label>
              <input 
                id="series" 
                v-model.number="formData.divisions[0].exercises[0].sets"
                type="number" 
                placeholder="3"
              >
            </div>
            <div class="input-group">
              <label for="reps">Repetições</label>
              <input 
                id="reps" 
                v-model.number="formData.divisions[0].exercises[0].reps"
                type="number" 
                placeholder="12"
              >
            </div>
            <div class="input-group">
              <label for="peso">Peso Ideal</label>
              <input 
                id="peso" 
                v-model.number="formData.divisions[0].exercises[0].idealWeight"
                type="number" 
                placeholder="0"
              >
            </div>
          </div>

          <!-- URL da Imagem -->
          <div class="input-group">
            <label for="imagem">URL da Imagem (Opcional)</label>
            <input 
              id="imagem" 
              v-model="formData.divisions[0].exercises[0].image"
              type="url" 
              placeholder="https://exemplo.com/imagem.jpg"
            >
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <span class="alert" :class="{ 'hidden': isFormValid }">⚠ Preencha todos os campos obrigatórios</span>
          <div>
            <button class="btn-create" @click="savePlan" :disabled="!isFormValid">
              {{ isEditing ? 'Salvar Plano' : 'Criar Plano' }}
            </button>
            <button class="btn-cancel" @click="closeModal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkoutPlanModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    planData: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      formData: {
        name: '',
        divisions: [{
          name: '',
          exercises: [{
            name: '',
            description: '',
            image: '',
            sets: 3,
            reps: 12,
            idealWeight: 0
          }]
        }]
      }
    }
  },
  computed: {
    isFormValid() {
      const division = this.formData.divisions[0];
      const exercise = division.exercises[0];
      
      return this.formData.name.trim() !== '' &&
             division.name.trim() !== '' &&
             exercise.name.trim() !== '' &&
             exercise.sets > 0 &&
             exercise.reps > 0 &&
             exercise.idealWeight >= 0;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.initializeForm();
      }
    },
    planData: {
      handler() {
        if (this.show) {
          this.initializeForm();
        }
      },
      deep: true
    }
  },
  methods: {
    initializeForm() {
      if (this.planData && this.isEditing) {
        this.formData = JSON.parse(JSON.stringify(this.planData));
      } else if (this.planData && !this.isEditing) {
        const duplicatedPlan = JSON.parse(JSON.stringify(this.planData));
        delete duplicatedPlan._id;
        duplicatedPlan.divisions.forEach(division => {
          delete division._id;
          division.exercises.forEach(exercise => {
            delete exercise._id;
          });
        });
        this.formData = duplicatedPlan;
      } else {
        this.formData = {
          name: '',
          divisions: [{
            name: '',
            exercises: [{
              name: '',
              description: '',
              image: '',
              sets: 3,
              reps: 12,
              idealWeight: 0
            }]
          }]
        };
      }
    },

    savePlan() {
      if (this.isFormValid) {
        this.$emit('save', { ...this.formData });
      }
    },

    closeModal() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  position: relative;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  max-height: 100%;
}

.modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  width: 800px;
  max-width: 95vw;
  max-height: 95vh;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header-icon {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  font-size: 22px;
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-header p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group label {
  font-size: 16px;
  color: #444;
  font-weight: 500;
}

.input-group input,
.input-group textarea {
  padding: 16px 18px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
  width: 100%;
  font-family: "Inter", sans-serif;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

textarea {
  resize: none;
  min-height: 70px;
}

.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.row .input-group {
  flex: 1;
  min-width: 0;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 13px;
  color: #666;
}

.footer > div {
  display: flex;
  gap: 15px;
  align-items: center;
}

.footer button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
  min-width: 120px;
}

.btn-cancel {
  background: none;
  color: #666;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-create {
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  color: #fff;
}

.btn-create:hover:not(:disabled) {
  background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%);
}

.btn-create:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.alert {
  color: #d93025;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.3s;
}

.alert.hidden {
  opacity: 0;
}

/* Scrollbar styling */
.modal::-webkit-scrollbar {
  width: 6px;
}

.modal::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.modal::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 768px) {
  .modal {
    width: 95%;
    max-width: none;
    margin: 10px;
  }
  
  .row {
    flex-direction: column;
  }
  
  .footer {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .footer > div {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  
  .footer button {
    flex: 1;
  }
}
</style>